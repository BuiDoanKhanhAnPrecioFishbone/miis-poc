/**
 * Mock wage agreements — one row per agreement per bargaining round (FA-002).
 *
 * These exist so the Agreement Constructions report (FR-007) and the search
 * results count something real instead of a number typed into a screen. The
 * seven constructions are the MI-defined list in lib/domain/agreement.ts.
 *
 * Only signed agreements have one: a wage agreement is what the protocol
 * establishes, so an unsigned agreement has nothing to register yet.
 *
 * Week 2: becomes supabase/seed.sql. Nothing outside lib/data/ imports it.
 */

import type { WageAgreement } from "@/lib/domain/agreement";

export const WAGE_AGREEMENTS: WageAgreement[] = [
  {
    id: "LA-001",
    agreementId: "A-001",
    construction: 3,
    wageScopePercent: 3.2,
    costFramePercent: 6.4,
    individualGuarantee: false,
    workingTimeReduction: { costPercent: 0.2 },
    genderEqualityFlag: true,
    industryBenchmark: true,
    signedDate: "2027-03-31",
    validFrom: "2027-04-01",
    validTo: "2029-03-31",
    wageRevision: { date: "2027-04-01", percent: 3.2 },
    minimumWages: [
      { occupationalGroup: "Yrkesvana", amountSekPerMonth: 27140, revisionDate: "2027-04-01" },
      { occupationalGroup: "Nyanställda", amountSekPerMonth: 24380, revisionDate: "2027-04-01" },
    ],
  },
  /*
    The round before the current one, on the same agreement.

    Two rows rather than one because FA-002 makes the avtalsrörelse the unit and
    the comparison against the previous round *is* this table — with a single
    row there is nothing to compare, and the panel's own heading is plural.
    Sorted newest first by `listWageAgreements`, so this appears below LA-001.
  */
  {
    id: "LA-008",
    agreementId: "A-001",
    /* 5 — Lönepott med individgaranti. The 2027 round moved to 3, local wage
       formation with a fallback figure, and dropped the guarantee. */
    construction: 5,
    wageScopePercent: 3.1,
    costFramePercent: 6.2,
    individualGuarantee: true,
    genderEqualityFlag: false,
    industryBenchmark: true,
    signedDate: "2025-03-28",
    validFrom: "2025-04-01",
    validTo: "2027-03-31",
    wageRevision: { date: "2025-04-01", percent: 3.1 },
    minimumWages: [
      { occupationalGroup: "Yrkesvana", amountSekPerMonth: 26320, revisionDate: "2025-04-01" },
      { occupationalGroup: "Nyanställda", amountSekPerMonth: 23640, revisionDate: "2025-04-01" },
    ],
  },
  {
    id: "LA-002",
    agreementId: "A-002",
    construction: 4,
    wageScopePercent: 3.4,
    costFramePercent: 6.7,
    individualGuarantee: true,
    genderEqualityFlag: false,
    industryBenchmark: false,
    signedDate: "2027-05-12",
    validFrom: "2027-05-01",
    validTo: "2029-04-30",
    wageRevision: { date: "2027-05-01", percent: 3.4 },
  },
  {
    id: "LA-004",
    agreementId: "A-004",
    construction: 1,
    individualGuarantee: false,
    genderEqualityFlag: true,
    industryBenchmark: false,
    signedDate: "2027-06-02",
    validFrom: "2027-06-01",
    validTo: "2028-05-31",
  },
  {
    id: "LA-009",
    agreementId: "A-009",
    construction: 2,
    wageScopePercent: 3.2,
    costFramePercent: 6.4,
    individualGuarantee: false,
    genderEqualityFlag: true,
    industryBenchmark: false,
    signedDate: "2027-04-28",
    validFrom: "2027-05-01",
    validTo: "2029-04-30",
    wageRevision: { date: "2027-05-01", percent: 3.2 },
    minimumWages: [
      { occupationalGroup: "Städpersonal", amountSekPerMonth: 25480, revisionDate: "2027-05-01" },
    ],
  },
  {
    id: "LA-010",
    agreementId: "A-010",
    construction: 3,
    wageScopePercent: 3.1,
    costFramePercent: 6.2,
    individualGuarantee: false,
    genderEqualityFlag: false,
    industryBenchmark: false,
    signedDate: "2027-03-15",
    validFrom: "2027-04-01",
    validTo: "2029-03-31",
    wageRevision: { date: "2027-04-01", percent: 3.1 },
  },
  {
    id: "LA-011",
    agreementId: "A-011",
    construction: 1,
    individualGuarantee: false,
    genderEqualityFlag: true,
    industryBenchmark: false,
    signedDate: "2027-05-04",
    validFrom: "2027-05-01",
    validTo: "2029-04-30",
  },
  /*
    Teknikavtalet IF Metall is the agreement that sets Märket, and it is where
    Bilaga 2 §3.5's Scenario 3 ends — the member of the public opens it, reads
    it and downloads it. It had no wage agreement at all, so the public page
    printed a validity period at the top and "Ingen löptid registrerad" three
    panels below it, which is the register contradicting itself in front of the
    one visitor who cannot ask anyone what it means.
  */
  {
    id: "LA-007",
    agreementId: "A-013",
    construction: 3,
    wageScopePercent: 3.2,
    costFramePercent: 6.4,
    individualGuarantee: false,
    workingTimeReduction: { costPercent: 0.2 },
    genderEqualityFlag: true,
    industryBenchmark: true,
    signedDate: "2027-03-31",
    validFrom: "2027-04-01",
    validTo: "2029-03-31",
    wageRevision: { date: "2027-04-01", percent: 3.2 },
    minimumWages: [
      { occupationalGroup: "Yrkesvana", amountSekPerMonth: 28460, revisionDate: "2027-04-01" },
      { occupationalGroup: "Nyanställda", amountSekPerMonth: 25120, revisionDate: "2027-04-01" },
    ],
  },
];
