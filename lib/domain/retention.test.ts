import { describe, expect, it } from "vitest";

import {
  RETENTION_MAX_MONTHS,
  RETENTION_MIN_MONTHS,
  RETENTION_RULES,
  describeRule,
  isEditable,
  maySetMonths,
  setAutomatic,
  setMonths,
  type RetentionRule,
} from "./retention";

const rule = (over: Partial<RetentionRule> = {}): RetentionRule => ({
  id: "r",
  subject: { sv: "Kontaktpersoner", en: "Contact persons" },
  source: { sv: "Partsregistret", en: "The party register" },
  trigger: { sv: "Från borttagning", en: "From removal" },
  months: 24,
  action: "erase",
  automatic: true,
  requirements: ["D-004"],
  ...over,
});

/**
 * D-004 is a ska-krav and names two halves — gallring *and* the ability to
 * define automatic rules. The prototype answered it with a sentence saying
 * contact details fall under MI's retention routines, which is a statement
 * about a rule rather than the ability to define one.
 */
describe("the catalogue", () => {
  it("covers the personal data the registers actually hold", () => {
    const ids = RETENTION_RULES.map((r) => r.id);
    expect(ids).toContain("party-contacts");
    expect(ids).toContain("mediator-contacts");
    expect(ids).toContain("inactive-users");
  });

  it("gives every rule a trigger, so a period is not a bare number", () => {
    for (const r of RETENTION_RULES) {
      expect(r.trigger.sv.length).toBeGreaterThan(0);
      expect(r.trigger.en.length).toBeGreaterThan(0);
    }
  });

  /*
    NFL-001 logged this person's sign-ins, and those entries have to survive
    the account. Erasing the user would leave MI with a log it cannot account
    for, which is why the action has two values rather than being a boolean.
  */
  it("anonymises a user account rather than erasing it", () => {
    const users = RETENTION_RULES.find((r) => r.id === "inactive-users")!;
    expect(users.action).toBe("anonymise");
  });
});

/**
 * NFL-003: logs are kept *"i minst 24 månader"* and *"ska inte kunna ändras
 * eller raderas av vanliga användare eller systemadministratörer"* — including
 * the role reading this screen. D-004 says define rules; NFL-003 removes one
 * register from that, and the screen has to hold both.
 */
describe("NFL-003 — the one rule nobody may define", () => {
  it("carries the logs as a fixed rule with the sentence that fixes it", () => {
    const logs = RETENTION_RULES.find((r) => r.id === "logs")!;
    expect(isEditable(logs)).toBe(false);
    expect(logs.fixedReason?.sv).toContain("24 månader");
  });

  it("refuses every change to it, including one that would lengthen it", () => {
    const logs = RETENTION_RULES.find((r) => r.id === "logs")!;
    expect(maySetMonths(logs, 36)).toBe(false);
    expect(setMonths(RETENTION_RULES, "logs", 36).find((r) => r.id === "logs")!.months).toBe(24);
    expect(
      setAutomatic(RETENTION_RULES, "logs", true).find((r) => r.id === "logs")!.automatic,
    ).toBe(false);
  });

  /* Shown rather than hidden: a screen that quietly omitted the logs would
     look complete and would not say the requirement had been read. */
  it("is present in the catalogue rather than left out", () => {
    expect(RETENTION_RULES.some((r) => r.id === "logs")).toBe(true);
  });
});

describe("maySetMonths", () => {
  it("accepts a period inside the bounds", () => {
    expect(maySetMonths(rule(), 12)).toBe(true);
    expect(maySetMonths(rule(), RETENTION_MIN_MONTHS)).toBe(true);
    expect(maySetMonths(rule(), RETENTION_MAX_MONTHS)).toBe(true);
  });

  it("refuses one outside them, and a fraction of a month", () => {
    expect(maySetMonths(rule(), 0)).toBe(false);
    expect(maySetMonths(rule(), RETENTION_MAX_MONTHS + 1)).toBe(false);
    expect(maySetMonths(rule(), 6.5)).toBe(false);
  });
});

describe("setMonths and setAutomatic", () => {
  it("changes one rule and leaves the rest alone", () => {
    const next = setMonths(RETENTION_RULES, "party-contacts", 12);
    expect(next.find((r) => r.id === "party-contacts")!.months).toBe(12);
    expect(next.find((r) => r.id === "mediator-contacts")!.months).toBe(36);
  });

  it("does not mutate what it was given", () => {
    setMonths(RETENTION_RULES, "party-contacts", 12);
    expect(RETENTION_RULES.find((r) => r.id === "party-contacts")!.months).toBe(24);
  });

  it("turns the automatic rule off, which is a real state", () => {
    const next = setAutomatic(RETENTION_RULES, "party-contacts", false);
    expect(next.find((r) => r.id === "party-contacts")!.automatic).toBe(false);
  });
});

describe("describeRule", () => {
  it("says what goes and when, in whole years where it is whole years", () => {
    expect(describeRule(rule({ months: 24 }), "sv")).toBe("Kontaktpersoner gallras efter 2 år.");
    expect(describeRule(rule({ months: 18 }), "sv")).toContain("18 månader");
  });

  it("says it in English too", () => {
    expect(describeRule(rule({ months: 12 }), "en")).toBe("Contact persons: erased after 1 year.");
    expect(describeRule(rule({ months: 24, action: "anonymise" }), "en")).toContain("anonymised");
  });
});
