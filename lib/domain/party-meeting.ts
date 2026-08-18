/**
 * FF-004 / FF-005 — party meetings, and the coordinated demands that come out
 * of them.
 *
 * A party meeting is the instrument MI uses ahead of a bargaining round: it
 * meets **one** party at a time — never both together — to gauge the negotiation
 * climate, identify conflict risks and judge whether mediation is likely. It is
 * explicitly *not* a negotiation (Bilaga 1 §4.2), and modelling it as one would
 * misdescribe MI's role, so there is no counterparty on this record at all.
 *
 * FF-004 gives the shape directly: registration *"både inför och efter en
 * träff, men även … mata in information direkt under mötet i en interaktiv
 * vy"*. Three phases, and the middle one is live — which is why `during`
 * carries running notes and demands rather than a finished summary.
 *
 * The demands matter beyond the meeting. §4.1 describes the watchword table as
 * carrying *"särskilt utvalda yrkanden, till exempel sådana som identifierats
 * vid partsträffar"* — so a demand captured here is what later gets highlighted
 * in an incoming protocol on `/registrera`. `watchword` records whether that
 * promotion has happened.
 *
 * Pure domain — no imports beyond sibling types, no I/O.
 */

import type { Lang, Text } from "./lang";

export type MeetingPhase = "before" | "during" | "after";

/** Where the meeting itself has got to. Not an FR-012 status. */
export type MeetingState = "planned" | "held" | "completed";

/**
 * FF-005 — a demand is either coordinated across several unions or a single
 * union's own. The flag is the requirement's own word, and it is what decides
 * whether `backedBy` means anything.
 */
export type DemandKind = "coordinated" | "own";

export interface BargainingDemand {
  id: string;
  topic: Text;
  kind: DemandKind;
  /** FF-005 — the unions standing behind a coordinated demand. Empty when own. */
  backedBy: string[];
  /** FF-005 — documents saved against the demand. */
  documents: string[];
  /** FAI-004 — promoted to the watchword table, so protocols highlight it. */
  watchword: boolean;
}

export interface PartyMeetingNote {
  /** Wall-clock, as the officer typed it during the meeting. */
  at: string;
  text: Text;
}

export interface PartyMeeting {
  id: string;
  /** The single party MI is meeting. There is deliberately no second one. */
  party: string;
  partyType: "employer" | "employee";
  agreementArea: Text;
  date: string;
  location: Text;
  state: MeetingState;
  /** Inför: what MI prepared. */
  purpose: Text;
  agenda: Text[];
  participants: string[];
  /** FSD-002 — the document generated from MI's template, once it exists. */
  templateDocument?: string;
  /** Under mötet: entered live. */
  notes: PartyMeetingNote[];
  demands: BargainingDemand[];
  /** Efter: the assessment and what was filed. */
  conflictRisk?: "low" | "medium" | "high";
  summary?: Text;
  documents: string[];
}

/** Which phases are done, so the view can show progress without inventing one. */
export function phaseState(meeting: PartyMeeting, phase: MeetingPhase): "done" | "current" | "upcoming" {
  const reached: Record<MeetingState, number> = { planned: 0, held: 1, completed: 2 };
  const index: Record<MeetingPhase, number> = { before: 0, during: 1, after: 2 };
  const at = reached[meeting.state];
  if (index[phase] < at) return "done";
  if (index[phase] === at) return "current";
  return "upcoming";
}

/** FF-005 — coordinated demands are the ones with backing to show. */
export function coordinatedDemands(meeting: PartyMeeting): BargainingDemand[] {
  return meeting.demands.filter((d) => d.kind === "coordinated");
}

/** FAI-004 — how many demands from this meeting are already watchwords. */
export function watchwordCount(meeting: PartyMeeting): number {
  return meeting.demands.filter((d) => d.watchword).length;
}

export const MEETING_STATE_LABEL: Record<Lang, Record<MeetingState, string>> = {
  sv: { planned: "Planerad", held: "Genomförd", completed: "Avslutad" },
  en: { planned: "Planned", held: "Held", completed: "Completed" },
};

export const DEMAND_KIND_LABEL: Record<Lang, Record<DemandKind, string>> = {
  sv: { coordinated: "Samordnat krav", own: "Eget förbundskrav" },
  en: { coordinated: "Coordinated demand", own: "Own union demand" },
};

export const CONFLICT_RISK_LABEL: Record<Lang, Record<"low" | "medium" | "high", string>> = {
  sv: { low: "Låg", medium: "Medel", high: "Hög" },
  en: { low: "Low", medium: "Medium", high: "High" },
};
