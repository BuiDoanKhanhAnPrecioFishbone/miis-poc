"use client";

import { useState } from "react";

import {
  proposedQuestion,
  searchProtocol,
  SUGGESTED_CLAUSE_TERMS,
  type ProtocolLine,
} from "@/lib/domain/clause-search";
import type { SourceAnchor } from "@/lib/domain/extraction";
import type { Lang } from "@/lib/domain/lang";
import { dictionary } from "@/lib/i18n";
import { IconCheck, IconClose } from "./icons";
import { AiRegion, Badge, Button, Callout, Chip, Rationale, TextField,
  EmptyState,
} from "./primitives";

/**
 * §4.1's third AI function, as the field MI asks for.
 *
 * *"Via **fritextsökning** i protokoll och avtal ska systemet kunna identifiera
 * och föreslå registrering av specifika skrivningar, exempelvis om jämställdhet,
 * arbetstidsförkortning eller andra utpekade bestämmelser … Handläggaren
 * godkänner manuellt innan information sparas."*
 *
 * The prototype named this function in its AI catalogue and never built it; the
 * assistant's task button for it linked to this screen, where there was nothing
 * to type into. **This is the one text input §4.1 asks for**, and it is scoped
 * the way MI scoped it: it searches *this protocol* for a provision, and every
 * hit is a proposal for registration rather than an answer.
 *
 * It is not a chatbot and the difference is not cosmetic. A box that accepts any
 * instruction has no defined output, so nothing about it can be reviewed or
 * approved — and FAI-002 is a guarantee about review. This box has one input
 * (a term), one corpus (the protocol on screen), and one output shape (a
 * *Särskild fråga* in Bilaga 3 §3.11's form: a question, a jämställdhet flag and
 * the *avtalstext*). That is what makes the Approve and Reject on each hit mean
 * something.
 *
 * Inside an `AiRegion`, because everything the AI produces is and nothing else
 * is. Selecting a hit highlights the passage it was read from, which is FAI-001
 * and the reason a heading is never a hit.
 */
export function ClauseSearch({
  lines,
  lang,
  onShowSource,
  activeSource,
}: {
  lines: ProtocolLine[];
  lang: Lang;
  /** FAI-001 — highlight the passage in the protocol pane beside the form. */
  onShowSource: (anchor: SourceAnchor) => void;
  activeSource: SourceAnchor | null;
}) {
  const d = dictionary(lang);
  const t = d.registrera.document.clauseSearch;

  const [term, setTerm] = useState("");
  const [searched, setSearched] = useState<string | null>(null);
  const [registered, setRegistered] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);

  const hits = searched ? searchProtocol(lines, searched) : [];

  function run(next: string) {
    setTerm(next);
    setSearched(next.trim() ? next : null);
  }

  return (
    <AiRegion
      id="steg-fritext"
      title={t.title}
      notice={d.common.aiNotice}
      mark={d.common.aiMark}
      regionLabel={d.common.aiRegionLabel}
      tags={["FAI-001", "FAI-002", "FA-011"]}
    >
      {/*
        *Frivilligt steg*, said before anything else.

        The screen it sits on is a five-step flow with a stepper at the top, and
        this region has a heading, a numbered look and its own controls — so it
        was being read as a sixth step, one the officer had to complete before
        saving. It is not: it runs §4.1's third function on demand, between the
        agreement match above it and the save below, and a registration is
        finished whether or not anyone opens it. The badge says so, and the
        sentence under it says what the step is *for*, which the intro never
        did — it described the mechanism and left the officer to work out when
        they would ever want it.
      */}
      <p className="mb-3">
        <Badge>{t.optional}</Badge>
      </p>
      <p className="mb-2 max-w-4xl text-table">{t.purpose}</p>
      <p className="mb-4 max-w-4xl text-table">{t.intro}</p>

      <div className="flex flex-wrap items-end gap-3">
        <TextField
          id="clause-term"
          label={t.label}
          width="medium"
          value={term}
          onChange={setTerm}
          placeholder={t.placeholder}
        />
        <Button onClick={() => run(term)} disabled={term.trim().length < 2} disabledReason={t.tooShort}>
          {t.search}
        </Button>
      </div>

      {/* MI's own two examples first, so the officer's first search is one the
          requirement names rather than one they had to think of. */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-label text-muted-foreground">{t.suggested}</span>
        {SUGGESTED_CLAUSE_TERMS.map((s) => (
          <Chip key={s} selected={searched === s} pressed={searched === s} onToggle={() => run(s)}>
            {s}
          </Chip>
        ))}
      </div>

      {searched && (
        <div className="mt-5">
          <h3 className="mi-kicker mb-2 text-muted-foreground">{t.results(searched)}</h3>
          {hits.length === 0 ? (
            <EmptyState text={t.noHits(searched)} />
          ) : (
            <ul className="space-y-3">
              {hits.map((hit) => {
                const proposal = proposedQuestion(hit, searched);
                const isRegistered = registered.includes(hit.anchor);
                const isRejected = rejected.includes(hit.anchor);
                return (
                  <li
                    key={hit.anchor}
                    className="rounded-md border-2 border-border bg-card p-3"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="ai">{d.common.aiProposal}</Badge>
                      {hit.genderEquality && <Badge tone="attention">{t.equality}</Badge>}
                    </div>
                    <p className="mt-2 max-w-4xl text-table">{hit.text}</p>
                    <p className="mt-1 text-label text-muted-foreground">
                      {t.wouldRegister(proposal.question)}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {/* FAI-001 — the passage it was read from, in the pane. */}
                      <Button
                        size="sm"
                        variant="secondary"
                        pressed={activeSource === hit.anchor}
                        onClick={() => onShowSource(hit.anchor)}
                      >
                        {t.showSource}
                      </Button>
                      {isRegistered ? (
                        /*
                          Where it went, not just that it went.
                          "Godkänt och registrerat" told the officer the press
                          had landed and nothing about the record it landed in,
                          so the one question the control raises — *where do I
                          find this now* — was the one it did not answer.
                        */
                        <Callout tone="ok" live tags={["FAI-002"]}>
                          {t.registered} {t.registeredWhere}
                        </Callout>
                      ) : isRejected ? (
                        <Callout tone="attention" live tags={["FAI-002"]}>
                          {t.rejected}
                        </Callout>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            iconStart={<IconCheck />}
                            onClick={() => setRegistered((r) => [...r, hit.anchor])}
                          >
                            {d.common.approve}
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            iconStart={<IconClose />}
                            onClick={() => setRejected((r) => [...r, hit.anchor])}
                          >
                            {d.common.reject}
                          </Button>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      <Rationale>{t.boundedNote}</Rationale>
    </AiRegion>
  );
}
