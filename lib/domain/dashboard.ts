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
      footnote?: string;
      action?: PanelAction;
    }
  | {
      kind: "log";
      title: string;
      reqTags?: string[];
      items: LogLine[];
      emptyText?: string;
      footnote?: string;
      action?: PanelAction;
    }
  | {
      kind: "agreement-table";
      title: string;
      reqTags?: string[];
      rows: AgreementRow[];
      emptyText?: string;
    };

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
