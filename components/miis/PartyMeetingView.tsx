"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { Lang } from "@/lib/domain/lang";
import { t as text } from "@/lib/domain/lang";
import type { BargainingDemand, MeetingPhase, PartyMeeting } from "@/lib/domain/party-meeting";
import type { DemandKind } from "@/lib/domain/party-meeting";
import { DEMAND_KIND_LABEL, phaseState, watchwordCount } from "@/lib/domain/party-meeting";
import { WATCHWORD_COOKIE, COOKIE_MAX_AGE_SECONDS } from "@/lib/cookies";
import type { Watchword } from "@/lib/domain/watchword";
import { addWatchword, encodeWatchwords, suggestTerm } from "@/lib/domain/watchword";

import { dictionary } from "@/lib/i18n";
import { DocumentTemplate } from "./DocumentTemplate";
import { PrintButton } from "./Print";
import { IconPlus } from "./icons";
import { Select } from "./Select";
import { Stepper, type StepState } from "./Stepper";
import {
  Badge,
  Button,
  Callout,
  Chip,
  Field,
  FormGrid,
  Panel,
  Rationale,
  ReqTag,
  ReqTags,
  TextField,
} from "./primitives";

/**
 * US-08 — a party meeting through its three phases.
 *
 * FF-004 is unusually prescriptive: registration *"både inför och efter en
 * träff, men även … mata in information direkt under mötet i en interaktiv
 * vy"*. Three phases, and the middle one is live, so it is the only one built
 * as an input surface rather than a summary — notes land time-stamped as the
 * officer types, and a demand becomes a record the moment it is heard.
 *
 * Tabs rather than one long form, because the phases are not steps the officer
 * walks once. Preparation is revisited after the meeting — US-08's alternative
 * flow is explicit that "the registration can be updated both before and after
 * the meeting" — and a form that scrolled would put the live view, the one
 * used under time pressure with someone sitting opposite, below two screens of
 * material that is already filled in.
 */

const PHASES: MeetingPhase[] = ["before", "during", "after"];

function DemandRow({
  demand,
  lang,
  d,
  onPromote,
  promotingId,
  term,
  onTermChange,
  onConfirm,
  onCancel,
}: {
  demand: BargainingDemand;
  lang: Lang;
  d: ReturnType<typeof dictionary>;
  onPromote: (id: string) => void;
  promotingId: string | null;
  term: string;
  onTermChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const t = d.partstraffar;
  return (
    <li className="border-t border-border py-3 first:border-t-0">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-semibold">{text(demand.topic, lang)}</span>
        {/*
          FF-005's flag. `Badge`, not `StatusDot` — a demand being coordinated
          is a kind, not an FR-012 agreement status, and the reserved hues stay
          reserved.
        */}
        <Badge tone={demand.kind === "coordinated" ? "attention" : "neutral"}>
          {DEMAND_KIND_LABEL[lang][demand.kind]}
        </Badge>
      </div>

      {/* FF-005 — the unions standing behind a coordinated demand. */}
      {demand.backedBy.length > 0 && (
        <p className="mt-2 flex flex-wrap items-center gap-2 text-label">
          <span className="text-muted-foreground">{t.backedBy}</span>
          {demand.backedBy.map((union) => (
            <Chip key={union}>{union}</Chip>
          ))}
        </p>
      )}

      {demand.documents.length > 0 && (
        <p className="mt-2 flex flex-wrap items-center gap-2 text-label text-muted-foreground">
          <span>{t.demandDocuments}</span>
          {demand.documents.map((doc) => (
            <span key={doc} className="font-semibold text-primary underline underline-offset-2">
              {doc}
            </span>
          ))}
        </p>
      )}

      {/*
        FAI-004, and the reason this screen matters to the AI story: §4.1 says
        the watchword table carries "särskilt utvalda yrkanden, till exempel
        sådana som identifierats vid partsträffar". A demand promoted here is
        what later gets highlighted in an incoming protocol on /registrera.
      */}
      <p className="mt-2 flex flex-wrap items-center gap-2">
        {demand.watchword ? (
          <>
            <Badge tone="ok">{t.isWatchword}</Badge>
            <span className="text-label text-muted-foreground">{t.watchwordExplain}</span>
          </>
        ) : promotingId === demand.id ? (
          <span className="flex flex-wrap items-end gap-2">
            <span>
              <label htmlFor="wd-term" className="mb-1 block text-label font-bold">
                {t.watchwordTermLabel}
              </label>
              <input
                id="wd-term"
                type="text"
                value={term}
                onChange={(e) => onTermChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onConfirm();
                  }
                }}
                className="field-input w-64"
              />
            </span>
            <Button size="sm" onClick={onConfirm} disabled={term.trim().length === 0}>
              {t.watchwordConfirm}
            </Button>
            <Button variant="secondary" size="sm" onClick={onCancel}>
              {t.demands.cancel}
            </Button>
          </span>
        ) : (
          <Button variant="secondary" size="sm" onClick={() => onPromote(demand.id)}>
            {t.promoteToWatchword}
          </Button>
        )}
        <ReqTag id="FAI-004" />
      </p>
    </li>
  );
}

export function PartyMeetingView({
  meeting,
  lang,
  unions,
  addedWatchwords,
}: {
  meeting: PartyMeeting;
  lang: Lang;
  /**
   * FF-005: *"Samordnade avtalskrav ska kunna kopplas till de förbund som
   * ställt sig bakom det."* The list comes from the party register rather than
   * a hardcoded array, so a demand can only be backed by a union MIIS knows.
   */
  unions: string[];
  /**
   * FAI-004's customisable half — the terms already added from party meetings.
   * Promoting a demand appends to this and the registration screen picks it up,
   * which is the whole point: a demand heard in January is what marks a clause
   * in a protocol that arrives in June.
   */
  addedWatchwords: Watchword[];
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const d = dictionary(lang);
  const t = d.partstraffar;
  const [phase, setPhase] = useState<MeetingPhase>(
    meeting.state === "planned" ? "before" : meeting.state === "held" ? "during" : "after",
  );
  const [notes, setNotes] = useState(meeting.notes);
  const [draft, setDraft] = useState("");
  const [demands, setDemands] = useState(meeting.demands);
  const [adding, setAdding] = useState(false);
  const [topic, setTopic] = useState("");
  const [kind, setKind] = useState<DemandKind>("coordinated");
  const [backing, setBacking] = useState<string[]>([]);
  const [promoting, setPromoting] = useState<string | null>(null);
  const [term, setTerm] = useState("");

  /*
    *Inför träffen* is a form, not a summary.

    It rendered `Field` — a read-only value on a rule — so a screen titled
    "Registrera en partsträff" showed five rows reading "Ej registrerat" and no
    way to register any of them. Read as disabled, which is the same failure as
    a `<Button>` with no `onClick`: it teaches an evaluator that the prototype
    is a picture.

    Editable whether the meeting is new or held, because US-08's alternative
    flow says exactly that — *"registreringen kan uppdateras både före och efter
    mötet"* — and what the requirement pairs with the freedom is FH-001's change
    log, which the rationale under the panel names.
  */
  const [party, setParty] = useState(meeting.party);
  const [date, setDate] = useState(meeting.date);
  const [purpose, setPurpose] = useState(text(meeting.purpose, lang));
  const [participants, setParticipants] = useState(meeting.participants.join(", "));
  const [agenda, setAgenda] = useState<string[]>(meeting.agenda.map((a) => text(a, lang)));
  const [agendaDraft, setAgendaDraft] = useState("");
  const [savedBefore, setSavedBefore] = useState(false);

  function addAgendaItem() {
    const value = agendaDraft.trim();
    if (!value) return;
    setAgenda((prev) => [...prev, value]);
    setAgendaDraft("");
    setSavedBefore(false);
  }

  function addNote() {
    const value = draft.trim();
    if (!value) return;
    /*
      A fixed stamp, not `new Date()`. The screenshots must be identical from
      one run to the next, and a live clock would make every capture differ.
    */
    const at = `10:${String(20 + notes.length * 7).padStart(2, "0")}`;
    setNotes((n) => [...n, { at, text: { sv: value, en: value } }]);
    setDraft("");
  }

  function addDemand() {
    const value = topic.trim();
    if (!value) return;
    setDemands((list) => [
      ...list,
      {
        id: `YRK-${String(list.length + 1).padStart(2, "0")}`,
        topic: { sv: value, en: value },
        kind,
        /* FF-005 — backing only means anything on a coordinated demand. */
        backedBy: kind === "coordinated" ? backing : [],
        documents: [],
        watchword: false,
      },
    ]);
    setTopic("");
    setBacking([]);
    setAdding(false);
  }

  /*
    Promotion writes to the watchword table, not to a flag on the demand. The
    table is what /registrera reads, so the term genuinely starts marking text
    in incoming protocols rather than only turning a badge green here.

    The cookie is the transport because the two screens are separate server
    renders; `router.refresh()` is the same mechanism the demo bar uses. In week
    2 this is a row in `Bevakningsord` and nothing above this line changes.
  */
  /*
    Promoting asks for the term first. A demand's topic is a sentence — "Höjd
    deltidspensionspremie" — and a watchword is a word, the one that will
    actually turn up in a protocol six months later. The field opens on a
    suggestion and the officer decides, because §4.1 makes the table
    customisable and no heuristic should be quietly authoritative about what MI
    watches.
  */
  function startPromote(id: string) {
    const demand = demands.find((x) => x.id === id);
    if (!demand) return;
    setPromoting(id);
    setTerm(suggestTerm(text(demand.topic, "sv")));
  }

  /*
    Confirming writes to the watchword table, not to a flag on the demand. The
    table is what /registrera reads, so the term genuinely starts marking text
    in incoming protocols rather than only turning a badge green here.

    The cookie is the transport because the two screens are separate server
    renders; `router.refresh()` is the same mechanism the demo bar uses. In week
    2 this is a row in `Bevakningsord` and nothing above this line changes.
  */
  function confirmPromote() {
    const value = term.trim();
    if (!promoting || !value) return;
    const next = addWatchword(addedWatchwords, value, `${t.watchwordOrigin} ${meeting.date}`);
    document.cookie = `${WATCHWORD_COOKIE}=${encodeWatchwords(next)};path=/;max-age=${COOKIE_MAX_AGE_SECONDS};samesite=lax`;
    setDemands((list) => list.map((x) => (x.id === promoting ? { ...x, watchword: true } : x)));
    setPromoting(null);
    startTransition(() => router.refresh());
  }

  const promoted = watchwordCount({ ...meeting, demands });

  return (
    <>
      {/*
        A stepper, not tabs. Inför · Under mötet · Efter are stages of one
        process in order, with a position — prepared, held, completed — and
        `phaseState` already derives done/current/upcoming from where the
        meeting has got to. Tabs would say the three are interchangeable views
        of the same thing, which is what the Text and Original views of a
        protocol are and what these are not. Same component `/registrera` uses
        for MI's five registration steps.
      */}
      <Stepper
        label={t.phaseLabel}
        lang={lang}
        sticky={false}
        /* Progress, not selection. Collapsing the two here is what made a
           completed phase lose its tick when the officer clicked back to it. */
        states={PHASES.map((p) => phaseState(meeting, p))}
        selected={PHASES.indexOf(phase)}
        steps={PHASES.map((p) => ({ label: t.phase[p], onSelect: () => setPhase(p) }))}
      />

      <div className="mt-5 space-y-5">
        {phase === "before" && (
          <Panel title={t.before.heading} tags={["FF-004", "FSD-002"]}>
            <div className="@container/form">
              <FormGrid>
                {/* FF-004: one party at a time, so the union is chosen from the
                    register rather than typed — a meeting with a party MIIS
                    does not hold is a meeting nothing can be filed against. */}
                <Select
                  id="pm-party"
                  width="medium"
                  label={t.before.party}
                  value={party}
                  onChange={(v) => {
                    setParty(v);
                    setSavedBefore(false);
                  }}
                  options={[
                    { id: "", label: d.common.choose },
                    ...unions.map((u) => ({ id: u, label: u })),
                  ]}
                />
                <TextField
                  id="pm-date"
                  type="date"
                  width="short"
                  numeric
                  label={t.before.date}
                  value={date}
                  onChange={(v) => {
                    setDate(v);
                    setSavedBefore(false);
                  }}
                />
                <TextField
                  id="pm-purpose"
                  width="full"
                  label={t.before.purpose}
                  value={purpose}
                  onChange={(v) => {
                    setPurpose(v);
                    setSavedBefore(false);
                  }}
                />
                <TextField
                  id="pm-participants"
                  width="full"
                  label={t.before.participants}
                  hint={t.before.participantsHint}
                  value={participants}
                  onChange={(v) => {
                    setParticipants(v);
                    setSavedBefore(false);
                  }}
                />
              </FormGrid>
            </div>
            <Rationale>{t.before.partyHint}</Rationale>

            <h3 className="mt-5 mb-2 font-display text-body font-semibold">{t.before.agenda}</h3>
            {agenda.length === 0 ? (
              <p className="text-table text-muted-foreground">{t.before.agendaEmpty}</p>
            ) : (
              <ol className="list-decimal space-y-1 pl-5 text-table">
                {agenda.map((item, i) => (
                  <li key={`${item}-${i}`}>{item}</li>
                ))}
              </ol>
            )}

            <div className="mt-3 flex flex-wrap items-end gap-3">
              <TextField
                id="pm-agenda"
                width="full"
                label={t.before.agendaAdd}
                value={agendaDraft}
                onChange={setAgendaDraft}
              />
              <Button variant="secondary" iconStart={<IconPlus />} onClick={addAgendaItem}>
                {d.common.add}
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button onClick={() => setSavedBefore(true)}>{t.before.save}</Button>
              {savedBefore && (
                <Callout tone="ok" live tags={["FH-001"]}>
                  {t.before.saved}
                </Callout>
              )}
            </div>

            {/* FSD-002 — the party-meeting document comes from MI's template. */}
            {/*
              US-08's alternative flow: *"Information is supplemented
              afterwards: the registration can be updated both before and after
              the meeting, with full traceability (FF-004, FH-001)."* So there
              is no lock after a phase passes — MI asks for the opposite — and
              what the requirement pairs with that freedom is the change log.
              Saying so is what makes an always-editable record defensible
              rather than merely convenient.
            */}
            <Rationale>{t.editableNote}</Rationale>
          </Panel>
        )}

        {/*
          FSD-002, as a workflow rather than a claim.

          It was a disabled button with the note "Partsträffsdokument skapas
          utifrån dokumentmall" beside it — which states the requirement and
          demonstrates none of it. §4.1 asks for the document to come from a
          template *"där förinmatad information från MIIS ska kunna redigeras"*,
          and the pre-filling is the part worth showing: party, area, date,
          participants and the agenda all arrive from the meeting record.
        */}
        {phase === "before" && (
          <div className="mt-5">
            <DocumentTemplate
              lang={lang}
              heading={t.before.createDocument}
              intro={t.before.templateNote}
              requirements={["FSD-002", "FH-001"]}
              logNote={t.before.templateLogNote}
              {...(meeting.templateDocument ? { created: meeting.templateDocument } : {})}
              fields={[
                { label: t.before.party, value: meeting.party, source: t.before.sourceMeeting },
                {
                  label: t.table.area,
                  value: text(meeting.agreementArea, lang),
                  source: t.before.sourceMeeting,
                },
                { label: t.before.date, value: meeting.date, source: t.before.sourceMeeting },
                {
                  label: t.before.participants,
                  value: meeting.participants.join(", "),
                  source: t.before.sourceMeeting,
                },
              ]}
              variants={[
                {
                  id: "standard",
                  label: t.before.createDocument,
                  fileName: `Partstraff ${meeting.party} ${meeting.date}.docx`,
                  body: [
                    `${t.before.heading} – ${meeting.party}`,
                    "",
                    `${t.before.date}: ${meeting.date}`,
                    `${t.before.location}: ${text(meeting.location, lang)}`,
                    `${t.before.participants}: ${meeting.participants.join(", ")}`,
                    "",
                    `${t.before.purpose}: ${text(meeting.purpose, lang)}`,
                    "",
                    `${t.before.agenda}:`,
                    ...meeting.agenda.map((a, i) => `${i + 1}. ${text(a, lang)}`),
                  ].join("\n"),
                },
              ]}
            />
          </div>
        )}

        {phase === "during" && (
          <>
            <Panel title={t.during.heading} tags={["FF-004"]}>
              <p className="mb-4 text-table">{t.during.intro}</p>

              {notes.length === 0 && (
                <p className="mb-4 text-table text-muted-foreground">{t.during.empty}</p>
              )}
              <ol className="mb-4 space-y-2 text-table">
                {notes.map((note, i) => (
                  <li key={i} className="flex gap-3 border-l-2 border-border pl-3">
                    <span className="shrink-0 tabular-nums text-muted-foreground">{note.at}</span>
                    <span>{text(note.text, lang)}</span>
                  </li>
                ))}
              </ol>

              <label htmlFor="pt-note" className="mb-1 block text-label font-bold">
                {t.during.noteLabel}
              </label>
              <div className="flex flex-wrap items-start gap-2">
                <input
                  id="pt-note"
                  type="text"
                  value={draft}
                  placeholder={t.during.notePlaceholder}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addNote();
                    }
                  }}
                  className="field-input min-w-0 flex-1"
                />
                <Button onClick={addNote} disabled={draft.trim().length === 0}>
                  {t.during.addNote}
                </Button>
              </div>
              <p aria-live="polite" className="mt-2 text-label text-muted-foreground">
                {t.during.noteCount(notes.length)}
              </p>
              <Rationale>{t.during.traceNote}</Rationale>
            </Panel>

            <Panel title={t.demands.heading} tags={["FF-005"]}>
              <p className="mb-3 text-table">{t.demands.intro}</p>
              {demands.length === 0 ? (
                <p className="text-table text-muted-foreground">{t.demands.empty}</p>
              ) : (
                <ul>
                  {demands.map((demand) => (
                    <DemandRow
                      key={demand.id}
                      demand={demand}
                      lang={lang}
                      d={d}
                      onPromote={startPromote}
                      promotingId={promoting}
                      term={term}
                      onTermChange={setTerm}
                      onConfirm={confirmPromote}
                      onCancel={() => setPromoting(null)}
                    />
                  ))}
                </ul>
              )}
              <div className="mt-4 border-t border-border pt-4">
                {adding ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="yrk-topic" className="mb-1 block text-label font-bold">
                        {t.demands.topicLabel}
                      </label>
                      <input
                        id="yrk-topic"
                        type="text"
                        value={topic}
                        placeholder={t.demands.topicPlaceholder}
                        onChange={(e) => setTopic(e.target.value)}
                        className="field-input"
                      />
                    </div>

                    {/*
                      FF-005's flag, as a radio group rather than a toggle: the
                      two are alternatives with names, not an on/off, and a
                      fieldset is what tells a screen reader they belong to one
                      question.
                    */}
                    <fieldset>
                      <legend className="mb-1 text-label font-bold">{t.demands.kindLabel}</legend>
                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        {(["coordinated", "own"] as DemandKind[]).map((k) => (
                          <label key={k} className="flex min-h-11 items-center gap-2 text-table">
                            <input
                              type="radio"
                              name="yrk-kind"
                              value={k}
                              checked={kind === k}
                              onChange={() => setKind(k)}
                              className="size-5"
                            />
                            {DEMAND_KIND_LABEL[lang][k]}
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    {/*
                      Only a coordinated demand has backing to record, so the
                      picker appears with the flag rather than sitting there
                      disabled — FF-005 ties the two together.
                    */}
                    {kind === "coordinated" && (
                      <fieldset>
                        <legend className="mb-1 text-label font-bold">
                          {t.demands.backingLabel}
                        </legend>
                        <div className="flex flex-wrap gap-2">
                          {unions.map((union) => (
                            <Chip
                              key={union}
                              pressed={backing.includes(union)}
                              onToggle={() =>
                                setBacking((b) =>
                                  b.includes(union) ? b.filter((x) => x !== union) : [...b, union],
                                )
                              }
                            >
                              {union}
                            </Chip>
                          ))}
                        </div>
                        <p aria-live="polite" className="mt-2 text-label text-muted-foreground">
                          {t.demands.backingCount(backing.length)}
                        </p>
                      </fieldset>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <Button onClick={addDemand} disabled={topic.trim().length === 0}>
                        {t.demands.save}
                      </Button>
                      <Button variant="secondary" onClick={() => setAdding(false)}>
                        {t.demands.cancel}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="secondary" onClick={() => setAdding(true)}>
                      {t.demands.add}
                    </Button>
                    <span aria-live="polite" className="text-label text-muted-foreground">
                      {t.demands.watchwordCount(promoted, demands.length)}
                    </span>
                  </div>
                )}
              </div>
            </Panel>
          </>
        )}

        {phase === "after" && (
          <Panel title={t.after.heading} tags={["FF-004", "FD-001", "FH-001"]}>
            {meeting.summary ? (
              <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2">
                <Field label={t.after.summary} value={text(meeting.summary, lang)} />
                <Field
                  label={t.after.assessment}
                  value={meeting.assessment ? text(meeting.assessment, lang) : d.common.none}
                  hint={t.after.assessmentHint}
                />
              </div>
            ) : (
              <Callout tone="attention">{t.after.notHeld}</Callout>
            )}

            {meeting.documents.length > 0 && (
              <>
                <h3 className="mt-5 mb-2 font-display text-body font-semibold">
                  {t.after.documents}
                </h3>
                <ul className="space-y-1 text-table">
                  {meeting.documents.map((doc) => (
                    <li key={doc} className="min-w-0 break-all">
                      <span className="font-semibold text-primary underline underline-offset-2">
                        {doc}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/*
              FF-004 names printing explicitly — *"registrering och utskrift av
              partsträffsinformation"* — and the control was disabled with "Ej
              aktiv i demon" on the one screen whose requirement says the word.
              Printing is the export that runs without a server everywhere else
              in the system; there was nothing to refuse.
            */}
            <div className="print-hide mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
              <PrintButton lang={lang} />
              <Button
                variant="secondary"
                disabled
                disabledReason={d.common.uploadNeedsStore}
              >
                {t.after.upload}
              </Button>
              <ReqTags ids={["FF-004", "FD-001"]} />
            </div>
            <Rationale>{t.after.logNote}</Rationale>
          </Panel>
        )}
      </div>
    </>
  );
}
