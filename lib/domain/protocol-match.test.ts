import { describe, expect, it } from "vitest";

import {
  matchCandidates,
  matchReasonLabel,
  proposedMatch,
  type MatchableAgreement,
} from "./protocol-match";

/**
 * §4.1's first function: *"identifiera vilket befintligt avtal det rör sig om"*,
 * with MI's own two fallbacks — the file name, and the parties' shared
 * agreements — for the case where the heading names no agreement.
 *
 * The prototype used to return a hard-coded id, so the screen asserted a match
 * rather than making one, and the field carrying the panel's headline claim was
 * the one field an officer could not correct.
 */
const REGISTER: MatchableAgreement[] = [
  {
    id: "A-001",
    name: "Stål- och metallindustrin",
    employerOrg: "Industriarbetsgivarna",
    employeeOrg: "IF Metall",
  },
  {
    id: "A-010",
    name: "Bemanning",
    employerOrg: "Kompetensföretagen",
    employeeOrg: "Unionen",
  },
  {
    id: "A-N01",
    name: "Provavtalet",
    employerOrg: "Almega Tjänsteförbunden",
    employeeOrg: "Kommunal",
  },
];

describe("identifying the agreement a protocol concerns", () => {
  it("matches on the agreement name in the heading", () => {
    const hit = proposedMatch({
      agreements: REGISTER,
      readName: "Stål- och metallindustrin – Industriarbetsgivarna / Unionen",
    });
    expect(hit?.id).toBe("A-001");
    expect(hit?.reason).toBe("name");
  });

  /* MI's own words: *lista parternas gemensamma avtal som underlag för
     identifiering*. An agreement between exactly these two is a candidate
     whatever the heading says. */
  it("matches on both parties when the heading names no agreement", () => {
    const hit = proposedMatch({
      agreements: REGISTER,
      readEmployerOrg: "Kompetensföretagen",
      readEmployeeOrg: "Unionen",
    });
    expect(hit?.id).toBe("A-010");
    expect(hit?.reason).toBe("parties");
  });

  /* FA-018 — "hantering av protokoll där avtalsnamn inte framgår". */
  it("falls back to the file name", () => {
    const hit = proposedMatch({
      agreements: REGISTER,
      fileName: "Provavtalet 2027-04.pdf",
    });
    expect(hit?.id).toBe("A-N01");
    expect(hit?.reason).toBe("fileName");
  });

  it("prefers the name over the parties, and the parties over the file name", () => {
    const all = matchCandidates({
      agreements: REGISTER,
      readName: "Bemanning",
      readEmployerOrg: "Industriarbetsgivarna",
      readEmployeeOrg: "IF Metall",
      fileName: "Provavtalet.pdf",
    });
    expect(all.map((c) => c.reason)).toEqual(["name", "parties", "fileName"]);
  });

  /* One agreement, one row. Listing it under every reason that applied would
     make the picker look longer than the register. */
  it("lists an agreement once, under its strongest reason", () => {
    const all = matchCandidates({
      agreements: REGISTER,
      readName: "Stål- och metallindustrin",
      readEmployerOrg: "Industriarbetsgivarna",
      readEmployeeOrg: "IF Metall",
    });
    expect(all.filter((c) => c.id === "A-001")).toHaveLength(1);
    expect(all[0]!.reason).toBe("name");
  });

  /* §4.1's other case: a protocol about an agreement the register does not
     hold is one that has to be registered manually, so a matcher that picked
     the least-bad row would send the officer to correct the wrong record. */
  it("proposes nothing rather than guessing", () => {
    expect(
      proposedMatch({ agreements: REGISTER, readName: "Ett avtal som inte finns" }),
    ).toBeUndefined();
    expect(proposedMatch({ agreements: [] })).toBeUndefined();
  });

  it("names what each candidate was read from", () => {
    const hit = proposedMatch({ agreements: REGISTER, fileName: "Provavtalet.pdf" });
    expect(hit?.source).toBe("Provavtalet.pdf");
  });

  /*
    The one that makes the walkthrough run on a single subject: an agreement
    registered by hand a minute ago is in the register, so the protocol that
    arrives about it has something to match against.
  */
  it("matches an agreement created this session", () => {
    const draft: MatchableAgreement = {
      id: "A-N02",
      name: "Fastighetsavtalet",
      employerOrg: "Fastigo",
      employeeOrg: "Fastighetsanställdas Förbund",
    };
    const hit = proposedMatch({
      agreements: [...REGISTER, draft],
      readName: "Fastighetsavtalet",
    });
    expect(hit?.id).toBe("A-N02");
  });

  /* A two-character party name would otherwise match every row it appears in. */
  it("ignores a fragment too short to identify anything", () => {
    expect(matchCandidates({ agreements: REGISTER, readName: "AB" })).toEqual([]);
  });

  it("is insensitive to case and to the dash MI's headings use", () => {
    const hit = proposedMatch({
      agreements: REGISTER,
      readName: "STÅL— OCH METALLINDUSTRIN",
    });
    expect(hit?.id).toBe("A-001");
  });

  it("names the reason in both languages", () => {
    expect(matchReasonLabel("fileName", "sv")).toMatch(/[Ff]ilnamn/);
    expect(matchReasonLabel("fileName", "en")).toMatch(/file name/i);
  });
});
