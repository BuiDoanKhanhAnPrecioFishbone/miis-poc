"use client";

import Link from "next/link";
import { useState } from "react";

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
import { IconForward } from "./icons";
import { Badge, Button, Chip, Rationale, TextField } from "./primitives";

/**
 * Asking MIIS a question, and getting the register back.
 *
 * The objection this answers is a fair one: the drawer offered four functions
 * as controls, and an officer with a question in their head had to work out
 * which screen answered it before the system would help. That translation is
 * the system's job.
 *
 * **Every answer is a query MIIS could already run** — a sentence, the rows it
 * counted, and a link to the screen they live on. Nothing is composed. That is
 * the whole design, and the two things it protects are worth stating:
 *
 * - An authority cannot publish an answer it cannot account for. A reply
 *   *written* about a collective agreement would be a new statement about the
 *   labour market with no record behind it; every row here opens a record.
 * - Asking is reading, so nothing here writes. The four functions that do write
 *   keep their approve and reject, which is where FAI-002's guarantee lives.
 *
 * Authorisation still applies: a question about a register the role may not
 * read is refused with the reason, not answered. The assistant must not be the
 * way around the menu.
 *
 * The suggestions exist because a blank box on a screen an officer meets once a
 * week is a box they do not use — and they are the intents' own examples, so
 * each one demonstrably returns what it says it will.
 */
/** How many rows an answer shows before it says how many more there are. */
const ROWS_SHOWN = 6;

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
    The whole exchange, not the last answer.
    
    Replacing it meant an officer comparing "what is incomplete" with "what is
    unpublished" had to ask the first one again to see it — and the second
    answer arrived where the first had been, so it was not obvious anything had
    changed. The thread is the session's; nothing is stored, and the panel says
    so, because a system that kept an officer's questions would be keeping a
    record MI never asked for.
  */
  const [thread, setThread] = useState<{ id: number; question: string; answer: AssistantAnswer }[]>(
    [],
  );

  /* Only the questions this role could actually be answered — offering one that
     is refused the moment it is pressed is a control that looks live and is
     not. */
  const suggestions = ASSISTANT_INTENTS.filter(
    (i) => i.id !== "capabilities" && accessLevel(role, i.nav) !== "none",
  );

  function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setQuestion("");
    const answer = answerFor(trimmed, facts, role, lang, {
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
      }, (id: NavId) => nav[id]);
    setThread((t) => [...t, { id: t.length, question: trimmed, answer }]);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end gap-2">
        <TextField
          id="ai-question"
          label={t.label}
          width="full"
          value={question}
          onChange={setQuestion}
          placeholder={t.placeholder}
        />
        <Button onClick={() => ask(question)} disabled={!question.trim()} disabledReason={t.empty}>
          {t.ask}
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((intent) => (
          <Chip key={intent.id} onToggle={() => ask(intent.example[lang])}>
            {intent.example[lang]}
          </Chip>
        ))}
      </div>

      {thread.length > 0 && (
        <div className="mt-4 space-y-4" aria-live="polite">
          {thread.map((turn) => (
            <div key={turn.id} className="space-y-2">
              {/* What was asked, above the answer to it — a thread of two
                  questions is unreadable if only the answers are kept. */}
              <p className="text-label text-muted-foreground">{t.youAsked(turn.question)}</p>

              <div className="rounded-md border-2 border-ai-border bg-ai p-3">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge tone="ai">{d.common.aiMark}</Badge>
                  {turn.answer.refused && <Badge tone="attention">{t.notAuthorised}</Badge>}
                </div>
                <p className="text-table text-ai-foreground">{turn.answer.summary}</p>

                {turn.answer.intent === "capabilities" && (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-table text-ai-foreground">
                    {suggestions.map((intent) => (
                      <li key={intent.id}>{intent.example[lang]}</li>
                    ))}
                  </ul>
                )}

                {turn.answer.rows.length > 0 && (
                  <ul className="mt-3 divide-y divide-ai-border">
                    {turn.answer.rows.slice(0, ROWS_SHOWN).map((row) => (
                      <li key={row.key} className="py-2 first:pt-0 last:pb-0">
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

                {turn.answer.rows.length > ROWS_SHOWN && (
                  <p className="mt-2 text-label text-muted-foreground">
                    {d.common.showingOf(ROWS_SHOWN, turn.answer.rows.length)}
                  </p>
                )}

                {turn.answer.href && turn.answer.rows.length > 0 && (
                  <div className="mt-3">
                    <Link
                      href={turn.answer.href}
                      onClick={onNavigate}
                      className="inline-flex min-h-11 items-center gap-2 text-label font-bold text-primary underline underline-offset-2"
                    >
                      {t.openScreen} <IconForward />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setThread([])}>
              {t.clear}
            </Button>
            <span className="text-label text-muted-foreground">{t.notStored}</span>
          </div>
        </div>
      )}

      <Rationale>{t.boundedNote}</Rationale>
    </div>
  );
}
