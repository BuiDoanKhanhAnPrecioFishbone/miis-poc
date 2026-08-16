/**
 * Event log, change log and reminders — Epic F5, plus FA-022.
 * Pure domain — no imports, no I/O.
 */

import type { StatusFarg } from "./status";

/** FH-002 – high-level events linked to an agreement. */
export interface Handelse {
  id: string;
  tidpunkt: string;
  typ: "avtal-tecknat" | "medling-startar" | "medling-avslutad" | "avtal-uppsagt" | "epost-skickat";
  text: string;
  avtalId?: string;
  farg?: StatusFarg;
}

/** FH-001 – what was changed, by whom, when, with old and new value. */
export interface Andring {
  id: string;
  tidpunkt: string;
  anvandare: string;
  entitet: string;
  entitetId: string;
  falt: string;
  gammaltVarde: string | null;
  nyttVarde: string | null;
}

/** FA-022 – reminder to update an agreement on a given date. */
export interface Paminnelse {
  id: string;
  datum: string;
  text: string;
  avtalId?: string;
}

/** FD-001 – documents linked to agreements, decisions, reports and meetings. */
export interface Dokument {
  id: string;
  filnamn: string;
  typ: "protokoll" | "avtal" | "gd-beslut" | "medlarrapport" | "partstraff" | "ovrigt";
  uppladdadDatum: string;
  kopplatTill: string;
  konfidentiell: boolean;
}

/** FAI-004 – the predefined and customisable watchword table. */
export interface Bevakningsord {
  id: string;
  ord: string;
  kategori: string;
  aktivt: boolean;
}

export const HANDELSETYP_ETIKETT: Record<Handelse["typ"], string> = {
  "avtal-tecknat": "Avtal tecknat",
  "medling-startar": "Medling startar",
  "medling-avslutad": "Medling avslutad",
  "avtal-uppsagt": "Avtal uppsagt",
  "epost-skickat": "E-post skickat",
};
