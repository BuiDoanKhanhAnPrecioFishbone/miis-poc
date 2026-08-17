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
    status: "Pågående",
    ongoing: true,
    outcome: {
      mediationType: "special",
      industrialAction: true,
      industrialActionType: "Strejk",
      lostWorkingDays: 2400,
      affectedEmployees: 1150,
    },
    decisionSupport: {
      otherParties: "SRAT, Sveriges Ingenjörer",
      previousMediations:
        "2023 (Spårtrafik) · Spridningsrisk: närliggande avtal inom Transportföretagen utlöper i maj",
    },
    documents: "GD-beslut_12-2027.pdf · Medlarrapport (väntas)",
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
    status: "Avslutad – avtal tecknat",
    ongoing: false,
    outcome: {
      mediationType: "special",
      industrialAction: false,
    },
    decisionSupport: {
      otherParties: "Fastighetsanställdas Förbund",
      previousMediations: "2021 (Hemserviceföretag) · Ingen spridningsrisk identifierad",
    },
    documents: "GD-beslut_9-2027.pdf · Medlarrapport_2027-04-28.pdf",
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
    status: "Avslutad",
    ongoing: false,
    decisionSupport: {
      otherParties: "Akademikerförbunden",
      previousMediations: "Parterna medlar i egen regi enligt förhandlingsordningsavtal",
    },
    documents: "GD-beslut_4-2027.pdf",
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
