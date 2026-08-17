/**
 * Mock mediation cases and mediators.
 *
 * The case record carries its own decision support and documents, so adding a
 * case means editing one object — there is no parallel detail table.
 *
 * Week 2: becomes supabase/seed.sql. Nothing outside lib/data/ imports it.
 */

import type { MediationCase, Mediator } from "@/lib/domain/mediation";

export const MEDIATION_CASES: MediationCase[] = [
  {
    id: "M-2027-12",
    name: "Spårtrafik – Tågföretagen / Seko",
    type: "special",
    registryNumber: "2027/59",
    dgDecision: {
      number: "GD-beslut nr 12/2027",
      date: "2027-05-03",
      document: "GD-beslut_12-2027.pdf",
    },
    agreementIds: ["A-002", "A-008"],
    mediators: [
      { id: "ME-01", name: "Gunilla Runnquist", position: "first-chair", previousAssignments: 14 },
      { id: "ME-02", name: "Bengt Huldt", position: "second-chair", previousAssignments: 9 },
    ],
    coveredByProcedureAgreement: false,
    status: { sv: "Pågående", en: "Ongoing" },
    ongoing: true,
    outcome: {
      mediationType: "special",
      industrialAction: true,
      industrialActionType: "Strejk",
      lostWorkingDays: 2400,
      affectedEmployees: 1150,
    },
    decisionSupport: {
      otherParties: {
        sv: "SRAT och Sveriges Ingenjörer har egna avtal på samma avtalsområde. Båda löper ut 2027-06-30.",
        en: "SRAT and Sveriges Ingenjörer hold their own agreements in the same agreement area. Both expire on 2027-06-30.",
      },
      previousMediations: {
        sv: "2023 – Spårtrafik, särskild medling, avslutad med avtal efter 19 dagar. Samma parter, medlare Gunilla Runnquist som ettan.",
        en: "2023 – Rail traffic, special mediation, closed with an agreement after 19 days. Same parties, Gunilla Runnquist as lead mediator.",
      },
      contagionRisk: {
        sv: "Fyra närliggande avtal inom Transportföretagen löper ut i maj 2027. Två av dem har samma arbetstagarorganisation.",
        en: "Four adjacent agreements within Transportföretagen expire in May 2027. Two of them have the same employee organisation.",
      },
    },
    documents: {
      sv: "GD-beslut_12-2027.pdf · Medlarrapport (väntas)",
      en: "GD-beslut_12-2027.pdf · Mediator report (pending)",
    },
  },
  {
    id: "M-2027-09",
    name: "Hemserviceföretag – Almega / Kommunal",
    type: "special",
    registryNumber: "2027/44",
    dgDecision: {
      number: "GD-beslut nr 9/2027",
      date: "2027-04-14",
      document: "GD-beslut_9-2027.pdf",
    },
    agreementIds: ["A-009"],
    mediators: [
      { id: "ME-03", name: "Anders Lindström", position: "first-chair", previousAssignments: 21 },
    ],
    coveredByProcedureAgreement: false,
    status: { sv: "Avslutad – avtal tecknat", en: "Closed – agreement signed" },
    ongoing: false,
    outcome: {
      mediationType: "special",
      industrialAction: false,
    },
    decisionSupport: {
      otherParties: {
        sv: "Fastighetsanställdas Förbund har ett eget avtal med samma arbetsgivarorganisation.",
        en: "Fastighetsanställdas Förbund holds its own agreement with the same employer organisation.",
      },
      previousMediations: {
        sv: "2021 – Hemserviceföretag, särskild medling, avslutad med avtal. Medlare Anders Lindström som ettan.",
        en: "2021 – Home services, special mediation, closed with an agreement. Anders Lindström as lead mediator.",
      },
      contagionRisk: {
        sv: "Ingen spridningsrisk identifierad. Närliggande avtal löper till 2028.",
        en: "No contagion risk identified. Adjacent agreements run until 2028.",
      },
    },
    documents: {
      sv: "GD-beslut_9-2027.pdf · Medlarrapport_2027-04-28.pdf",
      en: "GD-beslut_9-2027.pdf · Medlarrapport_2027-04-28.pdf",
    },
  },
  {
    id: "M-2027-04",
    name: "Bemanning – Kompetensföretagen / Unionen",
    type: "standing",
    registryNumber: "2027/18",
    dgDecision: {
      number: "GD-beslut nr 4/2027",
      date: "2027-02-28",
      document: "GD-beslut_4-2027.pdf",
    },
    agreementIds: ["A-010"],
    mediators: [],
    coveredByProcedureAgreement: true,
    status: { sv: "Avslutad", en: "Closed" },
    ongoing: false,
    decisionSupport: {
      otherParties: {
        sv: "Akademikerförbunden har ett eget avtal på avtalsområdet.",
        en: "Akademikerförbunden holds its own agreement in the agreement area.",
      },
      previousMediations: {
        sv: "Inga tidigare medlingar registrerade. Parterna medlar i egen regi enligt förhandlingsordningsavtal.",
        en: "No previous mediations registered. The parties mediate under their own procedure per a negotiation procedure agreement.",
      },
      contagionRisk: {
        sv: "Låg. Tvisten är lokal och omfattar ett enskilt bemanningsföretag.",
        en: "Low. The dispute is local and concerns a single staffing company.",
      },
    },
    documents: { sv: "GD-beslut_4-2027.pdf", en: "GD-beslut_4-2027.pdf" },
  },
];

export const MEDIATORS: Mediator[] = [
  {
    id: "ME-01",
    name: "Gunilla Runnquist",
    email: "gunilla.runnquist@example.se",
    phone: "070-123 45 67",
    types: ["special"],
    active: true,
    history: [
      { year: 2027, agreementArea: "Spårtrafik", position: "first-chair" },
      { year: 2025, agreementArea: "Handel", position: "first-chair" },
      { year: 2023, agreementArea: "Spårtrafik", position: "second-chair" },
    ],
  },
  {
    id: "ME-02",
    name: "Bengt Huldt",
    email: "bengt.huldt@example.se",
    phone: "070-234 56 78",
    types: ["special", "standing"],
    active: true,
    history: [
      { year: 2027, agreementArea: "Spårtrafik", position: "second-chair" },
      { year: 2025, agreementArea: "Byggverksamhet", position: "second-chair" },
    ],
  },
  {
    id: "ME-03",
    name: "Anders Lindström",
    email: "anders.lindstrom@example.se",
    phone: "070-345 67 89",
    types: ["special"],
    active: true,
    history: [
      { year: 2027, agreementArea: "Hemserviceföretag", position: "first-chair" },
      { year: 2026, agreementArea: "Vård och omsorg", position: "first-chair" },
    ],
  },
];
