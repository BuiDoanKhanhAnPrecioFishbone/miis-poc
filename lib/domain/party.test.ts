import { describe, expect, it } from "vitest";

import type { Party } from "./party";
import { nameAtDate } from "./party";

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
