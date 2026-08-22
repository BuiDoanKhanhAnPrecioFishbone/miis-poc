import { describe, expect, it } from "vitest";

import {
  agreementDocument,
  type ReportAgreement,
  type ReportDocumentLabels,
} from "./report";

const L: ReportDocumentLabels = {
  none: "–",
  yes: "Ja",
  no: "Nej",
  withheld: { sv: "Uppgifterna lämnas inte ut", en: "Withheld" },
  identity: { sv: "Identitet", en: "Identity" },
  rounds: { sv: "Avtalsrörelser", en: "Bargaining rounds" },
  noRounds: { sv: "Inget löneavtal registrerat", en: "No wage agreement registered" },
  lifecycle: { sv: "Uppsägning", en: "Termination" },
  scope: { sv: "Omfattning", en: "Scope" },
  agreement: { sv: "Avtal", en: "Agreement" },
  employerOrg: { sv: "Arbetsgivarorganisation", en: "Employer organisation" },
  employeeOrg: { sv: "Arbetstagarorganisation", en: "Employee organisation" },
  agreementType: { sv: "Avtalstyp", en: "Agreement type" },
  sector: { sv: "Sektor", en: "Sector" },
  industryCode: { sv: "Branschkod", en: "Industry code" },
  signedDate: { sv: "Tecknat", en: "Signed" },
  validity: { sv: "Löptid", en: "Validity" },
  year: { sv: "Årtal", en: "Year" },
  construction: { sv: "Konstruktion", en: "Construction" },
  wageScope: { sv: "Löneutrymme", en: "Wage scope" },
  costFrame: { sv: "Kostnadsram", en: "Cost frame" },
  period: { sv: "Period", en: "Period" },
  expiresWithoutRenewal: { sv: "Upphör utan uppsägning", en: "Expires without notice" },
  earlyTermination: { sv: "Uppsagt", en: "Terminated early" },
  terminated: { sv: "Avtalet upphört", en: "Agreement ended" },
  employees: { sv: "Anställda", en: "Employees" },
};

const agreement = (over: Partial<ReportAgreement> = {}): ReportAgreement => ({
  id: "A-001",
  name: "Teknikavtalet",
  confidential: false,
  validity: "2027-04-01 – 2029-03-31",
  validFrom: "2027-04-01",
  validTo: "2029-03-31",
  employerOrg: "Teknikföretagen",
  employeeOrg: "IF Metall",
  sector: "Privat",
  signedDate: "2027-03-28",
  employees: 4200,
  ...over,
});

const rounds = [
  { year: 2027, construction: 3, wageScopePercent: 3.4, costFramePercent: 4.1, validFrom: "2027-04-01", validTo: "2029-03-31" },
];

const partOf = (doc: ReturnType<typeof agreementDocument>, heading: string) =>
  doc.parts.find((p) => p.heading.sv === heading);

/**
 * Bilaga 3 §7 opens with *"För varje rapport visas urvalsbild och resultat."*
 * Six of the ten reports had a urvalsbild and no resultat — four handed the
 * officer a link to another screen, two said Steg 2. A report whose result is a
 * link to the register is not a report.
 */
describe("agreementDocument — the report actually produces a document", () => {
  it("carries MI's Rapporthuvud fields in §7.1's order", () => {
    const doc = agreementDocument(agreement(), rounds, "internal", L);
    const facts = partOf(doc, "Identitet")!.facts!.map((f) => f.label.sv);
    expect(facts).toEqual([
      "Avtal",
      "Arbetsgivarorganisation",
      "Arbetstagarorganisation",
      "Avtalstyp",
      "Sektor",
      "Branschkod",
      "Tecknat",
      "Löptid",
    ]);
  });

  it("prints an absent value as MI's dash rather than as a blank", () => {
    const doc = agreementDocument(agreement({ signedDate: undefined }), rounds, "internal", L);
    const signed = partOf(doc, "Identitet")!.facts!.find((f) => f.label.sv === "Tecknat");
    expect(signed!.value).toBe("–");
  });

  /* FA-002 — one row per avtalsrörelse, which is what an agreement has instead
     of a version list. */
  it("gives the rounds a row each", () => {
    const doc = agreementDocument(agreement(), rounds, "internal", L);
    expect(partOf(doc, "Avtalsrörelser")!.table!.rows).toHaveLength(1);
  });

  it("says so when there is no wage agreement, rather than printing an empty table", () => {
    const doc = agreementDocument(agreement(), [], "internal", L);
    const part = partOf(doc, "Avtalsrörelser")!;
    expect(part.table).toBeUndefined();
    expect(part.note?.sv).toBe("Inget löneavtal registrerat");
  });
});

/**
 * §7.3 prints the parties, the area, the signing date, the period and the
 * rounds. It does not print the cost frame or the wage scope — those are MI's
 * working material, and this is the release.
 */
describe("the public audience gets a different document, not a hidden one", () => {
  it("drops the wage columns rather than blanking them", () => {
    const pub = agreementDocument(agreement(), rounds, "public", L);
    const headers = partOf(pub, "Avtalsrörelser")!.table!.headers.map((h) => h.sv);
    expect(headers).toEqual(["Årtal", "Konstruktion", "Period"]);
    expect(headers).not.toContain("Löneutrymme");
    expect(headers).not.toContain("Kostnadsram");
  });

  /*
    The figures must be absent from the structure, not merely unrendered. A
    value hidden by CSS — or by a component choosing not to paint it — is still
    in the document, and FR-011 is about what may leave the building.
  */
  it("does not carry the wage figures anywhere in the document", () => {
    const pub = agreementDocument(agreement(), rounds, "public", L);
    expect(JSON.stringify(pub)).not.toContain("3.4");
    expect(JSON.stringify(pub)).not.toContain("4.1");
  });

  it("keeps the scope figures internal", () => {
    expect(partOf(agreementDocument(agreement(), rounds, "internal", L), "Omfattning")).toBeDefined();
    expect(partOf(agreementDocument(agreement(), rounds, "public", L), "Omfattning")).toBeUndefined();
  });

  it("still gives the internal reader both wage columns", () => {
    const doc = agreementDocument(agreement(), rounds, "internal", L);
    expect(partOf(doc, "Avtalsrörelser")!.table!.headers.map((h) => h.sv)).toContain("Löneutrymme");
  });
});

/**
 * D-002 keeps a marked agreement listed and counted; FR-011 keeps its detail
 * in. The reader is told something exists and is being withheld, which is a
 * different and truer answer than an empty page.
 */
describe("FR-011 and D-002 — a marked agreement", () => {
  it("has no parts at all for a public reader, and says why", () => {
    const doc = agreementDocument(agreement({ confidential: true }), rounds, "public", L);
    expect(doc.parts).toEqual([]);
    expect(doc.withheld?.sv).toBe("Uppgifterna lämnas inte ut");
  });

  it("withholds from a mediator too — §5.1 excludes marked agreements", () => {
    const doc = agreementDocument(agreement({ confidential: true }), rounds, "mediator", L);
    expect(doc.withheld).toBeDefined();
  });

  it("carries nothing of the record in the withheld document but its own name", () => {
    const doc = agreementDocument(agreement({ confidential: true }), rounds, "public", L);
    const json = JSON.stringify(doc);
    expect(json).not.toContain("Teknikföretagen");
    expect(json).not.toContain("4200");
  });

  it("is still readable internally, which is the point of a marking", () => {
    const doc = agreementDocument(agreement({ confidential: true }), rounds, "internal", L);
    expect(doc.withheld).toBeUndefined();
    expect(doc.parts.length).toBeGreaterThan(0);
  });
});
