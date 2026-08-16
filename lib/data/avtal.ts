/**
 * Data access for agreements — THE SEAM.
 *
 * Week 1 these read from lib/mock/. Week 2 the bodies talk to Supabase and no
 * page changes. This is the only layer that may import a database client.
 */

import type { Avtal, AvtalRad } from "@/lib/domain/avtal";
import { AVTAL, SENASTE_AVTAL } from "@/lib/mock/avtal";

export interface AvtalFilter {
  avtalsomrade?: string;
  registreringsstatus?: Avtal["registreringsstatus"];
  ago?: string;
  ato?: string;
}

export async function listAvtal(filter?: AvtalFilter): Promise<Avtal[]> {
  let rader = AVTAL;
  if (filter?.avtalsomrade) {
    rader = rader.filter((a) => a.avtalsomrade === filter.avtalsomrade);
  }
  if (filter?.registreringsstatus) {
    rader = rader.filter((a) => a.registreringsstatus === filter.registreringsstatus);
  }
  if (filter?.ago) rader = rader.filter((a) => a.ago.id === filter.ago);
  if (filter?.ato) rader = rader.filter((a) => a.ato.id === filter.ato);
  return rader;
}

/**
 * @param per FH-003 / FA-020 – reconstruct the agreement as it was valid at a
 * given point in time. Ignored while data is mocked; the parameter exists from
 * day one so the snapshot feature does not require touching every caller.
 */
export async function getAvtal(id: string, per?: string): Promise<Avtal | null> {
  void per;
  return AVTAL.find((a) => a.id === id) ?? null;
}

export async function listSenasteAvtal(antal = 4): Promise<AvtalRad[]> {
  return SENASTE_AVTAL.slice(0, antal);
}

/** FA-021 – agreements saved with registration status Incomplete. */
export async function listOfullstandigaAvtal(): Promise<Avtal[]> {
  return AVTAL.filter((a) => a.registreringsstatus === "ofullstandig");
}
