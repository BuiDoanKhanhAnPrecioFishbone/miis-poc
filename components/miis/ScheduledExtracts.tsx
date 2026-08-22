"use client";

import { useState } from "react";

import type { Lang } from "@/lib/domain/lang";
import { REPORTS, reportLabel } from "@/lib/domain/report";
import { dictionary } from "@/lib/i18n";
import { DataTable, type Column, type Row } from "./DataTable";
import { Select } from "./Select";
import { IconCheck, IconPlus } from "./icons";
import { Badge, Button, Callout, FormGrid, Panel, Rationale, ReqTag, TextField } from "./primitives";

export interface ScheduledExtract {
  id: string;
  report: string;
  schedule: string;
  recipients: string;
  lastRun: string;
  active: boolean;
}

/**
 * FE-003 — recurring extracts, maintained rather than displayed.
 *
 * The schedule was a read-only table with *Nytt schemalagt uttag* underneath it,
 * `disabled`, reading "Ej aktiv i demon" — a phrase that states a fact about the
 * demo, which is never the answer to why a system refuses something. FE-003 is
 * *"schemalagda rapportuttag"*; a list an administrator can only read is not a
 * schedule anybody keeps.
 *
 * **Paused, never deleted.** A schedule that has run has sent e-mails, and those
 * are in the händelselogg (FH-002) — the same reason a user is deactivated
 * rather than removed. What is paused stops sending and goes on being
 * accountable for what it sent.
 *
 * The report is chosen from the catalogue rather than typed, because a schedule
 * naming a report that does not exist is a schedule that fails at 03:00 on a
 * Monday with nobody watching.
 */
export function ScheduledExtracts({
  initial,
  lang,
}: {
  initial: ScheduledExtract[];
  lang: Lang;
}) {
  const d = dictionary(lang);
  const t = d.rapporter.scheduled;

  const [items, setItems] = useState(initial);
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const [report, setReport] = useState(REPORTS[0]!.id);
  const [schedule, setSchedule] = useState("");
  const [recipients, setRecipients] = useState("");

  const reportName = (id: string) => {
    const found = REPORTS.find((r) => r.id === id);
    return found ? reportLabel(found, lang) : id;
  };

  function save() {
    const id = `SCH-${items.length + 1}`;
    setItems((list) => [
      ...list,
      {
        id,
        report: reportName(report),
        schedule: schedule.trim(),
        recipients: recipients.trim(),
        /* Never run yet, and that is a state rather than a blank. */
        lastRun: d.common.none,
        active: true,
      },
    ]);
    setNote(t.addedNote(reportName(report)));
    setOpen(false);
    setSchedule("");
    setRecipients("");
  }

  function togglePaused(item: ScheduledExtract) {
    setItems((list) => list.map((x) => (x.id === item.id ? { ...x, active: !x.active } : x)));
    setNote(item.active ? t.pausedNote(item.report) : t.resumedNote(item.report));
  }

  const columns: Column[] = [
    { key: "report", header: t.table.report, sortable: true },
    { key: "schedule", header: t.table.schedule, sortable: true },
    { key: "recipients", header: t.table.recipients },
    { key: "lastRun", header: t.table.lastRun, sortable: true },
    { key: "status", header: t.table.status, sortable: true },
    { key: "action", header: d.common.action },
  ];

  const rows: Row[] = items.map((item) => ({
    key: item.id,
    cells: [
      item.report,
      item.schedule,
      item.recipients,
      <span key="l" className="tabular-nums">
        {item.lastRun}
      </span>,
      <Badge key="s" tone={item.active ? "ok" : "neutral"}>
        {item.active ? t.active : t.paused}
      </Badge>,
      <Button key="a" size="sm" variant="secondary" onClick={() => togglePaused(item)}>
        {item.active ? t.pause : t.resume}
      </Button>,
    ],
    sort: [
      item.report,
      item.schedule,
      item.recipients,
      item.lastRun,
      item.active ? t.active : t.paused,
      "",
    ],
  }));

  return (
    <Panel
      title={t.heading}
      tags={["FR-014", "FE-001", "FE-002", "FE-003"]}
      action={
        open ? undefined : (
          <Button onClick={() => setOpen(true)} iconStart={<IconPlus />}>
            {t.add}
          </Button>
        )
      }
    >
      <p className="mb-4 max-w-4xl text-table">{t.intro}</p>

      {note && (
        <div className="mb-4">
          <Callout tone="ok" live tags={["FE-003"]}>
            {note}
          </Callout>
        </div>
      )}

      {open && (
        <div className="print-hide mb-5 border-b border-border pb-5">
          <h3 className="mi-kicker mb-3 text-muted-foreground">{t.addHeading}</h3>
          <p className="mb-3 max-w-2xl text-table">{d.common.requiredLegend}</p>
          <FormGrid>
            <Select
              id="sch-report"
              label={t.form.report}
              required
              lang={lang}
              value={report}
              onChange={setReport}
              options={REPORTS.map((r) => ({ id: r.id, label: reportLabel(r, lang) }))}
            />
            <TextField
              id="sch-schedule"
              label={t.form.schedule}
              hint={t.form.scheduleHint}
              width="medium"
              required
              lang={lang}
              value={schedule}
              onChange={setSchedule}
            />
            <TextField
              id="sch-recipients"
              label={t.form.recipients}
              width="full"
              required
              lang={lang}
              value={recipients}
              onChange={setRecipients}
            />
          </FormGrid>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              iconStart={<IconCheck />}
              onClick={save}
              disabled={schedule.trim().length === 0 || recipients.trim().length === 0}
              disabledReason={t.form.incomplete}
            >
              {d.common.save}
            </Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              {d.common.cancel}
            </Button>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        rows={rows}
        lang={lang}
        caption={t.heading}
        minWidth="56rem"
      />
      <ReqTag id="FE-003" />
      <Rationale>{t.logNote}</Rationale>
      <Rationale>{t.pauseNote}</Rationale>
    </Panel>
  );
}
