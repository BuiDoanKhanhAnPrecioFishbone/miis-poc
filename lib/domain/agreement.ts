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

/**
 * A yes/no that MI always pairs with a comment field.
 *
 * Bilaga 3 §3.3 does this six times — *Hängavtal*, *Organisatorisk
 * avtalsförändring*, *Avtalet upphört*, *Uppdatera avtalet*, *Anställda
 * ackumulerat*, *Arbetstidskonto/-bank* — and the pairing is the point. The
 * flag is what a report can count; the comment is why an officer set it, which
 * is what the next officer needs and no report will ever hold.
 *
 * `value: false` with a comment is a real state, not a contradiction: "checked,
 * and it is not one, because …" is worth registering and is different from
 * nobody having looked.
 */
export interface NotedFlag {
  value: boolean;
  comment?: string;
}

/**
 * *Informationsbegränsning* — Bilaga 3 §3.3, and **not** the same thing as
 * D-001's sekretessmarkering.
 *
 * Sekretess is a legal status on the whole agreement. Informationsbegränsning
 * is narrower and duller: MI registers that *this section* of *this agreement*
 * is not to leave the house, section by section, and the form carries exactly
 * two — *arbetsgrupper* and *lägstlöner*. An agreement can have neither, one,
 * or both, and still not be sekretessmarkerat.
 *
 * We had only the agreement-wide flag, so a working group that MI restricts
 * would have travelled into a public report attached to an agreement that is
 * openly published. Both halves are needed: this says *what*, `maySeeConfidential`
 * says *who*.
 */
export interface InformationLimits {
  workingGroups: boolean;
  minimumWages: boolean;
}

export type LimitedSection = keyof InformationLimits;

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
  /**
   * How many employees the agreement covers — *Avtalets omfattning: Anställda*
   * in MI's own Huvudrapport (Bilaga F, Rapport 4).
   *
   * Not a statistic we invented to have something to chart. MI's two population
   * reports both count employees rather than agreements, because 604 agreements
   * covering 3,8 million people are not 604 equal things: one Kommunal
   * agreement outweighs thirty small ones, and a bargaining-round report that
   * counted rows would say the opposite of what it means. Optional, because
   * MI's own printouts show `¤` where the figure is missing.
   */
  employees?: number;
  /**
   * The rest of MI's own *Avtalets omfattning* — Bilaga 3 §3.3, and the block
   * the Huvudrapport opens with. Four figures, not one, because they answer
   * different questions and MI registers all four:
   *
   * - **Årsarbetare** is headcount converted to full-time equivalents. A retail
   *   agreement covering 20 000 people may be 12 000 årsarbetare, and a cost
   *   frame applies to the second number.
   * - **Fackmedlemmar** is how many of them are union members — the
   *   organisation rate, which is what says how much of the area the agreement
   *   actually speaks for.
   * - **Medellön** is the average monthly wage under it, in whole kronor.
   *
   * Each figure MI dates carries its own date, because the three are updated
   * at different times from different sources and an undated statistic is one
   * nobody can decide whether to trust.
   */
  annualWorkers?: number;
  unionMembers?: number;
  employeesUpdated?: string;
  averageWageSek?: number;
  averageWageUpdated?: string;
  /**
   * Basfakta's registered flags (§3.3), each with MI's own comment field.
   *
   * *Hängavtal* — an employer outside the signing organisation has adopted this
   * agreement. *Organisatorisk avtalsförändring* — the agreement moved because
   * a party merged or split rather than because the parties renegotiated.
   * *Avtalet upphört* — it has ceased, which is not the same as having run out:
   * an expired agreement still applies until replaced, a ceased one does not.
   */
  hangingAgreement?: NotedFlag;
  organisationalChange?: NotedFlag;
  terminated?: NotedFlag;
  /** *Förhandlingsordningsavtal Dnr* (§3.3) — MI's own diarienummer for it. */
  negotiationOrderRef?: string;
  /** Absent means neither section is restricted. */
  informationLimits?: InformationLimits;
  /** Registration order, newest first when sorted descending. */
  registeredAt?: string;
  /** FA-015 / FA-016 */
  expiresWithoutRenewal?: boolean;
  earlyTermination?: { date: string; party: string };
}

/**
 * Whether one section of an agreement is information-restricted.
 *
 * Deliberately split from `maySeeConfidential`: this says **what** is
 * restricted, that one says **who** may see it, and a screen has to ask both.
 * Folding them into one predicate would have made the restriction a property of
 * the reader rather than of the record.
 */
export function isSectionLimited(
  a: Pick<Agreement, "informationLimits">,
  section: LimitedSection,
): boolean {
  return a.informationLimits?.[section] === true;
}

/**
 * *Organisationsgrad* — union members as a percentage of those covered.
 *
 * Derived rather than registered, because it is the ratio of two fields MI
 * already holds and a third stored number is a third number that can go stale.
 * Undefined when either side is missing or the headcount is zero: MI's own
 * printouts show `¤` for a missing figure rather than a zero, and a computed
 * 0 % would be a claim we cannot make.
 */
export function unionDensityPercent(
  a: Pick<Agreement, "employees" | "unionMembers">,
): number | undefined {
  if (!a.employees || a.unionMembers === undefined) return undefined;
  return Math.round((a.unionMembers / a.employees) * 1000) / 10;
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

/**
 * FA-014 — *"Registrering av arbetsgrupper med frågeområden."*
 *
 * This is where Bilaga B's `Särskilda frågor` goes. The current system keeps it
 * as a document type of its own; MI's requirement folds it into the working
 * group that owns it, because a subject area with no group behind it is a note,
 * and what MI needs to answer later is *which group is looking at what*.
 *
 * A settlement routinely defers questions it could not close — working time,
 * pensions, the wage model — to a joint group reporting before the next round.
 * Those groups are why an agreement that looks finished is not.
 */
export interface WorkingGroup {
  id: string;
  agreementId: string;
  name: string;
  /** The questions the parties handed to it. */
  subjectAreas: string[];
  /** When it is due to report, where the protocol says so. */
  reportsBy?: string;
}

/**
 * *Särskilda frågor* — Bilaga 3 §3.11, in MI's own shape.
 *
 * We had folded this into `WorkingGroup.subjectAreas`, and that was a reading
 * of FA-014 rather than of MI's form. The two are different things and both are
 * real: a working group is a **body** with a name and a reporting date; a
 * särskild fråga is a **question the agreement itself answers**, with the
 * clause that answers it and a flag for whether it is a gender-equality
 * question. An agreement can carry särskilda frågor and no working group, and
 * routinely does.
 *
 * Three slots, numbered, because MI's form has exactly three — *Särskild fråga
 * 1/2/3*, each with its own *jämställdhet*, *avtalstext* and *kommentar*. Not a
 * list of arbitrary length: the numbering is how MI's own reports refer to
 * them, so a fourth question would have nowhere to be printed.
 */
export type SpecialQuestionNumber = 1 | 2 | 3;

export interface SpecialQuestion {
  number: SpecialQuestionNumber;
  /** *Särskild fråga N* — what the parties put to each other. */
  question: string;
  /** *Särskild fråga N jämställdhet* — FA-011's flag, per question. */
  genderEquality: boolean;
  /** *Särskild fråga N avtalstext* — the clause that settles it. */
  agreementText?: string;
  comment?: string;
}

export interface SpecialQuestions {
  agreementId: string;
  /**
   * The year the agreement was signed. §3.11 files these by year in the
   * *Åtgärd/Handling* field, so a question belongs to a round rather than to
   * the agreement in general.
   */
  year: string;
  questions: SpecialQuestion[];
  /** The form's own trailing *Kommentar*, about the set rather than one of them. */
  comment?: string;
}

/** The slots MI's form has, in the order it prints them. */
export const SPECIAL_QUESTION_NUMBERS: readonly SpecialQuestionNumber[] = [1, 2, 3];

/**
 * The questions in slot order, with no gaps closed up.
 *
 * If MI registered a question in slot 3 and nothing in slot 2, slot 3 is still
 * *Särskild fråga 3* — renumbering it would rename the thing MI's reports point
 * at.
 */
export function orderedQuestions(set: SpecialQuestions): SpecialQuestion[] {
  return [...set.questions].sort((a, b) => a.number - b.number);
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
