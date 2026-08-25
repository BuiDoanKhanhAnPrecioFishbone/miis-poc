import { describe, expect, it } from "vitest";

import {
  addDraft,
  applyPublished,
  decodeDrafts,
  decodePublished,
  draftToAgreement,
  encodeDrafts,
  encodePublished,
  nextDraftId,
  type DraftAgreement,
  applyCompletion,
  decodeCompletion,
  encodeCompletion,
} from "./draft";
import type { Agreement } from "./agreement";

const draft = (over: Partial<DraftAgreement> = {}): DraftAgreement => ({
  id: "A-N01",
  name: "Testavtalet 2027",
  agreementArea: "Teknikinstallation",
  employerOrg: "Teknikföretagen",
  employeeOrg: "IF Metall",
  agreementType: "Löneavtal",
  signedDate: "2027-03-28",
  validFrom: "2027-04-01",
  validTo: "2029-03-31",
  confidential: false,
  ...over,
});

/**
 * Bilaga 2 §3.5, bullet six. The act announced itself and vanished: an
 * evaluator registered an agreement, was told it was registered, opened the
 * register and found seventeen rows without it.
 */
describe("drafts survive the trip to the server", () => {
  it("round-trips every field", () => {
    const list = [draft()];
    expect(decodeDrafts(encodeDrafts(list))).toEqual(list);
  });

  it("round-trips several, in order", () => {
    const list = [draft(), draft({ id: "A-N02", name: "Andra avtalet" })];
    expect(decodeDrafts(encodeDrafts(list)).map((d) => d.id)).toEqual(["A-N01", "A-N02"]);
  });

  it("keeps the optional dates optional rather than storing empty strings", () => {
    const bare = draft({ signedDate: undefined, validFrom: undefined, validTo: undefined });
    const back = decodeDrafts(encodeDrafts([bare]))[0]!;
    expect(back.signedDate).toBeUndefined();
    expect("validFrom" in back).toBe(false);
  });

  it("survives a name containing the delimiters", () => {
    const back = decodeDrafts(encodeDrafts([draft({ name: "A~B|C" })]))[0]!;
    expect(back.name).toBe("A B C");
    expect(back.agreementArea).toBe("Teknikinstallation");
  });

  it("keeps the confidentiality marking, which decides what may be released", () => {
    expect(decodeDrafts(encodeDrafts([draft({ confidential: true })]))[0]!.confidential).toBe(true);
  });

  /*
    A cookie is user-editable and outlives a deploy that changed this shape. A
    reviewer whose session predates a field has to get an empty register, not a
    server error on the screen the criterion is scored on.
  */
  it("degrades to nothing on rubbish rather than throwing", () => {
    expect(decodeDrafts(undefined)).toEqual([]);
    expect(decodeDrafts("")).toEqual([]);
    expect(decodeDrafts("not~enough~fields")).toEqual([]);
    expect(decodeDrafts("%E0%A4%A")).toEqual([]);
  });
});

describe("ids", () => {
  it("does not collide when two are registered in one session", () => {
    const one = addDraft([], draft());
    const two = addDraft(one, draft({ name: "Andra" }));
    expect(two.map((d) => d.id)).toEqual(["A-N01", "A-N02"]);
    expect(new Set(two.map((d) => d.id)).size).toBe(2);
  });

  it("is prefixed so a draft is never mistaken for a migrated record", () => {
    expect(nextDraftId([])).toMatch(/^A-N/);
  });
});

/**
 * A new agreement with no wage agreement under it is not a finished
 * registration, so it saves incomplete and unpublished — which is also what
 * lets it demonstrate `mayPublish` honestly.
 */
describe("draftToAgreement", () => {
  it("is incomplete and unpublished", () => {
    const a = draftToAgreement(draft());
    expect(a.registrationStatus).toBe("incomplete");
    expect(a.published).toBeUndefined();
  });

  it("is drawn into no report until somebody selects it", () => {
    expect(draftToAgreement(draft()).reportSelection).toEqual({
      eurofound: false,
      minimumWage: false,
      website: false,
      shortTermWageReport: false,
    });
  });

  it("carries the parties as references, the way the register holds them", () => {
    const a = draftToAgreement(draft());
    expect(a.employerOrg.name).toBe("Teknikföretagen");
    expect(a.employeeOrg.name).toBe("IF Metall");
  });
});

/**
 * Bullet nine, whose own wording is *"så att det blir tillgängligt för
 * användare med åtkomst till publicerad information"* — the visibility is the
 * bullet.
 */
describe("applyPublished", () => {
  const reg = [
    { id: "A-001", published: { date: "2027-04-03", by: "Anna" } },
    { id: "A-010" },
  ] as unknown as Agreement[];
  const on = { date: "2027-06-14", by: "Anna Andersson" };

  it("publishes the one that was published", () => {
    const out = applyPublished(reg, ["A-010"], on);
    expect(out.find((a) => a.id === "A-010")!.published).toEqual(on);
  });

  it("leaves the others alone", () => {
    const out = applyPublished(reg, ["A-010"], on);
    expect(out.find((a) => a.id === "A-001")!.published!.by).toBe("Anna");
  });

  /* An agreement published in 2027 does not get re-dated by a reviewer opening
     the screen: the register's own record wins. */
  it("does not overwrite a publication the register already recorded", () => {
    const out = applyPublished(reg, ["A-001"], on);
    expect(out.find((a) => a.id === "A-001")!.published!.date).toBe("2027-04-03");
  });

  it("does not mutate what it was given", () => {
    applyPublished(reg, ["A-010"], on);
    expect(reg.find((a) => a.id === "A-010")!.published).toBeUndefined();
  });

  it("is a no-op with nothing published", () => {
    expect(applyPublished(reg, [], on)).toEqual(reg);
  });
});

describe("the published cookie", () => {
  it("round-trips", () => {
    expect(decodePublished(encodePublished(["A-010", "A-014"]))).toEqual(["A-010", "A-014"]);
  });

  it("does not record the same agreement twice", () => {
    expect(decodePublished(encodePublished(["A-010", "A-010"]))).toEqual(["A-010"]);
  });

  it("degrades to nothing", () => {
    expect(decodePublished(undefined)).toEqual([]);
    expect(decodePublished("%E0%A4%A")).toEqual([]);
  });
});

/**
 * Completion travels both ways, which is why it is not a list of ids.
 *
 * An agreement the sample data seeds complete can be reopened, and one seeded
 * incomplete can be marked — so the cookie has to be able to say *no* as well
 * as *yes*. A bare id list could only ever add.
 */
describe("applyCompletion", () => {
  const reg = [
    { id: "A-001", registrationStatus: "complete" },
    { id: "A-004", registrationStatus: "incomplete" },
  ] as unknown as Agreement[];

  it("marks the one that was marked", () => {
    const out = applyCompletion(reg, { "A-004": true });
    expect(out.find((a) => a.id === "A-004")!.registrationStatus).toBe("complete");
  });

  it("reopens the one that was reopened", () => {
    const out = applyCompletion(reg, { "A-001": false });
    expect(out.find((a) => a.id === "A-001")!.registrationStatus).toBe("incomplete");
  });

  it("leaves the others alone", () => {
    const out = applyCompletion(reg, { "A-004": true });
    expect(out.find((a) => a.id === "A-001")!.registrationStatus).toBe("complete");
  });

  it("does not mutate what it was given", () => {
    applyCompletion(reg, { "A-004": true });
    expect(reg.find((a) => a.id === "A-004")!.registrationStatus).toBe("incomplete");
  });

  it("is a no-op with nothing marked", () => {
    expect(applyCompletion(reg, {})).toEqual(reg);
  });

  /* A draft is registered as incomplete and then marked, in one visit. The two
     have to compose, because that is Scenario 2's own sequence. */
  it("marks a draft this session created", () => {
    const drafts = [{ id: "A-N01", registrationStatus: "incomplete" }] as unknown as Agreement[];
    expect(applyCompletion(drafts, { "A-N01": true })[0]!.registrationStatus).toBe("complete");
  });
});

describe("the completion cookie", () => {
  it("round-trips a mark and a reopening", () => {
    expect(decodeCompletion(encodeCompletion({ "A-004": true, "A-001": false }))).toEqual({
      "A-004": true,
      "A-001": false,
    });
  });

  it("lets the last write win, so undo does not need an order of operations", () => {
    const once = decodeCompletion(encodeCompletion({ "A-004": true }));
    expect(decodeCompletion(encodeCompletion({ ...once, "A-004": false }))).toEqual({
      "A-004": false,
    });
  });

  it("degrades to nothing", () => {
    expect(decodeCompletion(undefined)).toEqual({});
    expect(decodeCompletion("%E0%A4%A")).toEqual({});
  });

  /* A cookie carrying a bare separator, or a sign with no id behind it, must not
     produce a mark on an agreement called "". */
  it("ignores a record with no id", () => {
    expect(decodeCompletion(encodeCompletion({ "": true }))).toEqual({});
  });
});
