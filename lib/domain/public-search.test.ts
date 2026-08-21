import { describe, expect, it } from "vitest";

import {
  coversDate,
  hasCriteria,
  matchesText,
  publicSearch,
  type PublicSearchable,
} from "./public-search";

const agreement = (over: Partial<PublicSearchable> = {}): PublicSearchable => ({
  id: "A-001",
  name: "Stål- och metallindustrin",
  agreementArea: "Stål och metall",
  employerOrg: { id: "P-010", name: "Industriarbetsgivarna" },
  employeeOrg: { id: "P-020", name: "IF Metall" },
  validFrom: "2027-04-01",
  validTo: "2029-03-31",
  ...over,
});

describe("matchesText — FR-003", () => {
  const a = agreement();

  it("matches the agreement name", () => {
    expect(matchesText(a, "metallindustrin")).toBe(true);
  });

  it("matches the agreement area", () => {
    expect(matchesText(a, "Stål och metall")).toBe(true);
  });

  it("matches either party", () => {
    expect(matchesText(a, "IF Metall")).toBe(true);
    expect(matchesText(a, "Industriarbetsgivarna")).toBe(true);
  });

  /* A visitor types what they remember, not what is in the register. */
  it("ignores case, including Swedish letters", () => {
    expect(matchesText(a, "STÅL")).toBe(true);
    expect(matchesText(a, "if metall")).toBe(true);
  });

  it("does not match something the agreement has nothing to do with", () => {
    expect(matchesText(a, "Apotek")).toBe(false);
  });

  it("treats an empty query as no query", () => {
    expect(matchesText(a, "   ")).toBe(true);
  });
});

/**
 * FA-020 on the public view. The cases that matter are the two open ends: MI
 * registers agreements it has not been told have ended, and *kvarstående*
 * agreements with no period at all — and a visitor asking "what applies now" is
 * asking about exactly those.
 */
describe("coversDate — FA-020", () => {
  it("includes a date inside the period", () => {
    expect(coversDate(agreement(), "2028-01-01")).toBe(true);
  });

  it("includes both boundaries", () => {
    expect(coversDate(agreement(), "2027-04-01")).toBe(true);
    expect(coversDate(agreement(), "2029-03-31")).toBe(true);
  });

  it("excludes a date before and after", () => {
    expect(coversDate(agreement(), "2027-03-31")).toBe(false);
    expect(coversDate(agreement(), "2029-04-01")).toBe(false);
  });

  it("counts an open end as covering", () => {
    expect(coversDate({ validFrom: "2027-04-01" }, "2099-01-01")).toBe(true);
    expect(coversDate({ validTo: "2029-03-31" }, "1999-01-01")).toBe(true);
  });

  it("counts an agreement with no period at all as covering", () => {
    expect(coversDate({}, "2028-01-01")).toBe(true);
  });
});

describe("publicSearch", () => {
  const list = [
    agreement(),
    agreement({
      id: "A-004",
      name: "Apotek",
      agreementArea: "Apotek",
      employerOrg: { id: "P-012", name: "Almega Tjänsteförbunden" },
      employeeOrg: { id: "P-030", name: "Sveriges Farmaceuter" },
      validFrom: "2027-06-01",
      validTo: "2028-05-31",
    }),
    agreement({
      id: "A-005",
      name: "Kommunikation",
      agreementArea: "Kommunikation",
      /* Its own parties. Leaving the fixture's default IF Metall here made
         "metall" match this row too — correct behaviour, wrong fixture. */
      employerOrg: { id: "P-012", name: "Almega Tjänsteförbunden" },
      employeeOrg: { id: "P-021", name: "Seko" },
    }),
  ];

  it("returns everything when nothing is narrowed", () => {
    expect(publicSearch(list, {})).toHaveLength(3);
  });

  /* Almega Tjänsteförbunden signs both Apotek and Kommunikation, which is true
     of the real register too — one employer organisation, many agreements. */
  it("narrows by employer organisation", () => {
    expect(publicSearch(list, { employerOrgId: "P-012" }).map((a) => a.id)).toEqual([
      "A-004",
      "A-005",
    ]);
  });

  it("narrows by agreement", () => {
    expect(publicSearch(list, { agreementId: "A-005" }).map((a) => a.id)).toEqual(["A-005"]);
  });

  it("combines free text with a criterion", () => {
    expect(publicSearch(list, { text: "metall", employerOrgId: "P-010" }).map((a) => a.id)).toEqual([
      "A-001",
    ]);
  });

  it("returns nothing when the combination matches nothing", () => {
    expect(publicSearch(list, { text: "Apotek", employerOrgId: "P-010" })).toHaveLength(0);
  });

  it("narrows by the date the agreement was valid at", () => {
    expect(publicSearch(list, { validAt: "2027-05-01" }).map((a) => a.id)).toEqual([
      "A-001",
      "A-005",
    ]);
  });
});

describe("hasCriteria", () => {
  it("is false for nothing set", () => {
    expect(hasCriteria({})).toBe(false);
    expect(hasCriteria({ text: "  " })).toBe(false);
  });

  it("is true for any one criterion", () => {
    expect(hasCriteria({ text: "metall" })).toBe(true);
    expect(hasCriteria({ validAt: "2027-01-01" })).toBe(true);
    expect(hasCriteria({ agreementId: "A-001" })).toBe(true);
  });
});
