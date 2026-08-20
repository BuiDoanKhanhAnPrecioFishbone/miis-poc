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
 *   information excluded from both.
 * - **Rapport 4, Huvudrapport**, has no FR of its own. It is the complete record
 *   for one agreement — basfakta, omfattning, lön, arbetstid, pension, ledighet,
 *   löneavtal, lönerevision — i.e. the agreement view, printed, which is why it
 *   points at `/avtal/[id]` rather than duplicating it.
 * - **FR-009** (MI's website) and **FR-010** (Eurofound, Minimilön) are Steg 2
 *   in MI's own table and are listed as such rather than drawn.
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
  | "central-org"
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

/** Where a generated report actually appears in MIIS. */
export type ReportResult =
  /** Built here, from the register. */
  | { kind: "inline"; component: "constructions" | "bargaining-round" }
  /** A screen that already is this printout — the report sends you there. */
  | { kind: "screen"; href: string }
  /** Named in MI's table as Steg 2, and stated rather than drawn. */
  | { kind: "stage-2" };

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
    kind: "central-org",
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
    kind: "central-org",
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
    result: { kind: "screen", href: "/allmanheten" },
    bilagaF: 1,
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
    result: { kind: "screen", href: "/avtal" },
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
    result: { kind: "screen", href: "/avtal" },
    bilagaF: 5,
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
    result: { kind: "screen", href: "/avtal" },
    bilagaF: 6,
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
    result: { kind: "screen", href: "/rapporter#konjunkturlon" },
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
    result: { kind: "stage-2" },
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
    result: { kind: "stage-2" },
  },
] as const;

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
  validTo?: string;
  employees?: number;
  signedDate?: string;
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
