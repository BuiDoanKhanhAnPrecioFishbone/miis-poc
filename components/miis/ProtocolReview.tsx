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
import { Badge, Button, Callout, Panel, Rationale, ReqTag } from "./primitives";

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
 *
 * **The proposals are a list, not a grid of cards.** Nine bordered boxes in two
 * columns made the eye zig-zag, gave every box a different height, and scattered
 * the approve/reject controls across the panel. One row per proposal puts the
 * whole review in a single top-to-bottom pass: the status column reads as one
 * strip, the action is always in the same place, and the order can mirror the
 * protocol so "check it line by line" actually works.
 *
 * It does not use `DataTable`, deliberately. Sorting would destroy the point —
 * the order is meaningful because it follows the document — and the review needs
 * grouped sections and a row that highlights when its source is on screen.
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
      {/*
        Not a <Badge>: this sits on top of an already tinted line, so it needs
        the card background to stay legible.
      */}
      {active && (
        <span className="mr-2 rounded-sm border border-ai-border bg-card px-1.5 py-0.5 text-meta font-bold tracking-wide">
          {marker}
        </span>
      )}
      {children}
    </p>
  );
}

/** Groups the rows by AI analysis step without breaking the status column. */
function GroupHeading({ text }: { text: string }) {
  return (
    <tr>
      <th
        scope="colgroup"
        colSpan={4}
        className="border-b border-border pb-1 pt-5 text-left font-display text-body font-semibold text-[var(--mi-slate-900)]"
      >
        {text}
      </th>
    </tr>
  );
}

function ProposalRow({
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
      ? { text: t.review.approved, tone: "ok" as const }
      : state === "rejected"
        ? { text: t.review.rejected, tone: "error" as const }
        : { text: t.review.pending, tone: "neutral" as const };

  return (
    <tr
      className={`border-b border-border/60 align-top last:border-0 ${
        selected ? "bg-ai" : "transition-colors hover:bg-secondary/50"
      }`}
    >
      {/*
        The field name is the source trigger. Checking a proposal means finding
        the words it came from, so the noun you want to verify is the control —
        and it keeps the action column to the two decisions, which is what lets
        a row stay one line high.
      */}
      <th scope="row" className="py-2 pr-4 text-left font-bold">
        <button
          type="button"
          onClick={() => onShowSource(proposal)}
          aria-pressed={selected}
          aria-label={t.document.showSourceFor(label(d, proposal.id))}
          className="inline-flex min-h-11 items-center gap-1.5 text-left font-bold text-primary underline decoration-dotted underline-offset-4 hyphens-auto [overflow-wrap:break-word] hover:decoration-solid"
        >
          {label(d, proposal.id)}
          <span aria-hidden className="text-meta opacity-70">
            ⤵
          </span>
        </button>
        {selected && (
          <span className="block pb-1">
            <Badge tone="ai">{t.review.sourceShown}</Badge>
          </span>
        )}
      </th>

      <td className="py-2 pr-4 [overflow-wrap:anywhere]">
        <span
          className={state === "rejected" ? "text-muted-foreground line-through decoration-2" : ""}
        >
          {proposal.value}
        </span>
        {state === "rejected" && proposal.correction && (
          <span className="mt-1 block">
            <span className="text-meta font-bold uppercase tracking-wide text-muted-foreground">
              {t.review.correctionLabel}
            </span>
            <span className="block font-semibold">{proposal.correction}</span>
          </span>
        )}
      </td>

      <td className="py-2 pr-4">
        <span className="flex flex-wrap items-center gap-1.5">
          <Badge tone={badge.tone}>{badge.text}</Badge>
          {proposal.confidence === "low" && <Badge tone="ai">{t.review.confidenceLow}</Badge>}
        </span>
      </td>

      <td className="py-2">
        <span className="flex flex-wrap items-center gap-2">
          {state === "pending" ? (
            <>
              <Button size="sm" onClick={() => onDecide(proposal.id, "approved")}>
                {t.review.approveAction}
              </Button>
              <Button variant="danger" size="sm" onClick={() => onDecide(proposal.id, "rejected")}>
                {t.review.rejectAction}
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => onDecide(proposal.id, "pending")}>
              {t.review.undoAction}
            </Button>
          )}
        </span>
      </td>
    </tr>
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
  const [states, setStates] = useState<Record<string, ReviewState>>(() =>
    Object.fromEntries(proposals.map((p) => [p.id, p.initialState])),
  );
  const [activeSource, setActiveSource] = useState<SourceAnchor | null>(null);
  const [activeField, setActiveField] = useState<ProposalField | null>(null);
  const lineRefs = useRef<Partial<Record<SourceAnchor, HTMLElement | null>>>({});

  const stateList = proposals.map((p) => states[p.id] ?? "pending");
  const pending = proposals.length - reviewedCount(stateList);
  const approved = approvedCount(stateList);
  const anyRejected = stateList.includes("rejected");

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

  function rows(order: ProposalField[]) {
    return order.map((id) => {
      const p = byId.get(id);
      if (!p) return null;
      return (
        <ProposalRow
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
    <div className="grid items-start gap-5 @3xl:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
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

      <div className="space-y-5">
        <Panel title={t.review.heading} tags={["FAI-001", "FAI-002"]}>
          <p className="mb-2 text-table">{t.review.counts(approved, proposals.length)}</p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] table-fixed text-table">
              <caption className="sr-only">{t.review.heading}</caption>
              <colgroup>
                <col className="w-[25%]" />
                <col className="w-[32%]" />
                <col className="w-[20%]" />
                <col className="w-[23%]" />
              </colgroup>
              <thead>
                <tr className="border-b-2 border-border text-left text-label text-muted-foreground">
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    {t.review.table.field}
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    {t.review.table.proposal}
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    {t.review.table.status}
                  </th>
                  <th scope="col" className="py-2 font-semibold">
                    {t.review.table.action}
                  </th>
                </tr>
              </thead>
              <tbody>
                <GroupHeading text={t.analysis1.title} />
                {rows(ORDER_1)}
              </tbody>
              <tbody>
                <GroupHeading text={t.analysis2.title} />
                {rows(ORDER_2)}
              </tbody>
            </table>
          </div>

          {anyRejected && (
            <p className="mt-3 text-label text-muted-foreground">{t.review.rejectedNote}</p>
          )}

          <div className="mt-4">
            <Callout tone={pending > 0 ? "error" : "ok"} live>
              {pending > 0 ? t.review.blockedNote(pending) : t.review.readyNote}
            </Callout>
          </div>

          <div className="mt-3">
            <Callout tone="ok">{t.analysis1.validation}</Callout>
          </div>

          <Rationale>{t.analysis2.nothingAutomatic}</Rationale>
        </Panel>

        {children}
      </div>
    </div>
  );
}
