/**
 * FAI-001 / FAI-002 / FAI-004 — what the AI proposed, and what happened to it.
 *
 * The important part of the model is `source`. WageIndicator's collective
 * agreements database does not merely record a coded value; it records which
 * clause the value came from and keeps the two linked. Doing the same here is
 * not a new feature — FAI-001 is extraction *from* the protocol and FAI-004
 * already highlights text in it — but it is what turns "manual review before
 * saving" from tedious into fast, which is the whole point of FAI-002.
 *
 * `state` starts at `pending` and must leave it. A registration cannot be marked
 * complete while a proposal is unreviewed, because "nothing shall be done
 * automatically" is a statement about every field, not about the form.
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
  | "negotiation";

/**
 * How sure the extraction is. Only two levels: an administrator does not need a
 * percentage, they need to know whether to slow down on this field.
 */
export type Confidence = "high" | "low";

export type ReviewState = "pending" | "approved" | "rejected";

export interface ExtractionProposal {
  id: ProposalField;
  /** What AI read out of the protocol. Sample content, so not translated. */
  value: string;
  source: SourceAnchor;
  confidence: Confidence;
  /**
   * Where the demo starts this proposal. One is seeded as `rejected` with a
   * correction, so the screen shows the path where AI got it wrong — asserting
   * that a case officer can correct a proposal is weaker than showing it.
   */
  initialState: ReviewState;
  /** The value the case officer put in instead, when the proposal was rejected. */
  correction?: string;
}

export function reviewedCount(states: readonly ReviewState[]): number {
  return states.filter((s) => s !== "pending").length;
}

export function approvedCount(states: readonly ReviewState[]): number {
  return states.filter((s) => s === "approved").length;
}
