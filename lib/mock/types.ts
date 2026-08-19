/**
 * The shape of one mock dataset. Every named demo mode fills this in.
 *
 * The mode names themselves live in lib/domain/dataset.ts, because the header
 * control needs them and UI may not import from lib/mock/.
 */

import type { Agreement, WageAgreement } from "@/lib/domain/agreement";
import type { Benchmark } from "@/lib/domain/benchmark";
import type {
  AuditEvent,
  ChangeLogEntry,
  Reminder,
  StoredDocument,
} from "@/lib/domain/event";
import type { MediationCase, Mediator, Negotiation } from "@/lib/domain/mediation";

export interface Dataset {
  agreements: Agreement[];
  wageAgreements: WageAgreement[];
  documents: StoredDocument[];
  mediationCases: MediationCase[];
  negotiations: Negotiation[];
  mediators: Mediator[];
  benchmarks: Benchmark[];
  reminders: Reminder[];
  events: AuditEvent[];
  changeLog: ChangeLogEntry[];
  mediationEvents: AuditEvent[];
  /** Total reminders, so "Visa alla (12)" can differ from the three shown. */
  totalReminders: number;
}
