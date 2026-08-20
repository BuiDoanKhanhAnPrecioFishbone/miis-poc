/**
 * Data access for reports — THE SEAM.
 *
 * Rows are derived from the agreement records, so an agreement added to
 * lib/mock/agreements.ts turns up in the Short-Term Wage Report without a
 * second list to maintain — and the protocol link, the reminder and the export
 * history come from the records that already hold them.
 */

import { partiesLabel, type WageAgreement } from "@/lib/domain/agreement";
import { DEFAULT_LANG, type Lang } from "@/lib/domain/lang";
import {
  bargainingRoundReport,
  extractStatus,
  type BargainingRoundReport,
  type MonitoredAgreementRow,
} from "@/lib/domain/report";
import { agreementStatus } from "@/lib/domain/status";
import { getDataset } from "@/lib/mock";
import { activeDataset } from "@/lib/session";

/** The extract the report is being prepared for. */
export const EXTRACT_PERIOD_END = "2027-08-31";

/** When the report was last printed — used to decide what is already delivered. */
export const LAST_EXPORT_DATE = "2027-05-31";

/**
 * FR-008 – the agreements monitored for the Short-Term Wage Report.
 *
 * Selection follows the agreement's own report selection (§4.2), so which
 * agreements appear is a property of the agreement rather than of this screen.
 */
export async function listMonitoredAgreements(
  lang: Lang = DEFAULT_LANG,
): Promise<MonitoredAgreementRow[]> {
  void lang;
  const data = getDataset(await activeDataset());
  const reminderByAgreement = new Map(
    data.reminders.flatMap((r) => (r.agreementId ? [[r.agreementId, r.date] as const] : [])),
  );
  const protocolByAgreement = new Map(
    data.documents.flatMap((d) =>
      d.agreementId && d.type === "protocol" ? [[d.agreementId, d.fileName] as const] : [],
    ),
  );

  return data.agreements
    .filter((a) => a.reportSelection.shortTermWageReport)
    .map((a) => {
      const status = extractStatus(a);
      const reminder = reminderByAgreement.get(a.id);
      const protocolFile = protocolByAgreement.get(a.id);

      const row: MonitoredAgreementRow = {
        id: a.id,
        name: a.name,
        parties: partiesLabel(a),
        status,
        confidential: a.confidential,
      };

      if (protocolFile) row.protocolFile = protocolFile;
      if (reminder) row.reminderDate = reminder;
      // Already delivered if it was fully registered before the last print run.
      if (status === "registered" && (a.registeredAt ?? "") <= LAST_EXPORT_DATE) {
        row.lastExported = LAST_EXPORT_DATE;
      }
      return row;
    });
}

export async function listWageAgreements(): Promise<WageAgreement[]> {
  return getDataset(await activeDataset()).wageAgreements;
}

/** FR-007 – the constructions actually registered, for the distribution report. */
export async function listRegisteredConstructions(): Promise<number[]> {
  return (await listWageAgreements()).map((w) => w.construction);
}

/**
 * Avtalsrörelserapporten — FR-006, and Bilaga F's Rapport 3.
 *
 * Derived from the register rather than transcribed, which is the opposite
 * choice from Avtalskonstruktioner and for a stated reason: MI's construction
 * report counts the whole Swedish labour market, so it could never come out of
 * a sample; the bargaining-round report counts *the agreements MI holds*, which
 * is precisely what the register is.
 */
export async function getBargainingRoundReport(year: number): Promise<BargainingRoundReport> {
  const data = getDataset(await activeDataset());
  return bargainingRoundReport(data.agreements, year, (a) => agreementStatus(a));
}

/**
 * The years the register has expiries in, newest first — the report's Årtal
 * list — and the year the report should open on.
 *
 * The busiest year, not the newest. A bargaining round *is* the year most
 * agreements fall due in, and opening the report on 2029 because one agreement
 * runs that far produced twelve rows of zeros with a selection screen above
 * them, which reads as a broken report rather than as an empty year.
 */
export async function listBargainingYears(): Promise<{ years: number[]; busiest: number }> {
  const data = getDataset(await activeDataset());
  const counts = new Map<number, number>();
  for (const a of data.agreements) {
    if (!a.validTo) continue;
    const year = Number(a.validTo.slice(0, 4));
    counts.set(year, (counts.get(year) ?? 0) + 1);
  }
  const years = [...counts.keys()].sort((a, b) => b - a);
  const busiest = [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0])[0]?.[0];
  return { years, busiest: busiest ?? years[0] ?? 0 };
}
