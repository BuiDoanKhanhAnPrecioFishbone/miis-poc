/**
 * Reports — Epic F6.
 *
 * The Short-Term Wage Report (Konjunkturlönerapporten, FR-008) is the most
 * precisely specified unbuilt screen in the requirement document, and building
 * it as a reports hub covers FR-005, FR-006, FR-007 and FR-014 alongside it —
 * all three reports MI itself calls prioritised — plus FA-021, FA-022 and the
 * whole e-mail epic FE-001–003 through the reminder and scheduling flow.
 *
 * FR-008 names three things the view must do, and they are the three that shape
 * this model: a status column that distinguishes *registered* from *partially
 * registered*, a link to the protocol **even when registration is incomplete**,
 * and a record of which agreements have already been exported.
 *
 * Identifiers are English; user-facing strings exist in both languages.
 * Pure domain — no imports beyond sibling types, no I/O.
 */

import type { Agreement } from "./agreement";
import type { Lang } from "./lang";

/**
 * FR-008's status column. Three states, not two: "partially registered" is the
 * case the requirement singles out, because those are exactly the agreements
 * that must still reach the report.
 */
export type ExtractStatus = "registered" | "partial" | "not-registered";

export interface MonitoredAgreementRow {
  id: string;
  name: string;
  parties: string;
  status: ExtractStatus;
  /**
   * FR-008 — present whenever a protocol has arrived, including for a
   * registration that is not finished. Reading the source must not depend on
   * having completed the paperwork about it.
   */
  protocolFile?: string;
  /** The date this agreement last went into the report, if it has. */
  lastExported?: string;
  /** FA-022 — a reminder already set on this agreement. */
  reminderDate?: string;
  confidential: boolean;
}

/**
 * A registration is *registered* when it is marked complete and the agreement
 * has been signed; *partially registered* when one of those two is true; and
 * *not registered* when neither is.
 */
export function extractStatus(a: Agreement): ExtractStatus {
  const complete = a.registrationStatus === "complete";
  const signed = Boolean(a.signedDate);
  if (complete && signed) return "registered";
  if (complete || signed) return "partial";
  return "not-registered";
}

export function extractStatusLabel(status: ExtractStatus, labels: Record<ExtractStatus, string>) {
  return labels[status];
}

/** One row of the Agreement Constructions report (FR-007). */
export interface ConstructionCount {
  construction: number;
  label: string;
  count: number;
  /** Whole percent of the counted wage agreements. */
  sharePercent: number;
}

export function constructionCounts(
  constructions: readonly number[],
  labels: Record<number, string>,
  lang: Lang,
): ConstructionCount[] {
  void lang;
  const total = constructions.length;
  const tally = new Map<number, number>();
  for (const c of constructions) tally.set(c, (tally.get(c) ?? 0) + 1);

  return [...tally.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([construction, count]) => ({
      construction,
      label: labels[construction] ?? String(construction),
      count,
      sharePercent: total === 0 ? 0 : Math.round((count / total) * 100),
    }));
}
