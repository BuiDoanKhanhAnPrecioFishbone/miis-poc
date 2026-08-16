/**
 * Parties and cooperation bodies — Epic F3, Appendix 1 §4.2.
 * Pure domain — no imports, no I/O.
 */

import type { Sektor } from "./avtal";

export type Parttyp = "AGO" | "ATO";

export const PARTTYP_ETIKETT: Record<Parttyp, string> = {
  AGO: "Arbetsgivarorganisation",
  ATO: "Arbetstagarorganisation",
};

/**
 * FP-004 – a name change is registered in one place and propagates to all
 * current agreements, but never to historical ones. Hence the validity date on
 * every historical name.
 */
export interface Namnhistorik {
  namn: string;
  giltigFrom: string;
  giltigTom?: string;
  anteckning?: string;
}

export interface Kontaktperson {
  namn: string;
  titel: string;
  telefon: string;
  epost: string;
}

export interface Part {
  id: string;
  typ: Parttyp;
  namn: string;
  /** AGOs are linked to sector and employer group (FP-001). */
  sektor?: Sektor;
  arbetsgivargrupp?: string;
  /** AGOs within Svenskt Näringsliv carry an industry code (FP-001). */
  branschkod?: string;
  namnhistorik: Namnhistorik[];
  kontaktpersoner: Kontaktperson[];
  aktiv: boolean;
}

export type Samverkanstyp = "huvudorganisation" | "samverkan";

export const SAMVERKANSTYP_ETIKETT: Record<Samverkanstyp, string> = {
  huvudorganisation: "Huvudorganisation",
  samverkan: "Samverkan",
};

/** FP-003 – cooperation body between unions, with time period. */
export interface Samverkansorgan {
  id: string;
  namn: string;
  typ: Samverkanstyp;
  forhandlandeOrgan: boolean;
  medlemmar: string[];
  giltigFrom: string;
  giltigTom?: string;
}

/** The party's name as it was on a given date (FP-004). */
export function namnVidTidpunkt(part: Part, datum: string): string {
  const trafF = part.namnhistorik.find(
    (n) => n.giltigFrom <= datum && (!n.giltigTom || n.giltigTom >= datum),
  );
  return trafF?.namn ?? part.namn;
}
