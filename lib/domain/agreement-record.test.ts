import { describe, expect, it } from "vitest";

import {
  isPublished,
  isSectionLimited,
  mayMarkComplete,
  mayPublish,
  mayReopenRegistration,
  orderedQuestions,
  registrationChecklist,
  registrationGaps,
  registrationProgress,
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

/**
 * The act `mayPublish` had been waiting for.
 *
 * `registrationStatus` was written in two places — the sample data, and
 * `draftToAgreement`, which hard-codes *incomplete* — and read in sixteen. So
 * the publish control refused every agreement an officer registered themselves,
 * in MI's own words: *"Publicering kräver att registreringen är markerad som
 * klar"*, naming an act the interface offered nowhere. Bilaga 2 §3.5's Scenario
 * 2 is four bullets ending in *publicerar avtalet*, and they could only be
 * walked on the one agreement the sample data seeds complete.
 */
describe("marking a registration complete", () => {
  it("is available exactly while the registration is incomplete", () => {
    expect(mayMarkComplete({ registrationStatus: "incomplete" })).toBe(true);
    expect(mayMarkComplete({ registrationStatus: "complete" })).toBe(false);
  });

  it("unblocks publication of a signed agreement", () => {
    const a = { registrationStatus: "incomplete" as const, signedDate: "2027-04-01" };
    expect(mayPublish(a)).toBe(false);
    expect(mayPublish({ ...a, registrationStatus: "complete" })).toBe(true);
  });

  /* Undoing it is the mediation case's *Ångra klarmarkeringen*, on a different
     record — and refused once the agreement is out, because the public computer
     is already showing it. */
  it("can be undone until the agreement is published", () => {
    expect(mayReopenRegistration({ registrationStatus: "complete" })).toBe(true);
    expect(
      mayReopenRegistration({
        registrationStatus: "complete",
        published: { date: "2027-04-02", by: "A" },
      }),
    ).toBe(false);
  });

  it("cannot be undone on a registration that is not complete", () => {
    expect(mayReopenRegistration({ registrationStatus: "incomplete" })).toBe(false);
  });
});

/**
 * What is thin about a record, named — and deliberately not a gate.
 *
 * Seven of the eleven complete agreements in the sample have no wage agreement
 * and two have no signing date, because a *kvarstående* agreement is a complete
 * registration of an agreement nobody renegotiated this round. A rule refusing
 * those would invent a requirement MI never wrote and contradict MI's own data
 * with it, which is why completion is an act and this is information.
 */
describe("registration gaps", () => {
  const full = {
    wageAgreementCount: 1,
    protocolCount: 1,
    validTo: "2028-03-31",
    employees: 12000,
    signedDate: "2027-04-01",
  };
  const empty = { wageAgreementCount: 0, protocolCount: 0 };

  it("finds nothing on a record that carries all five", () => {
    expect(registrationGaps(full)).toEqual([]);
  });

  it("names each missing part, in the order the officer would fill them", () => {
    expect(registrationGaps(empty)).toEqual([
      "wageAgreement",
      "validity",
      "scope",
      "protocol",
      "signedDate",
    ]);
  });

  it("treats a zero scope figure as a figure, not as an absence", () => {
    /* MI's own printouts show `¤` for a missing value; 0 employees is a
       measurement and has to survive the check that asks whether one was made. */
    expect(registrationGaps({ ...full, employees: 0 })).toEqual([]);
  });

  it("does not gate the act it informs", () => {
    const thin = { registrationStatus: "incomplete" as const };
    expect(registrationGaps(empty).length).toBeGreaterThan(0);
    expect(mayMarkComplete(thin)).toBe(true);
  });
});

/**
 * The checklist the officer reads, and the reason it is one derivation.
 *
 * `/avtal/ny` printed five fixed sentences after saving and the detail view named
 * only what was absent, so *how far have I got* had no answer on any screen. Both
 * now render this, and `registrationGaps` is this filtered — so the sentence
 * beside the mark and the list above it cannot disagree about one record.
 */
describe("the registration checklist", () => {
  const empty = { wageAgreementCount: 0, protocolCount: 0 };

  it("carries every line whether or not the record has it", () => {
    expect(registrationChecklist(empty)).toHaveLength(5);
    expect(registrationChecklist(empty).every((c) => !c.done)).toBe(true);
  });

  it("ticks what the form already collected", () => {
    /* A record created a second ago has no bargaining round and no document —
       but the officer may have typed a signing date and an end date, and a list
       that could not show that was the whole complaint. */
    const justCreated = { ...empty, signedDate: "2027-04-01", validTo: "2029-03-31" };
    const done = registrationChecklist(justCreated).filter((c) => c.done).map((c) => c.id);
    expect(done).toEqual(["validity", "signedDate"]);
  });

  it("is the same answer as the gaps, from one derivation", () => {
    const partial = { wageAgreementCount: 1, protocolCount: 0, employees: 900 };
    const notDone = registrationChecklist(partial).filter((c) => !c.done).map((c) => c.id);
    expect(notDone).toEqual(registrationGaps(partial));
  });

  it("counts progress for the line above the list", () => {
    expect(registrationProgress(empty)).toEqual({ done: 0, total: 5 });
    expect(
      registrationProgress({ ...empty, employees: 12000, signedDate: "2027-04-01" }),
    ).toEqual({ done: 2, total: 5 });
  });
});
