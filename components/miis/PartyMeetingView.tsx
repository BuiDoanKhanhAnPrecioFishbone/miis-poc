"use client";

import { useState } from "react";

import type { Lang } from "@/lib/domain/lang";
import { t as text } from "@/lib/domain/lang";
import type { BargainingDemand, MeetingPhase, PartyMeeting } from "@/lib/domain/party-meeting";
import { DEMAND_KIND_LABEL, phaseState, watchwordCount } from "@/lib/domain/party-meeting";
import { dictionary } from "@/lib/i18n";
import { Tabs } from "./Select";
import { Badge, Button, Callout, Chip, Field, Panel, Rationale, ReqTag, ReqTags } from "./primitives";

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
}: {
  demand: BargainingDemand;
  lang: Lang;
  d: ReturnType<typeof dictionary>;
  onPromote: (id: string) => void;
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

export function PartyMeetingView({ meeting, lang }: { meeting: PartyMeeting; lang: Lang }) {
  const d = dictionary(lang);
  const t = d.partstraffar;
  const [phase, setPhase] = useState<MeetingPhase>(
    meeting.state === "planned" ? "before" : meeting.state === "held" ? "during" : "after",
  );
  const [notes, setNotes] = useState(meeting.notes);
  const [draft, setDraft] = useState("");
  const [demands, setDemands] = useState(meeting.demands);

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

  function promote(id: string) {
    setDemands((list) => list.map((x) => (x.id === id ? { ...x, watchword: true } : x)));
  }

  const promoted = watchwordCount({ ...meeting, demands });

  return (
    <>
      <Tabs
        label={t.phaseLabel}
        value={phase}
        onChange={(id) => setPhase(id as MeetingPhase)}
        tabs={PHASES.map((p) => ({
          id: p,
          label: `${t.phase[p]}${phaseState(meeting, p) === "done" ? " ✓" : ""}`,
        }))}
      />

      <div className="mt-5 space-y-5">
        {phase === "before" && (
          <Panel title={t.before.heading} tags={["FF-004", "FSD-002"]}>
            <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2">
              <Field label={t.before.purpose} value={text(meeting.purpose, lang)} />
              <Field label={t.before.participants} value={meeting.participants.join(" · ")} />
            </div>

            <h3 className="mt-5 mb-2 font-display text-body font-semibold">{t.before.agenda}</h3>
            <ol className="list-decimal space-y-1 pl-5 text-table">
              {meeting.agenda.map((item, i) => (
                <li key={i}>{text(item, lang)}</li>
              ))}
            </ol>

            {/* FSD-002 — the party-meeting document comes from MI's template. */}
            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
              {meeting.templateDocument ? (
                <>
                  <Badge tone="ok">{t.before.documentCreated}</Badge>
                  <span className="min-w-0 break-all font-semibold text-primary underline underline-offset-2">
                    {meeting.templateDocument}
                  </span>
                </>
              ) : (
                <Button variant="secondary">{t.before.createDocument}</Button>
              )}
              <ReqTag id="FSD-002" />
            </div>
            <Rationale>{t.before.templateNote}</Rationale>
          </Panel>
        )}

        {phase === "during" && (
          <>
            <Panel title={t.during.heading} tags={["FF-004"]}>
              <p className="mb-4 text-table">{t.during.intro}</p>

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
                      onPromote={promote}
                    />
                  ))}
                </ul>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4">
                <Button variant="secondary">{t.demands.add}</Button>
                <span aria-live="polite" className="text-label text-muted-foreground">
                  {t.demands.watchwordCount(promoted, demands.length)}
                </span>
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

            {/* FF-004 names printing explicitly — "registrering och utskrift". */}
            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
              <Button variant="secondary">{t.after.print}</Button>
              <Button variant="secondary">{t.after.upload}</Button>
              <ReqTags ids={["FF-004", "FD-001"]} />
            </div>
            <Rationale>{t.after.logNote}</Rationale>
          </Panel>
        )}
      </div>
    </>
  );
}
