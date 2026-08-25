"use client";

import { useState, type ReactNode } from "react";

import type { Lang } from "@/lib/domain/lang";
import {
  MEDIATION_TYPE_LABEL,
  MEDIATOR_POSITION_LABEL,
  type MediationOutcome,
  type MediationType,
  type MediatorPosition,
  type MediatorRef,
} from "@/lib/domain/mediation";
import { amount } from "@/lib/format";
import { dictionary } from "@/lib/i18n";
import { EditablePanel } from "./EditablePanel";
import { IconClose, IconPlus } from "./icons";
import { Button, Callout, Field, FormGrid, Panel, Rationale, TextField,
  EmptyState,
} from "./primitives";
import { Select } from "./Select";
import { Toggle } from "./Toggle";

/**
 * Editing a mediation case — Bilaga 1 §3.1, *"registrerar och **redigerar**
 * medling och medlingsbeslut"*.
 *
 * The case view had three controls and all three were `disabled` with *"Ej
 * aktiv i demon"*: link an agreement (FF-008), appoint a mediator (FF-009),
 * and one on the outcome. The outcome panel itself only rendered when an
 * outcome already existed — so the one act that ends a mediation case, and
 * produces the statistics MI publishes, could be read on a finished case and
 * never performed on a live one.
 *
 * Three pieces, matching the three requirements:
 *
 * - **Mediators (FF-009).** Appointed from the register, with a position —
 *   ettan or tvåan — because that distinction is what FF-009's statistics
 *   count. Only mediators who are active and take this case's mediation type
 *   are offered: a picker that lists someone MI cannot appoint is a picker that
 *   has to be undone.
 * - **Linked agreements (FF-008).** *"Ett medlingsärende ska kunna kopplas till
 *   flera avtal."* One dispute reaches several agreement areas, and the link is
 *   how the register answers *which agreements is this mediation about*.
 * - **The outcome (FF-010).** All five fields the requirement names, and the
 *   last three appear only when there was industrial action — asking how many
 *   working days were lost to a strike that did not happen is asking for a zero
 *   that means nothing.
 *
 * **What is not editable is the general director's decision.** The decision
 * number, its date and the document come from a GD-beslut that arrived at MI as
 * a document; a mediation administrator recording a different date than the
 * decision carries would be correcting the decision rather than the register.
 * The case view keeps showing them, and this component does not touch them.
 */

/** Fixed, so a screenshot taken twice is the same image. */
const TODAY = "2027-06-14";
const DECIDING_OFFICER = "Per Persson";

export function CaseMediators({
  mediators: initial,
  candidates,
  type,
  lang,
}: {
  mediators: MediatorRef[];
  /** The register, already narrowed to who may be appointed to this case. */
  candidates: { id: string; name: string; previousAssignments: number }[];
  type: MediationType;
  lang: Lang;
}) {
  const d = dictionary(lang);
  const c = d.mediationCase;

  const [mediators, setMediators] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [pick, setPick] = useState("");
  const [position, setPosition] = useState<MediatorPosition>("first-chair");
  const [note, setNote] = useState<string | null>(null);

  const free = candidates.filter((x) => !mediators.some((m) => m.id === x.id));

  function add() {
    const chosen = free.find((x) => x.id === pick);
    if (!chosen) return;
    setMediators((list) => [
      ...list,
      {
        id: chosen.id,
        name: chosen.name,
        position,
        previousAssignments: chosen.previousAssignments,
      },
    ]);
    setNote(c.admin.mediatorAdded(chosen.name, MEDIATOR_POSITION_LABEL[lang][position]));
    setPick("");
    setAdding(false);
  }

  function remove(m: MediatorRef) {
    setMediators((list) => list.filter((x) => x.id !== m.id));
    setNote(c.admin.mediatorRemoved(m.name));
  }

  return (
    <Panel title={c.mediators} tags={["FF-009", "FH-001"]}>
      {note && (
        <div className="mb-4">
          <Callout tone="ok" live tags={["FF-009", "FH-001"]}>
            {note}
          </Callout>
        </div>
      )}

      {mediators.length === 0 ? (
        <EmptyState text={c.noMediators} />
      ) : (
        <ul className="space-y-2">
          {mediators.map((m) => (
            /*
              No `flex-wrap` on this row. With it, the removal control dropped
              onto a line of its own under every entry — three stacked danger
              buttons for a list of three mediators, which gives the loudest
              treatment in the system to the least likely act. Without it the
              text wraps and the button stays where it belongs, at the end.
            */
            <li key={m.id} className="flex items-start justify-between gap-3 text-table">
              <span className="min-w-0 flex-1">
                {m.name} · {MEDIATION_TYPE_LABEL[lang][type]} ·{" "}
                {c.position(MEDIATOR_POSITION_LABEL[lang][m.position])} ·{" "}
                {c.previousAssignments(m.previousAssignments)}
              </span>
              <Button
                size="sm"
                variant="danger"
                iconStart={<IconClose />}
                onClick={() => remove(m)}
              >
                {c.admin.remove}
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="print-hide mt-4 border-t border-border pt-4">
        {adding ? (
          <>
            <FormGrid>
              {/*
                Only who MI can actually appoint. The register's inactive
                mediators and those who do not take this mediation type are
                filtered out by the page — an option that has to be undone after
                it is chosen is worse than one that was never offered.
              */}
              <Select
                id="mc-mediator"
                label={c.admin.mediatorLabel}
                width="medium"
                value={pick}
                onChange={setPick}
                options={[
                  { id: "", label: c.admin.mediatorPlaceholder },
                  ...free.map((x) => ({ id: x.id, label: x.name })),
                ]}
              />
              <Select
                id="mc-position"
                label={c.admin.positionLabel}
                width="medium"
                value={position}
                onChange={(v) => setPosition(v as MediatorPosition)}
                options={[
                  { id: "first-chair", label: MEDIATOR_POSITION_LABEL[lang]["first-chair"] },
                  { id: "second-chair", label: MEDIATOR_POSITION_LABEL[lang]["second-chair"] },
                ]}
              />
            </FormGrid>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button onClick={add} disabled={!pick} disabledReason={c.admin.pickMediator}>
                {c.admin.appoint}
              </Button>
              <Button variant="ghost" onClick={() => setAdding(false)}>
                {d.common.cancel}
              </Button>
            </div>
          </>
        ) : (
          <Button
            variant="secondary"
            iconStart={<IconPlus />}
            onClick={() => setAdding(true)}
            disabled={free.length === 0}
            disabledReason={c.admin.noCandidates}
          >
            {c.addMediator}
          </Button>
        )}
      </div>
      <Rationale>{c.admin.mediatorNote}</Rationale>
    </Panel>
  );
}

export function CaseAgreements({
  linked: initial,
  candidates,
  rowFor,
  lang,
}: {
  linked: { id: string; label: string }[];
  candidates: { id: string; name: string }[];
  /**
   * The rendered row for every agreement that could be linked.
   *
   * Server-rendered, because the row carries FR-012's status marker and the
   * validity period — decisions that belong on the server and must not be
   * re-made in the browser. The client decides which ids are shown and nothing
   * else, the same arrangement the public search uses.
   */
  rowFor: Record<string, ReactNode>;
  lang: Lang;
}) {
  const d = dictionary(lang);
  const c = d.mediationCase;

  const [linked, setLinked] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [pick, setPick] = useState("");
  const [note, setNote] = useState<string | null>(null);

  const free = candidates.filter((a) => !linked.some((l) => l.id === a.id));

  return (
    <Panel title={c.linkedAgreements(linked.length)} tags={["FF-008", "FH-001"]}>
      {note && (
        <div className="mb-4">
          <Callout tone="ok" live tags={["FF-008", "FH-001"]}>
            {note}
          </Callout>
        </div>
      )}

      {linked.length === 0 ? (
        <EmptyState text={c.admin.noAgreements} />
      ) : (
        <ul className="space-y-3">
          {linked.map((l) => (
            <li key={l.id} className="flex items-start justify-between gap-3">
              <span className="min-w-0 flex-1">{rowFor[l.id] ?? l.label}</span>
              <Button
                size="sm"
                variant="danger"
                iconStart={<IconClose />}
                onClick={() => {
                  setLinked((list) => list.filter((x) => x.id !== l.id));
                  setNote(c.admin.agreementRemoved(l.label));
                }}
              >
                {c.admin.remove}
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="print-hide mt-4 border-t border-border pt-4">
        {adding ? (
          <>
            <FormGrid>
              <Select
                id="mc-agreement"
                label={c.admin.agreementLabel}
                width="full"
                value={pick}
                onChange={setPick}
                options={[
                  { id: "", label: c.admin.agreementPlaceholder },
                  ...free.map((a) => ({ id: a.id, label: a.name })),
                ]}
              />
            </FormGrid>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button
                onClick={() => {
                  const chosen = free.find((a) => a.id === pick);
                  if (!chosen) return;
                  setLinked((list) => [...list, { id: chosen.id, label: chosen.name }]);
                  setNote(c.admin.agreementAdded(chosen.name));
                  setPick("");
                  setAdding(false);
                }}
                disabled={!pick}
                disabledReason={c.admin.pickAgreement}
              >
                {c.admin.link}
              </Button>
              <Button variant="ghost" onClick={() => setAdding(false)}>
                {d.common.cancel}
              </Button>
            </div>
          </>
        ) : (
          <Button
            variant="secondary"
            iconStart={<IconPlus />}
            onClick={() => setAdding(true)}
            disabled={free.length === 0}
            disabledReason={c.admin.noAgreementCandidates}
          >
            {c.linkAgreement}
          </Button>
        )}
      </div>
      <Rationale>{c.linkedNote}</Rationale>
    </Panel>
  );
}

/**
 * FF-010's outcome — *"registrering av utfall"*, all five fields.
 *
 * It rendered only when an outcome already existed, so a live case had no way
 * to record one: the act that ends a mediation was demonstrable only on a
 * mediation that had already ended.
 */
export function CaseOutcome({
  outcome: initial,
  type,
  lang,
}: {
  outcome: MediationOutcome | undefined;
  type: MediationType;
  lang: Lang;
}) {
  const d = dictionary(lang);
  const c = d.mediationCase;

  const [outcome, setOutcome] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const [outcomeType, setOutcomeType] = useState<MediationType>(initial?.mediationType ?? type);
  const [action, setAction] = useState(initial?.industrialAction ?? false);
  const [actionType, setActionType] = useState(initial?.industrialActionType ?? "");
  const [lostDays, setLostDays] = useState(
    initial?.lostWorkingDays === undefined ? "" : String(initial.lostWorkingDays),
  );
  const [affected, setAffected] = useState(
    initial?.affectedEmployees === undefined ? "" : String(initial.affectedEmployees),
  );

  const num = (v: string) => {
    const n = Number(v.replace(/\s/g, ""));
    return v.trim() === "" || Number.isNaN(n) ? undefined : n;
  };

  function cancel() {
    setOutcomeType(outcome?.mediationType ?? type);
    setAction(outcome?.industrialAction ?? false);
    setActionType(outcome?.industrialActionType ?? "");
    setLostDays(outcome?.lostWorkingDays === undefined ? "" : String(outcome.lostWorkingDays));
    setAffected(outcome?.affectedEmployees === undefined ? "" : String(outcome.affectedEmployees));
    setEditing(false);
  }

  function save() {
    setOutcome({
      mediationType: outcomeType,
      industrialAction: action,
      /* The three that only exist when there was action — see below. */
      ...(action && actionType.trim() ? { industrialActionType: actionType.trim() } : {}),
      ...(action && num(lostDays) !== undefined ? { lostWorkingDays: num(lostDays)! } : {}),
      ...(action && num(affected) !== undefined ? { affectedEmployees: num(affected)! } : {}),
    });
    setSavedAt(TODAY);
    setEditing(false);
  }

  return (
    <EditablePanel
      title={c.outcome}
      tags={["FF-010", "FH-001"]}
      lang={lang}
      editing={editing}
      savedAt={savedAt}
      onEdit={() => setEditing(true)}
      onCancel={cancel}
      onSave={save}
    >
      {editing ? (
        <>
          <FormGrid>
            <Select
              id="mo-type"
              label={c.outcomeType}
              width="medium"
              value={outcomeType}
              onChange={(v) => setOutcomeType(v as MediationType)}
              options={[
                { id: "special", label: MEDIATION_TYPE_LABEL[lang].special },
                { id: "standing", label: MEDIATION_TYPE_LABEL[lang].standing },
              ]}
            />
          </FormGrid>
          <div className="mt-4">
            <Toggle
              id="mo-action"
              label={c.industrialAction}
              lang={lang}
              checked={action}
              onChange={setAction}
            />
          </div>
          {/*
            The last three appear only when there was industrial action.
            Asking how many working days a strike cost when there was no strike
            invites a zero, and a zero in that column is a measurement rather
            than an absence — it would be counted in every report that sums it.
          */}
          {action && (
            <div className="mt-4">
              <FormGrid>
                <TextField
                  id="mo-action-type"
                  label={c.industrialActionType}
                  width="medium"
                  value={actionType}
                  onChange={setActionType}
                  placeholder={c.admin.actionTypePlaceholder}
                />
                <TextField
                  id="mo-lost"
                  label={c.lostWorkingDays}
                  width="short"
                  numeric
                  value={lostDays}
                  onChange={setLostDays}
                />
                <TextField
                  id="mo-affected"
                  label={c.affectedEmployees}
                  width="short"
                  numeric
                  value={affected}
                  onChange={setAffected}
                />
              </FormGrid>
            </div>
          )}
        </>
      ) : outcome ? (
        <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-5">
          <Field label={c.outcomeType} value={MEDIATION_TYPE_LABEL[lang][outcome.mediationType]} />
          <Field
            label={c.industrialAction}
            value={outcome.industrialAction ? d.common.yes : d.common.no}
          />
          <Field
            label={c.industrialActionType}
            value={outcome.industrialActionType ?? d.common.none}
          />
          <Field
            label={c.lostWorkingDays}
            value={
              outcome.lostWorkingDays ? amount(outcome.lostWorkingDays, lang) : d.common.none
            }
          />
          <Field
            label={c.affectedEmployees}
            value={
              outcome.affectedEmployees ? amount(outcome.affectedEmployees, lang) : d.common.none
            }
          />
        </div>
      ) : (
        <EmptyState text={c.admin.noOutcome} />
      )}
      <Rationale>{c.outcomeNote}</Rationale>
    </EditablePanel>
  );
}

/**
 * FE-001 — klarmarkera beslutet, which is the act the requirement is written
 * around.
 *
 * *"Systemet ska ha en funktion som gör det möjligt att skicka notiser och
 * påminnelser via epost, till exempel skickas notifierings-epost till
 * medlaradministratör **när ett medlingsbeslut klarmarkerats**."* The control
 * was `disabled` with "Ej aktiv i demon", so the trigger the requirement names
 * could not be pulled — the notification was described beside a button that
 * refused to send it.
 *
 * Marking it is reversible here, which it would not be in production. The demo
 * has to be runnable twice by an evaluator who has already pressed it once, and
 * the alternative is a screen that can only be shown in one state.
 */
export function CaseDecision({ lang }: { lang: Lang }) {
  const d = dictionary(lang);
  const c = d.mediationCase;

  const [finalised, setFinalised] = useState<{ date: string; by: string } | null>(null);

  return (
    <div className="mt-4">
      {finalised ? (
        <>
          <Callout tone="ok" live label={c.admin.finalisedLabel} tags={["FE-001", "FH-002"]}>
            {c.admin.finalisedNote(finalised.date, finalised.by)}
          </Callout>
          <div className="print-hide mt-3">
            <Button variant="secondary" onClick={() => setFinalised(null)}>
              {c.admin.reopenDecision}
            </Button>
          </div>
        </>
      ) : (
        <div className="print-hide flex flex-wrap items-center gap-4">
          <Button onClick={() => setFinalised({ date: TODAY, by: DECIDING_OFFICER })}>
            {c.finalise}
          </Button>
          <span className="text-label text-muted-foreground">{c.finaliseNote}</span>
        </div>
      )}
    </div>
  );
}
