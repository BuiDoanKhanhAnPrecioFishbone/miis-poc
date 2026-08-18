/**
 * FD-001 / FAI-003 / FAI-004 — what happens to a protocol between the moment
 * the case officer hands it over and the moment the form is pre-filled.
 *
 * US-01 step 1 is one sentence: *"The case officer uploads the agreement
 * protocol from the start page. Scanned documents are **automatically**
 * OCR-interpreted (FAI-003) and the document is linked to the relevant entity
 * (FD-001)"*, followed immediately by the watchword pass (FAI-004) and AI
 * analysis 1 (FAI-001).
 *
 * "Automatically" is the load-bearing word: there is no *Run OCR* button in
 * this model, because the requirement does not describe one. The officer picks
 * a file and the four stages below run themselves. Naming them is worth doing
 * anyway — four mandatory requirements are satisfied in that gap, and a
 * progress bar that says nothing would assert them rather than show them.
 *
 * Pure domain — no imports, no I/O. The labels live in `lib/i18n/`; only the
 * order and the requirement each stage discharges live here.
 */

export type PipelineStage = "receive" | "ocr" | "watchwords" | "match";

/** In order, each with the requirement it discharges. */
export const UPLOAD_PIPELINE: readonly { id: PipelineStage; req: string }[] = [
  { id: "receive", req: "FD-001" },
  { id: "ocr", req: "FAI-003" },
  { id: "watchwords", req: "FAI-004" },
  { id: "match", req: "FAI-001" },
] as const;

export interface UploadedFile {
  name: string;
  bytes: number;
}

/**
 * FAI-003 is scoped to *scanned* documents, so the formats MI actually receives
 * are page images and PDF. A `.docx` is not refused because it would be hard to
 * read — it is refused because accepting it would claim an OCR path that the
 * requirement does not describe.
 */
export const ACCEPTED_EXTENSIONS = [".pdf", ".tif", ".tiff", ".png", ".jpg", ".jpeg"] as const;

export function isAcceptedFile(name: string): boolean {
  const lower = name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

/**
 * FA-018 — *"Agreement name not stated in the protocol: the system uses the
 * file name … as identification input."* The file name is therefore data, not
 * chrome, and the extension is not part of it.
 */
export function identificationName(file: UploadedFile): string {
  const dot = file.name.lastIndexOf(".");
  return dot > 0 ? file.name.slice(0, dot) : file.name;
}

/** Bytes to whole kB, floored at 1 so a small file never reads as empty. */
export function fileSizeKb(bytes: number): number {
  return Math.max(1, Math.round(bytes / 1024));
}
