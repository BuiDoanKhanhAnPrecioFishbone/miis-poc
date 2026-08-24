import { describe, expect, it } from "vitest";

import { hasProposal, reportIntent, searchIntent } from "./nl-intent";

/**
 * The parser reads MI's own vocabulary and proposes a selection out of it.
 *
 * Every test here is also a claim about what the officer will see, because the
 * proposal is shown before it is applied: a condition this returns is a row in
 * an `AiRegion` with the words it was read from beside it, and `Godkänn` is the
 * only thing that puts it in the builder.
 */
describe("searchIntent — which register", () => {
  it("defaults to agreements, which is what an unqualified question means", () => {
    expect(searchIntent("privat sektor").infoType).toBe("agreements");
  });

  it("follows the word that names a register", () => {
    expect(searchIntent("visa alla medlingsärenden").infoType).toBe("mediation");
    expect(searchIntent("pågående förhandlingar").infoType).toBe("negotiations");
    expect(searchIntent("vilka parter finns").infoType).toBe("parties");
  });

  /* Swedish inflects the noun rather than adding an article, so a parser that
     matched whole tokens would miss every plural an officer actually types. */
  it("matches an inflected form", () => {
    expect(searchIntent("avtalen inom privat sektor").infoType).toBe("agreements");
    expect(searchIntent("medlingsärendena").infoType).toBe("mediation");
  });
});

describe("searchIntent — criteria", () => {
  it("reads a sector and says which words it read", () => {
    const out = searchIntent("avtal inom privat sektor");
    const sector = out.conditions.find((c) => c.field === "sector");
    expect(sector).toMatchObject({ field: "sector", operator: "is", value: "private" });
    expect(sector!.source).toContain("privat");
  });

  it("reads a construction by its number", () => {
    const out = searchIntent("avtal med konstruktion 3");
    expect(out.conditions.find((c) => c.field === "construction")?.value).toBe("3");
  });

  it("reads Märket as the benchmark flag", () => {
    const out = searchIntent("märkessättande avtal");
    expect(out.conditions.find((c) => c.field === "benchmarkFlag")?.value).toBe("yes");
  });

  /* A year is the end of that year: MI takes its reports for a year, and
     2027-01-01 answers a different question than the one asked. */
  it("reads a bare year as the end of it", () => {
    const out = searchIntent("avtal som gällde 2027");
    expect(out.conditions.find((c) => c.field === "validAt")).toMatchObject({
      operator: "asOf",
      value: "2027-12-31",
    });
  });

  it("keeps a full date as typed", () => {
    const out = searchIntent("avtal giltiga 2027-04-01");
    expect(out.conditions.find((c) => c.field === "validAt")?.value).toBe("2027-04-01");
  });

  it("flips to *is not* when the sentence excludes", () => {
    const out = searchIntent("avtal som inte är privat sektor");
    expect(out.conditions.find((c) => c.field === "sector")?.operator).toBe("isNot");
  });

  /* `asOf` is the only operator `validAt` has, so a negator near a date must
     not produce an operator the field does not offer. */
  it("does not invent an operator the field lacks", () => {
    const out = searchIntent("avtal som inte gällde 2027");
    expect(out.conditions.find((c) => c.field === "validAt")?.operator).toBe("asOf");
  });

  /* FR-002's information types share no field. Proposing a criterion the chosen
     register cannot answer is the tab-strip defect, written by a machine. */
  it("never proposes a criterion the chosen register does not offer", () => {
    const out = searchIntent("medlingsärenden med konstruktion 3");
    expect(out.infoType).toBe("mediation");
    expect(out.conditions.some((c) => c.field === "construction")).toBe(false);
  });

  it("proposes one condition per field, not two", () => {
    const out = searchIntent("privat sektor och statlig sektor");
    expect(out.conditions.filter((c) => c.field === "sector")).toHaveLength(1);
  });
});

describe("searchIntent — honesty about what it could not read", () => {
  it("reports the words it ignored", () => {
    expect(searchIntent("avtal inom privat sektor hos Teknikföretagen").unused).toContain(
      "teknikföretagen",
    );
  });

  /* Every proposal ended with "kunde inte tolka: som, med, för" until the noise
     list existed, which teaches an officer to stop reading the one line that
     says what the machine missed. */
  it("does not report ordinary connecting words as unread", () => {
    const out = searchIntent("visa alla avtal som gäller inom privat sektor");
    expect(out.unused).toEqual([]);
  });

  it("reports nothing readable as no proposal", () => {
    const out = searchIntent("hur mår du");
    expect(hasProposal(out)).toBe(false);
  });

  it("counts a register on its own as a proposal", () => {
    expect(hasProposal(searchIntent("medlingsärenden"))).toBe(true);
  });
});

describe("reportIntent", () => {
  it("picks the report from MI's own name", () => {
    expect(reportIntent("kör avtalsrörelse").reportId).toBe("avtalsrorelse");
    expect(reportIntent("huvudrapport för avtalet").reportId).toBe("huvudrapport");
  });

  /* An officer asks for what the report answers, not for its filed name. */
  it("picks it from what an officer actually says", () => {
    expect(reportIntent("vilka avtal löper ut").reportId).toBe("utlopningstidpunkter");
  });

  it("fills the year criterion where the report offers one", () => {
    const out = reportIntent("utlöpningstidpunkter 2027");
    expect(out.reportId).toBe("utlopningstidpunkter");
    expect(out.criteria.find((c) => c.id === "year")).toMatchObject({ value: "2027" });
  });

  it("does not fill a criterion the chosen report does not have", () => {
    const out = reportIntent("huvudrapport 2027");
    expect(out.criteria.some((c) => c.id === "year")).toBe(false);
  });

  it("proposes nothing when no report is named", () => {
    expect(hasProposal(reportIntent("vad kostar ett avtal"))).toBe(false);
  });

  /* The report is proposed, never run: Bilaga F's own opening is *urvalsbild
     och resultat*, and a machine that pressed the button would skip the half
     the officer is meant to check. */
  it("returns a selection rather than a result", () => {
    const out = reportIntent("avtalsrörelse 2027");
    expect(Object.keys(out)).not.toContain("result");
  });
});

describe("both parsers source-link every proposal", () => {
  it("names the words behind each search condition", () => {
    for (const c of searchIntent("avtal inom kommunal sektor 2027").conditions) {
      expect(c.source.length).toBeGreaterThan(0);
    }
  });

  it("names the words behind the report and its criteria", () => {
    const out = reportIntent("avtalsrörelse 2027 privat");
    expect(out.reportSource).toBeTruthy();
    for (const c of out.criteria) expect(c.source.length).toBeGreaterThan(0);
  });
});

/**
 * The catalogue's own words are not unread words.
 *
 * Every report is named *Avtal – something*, so an officer who types "vilka
 * avtal löper ut" has named the report. Reporting *avtal* back as something the
 * machine could not read is the noise that teaches people to stop reading the
 * line that says what it missed.
 */
describe("report names are not reported as unread", () => {
  it("does not report the word every report is named after", () => {
    expect(reportIntent("vilka avtal löper ut 2027").unused).not.toContain("avtal");
  });

  it("still reports a word that genuinely matched nothing", () => {
    expect(reportIntent("avtalsrörelse för Teknikföretagen").unused).toContain(
      "teknikföretagen",
    );
  });
});
