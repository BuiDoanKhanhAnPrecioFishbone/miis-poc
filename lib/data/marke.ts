/**
 * Data access for "Märket" — THE SEAM.
 * Week 1 reads from lib/mock/. Week 2 talks to Supabase; no page changes.
 */

import { gallandeMarke, type Marke } from "@/lib/domain/marke";
import { MARKEN } from "@/lib/mock/ovrigt";

/** FM-003 – the benchmark in force at a given date, shown wherever relevant. */
export async function getGallandeMarke(datum = "2027-06-01"): Promise<Marke | undefined> {
  return gallandeMarke(MARKEN, datum) ?? MARKEN[0];
}

export async function listMarken(): Promise<Marke[]> {
  return MARKEN;
}
