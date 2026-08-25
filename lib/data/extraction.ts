/**
 * Data access for AI extraction proposals — THE SEAM.
 *
 * Week 1 this is a fixed extraction of the sample protocol. Week 2 it is a call
 * to Försäkringskassan's Model as a Service, and the screen does not change:
 * the screen's contract is "a list of proposals, each with a source passage and
 * a confidence", which is what an extraction returns either way.
 */

import type { ExtractionProposal } from "@/lib/domain/extraction";
import { matchCandidates, type MatchCandidate } from "@/lib/domain/protocol-match";
import { EXTRACTION_PROPOSALS } from "@/lib/mock/extraction";
import { agreements } from "./agreements";

export async function listExtractionProposals(): Promise<ExtractionProposal[]> {
  return EXTRACTION_PROPOSALS;
}

/** What one proposal read, for the matcher. */
function read(id: string): string | undefined {
  const p = EXTRACTION_PROPOSALS.find((x) => x.id === id);
  return p?.correction ?? p?.value;
}

/**
 * The agreements this protocol could concern, strongest reason first.
 *
 * Through `agreements()` rather than the mock, so an agreement registered by
 * hand a minute ago is a candidate: §4.1 forbids the AI from registering a
 * first-time agreement precisely because there is nothing to match against, and
 * once the officer has created it there is.
 *
 * The extraction's own values are the input — the name it read off the heading
 * and the two parties — so what the officer sees proposed is a consequence of
 * what the screen shows them beside it, not a second answer computed elsewhere.
 */
export async function protocolCandidates(fileName?: string): Promise<MatchCandidate[]> {
  const register = await agreements();
  return matchCandidates({
    agreements: register.map((a) => ({
      id: a.id,
      name: a.name,
      employerOrg: a.employerOrg.name,
      employeeOrg: a.employeeOrg.name,
    })),
    ...(read("matched") ? { readName: read("matched")! } : {}),
    ...(read("employerOrg") ? { readEmployerOrg: read("employerOrg")! } : {}),
    ...(read("employeeOrg") ? { readEmployeeOrg: read("employeeOrg")! } : {}),
    ...(fileName ? { fileName } : {}),
  });
}
