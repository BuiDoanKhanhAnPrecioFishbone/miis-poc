/**
 * Free-text search in the protocol — §4.1's **third** AI function, built.
 *
 * MI's own words: *"AI-stöd vid huvud- och avtalsinformationsregistrering. **Via
 * fritextsökning i protokoll och avtal** ska systemet kunna identifiera och
 * föreslå registrering av specifika skrivningar, exempelvis om jämställdhet,
 * arbetstidsförkortning eller andra utpekade bestämmelser. Funktionen fungerar
 * som stöd vid både huvudregistrering och registrering av avtalsinformation.
 * Handläggaren godkänner manuellt innan information sparas."*
 *
 * Every clause of that sentence is a design constraint:
 *
 * - **Via fritextsökning** — the officer types. This is the one place §4.1 asks
 *   for a text input, and the prototype described the function in the AI
 *   catalogue without ever building the field. It is also the honest answer to
 *   "should the AI have a box you type into": yes, this box, searching this
 *   protocol, for the provisions MI names.
 * - **identifiera och föreslå registrering** — a hit is not an answer, it is a
 *   **proposal for registration**. So a hit carries the passage it was found in
 *   and the record it would become.
 * - **specifika skrivningar, exempelvis om jämställdhet** — the requirement's
 *   own examples name what the function is for, and the suggested chips name
 *   what *this* protocol contains. See `SUGGESTED_CLAUSE_TERMS` for why the two
 *   are not the same list.
 * - **Handläggaren godkänner manuellt** — FAI-002 again. Nothing is registered
 *   by finding it.
 *
 * What a hit becomes is *Särskilda frågor* (Bilaga 3 §3.11): a question, a
 * jämställdhet flag and the *avtalstext* that settles it. That is exactly the
 * shape of a "specifik skrivning" in MI's own register, which is why the search
 * proposes one rather than inventing a new kind of record.
 *
 * Pure domain — no React, no data access, no I/O.
 */

import type { SourceAnchor } from "./extraction";

export interface ProtocolLine {
  /** Null for a heading — a heading is not a passage a proposal can point at. */
  anchor: SourceAnchor | null;
  text: string;
}

/**
 * Suggested searches, offered as controls rather than left to be guessed — an
 * empty box on a screen an officer meets once a week is a box they do not use.
 *
 * **These are the provisions MI's own sample protocol contains**, not §4.1's two
 * examples. That is deliberate. §4.1 names *jämställdhet* and
 * *arbetstidsförkortning*, and the sample protocol is a verbatim transcription
 * of MI's scanned page in Bilaga D — shown beside the text in the Original view
 * — so neither word is in it. Suggesting a term that returns nothing would be
 * the same dead control as a button with no handler, and adding the clauses to
 * MI's own document would put the transcription at odds with the image of it.
 *
 * The requirement's examples belong in the copy that explains what the function
 * is for; the chips belong to the document on screen. Searching for
 * *jämställdhet* here returns the empty state, and the empty state says the
 * search covers this protocol rather than the register — which is the truth
 * about both.
 */
export const SUGGESTED_CLAUSE_TERMS: readonly string[] = [
  "deltidspension",
  "arbetsgrupp",
  "löneavtal",
  "fredsplikt",
];

export interface ClauseHit {
  anchor: SourceAnchor;
  /** The passage, as it stands in the protocol. */
  text: string;
  /** Whether the passage concerns gender equality — FA-011, per question. */
  genderEquality: boolean;
}

/** The one term §4.1 names that FA-011 also flags. */
const EQUALITY_TERMS = ["jämställd", "likabehandling", "lönekartläggning"];

/**
 * Passages containing the query.
 *
 * Case- and diacritic-aware for Swedish, and substring rather than whole-word:
 * an officer searching *jämställd* must find *jämställdhetsarbetet*, which is
 * how the word actually appears in a protocol. Headings are skipped — they carry
 * no anchor, so a proposal read from one could not point back at anything.
 */
export function searchProtocol(lines: readonly ProtocolLine[], query: string): ClauseHit[] {
  const q = query.trim().toLocaleLowerCase("sv");
  if (q.length < 2) return [];

  return lines
    .filter((line): line is ProtocolLine & { anchor: SourceAnchor } => line.anchor !== null)
    .filter((line) => line.text.toLocaleLowerCase("sv").includes(q))
    .map((line) => {
      const lower = line.text.toLocaleLowerCase("sv");
      return {
        anchor: line.anchor,
        text: line.text,
        genderEquality: EQUALITY_TERMS.some((term) => lower.includes(term)),
      };
    });
}

/**
 * The *Särskild fråga* a hit would be registered as.
 *
 * The question is the officer's search term, capitalised — they searched for
 * the provision they were looking for, so the term is the question. The passage
 * becomes the *avtalstext*, unedited: FAI-002 says the officer approves what the
 * machine proposes, and a proposal that had already been rewritten would be a
 * different sentence being approved.
 */
export interface ProposedQuestion {
  question: string;
  genderEquality: boolean;
  agreementText: string;
  anchor: SourceAnchor;
}

export function proposedQuestion(hit: ClauseHit, term: string): ProposedQuestion {
  const trimmed = term.trim();
  return {
    question: trimmed.charAt(0).toLocaleUpperCase("sv") + trimmed.slice(1),
    genderEquality: hit.genderEquality,
    agreementText: hit.text,
    anchor: hit.anchor,
  };
}
