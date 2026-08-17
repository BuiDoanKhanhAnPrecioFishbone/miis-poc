"use client";

import { useRef, useState, type ReactNode } from "react";

import type {
  ExtractionProposal,
  ProposalField,
  ReviewState,
  SourceAnchor,
} from "@/lib/domain/extraction";
import { approvedCount, reviewedCount } from "@/lib/domain/extraction";
import type { Lang } from "@/lib/domain/lang";
import { dictionary, type Dictionary } from "@/lib/i18n";
import { Panel, ReqTag } from "./primitives";

/**
 * US-01 — the protocol and its AI proposals, side by side and linked.
 *
 * Two things the previous version only claimed:
 *
 * 1. **Source linking (FAI-001, FAI-004).** Selecting a proposal marks and
 *    scrolls to the passage it was read from. Review stops being "read the whole
 *    protocol and hope" and becomes "check this line".
 * 2. **The rejected path (FAI-002).** One proposal arrives wrong. Rejecting it
 *    keeps the wrong value visible with the correction beside it, because that
 *    pair is what the change log records — and because a demo of only the happy
 *    path asserts human review rather than demonstrating it.
 *
 * The registration cannot be marked complete while any proposal is unreviewed.
 * That is the requirement's "nothing shall be done automatically", enforced
 * rather than stated in a footnote.
 */

const ORDER_1: ProposalField[] = [
  "area",
  "matched",
  "alternativeName",
  "agreementType",
  "employerOrg",
  "employeeOrg",
];
const ORDER_2: ProposalField[] = ["signedDate", "validity", "termination"];

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
      {active && (
        <span className="mr-2 rounded-sm border border-ai-border bg-card px-1.5 py-0.5 text-meta font-bold tracking-wide">
          {marker}
        </span>
      )}
      {children}
    </p>
  );
}

function ProposalCard({
  proposal,
  d,
  state,
  selected,
  onShowSource,
  onDecide,
}: {
  proposal: ExtractionProposal;
  d: Dictionary;
  state: ReviewState;
  selected: boolean;
  onShowSource: (p: ExtractionProposal) => void;
  onDecide: (id: ProposalField, state: ReviewState) => void;
}) {
  const t = d.registrera;

  const badge =
    state === "approved"
      ? { text: t.review.approved, cls: "border-mint-border bg-mint text-primary" }
      : state === "rejected"
        ? {
            text: t.review.rejected,
            cls: "border-[var(--status-red)] bg-card text-[var(--status-red)]",
          }
        : { text: t.review.pending, cls: "border-input bg-card text-muted-foreground" };

  return (
    <div
      className={`rounded-md border-2 p-3 ${selected ? "border-ai-border bg-ai/40" : "border-border bg-card"}`}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-label font-bold">{label(d, proposal.id)}</span>
        <span
          className={`rounded-sm border px-2 py-0.5 text-meta font-bold tracking-wide ${badge.cls}`}
        >
          {badge.text}
        </span>
        {proposal.confidence === "low" && (
          <span className="rounded-sm border border-ai-border bg-ai px-2 py-0.5 text-meta font-bold tracking-wide text-ai-foreground">
            {t.review.confidenceLow}
          </span>
        )}
      </div>

      <p
        className={`field-input ${
          state === "rejected" ? "text-muted-foreground line-through decoration-2" : ""
        }`}
      >
        {proposal.value}
      </p>

      {state === "rejected" && proposal.correction && (
        <div className="mt-2">
          <span className="text-label font-bold">{t.review.correctionLabel}</span>
          <p className="field-input mt-1 border-[var(--status-green)]">{proposal.correction}</p>
          <p className="mt-1 text-label text-muted-foreground">{t.review.rejectedNote}</p>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onShowSource(proposal)}
          aria-pressed={selected}
          className="min-h-11 rounded-sm border-2 border-primary px-3 py-2 text-label font-bold text-primary transition-colors hover:bg-secondary"
        >
          {t.document.showSource}
        </button>
        {state === "pending" ? (
          <>
            <button
              type="button"
              onClick={() => onDecide(proposal.id, "approved")}
              className="min-h-11 rounded-sm border-2 border-transparent bg-primary px-3 py-2 text-label font-bold text-primary-foreground transition-colors hover:bg-[var(--mi-slate-900)]"
            >
              {t.review.approveAction}
            </button>
            <button
              type="button"
              onClick={() => onDecide(proposal.id, "rejected")}
              className="min-h-11 rounded-sm border-2 border-[var(--status-red)] px-3 py-2 text-label font-bold text-[var(--status-red)] transition-colors hover:bg-secondary"
            >
              {t.review.rejectAction}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => onDecide(proposal.id, "pending")}
            className="min-h-11 rounded-sm border-2 border-input px-3 py-2 text-label font-bold text-foreground transition-colors hover:bg-secondary"
          >
            {t.review.undoAction}
          </button>
        )}
      </div>
    </div>
  );
}

export function ProtocolReview({
  proposals,
  lang,
}: {
  proposals: ExtractionProposal[];
  lang: Lang;
}) {
  const d = dictionary(lang);
  const t = d.registrera;
  const [states, setStates] = useState<Record<string, ReviewState>>(() =>
    Object.fromEntries(proposals.map((p) => [p.id, p.initialState])),
  );
  const [activeSource, setActiveSource] = useState<SourceAnchor | null>(null);
  const [activeField, setActiveField] = useState<ProposalField | null>(null);
  const lineRefs = useRef<Partial<Record<SourceAnchor, HTMLElement | null>>>({});

  const stateList = proposals.map((p) => states[p.id] ?? "pending");
  const pending = proposals.length - reviewedCount(stateList);
  const approved = approvedCount(stateList);

  function register(anchor: SourceAnchor, el: HTMLParagraphElement | null) {
    lineRefs.current[anchor] = el;
  }

  function showSource(p: ExtractionProposal) {
    setActiveSource(p.source);
    setActiveField(p.id);
    lineRefs.current[p.source]?.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  function decide(id: ProposalField, state: ReviewState) {
    setStates((s) => ({ ...s, [id]: state }));
  }

  const byId = new Map(proposals.map((p) => [p.id, p]));

  function cards(order: ProposalField[]) {
    return order.map((id) => {
      const p = byId.get(id);
      if (!p) return null;
      return (
        <ProposalCard
          key={id}
          proposal={p}
          d={d}
          state={states[id] ?? "pending"}
          selected={activeField === id}
          onShowSource={showSource}
          onDecide={decide}
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
    {
      anchor: "period",
      content: <mark className="bg-sand px-1">{t.document.lines.period}</mark>,
    },
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
    <div className="grid gap-5 @3xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <Panel>
        <div className="mb-4 flex flex-wrap items-center gap-3 border-b border-border pb-3">
          <h2 className="font-display text-section font-semibold text-primary">
            {t.document.fileName}
          </h2>
          <span className="rounded-md border border-mint-border bg-mint px-3 py-1 text-meta font-bold text-primary">
            {t.document.ocr}
          </span>
          <ReqTag id="FAI-003" />
        </div>

        <p aria-live="polite" className="mb-3 text-label text-muted-foreground">
          {activeField ? t.document.sourceActive(label(d, activeField)) : t.document.sourceHint}
        </p>

        {/*
          The protocol stays Swedish in the English translation. It is a scanned
          Swedish document; rendering it in English would describe a system that
          reads something it will never be given.
        */}
        {/*
          Focusable and named: the pane scrolls, and a scrollable region whose
          content is not itself focusable is unreachable by keyboard (WCAG 2.1.1).
        */}
        <div
          tabIndex={0}
          role="region"
          aria-label={t.document.fileName}
          className="max-h-[30rem] space-y-1 overflow-y-auto text-table leading-relaxed"
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

        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-md border border-sand-border bg-sand px-4 py-3 text-label text-sand-foreground">
          {t.document.watchwordHits(4)}
          <ReqTag id="FAI-004" />
        </div>
      </Panel>

      <div className="space-y-5">
        <Panel title={t.review.heading} tags={["FAI-001", "FAI-002"]}>
          <p className="mb-4 text-table">{t.review.counts(approved, proposals.length)}</p>

          <h3 className="mb-2 font-display text-body font-semibold">{t.analysis1.title}</h3>
          <div className="grid gap-3 @xl:grid-cols-2">{cards(ORDER_1)}</div>

          <p className="mt-3 rounded-md border border-mint-border bg-mint px-4 py-3 text-label text-primary">
            {t.analysis1.validation}
          </p>

          <h3 className="mb-2 mt-5 font-display text-body font-semibold">{t.analysis2.title}</h3>
          <div className="grid gap-3 @xl:grid-cols-3">{cards(ORDER_2)}</div>

          <p
            aria-live="polite"
            className={`mt-4 rounded-md border-2 px-4 py-3 text-label ${
              pending > 0
                ? "border-[var(--status-red)] bg-card text-[var(--status-red)]"
                : "border-mint-border bg-mint text-primary"
            }`}
          >
            {pending > 0 ? t.review.blockedNote(pending) : t.review.readyNote}
          </p>

          <p className="mt-2 text-label text-muted-foreground">{t.analysis2.nothingAutomatic}</p>
        </Panel>
      </div>
    </div>
  );
}
