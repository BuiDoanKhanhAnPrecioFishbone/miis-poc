/**
 * FAI-001 / FAI-002 / FAI-004 — what the AI proposed, and what the officer did
 * with it.
 *
 * The important part of the model is `source`. WageIndicator's collective
 * agreements database does not merely record a coded value; it records which
 * clause the value came from and keeps the two linked. Doing the same here is
 * not a new feature — FAI-001 is extraction *from* the protocol and FAI-004
 * already highlights text in it — but it is what turns "manual review before
 * saving" from tedious into fast, which is the whole point of FAI-002.
 *
 * **There is no per-proposal approval state, and no reject.** FAI-002 requires
 * approval "before being saved", which scopes it to the save — US-01 describes
 * "the pre-filled form … the officer adjusts as needed and approves manually",
 * and §4.1 calls the whole flow *Quick registration*. So a proposal carries the
 * value AI read and nothing else; whether the officer changed it is derived by
 * comparing the current value to this one, and approval belongs to the form.
 *
 * There is also no confidence score. No requirement mentions one, and an
 * unrequested AI feature reads as requirements that were not read closely —
 * the same test that removed the general assistant.
 *
 * Identifiers are English; user-facing strings exist in both languages.
 * Pure domain — no imports beyond sibling types, no I/O.
 */

/** The fields AI proposes on the registration screen. */
export type ProposalField =
  | "area"
  | "matched"
  | "alternativeName"
  | "agreementType"
  | "employerOrg"
  | "employeeOrg"
  | "signedDate"
  | "validity"
  | "termination";

/** A passage in the protocol a proposal can point at. */
export type SourceAnchor =
  | "heading"
  | "parties"
  | "period"
  | "prolonged"
  | "workingTime"
  | "wageAppendix"
  | "revision"
  | "terminationLead"
  | "termination"
  | "minimumWage"
  | "peace"
  | "negotiation";

export interface ExtractionProposal {
  id: ProposalField;
  /** What AI read out of the protocol. Sample content, so not translated. */
  value: string;
  source: SourceAnchor;
  /**
   * Where the demo opens this field. Present only where the extraction got it
   * wrong, so the screen shows the corrected state at a glance — US-01's
   * alternative flow, "the officer corrects freely before approval". The
   * officer can put the proposal back, and can edit any other field the same
   * way; this is a starting value, not a separate kind of record.
   */
  correction?: string;
}

/** The value a field opens with: the officer's correction if there is one. */
export function initialValue(p: ExtractionProposal): string {
  return p.correction ?? p.value;
}

/** FH-001 logs the old and the new value, so "changed" has to be derivable. */
export function isAdjusted(p: ExtractionProposal, current: string): boolean {
  return current.trim() !== p.value.trim();
}

/** FA-021 — an empty field cannot be part of a registration marked Complete. */
export function isEmpty(current: string): boolean {
  return current.trim().length === 0;
}
