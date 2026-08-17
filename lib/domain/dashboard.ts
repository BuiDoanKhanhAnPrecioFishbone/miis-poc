/**
 * FS-001 – the role-adapted start page.
 *
 * One rendering path, different content per role. Adding a role means adding
 * panels in lib/data/dashboard.ts, not writing a new screen.
 *
 * Identifiers are English; every user-facing string is Swedish.
 * Pure domain — no imports beyond sibling types, no I/O.
 */

import type { AgreementRow } from "./agreement";
import type { AuditEvent, Reminder } from "./event";
import type { Benchmark } from "./benchmark";
import type { RoleInfo } from "./role";

export interface PanelAction {
  /** Swedish button text. */
  text: string;
  href?: string;
  reqTag?: string;
}

export type DashboardPanel =
  | {
      kind: "list";
      title: string;
      reqTags?: string[];
      items: { text: string; badge?: string }[];
      /** Swedish message when items is empty. */
      emptyText?: string;
      footnote?: string;
      action?: PanelAction;
    }
  | {
      kind: "reminders";
      title: string;
      reqTags?: string[];
      items: Reminder[];
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
    }
  | {
      kind: "events";
      title: string;
      reqTags?: string[];
      items: AuditEvent[];
      emptyText?: string;
      footnote?: string;
    };

export interface Dashboard {
  role: RoleInfo;
  /** Swedish page heading. */
  heading: string;
  subheading: string;
  primaryAction?: { text: string; href: string };
  /** FM-003 – benchmark shown wherever relevant. */
  benchmark?: Benchmark;
  panels: DashboardPanel[];
  aiIntro: string;
  aiSuggestions: string[];
}

/** Panels laid out two-up above the full-width ones. */
export function isHalfWidth(panel: DashboardPanel): boolean {
  return panel.kind === "list" || panel.kind === "reminders";
}
