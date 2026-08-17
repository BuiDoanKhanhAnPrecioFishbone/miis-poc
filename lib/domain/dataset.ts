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
 * Identifiers are English; every user-facing string is Swedish.
 * Pure domain — no imports, no I/O.
 */

export type DatasetName = "quiet" | "normal" | "peak";

export interface DatasetInfo {
  id: DatasetName;
  /** Swedish label for the demo switcher. */
  label: string;
  description: string;
}

export const DATASET_INFO: readonly DatasetInfo[] = [
  {
    id: "quiet",
    label: "Tomt läge",
    description: "Nytt system, nästan inget registrerat ännu",
  },
  {
    id: "normal",
    label: "Normalläge",
    description: "Vardagsläge mellan avtalsrörelser",
  },
  {
    id: "peak",
    label: "Högtryck",
    description: "Avtalsrörelse med full belastning",
  },
] as const;

export const DEFAULT_DATASET: DatasetName = "normal";

export function isDatasetName(value: string | undefined): value is DatasetName {
  return DATASET_INFO.some((d) => d.id === value);
}

export function datasetInfo(name: DatasetName): DatasetInfo {
  return DATASET_INFO.find((d) => d.id === name) ?? DATASET_INFO[1]!;
}
