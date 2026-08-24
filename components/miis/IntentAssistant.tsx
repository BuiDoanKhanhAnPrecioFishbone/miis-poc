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
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder: string;
  label: string;
  submitLabel: string;
  hint: string;
}) {
  return (
    <form
      className="flex flex-wrap items-end gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="min-w-0 flex-1">
        <TextField
          id="nl-intent"
          label={label}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          width="full"
          hint={hint}
        />
      </div>
      <Button type="submit" disabled={!value.trim()} disabledReason={hint}>
        {submitLabel}
      </Button>
    </form>
  );
}

/** One proposed criterion and the words behind it. */
function ProposedRow({ name, value, source, from }: {
  name: string;
  value: string;
  source: string;
  from: string;
}) {
  return (
    <li className="border-b border-border pb-2 last:border-0">
      <p className="text-table">
        <span className="font-semibold">{name}:</span> {value}
      </p>
      {/* The source link, in words rather than a highlight — there is no
          document here to highlight into, only the officer's own sentence. */}
      <p className="text-label text-muted-foreground">
        {from} <span className="italic">”{source}”</span>
      </p>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/* Search                                                                     */
/* -------------------------------------------------------------------------- */

export function SearchIntentAssistant({
  lang,
  onApply,
}: {
  lang: Lang;
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
            setText(v);
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
                source={intent.infoTypeSource ?? t.defaultRegister}
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
  onApply,
}: {
  lang: Lang;
  /** Only the reports this role may run — NFÅ-003 decides, not the parser. */
  available: readonly string[];
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
            setText(v);
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
                source={intent.reportSource ?? ""}
                from={t.readFrom}
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
