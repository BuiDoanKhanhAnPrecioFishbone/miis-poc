/**
 * The AI support, as Appendix 1 §4.1 defines it — *"AI-stöd för registrering"*.
 *
 * MI does not ask for an assistant in the consumer sense and this is not one.
 * §4.1 asks for *"ett integrerat AI-stöd som underlättar och effektiviserar
 * registreringsarbetet"* and then names, in order, exactly four functions:
 * quick registration of new agreements, watchword marking, AI support during
 * head and agreement-information registration, and mediation cases. §4.3's
 * system sketch carries the same thing as a module of the system in its own
 * right ("AI-assisted registration"), which is why it is a named, findable
 * surface here rather than four unrelated panels.
 *
 * This file is the catalogue. It knows what the four functions are, which
 * requirement each answers, which screen each runs on, and — the part that
 * matters most for a public authority buying AI — what MI says the AI must
 * **not** do. §4.1 states two limits in its own words: *"alla förslag som
 * systemet genererar ska granskas och godkännas av användaren innan de
 * sparas"*, and *"Helt nya avtal – som inte tidigare tecknats – ska alltid
 * registreras manuellt"*. Both are shown, because a boundary an interface never
 * states is a boundary the buyer has to take on trust.
 *
 * Pure domain — no React, no data access, no I/O.
 */

import { DEFAULT_LANG, type Lang, type Text } from "./lang";
import type { NavId } from "./nav";
import { accessLevel, type RoleDefinition } from "./role";

export type AiFunctionId =
  | "quick-registration"
  | "watchwords"
  | "field-extraction"
  | "mediation-support";

export interface AiFunctionDefinition {
  id: AiFunctionId;
  label: Text;
  /** What the function does, kept close to §4.1's own sentence. */
  what: Text;
  /**
   * The same function phrased as a request the officer makes.
   *
   * This is what "ask the AI to do something" means in a system whose AI is
   * defined by four named functions: a short list of real tasks, not a prompt
   * box. Each one runs a function §4.1 asks for, on the screen §4.1 puts it on,
   * and produces a proposal FAI-002 then requires a human to approve — so the
   * interaction is genuine and nothing is claimed that MI did not ask for.
   */
  ask: Text;
  /** Where the officer sees it — named so the drawer can send them there. */
  where: Text;
  requirements: readonly string[];
  /**
   * The routes it runs on, as prefixes: `/medling` matches `/medling/M-2027-12`
   * so a detail view inherits its register's answer.
   */
  routes: readonly string[];
  /**
   * The region on the screen the function runs on.
   *
   * Without it the drawer's task button linked to the route it was already on —
   * a control that navigates nowhere, which is the whole reason the assistant
   * read as impossible to place. With it, asking for a function on the screen
   * that runs it takes the officer to the part of the page that does it.
   */
  anchor?: string;
  /** The menu item that owns those screens, so NFÅ-003 decides who may act. */
  nav: NavId;
  href: string;
}

export const AI_FUNCTIONS: readonly AiFunctionDefinition[] = [
  {
    id: "quick-registration",
    label: { sv: "Snabbregistrering av nya avtal", en: "Quick registration of new agreements" },
    what: {
      sv: "Läser det uppladdade protokollet, föreslår vilket befintligt avtal det rör och om ett nytt löneavtal eller avtal om allmänna villkor ska skapas, med teckningsdatum, löptid och eventuell uppsägningsmöjlighet.",
      en: "Reads the uploaded protocol, proposes which existing agreement it concerns and whether a new wage agreement or general terms agreement should be created, with signing date, validity period and any termination option.",
    },
    ask: {
      sv: "Tolka protokollet och föreslå avtal",
      en: "Interpret the protocol and propose an agreement",
    },
    where: { sv: "Steg 2 och 3 i Registrera avtalsprotokoll", en: "Steps 2 and 3 of Register agreement protocol" },
    requirements: ["FAI-001", "FAI-002", "FA-018"],
    routes: ["/registrera"],
    anchor: "#steg-ai",
    nav: "avtal",
    href: "/registrera",
  },
  {
    id: "watchwords",
    label: { sv: "Bevakningsordsmärkning", en: "Watchword marking" },
    what: {
      sv: "Markerar text i dokument utifrån bevakningsordstabellen, så att särskilt utvalda yrkanden — till exempel sådana som identifierats vid en partsträff — syns direkt i protokollet.",
      en: "Marks text in documents from the watchword table, so that particularly selected demands — for instance those identified at a party meeting — are visible directly in the protocol.",
    },
    ask: {
      sv: "Markera bevakningsord i dokumentet",
      en: "Mark watchwords in the document",
    },
    where: {
      sv: "I protokollvyn, och tabellen underhålls under Administration",
      en: "In the protocol view, and the table is maintained under Administration",
    },
    requirements: ["FAI-004"],
    routes: ["/registrera", "/partstraffar", "/administration"],
    anchor: "#steg-protokoll",
    nav: "avtal",
    href: "/administration",
  },
  {
    id: "field-extraction",
    label: {
      sv: "AI-stöd vid huvud- och avtalsinformationsregistrering",
      en: "AI support during head and agreement-information registration",
    },
    what: {
      sv: "Söker i protokollet efter specifika skrivningar — jämställdhet, arbetstidsförkortning eller andra utpekade bestämmelser — och föreslår dem för registrering. Varje förslag pekar tillbaka på stycket det lästes ur.",
      en: "Searches the protocol for specific wordings — gender equality, working time reduction or other designated provisions — and proposes them for registration. Every proposal points back to the passage it was read from.",
    },
    ask: {
      sv: "Sök efter utpekade skrivningar i protokollet",
      en: "Search the protocol for designated wordings",
    },
    where: { sv: "Steg 4 i Registrera avtalsprotokoll", en: "Step 4 of Register agreement protocol" },
    requirements: ["FAI-001", "FAI-002", "FA-011"],
    routes: ["/registrera"],
    anchor: "#steg-fritext",
    nav: "avtal",
    href: "/registrera",
  },
  {
    id: "mediation-support",
    label: { sv: "Beslutsstöd i medlingsärenden", en: "Decision support in mediation cases" },
    what: {
      sv: "Vid inkommet generaldirektörsbeslut redovisas övriga parter på avtalsområdet, tidigare medlingar och eventuella spridningsrisker ur det MIIS redan känner till.",
      en: "On an incoming Director-General decision, the other parties in the agreement area, previous mediations and any contagion risks are set out from what MIIS already holds.",
    },
    ask: {
      sv: "Ta fram beslutsstöd för ärendet",
      en: "Draw up decision support for the case",
    },
    where: { sv: "På medlingsärendet", en: "On the mediation case" },
    requirements: ["FF-006", "FF-008"],
    routes: ["/medling"],
    anchor: "#beslutsstod",
    nav: "medling",
    href: "/medling",
  },
] as const;

/**
 * What the AI support does **not** do, in MI's own words.
 *
 * This is the half a competitor's demo will not have. §4.1 is explicit about
 * both limits, and an authority procuring AI is buying the limits as much as
 * the capability: a case officer who cannot see where the machine stops has no
 * way to supervise it.
 */
export interface AiBoundary {
  id: string;
  statement: Text;
  requirements: readonly string[];
}

export const AI_BOUNDARIES: readonly AiBoundary[] = [
  {
    id: "manual-approval",
    statement: {
      sv: "Ingenting sparas automatiskt. Varje förslag granskas och godkänns av en handläggare först, och både förslaget och handläggarens ändring hamnar i ändringsloggen.",
      en: "Nothing is saved automatically. Every proposal is reviewed and approved by a case officer first, and both the proposal and the officer's change land in the change log.",
    },
    requirements: ["FAI-002", "FH-001"],
  },
  {
    id: "new-agreements-manual",
    statement: {
      sv: "Helt nya avtal — sådana som inte tecknats tidigare — registreras alltid manuellt. AI-stödet föreslår bara mot avtal som redan finns.",
      en: "Entirely new agreements — ones not previously signed — are always registered manually. The AI support only proposes against agreements that already exist.",
    },
    requirements: ["FAI-001"],
  },
  {
    id: "no-analysis",
    statement: {
      sv: "AI-stödet gör inga bedömningar. Det tolkar och föreslår; det värderar inte ett avtal, rangordnar inte parter och skriver inte statistik eller rapporter.",
      en: "The AI support makes no assessments. It interprets and proposes; it does not judge an agreement, rank parties, or write statistics or reports.",
    },
    requirements: ["FAI-002"],
  },
] as const;

/** One AI function resolved into the reader's language. */
export interface AiFunctionInfo {
  id: AiFunctionId;
  label: string;
  what: string;
  ask: string;
  where: string;
  requirements: readonly string[];
  href: string;
  anchor?: string;
  nav: NavId;
}

export function aiFunctionInfo(
  definition: AiFunctionDefinition,
  lang: Lang = DEFAULT_LANG,
): AiFunctionInfo {
  return {
    id: definition.id,
    label: definition.label[lang],
    what: definition.what[lang],
    ask: definition.ask[lang],
    where: definition.where[lang],
    requirements: definition.requirements,
    href: definition.href,
    ...(definition.anchor ? { anchor: definition.anchor } : {}),
    nav: definition.nav,
  };
}

/**
 * Where the drawer's task button should go.
 *
 * On the screen the function runs on, the region on that page; anywhere else,
 * the screen. A button that navigates to the route it is already on is a
 * control that does nothing, and three of them side by side is why the
 * assistant was hard to place on a first visit.
 */
export function aiTaskHref(
  fn: { href: string; anchor?: string },
  pathname: string,
): string {
  if (!fn.anchor) return fn.href;
  return pathname === fn.href ? fn.anchor : `${fn.href}${fn.anchor}`;
}

/**
 * The AI functions that run on a given screen.
 *
 * Prefix matching, so `/medling/M-2027-12` inherits `/medling`. The root route
 * is compared exactly — otherwise `/` would prefix-match everything and the
 * start page would claim all four.
 */
export function aiFunctionsForPath(pathname: string): readonly AiFunctionDefinition[] {
  return AI_FUNCTIONS.filter((f) =>
    f.routes.some((route) => pathname === route || pathname.startsWith(`${route}/`)),
  );
}

/**
 * Whether this role may act on an AI proposal — NFÅ-003, applied to the AI.
 *
 * Approving a proposal writes to a register, so the answer is the same one the
 * screen guard gives: a role with read access to Avtal sees what the AI found
 * and cannot approve it. The statistics user is the case that matters — §3.1
 * gives them "läsa, datauttag", and an assistant that offered them an Approve
 * button would contradict the authorisation matrix two screens away.
 */
export function mayReviewAi(role: Pick<RoleDefinition, "nav" | "write">): boolean {
  return AI_FUNCTIONS.some((f) => accessLevel(role, f.nav) === "write");
}

/** The AI functions this role may reach at all (read or write). */
export function aiFunctionsForRole(
  role: Pick<RoleDefinition, "nav" | "write">,
): readonly AiFunctionDefinition[] {
  return AI_FUNCTIONS.filter((f) => accessLevel(role, f.nav) !== "none");
}

/**
 * Something the AI has proposed that no officer has approved yet.
 *
 * FAI-002 says nothing is saved without review, which means there is always a
 * set of things waiting to be reviewed — and until now nowhere to see it. The
 * queue is that set, across the whole system rather than per screen, because
 * "what is the machine waiting on me for" is a question about the officer's
 * day, not about the tab they happen to have open.
 */
export interface AiQueueItem {
  id: string;
  functionId: AiFunctionId;
  /** What the proposals concern — an agreement, a mediation case. */
  subject: Text;
  detail: Text;
  href: string;
  /** How many proposals on that subject are unreviewed. */
  proposals: number;
  /** The menu item that owns it, so the queue obeys NFÅ-003 too. */
  nav: NavId;
}

/**
 * The queue as this role may act on it — NFÅ-003 again, on the aggregate view.
 *
 * **Write access, not read.** The panel is headed "waiting for *your* review",
 * and a mediation administrator can read the agreement register without being
 * the person who approves a protocol registration in it. Filtering on read
 * access put every officer's work in front of every other officer, which is a
 * queue nobody can clear and therefore a queue nobody trusts.
 */
export function visibleQueue(
  queue: readonly AiQueueItem[],
  role: Pick<RoleDefinition, "nav" | "write">,
): readonly AiQueueItem[] {
  return queue.filter((item) => accessLevel(role, item.nav) === "write");
}

export function queueTotal(queue: readonly AiQueueItem[]): number {
  return queue.reduce((sum, item) => sum + item.proposals, 0);
}
