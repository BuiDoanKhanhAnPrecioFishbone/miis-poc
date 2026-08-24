/**
 * The browser half of the demo session's own records.
 *
 * Bilaga 2 §3.5's scored bullets end in acts — register an agreement, publish
 * it — and each was held in a client component's state while every register is
 * server-rendered. So the act announced itself and every screen went on denying
 * it. This writes the result where `lib/data/` reads it, which is the same
 * arrangement watchwords, reminders and the session limit already use.
 *
 * Module scope on purpose. The React compiler's `immutability` rule refuses an
 * assignment to anything declared outside the component body, and
 * `document.cookie` is exactly that — the same reason the demo bar and the
 * watchword table keep their own helper.
 *
 * Client-only: it touches `document`. The server reads the same cookies through
 * `lib/data/agreements.ts`, and `lib/domain/draft.ts` owns the encoding, so
 * neither side can drift from the other's idea of the format.
 */

import {
  COMPLETED_COOKIE,
  COOKIE_MAX_AGE_SECONDS,
  DRAFT_COOKIE,
  PUBLISHED_COOKIE,
} from "./cookies";
import {
  decodeCompletion,
  decodeDrafts,
  decodePublished,
  encodeCompletion,
  encodeDrafts,
  encodePublished,
  type DraftAgreement,
} from "./domain/draft";

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const hit = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`));
  return hit?.slice(name.length + 1);
}

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}

export function readDrafts(): DraftAgreement[] {
  return decodeDrafts(readCookie(DRAFT_COOKIE));
}

export function writeDrafts(list: readonly DraftAgreement[]) {
  writeCookie(DRAFT_COOKIE, encodeDrafts(list));
}

export function readPublished(): string[] {
  return decodePublished(readCookie(PUBLISHED_COOKIE));
}

/** Publication only ever adds — MI releasing an agreement is not undone here. */
export function markPublished(id: string) {
  writeCookie(PUBLISHED_COOKIE, encodePublished([...readPublished(), id]));
}

export function readCompletion(): Record<string, boolean> {
  return decodeCompletion(readCookie(COMPLETED_COOKIE));
}

/**
 * Mark a registration complete, or reopen it.
 *
 * Both directions, because the mediation case's *Klarmarkera beslut* has its
 * *Ångra klarmarkeringen* and this is the same act on a different record. An
 * officer who marks the wrong agreement complete has to be able to say so
 * before it is published — after that `mayReopenRegistration` refuses, because
 * the public computer is already showing it.
 */
export function setRegistrationComplete(id: string, done: boolean) {
  writeCookie(COMPLETED_COOKIE, encodeCompletion({ ...readCompletion(), [id]: done }));
}
