import { describe, expect, it } from "vitest";

import {
  answerFor,
  ASSISTANT_INTENTS,
  findTerm,
  matchAgreements,
  matchIntent,
  type AssistantCopy,
  type AssistantFacts,
} from "./assistant";
import { ROLES } from "./role";

const role = (id: string) => {
  const found = ROLES.find((r) => r.id === id);
  if (!found) throw new Error(`no role ${id}`);
  return found;
};

const COPY: AssistantCopy = {
  refused: (screen) => `refused:${screen}`,
  none: (what) => `none:${what}`,
  found: (n, what) => `found:${n}:${what}`,
  unmatched: "unmatched",
  capabilities: "capabilities",
  what: {
    expiring: { one: "expiring1", many: "expiring" },
    incomplete: { one: "incomplete1", many: "incomplete" },
    unpublished: { one: "unpublished1", many: "unpublished" },
    mediations: { one: "mediations1", many: "mediations" },
    benchmark: { one: "benchmark1", many: "benchmark" },
    "find-agreement": { one: "agreements1", many: "agreements" },
    capabilities: { one: "capabilities1", many: "capabilities" },
  },
};

const FACTS: AssistantFacts = {
  expiring: [{ key: "A-1", label: "Fastigheter" }],
  incomplete: [{ key: "A-2", label: "Apotek" }, { key: "A-3", label: "Spel" }],
  unpublished: [],
  mediations: [{ key: "M-1", label: "Spårtrafik" }],
  benchmark: [{ key: "b", label: "Kostnadsram", detail: "6,4 %" }],
  agreements: [
    { key: "A-1", label: "Stål- och metallindustrin", detail: "Industriarbetsgivarna / IF Metall" },
    { key: "A-2", label: "Teknikavtalet", detail: "Teknikföretagen / Unionen" },
  ],
};

const ask = (q: string, r = "agreement-admin") =>
  answerFor(q, FACTS, role(r), "sv", COPY, (nav) => nav);

/**
 * The assistant answers by running a query MIIS could already run. These
 * assertions are about the two properties that make that safe: it never answers
 * from anything but the register, and it never answers about a register the
 * role may not read.
 */
describe("matchIntent", () => {
  it("routes a question to the query that answers it", () => {
    expect(matchIntent("Vilka avtal löper ut inom 90 dagar?", "sv")).toBe("expiring");
    expect(matchIntent("Vilka registreringar är ofullständiga?", "sv")).toBe("incomplete");
    expect(matchIntent("Vilka medlingsärenden pågår?", "sv")).toBe("mediations");
    expect(matchIntent("Vad är Märket den här avtalsrörelsen?", "sv")).toBe("benchmark");
  });

  /*
    Longest trigger first. "inte publicerad" contains "publicera", and the
    shorter one would otherwise swallow the more specific question.
  */
  it("prefers the more specific trigger", () => {
    expect(matchIntent("Vilka avtal är inte publicerade?", "sv")).toBe("unpublished");
  });

  it("works in both languages", () => {
    expect(matchIntent("Which agreements expire soon?", "en")).toBe("expiring");
    expect(matchIntent("What is the benchmark?", "en")).toBe("benchmark");
  });

  /*
    Null is the honest answer and a useful one. An assistant that guessed at an
    unmatched question would be indistinguishable from one that answered it,
    which is the failure mode worth designing against.
  */
  it("returns null rather than guessing", () => {
    expect(matchIntent("Vad tycker du om avtalsrörelsen?", "sv")).toBeNull();
    expect(matchIntent("", "sv")).toBeNull();
    expect(matchIntent("   ", "sv")).toBeNull();
  });
});

describe("answerFor", () => {
  it("answers from the register, with the rows it counted", () => {
    const a = ask("Vilka registreringar är ofullständiga?");
    expect(a.intent).toBe("incomplete");
    expect(a.summary).toBe("found:2:incomplete");
    expect(a.rows).toHaveLength(2);
    expect(a.href).toBe("/avtal");
  });

  it("says nothing was found rather than inventing something", () => {
    expect(ask("Vilka avtal är inte publicerade?").summary).toBe("none:unpublished");
  });

  it("says what it can answer when nothing matches", () => {
    const a = ask("Skriv ett förslag till avtalstext åt mig");
    expect(a.intent).toBeNull();
    expect(a.summary).toBe("unmatched");
    expect(a.rows).toHaveLength(0);
  });

  /*
    NFÅ-003 does not stop applying because the question was typed. The
    statistics user reads Avtal but has no Medling, and the assistant must not
    be the way around the menu.
  */
  it("refuses a question about a register the role may not read", () => {
    const a = ask("Vilka medlingsärenden pågår?", "statistics-user");
    expect(a.refused).toBe(true);
    expect(a.rows).toHaveLength(0);
    expect(a.summary).toBe("refused:medling");
  });

  /* And the refusal is per register, not blanket: the mediation administrator
     reads Medling and is answered. */
  it("still answers a role that does have the register", () => {
    const a = ask("Vilka medlingsärenden pågår?", "mediation-admin");
    expect(a.refused).toBeUndefined();
    expect(a.rows).toHaveLength(1);
  });

  it("lists what it can do when asked", () => {
    expect(ask("Vad kan du hjälpa till med?").summary).toBe("capabilities");
  });
});

describe("finding an agreement by name", () => {
  it("takes the subject from the end of the question", () => {
    expect(findTerm("Hitta avtalet för Teknikföretagen", "sv")).toBe("Teknikföretagen");
    expect(findTerm("Sök avtal om Stål", "sv")).toBe("Stål");
  });

  it("falls back to the whole question when there is no trigger word", () => {
    expect(findTerm("Teknikföretagen", "sv")).toBe("Teknikföretagen");
  });

  it("matches the agreement name and its parties", () => {
    expect(matchAgreements(FACTS.agreements, "teknik")).toHaveLength(1);
    expect(matchAgreements(FACTS.agreements, "IF Metall")[0]!.key).toBe("A-1");
    expect(matchAgreements(FACTS.agreements, "x")).toHaveLength(0);
  });

  it("answers a find with the matching rows", () => {
    const a = ask("Hitta avtalet för Teknikföretagen");
    expect(a.intent).toBe("find-agreement");
    expect(a.rows).toHaveLength(1);
    expect(a.summary, "one row takes the singular").toBe("found:1:agreements1");
    expect(a.rows[0]!.label).toBe("Teknikavtalet");
  });
});

describe("the intent catalogue", () => {
  it("gives every intent an example, a screen and triggers in both languages", () => {
    for (const intent of ASSISTANT_INTENTS) {
      expect(intent.example.sv, intent.id).toBeTruthy();
      expect(intent.example.en, intent.id).toBeTruthy();
      expect(intent.triggers.sv.length, intent.id).toBeGreaterThan(0);
      expect(intent.triggers.en.length, intent.id).toBeGreaterThan(0);
      expect(intent.href.startsWith("/"), intent.id).toBe(true);
    }
  });

  /* Every example has to route to its own intent, or the suggestion the officer
     is shown does not do what it says. */
  it("routes each example to the intent that offered it", () => {
    for (const intent of ASSISTANT_INTENTS) {
      expect(matchIntent(intent.example.sv, "sv"), intent.id).toBe(intent.id);
      expect(matchIntent(intent.example.en, "en"), intent.id).toBe(intent.id);
    }
  });
});
