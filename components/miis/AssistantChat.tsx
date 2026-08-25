"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  answerFor,
  ASSISTANT_INTENTS,
  type AssistantAnswer,
  type AssistantFacts,
} from "@/lib/domain/assistant";
import type { Lang } from "@/lib/domain/lang";
import type { NavId } from "@/lib/domain/nav";
import { accessLevel, type RoleInfo } from "@/lib/domain/role";
import { dictionary } from "@/lib/i18n";
import {
  IconAi,
  IconCheck,
  IconChevronDown,
  IconClose,
  IconFlag,
  IconForward,
} from "./icons";
import { Badge, Button, TextField } from "./primitives";

/**
 * Asking MIIS a question, as a conversation.
 *
 * **Every answer is still a query MIIS could already run** — a sentence, the
 * rows it counted, and a way to the screen they live on. Nothing is composed,
 * nothing is stored, and nothing here writes. That has not changed and is the
 * point; what changed is that it now *reads* as an exchange rather than as a
 * form that replaces its own output.
 *
 * Three things were wrong with the form version, and all three were reported
 * as "this is not a conversation":
 *
 * - **The composer was at the top.** Every new answer appeared below the
 *   previous one and the input stayed where it was, so the thing you type into
 *   drifted further from the thing you just read. It is at the bottom now, the
 *   way every message interface has been for twenty years, and the transcript
 *   scrolls to the newest turn.
 * - **Question and answer looked alike.** One was grey helper text above a
 *   tinted box. Two speakers need two shapes: the officer's turn is a plain
 *   bubble on the right, the machine's is a bordered compartment on the left
 *   with the `AI` letter-mark on it.
 * - **Question and answer were the same distance from the box.** The suggestions
 *   now sit in a disclosure directly above the composer, open until the first
 *   question and reopenable for good — see `Suggestions` below.
 *
 * **The violet frames, it does not tint.** The answer's rows are MI's own
 * register entries being read back, so they sit on card the way they do
 * everywhere else; the compartment around them is what says a machine
 * assembled the selection.
 *
 * The feedback row is **not** FAI-002's approve and reject, and is worded so it
 * cannot be mistaken for it. FAI-002 governs proposals that will be *saved* —
 * those live in the four functions and keep *Godkänn* and *Avvisa*. Nothing
 * here is saved, so what is being rated is whether the assistant understood the
 * question. Keeping the two vocabularies apart is deliberate: an approve
 * control on a read-only answer would make the guarantee meaningless by
 * spending its words on something that never needed one.
 */

/** How many rows an answer shows before it says how many more there are. */
const ROWS_SHOWN = 6;

/**
 * The questions on offer — the whole set, always.
 *
 * Not `Chip`. A chip's toggle shape carries a `+`, which says *add this to a
 * set* — a filter, a party, an option — and these are none of those: pressing
 * one asks a question and the question is then over. They are also long, and a
 * row of pills that each wrap to two lines is not a row. A left-aligned list of
 * quiet buttons is what a menu of questions looks like.
 *
 * **A used question is not removed.** It was, on the reasoning that pressing it
 * twice produces an identical second bubble — which is true and is the wrong
 * trade. These five are the fastest route to the five things the assistant can
 * answer, and an officer comes back to *"vilka registreringar är
 * ofullständiga"* every morning; taking it away after one press is taking away
 * the shortcut precisely at the moment it has been shown to be useful. It is
 * marked *Ställd* instead, which answers "have I already asked this" without
 * answering "may I ask it again" for them.
 */
function Suggestions({
  intents,
  asked,
  lang,
  onAsk,
}: {
  intents: readonly { id: string; example: Record<Lang, string> }[];
  /** Which have been used this session — a mark, not a removal. */
  asked: readonly string[];
  lang: Lang;
  onAsk: (text: string, from: string) => void;
}) {
  const t = dictionary(lang).ai.chat;
  if (intents.length === 0) return null;
  return (
    <ul className="space-y-2">
      {intents.map((intent) => (
        <li key={intent.id}>
          <button
            type="button"
            onClick={() => onAsk(intent.example[lang], intent.id)}
            className="flex min-h-11 w-full items-center justify-between gap-3 rounded-sm border-2 border-input bg-card px-3 py-2 text-left text-table font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            <span className="min-w-0">{intent.example[lang]}</span>
            <span className="flex shrink-0 items-center gap-2">
              {asked.includes(intent.id) && (
                <span className="mi-kicker text-muted-foreground">{t.asked}</span>
              )}
              <span aria-hidden className="text-primary">
                <IconForward />
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

type Verdict = "good" | "bad" | "reported";

interface Turn {
  id: number;
  question: string;
  answer: AssistantAnswer;
  /** Which intent produced it, so its suggestion can be spent. */
  from?: string;
  verdict?: Verdict;
}

export function AssistantChat({
  lang,
  role,
  facts,
  onNavigate,
}: {
  lang: Lang;
  role: RoleInfo;
  facts: AssistantFacts;
  /** The drawer describes the screen behind it, so following a row closes it. */
  onNavigate: () => void;
}) {
  const d = dictionary(lang);
  const t = d.ai.chat;
  const nav = d.nav;

  const [question, setQuestion] = useState("");
  /*
    The whole exchange, not the last answer. An officer comparing "what is
    incomplete" with "what is unpublished" needs both on screen; replacing one
    with the other made it unclear that anything had happened at all.

    The thread belongs to the open panel. Nothing is stored, and the footer says
    so — a system that kept an officer's questions would be keeping a record MI
    never asked for, on the one surface in MIIS that has no register behind it.
  */
  const [thread, setThread] = useState<Turn[]>([]);
  /* Which have been used — for the mark on them, not for removing them. */
  const [asked, setAsked] = useState<string[]>([]);
  /*
    Open until the first question, then out of the way — and reopenable.

    The list is 260px of a 512px panel, which is the right trade before there
    is a transcript and the wrong one after. Collapsing rather than removing is
    what keeps the shortcut: the control that reopens it says how many there
    are and sits directly above the box it fills.
  */
  const [showSuggestions, setShowSuggestions] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  /* Only the questions this role could actually be answered — offering one that
     is refused the moment it is pressed is a control that looks live and is
     not. */
  const suggestions = ASSISTANT_INTENTS.filter(
    (i) => i.id !== "capabilities" && accessLevel(role, i.nav) !== "none",
  );


  /* The newest turn, not the top of the thread. Scrolling the transcript rather
     than the panel, so the composer below it never moves. */
  useEffect(() => {
    if (thread.length === 0) return;
    endRef.current?.scrollIntoView({ block: "end" });
  }, [thread.length]);

  function ask(text: string, from?: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setQuestion("");
    setShowSuggestions(false);
    if (from) setAsked((a) => (a.includes(from) ? a : [...a, from]));
    const answer = answerFor(
      trimmed,
      facts,
      role,
      lang,
      {
        refused: t.refused,
        none: t.none,
        found: t.found,
        unmatched: t.unmatched,
        capabilities: t.capabilities,
        what: {
          expiring: t.what.expiring,
          incomplete: t.what.incomplete,
          unpublished: t.what.unpublished,
          mediations: t.what.mediations,
          benchmark: t.what.benchmark,
          "find-agreement": t.what.agreements,
          capabilities: t.what.capabilities,
        },
      },
      (id: NavId) => nav[id],
    );
    setThread((prev) => [...prev, { id: prev.length, question: trimmed, answer, from }]);
  }

  function rate(id: number, verdict: Verdict) {
    setThread((prev) => prev.map((turn) => (turn.id === id ? { ...turn, verdict } : turn)));
  }

  return (
    /*
      A column that fills the drawer: the transcript scrolls, the composer does
      not. `min-h-0` is what lets the middle child shrink — without it a flex
      child defaults to its content height and the composer is pushed off the
      bottom of the panel as the thread grows.
    */
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        {thread.length === 0 ? (
          /*
            Bottom-aligned, because the suggestions and the box are below it.
            Left at the top of a `flex-1` region it sat alone above 400px of
            white with the list it introduces below the fold of the eye — one
            block of reading broken in two by empty space.
          */
          <div className="flex h-full flex-col justify-end py-2">
            <p className="text-table">{t.openingLead}</p>
          </div>
        ) : (
          <div className="space-y-4" aria-live="polite">
            {thread.map((turn) => (
              <div key={turn.id} className="space-y-2">
                {/*
                  The officer's turn, on the right. A plain tinted bubble — no
                  avatar, no name: there is one person in this conversation and
                  labelling them is furniture.
                */}
                <div className="flex justify-end">
                  <p className="max-w-[85%] rounded-md rounded-br-none bg-secondary px-3 py-2 text-table text-secondary-foreground">
                    {turn.question}
                  </p>
                </div>

                {/*
                  The machine's turn: a compartment, framed in violet and marked
                  `AI`. The band carries the mark; the answer sits on card
                  beneath it, because what is inside is MI's own register.
                */}
                <div className="max-w-[92%] overflow-hidden rounded-md rounded-bl-none border-2 border-ai-border bg-card">
                  <div className="flex flex-wrap items-center gap-2 border-b border-ai-border bg-ai px-3 py-1.5">
                    <span
                      aria-hidden
                      className="mi-kicker inline-flex items-center gap-1 text-ai-foreground"
                    >
                      <IconAi size="sm" />
                      {d.common.aiMark}
                    </span>
                    {turn.answer.refused && <Badge tone="attention">{t.notAuthorised}</Badge>}
                  </div>

                  <div className="px-3 py-3">
                    <p className="text-table">{turn.answer.summary}</p>

                    {/*
                      *What can I ask about* answers with the questions
                      themselves, pressable. A bulleted list of sentences the
                      officer then has to retype is a help page pretending to
                      be an answer.
                    */}
                    {turn.answer.intent === "capabilities" && (
                      <div className="mt-3">
                        <Suggestions
                          intents={suggestions}
                          asked={asked}
                          lang={lang}
                          onAsk={ask}
                        />
                      </div>
                    )}

                    {turn.answer.rows.length > 0 && (
                      <ul className="mt-3 divide-y divide-border border-t border-border">
                        {turn.answer.rows.slice(0, ROWS_SHOWN).map((row) => (
                          <li key={row.key} className="py-2">
                            {row.href ? (
                              <Link
                                href={row.href}
                                onClick={onNavigate}
                                className="font-semibold text-primary underline underline-offset-2"
                              >
                                {row.label}
                              </Link>
                            ) : (
                              <span className="font-semibold">{row.label}</span>
                            )}
                            {row.detail && (
                              <span className="block text-label text-muted-foreground">
                                {row.detail}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/*
                      The register, and only when the answer was cut short.

                      Every row already opens its own record, so a second link
                      to "the full answer" beside six rows that are all visible
                      pointed at nothing the officer could not already reach —
                      it read as a duplicate of the thing above it, and it was.
                      It earns its place in exactly one case: more rows matched
                      than fit. Then it says how many and names the register
                      they are in, rather than describing itself.
                    */}
                    {turn.answer.rows.length > ROWS_SHOWN && turn.answer.href && (
                      <div className="mt-3 border-t border-border pt-3">
                        <p className="mb-2 text-label text-muted-foreground">
                          {d.common.showingOf(ROWS_SHOWN, turn.answer.rows.length)}
                        </p>
                        <Link
                          href={turn.answer.href}
                          onClick={onNavigate}
                          className="inline-flex min-h-11 items-center gap-2 text-label font-bold text-primary underline underline-offset-2"
                        >
                          {t.seeAllIn(nav[intentNav(turn.answer.intent)])}
                          <IconForward />
                        </Link>
                      </div>
                    )}

                    {/*
                      Was that the right answer? Not "do you approve of it".

                      The words are kept away from FAI-002's on purpose — see
                      the note at the top of this file. This rates the match
                      between a typed question and the query the assistant chose
                      to run, which is the one part of the exchange a machine
                      actually decided.
                    */}
                    <div className="mt-3 border-t border-border pt-2">
                      {turn.verdict ? (
                        <p className="text-label text-muted-foreground">
                          {turn.verdict === "reported" ? t.feedback.reported : t.feedback.thanks}
                        </p>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="basis-full text-label text-muted-foreground">
                            {t.feedback.prompt}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => rate(turn.id, "good")}
                            iconStart={<IconCheck />}
                          >
                            {t.feedback.good}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => rate(turn.id, "bad")}
                            iconStart={<IconClose />}
                          >
                            {t.feedback.bad}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => rate(turn.id, "reported")}
                            iconStart={<IconFlag />}
                          >
                            {t.feedback.report}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {/*
        The composer, pinned. Suggestions sit directly above the box they fill,
        so pressing one and typing one are visibly the same act — they were at
        the top of the panel, four scroll-lengths from the transcript they
        produced.
      */}
      <div className="shrink-0 border-t border-border bg-card px-5 py-3">
        {/*
          One place for the suggestions, directly above the box they fill, and
          reachable at every point in the conversation. They used to sit in the
          empty state and then be gone for good — so the fastest route to the
          five answers the assistant has existed only until the officer used it
          once.
        */}
        <div className="mb-3">
          <button
            type="button"
            onClick={() => setShowSuggestions((v) => !v)}
            aria-expanded={showSuggestions}
            aria-controls="ai-suggestions"
            className="flex min-h-11 w-full items-center justify-between gap-3 text-left text-label font-bold text-primary"
          >
            {t.suggestions(suggestions.length)}
            <span
              aria-hidden
              className={`flex h-5 items-center transition-transform ${
                showSuggestions ? "rotate-180" : ""
              }`}
            >
              <IconChevronDown />
            </span>
          </button>
          <div id="ai-suggestions" className={showSuggestions ? "pt-2" : "hidden"}>
            <Suggestions intents={suggestions} asked={asked} lang={lang} onAsk={ask} />
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(question);
          }}
          className="flex flex-wrap items-end gap-2"
        >
          <div className="min-w-0 flex-1">
            <TextField
              id="ai-question"
              label={t.label}
              width="full"
              value={question}
              onChange={setQuestion}
              placeholder={t.placeholder}
            />
          </div>
          <Button type="submit" disabled={!question.trim()} disabledReason={t.empty}>
            {t.ask}
          </Button>
        </form>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-meta text-muted-foreground">{t.notStored}</p>
          {thread.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setThread([]);
                setAsked([]);
                setShowSuggestions(true);
              }}
            >
              {t.clear}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/** The menu item an answer belongs to, for naming the register in the link. */
function intentNav(intent: AssistantAnswer["intent"]): NavId {
  return ASSISTANT_INTENTS.find((i) => i.id === intent)?.nav ?? "avtal";
}
