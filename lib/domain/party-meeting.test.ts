import { describe, expect, it } from "vitest";

import type { PartyMeeting } from "./party-meeting";
import { coordinatedDemands, phaseState, watchwordCount } from "./party-meeting";

const base: PartyMeeting = {
  id: "PT-TEST",
  party: "Facken inom industrin",
  partyType: "employee",
  agreementArea: { sv: "Industrin", en: "Industry" },
  date: "2027-01-21",
  location: { sv: "Stockholm", en: "Stockholm" },
  state: "planned",
  purpose: { sv: "", en: "" },
  agenda: [],
  participants: [],
  notes: [],
  demands: [],
  documents: [],
};

/**
 * FF-004 — *"registrering av information både inför och efter en träff, men
 * även … mata in information direkt under mötet i en interaktiv vy"*. The three
 * phases are stages of one process, so the view's position has to come from
 * where the meeting actually is rather than from where the officer last
 * clicked.
 */
describe("phaseState — FF-004", () => {
  it("puts a planned meeting at the preparation stage", () => {
    expect(phaseState(base, "before")).toBe("current");
    expect(phaseState(base, "during")).toBe("upcoming");
    expect(phaseState(base, "after")).toBe("upcoming");
  });

  it("moves to the live view once the meeting is held", () => {
    const held = { ...base, state: "held" as const };
    expect(phaseState(held, "before")).toBe("done");
    expect(phaseState(held, "during")).toBe("current");
  });

  it("reaches the final stage when the meeting is completed", () => {
    const done = { ...base, state: "completed" as const };
    expect(phaseState(done, "before")).toBe("done");
    expect(phaseState(done, "during")).toBe("done");
    expect(phaseState(done, "after")).toBe("current");
  });

  it("never reports two stages as current", () => {
    for (const state of ["planned", "held", "completed"] as const) {
      const m = { ...base, state };
      const current = (["before", "during", "after"] as const).filter(
        (p) => phaseState(m, p) === "current",
      );
      expect(current).toHaveLength(1);
    }
  });
});

/**
 * FF-005 — a demand carries a flag for coordinated or own-union, and a
 * coordinated one links to the unions behind it. Backing on an own-union demand
 * would be a contradiction the screen must never be asked to render.
 */
describe("demands — FF-005", () => {
  const meeting: PartyMeeting = {
    ...base,
    state: "held",
    demands: [
      {
        id: "YRK-01",
        topic: { sv: "Låglönesatsning", en: "Low-wage initiative" },
        kind: "coordinated",
        backedBy: ["IF Metall", "Unionen"],
        documents: [],
        watchword: true,
      },
      {
        id: "YRK-02",
        topic: { sv: "Höjd deltidspensionspremie", en: "Higher part-time pension premium" },
        kind: "own",
        backedBy: [],
        documents: [],
        watchword: false,
      },
    ],
  };

  it("separates coordinated demands from own-union ones", () => {
    const coordinated = coordinatedDemands(meeting);
    expect(coordinated).toHaveLength(1);
    expect(coordinated[0]!.id).toBe("YRK-01");
  });

  it("gives every coordinated demand at least one backing union", () => {
    for (const d of coordinatedDemands(meeting)) {
      expect(d.backedBy.length).toBeGreaterThan(0);
    }
  });

  /*
    FAI-004 and §4.1: the watchword table carries "särskilt utvalda yrkanden,
    till exempel sådana som identifierats vid partsträffar". This count is what
    the officer sees, and it is the join between this screen and the
    highlighting on /registrera.
  */
  it("counts only the demands promoted to the watchword table", () => {
    expect(watchwordCount(meeting)).toBe(1);
    expect(watchwordCount(base)).toBe(0);
  });
});
