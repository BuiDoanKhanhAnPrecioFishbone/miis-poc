/**
 * Data access for documents — THE SEAM.
 *
 * D-001 puts the confidentiality mark on the *agreement* and lets it carry to
 * the attachments. So the agreement is the authority: the flag stored on a
 * document is treated as a default and re-derived here, which makes it
 * impossible for a marked agreement to have an unmarked protocol on screen.
 */

import type { StoredDocument } from "@/lib/domain/event";
import { getDataset } from "@/lib/mock";
import { activeDataset } from "@/lib/session";

export async function listDocuments(): Promise<StoredDocument[]> {
  const data = getDataset(await activeDataset());
  const confidentialAgreements = new Set(
    data.agreements.filter((a) => a.confidential).map((a) => a.id),
  );

  return data.documents
    .map((d) => ({
      ...d,
      confidential: d.confidential || (d.agreementId ? confidentialAgreements.has(d.agreementId) : false),
    }))
    .sort((a, b) => b.uploadedDate.localeCompare(a.uploadedDate));
}
