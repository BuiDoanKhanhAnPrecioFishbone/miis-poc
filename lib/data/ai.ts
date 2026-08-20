/**
 * The AI review queue — THE SEAM.
 *
 * FAI-002 says nothing the AI produces is saved before a case officer has
 * approved it. That guarantee implies a set: the proposals that exist and have
 * not been approved yet. The assistant shows that set, and it is **derived**
 * rather than stored, for the same reason table rows are — a stored count is a
 * count that can drift away from the proposals it claims to describe.
 *
 * Two sources, because those are the two places §4.1 puts the AI:
 *
 * - the protocol in registration, whose extraction is a list of proposals with
 *   a source passage each (FAI-001);
 * - every open mediation case carrying §4.1 decision support, whose three
 *   findings — other parties, previous mediations, contagion risk — are
 *   likewise material a mediation administrator has to read before acting.
 *
 * The `quiet` dataset has no mediation cases, so the queue empties there. That
 * is deliberate: the empty state is a real state and had to be designed.
 *
 * Week 2 the first half is a call to Försäkringskassan's Model as a Service and
 * the second is a query; the contract the drawer sees does not change.
 */

import type { AiQueueItem } from "@/lib/domain/ai";
import { getDataset } from "@/lib/mock";
import { EXTRACTION_PROPOSALS } from "@/lib/mock/extraction";
import { activeDataset } from "@/lib/session";

export async function listAiQueue(): Promise<AiQueueItem[]> {
  const data = getDataset(await activeDataset());
  const items: AiQueueItem[] = [];

  /*
    The protocol on the officer's desk. `matched` is the extraction's own answer
    to "which agreement is this", so it names the subject the way the officer
    will recognise it.
  */
  const matched = EXTRACTION_PROPOSALS.find((p) => p.id === "matched")?.value;
  if (matched) {
    items.push({
      id: "registration",
      functionId: "quick-registration",
      subject: { sv: matched, en: matched },
      detail: {
        sv: "Uppladdat protokoll, tolkat men inte godkänt",
        en: "Uploaded protocol, interpreted but not approved",
      },
      href: "/registrera",
      proposals: EXTRACTION_PROPOSALS.length,
      nav: "avtal",
    });
  }

  for (const c of data.mediationCases) {
    if (!c.ongoing || !c.decisionSupport) continue;
    items.push({
      id: c.id,
      functionId: "mediation-support",
      subject: { sv: `${c.id} · ${c.name}`, en: `${c.id} · ${c.name}` },
      detail: {
        sv: "Beslutsstöd framtaget ur MIIS – övriga parter, tidigare medlingar, spridningsrisk",
        en: "Decision support drawn from MIIS – other parties, previous mediations, contagion risk",
      },
      href: `/medling/${c.id}`,
      /* Three findings, which is what §4.1 names for a mediation case. */
      proposals: 3,
      nav: "medling",
    });
  }

  return items;
}
