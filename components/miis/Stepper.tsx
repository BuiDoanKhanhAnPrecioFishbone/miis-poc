"use client";

import type { Lang } from "@/lib/domain/lang";
import { dictionary } from "@/lib/i18n";

/**
 * One stepper, two screens.
 *
 * A stepper is the right form when the parts are **stages of one process, in
 * order, with a position** — some done, one current, the rest ahead. Tabs are
 * the right form when the parts are **peers**: the Text and Original views of a
 * protocol are the same document seen two ways, and neither precedes the other.
 *
 * That test settles the party meeting. *Inför · Under mötet · Efter* are not
 * peers — a meeting is prepared, then held, then completed, and `phaseState()`
 * already derives done/current/upcoming from where the meeting has got to. It
 * had been built as tabs, which said the three were interchangeable views of
 * the same thing. They are not, and this is the same component `/registrera`
 * uses for MI's five registration steps.
 *
 * Navigable in both cases. On `/registrera` a step is an anchor into a long
 * page; here it swaps the panel. Neither is a wizard that locks you forward —
 * US-08 is explicit that a party meeting's registration "can be updated both
 * before and after the meeting", and US-01's flows are non-linear too.
 */

export type StepState = "done" | "current" | "upcoming";

export interface Step {
  label: string;
  /** An anchor into the current page, for a stepper over one long form. */
  href?: string;
  /** Or a handler, for a stepper that swaps what is shown. */
  onSelect?: () => void;
}

const STYLE: Record<StepState, string> = {
  done: "border-ok-border bg-ok text-ok-foreground",
  current: "border-transparent bg-primary font-bold text-primary-foreground",
  /* `input`, not `border`: this is a control's own edge, so WCAG 1.4.11 puts a
     3:1 floor on it. Slate-300 measured 1.51:1 against the step's fill. */
  upcoming: "border-input bg-secondary text-muted-foreground",
};

const SHARED =
  "inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-5 py-2 text-label font-semibold transition-colors hover:brightness-95";

export function Stepper({
  label,
  steps,
  states,
  lang,
  sticky = true,
}: {
  label: string;
  steps: Step[];
  states: StepState[];
  lang: Lang;
  /**
   * Pinned by default. A stepper that scrolls away can report a position but
   * cannot be used to move, which is the one thing it is for once the officer
   * is past the top of the page.
   */
  sticky?: boolean;
}) {
  const d = dictionary(lang);
  return (
    <ol
      aria-label={label}
      className={`mb-6 flex flex-wrap gap-3 ${
        sticky
          ? "sticky top-0 z-20 -mx-5 border-b border-border bg-background px-5 py-3 sm:-mx-8 sm:px-8 xl:-mx-10 xl:px-10"
          : ""
      }`}
    >
      {steps.map((step, i) => {
        const state = states[i] ?? "upcoming";
        const content = (
          <>
            {state === "done" && <span aria-hidden>✓</span>}
            {step.label}
            {/* The state is never carried by colour alone. */}
            <span className="sr-only">— {d.registrera.stepState[state]}</span>
          </>
        );
        return (
          <li key={step.label}>
            {step.href ? (
              <a
                href={step.href}
                aria-current={state === "current" ? "step" : undefined}
                className={`${SHARED} ${STYLE[state]}`}
              >
                {content}
              </a>
            ) : (
              <button
                type="button"
                onClick={step.onSelect}
                aria-current={state === "current" ? "step" : undefined}
                className={`${SHARED} ${STYLE[state]}`}
              >
                {content}
              </button>
            )}
          </li>
        );
      })}
    </ol>
  );
}
