"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import type { ExtractionProposal, ProposalField, SourceAnchor } from "@/lib/domain/extraction";
import { initialValue, isAdjusted, isEmpty } from "@/lib/domain/extraction";
import type { Lang } from "@/lib/domain/lang";
import type { UploadedFile } from "@/lib/domain/upload";
import type { Watchword } from "@/lib/domain/watchword";
import { countHits } from "@/lib/domain/watchword";
import { UPLOAD_PIPELINE, registrationSteps, type RegistrationStage } from "@/lib/domain/upload";
import { dictionary, type Dictionary } from "@/lib/i18n";
import { ProtocolUpload } from "./ProtocolUpload";
import { RegistrationProvider } from "./RegistrationSave";
import { Stepper, type StepState } from "./Stepper";
import { Marked } from "./Marked";
import { Tabs } from "./Select";
import { IconAi, IconLock } from "./icons";
import { AiRegion, Badge, Button, Callout, Panel, Rationale, ReqTag } from "./primitives";

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

/**
 * FA-001 — agreement area, name, alternative name, parties and agreement type.
 *
 * The matched agreement leads because it is the panel's headline claim — the
 * heading says *Matchat avtal* — and the corrected employee party closes,
 * because it is the one field carrying a correction footnote. Both are also the
 * two longest values in the extraction, and both are laid out full width for
 * that reason: an `<input>` clips silently, and a party name the officer cannot
 * read in full defeats the review this screen exists for.
 */
const IDENTIFICATION: ProposalField[] = [
  "matched",
  "area",
  "alternativeName",
  "agreementType",
  "employerOrg",
  "employeeOrg",
];

/** Fields whose values do not fit a half-width column at any real viewport. */
const FULL_WIDTH: ReadonlySet<ProposalField> = new Set(["matched", "employeeOrg"]);

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

/**
 * MI's own five-step user flow (Appendix 1 §4.4), which US-01 and the tender's
 * chapter 9 both say this view mirrors. It is an argument, not decoration — the
 * claim that MIIS follows the customer's process in the customer's order — so it
 * has to tell the truth about where the officer actually is.
 *
 * The previous version hardcoded step 2 as current, so approving every proposal
 * left the stepper contradicting the screen beside it, and told assistive
 * technology the wrong position via `aria-current`.
 *
 * Steps 2 and 3 point at the same panel. That is not a mismatch to fix: a step
 * is a step in MI's process, not a panel on our screen, and the sketch merges
 * the two AI analyses into one panel as well.
 *
 * Not a wizard, deliberately. §4.1 calls the flow *Quick registration*; the
 * protocol pane exists so the officer can cross-reference throughout; and
 * US-01's alternative flows are non-linear — "save as incomplete and complete
 * later", "the officer corrects freely". Five page loads would serve none of it.
 */

/*
  Steps 2 and 3 point at different places. They are not one thing named twice:
  MI's §4.4 alternates between the machine's reading and the officer's decision
  all the way down, and keeping those apart is the substance of FAI-002. Step 2
  is what the AI found; step 3 is the approval.
*/
const STEP_TARGETS = [
  "#steg-protokoll",
  "#steg-ai",
  "#steg-avtal",
  "#steg-loneavtal",
  "#steg-spara",
];

/** One line of the protocol, highlighted when it is the source being shown. */
function SourceLine({
  anchor,
  active,
  register,
  children,
}: {
  anchor: SourceAnchor;
  active: boolean;
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
        No badge on the line. The pane already names the traced field in words
        directly above it, and a label repeated on the passage was saying the
        same thing twice in the place with the least room for it.
      */}
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

  /*
    Each field is a three-row band — label, input, correction — sharing the
    grid's rows with its neighbour through `grid-rows-subgrid`. Without it the
    columns drift apart as soon as one label wraps and the other does not, which
    is what a longer translation or a 125 % zoom reliably causes: the header was
    28px in one column and 52px in the other, so the inputs no longer lined up.
    Subgrid makes the row as tall as the tallest label and puts every input on
    the same line, whatever the language.

    Selection is an outline rather than a background with negative margins —
    an outline is drawn outside the box and cannot shift the grid.
  */
  return (
    <div
      className={`grid gap-0 @xl:row-span-3 @xl:grid-rows-subgrid ${
        FULL_WIDTH.has(proposal.id) ? "@xl:col-span-2" : ""
      }`}
    >
      {/*
        The label row carries the label, and — only when the officer has changed
        something — the one word that is worth scanning for. The `AI-FÖRSLAG`
        pill used to sit here on all nine fields and was wider than most of the
        labels it followed, so the row it was meant to annotate wrapped.
      */}
      {/*
        The AI mark is the letters, not a pictogram. There is no conventional
        symbol for "find this value in that document", so the last one had to be
        pressed before it meant anything; `AI` is read, not decoded, and it is
        the same word the panel sentence and FAI-002 already use.

        It is the control as well as the mark — pressing it traces the source.
        Focus no longer does, because tracing on every focus is what made the
        view move while the officer was reading.
      */}
      <div className="mb-1 flex min-h-7 flex-wrap items-baseline gap-2 self-end">
        <label htmlFor={inputId} className="min-w-0 break-words text-label font-bold">
          {name}
        </label>
        <button
          type="button"
          onClick={() => onShowSource(proposal)}
          aria-pressed={selected}
          aria-label={t.sourceButton(name)}
          title={t.sourceButton(name)}
          className="inline-flex h-6 shrink-0 items-center gap-1 rounded-sm border border-ai-border bg-ai px-1.5 text-meta font-bold tracking-[0.08em] text-ai-foreground transition-colors hover:bg-card"
        >
          <IconAi size="sm" />
          {d.common.aiMark}
        </button>
        {adjusted && <Badge tone="ai">{t.adjusted}</Badge>}
      </div>

      {/*
        The field keeps the ordinary input border. Nine violet-outlined boxes
        read as nine warnings, and the mark belongs on the label where it names
        something, not around the value.

        The traced field takes a light violet ring, drawn outside the box so it
        shifts nothing, at 3:1 against the panel — WCAG 1.4.11, since a ring is
        a non-text indicator. Not a fill: a tinted field looks disabled and
        pushes the value's own contrast down. An empty required field keeps the
        error border and wins.
      */}
      {/*
        Read-only, not disabled, once the form is approved.

        A `disabled` input is skipped by the keyboard and its value cannot be
        selected or copied — wrong for a registered value the officer may still
        need to read, quote or hand to a colleague. `readOnly` keeps it
        focusable and selectable and only refuses edits, which is exactly what
        approval means here. The padlock and the sentence under the group say so
        out loud, because a grey fill on its own is ambiguous between "you may
        not edit this" and "this is broken".
      */}
      <div className="relative">
        <input
          id={inputId}
          type="text"
          value={value}
          readOnly={locked}
          aria-readonly={locked || undefined}
          onChange={(e) => onChange(proposal.id, e.target.value)}
          aria-describedby="ai-forklaring"
          className={`field-input ${locked ? "bg-secondary pr-11" : ""} ${
            isEmpty(value) ? "border-error-border" : ""
          } ${selected ? "outline-3 outline-offset-2 outline-ai-ring" : ""}`}
        />
        {locked && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
            <IconLock size="md" />
            <span className="sr-only">{t.lockedByApproval}</span>
          </span>
        )}
      </div>

      {/*
        FH-001 records the old and the new value, so both stay visible. The row
        is always rendered — empty when there is nothing to show — because the
        band has to occupy three grid rows for the subgrid above to line up, and
        because its bottom margin is what separates one field from the next.
      */}
      <p className="mt-1 mb-5 flex flex-wrap items-center gap-2 text-label text-muted-foreground">
        {adjusted && (
          <>
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
          </>
        )}
      </p>
    </div>
  );
}

export function ProtocolReview({
  proposals,
  lang,
  watchwords,
  children,
}: {
  proposals: ExtractionProposal[];
  lang: Lang;
  /** FAI-004 — MI's predefined terms plus whatever a party meeting added. */
  watchwords: Watchword[];
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
  const [registered, setRegistered] = useState(false);
  const [incomplete, setIncomplete] = useState(false);
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [completed, setCompleted] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [view, setView] = useState<"text" | "original">("text");
  const paneRef = useRef<HTMLDivElement>(null);
  const [activeSource, setActiveSource] = useState<SourceAnchor | null>(null);
  const [activeField, setActiveField] = useState<ProposalField | null>(null);
  const lineRefs = useRef<Partial<Record<SourceAnchor, HTMLElement | null>>>({});

  const adjustedCount = proposals.filter((p) => isAdjusted(p, values[p.id] ?? "")).length;
  const emptyCount = proposals.filter((p) => isEmpty(values[p.id] ?? "")).length;

  const ready = file !== null && completed >= UPLOAD_PIPELINE.length;
  const reviewRef = useRef<HTMLDivElement>(null);

  /*
    US-01 step 1: OCR runs "automatically", so there is no control here — the
    pipeline advances on its own once a file exists. A timeout per stage rather
    than one interval, so unmounting or replacing the protocol cancels it.
  */
  useEffect(() => {
    if (!file || completed >= UPLOAD_PIPELINE.length) return;
    const id = setTimeout(() => setCompleted((c) => c + 1), 700);
    return () => clearTimeout(id);
  }, [file, completed]);

  /*
    The form appears after an asynchronous step the user did not scroll to, so
    keyboard and screen-reader focus is moved to it rather than left on a
    control that no longer exists (WCAG 2.4.3).
  */
  useEffect(() => {
    if (ready) reviewRef.current?.focus();
  }, [ready]);

  /*
    MI's five steps against real state. Before a file there is nothing to
    analyse; during the pipeline step 1 is done and step 2 is running; after it
    the officer is at the approval, and approving moves them on.
  */
  const stage: RegistrationStage = !file
    ? "empty"
    : !ready
      ? "analysing"
      : registered
        ? "registered"
        : approved
          ? "approved"
          : "review";
  const stepStates: StepState[] = registrationSteps(stage);

  function pick(picked: UploadedFile | null) {
    setConfirming(false);
    setFile(picked);
    setCompleted(0);
    setApproved(false);
    setRegistered(false);
    setIncomplete(false);
    setActiveSource(null);
    setActiveField(null);
    setValues(Object.fromEntries(proposals.map((p) => [p.id, initialValue(p)])));
  }

  function register(anchor: SourceAnchor, el: HTMLParagraphElement | null) {
    lineRefs.current[anchor] = el;
  }

  /*
    `scrollIntoView` walks up the scroll chain, so tracing a field moved the
    *page* — measured at up to 895px on a 1440×900 viewport while the pane's own
    scrollTop stayed at 0. That is the jump: the form slides under the cursor
    while the officer is reading a value.

    So the pane is scrolled directly and nothing else is touched, and only when
    the target actually sits outside the visible band. A source already on
    screen causes no movement at all.
  */
  function showSource(p: ExtractionProposal) {
    setActiveSource(p.source);
    setActiveField(p.id);
    setView("text");

    const pane = paneRef.current;
    const line = lineRefs.current[p.source];
    if (!pane || !line) return;

    const top = line.offsetTop - pane.offsetTop;
    const bottom = top + line.offsetHeight;
    const visibleTop = pane.scrollTop;
    const visibleBottom = visibleTop + pane.clientHeight;
    if (top >= visibleTop && bottom <= visibleBottom) return;

    pane.scrollTo({
      top: Math.max(0, top - (pane.clientHeight - line.offsetHeight) / 2),
      behavior: "smooth",
    });
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

  /*
    The order and the section headings follow the real protocol MI supplied as
    Bilaga D: validity, then peace obligation, then what the agreement covers,
    then the place and date it was settled. A heading is not a source, so it
    carries no anchor and registers no ref — only the lines a proposal can be
    traced to do.
  */
  const l = t.document.lines;

  /*
    Plain strings now. The highlighting used to be four <mark> elements written
    into this array by hand, which asserted FAI-004 rather than performing it —
    the marks could not change, so the "customisable table" the requirement
    describes had nothing to customise. Each line is matched against the table
    at render time instead, so a demand promoted at a party meeting lights up
    here without anyone editing this file.

    A heading is not a source, so it carries no anchor and registers no ref.
  */
  const lines: { anchor: SourceAnchor | null; text: string; center?: boolean; muted?: boolean }[] = [
    { anchor: "heading", text: l.heading, center: true },
    { anchor: null, text: l.betweenLabel, center: true },
    { anchor: "employerParty", text: l.employerParty, center: true },
    { anchor: null, text: l.andLabel, center: true },
    { anchor: "employeeParty", text: l.employeeParty, center: true },
    { anchor: "area", text: l.area, center: true },
    { anchor: "preamble", text: l.preamble },
    { anchor: null, text: l.validityHeading },
    { anchor: "prolonged", text: l.prolonged },
    { anchor: "period", text: l.period },
    { anchor: "terminationLead", text: l.terminationLead },
    { anchor: "termination", text: l.termination },
    { anchor: null, text: l.renegotiation },
    { anchor: null, text: l.peaceHeading },
    { anchor: "peace", text: l.peace },
    { anchor: null, text: l.scopeHeading },
    { anchor: null, text: `– ${l.scopeA}` },
    { anchor: "wageAppendix", text: `– ${l.wageAppendix}` },
    { anchor: null, text: `– ${l.scopeC}` },
    { anchor: "workingTime", text: `– ${l.workingTime}` },
    { anchor: null, text: `– ${l.scopeE}` },
    { anchor: "pension", text: l.pension },
    { anchor: "negotiation", text: l.negotiation },
    { anchor: null, text: l.signatures, muted: true },
    { anchor: null, text: l.footer, muted: true },
  ];

  const hits = countHits(
    lines.map((line) => line.text),
    watchwords,
  );

  /*
    Before the protocol has been read there is nothing to pre-fill, so the
    upload owns the whole width. It carries `steg-protokoll` because a step is
    a step in MI's process, not a panel on our screen: step 1 points at the
    document, whether that is the drop zone or the document it produced.
  */
  if (!ready) {
    return (
      <>
        <Stepper
          label={t.stepsLabel}
          lang={lang}
          states={stepStates}
          steps={t.steps.map((label, i) => ({ label, href: STEP_TARGETS[i] }))}
        />
        <div id="steg-protokoll" className="scroll-mt-24">
          <ProtocolUpload d={d} lang={lang} file={file} completed={completed} onPick={pick} />
        </div>
      </>
    );
  }

  return (
    <>
      <Stepper
        label={t.stepsLabel}
        lang={lang}
        states={stepStates}
        steps={t.steps.map((label, i) => ({ label, href: STEP_TARGETS[i] }))}
      />

      <div className="grid grid-cols-1 items-start gap-5 @3xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div id="steg-protokoll" className="scroll-mt-24 @3xl:sticky @3xl:top-24">
          <Panel>
            {/*
              The filename is a heading, so it gets a line of its own and may
              wrap as far as it needs to. It used to share a flex row with the
              replace action, which meant the position of a button depended on
              how long a filename happened to be — with a real one
              (`1786435639682_Bilaga_1_Kravspecifikation.pdf`) the heading
              consumed the row and the button dropped underneath it, alone and
              right-aligned. Truncating the name instead is worse: verifying
              that the right document was uploaded is the first thing the
              officer does here.
            */}
            <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border pb-3">
              <h2 className="min-w-0 break-all font-display text-section font-semibold text-primary">
                {file.name}
              </h2>
              <Badge tone="ok">{t.document.ocr}</Badge>
              <ReqTag id="FAI-003" />
            </div>

            <Rationale>{t.upload.demoNote}</Rationale>

            {/*
              Two views of one document. Text is the OCR output — selectable,
              highlightable, and the only form in which a watchword hit reaches
              a screen reader, which NFUI-003 makes non-negotiable. Original is
              the page as it arrived, so the screen never has to be taken on
              trust. Tracing a field returns to Text, because that is where the
              passage can actually be marked.
            */}
            {/*
              The document toolbar: which view on the left, what to do with the
              document on the right. Replacing the protocol acts on this pane
              exactly as the view switch does, so it belongs in the row of
              controls rather than hanging off the heading. The row reserves the
              action's place whatever the filename does.

              Replacing resets every field, every correction and the approval.
              It asks first — but only when there is something to lose, because
              a confirmation on a no-op is the kind that teaches people to
              dismiss confirmations without reading them.
            */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Tabs
                label={t.document.viewLabel}
                tabs={[
                  { id: "text", label: t.document.viewText },
                  { id: "original", label: t.document.viewOriginal },
                ]}
                value={view}
                onChange={(id) => setView(id as "text" | "original")}
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => (adjustedCount > 0 || approved ? setConfirming(true) : pick(null))}
              >
                {t.upload.replace}
              </Button>
            </div>

            {confirming && (
              /* Space above as well as below: the callout now sits under the
                 toolbar rather than under the heading, so without it the
                 warning touches the button that raised it. */
              <div className="mt-3 mb-4">
                <Callout tone="attention" live>
                  <span className="basis-full">{t.upload.replaceWarning(adjustedCount)}</span>
                  <span className="mt-2 flex flex-wrap gap-2">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setConfirming(false);
                        pick(null);
                      }}
                    >
                      {t.upload.replaceConfirm}
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => setConfirming(false)}>
                      {t.upload.replaceCancel}
                    </Button>
                  </span>
                </Callout>
              </div>
            )}

            <p aria-live="polite" className="mt-3 mb-3 text-label text-muted-foreground">
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
              ref={paneRef}
              tabIndex={0}
              role="region"
              aria-label={file.name}
              hidden={view !== "text"}
              className="max-h-[32rem] space-y-1 overflow-y-auto text-table leading-relaxed"
              lang="sv"
            >
              {lines.map((line, i) => {
                const body = <Marked text={line.text} watchwords={watchwords} />;
                const cls = [
                  line.center ? "block text-center" : "",
                  line.muted ? "text-muted-foreground" : "",
                ]
                  .filter(Boolean)
                  .join(" ");
                const content = cls ? <span className={cls}>{body}</span> : body;
                return line.anchor === null ? (
                  <p key={`h${i}`} className="px-3 pt-3 pb-1 font-semibold">
                    {content}
                  </p>
                ) : (
                  <SourceLine
                    key={line.anchor}
                    anchor={line.anchor}
                    active={activeSource === line.anchor}
                    register={register}
                  >
                    {content}
                  </SourceLine>
                );
              })}
            </div>

            {/*
              The page itself, fitted to the pane. Reading is what the Text view
              is for, so this is sized to show the artefact rather than to be
              read; the link opens it full size. The image is MI's own scan out
              of Bilaga D, redactions and all.
            */}
            {view === "original" && (
              <div className="space-y-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/protokoll-sida-1.png"
                  alt={t.document.originalAlt}
                  className="w-full rounded-sm border border-border"
                />
                <p className="text-label">
                  <a
                    href="/protokoll-sida-1.png"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-primary underline underline-offset-2"
                  >
                    {t.document.openFullSize}
                  </a>
                </p>
                <Rationale>{t.document.originalNote}</Rationale>
              </div>
            )}

            <div className="mt-6">
              <Callout tone="attention" tags={["FAI-004"]}>
                {t.document.watchwordHits(hits)}
              </Callout>
            </div>
          </Panel>
        </div>

        <div className="@container space-y-5">
          <div id="steg-ai" ref={reviewRef} tabIndex={-1} className="scroll-mt-24">
            {/*
              The whole analysis sits inside one AI compartment rather than a
              plain panel with violet marks scattered through it. FAI-002 is
              about the officer knowing what has and has not been approved, and
              a boundary they can see is a stronger guarantee than a badge they
              have to find.
            */}
            <AiRegion
              title={t.review.heading}
              mark={d.common.aiMark}
              notice={d.common.aiNotice}
              regionLabel={d.common.aiRegionLabel}
              tags={["FAI-001", "FAI-002", "FA-001"]}
            >
              {/*
                The colour is explained in words once, next to the fields it
                applies to, so violet is never carrying meaning on its own.
              */}
              <p id="ai-forklaring" className="mb-3 text-label text-muted-foreground">
                {t.review.aiLegend}
              </p>

              <h3 className="mb-3 font-display text-body font-semibold">{t.analysis1.title}</h3>
              <div className="grid grid-cols-1 gap-x-4 @xl:grid-cols-2">
                {group(IDENTIFICATION)}
              </div>

              <div className="mt-4">
                <Callout tone="ok">{t.analysis1.validation}</Callout>
              </div>

              <h3 className="mb-3 mt-5 font-display text-body font-semibold">
                {t.analysis2.title}
              </h3>
              <div className="grid grid-cols-1 gap-x-4 @xl:grid-cols-2 @5xl:grid-cols-3">
                {group(VALIDITY)}
              </div>

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
              <div
                id="steg-avtal"
                className="mt-5 flex scroll-mt-24 flex-wrap items-center gap-3 border-t border-border pt-4"
              >
                {approved ? (
                  <>
                    <Badge tone="ok">{t.review.approved}</Badge>
                    {/* Says what the padlocks mean, once, next to the control
                        that puts them there. */}
                    <span className="basis-full text-label text-muted-foreground">
                      {t.review.approvedLockNote}
                    </span>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setApproved(false);
                        setRegistered(false);
                      }}
                    >
                      {t.review.reopen}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => setApproved(true)}>{t.review.approve}</Button>
                    <span className="text-label text-muted-foreground">
                      {t.review.nothingSaved}
                    </span>
                  </>
                )}
                <ReqTag id="FAI-002" />
              </div>

              <Rationale>{t.review.changeLogNote}</Rationale>
            </AiRegion>
          </div>

          <RegistrationProvider value={{ stage, setRegistered, incomplete, setIncomplete }}>
            {children}
          </RegistrationProvider>
        </div>
      </div>
    </>
  );
}
