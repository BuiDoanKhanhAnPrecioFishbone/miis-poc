/**
 * Mock mediation cases and mediators.
 * Week 2: becomes supabase/seed.sql. Nothing outside lib/data/ imports it.
 */

import type { Medlare, Medlingsarende } from "@/lib/domain/medling";

export const MEDLINGSARENDEN: Medlingsarende[] = [
  {
    id: "M-2027-12",
    namn: "Spårtrafik – Tågföretagen / Seko",
    typ: "sarskild",
    diarienummer: "2027/59",
    gdBeslut: {
      nummer: "GD-beslut nr 12/2027",
      datum: "2027-05-03",
      dokument: "GD-beslut_12-2027.pdf",
    },
    avtalIds: ["A-002", "A-008"],
    medlare: [
      { id: "ME-01", namn: "Gunilla Runnquist", position: "etta", tidigareUppdrag: 14 },
      { id: "ME-02", namn: "Bengt Huldt", position: "tvaa", tidigareUppdrag: 9 },
    ],
    omfattasAvForhandlingsordningsavtal: false,
    status: "Pågående",
    resultat: {
      typAvMedling: "sarskild",
      stridsatgarder: true,
      typAvStridsatgard: "Strejk",
      forloradeArbetsdagar: 2400,
      antalBerordaAnstallda: 1150,
    },
  },
  {
    id: "M-2027-09",
    namn: "Hemserviceföretag – Almega / Kommunal",
    typ: "sarskild",
    diarienummer: "2027/44",
    gdBeslut: {
      nummer: "GD-beslut nr 9/2027",
      datum: "2027-04-14",
      dokument: "GD-beslut_9-2027.pdf",
    },
    avtalIds: ["A-009"],
    medlare: [{ id: "ME-03", namn: "Anders Lindström", position: "etta", tidigareUppdrag: 21 }],
    omfattasAvForhandlingsordningsavtal: false,
    status: "Avslutad – avtal tecknat",
  },
  {
    id: "M-2027-04",
    namn: "Bemanning – Kompetensföretagen / Unionen",
    typ: "fast",
    diarienummer: "2027/18",
    gdBeslut: {
      nummer: "GD-beslut nr 4/2027",
      datum: "2027-02-28",
      dokument: "GD-beslut_4-2027.pdf",
    },
    avtalIds: ["A-010"],
    medlare: [],
    omfattasAvForhandlingsordningsavtal: true,
    status: "Avslutad",
  },
];

export const MEDLARE: Medlare[] = [
  {
    id: "ME-01",
    namn: "Gunilla Runnquist",
    epost: "gunilla.runnquist@example.se",
    telefon: "070-123 45 67",
    typer: ["sarskild"],
    aktiv: true,
    historik: [
      { ar: 2027, avtalsomrade: "Spårtrafik", position: "etta" },
      { ar: 2025, avtalsomrade: "Handel", position: "etta" },
      { ar: 2023, avtalsomrade: "Spårtrafik", position: "tvaa" },
    ],
  },
  {
    id: "ME-02",
    namn: "Bengt Huldt",
    epost: "bengt.huldt@example.se",
    telefon: "070-234 56 78",
    typer: ["sarskild", "fast"],
    aktiv: true,
    historik: [
      { ar: 2027, avtalsomrade: "Spårtrafik", position: "tvaa" },
      { ar: 2025, avtalsomrade: "Byggverksamhet", position: "tvaa" },
    ],
  },
  {
    id: "ME-03",
    namn: "Anders Lindström",
    epost: "anders.lindstrom@example.se",
    telefon: "070-345 67 89",
    typer: ["sarskild"],
    aktiv: true,
    historik: [
      { ar: 2027, avtalsomrade: "Hemserviceföretag", position: "etta" },
      { ar: 2026, avtalsomrade: "Vård och omsorg", position: "etta" },
    ],
  },
];

/** Detail shown on the mediation case view, US-07. */
export const MEDLINGSDETALJ: Record<
  string,
  {
    kopplade: { namn: string; text: string }[];
    beslutsstod: { ovrigaParter: string; tidigareMedlingar: string };
    dokument: string;
  }
> = {
  "M-2027-12": {
    kopplade: [
      { namn: "Spårtrafik – Tågföretagen / Seko", text: "Kvarstående, utlöpt 2027-04-30" },
      { namn: "Spårtrafik – Tågföretagen / ST", text: "Kvarstående, utlöpt 2027-04-30" },
    ],
    beslutsstod: {
      ovrigaParter: "SRAT, Sveriges Ingenjörer",
      tidigareMedlingar:
        "2023 (Spårtrafik) · Spridningsrisk: närliggande avtal inom Transportföretagen utlöper i maj",
    },
    dokument: "GD-beslut_12-2027.pdf · Medlarrapport (väntas)",
  },
};
