"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { COOKIE_MAX_AGE_SECONDS, ROLE_COOKIE } from "@/lib/cookies";
import type { Lang } from "@/lib/domain/lang";
import { roleInfo, type Role } from "@/lib/domain/role";
import {
  scoredScenarios,
  supportingScenarios,
  type WalkthroughScenario,
} from "@/lib/domain/walkthrough";
import { dictionary } from "@/lib/i18n";
import { IconForward } from "./icons";
import { Badge, Button, Panel, ReqTags } from "./primitives";

/** The same cookie the demo bar's role switcher writes. */
function setRoleCookie(role: Role) {
  document.cookie = `${ROLE_COOKIE}=${role}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}

function Scenario({
  scenario,
  index,
  lang,
  onGo,
}: {
  scenario: WalkthroughScenario;
  index: number;
  lang: Lang;
  onGo: (role: Role, href: string) => void;
}) {
  const t = dictionary(lang).walkthrough;
  const role = roleInfo(scenario.role, lang);

  return (
    <Panel
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
          <ol className="space-y-3">
            {scenario.steps.map((step, i) => (
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
                      A button rather than a link, because it does two things:
                      sets the role and navigates. The label names the role, so a
                      reviewer knows the persona is about to change — and so does
                      anyone reading over their shoulder in the presentation.
                    */}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onGo(step.role, step.href)}
                    iconEnd={<IconForward />}
                  >
                    {t.openAs(roleInfo(step.role, lang).label)}
                  </Button>
                  <ReqTags ids={step.requirements} />
                </div>
              </li>
            ))}
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
 * The reviewer's guided walkthrough — plan item 7.
 *
 * An evaluator opening the deployed URL cold landed on a start page with no
 * orientation, as the agreement administrator, with no indication of which of
 * the eight roles the criterion is actually marked on. And the demo led with two
 * scenarios — the mediation case and the search builder — that belong to roles
 * the criterion does not name.
 *
 * So: the three scored roles first, each with the four elements the criterion
 * asks for, and every step a control that **switches to the role and opens the
 * screen**. Switching is the point rather than a convenience — "the role decides
 * what you see" is the claim, and a link that left the reviewer as the wrong
 * persona would show them the authorisation notice instead of the screen.
 *
 * **It is reviewer material and is marked as such.** Like the demo bar, nothing
 * here is proposed MIIS functionality: there is no menu entry, the page states
 * what it is in its first sentence, and it carries the demo strip's own colour
 * rather than the product's. An evaluator has to be able to tell the guide from
 * the system in one glance.
 */
export function WalkthroughGuide({ lang, currentRole }: { lang: Lang; currentRole: Role }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const t = dictionary(lang).walkthrough;

  function go(role: Role, href: string) {
    setRoleCookie(role);
    startTransition(() => router.push(href));
  }

  const scored = scoredScenarios();
  const supporting = supportingScenarios();

  return (
    <div aria-busy={pending}>
      <section>
        <h2 className="font-display text-section font-semibold">{t.scoredHeading}</h2>
        <p className="mt-1 max-w-4xl text-table">{t.scoredLead}</p>
        <div className="mt-4 space-y-5">
          {scored.map((s, i) => (
            <Scenario key={s.id} scenario={s} index={i + 1} lang={lang} onGo={go} />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-section font-semibold">{t.supportingHeading}</h2>
        <p className="mt-1 max-w-4xl text-table">{t.supportingLead}</p>
        <div className="mt-4 space-y-5">
          {supporting.map((s, i) => (
            <Scenario key={s.id} scenario={s} index={scored.length + i + 1} lang={lang} onGo={go} />
          ))}
        </div>
      </section>

      <p className="mt-8 text-label text-muted-foreground">
        {t.roleNote(roleInfo(currentRole, lang).label)}
      </p>
    </div>
  );
}
