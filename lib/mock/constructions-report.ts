/**
 * MI's own *Avtalskonstruktioner 2025* report — Bilaga F, Rapport 2, of
 * `Bilaga_1_Kravspecifikation.pdf`, pages 40–43.
 *
 * **These figures are transcribed, not derived, and that is deliberate.** The
 * report counts employees across the whole Swedish labour market — 3 797 764 of
 * them — so it could never come out of eight sample agreements. Deriving it from
 * `lib/mock/agreements.ts` would have produced a table with MI's column headings
 * and numbers that were ours, which is the one thing a report about data
 * accuracy must not do. The "table rows are derived from the records" rule in
 * CLAUDE.md governs records; a published population report is not a record.
 *
 * MI's two column groups are *Samtliga avtal* — every agreement in the register
 * — and *Urvalets avtal*, the agreements matching the selection criteria printed
 * at the top of the report. The selection in MI's own printout is
 * `Arbetsgivarorg: Almega Tjänsteförbunden`, everything else `Alla`.
 *
 * Each construction is split into Arbetare and Tjänstemän, and each of those
 * into Privat, Offentlig and Alla sektorer, as a count and as a percent of that
 * sector's total. Percentages are MI's own and are not recomputed — they do not
 * always sum to 100 across constructions, because MI rounds each independently.
 */

import type { AgreementConstruction } from "@/lib/domain/agreement";

/** A count and MI's own percentage for one sector. */
export interface SectorFigure {
  count: number;
  percent: number;
}

export interface ConstructionRow {
  construction: AgreementConstruction | "total";
  /** The construction as a whole, then its two employee groups. */
  all: Record<"privat" | "offentlig" | "alla", SectorFigure>;
  arbetare: Record<"privat" | "offentlig" | "alla", SectorFigure>;
  tjansteman: Record<"privat" | "offentlig" | "alla", SectorFigure>;
}

const f = (count: number, percent: number): SectorFigure => ({ count, percent });

/** Samtliga avtal — every agreement in the register. Bilaga F, page 41. */
export const SAMTLIGA_AVTAL: ConstructionRow[] = [
  {
    construction: 1,
    all: { privat: f(230053, 9.9), offentlig: f(229600, 15.7), alla: f(459653, 12.1) },
    arbetare: { privat: f(0, 0), offentlig: f(18600, 3.4), alla: f(18600, 0.9) },
    tjansteman: { privat: f(230053, 26.4), offentlig: f(211000, 23.2), alla: f(441053, 24.8) },
  },
  {
    construction: 2,
    all: { privat: f(285859, 12.2), offentlig: f(142000, 9.7), alla: f(427859, 11.3) },
    arbetare: { privat: f(61850, 4.2), offentlig: f(11000, 2.0), alla: f(72850, 3.6) },
    tjansteman: { privat: f(224009, 25.7), offentlig: f(131000, 14.4), alla: f(355009, 19.9) },
  },
  {
    construction: 3,
    all: { privat: f(146050, 6.3), offentlig: f(0, 0), alla: f(146050, 3.8) },
    arbetare: { privat: f(40950, 2.8), offentlig: f(0, 0), alla: f(40950, 2.0) },
    tjansteman: { privat: f(105100, 12.1), offentlig: f(0, 0), alla: f(105100, 5.9) },
  },
  {
    construction: 4,
    all: { privat: f(326547, 14.0), offentlig: f(566500, 38.7), alla: f(893047, 23.5) },
    arbetare: { privat: f(162505, 11.1), offentlig: f(6500, 1.2), alla: f(169005, 8.4) },
    tjansteman: { privat: f(164042, 18.8), offentlig: f(560000, 61.6), alla: f(724042, 40.7) },
  },
  {
    construction: 5,
    all: { privat: f(371070, 15.9), offentlig: f(516000, 35.3), alla: f(887070, 23.4) },
    arbetare: { privat: f(230220, 15.7), offentlig: f(516000, 93.3), alla: f(746220, 37.0) },
    tjansteman: { privat: f(140850, 16.2), offentlig: f(0, 0), alla: f(140850, 7.9) },
  },
  {
    construction: 6,
    all: { privat: f(623665, 26.7), offentlig: f(0, 0), alla: f(623665, 16.4) },
    arbetare: { privat: f(622165, 42.5), offentlig: f(0, 0), alla: f(622165, 30.8) },
    tjansteman: { privat: f(1500, 0.2), offentlig: f(0, 0), alla: f(1500, 0.1) },
  },
  {
    construction: 7,
    all: { privat: f(352120, 15.1), offentlig: f(8300, 0.6), alla: f(360420, 9.5) },
    arbetare: { privat: f(347015, 23.7), offentlig: f(1000, 0.2), alla: f(348015, 17.2) },
    tjansteman: { privat: f(5105, 0.6), offentlig: f(7300, 0.8), alla: f(12405, 0.7) },
  },
  {
    construction: "total",
    all: { privat: f(2335364, 100), offentlig: f(1462400, 100), alla: f(3797764, 100) },
    arbetare: { privat: f(1464705, 100), offentlig: f(553100, 100), alla: f(2017805, 100) },
    tjansteman: { privat: f(870659, 100), offentlig: f(909300, 100), alla: f(1779959, 100) },
  },
];

/** Urvalets avtal — the selection above. Bilaga F, page 41, right-hand group. */
export const URVALETS_AVTAL: ConstructionRow[] = [
  {
    construction: 1,
    all: { privat: f(6010, 5.3), offentlig: f(0, 0), alla: f(6010, 5.3) },
    arbetare: { privat: f(0, 0), offentlig: f(0, 0), alla: f(0, 0) },
    tjansteman: { privat: f(6010, 13.4), offentlig: f(0, 0), alla: f(6010, 13.4) },
  },
  {
    construction: 2,
    all: { privat: f(48750, 43.1), offentlig: f(0, 0), alla: f(48750, 43.1) },
    arbetare: { privat: f(16750, 24.6), offentlig: f(0, 0), alla: f(16750, 24.6) },
    tjansteman: { privat: f(32000, 71.2), offentlig: f(0, 0), alla: f(32000, 71.2) },
  },
  {
    construction: 3,
    all: { privat: f(0, 0), offentlig: f(0, 0), alla: f(0, 0) },
    arbetare: { privat: f(0, 0), offentlig: f(0, 0), alla: f(0, 0) },
    tjansteman: { privat: f(0, 0), offentlig: f(0, 0), alla: f(0, 0) },
  },
  {
    construction: 4,
    all: { privat: f(14000, 12.4), offentlig: f(0, 0), alla: f(14000, 12.4) },
    arbetare: { privat: f(7050, 10.4), offentlig: f(0, 0), alla: f(7050, 10.4) },
    tjansteman: { privat: f(6950, 15.5), offentlig: f(0, 0), alla: f(6950, 15.5) },
  },
  {
    construction: 5,
    all: { privat: f(1000, 0.9), offentlig: f(0, 0), alla: f(1000, 0.9) },
    arbetare: { privat: f(1000, 1.5), offentlig: f(0, 0), alla: f(1000, 1.5) },
    tjansteman: { privat: f(0, 0), offentlig: f(0, 0), alla: f(0, 0) },
  },
  {
    construction: 6,
    all: { privat: f(40900, 36.2), offentlig: f(0, 0), alla: f(40900, 36.2) },
    arbetare: { privat: f(40900, 60.1), offentlig: f(0, 0), alla: f(40900, 60.1) },
    tjansteman: { privat: f(0, 0), offentlig: f(0, 0), alla: f(0, 0) },
  },
  {
    construction: 7,
    all: { privat: f(2340, 2.1), offentlig: f(0, 0), alla: f(2340, 2.1) },
    arbetare: { privat: f(2340, 3.4), offentlig: f(0, 0), alla: f(2340, 3.4) },
    tjansteman: { privat: f(0, 0), offentlig: f(0, 0), alla: f(0, 0) },
  },
  {
    construction: "total",
    all: { privat: f(113000, 100), offentlig: f(0, 0), alla: f(113000, 100) },
    arbetare: { privat: f(68040, 100), offentlig: f(0, 0), alla: f(68040, 100) },
    tjansteman: { privat: f(44960, 100), offentlig: f(0, 0), alla: f(44960, 100) },
  },
];

/**
 * The bands MI's two figures group the constructions into, with the agreement
 * and employee counts printed beside each. Bilaga F, page 40.
 */
export interface ConstructionBand {
  constructions: AgreementConstruction[];
  samtliga: { agreements: number; agreementPercent: number; employees: number; employeePercent: number };
  urvalet: { agreements: number; agreementPercent: number; employees: number; employeePercent: number };
}

export const CONSTRUCTION_BANDS: ConstructionBand[] = [
  {
    constructions: [1, 2, 3],
    samtliga: { agreements: 233, agreementPercent: 38.6, employees: 1033562, employeePercent: 27.2 },
    urvalet: { agreements: 22, agreementPercent: 57.9, employees: 54760, employeePercent: 48.5 },
  },
];

/** The selection MI's own printout was taken with. */
export const REPORT_SELECTION = {
  employerOrg: "Almega Tjänsteförbunden",
  employeeOrg: "Alla",
  sector: "Alla",
  centralOrg: "Alla",
  cooperationGroup: "Alla",
  employerGroup: "Alla",
  industryCode: "Alla",
  printedAt: "2026-04-27, kl 09:30",
  year: 2025,
} as const;
