/**
 * Agreements and their parts — Appendix 1 §4.2 and §4.5, Epic F2.
 *
 * Identifiers are English; every user-facing string is Swedish.
 * Pure domain — no imports beyond sibling types, no I/O.
 */

import type { StatusCode } from "./status";

export type RegistrationStatus = "incomplete" | "complete";

/** The seven MI-defined agreement constructions (FA-007, §4.2). */
export type AgreementConstruction = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const AGREEMENT_CONSTRUCTIONS: Record<AgreementConstruction, string> = {
  1: "Lokal lönebildning – sifferlösa avtal",
  2: "Lokal lönebildning med stupstock om utrymmets storlek",
  3: "Lönepott utan individgaranti",
  4: "Lönepott med individgaranti",
  5: "Generell höjning",
  6: "Generell höjning och lönepott",
  7: "Individuell förhandling",
};

export type Sector = "private" | "state" | "municipal";

export const SECTOR_LABEL: Record<Sector, string> = {
  private: "Privat",
  state: "Stat",
  municipal: "Kommuner och regioner",
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
}

export function registrationStatusLabel(s: RegistrationStatus): string {
  return s === "complete" ? "Klar" : "Ofullständig";
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

/** Swedish display string for the validity period, matching the sketches. */
export function validityLabel(a: Agreement): string {
  if (a.validFrom && a.validTo) return `${a.validFrom}–${a.validTo}`;
  if (a.validTo) return `Kvarstående, utlöper ${a.validTo}`;
  return "Löptid ej registrerad";
}
