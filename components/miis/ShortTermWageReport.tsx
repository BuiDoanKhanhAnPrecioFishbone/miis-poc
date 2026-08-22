"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { COOKIE_MAX_AGE_SECONDS, REMINDER_COOKIE } from "@/lib/cookies";
import type { Lang } from "@/lib/domain/lang";
import {
  clearReminder,
  encodeReminders,
  reminderFor,
  setReminder as withReminder,
  type SetReminder,
} from "@/lib/domain/reminder";
import type { ExtractStatus, MonitoredAgreementRow } from "@/lib/domain/report";
import { dictionary } from "@/lib/i18n";
import { DataTable, type Column, type Row } from "./DataTable";
import {
  Badge,
  Button,
  Callout,
  ConfidentialityMarker,
  FormGrid,
  Panel,
  Rationale,
  ReqTag,
  TextField,
} from "./primitives";

/*
  Module scope, because the React compiler's `immutability` rule refuses an
  assignment to anything declared outside the component body — the same helper
  the demo bar and the watchword table keep for the same reason.
*/
function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}

/**
 * FR-008 — Konjunkturlönerapporten.
 *
 * The requirement is unusually specific, so the screen follows it literally:
 *
 * - a **status column** that separates *registered* from *partially registered*,
 * - a **link to the protocol even when registration is incomplete**, and
 * - **tracking of which agreements were already exported** to the report.
 *
 * Selecting rows is the actual work here: an administrator decides what goes
 * into this quarter's extract, and partially registered agreements are the ones
 * that need the decision. So the count of selected rows and the warning about
 * partial ones are live rather than decorative, and the reminder (FA-022) sits
 * on the same row as the gap it is about.
 */

const STATUS_TONE: Record<ExtractStatus, "ok" | "attention" | "neutral"> = {
  registered: "ok",
  partial: "attention",
  "not-registered": "neutral",
};

export function ShortTermWageReport({
  rows,
  lang,
  periodValue,
  lastExportValue,
  reminders: initialReminders,
}: {
  rows: MonitoredAgreementRow[];
  lang: Lang;
  periodValue: string;
  lastExportValue: string;
  /** FA-022's markings, read from the session on the server. */
  reminders: SetReminder[];
}) {
  const d = dictionary(lang);
  const t = d.rapporter.shortTerm;
  const router = useRouter();
  const [, startTransition] = useTransition();

  /*
    FA-022 — *"markering av Påminnelse om att uppdatera ett Avtal vid ett visst
    datum"*. The control was `disabled` with "Ej aktiv i demon", which is a
    requirement answered by a button that says it is not implemented.

    The marking travels in a cookie so it reaches the start page, which is where
    MI reads reminders: one the system accepts and then does not count is worse
    than none, because the officer has been told it was recorded. That is the
    same loop the AI review queue needed.
  */
  const [reminders, setReminders] = useState(initialReminders);
  const [editing, setEditing] = useState<MonitoredAgreementRow | null>(null);
  const [date, setDate] = useState("");
  const [note, setNote] = useState<string | null>(null);

  function persist(next: SetReminder[]) {
    setCookie(REMINDER_COOKIE, encodeReminders(next));
    setReminders(next);
    startTransition(() => router.refresh());
  }

  function open(row: MonitoredAgreementRow) {
    setEditing(row);
    setDate(reminderFor(reminders, row.id)?.date ?? "");
    setNote(null);
  }

  function save() {
    if (!editing || !date) return;
    persist(withReminder(reminders, { agreementId: editing.id, date, name: editing.name }));
    setNote(t.reminderSavedNote(editing.name, date));
    setEditing(null);
  }

  function remove(row: MonitoredAgreementRow) {
    persist(clearReminder(reminders, row.id));
    setNote(t.reminderRemovedNote(row.name));
    setEditing(null);
  }

  const [selected, setSelected] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(rows.map((r) => [r.id, r.status !== "not-registered"])),
  );

  const selectedRows = rows.filter((r) => selected[r.id]);
  const partialInExtract = selectedRows.filter((r) => r.status === "partial").length;

  const statusLabel: Record<ExtractStatus, string> = {
    registered: t.registered,
    partial: t.partiallyRegistered,
    "not-registered": t.notRegistered,
  };

  const columns: Column[] = [
    { key: "select", header: t.table.select },
    { key: "agreement", header: t.table.agreement, sortable: true },
    { key: "parties", header: t.table.parties, sortable: true },
    { key: "registration", header: t.table.registration, sortable: true },
    { key: "protocol", header: t.table.protocol, sortable: true },
    { key: "exported", header: t.table.exported, sortable: true },
    { key: "reminder", header: t.table.reminder, sortable: true },
  ];

  const tableRows: Row[] = rows.map((r) => ({
    key: r.id,
    cells: [
      <label key="s" className="flex min-h-11 min-w-11 items-center gap-2">
        <input
          type="checkbox"
          checked={selected[r.id] ?? false}
          onChange={() => setSelected((s) => ({ ...s, [r.id]: !s[r.id] }))}
          className="size-5 accent-[var(--primary)]"
        />
        {/*
          Bilaga 3 §7 states MI's rule for its own printouts — *"Markerad
          kryssruta skrivs ut som Ja"* — and the reason is plain on this table:
          an empty box on paper reads as something the reader is being asked to
          fill in, on a column that records a decision already taken. The box
          is dropped by the print stylesheet and this word takes its place.
          `Nej` rather than a blank, because a blank cell cannot be told apart
          from a value nobody entered.
        */}
        <span aria-hidden className="print-only hidden tabular-nums">
          {selected[r.id] ? d.common.yes : d.common.no}
        </span>
        <span className="sr-only">
          {t.table.select}: {r.name}
        </span>
      </label>,
      <span key="a" className="flex flex-wrap items-center gap-2">
        {r.name}
        {r.confidential && (
          <ConfidentialityMarker
            compact
            label={d.confidentiality.marked}
            note={d.confidentiality.inStatistics}
          />
        )}
      </span>,
      r.parties,
      <Badge key="r" tone={STATUS_TONE[r.status]}>
        {statusLabel[r.status]}
      </Badge>,
      r.protocolFile ? (
        <a key="p" href="#" className="font-semibold text-primary underline underline-offset-2">
          {t.openProtocol}
        </a>
      ) : (
        <span key="p" className="text-muted-foreground">
          {t.protocolMissing}
        </span>
      ),
      <span key="e" className="tabular-nums">
        {r.lastExported ? t.exportedYes(r.lastExported) : t.exportedNo}
      </span>,
      /*
        The date is the record and the controls are beside it. A reminder that
        can be set and never changed would be the same half-built register the
        mediator list was: MI moves these when a protocol slips.
      */
      (() => {
        const set = reminderFor(reminders, r.id)?.date ?? r.reminderDate;
        return set ? (
          <span key="m" className="flex flex-wrap items-center gap-2">
            <span className="tabular-nums">{t.reminderSet(set)}</span>
            <span className="print-hide flex flex-wrap gap-2">
              <Button variant="ghost" size="sm" onClick={() => open(r)}>
                {t.reminderChange}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => remove(r)}>
                {t.reminderRemove}
              </Button>
            </span>
          </span>
        ) : (
          <Button
            key="m"
            variant="secondary"
            size="sm"
            onClick={() => open(r)}
          >
            {t.setReminder}
          </Button>
        );
      })(),
    ],
    sort: [
      "",
      r.name,
      r.parties,
      statusLabel[r.status],
      r.protocolFile ? t.openProtocol : t.protocolMissing,
      r.lastExported ?? "",
      reminderFor(reminders, r.id)?.date ?? r.reminderDate ?? "",
    ],
  }));

  return (
    <Panel title={t.heading} tags={["FR-008", "FA-021"]}>
      <p className="mb-4 max-w-4xl text-table">{t.intro}</p>

      <div className="mb-5 grid grid-cols-1 gap-4 @xl:grid-cols-2">
        <div>
          <span className="mb-1 block text-label font-bold">{t.period}</span>
          <span className="field-input tabular-nums">{periodValue}</span>
        </div>
        <div>
          <span className="mb-1 block text-label font-bold">{t.lastExport}</span>
          <span className="field-input tabular-nums">{lastExportValue}</span>
        </div>
      </div>

      {note && (
        <div className="mb-4">
          <Callout tone="ok" live tags={["FA-022", "FE-001"]}>
            {note}
          </Callout>
        </div>
      )}

      {/*
        The form above the table, not inside the cell. A date field plus save
        and cancel is 400px, and the reminder column of a seven-column register
        is 150 — a row that grew to hold them would push every other column into
        a sliver, which is what happened to the mediator register.
      */}
      {editing && (
        <div className="print-hide mb-5 border-b border-border pb-5">
          <h3 className="mi-kicker mb-2 text-muted-foreground">
            {t.reminderHeading(editing.name)}
          </h3>
          <p className="mb-3 max-w-3xl text-table">{t.reminderIntro}</p>
          <FormGrid>
            <TextField
              id="stw-reminder"
              label={t.reminderDate}
              type="date"
              width="short"
              numeric
              required
              lang={lang}
              value={date}
              onChange={setDate}
            />
          </FormGrid>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button onClick={save} disabled={!date} disabledReason={t.reminderDateRequired}>
              {t.reminderSave}
            </Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              {d.common.cancel}
            </Button>
            <ReqTag id="FA-022" />
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        rows={tableRows}
        lang={lang}
        caption={t.heading}
        minWidth="60rem"
      />

      <Rationale>
        {t.protocolIncompleteNote} <ReqTag id="FR-008" />
      </Rationale>

      <p aria-live="polite" className="mt-4 text-table font-semibold">
        {t.selectedCount(selectedRows.length, rows.length)}
      </p>

      {partialInExtract > 0 && (
        <div className="mt-2">
          <Callout tone="attention" live>
            {t.incompleteWarning(partialInExtract)}
          </Callout>
        </div>
      )}

      {/*
        `print-hide` in full. The print rule drops the two buttons, which left
        the sentence that describes them — *Word · Excel · PDF* — standing alone
        under a horizontal rule at the end of the report, naming formats the
        paper is not one of.
      */}
      <div className="print-hide mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
        <Button
        disabled
        disabledReason={d.common.exportNeedsServer}
      >{t.export}</Button>
        <span className="text-label text-muted-foreground">{t.exportFormats}</span>
        <ReqTag id="FR-005" />
        <Button variant="secondary"
        disabled
        disabledReason={d.common.exportNeedsServer}
      >{t.markExported}</Button>
      </div>
      <Rationale>{t.markExportedNote}</Rationale>
    </Panel>
  );
}
