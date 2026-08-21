"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { COOKIE_MAX_AGE_SECONDS, ROLE_COOKIE, WALKTHROUGH_COOKIE } from "@/lib/cookies";
import type { Lang } from "@/lib/domain/lang";
import { roleInfo, type Role } from "@/lib/domain/role";
import {
  encodePosition,
  scoredScenarios,
  supportingScenarios,
  totalSteps,
  WALKTHROUGH,
  type WalkthroughPosition,
  type WalkthroughScenario,
} from "@/lib/domain/walkthrough";
import { dictionary } from "@/lib/i18n";
import { IconCheck, IconChevronDown, IconForward } from "./icons";
import { Badge, Button, Panel, Rationale, ReqTags } from "./primitives";

/** The same cookie the demo bar's role switcher writes. */
function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}

/**
 * The contents, before the content.
 *
 * The page was ten thousand characters and five thousand pixels with every
 * scenario fully expanded, so a reviewer landed in the middle of scenario one's
 * prose with no way to see that there were seven, which three are scored, or
 * how long any of them is. Seven rows fit on one screen; the document does not.
 */
function Contents({
  lang,
  openId,
  onOpen,
}: {
  lang: Lang;
  openId: string;
  onOpen: (id: string) => void;
}) {
  const t = dictionary(lang).walkthrough;

  return (
    <nav aria-label={t.contents} className="rounded-md border-2 border-border bg-card p-4">
      <h2 className="mi-kicker mb-3 text-muted-foreground">{t.contents}</h2>
      <ol className="space-y-1">
        {WALKTHROUGH.map((s, i) => {
          const current = s.id === openId;
          return (
            <li key={s.id}>
              <Button
                variant={current ? "primary" : "ghost"}
                size="sm"
                fullWidth
                pressed={current}
                onClick={() => onOpen(s.id)}
              >
                <span className="flex w-full min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-left">
                  <span className="tabular-nums">{i + 1}.</span>
                  <span className="min-w-0 flex-1">{s.title[lang]}</span>
                  <span className="shrink-0 font-normal">
                    {roleInfo(s.role, lang).label} · {t.stepCount(s.steps.length)}
                  </span>
                  {s.scored && <Badge tone="attention">{t.scoredMark}</Badge>}
                </span>
              </Button>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-label text-muted-foreground">
        {t.contentsNote(WALKTHROUGH.length, scoredScenarios().length, totalSteps())}
      </p>
    </nav>
  );
}

function Scenario({
  scenario,
  index,
  lang,
  currentRole,
  onGo,
}: {
  scenario: WalkthroughScenario;
  index: number;
  lang: Lang;
  /** So a step can say *when* the persona is about to change, rather than always. */
  currentRole: Role;
  onGo: (scenarioId: string, stepIndex: number) => void;
}) {
  const t = dictionary(lang).walkthrough;
  const role = roleInfo(scenario.role, lang);

  return (
    <Panel
      id={`scenario-${scenario.id}`}
      title={`${index}. ${scenario.title[lang]}`}
      action={
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={scenario.scored ? "attention" : "neutral"}>{role.label}</Badge>
          <Badge tone="neutral">{scenario.scenario}</Badge>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <h3 className="mi-kicker mb-1 text-muted-foreground">{t.taskAndGoal}</h3>
          <p className="max-w-4xl text-table">{scenario.taskAndGoal[lang]}</p>
        </div>

        <div>
          <h3 className="mi-kicker mb-2 text-muted-foreground">{t.workflow}</h3>
          {/*
            Start here, once, at the top. A reviewer who wants to walk the
            scenario rather than read it should not have to work out that the
            first of five identical buttons is the way in.
          */}
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <Button onClick={() => onGo(scenario.id, 0)} iconEnd={<IconForward />}>
              {t.startScenario}
            </Button>
            <span className="text-label text-muted-foreground">{t.startScenarioNote}</span>
          </div>

          <ol className="space-y-3">
            {scenario.steps.map((step, i) => {
              const changesRole = step.role !== currentRole;
              return (
                <li
                  key={`${step.href}-${i}`}
                  className="border-t border-border pt-3 first:border-t-0 first:pt-0"
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="mi-kicker text-muted-foreground">{t.step(i + 1)}</span>
                    <span className="font-semibold">{step.label[lang]}</span>
                  </div>
                  <p className="mt-1 max-w-4xl text-table">{step.detail[lang]}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    {/*
                      A button rather than a link, because it does three things:
                      sets the role, records the position so the demo strip can
                      carry the walk onward, and navigates.

                      The label names the step, not the role. Sixteen buttons all
                      reading "Öppna som Avtalsadministratör" told a reviewer
                      nothing about where they were about to land — and the role
                      is worth saying only when it is about to *change*, which is
                      the one case it is a warning rather than noise.
                    */}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onGo(scenario.id, i)}
                      iconEnd={<IconForward />}
                    >
                      {changesRole
                        ? t.openStepAs(i + 1, roleInfo(step.role, lang).label)
                        : t.openStep(i + 1)}
                    </Button>
                    <ReqTags ids={step.requirements} />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div>
          <h3 className="mi-kicker mb-1 text-muted-foreground">{t.usability}</h3>
          <p className="max-w-4xl text-table">{scenario.usability[lang]}</p>
        </div>
      </div>
    </Panel>
  );
}

/**
 * The reviewer's guided walkthrough — plan item 7, made usable.
 *
 * An evaluator opening the deployed URL cold landed on a start page with no
 * orientation, as the agreement administrator, with no indication of which of
 * the eight roles the criterion is marked on. That is what this page fixed. What
 * it did not fix, and now does, is that the page was **hard to walk**:
 *
 * - **Everything was expanded**: seven scenarios, ten thousand characters, five
 *   thousand pixels, no contents. A reviewer could not see the shape of what
 *   they had opened. One scenario is shown at a time now, under a contents list
 *   that fits on one screen.
 * - **Sixteen buttons carried the same label.** "Öppna som Avtalsadministratör"
 *   says nothing about where you are about to land. A step names itself, and
 *   names the role only when the persona is about to change.
 * - **It was a page you left.** Opening step 2 took you to `/registrera`, and
 *   the only route to step 3 was back here to find your place in the document.
 *   The position is written to a cookie now and the demo strip carries the way
 *   onward from whatever screen the reviewer is standing on.
 *
 * **It is reviewer material and is marked as such.** Like the demo bar, nothing
 * here is proposed MIIS functionality: no menu entry, the page states what it is
 * in its first sentence, and it carries the demo strip's own colour rather than
 * the product's. The onward control lives in that strip for the same reason — a
 * "walkthrough module" inside the product would work against the criterion the
 * guide exists to serve.
 */
export function WalkthroughGuide({
  lang,
  currentRole,
  position,
}: {
  lang: Lang;
  currentRole: Role;
  /** Where the reviewer left off, so returning lands on the right scenario. */
  position?: WalkthroughPosition | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const t = dictionary(lang).walkthrough;

  const scored = scoredScenarios();
  const supporting = supportingScenarios();
  const [openId, setOpenId] = useState(position?.scenarioId ?? scored[0]!.id);
  const [showSupporting, setShowSupporting] = useState(
    supporting.some((s) => s.id === position?.scenarioId),
  );

  function go(scenarioId: string, stepIndex: number) {
    const scenario = WALKTHROUGH.find((s) => s.id === scenarioId);
    const step = scenario?.steps[stepIndex];
    if (!step) return;
    setCookie(ROLE_COOKIE, step.role);
    setCookie(WALKTHROUGH_COOKIE, encodePosition({ scenarioId, stepIndex }));
    startTransition(() => router.push(step.href));
  }

  function open(id: string) {
    setOpenId(id);
    if (supporting.some((s) => s.id === id)) setShowSupporting(true);
  }

  const openIndex = WALKTHROUGH.findIndex((s) => s.id === openId);
  const openScenario = WALKTHROUGH[openIndex]!;

  return (
    <div aria-busy={pending} className="space-y-6">
      <Contents lang={lang} openId={openId} onOpen={open} />

      <section aria-live="polite">
        <h2 className="font-display text-section font-semibold">
          {openScenario.scored ? t.scoredHeading : t.supportingHeading}
        </h2>
        <p className="mt-1 max-w-4xl text-table">
          {openScenario.scored ? t.scoredLead : t.supportingLead}
        </p>
        <div className="mt-4">
          <Scenario
            scenario={openScenario}
            index={openIndex + 1}
            lang={lang}
            currentRole={currentRole}
            onGo={go}
          />
        </div>
      </section>

      {/*
        The four unscored scenarios stay, and stay out of the way. They are
        evidence that the system is complete rather than the opening, so they
        are one click from the contents rather than four screens below it.
      */}
      <section>
        <Button
          variant="ghost"
          onClick={() => setShowSupporting((v) => !v)}
          pressed={showSupporting}
          iconEnd={<IconChevronDown />}
        >
          {showSupporting ? t.hideSupporting : t.showSupporting(supporting.length)}
        </Button>
        {showSupporting && (
          <ul className="mt-3 space-y-2">
            {supporting.map((s) => (
              <li key={s.id}>
                <Button
                  variant={s.id === openId ? "primary" : "secondary"}
                  size="sm"
                  fullWidth
                  onClick={() => setOpenId(s.id)}
                >
                  <span className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 text-left">
                    {s.id === openId && <IconCheck size="sm" />}
                    <span className="min-w-0 flex-1">{s.title[lang]}</span>
                    <span className="shrink-0 font-normal">{roleInfo(s.role, lang).label}</span>
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Rationale>{t.roleNote(roleInfo(currentRole, lang).label)}</Rationale>
    </div>
  );
}
