/**
 * Referential integrity for the mock data.
 *
 * Arrays have no foreign keys, so a mediation case can point at an agreement
 * that does not exist and nothing complains — the screen just shows less than
 * expected. This check makes that a build failure instead of a mystery.
 *
 * Called at module load in ./index.ts, so `next build` fails on a bad dataset
 * and the deployed app can never contain one.
 */

import type { Dataset } from "./types";

export function findIntegrityProblems(name: string, data: Dataset): string[] {
  const problems: string[] = [];
  const agreementIds = new Set(data.agreements.map((a) => a.id));
  const mediatorIds = new Set(data.mediators.map((m) => m.id));

  const duplicate = (label: string, ids: string[]) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id)) problems.push(`${label}: duplicate id "${id}"`);
      seen.add(id);
    }
  };

  duplicate("agreements", data.agreements.map((a) => a.id));
  duplicate("mediationCases", data.mediationCases.map((c) => c.id));
  duplicate("mediators", data.mediators.map((m) => m.id));

  for (const c of data.mediationCases) {
    for (const id of c.agreementIds) {
      if (!agreementIds.has(id)) {
        problems.push(`mediationCase ${c.id}: agreementIds references missing agreement "${id}"`);
      }
    }
    for (const m of c.mediators) {
      if (!mediatorIds.has(m.id)) {
        problems.push(`mediationCase ${c.id}: mediators references missing mediator "${m.id}"`);
      }
    }
  }

  for (const r of data.reminders) {
    if (r.agreementId && !agreementIds.has(r.agreementId)) {
      problems.push(`reminder ${r.id}: references missing agreement "${r.agreementId}"`);
    }
  }

  for (const e of [...data.events, ...data.mediationEvents]) {
    if (e.agreementId && !agreementIds.has(e.agreementId)) {
      problems.push(`event ${e.id}: references missing agreement "${e.agreementId}"`);
    }
  }

  return problems.map((p) => `[${name}] ${p}`);
}

export function assertIntegrity(datasets: Record<string, Dataset>): void {
  const problems = Object.entries(datasets).flatMap(([name, data]) =>
    findIntegrityProblems(name, data),
  );

  if (problems.length > 0) {
    throw new Error(
      `Mock data integrity check failed (${problems.length} problem${problems.length === 1 ? "" : "s"}):\n` +
        problems.map((p) => `  - ${p}`).join("\n") +
        `\n\nFix the ids in lib/mock/. See docs/00-START-HERE.md §8.`,
    );
  }
}
