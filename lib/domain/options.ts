/**
 * The option catalogue — what a user can choose, and what follows from choosing it.
 *
 * FR-002 asks for "selection criteria on all relevant properties combinable with
 * and/or". Three dropdowns that ignore each other would satisfy the picture and
 * not the requirement: choosing *Avtalskonstruktion* has to change which
 * operators make sense and which values exist. So the field owns its operators
 * and its value kind, and the query builder reads that rather than guessing.
 *
 * Values come in three kinds because the requirements need exactly three: a
 * closed list (FA-007's seven constructions, FP-001's three sectors), a date
 * (FA-020 / FH-003, "valid at a given point in time"), and a boolean flag
 * (FA-012's industry benchmark). Nothing here needs free text — FR-003's
 * free-text search is its own field on the screen, not a criterion value.
 *
 * Identifiers are English; user-facing strings exist in both languages.
 * Pure domain — no imports beyond sibling types, no I/O.
 */

import { AGREEMENT_CONSTRUCTIONS, SECTOR_LABEL, type Sector } from "./agreement";
import type { Lang, Text } from "./lang";

export type OperatorId = "is" | "isNot" | "asOf";

export const OPERATOR_LABEL: Record<OperatorId, Text> = {
  is: { sv: "är", en: "is" },
  isNot: { sv: "är inte", en: "is not" },
  asOf: { sv: "per", en: "as at" },
};

export type SearchFieldId = "construction" | "sector" | "validAt" | "benchmarkFlag";

export interface Choice {
  id: string;
  label: Text;
}

/** What the third control in a condition row turns into. */
export type ValueKind =
  | { kind: "choice"; choices: Choice[] }
  | { kind: "date"; placeholder: string };

export interface SearchFieldDef {
  id: SearchFieldId;
  label: Text;
  operators: OperatorId[];
  value: ValueKind;
}

const CONSTRUCTION_CHOICES: Choice[] = ([1, 2, 3, 4, 5, 6, 7] as const).map((n) => ({
  id: String(n),
  label: {
    sv: `${n}. ${AGREEMENT_CONSTRUCTIONS.sv[n]}`,
    en: `${n}. ${AGREEMENT_CONSTRUCTIONS.en[n]}`,
  },
}));

const SECTOR_CHOICES: Choice[] = (["private", "state", "municipal"] as const).map(
  (s: Sector) => ({
    id: s,
    label: { sv: SECTOR_LABEL.sv[s], en: SECTOR_LABEL.en[s] },
  }),
);

const YES_NO: Choice[] = [
  { id: "yes", label: { sv: "Ja", en: "Yes" } },
  { id: "no", label: { sv: "Nej", en: "No" } },
];

export const SEARCH_FIELDS: SearchFieldDef[] = [
  {
    id: "construction",
    label: { sv: "Avtalskonstruktion", en: "Agreement construction" },
    operators: ["is", "isNot"],
    value: { kind: "choice", choices: CONSTRUCTION_CHOICES },
  },
  {
    id: "sector",
    label: { sv: "Sektor", en: "Sector" },
    operators: ["is", "isNot"],
    value: { kind: "choice", choices: SECTOR_CHOICES },
  },
  {
    id: "validAt",
    label: { sv: "Giltig vid tidpunkt", en: "Valid at" },
    operators: ["asOf"],
    value: { kind: "date", placeholder: "2026-12-31" },
  },
  {
    id: "benchmarkFlag",
    label: { sv: "Industrimärke", en: "Industry benchmark" },
    operators: ["is"],
    value: { kind: "choice", choices: YES_NO },
  },
];

export function searchField(id: SearchFieldId): SearchFieldDef {
  return SEARCH_FIELDS.find((f) => f.id === id) ?? SEARCH_FIELDS[0]!;
}

/** The first value a field offers, used when the field changes under a condition. */
export function defaultValueFor(field: SearchFieldDef): string {
  return field.value.kind === "choice" ? (field.value.choices[0]?.id ?? "") : field.value.placeholder;
}

/** The label to print for a stored value — a date prints itself. */
export function valueLabel(field: SearchFieldDef, value: string, lang: Lang): string {
  if (field.value.kind === "date") return value;
  return field.value.choices.find((c) => c.id === value)?.label[lang] ?? value;
}

/**
 * The document types a single search may span (§2.5).
 *
 * Today's query builder is "limited to two document types simultaneously" and
 * needs technical helper variables to get that far. Being able to tick all four
 * at once is the concrete thing this screen exists to demonstrate, so they have
 * to be genuinely selectable — a static row of chips proves nothing.
 */
export const DOCUMENT_TYPE_CHOICES: Choice[] = [
  { id: "wage", label: { sv: "Löneavtal", en: "Wage agreement" } },
  { id: "terms", label: { sv: "Allmänna villkor", en: "General terms" } },
  { id: "pension", label: { sv: "Pensionsavtal", en: "Pension agreement" } },
  { id: "other", label: { sv: "Övriga avtal", en: "Other agreements" } },
];

/** FR-002 — the information type the whole search runs against. */
export type InfoTypeId = "agreements" | "mediation" | "negotiations" | "parties";

export const INFO_TYPES: Choice[] = [
  { id: "agreements", label: { sv: "Avtalsinformation", en: "Agreement information" } },
  { id: "mediation", label: { sv: "Medlingsinformation", en: "Mediation information" } },
  { id: "negotiations", label: { sv: "Förhandlingar", en: "Negotiations" } },
  { id: "parties", label: { sv: "Parter", en: "Parties" } },
];
