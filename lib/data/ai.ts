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
        sv: `Tolkat protokoll: ${EXTRACTION_PROPOSALS.length} fältvärden är utlästa och väntar på att godkännas eller avvisas. Inget är sparat.`,
        en: `Interpreted protocol: ${EXTRACTION_PROPOSALS.length} field values have been read out and are waiting to be approved or rejected. Nothing is saved.`,
      },
      /*
        `?forts=1`, not `/registrera`. The queue promises work that is already
        interpreted, and the bare route opens on an empty drop zone — so the one
        control that says "nine things are waiting for you" delivered a blank
        upload form, and looked identical to the task button above it that
        starts a fresh interpretation. This one resumes; that one starts.
      */
      href: "/registrera?forts=1",
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
        sv: "Beslutsstöd: tre framtagna underlag – övriga parter, tidigare medlingar och spridningsrisk – som ska läsas innan ärendet drivs vidare.",
        en: "Decision support: three findings — other parties, previous mediations and contagion risk — to be read before the case is taken further.",
      },
      href: `/medling/${c.id}`,
      /* Three findings, which is what §4.1 names for a mediation case. */
      proposals: 3,
      nav: "medling",
    });
  }

  return items;
}
