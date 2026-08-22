import { describe, expect, it } from "vitest";

import { REQUIREMENTS } from "./requirements";
import {
  bargainingRoundReport,
  criteriaGroups,
  expiryReport,
  EXPIRY_CONFEDERATION,
  isCurrent,
  isReleasableFile,
  mediatorRelease,
  monthShare,
  reportById,
  reportsForRole,
  REPORTS,
  selectionSummary,
  UNGROUPED_MEMBERS,
  type ReleaseDocument,
  type ReportAgreement,
} from "./report";

/**
 * Bilaga F's own opening line is the specification these assertions defend:
 * *"För varje rapport visas urvalsbild och resultat."* A report is a selection
 * screen plus a printout, and the selection differs per report — three criteria
 * for the single-agreement reports, nine for the population reports, and a
 * three-part form for the pension report. Flattening that into one form would
 * be the easy mistake, and it would be visible to anyone at MI who has ever run
 * one of these.
 */
describe("the report catalogue", () => {
  it("holds all six of Bilaga F's reports, numbered as MI numbers them", () => {
    const numbers = REPORTS.map((r) => r.bilagaF).filter(Boolean).sort();
    expect(numbers).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("cites only requirement IDs that exist", () => {
    for (const report of REPORTS) {
      for (const id of report.requirements) {
        expect(REQUIREMENTS[id], `${report.id} cites ${id}`).toBeDefined();
      }
    }
  });

  it("gives the single-agreement reports MI's own three criteria", () => {
    for (const id of ["allmanheten", "huvudrapport", "medlare"]) {
      const report = reportById(id);
      expect(report?.criteria.map((c) => c.id)).toEqual([
        "employerOrg",
        "employeeOrg",
        "agreement",
      ]);
    }
  });

  it("gives the two population reports MI's own nine, including both confederations", () => {
    for (const id of ["avtalskonstruktioner", "avtalsrorelse"]) {
      const ids = reportById(id)!.criteria.map((c) => c.id);
      expect(ids).toHaveLength(9);
      /* MI's screen shows Centralorganisation twice — once per side. */
      expect(ids).toContain("employerCentralOrg");
      expect(ids).toContain("employeeCentralOrg");
    }
  });

  it("splits the pension report's criteria into MI's three blocks", () => {
    const groups = criteriaGroups(reportById("pensionsavtal")!, "sv");
    expect(groups).toHaveLength(3);
    expect(groups[0]!.group).toBeNull();
    expect(groups[1]!.group).toBe("Avtalsparter på löneavtal och allmänna villkor");
    expect(groups[2]!.group).toBe("Avtalsparter på pensionsavtal och övriga avtal");
  });

  /* FR-008 says the report is written out *from a view*, so it is the one
     report with no selection screen. That is MI's design, not an omission. */
  it("gives the Short-Term Wage Report no selection screen", () => {
    expect(reportById("konjunkturlon")!.criteria).toHaveLength(0);
  });

  it("marks the website and Eurofound reports as MI marks them — Steg 2", () => {
    expect(reportById("hemsida")!.stage).toBe(2);
    expect(reportById("eurofound")!.stage).toBe(2);
    expect(reportById("avtalskonstruktioner")!.stage).toBe(1);
  });

  it("offers at least the three formats FR-005 names", () => {
    for (const report of REPORTS) {
      expect(report.formats.length).toBeGreaterThan(0);
    }
    expect(reportById("avtalskonstruktioner")!.formats).toContain("pdf");
    expect(reportById("avtalskonstruktioner")!.formats).toContain("word");
    expect(reportById("avtalskonstruktioner")!.formats).toContain("excel");
  });
});

/**
 * The printed Urvalskriterier block. MI prints every criterion, and the ones
 * left blank read "Alla" — a reader has to be able to see that Sektor was *not*
 * narrowed, and an absent line does not say that.
 */
describe("selectionSummary", () => {
  it("prints every criterion, filling the empty ones with Alla", () => {
    const rows = selectionSummary(
      reportById("avtalsrorelse")!,
      { employerOrg: "Almega Tjänsteförbunden" },
      "sv",
      "Alla",
    );
    expect(rows).toHaveLength(9);
    expect(rows.find((r) => r.label === "Arbetsgivarorganisation")?.value).toBe(
      "Almega Tjänsteförbunden",
    );
    expect(rows.find((r) => r.label === "Sektor")?.value).toBe("Alla");
  });
});

/**
 * Avtalsrörelserapporten counts agreements by the month they **expire**, split
 * by FR-012's own status. Both halves matter: a report that counted rows would
 * make one Kommunal agreement the equal of a thirty-person one.
 */
describe("bargainingRoundReport — FR-006", () => {
  const status = (a: { signedDate?: string | undefined; mediationLinked?: boolean | undefined }) =>
    a.mediationLinked
      ? { code: a.signedDate ? "after-mediation" : "remaining" }
      : { code: a.signedDate ? "newly-signed" : "remaining" };

  const agreements = [
    { validTo: "2027-04-30", employees: 1000, signedDate: "2027-03-01" },
    { validTo: "2027-04-15", employees: 500 },
    { validTo: "2027-11-30", employees: 250, signedDate: "2027-10-01", mediationLinked: true },
    { validTo: "2029-03-31", employees: 9999, signedDate: "2027-03-01" },
    /* No employee count — counted as an agreement, not as zero people. */
    { validTo: "2027-04-30", signedDate: "2027-02-01" },
  ];

  const report = bargainingRoundReport(agreements, 2027, status);

  it("buckets by the month the agreement expires", () => {
    expect(report.agreements[3]!.month).toBe(4);
    expect(report.agreements[3]!.newlySigned).toBe(2);
    expect(report.agreements[3]!.remaining).toBe(1);
    expect(report.agreements[10]!.afterMediation).toBe(1);
  });

  it("leaves other years out", () => {
    const { newlySigned, remaining, afterMediation } = report.agreementTotal;
    expect(newlySigned + remaining + afterMediation).toBe(4);
  });

  it("counts employees separately, and omits agreements that have no figure", () => {
    expect(report.employees[3]!.newlySigned).toBe(1000);
    expect(report.employees[3]!.remaining).toBe(500);
    expect(report.employeeTotal.afterMediation).toBe(250);
  });

  it("has twelve months whether or not anything falls in them", () => {
    expect(report.agreements).toHaveLength(12);
    expect(report.agreements[0]!.remaining).toBe(0);
  });
});

describe("monthShare", () => {
  it("is a percentage to one decimal, as MI prints it", () => {
    expect(monthShare(1, 3)).toBe(33.3);
    expect(monthShare(2, 3)).toBe(66.7);
  });

  it("is zero rather than NaN when nothing was counted", () => {
    expect(monthShare(0, 0)).toBe(0);
  });
});

/**
 * §3.1 gives *Allmänhetens dator* and *Medlare* the same permission —
 * **"Specifika rapporter"** — and Bilaga 3 names which. "Specific" is a closed
 * list, so it is data rather than something inferred from a menu.
 */
describe("reportsForRole — §3.1 and Bilaga 3", () => {
  it("gives the public computer MI's own one report", () => {
    expect(reportsForRole("public", true).map((r) => r.id)).toEqual(["allmanheten"]);
  });

  it("gives the mediator Bilaga 3 §5.1's three, and only those", () => {
    expect(reportsForRole("mediator", true).map((r) => r.id).sort()).toEqual([
      "avtalsrorelse",
      "medlare",
      "utlopningstidpunkter",
    ]);
  });

  it("gives MI's own staff the whole catalogue", () => {
    expect(reportsForRole("agreement-admin", false)).toHaveLength(REPORTS.length);
  });

  /* It narrows; it never grants. A role with no reports named gets none. */
  it("gives an external role with no reports named nothing at all", () => {
    expect(reportsForRole("statistics-user", true)).toHaveLength(0);
  });
});

/**
 * Bilaga 3 §7.11 — the seventh report, which Bilaga F does not contain and
 * which we would not have known about without the manual.
 */
describe("the expiry report — Bilaga 3 §7.11", () => {
  const a = (over: Partial<ReportAgreement>): ReportAgreement => ({
    id: "A", name: "A", employerOrg: "AGO", employeeOrg: "ATO",
    confidential: false, validity: "–", ...over,
  });

  const list = [
    a({ id: "sn1", validTo: "2027-04-30", employees: 1000, signedDate: "2026-01-01",
        employerCentralOrg: "Svenskt Näringsliv", employerGroup: "Almega" }),
    a({ id: "sn2", validTo: "2027-04-15", employees: 500, signedDate: "2026-01-01",
        employerCentralOrg: "Svenskt Näringsliv", employerGroup: "Industriarbetsgivarna" }),
    a({ id: "other", validTo: "2027-11-30", employees: 250, signedDate: "2026-01-01",
        employerCentralOrg: "Fristående" }),
    /* Unsigned — *kvarstående*, so not "gällande" and out of the report. */
    a({ id: "unsigned", validTo: "2027-04-30", employees: 9999 }),
    /* Expired in January — still in the 2027 report. A report taken in June has
       to show the whole year, which is the point of taking it. */
    a({ id: "january", validTo: "2027-01-31", employees: 400, signedDate: "2025-01-01" }),
    /* A different year. */
    a({ id: "later", validTo: "2029-03-31", employees: 800, signedDate: "2026-01-01" }),
  ];

  const report = expiryReport(list, 2027);

  it('counts only agreements in force — "Endast gällande avtal ingår"', () => {
    expect(report.all.totalAgreements).toBe(4);
    expect(report.all.totalEmployees).toBe(2150);
    /* The unsigned one is kvarstående and is out. */
    expect(report.all.months[3]!.agreements).toBe(2);
  });

  it("buckets by the month the agreement expires", () => {
    expect(report.all.months[3]!.agreements).toBe(2);
    expect(report.all.months[3]!.employees).toBe(1500);
    expect(report.all.months[10]!.agreements).toBe(1);
  });

  it("breaks Svenskt Näringsliv out from the whole", () => {
    expect(report.confederation.totalAgreements).toBe(2);
    expect(report.confederation.totalEmployees).toBe(1500);
  });

  it("breaks Svenskt Näringsliv down by employer group, largest first", () => {
    expect(report.byEmployerGroup.map((g) => g.group)).toEqual([
      "Almega",
      "Industriarbetsgivarna",
    ]);
  });

  /*
    A member with no group of its own is *Övriga Svenskt Näringsliv*, which is
    one of the four groups MI's own Rapport 2 names — not a group named after
    the confederation. Svenskt Näringsliv is not an arbetsgivargrupp, and a
    section reading "Svenskt Näringsliv" inside "Svenskt Näringsliv per
    arbetsgivargrupp" says nothing.
  */
  it("counts an ungrouped member as Övriga Svenskt Näringsliv", () => {
    const ungrouped = expiryReport(
      [
        a({ id: "sn3", validTo: "2027-06-30", employees: 300, signedDate: "2026-01-01",
            employerCentralOrg: "Svenskt Näringsliv" }),
      ],
      2027,
    );
    expect(ungrouped.byEmployerGroup.map((g) => g.group)).toEqual([UNGROUPED_MEMBERS]);
    expect(UNGROUPED_MEMBERS).not.toBe(EXPIRY_CONFEDERATION);
  });

  it("has twelve months in every section", () => {
    expect(report.all.months).toHaveLength(12);
    expect(report.confederation.months).toHaveLength(12);
    for (const g of report.byEmployerGroup) expect(g.months).toHaveLength(12);
  });
});

describe("isCurrent", () => {
  it("counts a signed agreement", () => {
    expect(isCurrent({ signedDate: "2026-01-01" })).toBe(true);
  });

  /* Unsigned is *kvarstående*: the previous agreement is still applied, but the
     one the report is about does not exist, so its expiry is nobody's date. */
  it("does not count an unsigned agreement", () => {
    expect(isCurrent({})).toBe(false);
  });

  /*
    Not "has not run out yet". A report taken in June for 2027 has to show
    April — an earlier draft compared against the extraction date and dropped
    two thirds of the year.
  */
  it("still counts one whose period has already ended", () => {
    expect(isCurrent({ signedDate: "2024-01-01" })).toBe(true);
  });
});

/**
 * Avtal – Medlare, Bilaga 3 §7.4.
 *
 * The report used to point the reader at `/avtal`, which is the one thing the
 * role it exists for cannot open — §3.1 gives Medlare Start and Rapporter. A
 * report a role may run has to produce something that role may read, so these
 * assertions are about the printout rather than about a link.
 */
describe("mediatorRelease — Bilaga 3 §7.4", () => {
  const a = (over: Partial<ReportAgreement>): ReportAgreement => ({
    id: "A", name: "A", employerOrg: "Almega", employeeOrg: "Unionen",
    confidential: false, validity: "2027-01-01–2029-01-01", signedDate: "2027-01-01", ...over,
  });

  const doc = (over: Partial<ReleaseDocument>): ReleaseDocument => ({
    id: "D", fileName: "f.pdf", uploadedDate: "2027-01-01", type: "protocol",
    agreementId: "A-1", confidential: false, ...over,
  });

  const target = a({ id: "A-1", name: "Fastigheter" });
  const register = [
    target,
    a({ id: "A-2", name: "Apotek", employeeOrg: "Sveriges Farmaceuter" }),
    a({ id: "A-3", name: "Spel", employeeOrg: "HRF" }),
    /* Another employer organisation entirely — not this mediator's business. */
    a({ id: "A-4", name: "Stål", employerOrg: "Industriarbetsgivarna" }),
    /* Same employer, but marked — §5.1 keeps it out of the mediator interface. */
    a({ id: "A-5", name: "Hemligt", employeeOrg: "Kommunal", confidential: true }),
    /* Same employer, but unsigned — "endast giltiga avtal visas". */
    a({ id: "A-6", name: "Ej tecknat", employeeOrg: "Seko", signedDate: undefined }),
  ];

  const documents = [
    doc({ id: "D-2", fileName: "Bvtalsprotokoll.pdf" }),
    doc({ id: "D-1", fileName: "Avtalsprotokoll.pdf" }),
    doc({ id: "D-3", fileName: "Avtalstryck.pdf", type: "agreement" }),
    doc({ id: "D-4", fileName: "Medlarrapport.pdf", type: "mediator-report" }),
    doc({ id: "D-5", fileName: "GD-beslut.pdf", type: "dg-decision" }),
    /* MI's own exclusions, §7.4. */
    doc({ id: "D-6", fileName: "meddelande_från_ombudet.pdf" }),
    doc({ id: "D-7", fileName: "image001.png" }),
    doc({ id: "D-8", fileName: "Korrespondens.msg" }),
    doc({ id: "D-9", fileName: "Korrespondens.eml" }),
    /* Someone else's agreement. */
    doc({ id: "D-10", fileName: "Annat.pdf", agreementId: "A-4" }),
  ];

  const release = mediatorRelease(target, documents, register)!;

  it("splits the documents into MI's own four sections", () => {
    expect(release.protocols.map((d) => d.id)).toEqual(["D-1", "D-2"]);
    expect(release.agreementFiles.map((d) => d.id)).toEqual(["D-3"]);
    expect(release.mediationFiles.map((d) => d.id).sort()).toEqual(["D-4", "D-5"]);
  });

  it("sorts each section by file name, as §7.4 specifies", () => {
    expect(release.protocols.map((d) => d.fileName)).toEqual([
      "Avtalsprotokoll.pdf",
      "Bvtalsprotokoll.pdf",
    ]);
  });

  /* Mail artefacts that ended up on the case are not documents anyone meant to
     hand a mediator, and MI's manual names them by prefix and extension. */
  it("drops meddelande, image, .msg and .eml", () => {
    for (const id of ["D-6", "D-7", "D-8", "D-9"]) {
      expect(release.protocols.some((d) => d.id === id)).toBe(false);
    }
    expect(isReleasableFile("Avtalsprotokoll.pdf")).toBe(true);
    expect(isReleasableFile("Meddelande.pdf")).toBe(false);
    expect(isReleasableFile("brev.MSG")).toBe(false);
  });

  it("lists the employer organisation's other agreements, by union then name", () => {
    expect(release.otherAgreements.map((o) => o.name)).toEqual(["Spel", "Apotek"]);
  });

  /*
    A confidentiality-marked agreement produces no release at all. Withholding
    fields from a page that still names the agreement would be the same failure
    as hiding a value with CSS: the fact that this agreement exists between
    these two parties is itself what D-002 keeps back.
  */
  it("releases nothing for a marked agreement", () => {
    expect(mediatorRelease(register[4]!, documents, register)).toBeNull();
  });

  it("releases nothing for an agreement that is not in force", () => {
    expect(mediatorRelease(register[5]!, documents, register)).toBeNull();
  });
});

/*
  Every report produces a report.

  Bilaga 3 §7 opens by requiring it: *"For varje rapport visas urvalsbild och
  resultat."* Six of the ten had the first and not the second — four resolved to
  a link to another screen and two to the words *Steg 2*, so pressing *Generera
  rapport* on more than half the catalogue produced no report at all. That is
  the same defect as a `<Button>` with no `onClick`, wearing MI's own report
  name, and this is the assertion that keeps it from coming back.
*/
describe("every report has a result — Bilaga 3 §7", () => {
  it.each(REPORTS.map((r) => [r.id, r] as const))("%s produces something inline", (_id, report) => {
    expect(report.result.kind).toBe("inline");
    expect(report.result.component).toBeTruthy();
  });

  /* And each result component is distinct enough to be routed to: two reports
     sharing a component would print the same thing under two names. */
  it("gives the single-agreement reports their own audience", () => {
    const byId = (id: string) => REPORTS.find((r) => r.id === id)!;
    expect(byId("huvudrapport").result.component).toBe("agreement-main");
    expect(byId("allmanheten").result.component).toBe("agreement-public");
  });

  /*
    A report that prints one agreement has to offer the criterion that picks it.
    Otherwise the document has no way of knowing which record it is about, which
    is the same dead urvalsbild in a different disguise.
  */
  it.each(
    REPORTS.filter(
      (r) =>
        r.result.component === "agreement-main" || r.result.component === "agreement-public",
    ).map((r) => [r.id, r] as const),
  )("%s offers the agreement criterion it needs", (_id, report) => {
    expect(report.criteria.some((c) => c.kind === "agreement")).toBe(true);
  });
});
