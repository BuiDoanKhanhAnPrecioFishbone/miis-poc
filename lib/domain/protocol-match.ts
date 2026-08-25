/**
 * Which agreement an incoming protocol concerns — §4.1's first function.
 *
 * MI's own sentence has three identification routes, in this order:
 *
 *   *"systemet [ska] kunna identifiera vilket befintligt avtal det rör sig om
 *   … Om avtalsnamn saknas ska systemet kunna använda **filnamn** eller lista
 *   **parternas gemensamma avtal** som underlag för identifiering."*
 *
 * The prototype answered the first, stated the second in a validation sentence
 * and never showed the third: `matchedAgreementId()` returned a hard-coded
 * `"A-001"`. So the screen asserted a match instead of demonstrating one, and
 * an officer whose protocol concerned a different agreement had no way to say
 * so — the one field carrying the panel's headline claim was the one field
 * they could not correct.
 *
 * This ranks the register instead. Every candidate carries **why** it is one,
 * so the officer is choosing between reasons rather than between names, and the
 * top-ranked candidate is what the AI proposes — which FAI-002 then requires
 * them to approve, exactly as before.
 *
 * **A session-created agreement is a candidate like any other.** That is what
 * lets the walkthrough run on one subject: register a first-time agreement by
 * hand because §4.1 forbids the AI from doing it, then register the protocol
 * that arrives about it. The draft is in the register by then, so there is
 * something to match against — which is the whole reason §4.1 draws the
 * distinction in the first place.
 *
 * Pure domain — no React, no data access, no I/O.
 */

import type { Lang, Text } from "./lang";

/** Why an agreement is a candidate. Ordered strongest first. */
export type MatchReason =
  | "name"
  | "parties"
  | "fileName"
  | "employerOrg"
  | "employeeOrg";

export interface MatchCandidate {
  id: string;
  /** How the register names it, for the picker. */
  label: string;
  reason: MatchReason;
  /** What the reason was read from — the same guarantee every proposal gives. */
  source: string;
}

/** An agreement as the matcher sees it. Deliberately not `Agreement`. */
export interface MatchableAgreement {
  id: string;
  name: string;
  employerOrg: string;
  employeeOrg: string;
}

export interface MatchInput {
  /** The register, including whatever this session created. */
  agreements: readonly MatchableAgreement[];
  /** The agreement name the extraction read off the protocol heading, if any. */
  readName?: string;
  readEmployerOrg?: string;
  readEmployeeOrg?: string;
  /** MI's own fallback when the heading names no agreement. */
  fileName?: string;
}

/** Loose comparison: case, punctuation and the en dash MI's headings use. */
function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/[^a-z0-9åäö]+/g, " ")
    .trim();
}

/** Does the longer string contain the shorter, once both are normalised? */
function mentions(haystack: string, needle: string): boolean {
  if (needle.length < 4) return false;
  return norm(haystack).includes(norm(needle));
}

const RANK: Record<MatchReason, number> = {
  name: 0,
  parties: 1,
  fileName: 2,
  employerOrg: 3,
  employeeOrg: 4,
};

/**
 * The agreements this protocol could concern, strongest reason first.
 *
 * An agreement appears once, under its strongest reason: an agreement whose
 * name is in the heading **and** whose parties both appear is still one
 * candidate, and listing it twice would make the picker look longer than the
 * register.
 */
export function matchCandidates(input: MatchInput): MatchCandidate[] {
  const out = new Map<string, MatchCandidate>();

  const consider = (a: MatchableAgreement, reason: MatchReason, source: string) => {
    const existing = out.get(a.id);
    if (existing && RANK[existing.reason] <= RANK[reason]) return;
    out.set(a.id, {
      id: a.id,
      label: `${a.name} – ${a.employerOrg}/${a.employeeOrg}`,
      reason,
      source,
    });
  };

  for (const a of input.agreements) {
    /* 1 — the heading names it. MI's first route, and the only one that is not
       a fallback. */
    if (input.readName && mentions(input.readName, a.name)) {
      consider(a, "name", input.readName);
      continue;
    }

    /* 2 — both parties. MI's own words: *lista parternas gemensamma avtal*, so
       an agreement between exactly these two is a candidate whatever the
       heading says. */
    const employer =
      input.readEmployerOrg && mentions(input.readEmployerOrg, a.employerOrg);
    const employee =
      input.readEmployeeOrg && mentions(input.readEmployeeOrg, a.employeeOrg);
    if (employer && employee) {
      consider(a, "parties", `${input.readEmployerOrg} / ${input.readEmployeeOrg}`);
      continue;
    }

    /* 3 — the filename. MI names it explicitly for the case where the heading
       carries no agreement name at all, which FA-018 makes a ska-krav. */
    if (input.fileName && mentions(input.fileName, a.name)) {
      consider(a, "fileName", input.fileName);
      continue;
    }

    /* 4 — one party. Weakest, and included because an officer who cannot find
       the agreement above still wants the list narrowed to something. */
    if (employer) consider(a, "employerOrg", input.readEmployerOrg!);
    else if (employee) consider(a, "employeeOrg", input.readEmployeeOrg!);
  }

  return [...out.values()].sort(
    (x, y) => RANK[x.reason] - RANK[y.reason] || x.label.localeCompare(y.label, "sv"),
  );
}

/**
 * What the AI proposes: the strongest candidate, or nothing.
 *
 * Returning `undefined` rather than guessing is the point. A protocol about an
 * agreement the register does not hold is §4.1's other case — *helt nya avtal
 * ska alltid registreras manuellt* — and a matcher that picked the least-bad row
 * would send the officer to correct a wrong agreement rather than to create the
 * right one.
 */
export function proposedMatch(input: MatchInput): MatchCandidate | undefined {
  return matchCandidates(input)[0];
}

const REASON_LABEL: Record<Lang, Record<MatchReason, string>> = {
  sv: {
    name: "Avtalsnamnet i protokollets rubrik",
    parties: "Båda parterna på avtalet",
    fileName: "Filnamnet på det uppladdade protokollet",
    employerOrg: "Arbetsgivarparten",
    employeeOrg: "Arbetstagarparten",
  },
  en: {
    name: "The agreement name in the protocol heading",
    parties: "Both parties to the agreement",
    fileName: "The file name of the uploaded protocol",
    employerOrg: "The employer party",
    employeeOrg: "The employee party",
  },
};

export function matchReasonLabel(reason: MatchReason, lang: Lang): string {
  return REASON_LABEL[lang][reason];
}

export type { Text };
