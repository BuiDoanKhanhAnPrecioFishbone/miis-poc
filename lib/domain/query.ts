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

import type { OperatorId, SearchFieldId } from "./options";

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
  /** The construction of the latest wage agreement, 1–7. */
  construction?: number;
  /** `private` | `state` | `municipal`, as the sector choices are keyed. */
  sector?: string;
  validFrom?: string;
  validTo?: string;
  /** FA-012 — part of the norm-setting industry agreements. */
  industryBenchmark?: boolean;
}

/** The value a field reads off a row, as the string the criteria compare to. */
function readField(row: Searchable, field: SearchFieldId): string | undefined {
  switch (field) {
    case "construction":
      return row.construction === undefined ? undefined : String(row.construction);
    case "sector":
      return row.sector;
    case "benchmarkFlag":
      return row.industryBenchmark === undefined ? undefined : row.industryBenchmark ? "yes" : "no";
    case "validAt":
      /* Handled by `asOf`, which needs both ends rather than one value. */
      return undefined;
    default:
      return undefined;
  }
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
