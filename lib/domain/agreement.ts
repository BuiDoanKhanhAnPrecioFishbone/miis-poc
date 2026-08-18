/**
 * Agreements and their parts — Appendix 1 §4.2 and §4.5, Epic F2.
 *
 * Identifiers are English; user-facing strings exist in both languages.
 * Pure domain — no imports beyond sibling types, no I/O.
 */

import { DEFAULT_LANG, type Lang } from "./lang";
import type { StatusCode } from "./status";

export type RegistrationStatus = "incomplete" | "complete";

/** The seven MI-defined agreement constructions (FA-007, §4.2). */
export type AgreementConstruction = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/*
  MI's own seven, transcribed from the legend of the Avtalskonstruktioner report
  in Bilaga F. Five of the seven we had were wrong — 3, 4, 5 and 7 named
  different constructions and 1 carried a qualifier MI does not use. They are
  ordered along a scale MI labels "Förhandlingsnivå / utrymme", from wage
  formation settled locally to a general increase settled centrally, which is
  why the order itself carries meaning and must not be re-sorted.
*/
export const AGREEMENT_CONSTRUCTIONS: Record<Lang, Record<AgreementConstruction, string>> = {
  sv: {
    1: "Lokal lönebildning",
    2: "Lokal lönebildning med stupstock om utrymmets storlek",
    3: "Lokal lönebildning med stupstock om utrymmets storlek och någon form av individgaranti",
    4: "Lönepott utan individgaranti",
    5: "Lönepott med individgaranti alternativt stupstock om individgaranti",
    6: "Generell höjning och lönepott",
    7: "Generell höjning",
  },
  en: {
    1: "Local wage formation",
    2: "Local wage formation with a fallback figure for the wage scope",
    3: "Local wage formation with a fallback figure for the wage scope and some form of individual guarantee",
    4: "Wage pot without individual guarantee",
    5: "Wage pot with individual guarantee, or a fallback for the individual guarantee",
    6: "General increase and wage pot",
    7: "General increase",
  },
};

export type Sector = "private" | "state" | "municipal";

export const SECTOR_LABEL: Record<Lang, Record<Sector, string>> = {
  sv: {
    private: "Privat",
    state: "Stat",
    municipal: "Kommuner och regioner",
  },
  en: {
    private: "Private",
    state: "Central government",
    municipal: "Municipalities and regions",
  },
};

/** Report selections that govern report inclusion (§4.2). */
export interface ReportSelection {
  eurofound: boolean;
  minimumWage: boolean;
  website: boolean;
  shortTermWageReport: boolean;
}

export interface PartyRef {
  id: string;
  name: string;
  /** Short form for dense lists, e.g. "Almega" for Almega Tjänsteförbunden. */
  shortName?: string;
}

export interface Agreement {
  id: string;
  agreementArea: string;
  name: string;
  alternativeName?: string;
  /** MI registers one agreement per party (§4.2). */
  employerOrg: PartyRef;
  employeeOrg: PartyRef;
  agreementType: string;
  registrationStatus: RegistrationStatus;
  /** D-001 – confidentiality marking, set by the agreement administrator. */
  confidential: boolean;
  reportSelection: ReportSelection;
  /** Linked to a mediation case (FR-012). */
  mediationLinked?: boolean;
  signedDate?: string;
  validFrom?: string;
  validTo?: string;
  /** Registration order, newest first when sorted descending. */
  registeredAt?: string;
  /** FA-015 / FA-016 */
  expiresWithoutRenewal?: boolean;
  earlyTermination?: { date: string; party: string };
}

/** One new row per bargaining round (FA-002). */
export interface WageAgreement {
  id: string;
  agreementId: string;
  construction: AgreementConstruction;
  wageScopePercent?: number;
  costFramePercent?: number;
  individualGuarantee: boolean;
  workingTimeReduction?: { costPercent: number };
  genderEqualityFlag: boolean;
  /** FA-012 – part of the norm-setting industry agreements. */
  industryBenchmark: boolean;
  signedDate?: string;
  validFrom: string;
  validTo: string;
  wageRevision?: { date: string; percent: number };
  minimumWages?: MinimumWage[];
}

/** FA-013 – minimum wages grouped by occupational group. */
export interface MinimumWage {
  occupationalGroup: string;
  amountSekPerMonth: number;
  revisionDate: string;
}

/** FA-003, FA-004 – its own validity period, need not match the wage agreement. */
export interface GeneralTerms {
  agreementId: string;
  signedDate?: string;
  validFrom: string;
  validTo: string;
}

/** Read model for agreement tables. Derived, never hand-written. */
export interface AgreementRow {
  id: string;
  name: string;
  parties: string;
  signedDate?: string;
  /** Swedish display string for the validity period. */
  validity: string;
  registrationStatus: RegistrationStatus;
  status: StatusCode;
  /** D-001 — carried into every table so the marker is never lost in a read model. */
  confidential?: boolean;
}

const REGISTRATION_STATUS_LABEL: Record<Lang, Record<RegistrationStatus, string>> = {
  sv: { complete: "Klar", incomplete: "Ofullständig" },
  en: { complete: "Complete", incomplete: "Incomplete" },
};

export function registrationStatusLabel(
  s: RegistrationStatus,
  lang: Lang = DEFAULT_LANG,
): string {
  return REGISTRATION_STATUS_LABEL[lang][s];
}

/** "Almega Tjänsteförbunden / Unionen" */
export function partiesLabel(a: Pick<Agreement, "employerOrg" | "employeeOrg">): string {
  return `${a.employerOrg.name} / ${a.employeeOrg.name}`;
}

/** "Almega/Unionen" — for dense lists. */
export function partiesShort(a: Pick<Agreement, "employerOrg" | "employeeOrg">): string {
  const employer = a.employerOrg.shortName ?? a.employerOrg.name;
  const employee = a.employeeOrg.shortName ?? a.employeeOrg.name;
  return `${employer}/${employee}`;
}

/** "Stål- och metallindustrin – Industriarbetsgivarna/IF Metall" */
export function agreementTitle(a: Agreement): string {
  return `${a.name} – ${a.employerOrg.name}/${a.employeeOrg.name}`;
}

const VALIDITY: Record<Lang, { remaining: (to: string) => string; unregistered: string }> = {
  sv: {
    remaining: (to) => `Kvarstående, utlöper ${to}`,
    unregistered: "Löptid ej registrerad",
  },
  en: {
    remaining: (to) => `Remaining, expires ${to}`,
    unregistered: "Validity period not registered",
  },
};

/**
 * Display string for the validity period, matching the sketches. Dates stay ISO
 * in both languages — that is what MI writes today.
 */
export function validityLabel(a: Agreement, lang: Lang = DEFAULT_LANG): string {
  if (a.validFrom && a.validTo) return `${a.validFrom}–${a.validTo}`;
  if (a.validTo) return VALIDITY[lang].remaining(a.validTo);
  return VALIDITY[lang].unregistered;
}
