/**
 * FS-001 – the role-adapted start page.
 *
 * One rendering path, different content per role. Adding a role means adding
 * panels in lib/data/dashboard.ts, not writing a new screen.
 *
 * Everything here is already resolved into the active language: the data layer
 * reads the dictionary once and the screen renders strings. That keeps the page
 * a plain server component with no translation logic in it.
 *
 * Identifiers are English; user-facing strings exist in both languages.
 * Pure domain — no imports beyond sibling types, no I/O.
 */

import type { AgreementRow } from "./agreement";
import type { Benchmark } from "./benchmark";
import type { RoleInfo } from "./role";

export interface PanelAction {
  text: string;
  href?: string;
  reqTag?: string;
}

/**
 * Two kinds of prose, deliberately separated at the model rather than guessed
 * at in the view:
 *
 * - `note` is **operational** — a user needs it to do the task correctly, so it
 *   is always on screen.
 * - `rationale` **explains or justifies** the design to an evaluator. It rides
 *   the requirement-tag toggle and is absent from the product view.
 *
 * If you cannot decide which one a sentence is, it is a rationale.
 */
/**
 * How many rows a start-page panel shows — FS-001.
 *
 * Three, everywhere, and the number is a rule rather than a preference. The
 * start page is a place to notice things, not to work through them: its job is
 * to say *whether* there is something waiting and let the officer leave for the
 * register that owns it. Panels were showing three, three, four and five, which
 * made the page read as four lists of arbitrary length and gave the eye no
 * rhythm to scan down.
 *
 * A panel that has more than it shows says so — the count is on the way out, so
 * "three of sixty-four" is legible and the remaining sixty-one are one click
 * away rather than hidden.
 */
export const START_PAGE_ROWS = 3;

export interface PanelProse {
  /**
   * A plain sentence the reader needs in order to know what the panel is.
   * Not a `Rationale`: those ride the requirement-ID switch and are off by
   * default, which is how "Open the Short-Term Wage Report" came to sit in a
   * panel about incomplete registrations with nothing on screen connecting
   * the two.
   */
  lead?: string;
  /**
   * How many rows exist in total, when the panel shows fewer. Rendered as
   * "showing 3 of 12" — the second half of the three-row rule: a panel that
   * truncates has to say so, or three of sixty-four is indistinguishable from
   * three of three.
   */
  total?: number;
  note?: string;
  rationale?: string;
}

/** A reminder or event line, already rendered into one language. */
export interface LogLine {
  id: string;
  /** Date or timestamp — ISO in both languages. */
  when: string;
  text: string;
  /** The agreement the event concerns, so the line can be a way in to it. */
  agreementId?: string;
}

export type DashboardPanel =
  | {
      kind: "list";
      title: string;
      reqTags?: string[];
      items: { text: string; badge?: string }[];
      emptyText?: string;
      action?: PanelAction;
    } & PanelProse
  | {
      kind: "log";
      title: string;
      reqTags?: string[];
      items: LogLine[];
      emptyText?: string;
      action?: PanelAction;
    } & PanelProse
  | {
      kind: "agreement-table";
      title: string;
      reqTags?: string[];
      rows: AgreementRow[];
      emptyText?: string;
    } & PanelProse;

export interface Dashboard {
  role: RoleInfo;
  heading: string;
  subheading: string;
  primaryAction?: { text: string; href: string };
  /**
   * Up to two more actions, and no more.
   *
   * A role's start page should offer the things it does *daily*, taken from its
   * own scenarios rather than from the menu — an agreement administrator
   * registers protocols (US-01) and parties (US-03); a mediation administrator
   * registers GD decisions (US-07) and party meetings (US-08). One action for a
   * role with three daily tasks makes the page a dashboard to read rather than
   * a place to start work from.
   *
   * Two is the cap. A row of six is a second navigation, and the menu is
   * already the navigation.
   */
  secondaryActions?: { text: string; href: string }[];
  /** FM-003 – benchmark shown wherever relevant. */
  benchmark?: Benchmark;
  panels: DashboardPanel[];
}

/** Panels laid out two-up above the full-width ones. */
export function isHalfWidth(panel: DashboardPanel): boolean {
  return panel.kind !== "agreement-table";
}
