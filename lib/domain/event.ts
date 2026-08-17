/**
 * Event log, change log, reminders and documents — Epic F5, plus FA-022, FD-001.
 *
 * Identifiers are English; user-facing strings exist in both languages.
 * Pure domain — no imports beyond sibling types, no I/O.
 */

import { DEFAULT_LANG, type Lang, type Text } from "./lang";
import type { StatusColor } from "./status";

export type EventType =
  | "agreement-signed"
  | "mediation-started"
  | "mediation-closed"
  | "agreement-terminated"
  | "email-sent";

export const EVENT_TYPE_LABEL: Record<Lang, Record<EventType, string>> = {
  sv: {
    "agreement-signed": "Avtal tecknat",
    "mediation-started": "Medling startar",
    "mediation-closed": "Medling avslutad",
    "agreement-terminated": "Avtal uppsagt",
    "email-sent": "E-post skickat",
  },
  en: {
    "agreement-signed": "Agreement signed",
    "mediation-started": "Mediation started",
    "mediation-closed": "Mediation closed",
    "agreement-terminated": "Agreement terminated",
    "email-sent": "E-mail sent",
  },
};

/**
 * FH-002 – high-level events linked to an agreement.
 *
 * The line shown in the log is derived, not stored: the event type carries the
 * verb and translates, while `detail` is the proper nouns it happened to — an
 * agreement area, a party pair, a case number — which are names and do not.
 */
export interface AuditEvent {
  id: string;
  /** ISO timestamp string, e.g. "2027-05-12 14:02". Same in both languages. */
  timestamp: string;
  type: EventType;
  /** Proper nouns the event concerns, e.g. "Spårtrafik, Tågföretagen / Seko". */
  detail: string;
  agreementId?: string;
  color?: StatusColor;
}

/** "Medling startar – Spårtrafik, Tågföretagen / Seko" */
export function eventText(e: AuditEvent, lang: Lang = DEFAULT_LANG): string {
  return `${EVENT_TYPE_LABEL[lang][e.type]} – ${e.detail}`;
}

/** FH-001 – what was changed, by whom, when, with old and new value. */
export interface ChangeLogEntry {
  id: string;
  timestamp: string;
  user: string;
  entity: string;
  entityId: string;
  field: string;
  oldValue: string | null;
  newValue: string | null;
}

/** FA-022 – reminder to update an agreement on a given date. */
export interface Reminder {
  id: string;
  date: string;
  text: Text;
  agreementId?: string;
}

/** FD-001 – documents linked to agreements, decisions, reports and meetings. */
export type DocumentType =
  | "protocol"
  | "agreement"
  | "dg-decision"
  | "mediator-report"
  | "party-meeting"
  | "other";

export interface StoredDocument {
  id: string;
  fileName: string;
  type: DocumentType;
  uploadedDate: string;
  /** What the document is attached to, as a display string. Names, so not translated. */
  linkedTo: string;
  /**
   * D-001 — a document is confidential because its agreement is. Kept as its own
   * field so a document can be found without loading the agreement, and derived
   * from the agreement in lib/data/ so the two can never disagree.
   */
  confidential: boolean;
  agreementId?: string;
}

/**
 * FAI-004 – the predefined and customisable watchword table.
 *
 * The terms stay Swedish in both languages: they are matched against Swedish
 * protocol text, so translating them would describe a system that cannot work.
 */
export interface Watchword {
  id: string;
  term: string;
  category: Text;
  active: boolean;
}
