/**
 * What the assistant may answer from — THE SEAM.
 *
 * One read per question the assistant can answer, so every answer is a row an
 * officer could have found themselves. Nothing is summarised, scored or
 * inferred here: the assistant's whole claim is that it runs a query MIIS
 * already runs, and a data layer that started interpreting would make that
 * false.
 *
 * Assembled once for the route group and handed to the drawer, because the
 * question is asked from wherever the officer happens to be standing.
 */

import { partiesLabel, validityLabel, isPublished, mayPublish } from "@/lib/domain/agreement";
import type { AssistantFacts, AssistantRow } from "@/lib/domain/assistant";
import type { Lang } from "@/lib/domain/lang";
import { percent } from "@/lib/format";
import { caseNumber } from "@/lib/domain/mediation";
import { getDataset } from "@/lib/mock";
import { activeDataset } from "@/lib/session";

/** How far ahead "expires soon" looks. MI's own reminder horizon (FA-022). */
export const EXPIRY_HORIZON_DAYS = 90;

/**
 * The day the horizon is measured from.
 *
 * Fixed rather than `new Date()`: the screenshot pass has to produce the same
 * answer twice, and a live clock would make every capture differ. In the
 * delivered system this is the server's date.
 */
const TODAY = "2027-06-14";

function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000);
}

export async function getAssistantFacts(lang: Lang): Promise<AssistantFacts> {
  const data = getDataset(await activeDataset());

  const agreementRow = (a: (typeof data.agreements)[number], detail?: string): AssistantRow => ({
    key: a.id,
    label: a.name,
    detail: detail ?? partiesLabel(a),
    href: `/avtal/${a.id}`,
  });

  const expiring = data.agreements
    .filter((a) => {
      if (!a.validTo) return false;
      const days = daysBetween(TODAY, a.validTo);
      return days >= 0 && days <= EXPIRY_HORIZON_DAYS;
    })
    .sort((a, b) => (a.validTo ?? "").localeCompare(b.validTo ?? ""))
    .map((a) => agreementRow(a, `${partiesLabel(a)} · ${validityLabel(a, lang)}`));

  const incomplete = data.agreements
    .filter((a) => a.registrationStatus === "incomplete")
    .map((a) => agreementRow(a));

  /* Ready to publish and not published — the queue MI's own act clears. */
  const unpublished = data.agreements
    .filter((a) => !isPublished(a) && mayPublish(a))
    .map((a) => agreementRow(a));

  const mediations = data.mediationCases
    .filter((c) => c.ongoing)
    .map((c) => ({
      key: c.id,
      label: `${caseNumber(c.id)} · ${c.name}`,
      detail: c.status[lang],
      href: `/medling/${c.id}`,
    }));

  /* The figures, not a reading of them. Märket is MI's own published reference
     and the assistant repeats it rather than interpreting it. */
  const current = data.benchmarks[0];
  const benchmark: AssistantRow[] = current
    ? [
        {
          key: "benchmark",
          label: current.period,
          detail: `${percent(current.costFramePercent, lang)} · ${current.periodisation} · ${current.months} mån`,
          href: "/market",
        },
      ]
    : [];

  return {
    expiring,
    incomplete,
    unpublished,
    mediations,
    benchmark,
    agreements: data.agreements.map((a) => agreementRow(a)),
  };
}
