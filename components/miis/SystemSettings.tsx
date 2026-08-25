"use client";


import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { COOKIE_MAX_AGE_SECONDS, SESSION_TIMEOUT_COOKIE } from "@/lib/cookies";
import type { Lang } from "@/lib/domain/lang";
import {
  checkSessionTimeout,
  LOG_RETENTION_MIN_MONTHS,
  SESSION_TIMEOUT,
  SYSTEM_SETTINGS,
} from "@/lib/domain/settings";
import { dictionary } from "@/lib/i18n";
import { IconCheck, IconLock } from "./icons";
import { Badge, Button, Callout, FormGrid, Panel, Rationale, ReqTags, TextField } from "./primitives";

/**
 * System configuration — US-13's second half, and §3.1's own verb for this role:
 * *"Full åtkomst inkl. systemkonfiguration (exkl. behörigheter)."*
 *
 * The role had two logs, a support table and a retention statement, and nothing
 * that was a *setting*. US-13's goal names the missing half — *"the system's
 * configurable parts – such as the watchword table – are kept current"* — and
 * "such as" says there is more than one.
 *
 * **Two of the four are deliberately fixed, and that is the strongest thing on
 * the panel.** A system administrator screen with four editable boxes says we
 * built a settings form. This one says we read the sentences:
 *
 * - **Log retention** is NFL-003, which names this role in the prohibition:
 *   *"ska inte kunna ändras eller raderas av vanliga användare **eller
 *   systemadministratörer**"*. So it is shown with its floor and a padlock, and
 *   the reason is on the row.
 * - **The public IP restriction** is NFÅ-006 and lives in Försäkringskassan's
 *   operation of the environment. A field here would imply MIIS could open
 *   itself up.
 *
 * **The session limit is genuinely configurable, end to end.** NFÅ-002 calls it
 * *konfigurerbar*, so a value set here has to reach the behaviour on every other
 * screen or the setting only looks like one: it is written as a cookie, read by
 * `getSession`, and applied by `SessionTimeoutWarning` — set it to five minutes
 * and the warning arrives at three. The ceiling is thirty, because raising the
 * limit would weaken the requirement rather than configure it.
 */
export function SystemSettings({
  lang,
  timeoutMinutes,
  watchwordCount,
}: {
  lang: Lang;
  timeoutMinutes: number;
  /** For the watchword row, which links to the table rather than repeating it. */
  watchwordCount: number;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const d = dictionary(lang);
  const t = d.administration.settings;

  const [draft, setDraft] = useState(String(timeoutMinutes));
  const [saved, setSaved] = useState<number | null>(null);

  const parsed = Number(draft);
  const problem = checkSessionTimeout(parsed);
  const unchanged = parsed === timeoutMinutes;

  function save() {
    if (problem) return;
    document.cookie = `${SESSION_TIMEOUT_COOKIE}=${parsed};path=/;max-age=${COOKIE_MAX_AGE_SECONDS};samesite=lax`;
    setSaved(parsed);
    /*
      The value is read on the server by `getSession`, so the page has to be
      asked again — otherwise the start page would go on stating the old limit
      until something else happened to navigate.
    */
    startTransition(() => router.refresh());
  }

  const setting = (id: string) => SYSTEM_SETTINGS.find((s) => s.id === id)!;
  const timeout = setting("session-timeout");
  const retention = setting("log-retention");
  const publicIp = setting("public-ip");
  const watchwords = setting("watchwords");

  return (
    <Panel title={t.heading} tags={["NFÅ-002", "NFL-003", "NFÅ-006", "FAI-004"]}>
      <p className="mb-5 max-w-4xl text-table">{t.intro}</p>

      {saved !== null && (
        <div className="mb-5">
          <Callout tone="ok" live tags={["NFÅ-002", "FH-001"]}>
            {t.savedNote(saved)}
          </Callout>
        </div>
      )}

      {/* NFÅ-002 — the one MI calls configurable, and it genuinely is. */}
      <section className="border-t border-border pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-section font-semibold">{timeout.label[lang]}</h3>
          <Badge tone="ok">{t.editable}</Badge>
          <ReqTags ids={timeout.requirements} />
        </div>
        <p className="mt-1 max-w-3xl text-table">{timeout.description[lang]}</p>

        <div className="mt-4">
          <FormGrid>
            <TextField
              id="set-timeout"
              label={t.timeoutLabel}
              width="short"
              numeric
              value={draft}
              onChange={(v) => {
                setDraft(v);
                setSaved(null);
              }}
              hint={t.timeoutHint(SESSION_TIMEOUT.minMinutes, SESSION_TIMEOUT.maxMinutes)}
            />
          </FormGrid>
        </div>

        {problem && (
          <div className="mt-3 max-w-3xl">
            <Callout tone="attention" label={t.notAllowed}>
              {problem.kind === "too-high"
                ? t.tooHigh(SESSION_TIMEOUT.maxMinutes)
                : problem.kind === "too-low"
                  ? t.tooLow(SESSION_TIMEOUT.minMinutes)
                  : t.notWhole}
            </Callout>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            onClick={save}
            disabled={Boolean(problem) || unchanged}
            disabledReason={problem ? t.notAllowed : t.unchanged}
            iconStart={<IconCheck />}
          >
            {t.save}
          </Button>
          <span className="text-label text-muted-foreground">{t.effectNote}</span>
        </div>
      </section>

      {/* FAI-004 — the example US-13 names. This is the row; the table it
          describes is a tab of its own, and the link opens it. */}
      <section className="mt-6 border-t border-border pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-section font-semibold">{watchwords.label[lang]}</h3>
          <Badge tone="ok">{t.editable}</Badge>
          <ReqTags ids={watchwords.requirements} />
        </div>
        <p className="mt-1 max-w-3xl text-table">{watchwords.description[lang]}</p>
        <p className="mt-2 text-label text-muted-foreground">{t.watchwordCount(watchwordCount)}</p>
        <div className="mt-2">
          {/*
            A plain anchor, not `Link`. The target is a section of the screen
            the reader is already on, and Next's soft navigation changes the
            hash without firing `hashchange` — so the tab never opened. A
            same-page anchor is also the honest element: nothing is being
            navigated to.
          */}
          <a
            href="#bevakningsord"
            className="inline-flex min-h-11 items-center gap-1 text-label font-semibold text-primary underline underline-offset-2"
          >
            {t.openWatchwords}
          </a>
        </div>
      </section>

      {/*
        The two the requirements keep out of this role's hands. A padlock and a
        stated reason, not a greyed-out box: a disabled field invites the reader
        to wonder whether it is unfinished.
      */}
      {[retention, publicIp].map((s) => (
        <section key={s.id} className="mt-6 border-t border-border pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-section font-semibold">{s.label[lang]}</h3>
            <Badge tone="neutral">{t.fixed}</Badge>
            <ReqTags ids={s.requirements} />
          </div>
          <p className="mt-1 max-w-3xl text-table">{s.description[lang]}</p>
          <p className="mt-2 flex items-start gap-2 text-table font-semibold">
            <span className="flex h-6 shrink-0 items-center">
              <IconLock size="md" />
            </span>
            <span className="min-w-0">
              {s.id === "log-retention" ? t.retentionValue(LOG_RETENTION_MIN_MONTHS) : t.publicIpValue}
            </span>
          </p>
          <p className="mt-2 max-w-3xl text-label text-muted-foreground">{s.fixedReason?.[lang]}</p>
        </section>
      ))}

      <Rationale>{t.logNote}</Rationale>
    </Panel>
  );
}
