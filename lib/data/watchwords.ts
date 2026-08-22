/**
 * Data access for the watchword table — THE SEAM.
 *
 * The table is MI's predefined terms plus whatever the session has added from a
 * party meeting. Week 2 the second half is rows in `Bevakningsord` rather than
 * a cookie; the screens do not change, because the contract is "the terms in
 * force for this user".
 */

import { cookies } from "next/headers";

import { WATCHWORD_COOKIE } from "@/lib/cookies";
import type { Watchword } from "@/lib/domain/watchword";
import { decodeWatchwords } from "@/lib/domain/watchword";
import { PREDEFINED_WATCHWORDS } from "@/lib/mock/watchwords";

export async function listWatchwords(): Promise<Watchword[]> {
  const raw = (await cookies()).get(WATCHWORD_COOKIE)?.value;
  const added = decodeWatchwords(raw);
  return [...PREDEFINED_WATCHWORDS, ...added];
}

/**
 * Which of the terms are MI's own baseline.
 *
 * The merged list loses the distinction, and Administration needs it: the
 * table is *fördefinierad **och** anpassningsbar*, so an administrator removes
 * what this authority added and not what MI maintains centrally. `origin` will
 * not do the job — every term carries one, including MI's own.
 */
export function predefinedTerms(): string[] {
  return PREDEFINED_WATCHWORDS.map((w) => w.term);
}
