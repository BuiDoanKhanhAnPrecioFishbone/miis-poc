"use client";

import { useRef, useState, type ReactNode } from "react";

import type { ExtractionProposal, ProposalField, SourceAnchor } from "@/lib/domain/extraction";
import { initialValue, isAdjusted, isEmpty } from "@/lib/domain/extraction";
import type { Lang } from "@/lib/domain/lang";
import { dictionary, type Dictionary } from "@/lib/i18n";
import { Badge, Button, Callout, Panel, Rationale, ReqTag } from "./primitives";

/**
 * US-01 — the protocol and the form it pre-fills, side by side and linked.
 *
 * Every restructure here is logged against the sketch and the requirement in
 * `docs/09-us01-form-decisions.md`. The short version:
 *
 * - **It is a form, not a review queue.** US-01 says "the system shows the
 *   pre-filled form … the officer adjusts as needed and approves manually", and
 *   §4.1 calls the flow *Quick registration*. An earlier version made nine
 *   per-field approve/reject decisions out of it, which is the opposite of
 *   quick and frames the officer as a rubber stamp — ironic, given FAI-002.
 * - **Approval is per form, not per field.** FAI-002 requires approval "before
 *   being saved", which scopes it to the save.
 * - **Fields are editable from the start.** "The officer corrects freely before
 *   approval" reads against a read-only preview that has to be unlocked, so the
 *   sketch's `Justera` button is not a button — it is what happens, and the
 *   field then says `JUSTERAD`.
 * - **There is no reject.** No requirement contains one, and in a registration
 *   form it means nothing: the field still needs a value.
 *
 * Kept from our own work because the requirements support it and the sketch has
 * no equivalent: selecting a field marks and scrolls to the passage in the
 * protocol it was read from (FAI-001, FAI-004, FR-003).
 */

/** FA-001 — agreement area, name, alternative name, parties and agreement type. */
const IDENTIFICATION: ProposalField[] = [
  "area",
  "matched",
  "alternativeName",
  "agreementType",
  "employerOrg",
  "employeeOrg",
];

/** US-01 — AI analysis 2: signing date, validity period, termination option. */
const VALIDITY: ProposalField[] = ["signedDate", "validity", "termination"];

function label(d: Dictionary, id: ProposalField): string {
  const a1 = d.registrera.analysis1;
  const a2 = d.registrera.analysis2;
  switch (id) {
    case "area":
      return a1.area;
    case "matched":
      return a1.matched;
    case "alternativeName":
      return a1.alternativeName;
    case "agreementType":
      return a1.agreementType;
    case "employerOrg":
      return a1.employerOrg;
    case "employeeOrg":
      return a1.employeeOrg;
    case "signedDate":
      return a2.signedDate;
    case "validity":
      return a2.validity;
    case "termination":
      return a2.termination;
  }
}

/** One line of the protocol, highlighted when it is the source being shown. */
function SourceLine({
  anchor,
  active,
  marker,
  register,
  children,
}: {
  anchor: SourceAnchor;
  active: boolean;
  marker: string;
  register: (anchor: SourceAnchor, el: HTMLParagraphElement | null) => void;
  children: ReactNode;
}) {
  return (
    <p
      ref={(el) => register(anchor, el)}
      className={
        active
          ? "rounded-sm border-l-4 border-ai-border bg-ai px-3 py-1.5 text-ai-foreground"
          : "px-3 py-1.5"
      }
    >
      {/*
        Not a <Badge>: this sits on top of an already tinted line, so it needs
        the card background to stay legible.
      */}
      {active && (
        <span className="mr-2 rounded-sm border border-ai-border bg-card px-1.5 py-0.5 text-meta font-bold uppercase tracking-[0.12em]">
          {marker}
        </span>
      )}
      {children}
    </p>
  );
}

/**
 * One pre-filled field.
 *
 * The `AI-FÖRSLAG` pill is FAI-002's labelling obligation, and it is on *every*
 * AI-filled field — the sketch left the three date fields bare although US-01
 * says AI analysis 2 produced them.
 *
 * The pill is also the source control. Checking a proposal means finding the
 * words it came from, so the label that says where a value came from is the
 * thing you press to see it.
 */
function PreFilledField({
  proposal,
  d,
  value,
  locked,
  selected,
  onChange,
  onReset,
  onShowSource,
}: {
  proposal: ExtractionProposal;
  d: Dictionary;
  value: string;
  locked: boolean;
  selected: boolean;
  onChange: (id: ProposalField, value: string) => void;
  onReset: (id: ProposalField) => void;
  onShowSource: (p: ExtractionProposal) => void;
}) {
  const t = d.registrera.review;
  const name = label(d, proposal.id);
  const adjusted = isAdjusted(proposal, value);
  const inputId = `prop-${proposal.id}`;

  return (
    <div className={selected ? "-m-2 rounded-md bg-ai/50 p-2" : ""}>
      <div className="mb-1 flex min-h-7 flex-wrap items-center gap-2">
        <label htmlFor={inputId} className="text-label font-bold text-foreground">
          {name}
        </label>
        <button
          type="button"
          onClick={() => onShowSource(proposal)}
          aria-pressed={selected}
          aria-label={d.registrera.document.showSourceFor(name)}
          className="rounded-sm border border-ai-border bg-ai px-2 py-0.5 text-meta font-bold uppercase tracking-[0.12em] text-ai-foreground transition-colors hover:bg-card"
        >
          {adjusted ? t.adjusted : t.aiFilled}
          <span aria-hidden className="ml-1 opacity-70">
            ⤵
          </span>
        </button>
      </div>

      <input
        id={inputId}
        type="text"
        value={value}
        readOnly={locked}
        onChange={(e) => onChange(proposal.id, e.target.value)}
        className={`field-input ${locked ? "bg-secondary" : ""} ${
          isEmpty(value) ? "border-error-border" : ""
        }`}
      />

      {/* FH-001 records the old and the new value, so both stay visible. */}
      {adjusted && (
        <p className="mt-1 flex flex-wrap items-center gap-2 text-label text-muted-foreground">
          <span className="line-through decoration-2">{t.aiProposed(proposal.value)}</span>
          {!locked && (
            <button
              type="button"
              onClick={() => onReset(proposal.id)}
              aria-label={t.resetFor(name)}
              className="font-semibold text-primary underline underline-offset-2"
            >
              {t.reset}
            </button>
          )}
        </p>
      )}
    </div>
  );
}

export function ProtocolReview({
  proposals,
  lang,
  children,
}: {
  proposals: ExtractionProposal[];
  lang: Lang;
  /**
   * The rest of the registration form. It lives in the right-hand column so the
   * protocol on the left can stay put while the case officer works down it —
   * the task is read-source then fill-field, and a source that scrolls away
   * turns every check into a round trip.
   */
  children?: ReactNode;
}) {
  const d = dictionary(lang);
  const t = d.registrera;
  const byId = new Map(proposals.map((p) => [p.id, p]));

  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(proposals.map((p) => [p.id, initialValue(p)])),
  );
  const [approved, setApproved] = useState(false);
  const [activeSource, setActiveSource] = useState<SourceAnchor | null>(null);
  const [activeField, setActiveField] = useState<ProposalField | null>(null);
  const lineRefs = useRef<Partial<Record<SourceAnchor, HTMLElement | null>>>({});

  const adjustedCount = proposals.filter((p) => isAdjusted(p, values[p.id] ?? "")).length;
  const emptyCount = proposals.filter((p) => isEmpty(values[p.id] ?? "")).length;

  function register(anchor: SourceAnchor, el: HTMLParagraphElement | null) {
    lineRefs.current[anchor] = el;
  }

  function showSource(p: ExtractionProposal) {
    setActiveSource(p.source);
    setActiveField(p.id);
    lineRefs.current[p.source]?.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  function change(id: ProposalField, value: string) {
    setValues((v) => ({ ...v, [id]: value }));
  }

  function reset(id: ProposalField) {
    const p = byId.get(id);
    if (p) setValues((v) => ({ ...v, [id]: p.value }));
  }

  function group(order: ProposalField[]) {
    return order.map((id) => {
      const p = byId.get(id);
      if (!p) return null;
      return (
        <PreFilledField
          key={id}
          proposal={p}
          d={d}
          value={values[id] ?? ""}
          locked={approved}
          selected={activeField === id}
          onChange={change}
          onReset={reset}
          onShowSource={showSource}
        />
      );
    });
  }

  const lines: { anchor: SourceAnchor; content: ReactNode }[] = [
    {
      anchor: "heading",
      content: <span className="font-semibold tracking-wide">{t.document.lines.heading}</span>,
    },
    { anchor: "parties", content: t.document.lines.parties },
    { anchor: "period", content: <mark className="bg-sand px-1">{t.document.lines.period}</mark> },
    { anchor: "prolonged", content: t.document.lines.prolonged },
    {
      anchor: "workingTime",
      content: <mark className="bg-sand px-1">{t.document.lines.workingTime}</mark>,
    },
    { anchor: "wageAppendix", content: t.document.lines.wageAppendix },
    {
      anchor: "revision",
      content: <mark className="bg-sand px-1">{t.document.lines.revision}</mark>,
    },
    { anchor: "minimumWage", content: t.document.lines.minimumWage },
    { anchor: "terminationLead", content: t.document.lines.terminationLead },
    {
      anchor: "termination",
      content: <mark className="bg-sand px-1">{t.document.lines.termination}</mark>,
    },
    { anchor: "negotiation", content: t.document.lines.negotiation },
  ];

  return (
    <div className="grid items-start gap-5 @3xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <div className="@3xl:sticky @3xl:top-4">
        <Panel>
          <div className="mb-4 flex flex-wrap items-center gap-3 border-b border-border pb-3">
            <h2 className="font-display text-section font-semibold text-primary">
              {t.document.fileName}
            </h2>
            <Badge tone="ok">{t.document.ocr}</Badge>
            <ReqTag id="FAI-003" />
          </div>

          <p aria-live="polite" className="mb-3 text-label text-muted-foreground">
            {activeField ? t.document.sourceActive(label(d, activeField)) : t.document.sourceHint}
          </p>

          {/*
            The protocol stays Swedish in the English translation. It is a
            scanned Swedish document; rendering it in English would describe a
            system that reads something it will never be given.

            Focusable and named: the pane scrolls, and a scrollable region whose
            content is not itself focusable is unreachable by keyboard (2.1.1).
          */}
          <div
            tabIndex={0}
            role="region"
            aria-label={t.document.fileName}
            className="max-h-[32rem] space-y-1 overflow-y-auto text-table leading-relaxed"
            lang="sv"
          >
            {lines.map((line) => (
              <SourceLine
                key={line.anchor}
                anchor={line.anchor}
                active={activeSource === line.anchor}
                marker={t.document.sourceMarker}
                register={register}
              >
                {line.content}
              </SourceLine>
            ))}
          </div>

          <div className="mt-6">
            <Callout tone="attention" tags={["FAI-004"]}>
              {t.document.watchwordHits(4)}
            </Callout>
          </div>
        </Panel>
      </div>

      <div className="@container space-y-5">
        <Panel title={t.review.heading} tags={["FAI-001", "FAI-002", "FA-001"]}>
          <h3 className="mb-3 font-display text-body font-semibold">{t.analysis1.title}</h3>
          <div className="grid gap-4 @xl:grid-cols-2">{group(IDENTIFICATION)}</div>

          <div className="mt-4">
            <Callout tone="ok">{t.analysis1.validation}</Callout>
          </div>

          <h3 className="mb-3 mt-5 font-display text-body font-semibold">{t.analysis2.title}</h3>
          <div className="grid gap-4 @xl:grid-cols-2 @5xl:grid-cols-3">{group(VALIDITY)}</div>

          <p aria-live="polite" className="mt-4 text-table">
            {adjustedCount > 0 ? t.review.adjustedCount(adjustedCount) : t.review.noneAdjusted}
          </p>

          {emptyCount > 0 && (
            <div className="mt-2">
              <Callout tone="attention" live tags={["FA-021"]}>
                {t.review.emptyBlocks(emptyCount)}
              </Callout>
            </div>
          )}

          {/*
            FAI-002: one approval, for the form, with the guarantee stated next
            to the control it describes — the sketch's own wording.
          */}
          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
            {approved ? (
              <>
                <Badge tone="ok">{t.review.approved}</Badge>
                <Button variant="secondary" onClick={() => setApproved(false)}>
                  {t.review.reopen}
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setApproved(true)}>{t.review.approve}</Button>
                <span className="text-label text-muted-foreground">{t.review.nothingSaved}</span>
              </>
            )}
            <ReqTag id="FAI-002" />
          </div>

          <Rationale>{t.review.changeLogNote}</Rationale>
        </Panel>

        {children}
      </div>
    </div>
  );
}
