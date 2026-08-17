/**
 * The shape of one mock dataset. Every named demo mode fills this in.
 *
 * The mode names themselves live in lib/domain/dataset.ts, because the header
 * control needs them and UI may not import from lib/mock/.
 */

import type { Agreement } from "@/lib/domain/agreement";
import type { Benchmark } from "@/lib/domain/benchmark";
import type { AuditEvent, Reminder } from "@/lib/domain/event";
import type { MediationCase, Mediator } from "@/lib/domain/mediation";

export interface Dataset {
  agreements: Agreement[];
  mediationCases: MediationCase[];
  mediators: Mediator[];
  benchmarks: Benchmark[];
  reminders: Reminder[];
  events: AuditEvent[];
  mediationEvents: AuditEvent[];
  /** Total reminders, so "Visa alla (12)" can differ from the three shown. */
  totalReminders: number;
}
