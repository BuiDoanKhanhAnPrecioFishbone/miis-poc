"use client";

import { useState } from "react";

import type { Lang } from "@/lib/domain/lang";
import {
  hasProposal,
  reportIntent,
  searchIntent,
  type ReportIntent,
  type SearchIntent,
} from "@/lib/domain/nl-intent";
import {
  INFO_TYPES,
  searchField,
  valueLabel,
  OPERATOR_LABEL,
  type InfoTypeId,
} from "@/lib/domain/options";
import { REPORTS } from "@/lib/domain/report";
import { dictionary } from "@/lib/i18n";
import { IconCheck, IconClose } from "./icons";
import { AiRegion, Button, Callout, TextField } from "./primitives";

/**
 * Describe what you want; the machine proposes the selection; you approve it.
 *
 * **This is not one of §4.1's four functions**, and the code says so rather than
 * letting it pass as one. Medlingsinstitutet's side asked for it after the four
 * were built, so it is supplier-added value — which changes two things and
 * neither of them is FAI-002. It has to be in the written response, because
 * Bilaga 2 §3.6 forbids adding commitments at the oral presentation. And it
 * keeps *Godkänn* and *Avvisa*, because *"alla förslag som systemet genererar
 * ska granskas och godkännas"* is a rule about proposals rather than about
 * which four functions produced them.
 *
 * **Every proposed row names the words it was read from.** That is the same
 * guarantee the protocol functions give by highlighting the passage a value
 * came from: an officer who thinks the machine misread them can see the word
 * that misled it, rather than being told only that it disagreed.
 *
 * **It selects; it never runs.** On `/sok` approving fills the query builder
 * and the officer still presses the builder's own control; on `/rapporter` it
 * fills the urvalsbild and the officer still presses *Generera rapport*. Bilaga
 * F opens by saying a report is *urvalsbild och resultat*, and a machine that
 * skipped to the result would have skipped the half that is meant to be
 * checked.
 */

const SHELL = "space-y-3";

/** The composer, shared: one field, one control, and the reason it is safe. */
function Composer({
  value,
  onChange,
  onSubmit,
  placeholder,
  label,
  submitLabel,
  hint,
  emptyReason,
  showHint,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder: string;
  label: string;
  submitLabel: string;
  hint: string;
  emptyReason: string;
  /**
   * False once a proposal is on screen.
   *
   * The hint's job is to make someone willing to type — it promises the reading
   * is shown before anything is set. The proposal's own lead promises the same
   * thing, so with both on screen the guarantee appeared twice forty pixels
   * apart. Once the proposal is there the promise has been kept and only the
   * lead is needed.
   */
  showHint: boolean;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {/*
        The control sits on the input's row, and the hint goes under both.

        It was one flex row of field-plus-button with `items-end`, and the field
        carries its own hint — so "end" was the bottom of a two-line hint and the
        button rendered a line and a half below the box it belongs to. A hint is
        guidance for the composer, not for the text box alone, so it spans the
        row rather than sitting inside one column of it.
      */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1">
          <TextField
            id="nl-intent"
            label={label}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            width="full"
          />
        </div>
        {/*
          `emptyReason`, not the hint. The hint says what the composer is for;
          the reason says why this control will not act yet, and they are
          different sentences. Disabled is right here — an officer will
          reasonably press it, and an empty field is the lesson.
        */}
        <Button type="submit" disabled={!value.trim()} disabledReason={emptyReason}>
          {submitLabel}
        </Button>
      </div>
      {showHint && <p className="field-hint mt-2">{hint}</p>}
    </form>
  );
}

/**
 * The longest sentence the composer accepts.
 *
 * Not a validation rule about language — a bound on what a pasted page can do
 * to the layout. Everything the parser fails to place comes back in `unused`
 * and is printed, so a thousand words in makes a thousand words of grey text
 * under the proposal and pushes the approve control off the screen. The example
 * sentences are about sixty characters.
 */
const MAX_INPUT = 200;

/** One proposed criterion and the words behind it. */
function ProposedRow({ name, value, source, from }: {
  name: string;
  value: string;
  /** Absent when the value was assumed rather than read from the sentence. */
  source?: string;
  from: string;
}) {
  return (
    <li className="border-b border-border pb-2 last:border-0">
      <p className="text-table">
        <span className="font-semibold">{name}:</span> {value}
      </p>
      {/* The source link, in words rather than a highlight — there is no
          document here to highlight into, only the officer's own sentence.
          Omitted rather than rendered empty: `Läst ur ””` is a citation of
          nothing, and it appeared whenever a value had no phrase behind it. */}
      {source ? (
        <p className="text-label text-muted-foreground">
          {from} <span className="italic">”{source}”</span>
        </p>
      ) : (
        <p className="text-label text-muted-foreground">{from}</p>
      )}
    </li>
  );
}

/**
 * What approving will overwrite, said before it happens.
 *
 * Approving does not add to the officer's selection — it replaces it, on both
 * screens: the query builder's groups are rebuilt and the report's criteria are
 * reset. An officer who has hand-built `(konstruktion 1 ELLER 2) OCH sektor
 * privat`, then types a sentence to narrow it further, would lose the lot to a
 * control labelled *Godkänn*.
 *
 * FAI-002 puts the decision with the human, and a decision made without knowing
 * the cost is not one. So the cost is on the screen, next to the control, and
 * only when there is something to lose.
 */
function ReplacesNotice({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="mt-3 text-label font-semibold text-foreground">{text}</p>;
}

/* -------------------------------------------------------------------------- */
/* Search                                                                     */
/* -------------------------------------------------------------------------- */

export function SearchIntentAssistant({
  lang,
  conditionCount,
  onApply,
}: {
  lang: Lang;
  /**
   * How many conditions the officer has already built, so the proposal can say
   * what approving costs. Approving replaces the query rather than adding to it.
   */
  conditionCount: number;
  /** Approving hands the builder the register and the criteria to set. */
  onApply: (intent: SearchIntent) => void;
}) {
  const d = dictionary(lang);
  const t = d.sok.intent;
  const [text, setText] = useState("");
  const [intent, setIntent] = useState<SearchIntent | null>(null);
  const [outcome, setOutcome] = useState<"applied" | "rejected" | null>(null);

  const infoTypeLabel = (id: InfoTypeId) =>
    INFO_TYPES.find((x) => x.id === id)?.label[lang] ?? id;

  return (
    <AiRegion
      id="ai-sokforslag"
      title={t.title}
      notice={d.common.aiNotice}
      mark={d.common.aiMark}
      regionLabel={t.title}
      tags={["FR-002", "FAI-002"]}
    >
      <div className={SHELL}>
        <Composer
          value={text}
          onChange={(v) => {
            setText(v.slice(0, MAX_INPUT));
            /*
              The proposal goes with the sentence it was read from.

              Clearing only the outcome left the old proposal in state, so
              editing one word after approving brought the previous reading
              back — criteria quoting phrases no longer on screen, under a
              heading saying this is what your sentence means. A proposal that
              outlives its input is worse than none: it is checkable text that
              cannot be checked.
            */
            setIntent(null);
            setOutcome(null);
          }}
          onSubmit={() => {
            setIntent(searchIntent(text, lang));
            setOutcome(null);
          }}
          label={t.label}
          placeholder={t.placeholder}
          submitLabel={t.submit}
          hint={t.hint}
          emptyReason={t.emptyReason}
          showHint={intent === null}
        />

        {intent && !hasProposal(intent) && (
          <Callout tone="attention" live label={t.nothingLabel}>
            {t.nothing}
          </Callout>
        )}

        {intent && hasProposal(intent) && outcome === null && (
          <div aria-live="polite">
            <p className="mb-2 text-table">{t.proposalLead}</p>
            <ul className="space-y-2">
              <ProposedRow
                name={t.infoTypeName}
                value={infoTypeLabel(intent.infoType)}
                {...(intent.infoTypeSource ? { source: intent.infoTypeSource } : {})}
                from={intent.infoTypeSource ? t.readFrom : t.assumed}
              />
              {intent.conditions.map((c) => {
                const field = searchField(c.field);
                return (
                  <ProposedRow
                    key={`${c.field}-${c.value}`}
                    name={field.label[lang]}
                    value={`${OPERATOR_LABEL[c.operator][lang]} ${valueLabel(field, c.value, lang)}`}
                    source={c.source}
                    from={t.readFrom}
                  />
                );
              })}
            </ul>

            {/* What it could not place. Shown, because a proposal that hides
                what it dropped is one the officer cannot check. */}
            {intent.unused.length > 0 && (
              <p className="mt-2 text-label text-muted-foreground">
                {t.unused(intent.unused.join(", "))}
              </p>
            )}

            <ReplacesNotice
              {...(conditionCount > 0 ? { text: t.replaces(conditionCount) } : {})}
            />

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Button
                size="sm"
                iconStart={<IconCheck />}
                onClick={() => {
                  onApply(intent);
                  setOutcome("applied");
                }}
              >
                {t.approve}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                iconStart={<IconClose />}
                onClick={() => setOutcome("rejected")}
              >
                {d.common.reject}
              </Button>
            </div>
          </div>
        )}

        {outcome === "applied" && (
          <Callout tone="ok" live label={t.appliedLabel}>
            {t.applied}
          </Callout>
        )}
        {outcome === "rejected" && (
          <Callout tone="attention" live label={t.rejectedLabel}>
            {t.rejected}
          </Callout>
        )}
      </div>
    </AiRegion>
  );
}

/* -------------------------------------------------------------------------- */
/* Reports                                                                    */
/* -------------------------------------------------------------------------- */

export function ReportIntentAssistant({
  lang,
  available,
  replaces,
  onApply,
}: {
  lang: Lang;
  /** Only the reports this role may run — NFÅ-003 decides, not the parser. */
  available: readonly string[];
  /**
   * Whether a report is already selected, so the proposal can say that
   * approving resets its criteria and clears any result on screen.
   */
  replaces: boolean;
  onApply: (intent: ReportIntent) => void;
}) {
  const d = dictionary(lang);
  const t = d.rapporter.intent;
  const [text, setText] = useState("");
  const [intent, setIntent] = useState<ReportIntent | null>(null);
  const [outcome, setOutcome] = useState<"applied" | "rejected" | "refused" | null>(null);

  const report = REPORTS.find((r) => r.id === intent?.reportId);
  const permitted = intent?.reportId ? available.includes(intent.reportId) : false;

  return (
    <AiRegion
      id="ai-rapportforslag"
      title={t.title}
      notice={d.common.aiNotice}
      mark={d.common.aiMark}
      regionLabel={t.title}
      tags={["FR-008", "FAI-002"]}
    >
      <div className={SHELL}>
        <Composer
          value={text}
          onChange={(v) => {
            setText(v.slice(0, MAX_INPUT));
            /* The proposal goes with the sentence it was read from — see the
               same note on the search composer. Without this, editing after a
               refusal left a refusal notice for a report the new text no longer
               names. */
            setIntent(null);
            setOutcome(null);
          }}
          onSubmit={() => {
            const next = reportIntent(text, lang);
            setIntent(next);
            /* NFÅ-003 is not the parser's to decide. A report the role may not
               run is refused with the reason rather than quietly dropped —
               the assistant must not become the way around the menu. */
            setOutcome(
              next.reportId && !available.includes(next.reportId) ? "refused" : null,
            );
          }}
          label={t.label}
          placeholder={t.placeholder}
          submitLabel={t.submit}
          hint={t.hint}
          emptyReason={t.emptyReason}
          showHint={intent === null}
        />

        {intent && !hasProposal(intent) && outcome === null && (
          <Callout tone="attention" live label={t.nothingLabel}>
            {t.nothing}
          </Callout>
        )}

        {outcome === "refused" && report && (
          <Callout tone="attention" live label={t.refusedLabel}>
            {t.refused(report.label[lang])}
          </Callout>
        )}

        {intent && report && permitted && outcome === null && (
          <div aria-live="polite">
            <p className="mb-2 text-table">{t.proposalLead}</p>
            <ul className="space-y-2">
              <ProposedRow
                name={t.reportName}
                value={report.label[lang]}
                {...(intent.reportSource ? { source: intent.reportSource } : {})}
                from={intent.reportSource ? t.readFrom : t.assumed}
              />
              {intent.criteria.map((c) => {
                const criterion = report.criteria.find((x) => x.id === c.id);
                return (
                  <ProposedRow
                    key={c.id}
                    name={criterion?.label[lang] ?? c.id}
                    value={c.value}
                    source={c.source}
                    from={t.readFrom}
                  />
                );
              })}
            </ul>

            {intent.unused.length > 0 && (
              <p className="mt-2 text-label text-muted-foreground">
                {t.unused(intent.unused.join(", "))}
              </p>
            )}

            <ReplacesNotice {...(replaces ? { text: t.replaces } : {})} />

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Button
                size="sm"
                iconStart={<IconCheck />}
                onClick={() => {
                  onApply(intent);
                  setOutcome("applied");
                }}
              >
                {t.approve}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                iconStart={<IconClose />}
                onClick={() => setOutcome("rejected")}
              >
                {d.common.reject}
              </Button>
            </div>
          </div>
        )}

        {outcome === "applied" && (
          <Callout tone="ok" live label={t.appliedLabel}>
            {t.applied}
          </Callout>
        )}
        {outcome === "rejected" && (
          <Callout tone="attention" live label={t.rejectedLabel}>
            {t.rejected}
          </Callout>
        )}
      </div>
    </AiRegion>
  );
}
