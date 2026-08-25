/**
 * Data access for MI's Avtalskonstruktioner report — THE SEAM.
 *
 * Week 1 this returns MI's own published figures verbatim. Week 2 it is a query
 * against the register, and the screen does not change: the contract is "two
 * column groups of construction rows plus the selection they were taken with",
 * which is what either source returns.
 */

import type { ConstructionBand, ConstructionRow } from "@/lib/mock/constructions-report";
import {
  CONSTRUCTION_BANDS,
  REPORT_SELECTION,
  SAMTLIGA_AVTAL,
  URVALETS_AVTAL,
} from "@/lib/mock/constructions-report";

export interface ConstructionsReport {
  samtliga: ConstructionRow[];
  urvalet: ConstructionRow[];
  bands: ConstructionBand[];
  selection: typeof REPORT_SELECTION;
}

export async function getConstructionsReport(): Promise<ConstructionsReport> {
  return {
    samtliga: SAMTLIGA_AVTAL,
    urvalet: URVALETS_AVTAL,
    bands: CONSTRUCTION_BANDS,
    selection: REPORT_SELECTION,
  };
}
