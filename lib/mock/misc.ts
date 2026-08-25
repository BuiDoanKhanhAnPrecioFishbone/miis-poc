/**
 * Mock benchmark, events and reminders.
 * Week 2: becomes supabase/seed.sql. Nothing outside lib/data/ imports it.
 */

import type { Benchmark } from "@/lib/domain/benchmark";
import type { AuditEvent, Reminder } from "@/lib/domain/event";

/*
  Three rounds, so `/market` shows a periodised setting with history rather than
  a single figure — FM-001 registers Märket *per period*, and a register with one
  row cannot demonstrate that. The two earlier rounds carry the real Swedish
  figures: 7,4 % over 24 months from the 2023 round and 6,4 % from 2025. The
  2027 round is ours, because it has not happened.
*/
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
  {
    id: "MK-2025",
    period: "2025–2027",
    validFrom: "2025-04-01",
    validTo: "2027-03-31",
    costFramePercent: 6.4,
    periodisation: "3,4 % / 3,0 %",
    supplementaryAgreements: ["deltidspension 0,2 %"],
    registeredDate: "2025-03-31",
    months: 24,
  },
  {
    id: "MK-2023",
    period: "2023–2025",
    validFrom: "2023-04-01",
    validTo: "2025-03-31",
    costFramePercent: 7.4,
    periodisation: "4,1 % / 3,3 %",
    supplementaryAgreements: ["deltidspension 0,2 %"],
    registeredDate: "2023-03-31",
    months: 24,
  },
];

export const REMINDERS: Reminder[] = [
  {
    id: "PM-1",
    date: "2026-08-20",
    text: {
      sv: "Uppdatera Fastigheter – Almega/Unionen",
      en: "Update Fastigheter – Almega/Unionen",
    },
    agreementId: "A-003",
  },
  {
    id: "PM-2",
    date: "2026-08-28",
    text: {
      sv: "Komplettera lönerevision Apotek",
      en: "Complete the wage revision for Apotek",
    },
    agreementId: "A-004",
  },
  {
    id: "PM-3",
    date: "2026-09-05",
    text: {
      sv: "Kontrollera prolongering Spel",
      en: "Check the prolongation for Spel",
    },
    agreementId: "A-007",
  },
];

export const EVENTS: AuditEvent[] = [
  /*
    Stål- och metallindustrin's own history — FH-002, on the agreement the
    guided walkthrough sends an evaluator to.

    It had none, so the panel read *"Inga händelser registrerade på avtalet
    ännu"* on the one record a reviewer is asked to look at: a section that is
    always empty demonstrates the requirement's absence rather than the
    requirement. FH-002 asks for *övergripande händelser kopplade till ett
    avtal*, and gives two examples — *avtal tecknat*, *medling startar*. These
    are the round this agreement actually went through: the old one was
    terminated ahead of the bargaining round, the new one was signed on the day
    the protocol carries, and MI released it two working days later.

    Note what is **not** here. "Anställda ändrade från 24 300 till 24 500" is a
    change to a field, and belongs in the ändringslogg (FH-001) with its old
    and new value. The two logs answer two different questions and neither can
    be derived from the other.
  */
  /*
    The four notifications the system says it sends, each evidenced once.

    The copy promises e-mail in four places — a publication, FE-001's
    klarmarkering to the mediator administrator, FA-022's reminder, and FE-003's
    scheduled extract with the report attached — and the log carried an example
    of exactly one of them. A claim demonstrated in prose and nowhere in the
    data is the same shape as a control that looks live: an evaluator who opens
    the händelselogg to check "skickad e-post loggas med tidpunkt, mottagare och
    bilaga" found one entry, and none with an attachment.

    The requirement ids are deliberately not in these strings. Sample data is
    product content, and rule 7 keeps requirement text off the product view —
    the first draft of these three carried (FE-001) and friends, and the copy
    sweep caught them on the next run.
  */
  {
    id: "H-13",
    timestamp: "2027-05-03 09:20",
    type: "email-sent",
    detail:
      "GD-beslut nr 12/2027 klarmarkerat – notifiering till medlaradministratör Eva Ek, med länk till ärendet",
  },
  {
    id: "H-14",
    timestamp: "2027-04-02 06:00",
    type: "email-sent",
    detail:
      "Påminnelse: Kommunikation – Almega/Seko behöver kompletteras – till Anna Andersson, med länk till avtalet",
    agreementId: "A-004",
  },
  {
    id: "H-15",
    timestamp: "2027-04-01 03:00",
    type: "email-sent",
    detail:
      "Schemalagt uttag: Konjunkturlönerapporten till Statistikenheten – rapporten bifogad som PDF",
  },
  {
    id: "H-11",
    timestamp: "2027-03-31 16:45",
    type: "agreement-signed",
    detail: "Stål- och metallindustrin, Industriarbetsgivarna / IF Metall – märkessättande",
    agreementId: "A-001",
    color: "green",
  },
  {
    id: "H-12",
    timestamp: "2027-01-15 08:30",
    type: "agreement-terminated",
    detail: "Stål- och metallindustrin 2025–2027 uppsagt inför avtalsrörelsen",
    agreementId: "A-001",
  },
  {
    id: "H-1",
    timestamp: "2027-05-12 14:02",
    type: "agreement-signed",
    detail: "Spårtrafik (efter medling M-2027/12)",
    agreementId: "A-002",
    color: "red",
  },
  {
    id: "H-2",
    timestamp: "2027-05-03 09:15",
    type: "mediation-started",
    detail: "Spårtrafik, GD-beslut nr 12/2027",
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
    detail: "Spårtrafik, Tågföretagen / Seko",
    agreementId: "A-002",
    color: "red",
  },
  {
    id: "MH-2",
    timestamp: "2027-05-03 09:15",
    type: "mediation-started",
    detail: "Spårtrafik, Tågföretagen / ST",
    agreementId: "A-008",
    color: "red",
  },
  {
    id: "MH-3",
    timestamp: "2027-04-14 11:20",
    type: "mediation-started",
    detail: "Hemserviceföretag, Almega / Kommunal",
    agreementId: "A-009",
    color: "red",
  },
  {
    id: "MH-4",
    timestamp: "2027-02-28 08:45",
    type: "mediation-started",
    detail: "Bemanning, Kompetensföretagen / Unionen",
    agreementId: "A-010",
    color: "red",
  },
];
