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
import { DEFAULT_LANG, type Lang, type Text } from "./lang";
import type { Role } from "./role";

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

/* -------------------------------------------------------------------------- */
/* MI's own reports — Bilaga F                                                 */
/* -------------------------------------------------------------------------- */

/**
 * MI's reports, and the selection each one is taken with.
 *
 * Bilaga F is *"faktiska utskrifter från nuvarande system"*, and its own opening
 * line is the part that shapes this file: **"För varje rapport visas urvalsbild
 * och resultat."** A report in MI's world is not a button. It is a selection
 * screen — pick the report, fill in the criteria, choose the format, press
 * *Generera rapport* — and then a printout that repeats the criteria at the top
 * so the reader knows what population they are looking at.
 *
 * The six reports and their criteria below are read off MI's own W3D3 selection
 * screens in Bilaga F (pages 39–50), not invented. Three of them take the same
 * three criteria; two take the same nine; one takes a shape of its own with the
 * criteria split into three groups. That variation is the requirement: FR-005
 * asks for a report generator, and a generator whose form is the same whatever
 * you are generating is a report list with a heading.
 *
 * Requirement mapping, which is not one-to-one and is worth stating:
 *
 * - **FR-006** Avtalsrörelserapporten is Bilaga F's Rapport 3.
 * - **FR-007** Avtalskonstruktioner is Rapport 2.
 * - **FR-008** Konjunkturlönerapporten is **not in Bilaga F at all** — it is
 *   the one MI describes as a *view* rather than a printout, which is why it
 *   has a screen and the others have a selection.
 * - **FR-011**'s "utlämning av protokoll och avtalstryck … för medlare och
 *   allmänhet" is Rapport 1 (Allmänheten) and Rapport 5 (Medlare) — two
 *   printouts of one agreement, for two audiences, with confidentiality-marked
 *   information excluded from both. Rapport 1's audience has a screen of its
 *   own (`/allmanheten`), so that report sends the reader there; Rapport 5's
 *   audience has no screen at all, so it builds its printout here.
 * - **Rapport 4, Huvudrapport**, has no FR of its own. It is the complete record
 *   for one agreement — basfakta, omfattning, lön, arbetstid, pension, ledighet,
 *   löneavtal, lönerevision — i.e. the agreement view, printed, which is why it
 *   points at `/avtal/[id]` rather than duplicating it.
 * - **FR-009** (MI's website) and **FR-010** (Eurofound, Minimilön) are Steg 2
 *   in MI's own table for *delivery*, but their selection is a property the
 *   officer already sets on the agreement, so the report shows which agreements
 *   it would carry. Listing them with no result made the catalogue a menu with
 *   two items that were not on it.
 *
 * Pure domain — no React, no data access, no I/O.
 */


/**
 * What kind of control a criterion is.
 *
 * `party-employer` and `party-employee` are separate from `select` because they
 * are filled from the party register rather than from a fixed list, and the
 * screen has to know which half of it.
 */
export type ReportCriterionKind =
  | "year"
  | "agreement"
  | "party-employer"
  | "party-employee"
  | "sector"
  | "industry-code"
  /* Two kinds, not one: MI's screen shows Centralorganisation twice, and the
     two lists have nothing in common — Svenskt Näringsliv on the employer side,
     LO, TCO and Saco on the employee side. One shared list offered every role
     both, so half of each dropdown was a selection that could only return
     nothing, for a reason the user could not see. */
  | "central-org-employer"
  | "central-org-employee"
  | "employer-group"
  | "cooperation-group"
  | "pension-agreement"
  | "other-agreement";

export interface ReportCriterion {
  id: string;
  kind: ReportCriterionKind;
  label: Text;
  /**
   * Which block of the selection screen it belongs to. Rapport 6 splits its
   * criteria into "Avtalsparter på löneavtal och allmänna villkor" and
   * "Avtalsparter på pensionsavtal och övriga avtal", and printing them as one
   * undifferentiated list would lose the distinction the report is about.
   */
  group?: Text;
}

/** The output formats FR-005 names, plus FR-013's structured pair. */
export type ReportFormat = "pdf" | "word" | "excel" | "csv" | "json";

export const REPORT_FORMAT_LABEL: Record<ReportFormat, string> = {
  pdf: "PDF",
  word: "Word",
  excel: "Excel",
  csv: "CSV",
  json: "JSON",
};

/**
 * Where a generated report actually appears in MIIS.
 *
 * There is one kind now, and that is the point. Six of the ten reports used to
 * resolve to a link to another screen or to the word *Steg 2*, so pressing
 * *Generera rapport* on them produced no report — Bilaga 3 §7 opens with
 * *"For varje rapport visas urvalsbild och resultat"*, and half the catalogue
 * had the first and not the second.
 *
 * The single-agreement reports were the hardest case and the reasoning that
 * sent them elsewhere was sound: the agreement's own view already *is* that
 * printout with FR-011 and D-002 applied, and rendering it twice risks two
 * places disagreeing about one confidentiality rule. The resolution is not to
 * render it twice and not to navigate away — `agreementDocument` runs the rule
 * **once, on the server**, and what the audience may not read is absent from
 * the document rather than hidden in it.
 */
export type ReportResult = {
  kind: "inline";
  component:
    | "constructions"
    | "bargaining-round"
    | "expiry"
    | "mediator-release"
    /* One agreement as a document — §7.1 internal, §7.3 released. */
    | "agreement-main"
    | "agreement-public"
    /* §7.5, whose population is the pension and other agreements. */
    | "pension"
    /* FR-008's own view: the watch list is the selection. */
    | "short-term-wage"
    /* FR-009 and FR-010 select on the agreement's own reportSelection. */
    | "report-selection-website"
    | "report-selection-eurofound";
};

export interface ReportDefinition {
  id: string;
  /** MI's own name in the "Välj rapport" list. */
  label: Text;
  /** What the printout contains, in one sentence. */
  produces: Text;
  requirements: readonly string[];
  /** MI's own delivery stage. Everything without a marking is Stage 1. */
  stage: 1 | 2;
  criteria: readonly ReportCriterion[];
  formats: readonly ReportFormat[];
  result: ReportResult;
  /** Bilaga F's own numbering, where the report is one of the six. */
  bilagaF?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * The roles outside MI's own staff that may run this report.
   *
   * §3.1 gives both *Allmänhetens dator* and *Medlare* the same permission —
   * **"Specifika rapporter"** — and Bilaga 3 names which: the public interface
   * carries *Avtal – Allmänheten* (§4.3), and the mediator interface carries
   * *Avtal – Medlare*, *Avtal – Avtalsrörelse* and *Avtal – Utlöpningstidpunkter*
   * and nothing else (§5.1). Specific means specific, so the list is here rather
   * than inferred from a menu.
   *
   * Absent means MI's own staff only, decided by `accessLevel` as everywhere
   * else. It is never a substitute for that: this narrows, it does not grant.
   */
  externalRoles?: readonly Role[];
}

/* The three criteria the single-agreement reports share (Bilaga F, pages 39, 46, 48). */
const AGREEMENT_CRITERIA: readonly ReportCriterion[] = [
  {
    id: "employerOrg",
    kind: "party-employer",
    label: { sv: "Arbetsgivarorganisation", en: "Employer organisation" },
  },
  {
    id: "employeeOrg",
    kind: "party-employee",
    label: { sv: "Arbetstagarorganisation", en: "Employee organisation" },
  },
  { id: "agreement", kind: "agreement", label: { sv: "Avtal", en: "Agreement" } },
];

/*
  The nine the two population reports share (Bilaga F, pages 40 and 43). Note
  that Centralorganisation appears **twice** in MI's own screen — once under the
  employer side and once under the employee side — which is why the two carry
  different ids rather than one being a mistake.
*/
const POPULATION_CRITERIA: readonly ReportCriterion[] = [
  { id: "year", kind: "year", label: { sv: "Årtal", en: "Year" } },
  {
    id: "employerOrg",
    kind: "party-employer",
    label: { sv: "Arbetsgivarorganisation", en: "Employer organisation" },
  },
  { id: "sector", kind: "sector", label: { sv: "Sektor", en: "Sector" } },
  { id: "industryCode", kind: "industry-code", label: { sv: "Branschkod", en: "Industry code" } },
  {
    id: "employerCentralOrg",
    kind: "central-org-employer",
    label: { sv: "Centralorganisation (AGO)", en: "Confederation (employer)" },
  },
  {
    id: "employerGroup",
    kind: "employer-group",
    label: { sv: "Arbetsgivargrupp", en: "Employer group" },
  },
  {
    id: "employeeOrg",
    kind: "party-employee",
    label: { sv: "Arbetstagarorganisation", en: "Employee organisation" },
  },
  {
    id: "employeeCentralOrg",
    kind: "central-org-employee",
    label: { sv: "Centralorganisation (ATO)", en: "Confederation (employee)" },
  },
  {
    id: "cooperationGroup",
    kind: "cooperation-group",
    label: { sv: "Samverkansgrupp", en: "Cooperation group" },
  },
];

const WAGE_PARTIES: Text = {
  sv: "Avtalsparter på löneavtal och allmänna villkor",
  en: "Parties to the wage agreement and general terms",
};
const OTHER_PARTIES: Text = {
  sv: "Avtalsparter på pensionsavtal och övriga avtal",
  en: "Parties to the pension and other agreements",
};

export const REPORTS: readonly ReportDefinition[] = [
  {
    id: "allmanheten",
    label: { sv: "Avtal – Allmänheten", en: "Agreement – The public" },
    produces: {
      sv: "Ett avtal som det lämnas ut till allmänheten: parter, avtalsområde, löptider för löneavtal och allmänna villkor, uppsägning, prolongering och länkade protokoll. Sekretessmarkerad information utelämnas.",
      en: "One agreement as released to the public: parties, agreement area, the validity periods of the wage agreement and the general terms, termination, prolongation and linked protocols. Confidentiality-marked information is excluded.",
    },
    requirements: ["FR-011", "D-002"],
    stage: 1,
    criteria: AGREEMENT_CRITERIA,
    formats: ["pdf", "word", "excel"],
    result: { kind: "inline", component: "agreement-public" },
    bilagaF: 1,
    externalRoles: ["public"],
  },
  {
    id: "avtalskonstruktioner",
    label: { sv: "Avtal – Avtalskonstruktioner", en: "Agreement – Agreement constructions" },
    produces: {
      sv: "Sex sidor: antal avtal och anställda per sektor, lönebildning och lönesättning som figurer för samtliga avtal och för urvalet, de sju konstruktionerna med andelar, och urvalets avtal listade under sin konstruktion.",
      en: "Six pages: agreements and employees by sector, wage formation and wage setting as figures for all agreements and for the selection, the seven constructions with their shares, and the selected agreements listed under their construction.",
    },
    requirements: ["FR-007", "FA-007"],
    stage: 1,
    criteria: POPULATION_CRITERIA,
    formats: ["pdf", "word", "excel"],
    result: { kind: "inline", component: "constructions" },
    bilagaF: 2,
  },
  {
    id: "avtalsrorelse",
    label: { sv: "Avtal – Avtalsrörelse", en: "Agreement – Bargaining round" },
    produces: {
      sv: "Avtal och anställda fördelade efter avtalens utlöpningstidpunkt månad för månad, uppdelade på kvarstående, nytecknade och nytecknade efter medling, i antal och procent.",
      en: "Agreements and employees distributed by the month the agreement expires, split into remaining, newly signed and signed after mediation, as counts and percentages.",
    },
    requirements: ["FR-006", "FR-012"],
    stage: 1,
    criteria: POPULATION_CRITERIA,
    formats: ["pdf", "word", "excel"],
    result: { kind: "inline", component: "bargaining-round" },
    bilagaF: 3,
    externalRoles: ["mediator"],
  },
  {
    id: "huvudrapport",
    label: { sv: "Avtal – Huvudrapport", en: "Agreement – Main report" },
    produces: {
      sv: "Hela registreringen för ett avtal: basfakta, avtalets omfattning, lön, arbetstid, pensionsavtal, ledighet, löneavtal och lönerevision — det som avtalsvyn visar, utskrivet.",
      en: "The complete registration for one agreement: base facts, scope, pay, working time, pension agreement, leave, wage agreement and wage revision — what the agreement view shows, printed.",
    },
    requirements: ["FA-001", "FA-002", "FR-005"],
    stage: 1,
    criteria: AGREEMENT_CRITERIA,
    formats: ["pdf", "word", "excel"],
    result: { kind: "inline", component: "agreement-main" },
    bilagaF: 4,
  },
  {
    id: "medlare",
    label: { sv: "Avtal – Medlare", en: "Agreement – Mediators" },
    produces: {
      sv: "Ett avtal som det lämnas ut till medlare: löptider, uppsägning, prolongering, länkade protokoll och avtalstryck, samt övriga avtal som arbetsgivarorganisationen tecknar. Sekretessmarkerad information utelämnas.",
      en: "One agreement as released to mediators: validity periods, termination, prolongation, linked protocols and agreement prints, plus the other agreements the employer organisation signs. Confidentiality-marked information is excluded.",
    },
    requirements: ["FR-011", "D-002"],
    stage: 1,
    criteria: AGREEMENT_CRITERIA,
    formats: ["pdf", "word", "excel"],
    /*
      Not `{ kind: "screen", href: "/avtal" }`. §3.1 gives Medlare Start and
      Rapporter and nothing else, so the picker was offering the role a report
      whose only outcome was the authorisation notice. §7.4 describes a printout
      of its own, and this now produces it.
    */
    result: { kind: "inline", component: "mediator-release" },
    bilagaF: 5,
    externalRoles: ["mediator"],
  },
  {
    id: "pensionsavtal",
    label: {
      sv: "Avtal – Pensionsavtal och övriga avtal",
      en: "Agreement – Pension and other agreements",
    },
    produces: {
      sv: "Avtalen med sina pensionsavtal och övriga avtal, med parter och anställda, urvalet gjort på båda avtalsformerna var för sig.",
      en: "The agreements with their pension and other agreements, with parties and employees, selected on each of the two agreement forms separately.",
    },
    requirements: ["FA-019", "FA-020"],
    stage: 1,
    criteria: [
      {
        id: "pensionAgreement",
        kind: "pension-agreement",
        label: { sv: "Pensionsavtal", en: "Pension agreement" },
      },
      {
        id: "otherAgreement",
        kind: "other-agreement",
        label: { sv: "Övrigt avtal", en: "Other agreement" },
      },
      ...POPULATION_CRITERIA.filter((c) => c.id !== "year").map((c) => ({
        ...c,
        group: WAGE_PARTIES,
      })),
      {
        id: "otherEmployerOrg",
        kind: "party-employer" as const,
        label: { sv: "Arbetsgivarorganisation", en: "Employer organisation" },
        group: OTHER_PARTIES,
      },
      {
        id: "otherEmployeeOrg",
        kind: "party-employee" as const,
        label: { sv: "Arbetstagarorganisation", en: "Employee organisation" },
        group: OTHER_PARTIES,
      },
    ],
    formats: ["pdf", "word", "excel"],
    result: { kind: "inline", component: "pension" },
    bilagaF: 6,
  },
  {
    id: "utlopningstidpunkter",
    label: {
      sv: "Avtal – Utlöpningstidpunkter",
      en: "Agreement – Expiry dates",
    },
    produces: {
      sv: "Gällande avtal fördelade efter den månad de löper ut, i tre delar: samtliga sektorer, Svenskt Näringsliv, och Svenskt Näringsliv per arbetsgivargrupp. Endast gällande avtal ingår.",
      en: "Agreements in force distributed by the month they expire, in three parts: all sectors, Svenskt Näringsliv, and Svenskt Näringsliv by employer group. Only agreements in force are included.",
    },
    requirements: ["FR-005", "FA-015"],
    stage: 1,
    /* One criterion. Bilaga 3 §7.11: "Ange årtal (4 siffror)." */
    criteria: [{ id: "year", kind: "year", label: { sv: "Årtal", en: "Year" } }],
    formats: ["pdf", "word", "excel"],
    result: { kind: "inline", component: "expiry" },
    externalRoles: ["mediator"],
  },
  {
    id: "konjunkturlon",
    label: { sv: "Konjunkturlönerapporten", en: "The Short-Term Wage Report" },
    produces: {
      sv: "Bevakade avtal inför nästa uttag, med registreringsstatus, protokollänk även vid ofullständig registrering, och vilka avtal som redan exporterats.",
      en: "Monitored agreements ahead of the next extract, with registration status, a protocol link even where registration is incomplete, and which agreements have already been exported.",
    },
    requirements: ["FR-008", "FA-021"],
    stage: 1,
    /*
      No selection screen, and that is MI's own design rather than an omission:
      FR-008 says the report is written out "från en vy som visar en lista med
      bevakade avtal", so the list is the selection. It is the only one of the
      nine that works that way.
    */
    criteria: [],
    formats: ["pdf", "word", "excel"],
    result: { kind: "inline", component: "short-term-wage" },
  },
  {
    id: "hemsida",
    label: {
      sv: "Rapporter för Medlingsinstitutets hemsida",
      en: "Reports for the Medlingsinstitutet website",
    },
    produces: {
      sv: "Publiceringsunderlag för mi.se. Urvalet styrs av avtalets rapporturval (Medlingsinstitutets hemsida).",
      en: "Publication material for mi.se. The selection is governed by the agreement's report selection (Medlingsinstitutet's website).",
    },
    requirements: ["FR-009"],
    stage: 2,
    criteria: POPULATION_CRITERIA,
    formats: ["pdf", "excel", "csv"],
    result: { kind: "inline", component: "report-selection-website" },
  },
  {
    id: "eurofound",
    label: { sv: "Eurofound och Minimilön", en: "Eurofound and Minimum wage" },
    produces: {
      sv: "Uttag för Eurofound respektive minimilönerapporteringen. Urvalet styrs av avtalets rapporturval.",
      en: "Extracts for Eurofound and for minimum-wage reporting. The selection is governed by the agreement's report selection.",
    },
    requirements: ["FR-010"],
    stage: 2,
    criteria: POPULATION_CRITERIA,
    formats: ["excel", "csv"],
    result: { kind: "inline", component: "report-selection-eurofound" },
  },
] as const;

/* ------------------------------------------------------------------------- */
/* The report as a document — Bilaga 3 §7                                      */
/* ------------------------------------------------------------------------- */

/**
 * What a report actually produces.
 *
 * Bilaga 3 §7 opens by saying it: *"För varje rapport visas urvalsbild och
 * resultat."* Six of the ten reports in the catalogue had a urvalsbild and no
 * resultat — four handed the officer a link to another screen and two said
 * *Steg 2*. A report function whose result is a link to the register is not a
 * report function, and no amount of correct selection criteria above it makes
 * it one.
 *
 * The single-agreement reports were the worst of it, and the reasoning that put
 * them there was sound and still wrong: the agreement's own view already *is*
 * that printout with FR-011 and D-002 applied, so rendering it twice risked two
 * places disagreeing about one confidentiality rule. The resolution is not to
 * render it twice and not to navigate away — it is to build the document from a
 * **rule that runs once, on the server**, and hand down only what may be read.
 *
 * That is what makes this a data structure rather than markup. A value withheld
 * under FR-011 is **absent from the document**, not hidden in it: CSS cannot
 * meet a requirement about what may leave the building, and neither can a
 * `<span>` a client component decided not to paint.
 */
export interface ReportFact {
  label: Text;
  /** Already formatted — dates are ISO, numbers carry the language's decimal. */
  value: string;
}

export interface ReportPart {
  heading: Text;
  facts?: readonly ReportFact[];
  table?: { headers: readonly Text[]; rows: readonly (readonly string[])[] };
  /** Why a part is empty, where empty is a fact rather than a gap. */
  note?: Text;
}

export interface ReportDocument {
  /** The record the document is about, where it is about one. */
  id?: string;
  title: string;
  parts: readonly ReportPart[];
  /**
   * Set where the whole document is withheld.
   *
   * FR-011 and D-002: a sekretessmarkerat agreement has no public report at
   * all, rather than a report with the values taken out. The reader is told
   * that something exists and is not being shown, which is a different and
   * truer answer than an empty page.
   */
  withheld?: Text;
}

/** Who the document is being produced for — it decides what is in it. */
export type ReportAudience = "internal" | "public" | "mediator";

/**
 * §7.1 Avtal – Huvudrapport and §7.3 Avtal – Allmänheten.
 *
 * One function, two audiences, because they are one document with different
 * disclosure — and the disclosure is the thing that must not be decided twice.
 * MI's own §7.3 prints the parties, the area, the signing date, the period and
 * the rounds; it does not print the cost frame or the wage scope, because those
 * are MI's working material rather than the release.
 */
export function agreementDocument(
  a: ReportAgreement,
  rounds: readonly {
    year: number;
    construction?: number;
    constructionLabel?: string;
    wageScopePercent?: number;
    costFramePercent?: number;
    validFrom?: string;
    validTo?: string;
  }[],
  audience: ReportAudience,
  labels: ReportDocumentLabels,
): ReportDocument {
  /* D-002 keeps the agreement *listed and counted*; FR-011 keeps its detail in.
     The public and mediator audiences get the refusal, not the values. */
  if (a.confidential && audience !== "internal") {
    return { id: a.id, title: a.name, parts: [], withheld: labels.withheld };
  }

  const dash = labels.none;
  const parts: ReportPart[] = [
    {
      /* §7.1's Rapporthuvud, in MI's own field order. */
      heading: labels.identity,
      facts: [
        { label: labels.agreement, value: a.name },
        { label: labels.employerOrg, value: a.employerOrg },
        { label: labels.employeeOrg, value: a.employeeOrg },
        { label: labels.agreementType, value: a.agreementType ?? dash },
        { label: labels.sector, value: a.sector ?? dash },
        { label: labels.industryCode, value: a.industryCode ?? dash },
        { label: labels.signedDate, value: a.signedDate ?? dash },
        { label: labels.validity, value: a.validity },
      ],
    },
  ];

  /*
    The rounds. One row per avtalsrörelse — FA-002's own shape — and the two
    columns that separate the audiences are dropped rather than blanked for a
    reader who may not have them.
  */
  const internal = audience === "internal";
  const headers = internal
    ? [labels.year, labels.construction, labels.wageScope, labels.costFrame, labels.period]
    : [labels.year, labels.construction, labels.period];
  parts.push({
    heading: labels.rounds,
    ...(rounds.length === 0
      ? { note: labels.noRounds }
      : {
          table: {
            headers,
            rows: rounds.map((r) => {
              const period = r.validFrom || r.validTo ? `${r.validFrom ?? ""}–${r.validTo ?? ""}` : dash;
              const construction =
                r.constructionLabel ?? (r.construction === undefined ? dash : String(r.construction));
              return internal
                ? [
                    String(r.year),
                    construction,
                    r.wageScopePercent === undefined ? dash : String(r.wageScopePercent),
                    r.costFramePercent === undefined ? dash : String(r.costFramePercent),
                    period,
                  ]
                : [String(r.year), construction, period];
            }),
          },
        }),
  });

  /* §7.1 and §7.3 both carry termination and prolongation — FA-015, FA-016. */
  parts.push({
    heading: labels.lifecycle,
    facts: [
      {
        label: labels.expiresWithoutRenewal,
        value: a.expiresWithoutRenewal ? labels.yes : labels.no,
      },
      {
        label: labels.earlyTermination,
        value: a.earlyTermination
          ? `${a.earlyTermination.date} · ${a.earlyTermination.party}`
          : dash,
      },
      { label: labels.terminated, value: a.terminated ? labels.yes : labels.no },
    ],
  });

  /* Scope figures are MI's working material and stay internal. */
  if (internal) {
    parts.push({
      heading: labels.scope,
      facts: [{ label: labels.employees, value: a.employees === undefined ? dash : String(a.employees) }],
    });
  }

  return { id: a.id, title: a.name, parts };
}

/** Every label the document needs, resolved by the caller in one language. */
export interface ReportDocumentLabels {
  none: string;
  yes: string;
  no: string;
  withheld: Text;
  identity: Text;
  rounds: Text;
  noRounds: Text;
  lifecycle: Text;
  scope: Text;
  agreement: Text;
  employerOrg: Text;
  employeeOrg: Text;
  agreementType: Text;
  sector: Text;
  industryCode: Text;
  signedDate: Text;
  validity: Text;
  year: Text;
  construction: Text;
  wageScope: Text;
  costFrame: Text;
  period: Text;
  expiresWithoutRenewal: Text;
  earlyTermination: Text;
  terminated: Text;
  employees: Text;
}

export function reportById(id: string): ReportDefinition | undefined {
  return REPORTS.find((r) => r.id === id);
}

export function reportLabel(report: ReportDefinition, lang: Lang = DEFAULT_LANG): string {
  return report.label[lang];
}

/** The criteria in the order MI's own screen shows them, grouped where it groups them. */
export function criteriaGroups(
  report: ReportDefinition,
  lang: Lang = DEFAULT_LANG,
): { group: string | null; criteria: readonly ReportCriterion[] }[] {
  const out: { group: string | null; criteria: ReportCriterion[] }[] = [];
  for (const criterion of report.criteria) {
    const name = criterion.group ? criterion.group[lang] : null;
    const last = out[out.length - 1];
    if (last && last.group === name) last.criteria.push(criterion);
    else out.push({ group: name, criteria: [criterion] });
  }
  return out;
}

/**
 * The criteria line MI prints at the head of every result — *Urvalskriterier*,
 * every criterion named, and the ones left blank shown as "Alla".
 *
 * Printing only the criteria that were set would be shorter and wrong: the
 * reader of a population report has to be able to see that Sektor was *not*
 * narrowed, and an absent line does not say that.
 */
export function selectionSummary(
  report: ReportDefinition,
  values: Record<string, string>,
  lang: Lang,
  allLabel: string,
): { label: string; value: string }[] {
  return report.criteria.map((c) => ({
    label: c.label[lang],
    value: values[c.id]?.trim() ? values[c.id]! : allLabel,
  }));
}

/* -------------------------------------------------------------------------- */
/* Avtalsrörelserapporten — FR-006, Bilaga F Rapport 3                          */
/* -------------------------------------------------------------------------- */

/**
 * One month of the bargaining-round report.
 *
 * MI's own printout is two tables of twelve rows — one counting agreements, one
 * counting the employees those agreements cover — each split into *kvarstående*,
 * *nytecknade* and *nytecknade efter medling*, as a count and as a percent of
 * the year's total. The bar chart under each table is the same three series.
 *
 * The month is the month the agreement **expires**, not the month it was
 * signed. That is what makes the report the picture of a bargaining round: it
 * says how much of the labour market falls due when, and how much of it has
 * been settled by now.
 */
export interface BargainingMonthRow {
  /** 1–12. */
  month: number;
  remaining: number;
  newlySigned: number;
  afterMediation: number;
}

export interface BargainingRoundReport {
  year: number;
  /** Counted in agreements. */
  agreements: BargainingMonthRow[];
  /** Counted in the employees those agreements cover (FA-023). */
  employees: BargainingMonthRow[];
  agreementTotal: BargainingMonthRow;
  employeeTotal: BargainingMonthRow;
}

const EMPTY = (month: number): BargainingMonthRow => ({
  month,
  remaining: 0,
  newlySigned: 0,
  afterMediation: 0,
});

/**
 * Builds the report from the register.
 *
 * Derived, never stored — the same rule the tables follow. `status` is FR-012's
 * own derivation, so the report and the colour on every row of every register
 * can never disagree about what an agreement is.
 *
 * An agreement with no employee count contributes to the agreement table and
 * not to the employee one, rather than being counted as zero in both. MI's own
 * report has the same hole in it: several rows in Bilaga F show `¤` where the
 * number is missing.
 */
export function bargainingRoundReport(
  agreements: readonly {
    validTo?: string | undefined;
    employees?: number | undefined;
    signedDate?: string | undefined;
    mediationLinked?: boolean | undefined;
  }[],
  year: number,
  statusOf: (a: { signedDate?: string | undefined; mediationLinked?: boolean | undefined }) => {
    code: string;
  },
): BargainingRoundReport {
  const months = Array.from({ length: 12 }, (_, i) => EMPTY(i + 1));
  const employeeMonths = Array.from({ length: 12 }, (_, i) => EMPTY(i + 1));

  for (const a of agreements) {
    if (!a.validTo?.startsWith(String(year))) continue;
    const month = Number(a.validTo.slice(5, 7));
    if (!(month >= 1 && month <= 12)) continue;
    const row = months[month - 1]!;
    const employeeRow = employeeMonths[month - 1]!;
    const code = statusOf(a).code;
    const key =
      code === "after-mediation" ? "afterMediation" : code === "newly-signed" ? "newlySigned" : "remaining";
    row[key] += 1;
    if (a.employees !== undefined) employeeRow[key] += a.employees;
  }

  const sum = (rows: BargainingMonthRow[]): BargainingMonthRow =>
    rows.reduce(
      (acc, r) => ({
        month: 0,
        remaining: acc.remaining + r.remaining,
        newlySigned: acc.newlySigned + r.newlySigned,
        afterMediation: acc.afterMediation + r.afterMediation,
      }),
      EMPTY(0),
    );

  return {
    year,
    agreements: months,
    employees: employeeMonths,
    agreementTotal: sum(months),
    employeeTotal: sum(employeeMonths),
  };
}

/** A month's share of the year's total, to one decimal, as MI prints it. */
export function monthShare(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 1000) / 10;
}

/**
 * An agreement reduced to what a report selection can be applied to.
 *
 * The report screen is a client component — the criteria are chosen there — so
 * the aggregation has to happen there too: filtering after aggregating gives
 * the wrong answer, and aggregating twice on the server is a round trip per
 * dropdown. This is the shape that crosses the boundary: the four facts the
 * report counts, plus the nine values MI's own criteria compare against.
 */
export interface ReportAgreement {
  id: string;
  name: string;
  /** D-001 — §5.1 excludes a marked agreement from the mediator interface. */
  confidential: boolean;
  /** The display string for the period, resolved on the server: it is
      language-dependent and a function cannot cross into a client component. */
  validity: string;
  validFrom?: string;
  expiresWithoutRenewal?: boolean;
  earlyTermination?: { date: string; party: string };
  validTo?: string;
  employees?: number;
  signedDate?: string;
  /** *Avtalet upphört* (Bilaga 3 §3.3) — read by `isCurrent`. */
  terminated?: boolean;
  mediationLinked?: boolean;
  employerOrg: string;
  employeeOrg: string;
  sector?: string;
  industryCode?: string;
  employerCentralOrg?: string;
  employeeCentralOrg?: string;
  employerGroup?: string;
  cooperationGroup?: string;
  agreementType?: string;
  /**
   * Which reports the agreement is drawn into once it is published.
   *
   * FR-009 (mi.se) and FR-010 (Eurofound, Minimilön) select on this rather than
   * on the party criteria: MI decides per agreement what goes out where, and a
   * report that re-derived the population from sector and branschkod would
   * disagree with the officer who ticked the box.
   */
  reportSelection?: {
    website: boolean;
    eurofound: boolean;
    minimumWage: boolean;
  };
}

/**
 * Narrows the register by a report's criteria.
 *
 * An empty criterion matches everything — that is what MI's `---` means, and
 * what the printed *Alla* says. `year` is not a filter here: it selects which
 * year the report is *for*, and the aggregation applies it.
 */
export function filterForReport(
  agreements: readonly ReportAgreement[],
  values: Record<string, string>,
): ReportAgreement[] {
  const match = (value: string | undefined, criterion: string | undefined) =>
    !criterion?.trim() || value === criterion;

  return agreements.filter(
    (a) =>
      match(a.employerOrg, values["employerOrg"]) &&
      match(a.employeeOrg, values["employeeOrg"]) &&
      match(a.name, values["agreement"]) &&
      match(a.sector, values["sector"]) &&
      match(a.industryCode, values["industryCode"]) &&
      match(a.employerCentralOrg, values["employerCentralOrg"]) &&
      match(a.employeeCentralOrg, values["employeeCentralOrg"]) &&
      match(a.employerGroup, values["employerGroup"]) &&
      match(a.cooperationGroup, values["cooperationGroup"]),
  );
}

/* -------------------------------------------------------------------------- */
/* Utlöpningstidpunkter — Bilaga 3 §7.11                                       */
/* -------------------------------------------------------------------------- */

/**
 * MI's seventh report, and the one Bilaga F does not contain.
 *
 * It is in the current system's user manual (Bilaga 3 §7.11) and nowhere in the
 * requirement specification, which is exactly why reading the manual was worth
 * the afternoon: MI runs a report we did not know existed.
 *
 * The manual gives its whole shape in five lines. One criterion, *Årtal*. A note
 * that says **"Endast gällande avtal ingår i rapporten"** — so it is not "which
 * agreements expired in 2027" but "of the agreements in force, which fall due
 * when". And a sort order that names its four parts: a chart by month, then
 * *Samtliga sektorer*, *Svenskt Näringsliv*, and *Svenskt Näringsliv per
 * arbetsgivargrupp*.
 *
 * That breakdown is the difference between this and Avtalsrörelserapporten.
 * Rapport 3 splits the year by FR-012's status — what has been settled. This one
 * splits it by **who signs the agreement**, which is the question an analyst
 * preparing for a round asks: how much of Svenskt Näringsliv falls due in April,
 * and in which employer groups.
 */
export interface ExpiryMonthRow {
  /** 1–12. */
  month: number;
  agreements: number;
  employees: number;
}

export interface ExpirySection {
  /** The employer group, for the third breakdown; absent for the two totals. */
  group?: string;
  months: ExpiryMonthRow[];
  totalAgreements: number;
  totalEmployees: number;
}

export interface ExpiryReport {
  year: number;
  /** Samtliga sektorer. */
  all: ExpirySection;
  /** Svenskt Näringsliv. */
  confederation: ExpirySection;
  /** Svenskt Näringsliv per arbetsgivargrupp, largest first. */
  byEmployerGroup: ExpirySection[];
}

/** The confederation the report breaks out by name, as MI's own manual does. */
export const EXPIRY_CONFEDERATION = "Svenskt Näringsliv";

/**
 * Where a member of that confederation with no employer group of its own is
 * counted. It is one of the four groups Bilaga F's Rapport 2 names — *Almega*,
 * *Industriarbetsgivarna*, *Transportföretagen*, *Övriga Svenskt Näringsliv* —
 * so an ungrouped member lands in a real group rather than in a bucket named
 * after the confederation, which is not an arbetsgivargrupp at all.
 */
export const UNGROUPED_MEMBERS = "Övriga Svenskt Näringsliv";

function emptySection(group?: string): ExpirySection {
  return {
    ...(group ? { group } : {}),
    months: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, agreements: 0, employees: 0 })),
    totalAgreements: 0,
    totalEmployees: 0,
  };
}

function add(section: ExpirySection, month: number, employees: number | undefined): void {
  const row = section.months[month - 1]!;
  row.agreements += 1;
  section.totalAgreements += 1;
  if (employees !== undefined) {
    row.employees += employees;
    section.totalEmployees += employees;
  }
}

/**
 * *"Endast gällande avtal ingår i rapporten."* — Bilaga 3 §7.11.
 *
 * **Signed, and not superseded.** An unsigned agreement is *kvarstående*: the
 * previous one is still being applied and the agreement this report is about
 * does not exist yet, so counting its expiry date would be counting a date
 * nobody has agreed to.
 *
 * It is deliberately **not** "has not run out yet". A report taken in June for
 * 2027 has to show April — the whole point is to see when the year's agreements
 * fall due, and half of them will already have fallen by the time anyone reads
 * it. An earlier draft compared `validTo` against the extraction date and
 * silently dropped two thirds of the year.
 *
 * *Avtalet upphört* is the other half, and it is not the same as having run
 * out. An expired agreement still applies until it is replaced, which is what
 * makes it *kvarstående*; a ceased one does not apply at all, so its expiry
 * date is a date nothing hangs on. MI's own Basfakta form carries the flag
 * (Bilaga 3 §3.3) and the report has to honour it.
 */
export function isCurrent(a: {
  signedDate?: string | undefined;
  terminated?: boolean | undefined;
}): boolean {
  return Boolean(a.signedDate) && a.terminated !== true;
}

export function expiryReport(
  agreements: readonly ReportAgreement[],
  year: number,
): ExpiryReport {
  const all = emptySection();
  const confederation = emptySection();
  const groups = new Map<string, ExpirySection>();

  for (const a of agreements) {
    if (!a.validTo?.startsWith(String(year))) continue;
    if (!isCurrent(a)) continue;
    const month = Number(a.validTo.slice(5, 7));
    if (!(month >= 1 && month <= 12)) continue;

    add(all, month, a.employees);
    if (a.employerCentralOrg === EXPIRY_CONFEDERATION) {
      add(confederation, month, a.employees);
      const group = a.employerGroup ?? UNGROUPED_MEMBERS;
      if (!groups.has(group)) groups.set(group, emptySection(group));
      add(groups.get(group)!, month, a.employees);
    }
  }

  return {
    year,
    all,
    confederation,
    /* Largest first: an analyst reads the groups that move the market, and MI's
       own sort is by month within each group rather than between them. */
    byEmployerGroup: [...groups.values()].sort(
      (a, b) => b.totalEmployees - a.totalEmployees || b.totalAgreements - a.totalAgreements,
    ),
  };
}

/**
 * The reports a role may run.
 *
 * MI's own staff see the catalogue, narrowed by `accessLevel` like every other
 * screen. The two roles §3.1 gives *"Specifika rapporter"* see exactly the
 * reports named for them, in Bilaga 3's own order — because "specific" is a
 * closed list, and a mediator who could reach the seventh report by guessing a
 * URL would make NFÅ-003 a navigation feature.
 */
export function reportsForRole(role: Role, isExternal: boolean): readonly ReportDefinition[] {
  if (!isExternal) return REPORTS;
  return REPORTS.filter((r) => r.externalRoles?.includes(role));
}

/* -------------------------------------------------------------------------- */
/* Avtal – Medlare, Bilaga F Rapport 5 / Bilaga 3 §7.4                        */
/* -------------------------------------------------------------------------- */

/**
 * What is released to a mediator about one agreement.
 *
 * §3.1 gives Medlare *"Specifika rapporter"* and nothing else — no Avtal, no
 * Medling, no menu past Start and Rapporter. So this report cannot be "the
 * agreement screen, go and look": the screen it pointed at is one the role is
 * refused, which made the picker offer a report whose only outcome was the
 * authorisation notice. It has to produce its own printout.
 *
 * The shape is MI's, from §7.4's own sort order — four sections in this order:
 * *Protokoll*, *Avtal*, *Medlingshandlingar*, and *Övriga avtal som
 * arbetsgivaren tecknar*. The manual's file rules come with it: a message or an
 * embedded image is not a document a mediator is being handed, so `meddelande`
 * and `image` prefixes and `.msg`/`.eml` extensions are excluded.
 *
 * *"Sekretess- och GDPR-markerad information visas ej"* heads MI's own page and
 * is applied here rather than by the screen: a mediator asking for a
 * confidentiality-marked agreement gets the marked agreement's absence, not its
 * detail with some fields blank.
 */
export interface MediatorReleaseDocument {
  id: string;
  fileName: string;
  uploadedDate: string;
}

export interface MediatorReleaseOtherAgreement {
  id: string;
  name: string;
  employeeOrg: string;
  validity: string;
}

export interface MediatorRelease {
  agreementId: string;
  name: string;
  employerOrg: string;
  employeeOrg: string;
  signedDate?: string;
  validFrom?: string;
  validTo?: string;
  expiresWithoutRenewal: boolean;
  earlyTermination?: { date: string; party: string };
  protocols: MediatorReleaseDocument[];
  agreementFiles: MediatorReleaseDocument[];
  mediationFiles: MediatorReleaseDocument[];
  otherAgreements: MediatorReleaseOtherAgreement[];
}

/** One document as this report sees it. */
export interface ReleaseDocument {
  id: string;
  fileName: string;
  uploadedDate: string;
  type: string;
  agreementId?: string;
  confidential: boolean;
}

/**
 * §7.4's own file rules, in MI's words: files whose name begins with
 * *meddelande* or *image* are out, and so are `.msg` and `.eml`. They are mail
 * artefacts that ended up on the case, not documents anybody meant to release.
 */
export function isReleasableFile(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  if (lower.startsWith("meddelande") || lower.startsWith("image")) return false;
  return !lower.endsWith(".msg") && !lower.endsWith(".eml");
}

/**
 * *Endast giltiga avtal visas* (§7.4).
 *
 * Two things disqualify an agreement, and only two: it is not in force
 * (`isCurrent`), or it is confidentiality-marked, which §5.1 excludes from the
 * mediator interface entirely.
 */
export function isReleasableToMediator(a: ReportAgreement): boolean {
  return isCurrent(a) && !a.confidential;
}

function byFileName(a: MediatorReleaseDocument, b: MediatorReleaseDocument): number {
  return a.fileName.localeCompare(b.fileName, "sv");
}

function releaseDoc(d: ReleaseDocument): MediatorReleaseDocument {
  return { id: d.id, fileName: d.fileName, uploadedDate: d.uploadedDate };
}

/**
 * Build the release for one agreement, or null if it may not be released.
 *
 * `validityOf` is passed in rather than imported, because the display string
 * for a validity period is language-dependent and this file holds no dictionary.
 */
export function mediatorRelease(
  agreement: ReportAgreement,
  documents: readonly ReleaseDocument[],
  register: readonly ReportAgreement[],
): MediatorRelease | null {
  if (!isReleasableToMediator(agreement)) return null;

  const mine = documents.filter(
    (d) => d.agreementId === agreement.id && !d.confidential && isReleasableFile(d.fileName),
  );

  const pick = (types: readonly string[]) =>
    mine.filter((d) => types.includes(d.type)).map(releaseDoc).sort(byFileName);

  return {
    agreementId: agreement.id,
    name: agreement.name,
    employerOrg: agreement.employerOrg,
    employeeOrg: agreement.employeeOrg,
    ...(agreement.signedDate ? { signedDate: agreement.signedDate } : {}),
    ...(agreement.validFrom ? { validFrom: agreement.validFrom } : {}),
    ...(agreement.validTo ? { validTo: agreement.validTo } : {}),
    expiresWithoutRenewal: agreement.expiresWithoutRenewal === true,
    ...(agreement.earlyTermination ? { earlyTermination: agreement.earlyTermination } : {}),
    protocols: pick(["protocol"]),
    agreementFiles: pick(["agreement"]),
    /* §7.4: documents on linked mediation cases — the mediator's report and the
       Director-General's decision are what a mediator is handed about a case. */
    mediationFiles: pick(["mediator-report", "dg-decision"]),
    /*
      *Övriga avtal som arbetsgivaren tecknar*, sorted by employee organisation
      then by name, which is MI's own order. This is the section that makes the
      report worth running: a mediator walking into a dispute needs to know what
      else that employer organisation has already settled.
    */
    otherAgreements: register
      .filter(
        (a) => a.id !== agreement.id && a.employerOrg === agreement.employerOrg && isReleasableToMediator(a),
      )
      .map((a) => ({
        id: a.id,
        name: a.name,
        employeeOrg: a.employeeOrg,
        validity: a.validity,
      }))
      .sort(
        (a, b) =>
          a.employeeOrg.localeCompare(b.employeeOrg, "sv") || a.name.localeCompare(b.name, "sv"),
      ),
  };
}
