"use client";

import { useState } from "react";

import type { Lang } from "@/lib/domain/lang";
import type { ExtractStatus, MonitoredAgreementRow } from "@/lib/domain/report";
import { dictionary } from "@/lib/i18n";
import { DataTable, type Column, type Row } from "./DataTable";
import {
  Badge,
  Button,
  Callout,
  ConfidentialityMarker,
  Panel,
  Rationale,
  ReqTag,
} from "./primitives";

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
}: {
  rows: MonitoredAgreementRow[];
  lang: Lang;
  periodValue: string;
  lastExportValue: string;
}) {
  const d = dictionary(lang);
  const t = d.rapporter.shortTerm;

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
      r.reminderDate ? (
        <span key="m" className="tabular-nums">
          {t.reminderSet(r.reminderDate)}
        </span>
      ) : (
        <Button key="m" variant="secondary" size="sm"
        disabled
        disabledReason={d.common.notInDemo}
      >
          {t.setReminder}
        </Button>
      ),
    ],
    sort: [
      "",
      r.name,
      r.parties,
      statusLabel[r.status],
      r.protocolFile ? t.openProtocol : t.protocolMissing,
      r.lastExported ?? "",
      r.reminderDate ?? "",
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

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
        <Button
        disabled
        disabledReason={d.common.notInDemo}
      >{t.export}</Button>
        <span className="text-label text-muted-foreground">{t.exportFormats}</span>
        <ReqTag id="FR-005" />
        <Button variant="secondary"
        disabled
        disabledReason={d.common.notInDemo}
      >{t.markExported}</Button>
      </div>
      <Rationale>{t.markExportedNote}</Rationale>
    </Panel>
  );
}
