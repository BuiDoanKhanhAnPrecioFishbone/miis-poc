"use client";

import { useState } from "react";

import type { Lang } from "@/lib/domain/lang";
import type { ExtractStatus, MonitoredAgreementRow } from "@/lib/domain/report";
import { dictionary } from "@/lib/i18n";
import { ConfidentialityMarker, Panel, ReqTag } from "./primitives";

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

  const statusClass: Record<ExtractStatus, string> = {
    registered: "border-mint-border bg-mint text-primary",
    partial: "border-sand-border bg-sand text-sand-foreground",
    "not-registered": "border-input bg-card text-muted-foreground",
  };

  return (
    <Panel title={t.heading} tags={["FR-008", "FA-021"]}>
      <p className="mb-4 max-w-4xl text-table">{t.intro}</p>

      <div className="mb-5 grid gap-4 @xl:grid-cols-2">
        <div>
          <span className="mb-1 block text-label font-bold">{t.period}</span>
          <span className="field-input tabular-nums">{periodValue}</span>
        </div>
        <div>
          <span className="mb-1 block text-label font-bold">{t.lastExport}</span>
          <span className="field-input tabular-nums">{lastExportValue}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[60rem] text-table">
          <thead>
            <tr className="border-b border-border text-left text-label text-muted-foreground">
              <th scope="col" className="py-2 pr-4 font-semibold">
                {t.table.select}
              </th>
              <th scope="col" className="py-2 pr-4 font-semibold">
                {t.table.agreement}
              </th>
              <th scope="col" className="py-2 pr-4 font-semibold">
                {t.table.parties}
              </th>
              <th scope="col" className="py-2 pr-4 font-semibold">
                {t.table.registration}
              </th>
              <th scope="col" className="py-2 pr-4 font-semibold">
                {t.table.protocol}
              </th>
              <th scope="col" className="py-2 pr-4 font-semibold">
                {t.table.exported}
              </th>
              <th scope="col" className="py-2 font-semibold">
                {t.table.reminder}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border/60 last:border-0">
                <td className="py-3 pr-4">
                  <label className="flex min-h-11 min-w-11 items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selected[r.id] ?? false}
                      onChange={() => setSelected((s) => ({ ...s, [r.id]: !s[r.id] }))}
                      className="size-5 accent-[var(--primary)]"
                    />
                    <span className="sr-only">
                      {t.table.select}: {r.name}
                    </span>
                  </label>
                </td>
                <td className="py-3 pr-4">
                  <span className="flex flex-wrap items-center gap-2">
                    {r.name}
                    {r.confidential && (
                      <ConfidentialityMarker
                        label={d.confidentiality.marked}
                        note={d.confidentiality.inStatistics}
                      />
                    )}
                  </span>
                </td>
                <td className="py-3 pr-4">{r.parties}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`inline-block rounded-sm border px-2 py-0.5 text-meta font-bold tracking-wide ${statusClass[r.status]}`}
                  >
                    {statusLabel[r.status]}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  {r.protocolFile ? (
                    <a
                      href="#"
                      className="font-semibold text-primary underline underline-offset-2"
                    >
                      {t.openProtocol}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">{t.protocolMissing}</span>
                  )}
                </td>
                <td className="py-3 pr-4 tabular-nums">
                  {r.lastExported ? t.exportedYes(r.lastExported) : t.exportedNo}
                </td>
                <td className="py-3">
                  {r.reminderDate ? (
                    <span className="tabular-nums">{t.reminderSet(r.reminderDate)}</span>
                  ) : (
                    <button
                      type="button"
                      className="min-h-11 rounded-sm border-2 border-primary px-3 py-1.5 text-label font-bold text-primary transition-colors hover:bg-secondary"
                    >
                      {t.setReminder}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 flex flex-wrap items-center gap-2 text-label text-muted-foreground">
        {t.protocolIncompleteNote}
        <ReqTag id="FR-008" />
      </p>

      <p aria-live="polite" className="mt-4 text-table font-semibold">
        {t.selectedCount(selectedRows.length, rows.length)}
      </p>

      {partialInExtract > 0 && (
        <p className="mt-2 rounded-md border-2 border-sand-border bg-sand px-4 py-3 text-label text-sand-foreground">
          {t.incompleteWarning(partialInExtract)}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
        <button
          type="button"
          className="min-h-12 rounded-sm border-2 border-transparent bg-primary px-5 py-3 text-table font-bold text-primary-foreground transition-colors hover:bg-[var(--mi-slate-900)]"
        >
          {t.export}
        </button>
        <span className="text-label text-muted-foreground">{t.exportFormats}</span>
        <ReqTag id="FR-005" />
        <button
          type="button"
          className="min-h-12 rounded-sm border-2 border-primary px-5 py-3 text-table font-bold text-primary transition-colors hover:bg-secondary"
        >
          {t.markExported}
        </button>
      </div>
      <p className="mt-2 text-label text-muted-foreground">{t.markExportedNote}</p>
    </Panel>
  );
}
