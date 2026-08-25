/**
 * FA-022 — *"markering av Påminnelse om att uppdatera ett Avtal vid ett visst
 * datum"*.
 *
 * The requirement is one sentence and every word of it is a design decision.
 * It is a **marking** (not a task, not a workflow), on an **agreement**, at a
 * **given date**, and its purpose is *att uppdatera* — the officer knows an
 * agreement will need attention before they know what the attention is.
 *
 * The screen it belongs on is Konjunkturlönerapporten's watch list, because
 * that is where the gap is visible: an agreement whose registration is partial
 * is exactly the one somebody has to come back to, and FR-008 already puts that
 * list on a screen rather than behind a selection.
 *
 * **A reminder set here has to reach the start page.** MI's start page counts
 * them, and a count that does not move when an officer sets one is a number
 * that has stopped describing anything — the same fault the AI review queue
 * had. So a reminder travels in a cookie the way a watchword does: written in
 * the browser, read on the server, merged into what the dataset already holds.
 * In week 2 it is a row in the reminder table and nothing above this line
 * changes.
 *
 * Pure domain — no React, no data access, no I/O.
 */

/** A reminder the officer set this session, as it travels. */
export interface SetReminder {
  agreementId: string;
  /** ISO date. FA-022's *visst datum*. */
  date: string;
  /** The agreement's name, so a server render can label it without a lookup. */
  name: string;
}

/**
 * One reminder per agreement.
 *
 * FA-022 marks *an agreement* at *a date*, singular on both sides: a second
 * reminder on the same agreement would mean the first one was wrong rather than
 * that there are now two. Setting one again replaces it, which is also what the
 * screen offers — *Ändra*, not *Lägg till en till*.
 */
export function setReminder(
  list: readonly SetReminder[],
  reminder: SetReminder,
): SetReminder[] {
  if (!reminder.agreementId || !reminder.date) return [...list];
  return [...list.filter((r) => r.agreementId !== reminder.agreementId), reminder];
}

export function clearReminder(
  list: readonly SetReminder[],
  agreementId: string,
): SetReminder[] {
  return list.filter((r) => r.agreementId !== agreementId);
}

export function reminderFor(
  list: readonly SetReminder[],
  agreementId: string,
): SetReminder | undefined {
  return list.find((r) => r.agreementId === agreementId);
}

/**
 * The cookie holds `agreementId~date~name`, records separated by `|`.
 *
 * Deliberately not JSON, for the reason the watchword table gives: a cookie is
 * a small and hostile place for it, and a malformed value has to degrade to "no
 * reminders" rather than throw during a server render. A name containing `~` or
 * `|` would corrupt the record, so both are stripped rather than escaped —
 * neither occurs in a Swedish agreement name, and losing a character beats
 * losing the parse.
 */
const FIELD = "~";
const RECORD = "|";

export function encodeReminders(list: readonly SetReminder[]): string {
  return encodeURIComponent(
    list
      .map((r) =>
        [r.agreementId, r.date, r.name.replaceAll(FIELD, " ").replaceAll(RECORD, " ")].join(FIELD),
      )
      .join(RECORD),
  );
}

export function decodeReminders(raw: string | undefined): SetReminder[] {
  if (!raw) return [];
  try {
    return decodeURIComponent(raw)
      .split(RECORD)
      .map((part) => part.split(FIELD))
      .filter(([id, date]) => Boolean(id?.trim()) && Boolean(date?.trim()))
      .map(([id, date, name]) => ({
        agreementId: id!.trim(),
        date: date!.trim(),
        name: (name ?? "").trim(),
      }));
  } catch {
    return [];
  }
}
