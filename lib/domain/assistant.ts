/**
 * Asking MIIS a question in plain language.
 *
 * The AI drawer offered §4.1's four functions as controls and nothing to type
 * into, and the objection to that was fair: an officer with a question in their
 * head has to translate it into a screen before the system will help. This is
 * the translation, done by the system.
 *
 * **What it is not.** It does not generate prose, it does not reason about
 * collective agreements, and it never answers from anything but the register.
 * Every answer is a query MIIS could already run, expressed as a sentence and a
 * list of rows that link to the screen the answer lives on. That is a deliberate
 * limit rather than a missing feature:
 *
 * - **An authority cannot publish an answer it cannot account for.** An assistant
 *   that composed an answer about a collective agreement would be a new source
 *   of statements about the labour market, with no register behind it and no
 *   change log. Every row below comes from a record an officer can open.
 * - **FAI-002 is a guarantee about review**, and it only means something where
 *   there is a defined proposal to review. Asking is reading, so nothing here
 *   writes; the four functions that *do* write keep their approve and reject.
 * - **NFÅ-003 does not stop applying because the question was typed.** Each
 *   intent names the menu item that owns its answer, and a role without access
 *   to that screen is told so rather than shown the data.
 *
 * When nothing matches, it says so and lists what it can answer. An assistant
 * that guesses at an unmatched question is worse than one that admits the
 * boundary, because the officer cannot tell the two cases apart.
 *
 * Pure domain — no React, no data access, no I/O.
 */

import type { Lang, Text } from "./lang";
import type { NavId } from "./nav";
import { accessLevel, type RoleDefinition } from "./role";

export type AssistantIntentId =
  | "expiring"
  | "incomplete"
  | "unpublished"
  | "mediations"
  | "benchmark"
  | "find-agreement"
  | "capabilities";

export interface AssistantIntent {
  id: AssistantIntentId;
  /**
   * The words that select this intent, lower-case.
   *
   * Deliberately a word list rather than a model. The set of questions MIIS can
   * answer is closed — it is the set of queries the register supports — so the
   * matching only has to be good enough to route a question to the right one,
   * and a word list is inspectable, testable and cannot drift.
   */
  triggers: Record<Lang, readonly string[]>;
  /** An example, shown as a suggestion so the officer does not face a blank box. */
  example: Text;
  /** The menu item that owns the answer — NFÅ-003 applies to asking too. */
  nav: NavId;
  /** Where the full answer lives. */
  href: string;
  /**
   * Matched only after every specific intent has failed.
   *
   * *"Vilka avtal löper ut inom 90 dagar?"* contains *"vilket avtal"*'s cousin
   * and would otherwise be answered by the free-text find, which would return
   * every agreement whose name contains the rest of the sentence — a plausible
   * answer to a question nobody asked. Specific first, general last.
   */
  fallback?: boolean;
}

export const ASSISTANT_INTENTS: readonly AssistantIntent[] = [
  {
    id: "expiring",
    triggers: {
      sv: ["löper ut", "utlöp", "upphör", "går ut", "förfaller", "snart slut"],
      en: ["expire", "expiring", "run out", "ends soon", "due"],
    },
    example: {
      sv: "Vilka avtal löper ut inom 90 dagar?",
      en: "Which agreements expire within 90 days?",
    },
    nav: "avtal",
    href: "/avtal",
  },
  {
    id: "incomplete",
    triggers: {
      sv: ["ofullständig", "halvfärdig", "inte klar", "oavslutad", "påbörjad"],
      en: ["incomplete", "unfinished", "not complete", "half"],
    },
    example: {
      sv: "Vilka registreringar är ofullständiga?",
      en: "Which registrations are incomplete?",
    },
    nav: "avtal",
    href: "/avtal",
  },
  {
    id: "unpublished",
    triggers: {
      sv: ["opublicerad", "inte publicerad", "publicera", "publicering"],
      en: ["unpublished", "not published", "publish", "publication"],
    },
    example: {
      sv: "Vilka avtal är klara men inte publicerade?",
      en: "Which agreements are complete but not published?",
    },
    nav: "avtal",
    href: "/avtal",
  },
  {
    id: "mediations",
    triggers: {
      sv: ["medling", "medlingsärende", "pågående ärende", "konflikt"],
      en: ["mediation", "mediation case", "ongoing case", "dispute"],
    },
    example: {
      sv: "Vilka medlingsärenden pågår?",
      en: "Which mediation cases are ongoing?",
    },
    nav: "medling",
    href: "/medling",
  },
  {
    id: "benchmark",
    triggers: {
      sv: ["märket", "kostnadsram", "norm", "industrimärke"],
      en: ["märket", "benchmark", "cost frame", "norm"],
    },
    example: {
      sv: "Vad är Märket den här avtalsrörelsen?",
      en: "What is Märket this bargaining round?",
    },
    nav: "market",
    href: "/market",
  },
  {
    id: "find-agreement",
    triggers: {
      sv: ["hitta", "sök", "visa avtal", "vilket avtal", "finns det avtal", "avtal om", "avtal för"],
      en: ["find", "search", "show agreement", "which agreement", "is there an agreement"],
    },
    example: {
      sv: "Hitta avtalet för Teknikföretagen",
      en: "Find the agreement for Teknikföretagen",
    },
    nav: "avtal",
    href: "/avtal",
    fallback: true,
  },
  {
    id: "capabilities",
    triggers: {
      sv: ["vad kan du", "vad kan jag fråga", "hjälp", "vad går att fråga", "vilka frågor"],
      en: ["what can you", "help", "what can i ask", "which questions"],
    },
    example: { sv: "Vad kan jag fråga om?", en: "What can I ask about?" },
    nav: "start",
    href: "/",
    fallback: true,
  },
];

/**
 * Which intent a question is asking for, or null.
 *
 * Two passes: the specific intents first, then the fallbacks. Within a pass,
 * longest trigger first, so *"inte publicerad"* is not swallowed by
 * *"publicera"*. Null is a real and useful answer — see the note at the top of
 * this file about why guessing is worse.
 */
export function matchIntent(question: string, lang: Lang): AssistantIntentId | null {
  const q = question.trim().toLocaleLowerCase("sv");
  if (!q) return null;

  const pass = (intents: readonly AssistantIntent[]) =>
    intents
      .flatMap((intent) => intent.triggers[lang].map((trigger) => ({ id: intent.id, trigger })))
      .sort((a, b) => b.trigger.length - a.trigger.length)
      .find((c) => q.includes(c.trigger))?.id;

  return (
    pass(ASSISTANT_INTENTS.filter((i) => !i.fallback)) ??
    pass(ASSISTANT_INTENTS.filter((i) => i.fallback)) ??
    null
  );
}

/** What the assistant may read from, already narrowed by the data layer. */
export interface AssistantRow {
  key: string;
  label: string;
  detail?: string;
  href?: string;
}

export interface AssistantFacts {
  expiring: readonly AssistantRow[];
  incomplete: readonly AssistantRow[];
  unpublished: readonly AssistantRow[];
  mediations: readonly AssistantRow[];
  benchmark: readonly AssistantRow[];
  /** The whole register, for the free-text find. */
  agreements: readonly AssistantRow[];
}

export interface AssistantAnswer {
  intent: AssistantIntentId | null;
  /** The sentence. Always states where the answer came from. */
  summary: string;
  rows: readonly AssistantRow[];
  /** The screen the full answer lives on, when there is one. */
  href?: string;
  /** True when the role may not read the register this answer comes from. */
  refused?: boolean;
}

/** The words an answer is built from — the component supplies the dictionary. */
export interface AssistantCopy {
  refused: (screen: string) => string;
  none: (what: string) => string;
  found: (n: number, what: string) => string;
  unmatched: string;
  capabilities: string;
  /**
   * What was counted, in both numbers.
   *
   * Swedish inflects the noun *and* the adjective with the count — *1 pågående
   * medlingsärende* against *3 pågående medlingsärenden* — so a single plural
   * string produces a sentence that is wrong exactly when the answer is one
   * row, which is the most common answer.
   */
  what: Record<AssistantIntentId, { one: string; many: string }>;
}

/**
 * The name a free-text find is looking for.
 *
 * Everything after the trigger word, which is how the question is actually
 * shaped — *"hitta avtalet för Teknikföretagen"* carries its subject at the
 * end. Falls back to the whole question, so a bare *"Teknikföretagen"* works.
 */
export function findTerm(question: string, lang: Lang): string {
  const q = question.trim();
  const lower = q.toLocaleLowerCase("sv");
  const intent = ASSISTANT_INTENTS.find((i) => i.id === "find-agreement")!;
  const hit = intent.triggers[lang]
    .map((trigger) => ({ trigger, at: lower.lastIndexOf(trigger) }))
    .filter((x) => x.at >= 0)
    .sort((a, b) => b.at - a.at)[0];
  if (!hit) return q;
  /* Swedish puts a stack of small words between the verb and the subject —
     "hitta *avtalet för* Teknikföretagen" — so they come off one at a time
     rather than once. */
  let rest = q.slice(hit.at + hit.trigger.length).replace(/^[\s:,]+/, "");
  let previous = "";
  while (rest !== previous) {
    previous = rest;
    rest = rest.replace(/^(?:avtalet|avtalen|avtal|för|om|med|the|for|about)\s+/i, "");
  }
  return rest.replace(/[?.!]+$/, "").trim();
}

export function answerFor(
  question: string,
  facts: AssistantFacts,
  role: Pick<RoleDefinition, "nav" | "write">,
  lang: Lang,
  copy: AssistantCopy,
  screenName: (nav: NavId) => string,
): AssistantAnswer {
  const id = matchIntent(question, lang);
  if (!id) return { intent: null, summary: copy.unmatched, rows: [] };

  const intent = ASSISTANT_INTENTS.find((i) => i.id === id)!;

  if (id === "capabilities") {
    return { intent: id, summary: copy.capabilities, rows: [] };
  }

  /* NFÅ-003. Asking is reading, and reading is still authorised per screen. */
  if (accessLevel(role, intent.nav) === "none") {
    return {
      intent: id,
      summary: copy.refused(screenName(intent.nav)),
      rows: [],
      refused: true,
    };
  }

  const rows =
    id === "find-agreement"
      ? matchAgreements(facts.agreements, findTerm(question, lang))
      : facts[id];

  const forms = copy.what[id];
  return {
    intent: id,
    summary:
      rows.length === 0
        ? copy.none(forms.many)
        : copy.found(rows.length, rows.length === 1 ? forms.one : forms.many),
    rows,
    href: intent.href,
  };
}

/** Substring over the label and the detail — the two things a row shows. */
export function matchAgreements(
  agreements: readonly AssistantRow[],
  term: string,
): AssistantRow[] {
  const q = term.trim().toLocaleLowerCase("sv");
  if (q.length < 2) return [];
  return agreements.filter((a) =>
    `${a.label} ${a.detail ?? ""}`.toLocaleLowerCase("sv").includes(q),
  );
}
