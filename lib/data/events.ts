/**
 * Data access for the event log and reminders — THE SEAM.
 */

import type { AuditEvent, ChangeLogEntry, Reminder } from "@/lib/domain/event";
import { getDataset } from "@/lib/mock";
import { activeDataset } from "@/lib/session";

/** FH-002 – high-level events on agreements, newest first. */
export async function listEvents(count = 5): Promise<AuditEvent[]> {
  return getDataset(await activeDataset())
    .events.slice()
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, count);
}

/** FA-022 – reminders to update an agreement on a given date, soonest first. */
export async function listReminders(count = 3): Promise<Reminder[]> {
  return getDataset(await activeDataset())
    .reminders.slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, count);
}

export async function reminderCount(): Promise<number> {
  return getDataset(await activeDataset()).totalReminders;
}

/** FH-001 – the change log, newest first. */
export async function listChangeLog(count = 20): Promise<ChangeLogEntry[]> {
  return getDataset(await activeDataset())
    .changeLog.slice()
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, count);
}
