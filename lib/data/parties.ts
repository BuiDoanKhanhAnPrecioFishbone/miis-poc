/**
 * Data access for parties — THE SEAM.
 *
 * The selection lists on the public view (US-14) are derived from the
 * agreements actually in the dataset rather than from the full party register,
 * so a visitor is never offered an organisation that would return nothing.
 */

import type { PartyRef } from "@/lib/domain/agreement";
import { getDataset } from "@/lib/mock";
import { activeDataset } from "@/lib/session";

function byName(parties: PartyRef[]): PartyRef[] {
  const seen = new Map<string, PartyRef>();
  for (const p of parties) if (!seen.has(p.id)) seen.set(p.id, p);
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name, "sv"));
}

/** Employer organisations (AGO) that appear on at least one agreement. */
export async function listEmployerOrgs(): Promise<PartyRef[]> {
  const data = getDataset(await activeDataset());
  return byName(data.agreements.map((a) => a.employerOrg));
}

/** Employee organisations (ATO) that appear on at least one agreement. */
export async function listEmployeeOrgs(): Promise<PartyRef[]> {
  const data = getDataset(await activeDataset());
  return byName(data.agreements.map((a) => a.employeeOrg));
}
