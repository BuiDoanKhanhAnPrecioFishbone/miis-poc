/**
 * Data access for the mediator register — THE SEAM.
 */

import {
  type Mediator,
  type MediationType,
  type MediatorPosition,
} from "@/lib/domain/mediation";
import { getDataset } from "@/lib/mock";
import { activeDataset } from "@/lib/session";

export interface MediatorFilter {
  type?: MediationType;
  active?: boolean;
}

export async function listMediators(filter?: MediatorFilter): Promise<Mediator[]> {
  let rows = getDataset(await activeDataset()).mediators;
  if (filter?.type) rows = rows.filter((m) => m.types.includes(filter.type as MediationType));
  if (filter?.active !== undefined) rows = rows.filter((m) => m.active === filter.active);
  return rows;
}

/**
 * FF-009 — *"statistik per medlare (år och avtalsområde) samt position ettan
 * eller tvåan"*. Derived from the history rather than stored, so it cannot
 * disagree with the assignments it counts.
 */
export interface MediatorStats {
  assignments: number;
  firstChair: number;
  secondChair: number;
  latestYear?: number;
  areas: string[];
}

export function mediatorStats(m: Mediator): MediatorStats {
  const positions = (p: MediatorPosition) => m.history.filter((h) => h.position === p).length;
  const years = m.history.map((h) => h.year);
  const stats: MediatorStats = {
    assignments: m.history.length,
    firstChair: positions("first-chair"),
    secondChair: positions("second-chair"),
    areas: [...new Set(m.history.map((h) => h.agreementArea))].sort((a, b) =>
      a.localeCompare(b, "sv"),
    ),
  };
  if (years.length > 0) stats.latestYear = Math.max(...years);
  return stats;
}
