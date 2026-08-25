import { describe, expect, it } from "vitest";

import { SAMTLIGA_AVTAL, URVALETS_AVTAL } from "./constructions-report";

/**
 * These figures are Medlingsinstitutet's own, transcribed from the report
 * example in Bilaga F of the requirement specification. They are the one table
 * in the application that is not derived from anything, which is exactly why it
 * needs a test: a typo in a transcription is invisible, and this is the screen
 * a statistics user would check us on first.
 *
 * The totals below are MI's printed totals, on page 41. If a transcription
 * slips, these fail.
 */
describe("Avtalskonstruktioner — MI's own figures", () => {
  const total = SAMTLIGA_AVTAL.find((r) => r.construction === "total")!;
  const constructions = SAMTLIGA_AVTAL.filter((r) => r.construction !== "total");

  it("carries all seven constructions and a total", () => {
    expect(constructions).toHaveLength(7);
    expect(total).toBeDefined();
  });

  it("matches MI's printed totals", () => {
    expect(total.all.privat.count).toBe(2335364);
    expect(total.all.offentlig.count).toBe(1462400);
    expect(total.all.alla.count).toBe(3797764);
  });

  /*
    Arbetare plus tjänstemän is the whole of a sector, so MI's own split has to
    reconcile. This catches a digit dropped from either half.
  */
  it("reconciles arbetare and tjänstemän against the total, per sector", () => {
    for (const sector of ["privat", "offentlig", "alla"] as const) {
      expect(total.arbetare[sector].count + total.tjansteman[sector].count).toBe(
        total.all[sector].count,
      );
    }
  });

  it("sums the seven constructions to the total, in every sector", () => {
    for (const sector of ["privat", "offentlig", "alla"] as const) {
      const summed = constructions.reduce((n, r) => n + r.all[sector].count, 0);
      expect(summed).toBe(total.all[sector].count);
    }
  });

  it("adds private and public to all sectors, per construction", () => {
    for (const row of SAMTLIGA_AVTAL) {
      expect(row.all.privat.count + row.all.offentlig.count).toBe(row.all.alla.count);
    }
  });

  /*
    MI rounds each percentage independently, so a column does not always sum to
    exactly 100. That is their arithmetic, not ours, and the test says so rather
    than "correcting" it — a report that disagrees with the customer's own
    printout is worse than one that reproduces its rounding.
  */
  it("keeps every percentage within a plausible range", () => {
    for (const row of SAMTLIGA_AVTAL) {
      for (const sector of ["privat", "offentlig", "alla"] as const) {
        expect(row.all[sector].percent).toBeGreaterThanOrEqual(0);
        expect(row.all[sector].percent).toBeLessThanOrEqual(100);
      }
    }
  });

  it("gives the selection its own totals, smaller than the whole register", () => {
    const selection = URVALETS_AVTAL.find((r) => r.construction === "total")!;
    expect(selection.all.alla.count).toBe(113000);
    expect(selection.all.alla.count).toBeLessThan(total.all.alla.count);
  });

  it("uses the same seven constructions in both column groups", () => {
    expect(URVALETS_AVTAL.map((r) => r.construction)).toEqual(
      SAMTLIGA_AVTAL.map((r) => r.construction),
    );
  });
});
