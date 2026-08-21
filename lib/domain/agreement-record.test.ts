import { describe, expect, it } from "vitest";

import {
  isPublished,
  isSectionLimited,
  mayPublish,
  orderedQuestions,
  SPECIAL_QUESTION_NUMBERS,
  unionDensityPercent,
  type SpecialQuestions,
} from "./agreement";
import { isCurrent } from "./report";

/**
 * Bilaga 3 §3.3 and §3.11 — MI's own agreement record.
 *
 * The manual is migration source material, not a design template
 * (Avropsförfrågan §18.3), so what these assertions defend is the *shape of the
 * information*, never the shape of W3D3's screens: four scope figures rather
 * than one, a flag paired with a comment, per-section information restriction
 * separate from the agreement-wide sekretessmarkering, and three numbered
 * question slots.
 */

describe("organisationsgrad", () => {
  it("is union members as a percentage of those covered", () => {
    expect(unionDensityPercent({ employees: 9400, unionMembers: 3900 })).toBe(41.5);
  });

  it("keeps one decimal", () => {
    expect(unionDensityPercent({ employees: 24500, unionMembers: 19100 })).toBe(78);
  });

  /*
    MI's own printouts show `¤` where a figure is missing, so a derived value
    has to be able to say "not known" rather than "zero". A computed 0 % is a
    claim about the labour market; an absent value is a claim about the record.
  */
  it("is undefined when the union figure was never registered", () => {
    expect(unionDensityPercent({ employees: 9400 })).toBeUndefined();
  });

  it("is undefined when the headcount is missing or zero", () => {
    expect(unionDensityPercent({ unionMembers: 3900 })).toBeUndefined();
    expect(unionDensityPercent({ employees: 0, unionMembers: 0 })).toBeUndefined();
  });
});

describe("informationsbegränsning — §3.3", () => {
  const limited = { informationLimits: { workingGroups: true, minimumWages: false } };

  it("restricts only the section it names", () => {
    expect(isSectionLimited(limited, "workingGroups")).toBe(true);
    expect(isSectionLimited(limited, "minimumWages")).toBe(false);
  });

  /* Absent means nothing is restricted — not that everything is. */
  it("restricts nothing when no limits were registered", () => {
    expect(isSectionLimited({}, "workingGroups")).toBe(false);
    expect(isSectionLimited({}, "minimumWages")).toBe(false);
  });
});

describe("särskilda frågor — §3.11", () => {
  const set: SpecialQuestions = {
    agreementId: "A-009",
    year: "2027",
    questions: [
      { number: 3, question: "Heltid som norm", genderEquality: true },
      { number: 1, question: "Lägstlöner utan yrkesvana", genderEquality: false },
    ],
  };

  it("has exactly three slots in MI's form", () => {
    expect(SPECIAL_QUESTION_NUMBERS).toEqual([1, 2, 3]);
  });

  /*
    The gap stays open. MI's reports refer to a question by its slot, so
    renumbering 3 to 2 because 2 is empty would rename the thing being pointed
    at — and the officer filed it under 3 because that is the protocol point.
  */
  it("orders by slot without closing a gap", () => {
    expect(orderedQuestions(set).map((q) => q.number)).toEqual([1, 3]);
  });

  it("does not mutate the registered order", () => {
    orderedQuestions(set);
    expect(set.questions.map((q) => q.number)).toEqual([3, 1]);
  });
});

describe("avtalet upphört — §3.3, in the expiry report", () => {
  /*
    Ceased is not expired. An agreement that has run out still applies until it
    is replaced, which is what makes it *kvarstående*; one MI has marked as
    ceased does not apply at all, so counting its expiry date would put a date
    in the report that nothing hangs on.
  */
  it("drops a signed agreement that has ceased", () => {
    expect(isCurrent({ signedDate: "2018-04-12", terminated: true })).toBe(false);
  });

  it("keeps a signed agreement that has not", () => {
    expect(isCurrent({ signedDate: "2018-04-12", terminated: false })).toBe(true);
    expect(isCurrent({ signedDate: "2018-04-12" })).toBe(true);
  });

  it("still drops an unsigned one whatever the flag says", () => {
    expect(isCurrent({ terminated: false })).toBe(false);
  });
});

/**
 * Bilaga 2 §3.5, Scenario 2: *"Publicerar avtalet så att det blir tillgängligt
 * för användare med åtkomst till publicerad information."*
 */
describe("publishing an agreement", () => {
  const base = { registrationStatus: "complete" as const, signedDate: "2027-04-01" };

  it("is ready when the registration is complete and the agreement is signed", () => {
    expect(mayPublish(base)).toBe(true);
  });

  /* A half-registered agreement reaching the public computer would be MI
     publishing a draft, so the control is not offered on one. */
  it("is not ready while the registration is incomplete or unsigned", () => {
    expect(mayPublish({ ...base, registrationStatus: "incomplete" })).toBe(false);
    expect(mayPublish({ registrationStatus: "complete" })).toBe(false);
  });

  it("is not offered again once published", () => {
    expect(mayPublish({ ...base, published: { date: "2027-04-02", by: "A" } })).toBe(false);
  });

  it("counts as published only while it is not confidentiality-marked", () => {
    const published = { published: { date: "2027-04-02", by: "A" } };
    expect(isPublished({ ...published, confidential: false })).toBe(true);
    /* Published and later marked: the marking is what the public view honours. */
    expect(isPublished({ ...published, confidential: true })).toBe(false);
    expect(isPublished({ confidential: false })).toBe(false);
  });
});
