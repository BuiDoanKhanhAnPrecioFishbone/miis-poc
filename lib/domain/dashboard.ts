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
export interface PanelProse {
  /**
   * A plain sentence the reader needs in order to know what the panel is.
   * Not a `Rationale`: those ride the requirement-ID switch and are off by
   * default, which is how "Open the Short-Term Wage Report" came to sit in a
   * panel about incomplete registrations with nothing on screen connecting
   * the two.
   */
  lead?: string;
  note?: string;
  rationale?: string;
}

/** A reminder or event line, already rendered into one language. */
export interface LogLine {
  id: string;
  /** Date or timestamp — ISO in both languages. */
  when: string;
  text: string;
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
  /** FM-003 – benchmark shown wherever relevant. */
  benchmark?: Benchmark;
  panels: DashboardPanel[];
}

/** Panels laid out two-up above the full-width ones. */
export function isHalfWidth(panel: DashboardPanel): boolean {
  return panel.kind !== "agreement-table";
}
