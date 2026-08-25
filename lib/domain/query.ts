/**
 * FR-002 — running the query the builder builds.
 *
 * The screen composed criteria correctly and then did nothing with them: the
 * result table showed every agreement, changing a criterion left the count
 * where it was, and *Sök* was `disabled` with "Ej aktiv i demon". So the one
 * screen whose whole argument is that MI cannot currently get data out of W3D3
 * was itself a picture of a search.
 *
 * The house rule already said so — *a filter filters* — and both registers and
 * the public view obey it. This is the third place it had to be built and the
 * first where the criteria are not a flat list.
 *
 * **How the groups combine.** A condition is field × operator × value. A group
 * joins its own conditions with OCH or ELLER. The groups then join with OCH,
 * which is what makes `(A ELLER B) OCH C` expressible — the shape the builder
 * exists to demonstrate and the one W3D3's flat list cannot express.
 *
 * **An empty criterion narrows nothing.** A group with no conditions, and a
 * query with no groups, match everything: MI's own report screens print an
 * unset criterion as *Alla*, and a search that returned nothing until every box
 * was filled would be a worse instrument than the one being replaced.
 *
 * Pure domain — no React, no data access, no I/O.
 */

import type { Lang, Text } from "./lang";
import type { InfoTypeId, OperatorId, SearchFieldId } from "./options";

/** OCH or ELLER, inside one group. */
export type Join = "all" | "any";

export interface QueryCondition {
  id: string;
  field: SearchFieldId;
  operator: OperatorId;
  value: string;
}

export interface QueryGroup {
  id: string;
  join: Join;
  conditions: QueryCondition[];
}

/**
 * What a row exposes to the query.
 *
 * Deliberately not `Agreement`: the search runs over a projection assembled by
 * the data layer — an agreement's construction lives on its latest wage
 * agreement, not on the agreement itself — and a domain rule that reached for
 * that relation would need the whole register to answer one question.
 */
export interface Searchable {
  id: string;
  /**
   * What the criteria compare against, keyed by field id.
   *
   * A bag rather than named columns, because FR-002's search runs over four
   * information types — agreements, mediation cases, negotiations, parties —
   * and they share no fields at all. Naming them here would make this rule know
   * about every register in the system; the data layer knows about one each and
   * hands the values over already resolved.
   */
  facets: Record<string, string | undefined>;
  /** Both ends of a period, for the point-in-time question. Open ends allowed. */
  validFrom?: string;
  validTo?: string;
}

/** The value a field reads off a row, as the string the criteria compare to. */
function readField(row: Searchable, field: SearchFieldId): string | undefined {
  /* `validAt` is answered by `coversDate`, which needs both ends of a period
     rather than one value, so it never reaches here. */
  return row.facets[field];
}

/**
 * Whether the agreement was in force on a date — FA-020's own question.
 *
 * Both ends are open by design. An agreement with no `validTo` is *kvarstående*
 * and still in force; one with no `validFrom` has not been dated yet and cannot
 * be excluded on the strength of a date nobody registered.
 */
export function coversDate(row: Searchable, date: string): boolean {
  if (!date) return true;
  if (row.validFrom && row.validFrom > date) return false;
  if (row.validTo && row.validTo < date) return false;
  return true;
}

export function matchesCondition(row: Searchable, condition: QueryCondition): boolean {
  if (condition.operator === "asOf") return coversDate(row, condition.value);

  const actual = readField(row, condition.field);
  /*
    A row that does not carry the field is not a match for `is` and *is* a match
    for `isNot`. An agreement with no wage agreement has no construction, so it
    is genuinely not construction 3 — excluding it from "inte konstruktion 3"
    would make the two operators disagree about the same record.
  */
  if (actual === undefined) return condition.operator === "isNot";

  return condition.operator === "isNot" ? actual !== condition.value : actual === condition.value;
}

export function matchesGroup(row: Searchable, group: QueryGroup): boolean {
  if (group.conditions.length === 0) return true;
  return group.join === "any"
    ? group.conditions.some((c) => matchesCondition(row, c))
    : group.conditions.every((c) => matchesCondition(row, c));
}

/** Groups join with OCH — `(A ELLER B) OCH C`. */
export function matchesQuery(row: Searchable, groups: readonly QueryGroup[]): boolean {
  return groups.every((g) => matchesGroup(row, g));
}

export function runQuery<T extends Searchable>(
  rows: readonly T[],
  groups: readonly QueryGroup[],
): T[] {
  return rows.filter((r) => matchesQuery(r, groups));
}

/**
 * A saved search — the criteria, not the hits.
 *
 * The three names were printed at the foot of the screen as a sentence, which
 * is a claim that the feature exists rather than the feature. A saved search is
 * a selection somebody composed once and reruns; the value is that it *loads*,
 * and the data it returns is whatever the register says today, so the result is
 * never stored with it.
 *
 * They carry their information type, because a criterion means nothing without
 * the register it was written against.
 */
export interface SavedSearch {
  id: string;
  name: Text;
  /** What the officer would recognise it by — why they saved it. */
  purpose: Text;
  infoType: InfoTypeId;
  groups: QueryGroup[];
}

export const SAVED_SEARCHES: SavedSearch[] = [
  {
    id: "sifferlosa",
    name: { sv: "Sifferlösa avtal privat sektor", en: "Figureless agreements, private sector" },
    purpose: {
      sv: "Avtal utan angivet löneutrymme, inför avstämning mot Märket",
      en: "Agreements with no stated wage scope, for checking against Märket",
    },
    infoType: "agreements",
    groups: [
      {
        id: "g0",
        join: "any",
        conditions: [
          { id: "g0c0", field: "construction", operator: "is", value: "1" },
          { id: "g0c1", field: "construction", operator: "is", value: "2" },
        ],
      },
      {
        id: "g1",
        join: "all",
        conditions: [{ id: "g1c0", field: "sector", operator: "is", value: "private" }],
      },
    ],
  },
  {
    id: "eurofound",
    name: { sv: "Eurofound-urval", en: "Eurofound selection" },
    purpose: {
      sv: "Industrins avtal, underlag för internationell rapportering",
      en: "Industry agreements, source for international reporting",
    },
    infoType: "agreements",
    groups: [
      {
        id: "g0",
        join: "all",
        conditions: [{ id: "g0c0", field: "benchmarkFlag", operator: "is", value: "yes" }],
      },
    ],
  },
  {
    id: "pagaende-medling",
    name: { sv: "Pågående medlingar", en: "Ongoing mediations" },
    purpose: {
      sv: "Ärenden där MI utser medlare, dvs. utan förhandlingsordning",
      en: "Cases where MI appoints mediators, i.e. with no procedure agreement",
    },
    infoType: "mediation",
    groups: [
      {
        id: "g0",
        join: "all",
        conditions: [
          { id: "g0c0", field: "mediationOngoing", operator: "is", value: "yes" },
          { id: "g0c1", field: "procedureAgreement", operator: "is", value: "no" },
        ],
      },
    ],
  },
];

/** How many conditions a saved search carries, for the label beside its name. */
export function conditionCount(search: SavedSearch): number {
  return search.groups.reduce((n, g) => n + g.conditions.length, 0);
}

/** The saved search written out the way the builder writes the live one. */
export function savedSearchSummary(search: SavedSearch, lang: Lang): string {
  return search.purpose[lang];
}
