/**
 * Mediation, mediators and negotiations — Epic F9, Appendix 1 §4.2.
 *
 * Identifiers are English; user-facing strings exist in both languages.
 * Pure domain — no imports beyond sibling types, no I/O.
 */

import type { Lang, Text } from "./lang";

export type MediationType = "special" | "standing";

export const MEDIATION_TYPE_LABEL: Record<Lang, Record<MediationType, string>> = {
  sv: {
    special: "Särskild medling",
    standing: "Fast medling (lokal tvist)",
  },
  en: {
    special: "Special mediation",
    standing: "Standing mediation (local dispute)",
  },
};

export type MediatorPosition = "first-chair" | "second-chair";

/** MI's own terms for the two mediator seats — kept in Swedish, glossed in English. */
export const MEDIATOR_POSITION_LABEL: Record<Lang, Record<MediatorPosition, string>> = {
  sv: {
    "first-chair": "Ettan",
    "second-chair": "Tvåan",
  },
  en: {
    "first-chair": "Ettan (lead mediator)",
    "second-chair": "Tvåan (second mediator)",
  },
};

export interface MediatorRef {
  id: string;
  name: string;
  position: MediatorPosition;
  previousAssignments: number;
}

/** FF-009 – mediator register with history and statistics. */
export interface Mediator {
  id: string;
  name: string;
  email: string;
  phone: string;
  types: MediationType[];
  active: boolean;
  history: { year: number; agreementArea: string; position: MediatorPosition }[];
}

/** FF-010 – the mediation outcome, all five fields the requirement names. */
export interface MediationOutcome {
  mediationType: MediationType;
  industrialAction: boolean;
  industrialActionType?: string;
  lostWorkingDays?: number;
  affectedEmployees?: number;
}

/** AI decision support shown on the case view (§4.1). */
export interface MediationDecisionSupport {
  otherParties: Text;
  previousMediations: Text;
  /** §4.1 — the risk that a conflict spreads to adjacent agreement areas. */
  contagionRisk: Text;
}

export interface MediationCase {
  id: string;
  name: string;
  type: MediationType;
  /** FF-007 – registry number from MI's registry system. */
  registryNumber?: string;
  dgDecision: { number: string; date: string; document: string };
  /** FF-008 – a case can be linked to several agreements. */
  agreementIds: string[];
  mediators: MediatorRef[];
  /** FF-006 / FA-017 – decides whether MI appoints mediators at all. */
  coveredByProcedureAgreement: boolean;
  /** Status label shown in the case list, in both languages. */
  status: Text;
  ongoing: boolean;
  outcome?: MediationOutcome;
  decisionSupport?: MediationDecisionSupport;
  /** Documents attached to the case, as a display string. */
  documents?: Text;
}

export type NegotiationType = "bargaining-round" | "other";

export const NEGOTIATION_TYPE_LABEL: Record<Lang, Record<NegotiationType, string>> = {
  sv: {
    "bargaining-round": "Avtalsrörelse",
    other: "Övrig förhandling",
  },
  en: {
    "bargaining-round": "Bargaining round",
    other: "Other negotiation",
  },
};

/** FF-001–003 */
export interface Negotiation {
  id: string;
  type: NegotiationType;
  /** Either linked to an agreement, or standalone with direct links to parties. */
  agreementId?: string;
  parties: string[];
  status: "ongoing" | "closed-with-agreement" | "closed-without-agreement";
  closedDate?: string;
}

/**
 * FF-006 – whether MI appoints mediators. Where the parties have a negotiation
 * procedure agreement they mediate under their own procedure and MI appoints
 * nobody (§4.2). Currently nine such agreements exist.
 */
export function miAppointsMediators(c: Pick<MediationCase, "coveredByProcedureAgreement">): boolean {
  return !c.coveredByProcedureAgreement;
}

/** Route-safe id "M-2027-12" shown to users as "M-2027/12". */
export function caseNumber(id: string): string {
  return id.replace(/-(\d+)$/, "/$1");
}
