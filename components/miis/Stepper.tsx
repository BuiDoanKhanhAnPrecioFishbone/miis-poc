"use client";

import type { Lang } from "@/lib/domain/lang";
import { IconCheck } from "./icons";
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
  selected,
  lang,
  sticky = true,
}: {
  label: string;
  steps: Step[];
  /**
   * How far the process has got — done, current, upcoming. **Progress only.**
   * Which step is being *looked at* is `selected`, and the two are different
   * facts: on the party meeting a held meeting's *Inför* is done, and clicking
   * back to it does not un-finish it.
   */
  states: StepState[];
  /**
   * The step currently shown, when that can differ from the current step.
   *
   * Without it the call site had to collapse the two into one enum, and
   * `p === phase ? "current" : …` is what made a completed step lose its tick
   * the moment the officer clicked back to it — the screen said the work had
   * come undone. Defaults to whichever step is `current`.
   */
  selected?: number;
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
        const isSelected = selected === undefined ? state === "current" : selected === i;
        /* Selection decides the fill; progress decides the tick. A done step
           that is being looked at is both, and shows both. */
        const look = isSelected ? STYLE.current : STYLE[state];
        const content = (
          <>
            {state === "done" && <IconCheck size="sm" />}
            {step.label}
            {/* The state is never carried by colour alone. */}
            <span className="sr-only">— {d.registrera.stepState[state]}</span>
          </>
        );
        /*
          A step that has not been reached is not a destination.

          The registration flow's five steps each carry an anchor into the
          section that performs them — and four of those sections do not exist
          until a protocol has been uploaded. So on the upload screen, steps
          two to five rendered as links, labelled *Återstår*, pointing at ids
          nothing had created yet: four dead links on the first screen of the
          scored scenario, and a reader who pressed one stayed exactly where
          they were with no explanation.

          An upcoming step is text. It keeps its number, its label and its
          state word — what it loses is the promise that pressing it does
          something.
        */
        const reachable = state !== "upcoming";
        return (
          <li key={step.label}>
            {step.href && reachable ? (
              <a
                href={step.href}
                aria-current={isSelected ? "step" : undefined}
                className={`${SHARED} ${look}`}
              >
                {content}
              </a>
            ) : step.href ? (
              <span aria-current={isSelected ? "step" : undefined} className={`${SHARED} ${look}`}>
                {content}
              </span>
            ) : (
              <button
                type="button"
                onClick={step.onSelect}
                aria-current={isSelected ? "step" : undefined}
                className={`${SHARED} ${look}`}
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
