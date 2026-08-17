/**
 * The demo modes a screen can be viewed in.
 *
 * Not a business concept — it exists so a screen can be seen empty, normal and
 * under load without editing data and losing the other two states. It lives in
 * the domain because it is a pure type with Swedish labels, which the header
 * control needs; the data behind each mode lives in lib/mock/.
 *
 * Delete this file when a real database arrives.
 *
 * Identifiers are English; user-facing strings exist in both languages.
 * Pure domain — no imports beyond sibling types, no I/O.
 */

import { DEFAULT_LANG, type Lang, type Text } from "./lang";

export type DatasetName = "quiet" | "normal" | "peak";

export interface DatasetInfo {
  id: DatasetName;
  label: Text;
  description: Text;
}

export const DATASET_INFO: readonly DatasetInfo[] = [
  {
    id: "quiet",
    label: { sv: "Tomt läge", en: "Empty state" },
    description: {
      sv: "Nytt system, nästan inget registrerat ännu",
      en: "New system, almost nothing registered yet",
    },
  },
  {
    id: "normal",
    label: { sv: "Normalläge", en: "Everyday state" },
    description: {
      sv: "Vardagsläge mellan avtalsrörelser",
      en: "Everyday state between bargaining rounds",
    },
  },
  {
    id: "peak",
    label: { sv: "Högtryck", en: "Peak load" },
    description: {
      sv: "Avtalsrörelse med full belastning",
      en: "Bargaining round at full load",
    },
  },
] as const;

/** Options for the demo dataset switcher, in one language. */
export function datasetOptions(lang: Lang = DEFAULT_LANG): { id: DatasetName; label: string }[] {
  return DATASET_INFO.map((d) => ({ id: d.id, label: d.label[lang] }));
}

export const DEFAULT_DATASET: DatasetName = "normal";

export function isDatasetName(value: string | undefined): value is DatasetName {
  return DATASET_INFO.some((d) => d.id === value);
}

export function datasetInfo(name: DatasetName): DatasetInfo {
  return DATASET_INFO.find((d) => d.id === name) ?? DATASET_INFO[1]!;
}
