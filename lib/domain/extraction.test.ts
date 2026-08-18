import { describe, expect, it } from "vitest";

import type { ExtractionProposal } from "./extraction";
import { initialValue, isAdjusted, isEmpty } from "./extraction";

/**
 * FAI-002 requires manual review and approval before anything is saved, and
 * FH-001 requires the change log to record the old value and the new one. Both
 * depend on "did the officer change this?" being answerable, which is what
 * `isAdjusted` decides — and it decides it by comparing against what the AI
 * read, not by a flag anyone can forget to set.
 */
const proposal: ExtractionProposal = {
  id: "employeeOrg",
  value: "PTK – Förhandlings- och samverkansrådet",
  source: "employeeParty",
};

describe("isAdjusted — FAI-002 / FH-001", () => {
  it("is false for the value the AI read", () => {
    expect(isAdjusted(proposal, proposal.value)).toBe(false);
  });

  it("is true once the officer changes it", () => {
    expect(isAdjusted(proposal, "Unionen")).toBe(true);
  });

  /*
    Whitespace alone is not a correction. Without the trim a stray space would
    put JUSTERAD on a field nobody touched and an entry in the change log that
    records no change — which is worse than missing one, because it teaches the
    reader to distrust the log.
  */
  it("ignores leading and trailing whitespace", () => {
    expect(isAdjusted(proposal, `  ${proposal.value}  `)).toBe(false);
  });

  it("treats an internal difference as a change", () => {
    expect(isAdjusted(proposal, proposal.value.replace("–", "-"))).toBe(true);
  });
});

describe("initialValue", () => {
  it("opens on the AI's value when there is no correction", () => {
    expect(initialValue(proposal)).toBe(proposal.value);
  });

  it("opens on the officer's correction when there is one", () => {
    expect(initialValue({ ...proposal, correction: "Unionen" })).toBe("Unionen");
  });
});

describe("isEmpty — FA-021", () => {
  /*
    FA-021 is the incomplete-registration requirement. An empty required field
    is what makes a registration Ofullständig rather than Klar, so whitespace
    must not count as filled in.
  */
  it.each([
    ["", true],
    ["   ", true],
    ["\t\n", true],
    ["Unionen", false],
    [" 0 ", false],
  ])("%j → empty: %s", (value, expected) => {
    expect(isEmpty(value as string)).toBe(expected);
  });
});
