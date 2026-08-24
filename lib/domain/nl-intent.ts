/**
 * Natural-language intent — a typed sentence turned into a *proposed* selection.
 *
 * **What this is, and what it is not.** Appendix 1 §4.1 names four AI functions
 * and this is not one of them: it is added value the supplier offers on top,
 * asked for by Medlingsinstitutet's own side after the four were built. That
 * matters for two reasons and both are honoured here. Bilaga 2 §3.6 forbids
 * introducing new commitments at the oral presentation, so it is described in
 * the written response rather than demonstrated as a surprise. And FAI-002 is
 * not relaxed because a function sits outside §4.1 — *"alla förslag som
 * systemet genererar ska granskas och godkännas av användaren innan de sparas"*
 * is a rule about proposals, not about which four produced them.
 *
 * **It does not generate; it reads.** The parser matches the register's own
 * vocabulary — the criteria on `/sok`, the reports in `REPORTS`, the sectors and
 * constructions MI defines — and proposes a selection built from it. Nothing is
 * invented, which is what lets every proposed condition point back at the words
 * it was read from, the way §4.1's own functions source-link into the protocol.
 * A parser that guessed would be indistinguishable from one that answered, and
 * an authority cannot defend a selection it cannot account for.
 *
 * **What it could not place is shown.** `unused` carries the words the parser
 * ignored. A proposal that silently drops half the question is one the officer
 * cannot check, and checking it is the whole of FAI-002.
 *
 * Pure domain — no React, no data access, no I/O.
 */

import { AGREEMENT_CONSTRUCTIONS, SECTOR_LABEL } from "./agreement";
import type { Lang } from "./lang";
import {
  SEARCH_FIELDS_BY_TYPE,
  type InfoTypeId,
  type OperatorId,
  type SearchFieldId,
} from "./options";
import { REPORTS } from "./report";

/* -------------------------------------------------------------------------- */
/* Shared shape                                                               */
/* -------------------------------------------------------------------------- */

/**
 * One proposed criterion, and the words that produced it.
 *
 * `source` is the source link. §4.1's protocol functions highlight the passage
 * a value was read from, and a proposal about a *question* owes the officer the
 * same thing: this is the phrase in their own sentence that the machine acted
 * on, so an officer who disagrees can see which word misled it.
 */
export interface ProposedCondition {
  field: SearchFieldId;
  operator: OperatorId;
  value: string;
  source: string;
}

export interface SearchIntent {
  infoType: InfoTypeId;
  /** The word that chose the register, when a word did. */
  infoTypeSource?: string;
  conditions: readonly ProposedCondition[];
  /** Words the parser could not place, in the order they were typed. */
  unused: readonly string[];
}

export interface ProposedReportCriterion {
  id: string;
  value: string;
  source: string;
}

export interface ReportIntent {
  reportId?: string;
  reportSource?: string;
  criteria: readonly ProposedReportCriterion[];
  unused: readonly string[];
}

/* -------------------------------------------------------------------------- */
/* Tokenising                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Words that carry no selection and must not be reported as unread.
 *
 * Without this every proposal ended with *"kunde inte tolka: som, med, för"*,
 * which trains an officer to stop reading the one line that tells them what the
 * machine missed.
 */
const NOISE = new Set([
  // Swedish
  "och", "eller", "som", "med", "för", "från", "till", "i", "på", "av", "den", "det",
  "de", "en", "ett", "är", "var", "vilka", "vilket", "vilken", "alla", "visa", "hitta",
  "sök", "söka", "lista", "ta", "fram", "har", "hade", "gäller", "gällde", "gällt",
  "gällande", "giltig", "giltiga", "löper", "finns", "om", "under", "över",
  "mellan", "samt", "kan", "ska", "skall", "vill", "jag", "vi", "man", "att", "där",
  // English
  "and", "or", "with", "for", "from", "to", "in", "on", "of", "the", "a", "an", "is",
  "are", "was", "were", "which", "what", "all", "show", "find", "list", "search",
  "get", "give", "me", "i", "we", "that", "where", "can", "should", "will", "do",
  // prepositions the value phrases sit inside
  "inom", "hos", "per", "efter", "före", "sedan", "within", "at", "by", "after",
]);

/**
 * The criteria's own names, which are not values and are not unread words.
 *
 * "privat sektor" is one thing said once: *privat* is the value and *sektor* is
 * the field it belongs to. Reporting the field name back as something the
 * machine could not read is exactly the noise `NOISE` exists to stop.
 *
 * Derived rather than listed, so a criterion renamed in `options.ts` cannot
 * leave a stale word behind here.
 */
const FIELD_NAME_WORDS = new Set(
  Object.values(SEARCH_FIELDS_BY_TYPE)
    .flat()
    .flatMap((f) => [f.label.sv, f.label.en])
    .flatMap((label) => label.toLowerCase().split(/[\s()]+/))
    .filter((w) => w.length > 2),
);

/** Words that flip a match to *is not*, when the field offers the operator. */
const NEGATORS = new Set([
  "inte", "ej", "utom", "förutom", "exklusive", "not", "except", "excluding", "without",
  "utan",
]);

/** How many words back a negator still reaches. */
const NEGATION_WINDOW = 3;

function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[.,;:!?()[\]{}"'`]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/** Is the match at `index` negated by a word shortly before it? */
function negated(tokens: readonly string[], index: number): boolean {
  for (let i = Math.max(0, index - NEGATION_WINDOW); i < index; i++) {
    if (NEGATORS.has(tokens[i]!)) return true;
  }
  return false;
}

/**
 * Where a phrase begins in the token list, or -1.
 *
 * Phrase rather than word, because MI's own vocabulary is full of compounds —
 * *tecknat efter medling*, *avtal om allmänna villkor* — and matching only
 * single tokens would read "medling" out of "tecknat efter medling" and propose
 * the wrong register.
 */
function phraseAt(tokens: readonly string[], phrase: string): number {
  const parts = phrase.split(/\s+/);
  outer: for (let i = 0; i + parts.length <= tokens.length; i++) {
    for (let j = 0; j < parts.length; j++) {
      const token = tokens[i + j]!;
      const part = parts[j]!;
      /* Prefix match, so *avtalen* and *privata* hit *avtal* and *privat*.
         Swedish inflects the noun rather than adding a separate article. */
      if (!token.startsWith(part)) continue outer;
    }
    return i;
  }
  return -1;
}

/* -------------------------------------------------------------------------- */
/* Vocabulary                                                                 */
/* -------------------------------------------------------------------------- */

/** Which register a word points at. First match wins, longest phrase first. */
const INFO_TYPE_WORDS: readonly (readonly [InfoTypeId, string])[] = [
  ["mediation", "medlingsärende"],
  ["mediation", "medling"],
  ["mediation", "mediation"],
  ["negotiations", "förhandling"],
  ["negotiations", "negotiation"],
  ["parties", "arbetsgivarorganisation"],
  ["parties", "arbetstagarorganisation"],
  ["parties", "parter"],
  ["parties", "part"],
  ["parties", "part"],
  ["parties", "parties"],
  ["parties", "party"],
  ["agreements", "kollektivavtal"],
  ["agreements", "avtal"],
  ["agreements", "agreement"],
];

/** The value vocabulary, per field. Built from MI's own labels plus synonyms. */
function valueWords(lang: Lang): readonly (readonly [SearchFieldId, string, string])[] {
  const out: (readonly [SearchFieldId, string, string])[] = [];

  /* Sector, under both ids: an agreement's sector and a party's are different
     links to the same word, which is why `options.ts` carries it twice. */
  const sectors = ["private", "state", "municipal"] as const;
  for (const s of sectors) {
    for (const field of ["sector", "partySector"] as const) {
      out.push([field, s, SECTOR_LABEL[lang][s].toLowerCase()]);
      out.push([field, s, SECTOR_LABEL.sv[s].toLowerCase()]);
    }
  }
  /* MI writes *Kommunal och regional*; an officer says *kommun* or *region*. */
  for (const field of ["sector", "partySector"] as const) {
    out.push([field, "municipal", "kommun"]);
    out.push([field, "municipal", "region"]);
    out.push([field, "state", "statlig"]);
    out.push([field, "state", "staten"]);
  }

  /* The seven constructions, by number and by MI's own name. */
  for (const n of [1, 2, 3, 4, 5, 6, 7] as const) {
    out.push(["construction", String(n), `konstruktion ${n}`]);
    out.push(["construction", String(n), `construction ${n}`]);
    out.push(["construction", String(n), AGREEMENT_CONSTRUCTIONS[lang][n].toLowerCase()]);
  }

  out.push(["benchmarkFlag", "yes", "märket"]);
  out.push(["benchmarkFlag", "yes", "industrimärke"]);
  out.push(["benchmarkFlag", "yes", "märkessättande"]);
  out.push(["benchmarkFlag", "yes", "benchmark"]);

  out.push(["mediationType", "special", "särskild medling"]);
  out.push(["mediationType", "standing", "fast medling"]);
  out.push(["mediationOngoing", "yes", "pågående"]);
  out.push(["mediationOngoing", "yes", "ongoing"]);

  out.push(["negotiationStatus", "ongoing", "pågående"]);
  out.push(["negotiationStatus", "closed-with-agreement", "avslutad med avtal"]);
  out.push(["negotiationStatus", "closed-without-agreement", "avslutad utan avtal"]);
  out.push(["negotiationType", "bargaining-round", "avtalsrörelse"]);

  out.push(["partyType", "employer", "arbetsgivarorganisation"]);
  out.push(["partyType", "employee", "arbetstagarorganisation"]);
  out.push(["partyType", "employee", "fackförbund"]);

  /* Longest phrase first, so *avslutad med avtal* is not eaten by *avtal*. */
  return out.sort((a, b) => b[2].length - a[2].length);
}

/** A word that says nothing about the selection, either way. */
function ignorable(token: string): boolean {
  return token.length < 3 || NOISE.has(token) || FIELD_NAME_WORDS.has(token);
}

const ISO_DATE = /^20\d{2}-\d{2}-\d{2}$/;
const YEAR = /^(20\d{2})$/;

/* -------------------------------------------------------------------------- */
/* Search                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Read a sentence as a selection on `/sok`.
 *
 * The register is chosen first, because FR-002's *val av informationstyp* is a
 * choice of **what is searched** and the criteria differ per type — proposing a
 * condition the chosen register cannot answer would be the tab-strip defect
 * again, this time written by a machine.
 */
export function searchIntent(text: string, lang: Lang = "sv"): SearchIntent {
  const tokens = tokenise(text);
  const claimed = new Set<number>();

  let infoType: InfoTypeId = "agreements";
  let infoTypeSource: string | undefined;
  for (const [type, word] of INFO_TYPE_WORDS) {
    const at = phraseAt(tokens, word);
    if (at >= 0) {
      infoType = type;
      infoTypeSource = tokens[at];
      claimed.add(at);
      break;
    }
  }

  const allowed = new Set(SEARCH_FIELDS_BY_TYPE[infoType].map((f) => f.id));
  const fieldOperators = new Map(
    SEARCH_FIELDS_BY_TYPE[infoType].map((f) => [f.id, f.operators]),
  );
  const conditions: ProposedCondition[] = [];
  const used = new Set<SearchFieldId>();

  for (const [field, value, phrase] of valueWords(lang)) {
    if (!allowed.has(field) || used.has(field)) continue;
    const at = phraseAt(tokens, phrase);
    if (at < 0) continue;
    const span = phrase.split(/\s+/).length;
    for (let i = at; i < at + span; i++) claimed.add(i);

    const operators = fieldOperators.get(field) ?? [];
    const wantsNot = negated(tokens, at) && operators.includes("isNot");
    conditions.push({
      field,
      operator: wantsNot ? "isNot" : (operators[0] ?? "is"),
      value,
      source: tokens.slice(at, at + span).join(" "),
    });
    used.add(field);
  }

  /* A date or a year is *giltig vid tidpunkt*, where the register offers it. */
  if (allowed.has("validAt") && !used.has("validAt")) {
    for (const [i, token] of tokens.entries()) {
      if (claimed.has(i)) continue;
      const iso = ISO_DATE.test(token) ? token : null;
      const year = YEAR.exec(token)?.[1];
      if (!iso && !year) continue;
      claimed.add(i);
      conditions.push({
        field: "validAt",
        operator: "asOf",
        /* A bare year means the end of it: MI's reports are taken for a year,
           and 2027-01-01 would answer a different question than the one asked. */
        value: iso ?? `${year}-12-31`,
        source: token,
      });
      used.add("validAt");
      break;
    }
  }

  const unused = tokens
    .map((t, i) => (claimed.has(i) || ignorable(t) ? null : t))
    .filter((t): t is string => t !== null);

  return {
    infoType,
    ...(infoTypeSource ? { infoTypeSource } : {}),
    conditions,
    unused: [...new Set(unused)],
  };
}

/* -------------------------------------------------------------------------- */
/* Reports                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * The words that pick a report, taken from MI's own names.
 *
 * Every report is called *Avtal – something*, so the distinguishing half is
 * what is matched: matching the full label would need the officer to type MI's
 * punctuation, and matching "avtal" would pick the first report every time.
 */
function reportWords(lang: Lang): readonly (readonly [string, string])[] {
  const out: (readonly [string, string])[] = [];
  for (const report of REPORTS) {
    for (const l of ["sv", "en"] as const) {
      const label = report.label[l].toLowerCase();
      const tail = label.includes("–") ? label.split("–").pop()!.trim() : label;
      if (tail) out.push([report.id, tail]);
    }
  }
  /* What an officer says instead of the report's filed name. */
  out.push(["utlopningstidpunkter", "löper ut"]);
  out.push(["utlopningstidpunkter", "utlöper"]);
  out.push(["utlopningstidpunkter", "expires"]);
  out.push(["avtalskonstruktioner", "konstruktion"]);
  out.push(["allmanheten", "publik"]);
  out.push(["pensionsavtal", "pension"]);
  return out.sort((a, b) => b[1].length - a[1].length);
}

/**
 * The catalogue's own words, which name a report rather than go unread.
 *
 * Every report is *Avtal – something*, so "avtal" is the catalogue speaking and
 * not a term the parser failed on.
 */
const REPORT_NAME_WORDS = new Set(
  REPORTS.flatMap((r) => [r.label.sv, r.label.en])
    .flatMap((label) => label.toLowerCase().split(/[\s–()/-]+/))
    .filter((w) => w.length > 2),
);

/** Which report criteria this parser can fill, and from what. */
const REPORT_VALUE_FIELDS = new Set(["year", "sector"]);

/**
 * Read a sentence as a report and its urvalskriterier.
 *
 * The report is proposed, never run. Bilaga F opens by saying every report is
 * *urvalsbild och resultat*, and a machine that pressed the button would have
 * skipped the first half — the officer has to see what was selected before the
 * result exists, which is exactly the thing FAI-002 protects.
 */
export function reportIntent(text: string, lang: Lang = "sv"): ReportIntent {
  const tokens = tokenise(text);
  const claimed = new Set<number>();

  let reportId: string | undefined;
  let reportSource: string | undefined;
  for (const [id, phrase] of reportWords(lang)) {
    const at = phraseAt(tokens, phrase);
    if (at < 0) continue;
    reportId = id;
    const span = phrase.split(/\s+/).length;
    for (let i = at; i < at + span; i++) claimed.add(i);
    reportSource = tokens.slice(at, at + span).join(" ");
    break;
  }

  const report = REPORTS.find((r) => r.id === reportId);
  const criteria: ProposedReportCriterion[] = [];

  if (report) {
    const offered = new Set(report.criteria.map((c) => c.id));

    if (offered.has("year")) {
      for (const [i, token] of tokens.entries()) {
        if (claimed.has(i)) continue;
        const year = YEAR.exec(token)?.[1];
        if (!year) continue;
        claimed.add(i);
        criteria.push({ id: "year", value: year, source: token });
        break;
      }
    }

    if (offered.has("sector")) {
      for (const s of ["private", "state", "municipal"] as const) {
        for (const label of [SECTOR_LABEL[lang][s], SECTOR_LABEL.sv[s]]) {
          const at = phraseAt(tokens, label.toLowerCase());
          if (at < 0) continue;
          claimed.add(at);
          criteria.push({ id: "sector", value: s, source: tokens[at]! });
          break;
        }
        if (criteria.some((c) => c.id === "sector")) break;
      }
    }
  }

  const unused = tokens
    .map((t, i) => (claimed.has(i) || ignorable(t) || REPORT_NAME_WORDS.has(t) ? null : t))
    .filter((t): t is string => t !== null);

  return {
    ...(reportId ? { reportId } : {}),
    ...(reportSource ? { reportSource } : {}),
    criteria: criteria.filter((c) => REPORT_VALUE_FIELDS.has(c.id)),
    unused: [...new Set(unused)],
  };
}

/** Did the parser find anything at all worth proposing? */
export function hasProposal(intent: SearchIntent | ReportIntent): boolean {
  if ("infoType" in intent) {
    return intent.conditions.length > 0 || Boolean(intent.infoTypeSource);
  }
  return Boolean(intent.reportId);
}
