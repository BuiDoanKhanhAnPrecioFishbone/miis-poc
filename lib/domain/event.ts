/**
 * Event log, change log, reminders and documents — Epic F5, plus FA-022, FD-001.
 *
 * Identifiers are English; every user-facing string is Swedish.
 * Pure domain — no imports beyond sibling types, no I/O.
 */

import type { StatusColor } from "./status";

export type EventType =
  | "agreement-signed"
  | "mediation-started"
  | "mediation-closed"
  | "agreement-terminated"
  | "email-sent";

export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  "agreement-signed": "Avtal tecknat",
  "mediation-started": "Medling startar",
  "mediation-closed": "Medling avslutad",
  "agreement-terminated": "Avtal uppsagt",
  "email-sent": "E-post skickat",
};

/** FH-002 – high-level events linked to an agreement. */
export interface AuditEvent {
  id: string;
  /** Swedish timestamp string, e.g. "2027-05-12 14:02". */
  timestamp: string;
  type: EventType;
  /** Swedish description shown in the log. */
  text: string;
  agreementId?: string;
  color?: StatusColor;
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
  /** Swedish reminder text. */
  text: string;
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
  linkedTo: string;
  confidential: boolean;
}

/** FAI-004 – the predefined and customisable watchword table. */
export interface Watchword {
  id: string;
  /** The Swedish term being watched for. */
  term: string;
  category: string;
  active: boolean;
}
