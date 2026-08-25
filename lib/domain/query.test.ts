import { describe, expect, it } from "vitest";

import {
  coversDate,
  matchesCondition,
  matchesGroup,
  matchesQuery,
  runQuery,
  type QueryGroup,
  type Searchable,
} from "./query";

const row = (
  id: string,
  facets: Record<string, string | undefined>,
  validFrom?: string,
  validTo?: string,
): Searchable => ({ id, facets, ...(validFrom ? { validFrom } : {}), ...(validTo ? { validTo } : {}) });

const rows: Searchable[] = [
  row("A", { construction: "1", sector: "private", benchmarkFlag: "yes" }, "2027-04-01", "2029-03-31"),
  row("B", { construction: "2", sector: "private", benchmarkFlag: "no" }, "2027-05-01", "2029-04-30"),
  row("C", { construction: "3", sector: "municipal", benchmarkFlag: "no" }, "2027-06-01", "2029-05-31"),
  /* Kvarstående — no end date, and still in force. */
  row("D", { construction: "1", sector: "state", benchmarkFlag: "no" }, "2025-01-01"),
  /* No wage agreement yet, so no construction to compare against. */
  row("E", { sector: "private" }, "2027-04-01", "2029-03-31"),
];

const cond = (field: string, operator: string, value: string) =>
  ({ id: "c", field, operator, value }) as never;

describe("matchesCondition", () => {
  it("compares a choice with is and isNot", () => {
    expect(matchesCondition(rows[0]!, cond("construction", "is", "1"))).toBe(true);
    expect(matchesCondition(rows[0]!, cond("construction", "is", "2"))).toBe(false);
    expect(matchesCondition(rows[0]!, cond("construction", "isNot", "2"))).toBe(true);
  });

  it("reads the benchmark flag as yes/no", () => {
    expect(matchesCondition(rows[0]!, cond("benchmarkFlag", "is", "yes"))).toBe(true);
    expect(matchesCondition(rows[1]!, cond("benchmarkFlag", "is", "yes"))).toBe(false);
  });

  /*
    A row that does not carry the field is not `is` and *is* `isNot`. An
    agreement with no wage agreement genuinely is not construction 3, and
    excluding it from "inte konstruktion 3" would make the two operators
    disagree about the same record.
  */
  it("treats an absent field as not-matching for is and matching for isNot", () => {
    expect(matchesCondition(rows[4]!, cond("construction", "is", "3"))).toBe(false);
    expect(matchesCondition(rows[4]!, cond("construction", "isNot", "3"))).toBe(true);
  });
});

describe("coversDate — the point-in-time question", () => {
  it("includes an agreement whose period spans the date", () => {
    expect(coversDate(rows[0]!, "2028-01-01")).toBe(true);
  });

  it("excludes one that had not started or had ended", () => {
    expect(coversDate(rows[0]!, "2027-01-01")).toBe(false);
    expect(coversDate(rows[0]!, "2030-01-01")).toBe(false);
  });

  /* Kvarstående: no end date is still in force, not expired. */
  it("keeps an agreement with no end date", () => {
    expect(coversDate(rows[3]!, "2030-01-01")).toBe(true);
  });

  it("narrows nothing when no date is given", () => {
    expect(coversDate(rows[0]!, "")).toBe(true);
  });
});

describe("groups", () => {
  it("joins its own conditions with ELLER", () => {
    const g: QueryGroup = {
      id: "g",
      join: "any",
      conditions: [cond("construction", "is", "1"), cond("construction", "is", "2")],
    };
    expect(rows.filter((r) => matchesGroup(r, g)).map((r) => r.id)).toEqual(["A", "B", "D"]);
  });

  it("joins its own conditions with OCH", () => {
    const g: QueryGroup = {
      id: "g",
      join: "all",
      conditions: [cond("construction", "is", "1"), cond("sector", "is", "private")],
    };
    expect(rows.filter((r) => matchesGroup(r, g)).map((r) => r.id)).toEqual(["A"]);
  });

  /* MI's report screens print an unset criterion as "Alla"; a search that
     returned nothing until every box was filled would be worse than W3D3. */
  it("narrows nothing when it holds no conditions", () => {
    expect(matchesGroup(rows[0]!, { id: "g", join: "all", conditions: [] })).toBe(true);
  });
});

describe("the whole query", () => {
  /*
    `(konstruktion 1 ELLER 2) OCH sektor privat` — the shape the builder exists
    to demonstrate, and the one W3D3's flat list cannot express.
  */
  it("combines groups with OCH", () => {
    const groups: QueryGroup[] = [
      {
        id: "g0",
        join: "any",
        conditions: [cond("construction", "is", "1"), cond("construction", "is", "2")],
      },
      { id: "g1", join: "all", conditions: [cond("sector", "is", "private")] },
    ];
    expect(runQuery(rows, groups).map((r) => r.id)).toEqual(["A", "B"]);
  });

  it("returns everything for an empty query", () => {
    expect(runQuery(rows, []).map((r) => r.id)).toEqual(["A", "B", "C", "D", "E"]);
    expect(matchesQuery(rows[0]!, [])).toBe(true);
  });

  it("can return nothing, and says so by returning nothing", () => {
    const groups: QueryGroup[] = [
      { id: "g", join: "all", conditions: [cond("sector", "is", "private"), cond("sector", "is", "state")] },
    ];
    expect(runQuery(rows, groups)).toEqual([]);
  });

  it("applies a point-in-time criterion alongside the others", () => {
    const groups: QueryGroup[] = [
      {
        id: "g",
        join: "all",
        conditions: [cond("sector", "is", "private"), cond("validAt", "asOf", "2027-04-15")],
      },
    ];
    /* B starts 2027-05-01, so it was not yet in force on 15 April. */
    expect(runQuery(rows, groups).map((r) => r.id)).toEqual(["A", "E"]);
  });
});
