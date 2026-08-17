/**
 * Data access for agreements — THE SEAM.
 *
 * Week 1 these read from lib/mock/. Week 2 the bodies talk to Supabase and no
 * page changes. This is the only layer that may import a database client.
 *
 * Table rows are DERIVED from the records here, never hand-written, so adding
 * an agreement to lib/mock/agreements.ts makes it appear everywhere at once.
 */

import {
  agreementTitle,
  partiesLabel,
  validityLabel,
  type Agreement,
  type AgreementRow,
  type RegistrationStatus,
} from "@/lib/domain/agreement";
import { DEFAULT_LANG, type Lang } from "@/lib/domain/lang";
import { agreementStatus } from "@/lib/domain/status";
import { getDataset } from "@/lib/mock";
import { activeDataset } from "@/lib/session";

export interface AgreementFilter {
  agreementArea?: string;
  registrationStatus?: RegistrationStatus;
  employerOrgId?: string;
  employeeOrgId?: string;
}

async function agreements(): Promise<Agreement[]> {
  return getDataset(await activeDataset()).agreements;
}

/** The read model every agreement table uses. */
export function toRow(a: Agreement, lang: Lang = DEFAULT_LANG): AgreementRow {
  const row: AgreementRow = {
    id: a.id,
    name: agreementTitle(a),
    parties: partiesLabel(a),
    validity: validityLabel(a, lang),
    registrationStatus: a.registrationStatus,
    status: agreementStatus(a, lang).code,
    confidential: a.confidential,
  };
  if (a.signedDate) row.signedDate = a.signedDate;
  return row;
}

export async function listAgreements(filter?: AgreementFilter): Promise<Agreement[]> {
  let rows = await agreements();
  if (filter?.agreementArea) rows = rows.filter((a) => a.agreementArea === filter.agreementArea);
  if (filter?.registrationStatus) {
    rows = rows.filter((a) => a.registrationStatus === filter.registrationStatus);
  }
  if (filter?.employerOrgId) rows = rows.filter((a) => a.employerOrg.id === filter.employerOrgId);
  if (filter?.employeeOrgId) rows = rows.filter((a) => a.employeeOrg.id === filter.employeeOrgId);
  return rows;
}

/**
 * @param at FH-003 / FA-020 – reconstruct the agreement as it was valid at a
 * given point in time. Ignored while data is mocked; the parameter exists from
 * day one so the snapshot feature does not require touching every caller.
 */
export async function getAgreement(id: string, at?: string): Promise<Agreement | null> {
  void at;
  return (await agreements()).find((a) => a.id === id) ?? null;
}

/** Most recently registered first — the start page table. */
export async function listRecentAgreements(
  lang: Lang = DEFAULT_LANG,
  count = 4,
): Promise<AgreementRow[]> {
  return (await agreements())
    .slice()
    .sort((a, b) => (b.registeredAt ?? "").localeCompare(a.registeredAt ?? ""))
    .slice(0, count)
    .map((a) => toRow(a, lang));
}

/** FA-021 – agreements saved with registration status Incomplete. */
export async function listIncompleteAgreements(): Promise<Agreement[]> {
  return (await agreements()).filter((a) => a.registrationStatus === "incomplete");
}

export async function countAgreements(): Promise<number> {
  return (await agreements()).length;
}
