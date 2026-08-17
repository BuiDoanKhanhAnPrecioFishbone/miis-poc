/**
 * Data access for AI extraction proposals — THE SEAM.
 *
 * Week 1 this is a fixed extraction of the sample protocol. Week 2 it is a call
 * to Försäkringskassan's Model as a Service, and the screen does not change:
 * the screen's contract is "a list of proposals, each with a source passage and
 * a confidence", which is what an extraction returns either way.
 */

import type { ExtractionProposal } from "@/lib/domain/extraction";
import { EXTRACTION_PROPOSALS } from "@/lib/mock/extraction";

export async function listExtractionProposals(): Promise<ExtractionProposal[]> {
  return EXTRACTION_PROPOSALS;
}
