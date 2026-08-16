/**
 * Mock benchmark, events, reminders.
 * Week 2: becomes supabase/seed.sql. Nothing outside lib/data/ imports it.
 */

import type { Handelse, Paminnelse } from "@/lib/domain/handelse";
import type { Marke } from "@/lib/domain/marke";

export const MARKEN: Marke[] = [
  {
    id: "MK-2027",
    period: "2027–2029",
    giltigFrom: "2027-04-01",
    giltigTom: "2029-03-31",
    kostnadsramProcent: 6.4,
    periodisering: "3,2 % / 3,2 %",
    tillaggsoverenskommelser: ["deltidspension 0,2 %"],
    registreradDatum: "2027-03-18",
    antalManader: 24,
  },
];

export const PAMINNELSER: Paminnelse[] = [
  { id: "PM-1", datum: "2026-08-20", text: "Uppdatera Fastigheter – Almega/Unionen", avtalId: "A-003" },
  { id: "PM-2", datum: "2026-08-28", text: "Komplettera lönerevision Apotek", avtalId: "A-004" },
  { id: "PM-3", datum: "2026-09-05", text: "Kontrollera prolongering Svenska spel", avtalId: "A-007" },
];

export const ANTAL_PAMINNELSER = 12;

export const HANDELSER: Handelse[] = [
  {
    id: "H-1",
    tidpunkt: "2027-05-12 14:02",
    typ: "avtal-tecknat",
    text: "Avtal tecknat – Spårtrafik (efter medling M-2027/12)",
    avtalId: "A-002",
    farg: "red",
  },
  {
    id: "H-2",
    tidpunkt: "2027-05-03 09:15",
    typ: "medling-startar",
    text: "Medling startar – Spårtrafik, GD-beslut nr 12/2027",
    avtalId: "A-002",
    farg: "red",
  },
];

/** Events shown on the mediation case view, per affected agreement (FH-002). */
export const MEDLINGSHANDELSER: Handelse[] = [
  {
    id: "MH-1",
    tidpunkt: "2027-05-03 09:15",
    typ: "medling-startar",
    text: "Medling startar – Spårtrafik, Tågföretagen / Seko",
    avtalId: "A-002",
    farg: "red",
  },
  {
    id: "MH-2",
    tidpunkt: "2027-05-03 09:15",
    typ: "medling-startar",
    text: "Medling startar – Spårtrafik, Tågföretagen / ST",
    avtalId: "A-008",
    farg: "red",
  },
];
