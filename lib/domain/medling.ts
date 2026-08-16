/**
 * Mediation, mediators and negotiations — Epic F9, Appendix 1 §4.2.
 * Pure domain — no imports, no I/O.
 */

export type Medlingstyp = "sarskild" | "fast";

export const MEDLINGSTYP_ETIKETT: Record<Medlingstyp, string> = {
  sarskild: "Särskild medling",
  fast: "Fast medling (lokal tvist)",
};

export type Medlarposition = "etta" | "tvaa";

export const MEDLARPOSITION_ETIKETT: Record<Medlarposition, string> = {
  etta: "Ettan",
  tvaa: "Tvåan",
};

export interface MedlareRef {
  id: string;
  namn: string;
  position: Medlarposition;
  tidigareUppdrag: number;
}

/** FF-009 – mediator register with history and statistics. */
export interface Medlare {
  id: string;
  namn: string;
  epost: string;
  telefon: string;
  typer: Medlingstyp[];
  aktiv: boolean;
  historik: { ar: number; avtalsomrade: string; position: Medlarposition }[];
}

/** FF-010 – the mediation outcome fields, all five named by the requirement. */
export interface Medlingsresultat {
  typAvMedling: Medlingstyp;
  stridsatgarder: boolean;
  typAvStridsatgard?: string;
  forloradeArbetsdagar?: number;
  antalBerordaAnstallda?: number;
}

export interface Medlingsarende {
  id: string;
  namn: string;
  typ: Medlingstyp;
  /** FF-007 – registry number from MI's registry system. */
  diarienummer?: string;
  gdBeslut: { nummer: string; datum: string; dokument: string };
  /** FF-008 – a case can be linked to several agreements. */
  avtalIds: string[];
  medlare: MedlareRef[];
  /** FF-006 / FA-017 – decides whether MI appoints mediators at all. */
  omfattasAvForhandlingsordningsavtal: boolean;
  status: string;
  resultat?: Medlingsresultat;
}

export type Forhandlingstyp = "avtalsrorelse" | "ovrig";

export const FORHANDLINGSTYP_ETIKETT: Record<Forhandlingstyp, string> = {
  avtalsrorelse: "Avtalsrörelse",
  ovrig: "Övrig förhandling",
};

/** FF-001–003 */
export interface Forhandling {
  id: string;
  typ: Forhandlingstyp;
  /** Either linked to an agreement, or standalone with direct links to parties. */
  avtalId?: string;
  parter: string[];
  status: "pagaende" | "avslutad-med-avtal" | "avslutad-utan-avtal";
  avslutadDatum?: string;
}

/**
 * FF-006 – whether MI appoints mediators. Where the parties have a negotiation
 * procedure agreement they mediate under their own procedure and MI appoints
 * nobody (§4.2). Currently nine such agreements exist.
 */
export function tillsatterMiMedlare(arende: Pick<Medlingsarende, "omfattasAvForhandlingsordningsavtal">): boolean {
  return !arende.omfattasAvForhandlingsordningsavtal;
}

/** Route-safe id "M-2027-12" shown to users as "M-2027/12". */
export function arendenummer(id: string): string {
  return id.replace(/-(\d+)$/, "/$1");
}
