/**
 * Data access for the event log and reminders — THE SEAM.
 * Week 1 reads from lib/mock/. Week 2 talks to Supabase; no page changes.
 */

import type { Handelse, Paminnelse } from "@/lib/domain/handelse";
import { ANTAL_PAMINNELSER, HANDELSER, PAMINNELSER } from "@/lib/mock/ovrigt";

/** FH-002 – high-level events on agreements. */
export async function listHandelser(antal = 5): Promise<Handelse[]> {
  return HANDELSER.slice(0, antal);
}

/** FA-022 – reminders to update an agreement on a given date. */
export async function listPaminnelser(antal = 3): Promise<Paminnelse[]> {
  return PAMINNELSER.slice(0, antal);
}

export async function antalPaminnelser(): Promise<number> {
  return ANTAL_PAMINNELSER;
}
