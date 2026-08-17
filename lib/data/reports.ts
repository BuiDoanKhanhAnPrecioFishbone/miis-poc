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
import { extractStatus, type MonitoredAgreementRow } from "@/lib/domain/report";
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
