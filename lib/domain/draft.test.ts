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
