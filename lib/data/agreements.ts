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
  type SpecialQuestions,
  type WageAgreement,
  type WorkingGroup,
} from "@/lib/domain/agreement";
import { cookies } from "next/headers";

import type { AuditEvent } from "@/lib/domain/event";
import { DEFAULT_LANG, type Lang } from "@/lib/domain/lang";
import { agreementStatus } from "@/lib/domain/status";
import { DRAFT_COOKIE, PUBLISHED_COOKIE } from "@/lib/cookies";
import {
  applyPublished,
  decodeDrafts,
  decodePublished,
  draftToAgreement,
} from "@/lib/domain/draft";
import { getDataset } from "@/lib/mock";
import { activeDataset } from "@/lib/session";

export interface AgreementFilter {
  agreementArea?: string;
  registrationStatus?: RegistrationStatus;
  employerOrgId?: string;
  employeeOrgId?: string;
}

/**
 * The register, plus whatever this session created and published.
 *
 * One accessor, so every function below — the register, the detail view, the
 * counts, the reports, the public search — sees the same thing without knowing
 * that some of it was made a minute ago. That is the whole point of the seam:
 * when this reads Supabase instead, none of them change.
 *
 * Bilaga 2 §3.5's bullets six and nine are what forced it. Registering an
 * agreement and publishing one both ended in a client component's state, so the
 * screen said the act had happened and every register denied it.
 */
/**
 * Exported because `lib/data/public.ts` reads the same register.
 *
 * It used to reach for `getDataset(...).agreements` itself, so an agreement
 * published this session appeared in the officer's register and not in the
 * public view — the one screen bullet nine exists to change. Two modules, one
 * register: they read it through the same function or they disagree.
 */
export async function agreements(): Promise<Agreement[]> {
  const [base, jar] = await Promise.all([
    activeDataset().then((d) => getDataset(d).agreements),
    cookies(),
  ]);
  const drafts = decodeDrafts(jar.get(DRAFT_COOKIE)?.value).map(draftToAgreement);
  const published = decodePublished(jar.get(PUBLISHED_COOKIE)?.value);
  return applyPublished([...base, ...drafts], published, PUBLISHED_NOW);
}

/**
 * Who published it and when, for a publication made during a demo session.
 *
 * Fixed rather than `new Date()`, for the reason every other date in this
 * prototype is: a screenshot taken twice has to be the same image, and a
 * server-rendered timestamp would differ from the browser's.
 */
const PUBLISHED_NOW = { date: "2027-06-14", by: "Anna Andersson" } as const;

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

/** FA-002 — the wage agreement rows for one agreement, newest period first. */
export async function listWageAgreements(agreementId: string): Promise<WageAgreement[]> {
  return getDataset(await activeDataset())
    .wageAgreements.filter((w) => w.agreementId === agreementId)
    .sort((a, b) => b.validFrom.localeCompare(a.validFrom));
}

/** Everything one agreement's detail view needs, in one read. */
/** FA-014 — the working groups a settlement handed its open questions to. */
export async function listWorkingGroups(agreementId: string): Promise<WorkingGroup[]> {
  return getDataset(await activeDataset()).workingGroups.filter(
    (g) => g.agreementId === agreementId,
  );
}

/**
 * Bilaga 3 §3.11 — the särskilda frågor registered on one agreement.
 *
 * MI files these by the year the agreement was signed, so the return is a list
 * rather than one record: a long-running agreement carries a set per round, and
 * the newest round comes first.
 */
export async function listSpecialQuestions(agreementId: string): Promise<SpecialQuestions[]> {
  return getDataset(await activeDataset())
    .specialQuestions.filter((q) => q.agreementId === agreementId)
    .sort((a, b) => b.year.localeCompare(a.year));
}

/** FH-002 — the high-level events on one agreement, newest first. */
export async function listAgreementEvents(agreementId: string): Promise<AuditEvent[]> {
  return getDataset(await activeDataset())
    .events.filter((e) => e.agreementId === agreementId)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export async function getAgreementDetail(id: string): Promise<{
  agreement: Agreement;
  wageAgreements: WageAgreement[];
  workingGroups: WorkingGroup[];
  specialQuestions: SpecialQuestions[];
  events: AuditEvent[];
} | null> {
  const agreement = await getAgreement(id);
  if (!agreement) return null;
  const [wageAgreements, workingGroups, specialQuestions, events] = await Promise.all([
    listWageAgreements(id),
    listWorkingGroups(id),
    listSpecialQuestions(id),
    listAgreementEvents(id),
  ]);
  return { agreement, wageAgreements, workingGroups, specialQuestions, events };
}

/** The distinct agreement areas present in the data — FA-001, and /avtal's filter. */
export async function listAgreementAreas(): Promise<string[]> {
  return [...new Set((await agreements()).map((a) => a.agreementArea))].sort((a, b) =>
    a.localeCompare(b, "sv"),
  );
}
