import { describe, expect, it } from "vitest";

import { getDataset } from "./index";
import { findIntegrityProblems } from "./integrity";

/**
 * T-002 and T-003 in one place.
 *
 * MI asks for testing *"mot anonymiserade eller fiktiva protokoll och avtal som
 * representerar variationer i det svenska kollektivavtalslandskapet"* (T-002),
 * with test data that includes *"edge cases, såsom helt nya avtal utan tidigare
 * version i systemet"* (T-003). The three datasets are that: `quiet` is
 * near-empty so empty states can be designed against something, `normal` is the
 * everyday register, `peak` is the same under load.
 *
 * Relations here are id strings with no database enforcing them, so a mediation
 * case can point at an agreement that does not exist and the screen simply
 * shows less than expected — a silent failure rather than a loud one. The check
 * runs at module load and fails `next build`; this test is what makes it a
 * named failure rather than a stack trace.
 */
const NAMES = ["quiet", "normal", "peak"] as const;

describe("mock data integrity — T-002 / T-003", () => {
  it.each(NAMES)("%s has no dangling references", (name) => {
    expect(findIntegrityProblems(name, getDataset(name))).toEqual([]);
  });

  it("catches a dangling agreement reference", () => {
    const data = getDataset("normal");
    const broken = {
      ...data,
      mediationCases: data.mediationCases.map((c, i) =>
        i === 0 ? { ...c, agreementIds: ["A-DOES-NOT-EXIST"] } : c,
      ),
    };
    const problems = findIntegrityProblems("broken", broken);
    expect(problems.length).toBeGreaterThan(0);
    expect(problems.join(" ")).toContain("A-DOES-NOT-EXIST");
  });

  /*
    T-003's edge case, stated as a property of the data rather than of a screen:
    `quiet` exists so that an empty state is something we designed rather than
    something we discovered in front of MI.
  */
  it("keeps quiet genuinely sparse, so empty states have a dataset", () => {
    const quiet = getDataset("quiet");
    const normal = getDataset("normal");
    expect(quiet.agreements.length).toBeLessThan(normal.agreements.length);
  });

  it("keeps peak larger than normal, so density has a dataset too", () => {
    expect(getDataset("peak").agreements.length).toBeGreaterThan(
      getDataset("normal").agreements.length,
    );
  });

  /*
    T-002 asks for variation representing the Swedish landscape. A register in
    which every agreement had the same construction, or only one sector, would
    satisfy the letter and none of the intent.
  */
  it("represents variation rather than one repeated shape", () => {
    const normal = getDataset("normal");
    const employers = new Set(normal.agreements.map((a) => a.employerOrg.name));
    const employees = new Set(normal.agreements.map((a) => a.employeeOrg.name));
    expect(employers.size).toBeGreaterThan(2);
    expect(employees.size).toBeGreaterThan(2);
  });
});
