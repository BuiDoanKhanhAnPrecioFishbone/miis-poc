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
import type { Agreement } from "@/lib/domain/agreement";
import type { CooperationBody, Party } from "@/lib/domain/party";
import { COOPERATION_BODIES, PARTY_REGISTER } from "@/lib/mock/party-register";

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

/**
 * FP-001 to FP-006 — the party register itself, rather than the references the
 * agreement tables use.
 */
export async function listParties(): Promise<Party[]> {
  return [...PARTY_REGISTER].sort((a, b) => a.name.localeCompare(b.name, "sv"));
}

export async function getParty(id: string): Promise<Party | undefined> {
  return PARTY_REGISTER.find((p) => p.id === id);
}

export async function listCooperationBodies(): Promise<CooperationBody[]> {
  return COOPERATION_BODIES;
}

/**
 * FP-004 — the agreements a name change would reach, split by whether they are
 * current or historical. The split is the requirement: a new name propagates to
 * every current agreement and to no historical one, so the screen has to be able
 * to show both halves rather than assert the rule.
 */
export async function agreementsForParty(
  partyId: string,
  today: string,
): Promise<{ current: Agreement[]; historical: Agreement[] }> {
  const data = getDataset(await activeDataset());
  const mine = data.agreements.filter(
    (a) => a.employerOrg.id === partyId || a.employeeOrg.id === partyId,
  );
  return {
    current: mine.filter((a) => !a.validTo || a.validTo >= today),
    historical: mine.filter((a) => a.validTo && a.validTo < today),
  };
}
