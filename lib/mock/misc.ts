/**
 * Mock benchmark, events and reminders.
 * Week 2: becomes supabase/seed.sql. Nothing outside lib/data/ imports it.
 */

import type { Benchmark } from "@/lib/domain/benchmark";
import type { AuditEvent, Reminder } from "@/lib/domain/event";

export const BENCHMARKS: Benchmark[] = [
  {
    id: "MK-2027",
    period: "2027–2029",
    validFrom: "2027-04-01",
    validTo: "2029-03-31",
    costFramePercent: 6.4,
    periodisation: "3,2 % / 3,2 %",
    supplementaryAgreements: ["deltidspension 0,2 %"],
    registeredDate: "2027-03-18",
    months: 24,
  },
];

export const REMINDERS: Reminder[] = [
  { id: "PM-1", date: "2026-08-20", text: "Uppdatera Fastigheter – Almega/Unionen", agreementId: "A-003" },
  { id: "PM-2", date: "2026-08-28", text: "Komplettera lönerevision Apotek", agreementId: "A-004" },
  { id: "PM-3", date: "2026-09-05", text: "Kontrollera prolongering Spel", agreementId: "A-007" },
];

export const EVENTS: AuditEvent[] = [
  {
    id: "H-1",
    timestamp: "2027-05-12 14:02",
    type: "agreement-signed",
    text: "Avtal tecknat – Spårtrafik (efter medling M-2027/12)",
    agreementId: "A-002",
    color: "red",
  },
  {
    id: "H-2",
    timestamp: "2027-05-03 09:15",
    type: "mediation-started",
    text: "Medling startar – Spårtrafik, GD-beslut nr 12/2027",
    agreementId: "A-002",
    color: "red",
  },
];

/** Events shown on the mediation case view, per affected agreement (FH-002). */
export const MEDIATION_EVENTS: AuditEvent[] = [
  {
    id: "MH-1",
    timestamp: "2027-05-03 09:15",
    type: "mediation-started",
    text: "Medling startar – Spårtrafik, Tågföretagen / Seko",
    agreementId: "A-002",
    color: "red",
  },
  {
    id: "MH-2",
    timestamp: "2027-05-03 09:15",
    type: "mediation-started",
    text: "Medling startar – Spårtrafik, Tågföretagen / ST",
    agreementId: "A-008",
    color: "red",
  },
  {
    id: "MH-3",
    timestamp: "2027-04-14 11:20",
    type: "mediation-started",
    text: "Medling startar – Hemserviceföretag, Almega / Kommunal",
    agreementId: "A-009",
    color: "red",
  },
  {
    id: "MH-4",
    timestamp: "2027-02-28 08:45",
    type: "mediation-started",
    text: "Medling startar – Bemanning, Kompetensföretagen / Unionen",
    agreementId: "A-010",
    color: "red",
  },
];
