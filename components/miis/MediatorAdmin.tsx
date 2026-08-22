"use client";

import { useState } from "react";

import type { Lang } from "@/lib/domain/lang";
import {
  MEDIATION_TYPE_LABEL,
  type MediationType,
  type Mediator,
} from "@/lib/domain/mediation";
import { dictionary } from "@/lib/i18n";
import { DataTable, type Column, type Row } from "./DataTable";
import { IconCheck, IconPlus } from "./icons";
import { Badge, Button, Callout, Chip, FormGrid, Panel, Rationale, TextField } from "./primitives";

/**
 * The mediator register, editable — Bilaga 1 §3.1 and FF-009.
 *
 * §3.1 gives Medlaradministratör the verb in two places: *"Registrerar och
 * **redigerar** medlare"*, and the access column *"Läsa, skriva, **redigera**
 * medlare"*. The register could be read and added to, and that was all: an
 * administrator whose mediator changed telephone number, or who needed to take
 * a retired mediator off the list of people MI can appoint, had nowhere to do
 * it. A register that only grows is not a register anybody maintains.
 *
 * **What is editable is what changes about a mediator**, and it is deliberately
 * not everything on the row:
 *
 * - Contact details and the mediation types they take assignments in — the
 *   facts that go out of date.
 * - Active or not. Never deleted: FF-009 asks for statistics per mediator, and
 *   a removed mediator would take their assignment history with them. An
 *   inactive one is not offered when MI appoints, and their previous mediations
 *   still count.
 * - **The statistics are not editable and cannot be**, because they are derived
 *   from the assignment history rather than stored — the same rule the
 *   agreement's organisationsgrad follows. Editing "uppdrag: 7" would be typing
 *   a claim about work that either happened or did not.
 *
 * The name is editable too, and that is not the same act as FA-006's party name
 * change: a party's former name has to keep resolving in historical agreements,
 * so it is versioned. A mediator is a person, and a person who marries has one
 * name.
 *
 * **Adding and changing are one form, because they are one set of fields.**
 * They were two: an inline form above the table for *Ändra*, and a second panel
 * below the table, with its own disclosure button and its own confirmation, for
 * *Lägg till*. Same five fields, two shapes, two places, forty rows apart — the
 * screen taught the administrator the form twice and then disagreed with itself
 * about where it lived. Registering a mediator and correcting one differ in
 * exactly two ways, and both are said rather than built: the heading names
 * which act is in progress, and a new mediator has no assignment history to
 * show yet.
 *
 * **The row being changed says so.** A form that opens above an eight-column
 * register, headed only by a name, leaves "which of these four am I editing" to
 * be answered by reading. The row carries the state word, which is the same
 * reason `Stepper` keeps progress and selection apart.
 *
 * **And an act that creates ends on the thing it created.** Saving used to
 * replace the form with a confirmation and a button back to an empty form; the
 * mediator it had just registered was nowhere. The new row is in the register,
 * marked, and the register is what the administrator is left looking at.
 */

/** Fixed, so a screenshot taken twice is the same image. */
const TODAY = "2027-06-14";

const TYPES: MediationType[] = ["special", "standing"];

export function MediatorAdmin({
  mediators: initial,
  stats,
  lang,
}: {
  mediators: Mediator[];
  /**
   * The derived figures, computed on the server.
   *
   * `mediatorStats` lives in `lib/data/`, which a client component may not
   * import — so the page computes them and hands them down by id. They do not
   * change when contact details are edited, which is the point of them being
   * derived from history.
   */
  stats: Record<
    string,
    {
      assignments: number;
      firstChair: number;
      secondChair: number;
      latestYear?: number;
      areas: string[];
    }
  >;
  lang: Lang;
}) {
  const d = dictionary(lang);
  const t = d.medlare;

  const [mediators, setMediators] = useState(initial);
  /* `null` closed, `"new"` registering, otherwise the id being corrected. */
  const [editing, setEditing] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  /* The row to mark after a save, so the act ends on what it produced. */
  const [touched, setTouched] = useState<string | null>(null);
  const [added, setAdded] = useState<string[]>([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [types, setTypes] = useState<MediationType[]>([]);

  const isNew = editing === "new";

  function open(m: Mediator) {
    setEditing(m.id);
    setName(m.name);
    setPhone(m.phone);
    setEmail(m.email);
    setTypes([...m.types]);
    setSaved(null);
  }

  function openNew() {
    setEditing("new");
    setName("");
    setPhone("");
    setEmail("");
    /* Särskild medling is what MI appoints for most often; the administrator
       unticks it rather than starting from nothing. */
    setTypes(["special"]);
    setSaved(null);
  }

  function save(id: string) {
    const clean = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      types: [...types],
    };
    if (id === "new") {
      /*
        The id MI's own register would allocate. Sequential rather than random
        so a screenshot taken twice is the same image, and prefixed the way the
        sample data is.
      */
      const newId = `ME-${String(initial.length + added.length + 1).padStart(3, "0")}`;
      /* An empty history, which is the honest state and the reason the
         statistics columns read 0 rather than nothing: FF-009's figures are
         derived from the cases a mediator is appointed to, and this one has not
         been appointed to any yet. */
      setMediators((list) => [...list, { id: newId, active: true, history: [], ...clean }]);
      setAdded((list) => [...list, newId]);
      setTouched(newId);
      setSaved(t.add.savedNote(clean.name));
    } else {
      setMediators((list) => list.map((m) => (m.id === id ? { ...m, ...clean } : m)));
      setTouched(id);
      setSaved(t.edit.savedNote(clean.name, TODAY));
    }
    setEditing(null);
  }

  function toggleActive(m: Mediator) {
    setMediators((list) =>
      list.map((x) => (x.id === m.id ? { ...x, active: !x.active } : x)),
    );
    setSaved(m.active ? t.edit.deactivatedNote(m.name) : t.edit.activatedNote(m.name));
  }

  const columns: Column[] = [
    { key: "name", header: t.table.name, sortable: true },
    { key: "types", header: t.table.types, sortable: true },
    { key: "assignments", header: t.table.assignments, numeric: true, sortable: true },
    { key: "first", header: t.table.firstChair, numeric: true, sortable: true },
    { key: "second", header: t.table.secondChair, numeric: true, sortable: true },
    { key: "latest", header: t.table.latest, numeric: true, sortable: true },
    { key: "areas", header: t.table.areas },
    { key: "status", header: t.table.status, sortable: true },
    { key: "action", header: t.edit.action },
  ];

  const rows: Row[] = mediators.map((m) => {
    const s = stats[m.id] ?? {
      assignments: 0,
      firstChair: 0,
      secondChair: 0,
      areas: [],
    };
    const typeLabels = m.types.map((x) => MEDIATION_TYPE_LABEL[lang][x]).join(" · ");
    return {
      key: m.id,
      cells: [
        /*
          The contact under the name rather than in a column of its own.

          Ten columns did not fit: at 1440 the content column is ~1120px and the
          register's own headers needed 1376, so `DataTable` did what it is
          built to do and scrolled — which put Status and Åtgärd, the two
          columns this rework exists for, permanently off the right edge. A
          telephone number and an e-mail address are things an administrator
          reads off the row they have already found; they are not things anyone
          sorts a register by.
        */
        <span key="n" className="min-w-0">
          <span className="block font-semibold">{m.name}</span>
          <span className="block whitespace-nowrap text-label text-muted-foreground">
            {m.phone}
          </span>
          <span className="block break-all text-label text-muted-foreground">{m.email}</span>
        </span>,
        typeLabels,
        s.assignments,
        s.firstChair,
        s.secondChair,
        <span key="y" className="tabular-nums">
          {s.latestYear ?? d.common.none}
        </span>,
        s.areas.join(", "),
        <span key="s" className="flex flex-wrap items-center gap-2">
          <Badge tone={m.active ? "ok" : "neutral"}>{m.active ? t.active : t.inactive}</Badge>
          {/* Which of the four is open in the form, and which one the last save
              produced — both answered on the row rather than by reading the
              heading forty pixels above the table. */}
          {editing === m.id && <Badge tone="attention">{t.edit.editingNow}</Badge>}
          {added.includes(m.id) && <Badge tone="attention">{t.add.newBadge}</Badge>}
        </span>,
        /*
          Both acts on the row, because the administrator is looking at the
          person, their assignment history and their current status — moving to
          a page of its own to change a phone number would lose all three.
        */
        <span key="a" className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => open(m)}
            disabled={editing === m.id}
            disabledReason={t.edit.alreadyOpen}
          >
            {t.edit.open}
          </Button>
          <Button
            size="sm"
            variant={m.active ? "danger" : "secondary"}
            onClick={() => toggleActive(m)}
          >
            {m.active ? t.edit.deactivate : t.edit.activate}
          </Button>
        </span>,
      ],
      sort: [
        m.name,
        typeLabels,
        s.assignments,
        s.firstChair,
        s.secondChair,
        s.latestYear ?? 0,
        s.areas.join(", "),
        m.active ? "1" : "0",
        "",
      ],
    };
  });

  const open_ = mediators.find((m) => m.id === editing);
  const formOpen = isNew || Boolean(open_);

  return (
    <Panel
      title={t.register.heading}
      tags={["FF-009", "FH-001", "D-004"]}
      /*
        Registering a mediator is the register's own primary act, so it is in
        the register's header — not a second panel below the table with a
        disclosure button of its own. It is hidden while the form is open
        because there is one form: offering *Lägg till* over a half-typed
        correction offers to discard it without saying so.
      */
      action={
        formOpen ? undefined : (
          <Button onClick={openNew} iconStart={<IconPlus />}>
            {t.add.open}
          </Button>
        )
      }
    >
      <p className="mb-4 max-w-4xl text-table">{t.register.intro}</p>

      {saved && (
        <div className="mb-4">
          <Callout tone="ok" live tags={["FF-009", "FH-001"]}>
            {saved}
          </Callout>
        </div>
      )}

      {/*
        The form above the table rather than inside the row: five fields do not
        fit in a cell of a ten-column register, and a row that grew to hold
        them would push every other column into a sliver.
      */}
      {formOpen && (
        <div className="print-hide mb-5 border-b border-border pb-5">
          {/*
            The heading is the only thing that differs between the two acts, and
            it has to: "Ny medlare" and "Ändrar Gunilla Runnquist" are the same
            five fields answering two different questions.
          */}
          <h3 className="mi-kicker mb-3 text-muted-foreground">
            {isNew ? t.add.heading : t.edit.heading(open_!.name)}
          </h3>
          {isNew && <p className="mb-3 max-w-2xl text-table">{t.add.intro}</p>}
          <FormGrid>
            <TextField
              id="me-name"
              label={t.add.name}
              width="medium"
              required
              lang={lang}
              value={name}
              onChange={setName}
            />
            <TextField
              id="me-phone"
              label={t.add.phone}
              width="short"
              numeric
              value={phone}
              onChange={setPhone}
            />
            <TextField
              id="me-email"
              label={t.add.email}
              width="medium"
              value={email}
              onChange={setEmail}
            />
          </FormGrid>

          <div className="mt-4">
            <p className="mb-2 text-label font-bold">{t.add.types}</p>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((x) => (
                <Chip
                  key={x}
                  pressed={types.includes(x)}
                  onToggle={() =>
                    setTypes((list) =>
                      list.includes(x) ? list.filter((y) => y !== x) : [...list, x],
                    )
                  }
                >
                  {MEDIATION_TYPE_LABEL[lang][x]}
                </Chip>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              iconStart={<IconCheck />}
              onClick={() => save(isNew ? "new" : open_!.id)}
              disabled={name.trim().length === 0 || types.length === 0}
              disabledReason={name.trim().length === 0 ? t.edit.nameRequired : t.add.noTypes}
            >
              {d.common.save}
            </Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              {d.common.cancel}
            </Button>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        rows={rows}
        lang={lang}
        caption={t.register.heading}
        minWidth="70rem"
      />
      <Rationale>{t.register.privacyNote}</Rationale>
      <Rationale>{t.edit.derivedNote}</Rationale>
    </Panel>
  );
}
