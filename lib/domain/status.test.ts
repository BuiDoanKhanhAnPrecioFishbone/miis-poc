import { describe, expect, it } from "vitest";

import { agreementStatus, statusInfo } from "./status";

/**
 * FR-012 is the one status whose colours MI specified, and the rule is stated
 * in full in their own words:
 *
 * > Systemet ska stödja färgkodning av avtals-status, där nytecknade avtal utan
 * > medling markeras med grön färg, avtal som tecknats efter medling markeras
 * > med röd färg och kvarstående avtal visas i blått, men rödmarkeras om de har
 * > koppling till medling.
 *
 * Four branches, and the fourth — blue turning red — is the one that has
 * already been got wrong once in this repository: a mediation view hardcoded
 * "after mediation" and contradicted the agreement tables, which is why the
 * information model says the coding is derived and never stored. These tests
 * are the guard on that.
 */
describe("agreementStatus — FR-012", () => {
  it("is green when newly signed without mediation", () => {
    const s = agreementStatus({ signedDate: "2027-05-28" });
    expect(s.code).toBe("newly-signed");
    expect(s.color).toBe("green");
  });

  it("is red when signed after mediation", () => {
    const s = agreementStatus({ signedDate: "2027-05-28", mediationLinked: true });
    expect(s.code).toBe("after-mediation");
    expect(s.color).toBe("red");
  });

  it("is blue while remaining", () => {
    const s = agreementStatus({});
    expect(s.code).toBe("remaining");
    expect(s.color).toBe("blue");
  });

  it("is red when remaining but linked to mediation", () => {
    const s = agreementStatus({ mediationLinked: true });
    expect(s.code).toBe("remaining");
    expect(s.color).toBe("red");
  });

  /*
    NFUI-003 and CLAUDE.md rule 3: colour is never the only carrier. A status
    that reached a screen without a shape or a label would fail 1.4.1, and a
    reviewer would have no way to see it in a screenshot.
  */
  it("always carries a shape and a label alongside the colour", () => {
    const cases = [
      agreementStatus({ signedDate: "2027-05-28" }),
      agreementStatus({ signedDate: "2027-05-28", mediationLinked: true }),
      agreementStatus({}),
      agreementStatus({ mediationLinked: true }),
    ];
    for (const s of cases) {
      expect(s.shape).toBeTruthy();
      expect(s.label.trim().length).toBeGreaterThan(0);
    }
  });

  it("labels in the requested language", () => {
    expect(agreementStatus({ signedDate: "2027-05-28" }, "sv").label).not.toBe(
      agreementStatus({ signedDate: "2027-05-28" }, "en").label,
    );
  });

  it("gives the three coded statuses distinct colours", () => {
    const colors = (["newly-signed", "after-mediation", "remaining"] as const).map(
      (c) => statusInfo(c).color,
    );
    expect(new Set(colors).size).toBe(3);
  });
});
