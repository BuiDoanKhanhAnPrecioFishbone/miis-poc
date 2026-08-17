/**
 * Parties and cooperation bodies — Epic F3, Appendix 1 §4.2.
 *
 * Identifiers are English; user-facing strings exist in both languages.
 * Pure domain — no imports beyond sibling types, no I/O.
 */

import type { Sector } from "./agreement";
import type { Lang } from "./lang";

export type PartyType = "employer" | "employee";

export const PARTY_TYPE_LABEL: Record<Lang, Record<PartyType, string>> = {
  sv: {
    employer: "Arbetsgivarorganisation",
    employee: "Arbetstagarorganisation",
  },
  en: {
    employer: "Employer organisation",
    employee: "Employee organisation",
  },
};

/** Swedish abbreviations used throughout the requirement spec. */
export const PARTY_TYPE_ABBREVIATION: Record<PartyType, string> = {
  employer: "AGO",
  employee: "ATO",
};

/**
 * FP-004 – a name change is registered in one place and propagates to all
 * current agreements, but never to historical ones. Hence the validity date on
 * every historical name.
 */
export interface NameHistoryEntry {
  name: string;
  validFrom: string;
  validTo?: string;
  note?: string;
}

export interface ContactPerson {
  name: string;
  title: string;
  phone: string;
  email: string;
}

export interface Party {
  id: string;
  type: PartyType;
  name: string;
  /** Employer organisations are linked to sector and employer group (FP-001). */
  sector?: Sector;
  employerGroup?: string;
  /** Employer orgs within Svenskt Näringsliv carry an industry code (FP-001). */
  industryCode?: string;
  nameHistory: NameHistoryEntry[];
  contacts: ContactPerson[];
  active: boolean;
}

export type CooperationBodyType = "umbrella" | "cooperation";

export const COOPERATION_BODY_TYPE_LABEL: Record<Lang, Record<CooperationBodyType, string>> = {
  sv: {
    umbrella: "Huvudorganisation",
    cooperation: "Samverkan",
  },
  en: {
    umbrella: "Umbrella organisation",
    cooperation: "Cooperation body",
  },
};

/** FP-003 – cooperation body between unions, with time period. */
export interface CooperationBody {
  id: string;
  name: string;
  type: CooperationBodyType;
  negotiatingBody: boolean;
  members: string[];
  validFrom: string;
  validTo?: string;
}

/** The party's name as it was on a given date (FP-004). */
export function nameAtDate(party: Party, date: string): string {
  const entry = party.nameHistory.find(
    (n) => n.validFrom <= date && (!n.validTo || n.validTo >= date),
  );
  return entry?.name ?? party.name;
}
