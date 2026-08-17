/**
 * The mock datasets.
 *
 * Three named scenarios so a screen can be seen empty, normal and under load
 * without editing data and losing the other two. Switch with the demo control
 * in the header, or by setting the `miis_dataset` cookie.
 *
 * Integrity is asserted at module load: a dangling id fails `next build`, so a
 * broken dataset can never reach the deployed app.
 *
 * Nothing outside lib/data/ imports this.
 */

import { AGREEMENTS } from "./agreements";
import { DOCUMENTS } from "./documents";
import { WAGE_AGREEMENTS } from "./wageAgreements";
import { generateAgreements, generateEvents, generateReminders } from "./generate";
import { assertIntegrity } from "./integrity";
import { MEDIATION_CASES, MEDIATORS } from "./mediation";
import { BENCHMARKS, EVENTS, MEDIATION_EVENTS, REMINDERS } from "./misc";
import { DEFAULT_DATASET, type DatasetName } from "@/lib/domain/dataset";
import type { Dataset } from "./types";

/** Nothing registered yet — the first weeks after go-live. */
const quiet: Dataset = {
  agreements: AGREEMENTS.slice(0, 2),
  wageAgreements: WAGE_AGREEMENTS.slice(0, 1),
  documents: DOCUMENTS.slice(0, 1),
  mediationCases: [],
  mediators: MEDIATORS.slice(0, 1),
  benchmarks: [],
  reminders: [],
  events: [],
  mediationEvents: [],
  totalReminders: 0,
};

/** Everyday state between bargaining rounds. The default. */
const normal: Dataset = {
  agreements: AGREEMENTS,
  wageAgreements: WAGE_AGREEMENTS,
  documents: DOCUMENTS,
  mediationCases: MEDIATION_CASES,
  mediators: MEDIATORS,
  benchmarks: BENCHMARKS,
  reminders: REMINDERS,
  events: EVENTS,
  mediationEvents: MEDIATION_EVENTS,
  totalReminders: 12,
};

/** Bargaining round under way — volume, for density and scrolling. */
const generated = generateAgreements(48);
const peakAgreements = [...AGREEMENTS, ...generated];

const peak: Dataset = {
  agreements: peakAgreements,
  wageAgreements: WAGE_AGREEMENTS,
  documents: DOCUMENTS,
  mediationCases: MEDIATION_CASES,
  mediators: MEDIATORS,
  benchmarks: BENCHMARKS,
  reminders: [...REMINDERS, ...generateReminders(9, generated)],
  events: [...EVENTS, ...generateEvents(18, generated)],
  mediationEvents: MEDIATION_EVENTS,
  totalReminders: 64,
};

const DATASETS: Record<DatasetName, Dataset> = { quiet, normal, peak };

// Fails the build rather than shipping a dataset with dangling references.
assertIntegrity(DATASETS);

export function getDataset(name: DatasetName = DEFAULT_DATASET): Dataset {
  return DATASETS[name] ?? DATASETS[DEFAULT_DATASET];
}
