import { describe, expect, it } from "vitest";

import {
  proposedQuestion,
  searchProtocol,
  SUGGESTED_CLAUSE_TERMS,
  type ProtocolLine,
} from "./clause-search";

/**
 * §4.1's third AI function, which the prototype described in its catalogue and
 * did not build: *"Via fritextsökning i protokoll och avtal ska systemet kunna
 * identifiera och föreslå registrering av specifika skrivningar, exempelvis om
 * jämställdhet, arbetstidsförkortning eller andra utpekade bestämmelser."*
 */
const LINES: ProtocolLine[] = [
  { anchor: null, text: "ÖVERENSKOMMELSE" },
  { anchor: "preamble", text: "Parterna är överens om löner och allmänna villkor." },
  {
    anchor: "workingTime",
    text: "Arbetstidsförkortningen utökas med 0,2 procentenheter från 2027-04-01.",
  },
  {
    anchor: "peace",
    text: "Parterna ska fortsätta arbetet för jämställda löner och lönekartläggning.",
  },
  { anchor: "termination", text: "Avtalet kan sägas upp senast tre månader före utgången." },
];

describe("searchProtocol — §4.1's free-text clause search", () => {
  it("finds the provision MI names as its first example", () => {
    const hits = searchProtocol(LINES, "jämställd");
    expect(hits).toHaveLength(1);
    expect(hits[0]!.anchor).toBe("peace");
  });

  /* Substring, not whole word: a protocol says *jämställda*, and an officer
     searching *jämställd* has to find it. */
  it("matches inside a word, and ignores case", () => {
    expect(searchProtocol(LINES, "ARBETSTIDSFÖRKORTNING")).toHaveLength(1);
    expect(searchProtocol(LINES, "arbetstidsförkortningen")).toHaveLength(1);
  });

  /*
    A heading carries no anchor, so a proposal read from one could not point
    back at a passage — and FAI-001's source link is the thing that makes the
    proposal checkable.
  */
  it("never returns a heading", () => {
    expect(searchProtocol(LINES, "överenskommelse")).toHaveLength(0);
  });

  it("returns nothing for an empty or one-character query", () => {
    expect(searchProtocol(LINES, "")).toHaveLength(0);
    expect(searchProtocol(LINES, "  ")).toHaveLength(0);
    expect(searchProtocol(LINES, "j")).toHaveLength(0);
  });

  /* FA-011 is per provision, so the flag is read off the passage rather than
     set by the officer after the fact. */
  it("flags a gender-equality provision and leaves the others alone", () => {
    expect(searchProtocol(LINES, "jämställd")[0]!.genderEquality).toBe(true);
    expect(searchProtocol(LINES, "arbetstidsförkortning")[0]!.genderEquality).toBe(false);
  });

  /*
    Every suggestion has to return something in MI's own sample protocol.
    §4.1's two examples — jämställdhet, arbetstidsförkortning — are not in that
    document, which is a verbatim transcription of MI's scanned page, so they
    are named in the copy and not offered as chips: a suggestion that returns
    nothing is the dead control this screen exists to avoid.
  */
  it("suggests only terms the protocol on screen actually contains", () => {
    const protocol: ProtocolLine[] = [
      { anchor: "pension", text: "ytterligare deltidspensionspremie avsätts med 0,4 %" },
      { anchor: "workingTime", text: "Direktiv arbetsgrupp löneavtal, Bilaga D" },
      { anchor: "wageAppendix", text: "Löneavtal, Bilaga B" },
      { anchor: "peace", text: "Fredsplikt gäller under avtalsperioden." },
    ];
    for (const term of SUGGESTED_CLAUSE_TERMS) {
      expect(searchProtocol(protocol, term), `${term} returns nothing`).not.toHaveLength(0);
    }
  });
});

describe("proposedQuestion", () => {
  const hit = searchProtocol(LINES, "jämställd")[0]!;

  it("becomes a Särskild fråga in Bilaga 3 §3.11's own shape", () => {
    const q = proposedQuestion(hit, "jämställdhet");
    expect(q.question).toBe("Jämställdhet");
    expect(q.genderEquality).toBe(true);
    expect(q.anchor).toBe("peace");
  });

  /*
    Unedited. FAI-002 has the officer approve what the machine proposed, and a
    passage that had already been rewritten would be a different sentence being
    approved.
  */
  it("carries the passage through as the avtalstext, unchanged", () => {
    expect(proposedQuestion(hit, "jämställdhet").agreementText).toBe(hit.text);
  });
});
