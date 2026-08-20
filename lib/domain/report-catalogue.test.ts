import { describe, expect, it } from "vitest";

import { REQUIREMENTS } from "./requirements";
import {
  bargainingRoundReport,
  criteriaGroups,
  monthShare,
  reportById,
  REPORTS,
  selectionSummary,
} from "./report";

/**
 * Bilaga F's own opening line is the specification these assertions defend:
 * *"För varje rapport visas urvalsbild och resultat."* A report is a selection
 * screen plus a printout, and the selection differs per report — three criteria
 * for the single-agreement reports, nine for the population reports, and a
 * three-part form for the pension report. Flattening that into one form would
 * be the easy mistake, and it would be visible to anyone at MI who has ever run
 * one of these.
 */
describe("the report catalogue", () => {
  it("holds all six of Bilaga F's reports, numbered as MI numbers them", () => {
    const numbers = REPORTS.map((r) => r.bilagaF).filter(Boolean).sort();
    expect(numbers).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("cites only requirement IDs that exist", () => {
    for (const report of REPORTS) {
      for (const id of report.requirements) {
        expect(REQUIREMENTS[id], `${report.id} cites ${id}`).toBeDefined();
      }
    }
  });

  it("gives the single-agreement reports MI's own three criteria", () => {
    for (const id of ["allmanheten", "huvudrapport", "medlare"]) {
      const report = reportById(id);
      expect(report?.criteria.map((c) => c.id)).toEqual([
        "employerOrg",
        "employeeOrg",
        "agreement",
      ]);
    }
  });

  it("gives the two population reports MI's own nine, including both confederations", () => {
    for (const id of ["avtalskonstruktioner", "avtalsrorelse"]) {
      const ids = reportById(id)!.criteria.map((c) => c.id);
      expect(ids).toHaveLength(9);
      /* MI's screen shows Centralorganisation twice — once per side. */
      expect(ids).toContain("employerCentralOrg");
      expect(ids).toContain("employeeCentralOrg");
    }
  });

  it("splits the pension report's criteria into MI's three blocks", () => {
    const groups = criteriaGroups(reportById("pensionsavtal")!, "sv");
    expect(groups).toHaveLength(3);
    expect(groups[0]!.group).toBeNull();
    expect(groups[1]!.group).toBe("Avtalsparter på löneavtal och allmänna villkor");
    expect(groups[2]!.group).toBe("Avtalsparter på pensionsavtal och övriga avtal");
  });

  /* FR-008 says the report is written out *from a view*, so it is the one
     report with no selection screen. That is MI's design, not an omission. */
  it("gives the Short-Term Wage Report no selection screen", () => {
    expect(reportById("konjunkturlon")!.criteria).toHaveLength(0);
  });

  it("marks the website and Eurofound reports as MI marks them — Steg 2", () => {
    expect(reportById("hemsida")!.stage).toBe(2);
    expect(reportById("eurofound")!.stage).toBe(2);
    expect(reportById("avtalskonstruktioner")!.stage).toBe(1);
  });

  it("offers at least the three formats FR-005 names", () => {
    for (const report of REPORTS) {
      expect(report.formats.length).toBeGreaterThan(0);
    }
    expect(reportById("avtalskonstruktioner")!.formats).toContain("pdf");
    expect(reportById("avtalskonstruktioner")!.formats).toContain("word");
    expect(reportById("avtalskonstruktioner")!.formats).toContain("excel");
  });
});

/**
 * The printed Urvalskriterier block. MI prints every criterion, and the ones
 * left blank read "Alla" — a reader has to be able to see that Sektor was *not*
 * narrowed, and an absent line does not say that.
 */
describe("selectionSummary", () => {
  it("prints every criterion, filling the empty ones with Alla", () => {
    const rows = selectionSummary(
      reportById("avtalsrorelse")!,
      { employerOrg: "Almega Tjänsteförbunden" },
      "sv",
      "Alla",
    );
    expect(rows).toHaveLength(9);
    expect(rows.find((r) => r.label === "Arbetsgivarorganisation")?.value).toBe(
      "Almega Tjänsteförbunden",
    );
    expect(rows.find((r) => r.label === "Sektor")?.value).toBe("Alla");
  });
});

/**
 * Avtalsrörelserapporten counts agreements by the month they **expire**, split
 * by FR-012's own status. Both halves matter: a report that counted rows would
 * make one Kommunal agreement the equal of a thirty-person one.
 */
describe("bargainingRoundReport — FR-006", () => {
  const status = (a: { signedDate?: string | undefined; mediationLinked?: boolean | undefined }) =>
    a.mediationLinked
      ? { code: a.signedDate ? "after-mediation" : "remaining" }
      : { code: a.signedDate ? "newly-signed" : "remaining" };

  const agreements = [
    { validTo: "2027-04-30", employees: 1000, signedDate: "2027-03-01" },
    { validTo: "2027-04-15", employees: 500 },
    { validTo: "2027-11-30", employees: 250, signedDate: "2027-10-01", mediationLinked: true },
    { validTo: "2029-03-31", employees: 9999, signedDate: "2027-03-01" },
    /* No employee count — counted as an agreement, not as zero people. */
    { validTo: "2027-04-30", signedDate: "2027-02-01" },
  ];

  const report = bargainingRoundReport(agreements, 2027, status);

  it("buckets by the month the agreement expires", () => {
    expect(report.agreements[3]!.month).toBe(4);
    expect(report.agreements[3]!.newlySigned).toBe(2);
    expect(report.agreements[3]!.remaining).toBe(1);
    expect(report.agreements[10]!.afterMediation).toBe(1);
  });

  it("leaves other years out", () => {
    const { newlySigned, remaining, afterMediation } = report.agreementTotal;
    expect(newlySigned + remaining + afterMediation).toBe(4);
  });

  it("counts employees separately, and omits agreements that have no figure", () => {
    expect(report.employees[3]!.newlySigned).toBe(1000);
    expect(report.employees[3]!.remaining).toBe(500);
    expect(report.employeeTotal.afterMediation).toBe(250);
  });

  it("has twelve months whether or not anything falls in them", () => {
    expect(report.agreements).toHaveLength(12);
    expect(report.agreements[0]!.remaining).toBe(0);
  });
});

describe("monthShare", () => {
  it("is a percentage to one decimal, as MI prints it", () => {
    expect(monthShare(1, 3)).toBe(33.3);
    expect(monthShare(2, 3)).toBe(66.7);
  });

  it("is zero rather than NaN when nothing was counted", () => {
    expect(monthShare(0, 0)).toBe(0);
  });
});
