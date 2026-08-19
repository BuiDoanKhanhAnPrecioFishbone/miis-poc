/**
 * Data access for negotiations — THE SEAM.
 */

import { agreementTitle } from "@/lib/domain/agreement";
import type { Negotiation, NegotiationType } from "@/lib/domain/mediation";
import { getDataset } from "@/lib/mock";
import { activeDataset } from "@/lib/session";

export interface NegotiationFilter {
  type?: NegotiationType;
  status?: Negotiation["status"];
}

/** A negotiation with the agreement it belongs to resolved, where it has one. */
export interface NegotiationRow {
  negotiation: Negotiation;
  /** FF-002 — absent for a standalone negotiation (FF-003), and that is data. */
  agreementName?: string;
}

export async function listNegotiations(filter?: NegotiationFilter): Promise<NegotiationRow[]> {
  const data = getDataset(await activeDataset());
  let rows = data.negotiations;
  if (filter?.type) rows = rows.filter((n) => n.type === filter.type);
  if (filter?.status) rows = rows.filter((n) => n.status === filter.status);
  return rows.map((negotiation) => {
    const agreement = negotiation.agreementId
      ? data.agreements.find((a) => a.id === negotiation.agreementId)
      : undefined;
    return agreement ? { negotiation, agreementName: agreementTitle(agreement) } : { negotiation };
  });
}
