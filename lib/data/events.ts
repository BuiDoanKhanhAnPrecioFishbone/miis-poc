/**
 * Data access for the event log and reminders — THE SEAM.
 */

import { cookies } from "next/headers";

import { REMINDER_COOKIE } from "@/lib/cookies";
import type { AuditEvent, ChangeLogEntry, Reminder } from "@/lib/domain/event";
import { decodeReminders, type SetReminder } from "@/lib/domain/reminder";
import { getDataset } from "@/lib/mock";
import { activeDataset } from "@/lib/session";

/** FH-002 – high-level events on agreements, newest first. */
export async function listEvents(count = 5): Promise<AuditEvent[]> {
  return getDataset(await activeDataset())
    .events.slice()
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, count);
}

/**
 * What the officer has marked this session, as `Reminder`s.
 *
 * The text is built here rather than stored, because it is language-dependent
 * and the cookie holds one record per agreement rather than one per language.
 */
async function sessionReminders(): Promise<Reminder[]> {
  const raw = (await cookies()).get(REMINDER_COOKIE)?.value;
  return decodeReminders(raw).map((r: SetReminder) => ({
    id: `SET-${r.agreementId}`,
    date: r.date,
    text: {
      sv: `Uppdatera ${r.name}`,
      en: `Update ${r.name}`,
    },
    agreementId: r.agreementId,
  }));
}

/**
 * FA-022 – reminders to update an agreement on a given date, soonest first.
 *
 * The dataset's own plus whatever the officer has marked. A reminder set on
 * Konjunkturlönerapporten has to appear here, because the start page is where
 * MI reads them: a marking the system accepts and then does not count is a
 * control that looks live and is not.
 */
export async function listReminders(count = 3): Promise<Reminder[]> {
  const set = await sessionReminders();
  return [...getDataset(await activeDataset()).reminders, ...set]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, count);
}

export async function reminderCount(): Promise<number> {
  const set = await sessionReminders();
  return getDataset(await activeDataset()).totalReminders + set.length;
}

/** The markings themselves, for the screen that sets them. */
export async function listSetReminders(): Promise<SetReminder[]> {
  return decodeReminders((await cookies()).get(REMINDER_COOKIE)?.value);
}

/** FH-001 – the change log, newest first. */
export async function listChangeLog(count = 20): Promise<ChangeLogEntry[]> {
  return getDataset(await activeDataset())
    .changeLog.slice()
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, count);
}
