/**
 * What this demo session has created and published — Bilaga 2 §3.5, bullets
 * two, three, six and nine.
 *
 * The scored scenarios end in acts: create a user, register an agreement,
 * publish it. Each of those was written to a client component's own state while
 * every register is server-rendered from `lib/mock/`, so the act announced
 * itself and then vanished. An evaluator following §3.5 registered an
 * agreement, was told it was registered, opened the register and found
 * seventeen rows without it; published one and switched to Allmänhetens dator,
 * where it was not. Bullet nine's own wording is *"publicerar avtalet **så att
 * det blir tillgängligt för användare med åtkomst till publicerad
 * information**"* — the visibility is the bullet, not a nicety on top of it.
 *
 * The mechanism already existed and was not being used here. Watchwords,
 * reminders, the session limit and the walkthrough position all survive a
 * navigation because they are written to a cookie and read on the server. These
 * do the same, so `lib/data/` can merge them into the register and every screen
 * downstream sees them without knowing they were made this session.
 *
 * **A draft is not a migration.** It holds what MI's own *Basfakta* requires
 * before an agreement can exist at all, and nothing else: the record saves as
 * `incomplete` and unpublished, because a new agreement with no wage agreement
 * under it is not a finished registration.
 *
 * Pure domain — no React, no data access, no I/O. The cookie is read and
 * written by the layers that may.
 */

import type { Agreement, PartyRef, RegistrationStatus } from "./agreement";

const FIELD = "~";
const RECORD = "|";

/** Kept apart from `Agreement` so the encoder cannot silently drop a field. */
export interface DraftAgreement {
  id: string;
  name: string;
  agreementArea: string;
  employerOrg: string;
  employeeOrg: string;
  agreementType: string;
  signedDate?: string;
  validFrom?: string;
  validTo?: string;
  confidential: boolean;
}

const clean = (s: string) => s.replaceAll(FIELD, " ").replaceAll(RECORD, " ").trim();

export function encodeDrafts(list: readonly DraftAgreement[]): string {
  return encodeURIComponent(
    list
      .map((d) =>
        [
          d.id,
          clean(d.name),
          clean(d.agreementArea),
          clean(d.employerOrg),
          clean(d.employeeOrg),
          clean(d.agreementType),
          d.signedDate ?? "",
          d.validFrom ?? "",
          d.validTo ?? "",
          d.confidential ? "1" : "0",
        ].join(FIELD),
      )
      .join(RECORD),
  );
}

/**
 * Degrades to an empty list rather than throwing.
 *
 * A cookie is user-editable and survives a deploy that changed this shape; a
 * reviewer whose session predates a field must get an empty register, not a
 * server error on the screen the criterion is scored on.
 */
export function decodeDrafts(raw: string | undefined): DraftAgreement[] {
  if (!raw) return [];
  try {
    return decodeURIComponent(raw)
      .split(RECORD)
      .map((rec) => rec.split(FIELD))
      .filter((f) => f.length === 10 && f[0] && f[1])
      .map((f) => ({
        id: f[0]!,
        name: f[1]!,
        agreementArea: f[2]!,
        employerOrg: f[3]!,
        employeeOrg: f[4]!,
        agreementType: f[5]!,
        ...(f[6] ? { signedDate: f[6] } : {}),
        ...(f[7] ? { validFrom: f[7] } : {}),
        ...(f[8] ? { validTo: f[8] } : {}),
        confidential: f[9] === "1",
      }));
  } catch {
    return [];
  }
}

/** The next id, so two drafts in one session cannot collide. */
export function nextDraftId(existing: readonly DraftAgreement[]): string {
  return `A-N${String(existing.length + 1).padStart(2, "0")}`;
}

export function addDraft(
  existing: readonly DraftAgreement[],
  draft: Omit<DraftAgreement, "id">,
): DraftAgreement[] {
  return [...existing, { ...draft, id: nextDraftId(existing) }];
}

const partyRef = (name: string): PartyRef => ({ id: `P-${clean(name)}`, name });

/**
 * A draft as the register sees it.
 *
 * `incomplete` and unpublished, always: MI decides when an agreement is
 * released, and a record registered a minute ago with no löneavtal under it has
 * nothing to release. That is also what makes the draft demonstrate FR-012 and
 * `mayPublish` honestly — the officer sees exactly why it cannot go out yet.
 */
export function draftToAgreement(d: DraftAgreement): Agreement {
  const status: RegistrationStatus = "incomplete";
  return {
    id: d.id,
    name: d.name,
    agreementArea: d.agreementArea,
    employerOrg: partyRef(d.employerOrg),
    employeeOrg: partyRef(d.employeeOrg),
    agreementType: d.agreementType,
    registrationStatus: status,
    confidential: d.confidential,
    reportSelection: {
      eurofound: false,
      minimumWage: false,
      website: false,
      shortTermWageReport: false,
    },
    ...(d.signedDate ? { signedDate: d.signedDate } : {}),
    ...(d.validFrom ? { validFrom: d.validFrom } : {}),
    ...(d.validTo ? { validTo: d.validTo } : {}),
  };
}

/* -------------------------------------------------------------------------- */
/* Publication — bullet nine                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Which agreements this session published.
 *
 * Publication is an act with a date and a person, not a property; what is kept
 * here is only *that it happened*, because who published it and when are the
 * session's own facts and belong with the record rather than in a cookie.
 */
export function encodePublished(ids: readonly string[]): string {
  return encodeURIComponent([...new Set(ids)].join(RECORD));
}

export function decodePublished(raw: string | undefined): string[] {
  if (!raw) return [];
  try {
    return [...new Set(decodeURIComponent(raw).split(RECORD).filter(Boolean))];
  } catch {
    return [];
  }
}

/* -------------------------------------------------------------------------- */
/* Completion — the act that unblocks bullet nine                              */
/* -------------------------------------------------------------------------- */

/**
 * Which registrations this session marked complete, and which it reopened.
 *
 * Unlike publication this goes both ways, so a bare id list will not do: an
 * agreement the sample data seeds as complete can be reopened, and one seeded
 * incomplete can be marked. The mark is `+id`, the reopening `-id`, last write
 * wins — which is what lets *Ångra klarmarkeringen* undo a mark made a moment
 * ago without the register having to remember an order of operations.
 */
export function encodeCompletion(marks: Readonly<Record<string, boolean>>): string {
  const parts = Object.entries(marks).map(([id, done]) => (done ? "+" : "-") + id);
  return encodeURIComponent(parts.join(RECORD));
}

export function decodeCompletion(raw: string | undefined): Record<string, boolean> {
  if (!raw) return {};
  try {
    const out: Record<string, boolean> = {};
    for (const part of decodeURIComponent(raw).split(RECORD)) {
      const id = part.slice(1);
      if (!id) continue;
      if (part[0] === "+") out[id] = true;
      else if (part[0] === "-") out[id] = false;
    }
    return out;
  } catch {
    return {};
  }
}

/**
 * Applies this session's completion marks to the register.
 *
 * Runs **before** `applyPublished`, because publishing requires the record to
 * be complete and an officer does both in one visit — mark it, then release it.
 * Reversing the order would have the publication read the status the mark had
 * just replaced.
 */
export function applyCompletion(
  list: readonly Agreement[],
  marks: Readonly<Record<string, boolean>>,
): Agreement[] {
  if (Object.keys(marks).length === 0) return [...list];
  return list.map((a) =>
    a.id in marks
      ? { ...a, registrationStatus: marks[a.id] ? ("complete" as const) : ("incomplete" as const) }
      : a,
  );
}

/** Applies this session's publications to the register, leaving the rest alone. */
export function applyPublished(
  list: readonly Agreement[],
  ids: readonly string[],
  on: { date: string; by: string },
): Agreement[] {
  if (ids.length === 0) return [...list];
  const set = new Set(ids);
  return list.map((a) =>
    set.has(a.id) && !a.published ? { ...a, published: { ...on } } : a,
  );
}
