import { describe, expect, it } from "vitest";

import type { Party } from "./party";
import { nameAtDate, predecessorsOf, successorOf } from "./party";

/**
 * FP-002 — *"register över arbetstagarorganisationer (ATO) med historik för
 * namnbyten och organisatoriska förändringar"*. This is the rule that makes
 * historical reporting honest: an agreement signed in 2019 must show the party
 * under the name it had in 2019, not the name it carries today. Get it wrong
 * and every report about the past quietly rewrites it.
 *
 * The party here is real. Handelsanställdas förbund and Hotell- och
 * restaurangfacket are the kind of merger MI has to track.
 */
const party: Party = {
  id: "P-TEST",
  type: "employee",
  name: "Sveriges Lärare",
  nameHistory: [
    { name: "Lärarförbundet", validFrom: "2000-01-01", validTo: "2022-12-31" },
    { name: "Sveriges Lärare", validFrom: "2023-01-01" },
  ],
  contacts: [],
  active: true,
};

describe("nameAtDate — FP-002", () => {
  it("returns the name the party had at that date", () => {
    expect(nameAtDate(party, "2019-06-01")).toBe("Lärarförbundet");
  });

  it("returns the current name for a date after the change", () => {
    expect(nameAtDate(party, "2027-01-01")).toBe("Sveriges Lärare");
  });

  /*
    The boundaries are the whole point. `validTo` is inclusive, so the last day
    of the old name still belongs to it and the first day of the new one does
    not.
  */
  it("treats the final day of a period as still that name", () => {
    expect(nameAtDate(party, "2022-12-31")).toBe("Lärarförbundet");
  });

  it("switches on the first day of the new period", () => {
    expect(nameAtDate(party, "2023-01-01")).toBe("Sveriges Lärare");
  });

  it("leaves an open period open", () => {
    expect(nameAtDate(party, "2099-01-01")).toBe("Sveriges Lärare");
  });

  it("falls back to the current name for a date before any history", () => {
    expect(nameAtDate(party, "1990-01-01")).toBe("Sveriges Lärare");
  });

  it("falls back to the current name when there is no history at all", () => {
    expect(nameAtDate({ ...party, nameHistory: [] }, "2019-06-01")).toBe("Sveriges Lärare");
  });
});

/**
 * FP-002 and the information model §4.2 — a merger is a new party pointing at
 * the ones it replaced. The relationship is what preserves statistical
 * continuity; a note in the name history cannot be followed by a query.
 */
describe("predecessors and successors — FP-002", () => {
  const lararforbundet: Party = { ...party, id: "P-101", name: "Lärarförbundet", nameHistory: [], successorId: "P-028" };
  const riksforbundet: Party = { ...party, id: "P-102", name: "Lärarnas Riksförbund", nameHistory: [], successorId: "P-028" };
  const merged: Party = { ...party, id: "P-028", predecessorIds: ["P-101", "P-102"] };
  const register = [lararforbundet, riksforbundet, merged];

  it("resolves both predecessors of a merged party", () => {
    expect(predecessorsOf(merged, register).map((p) => p.name)).toEqual([
      "Lärarförbundet",
      "Lärarnas Riksförbund",
    ]);
  });

  it("resolves the successor from either predecessor", () => {
    expect(successorOf(lararforbundet, register)?.id).toBe("P-028");
    expect(successorOf(riksforbundet, register)?.id).toBe("P-028");
  });

  it("returns nothing for a party with no merger", () => {
    expect(predecessorsOf(party, register)).toEqual([]);
    expect(successorOf(party, register)).toBeUndefined();
  });

  /* A pointer at a party that is not in the register must not crash a render. */
  it("skips a predecessor id the register does not hold", () => {
    expect(predecessorsOf({ ...merged, predecessorIds: ["P-999"] }, register)).toEqual([]);
  });
});
