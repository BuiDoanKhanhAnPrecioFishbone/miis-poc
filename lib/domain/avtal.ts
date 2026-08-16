/**
 * Agreements and their parts — Appendix 1 §4.2 and §4.5, Epic F2.
 * Pure domain — no imports, no I/O.
 */

import type { AvtalStatusKod } from "./status";

export type Registreringsstatus = "ofullstandig" | "klar";

/** The seven MI-defined agreement constructions (FA-007, §4.2). */
export type Avtalskonstruktion = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const AVTALSKONSTRUKTIONER: Record<Avtalskonstruktion, string> = {
  1: "Lokal lönebildning – sifferlösa avtal",
  2: "Lokal lönebildning med stupstock om utrymmets storlek",
  3: "Lönepott utan individgaranti",
  4: "Lönepott med individgaranti",
  5: "Generell höjning",
  6: "Generell höjning och lönepott",
  7: "Individuell förhandling",
};

export type Sektor = "privat" | "stat" | "kommun-region";

/** Report selections that govern report inclusion (§4.2). */
export interface Rapporturval {
  eurofound: boolean;
  minimilon: boolean;
  webbplatsen: boolean;
  konjunkturlonerapporten: boolean;
}

export interface PartRef {
  id: string;
  namn: string;
  /** Short form for dense lists, e.g. "Almega" for Almega Tjänsteförbunden. */
  kortnamn?: string;
}

export interface Avtal {
  id: string;
  avtalsomrade: string;
  namn: string;
  alternativtNamn?: string;
  /** MI registers one agreement per party (§4.2). */
  ago: PartRef;
  ato: PartRef;
  avtalstyp: string;
  registreringsstatus: Registreringsstatus;
  /** D-001 – confidentiality marking, set by the agreement administrator. */
  konfidentiell: boolean;
  rapporturval: Rapporturval;
  /** Set when the agreement is linked to a mediation case (FR-012). */
  medlingskoppling?: boolean;
  teckningsdatum?: string;
  loptidFrom?: string;
  loptidTom?: string;
  /** FA-015 / FA-016 */
  upphorUtanFornyelse?: boolean;
  tidigUppsagning?: { datum: string; part: string };
}

/** One new row per bargaining round (FA-002). */
export interface Loneavtal {
  id: string;
  avtalId: string;
  konstruktion: Avtalskonstruktion;
  loneutrymmeProcent?: number;
  kostnadsramProcent?: number;
  individgaranti: boolean;
  arbetstidsforkortning?: { kostnadProcent: number };
  jamstalldhetsflagga: boolean;
  /** FA-012 – part of the norm-setting industry agreements. */
  industrimarke: boolean;
  teckningsdatum?: string;
  giltigFrom: string;
  giltigTom: string;
  lonerevision?: { datum: string; procent: number };
  lagstaloner?: Lagstalon[];
}

/** FA-013 – minimum wages grouped by occupational group. */
export interface Lagstalon {
  yrkesgrupp: string;
  beloppKrPerManad: number;
  revisionsdatum: string;
}

/** FA-003, FA-004 – its own validity period, need not match the wage agreement. */
export interface AllmannaVillkor {
  avtalId: string;
  teckningsdatum?: string;
  giltigFrom: string;
  giltigTom: string;
}

/** The list-row shape used by tables across the app. */
export interface AvtalRad {
  id: string;
  namn: string;
  parter: string;
  teckningsdatum?: string;
  loptid: string;
  registreringsstatus: Registreringsstatus;
  status: AvtalStatusKod;
  medlingskoppling?: boolean;
}

export function registreringsstatusEtikett(s: Registreringsstatus): string {
  return s === "klar" ? "Klar" : "Ofullständig";
}

export function parterEtikett(avtal: Pick<Avtal, "ago" | "ato">): string {
  return `${avtal.ago.namn} / ${avtal.ato.namn}`;
}

/** Compact party pair for dense lists: "Almega/Seko". */
export function parterKort(avtal: Pick<Avtal, "ago" | "ato">): string {
  const ago = avtal.ago.kortnamn ?? avtal.ago.namn;
  const ato = avtal.ato.kortnamn ?? avtal.ato.namn;
  return `${ago}/${ato}`;
}
