import type { Metadata } from "next";
import Link from "next/link";

import { AppShell } from "@/components/miis/AppShell";
import {
  ConfidentialityMarker,
  EmptyState,
  PageHeading,
  Panel,
  ReqTag,
  StatusDot,
  StatusLegend,
} from "@/components/miis/primitives";
import { getDashboard } from "@/lib/data/dashboard";
import { registrationStatusLabel } from "@/lib/domain/agreement";
import { isHalfWidth, type DashboardPanel } from "@/lib/domain/dashboard";
import type { Lang } from "@/lib/domain/lang";
import { statusInfo, STATUS_LEGEND } from "@/lib/domain/status";
import type { Dictionary } from "@/lib/i18n";
import { percent } from "@/lib/format";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const { i18n } = await getSession();
  const title = `${i18n.common.appName} – ${i18n.nav.start}`;
  return {
    title,
    description: i18n.start.subheading,
    openGraph: { title, description: i18n.start.subheading },
  };
}

function PanelBody({
  panel,
  i18n,
  lang,
}: {
  panel: DashboardPanel;
  i18n: Dictionary;
  lang: Lang;
}) {
  switch (panel.kind) {
    case "log":
      if (panel.items.length === 0) {
        return <EmptyState text={panel.emptyText ?? i18n.common.empty} />;
      }
      return (
        <ul className="divide-y divide-border">
          {panel.items.map((item) => (
            <li key={item.id} className="py-2.5 text-table">
              <span className="tabular-nums text-muted-foreground">{item.when}</span> · {item.text}
            </li>
          ))}
        </ul>
      );

    case "list":
      if (panel.items.length === 0) {
        return <EmptyState text={panel.emptyText ?? i18n.common.empty} />;
      }
      return (
        <ul className="divide-y divide-border">
          {panel.items.map((item) => (
            <li key={item.text} className="flex items-center justify-between gap-4 py-2.5">
              <span className="text-table">{item.text}</span>
              {item.badge && (
                <span className="shrink-0 rounded-md border border-mint-border bg-mint px-3 py-1 text-meta font-bold tracking-wide text-primary">
                  {item.badge}
                </span>
              )}
            </li>
          ))}
        </ul>
      );

    case "agreement-table":
      if (panel.rows.length === 0) {
        return <EmptyState text={panel.emptyText ?? i18n.common.empty} />;
      }
      return (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] text-table">
              <thead>
                <tr className="border-b border-border text-left text-label font-semibold text-muted-foreground">
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    {i18n.start.table.status}
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    {i18n.start.table.agreement}
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    {i18n.start.table.signed}
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    {i18n.start.table.validity}
                  </th>
                  <th scope="col" className="py-2 font-semibold">
                    {i18n.start.table.registrationStatus}
                  </th>
                </tr>
              </thead>
              <tbody>
                {panel.rows.map((row) => (
                  <tr key={row.id} className="border-b border-border/60 last:border-0">
                    {/*
                      The status label is visible now, not only announced. It was
                      hidden to keep visual parity during the migration, which was
                      a migration decision rather than a design one — FR-012 status
                      is information the reader of the table actually needs.
                    */}
                    <td className="py-3 pr-4">
                      <StatusDot status={statusInfo(row.status, lang)} showLabel />
                    </td>
                    <td className="py-3 pr-4">
                      <span className="flex flex-wrap items-center gap-2">
                        {row.name}
                        {row.confidential && (
                          <ConfidentialityMarker label={i18n.confidentiality.marked} />
                        )}
                      </span>
                    </td>
                    <td className="py-3 pr-4 tabular-nums">{row.signedDate ?? i18n.common.none}</td>
                    <td className="py-3 pr-4 tabular-nums">{row.validity}</td>
                    <td className="py-3">{registrationStatusLabel(row.registrationStatus, lang)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <StatusLegend text={STATUS_LEGEND[lang]} />
        </>
      );
  }
}

export default async function DashboardPage() {
  const session = await getSession();
  const { i18n, lang } = session;
  const page = await getDashboard(session.role.id, lang);
  const { benchmark } = page;

  const halfWidth = page.panels.filter(isHalfWidth);
  const fullWidth = page.panels.filter((p) => !isHalfWidth(p));

  return (
    <AppShell role={page.role} dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      <PageHeading
        title={page.heading}
        subtitle={page.subheading}
        tags={["FS-001", "NFÅ-003"]}
        action={
          page.primaryAction ? (
            <Link
              href={page.primaryAction.href}
              className="inline-flex min-h-12 items-center rounded-md bg-primary px-5 py-3 text-table font-bold text-primary-foreground transition-colors hover:bg-[var(--mi-slate-900)]"
            >
              {page.primaryAction.text}
            </Link>
          ) : undefined
        }
      />

      {benchmark && (
        <div className="mb-5 flex flex-wrap items-start gap-3 rounded-lg border border-sand-border bg-sand px-5 py-4">
          <div className="min-w-0 flex-1">
            <p className="text-table text-sand-foreground">
              <span className="font-bold">{i18n.start.benchmarkLine(benchmark.period)}</span>{" "}
              {i18n.start.benchmarkCostFrame(percent(benchmark.costFramePercent, lang))} ·{" "}
              {i18n.start.benchmarkPeriodisation(benchmark.periodisation)}
              {benchmark.supplementaryAgreements.length > 0 &&
                ` · ${i18n.start.benchmarkSupplementary(benchmark.supplementaryAgreements.join(", "))}`}
            </p>
            <p className="mt-1 text-label text-sand-foreground">
              {i18n.start.benchmarkValidity(
                benchmark.validFrom,
                benchmark.validTo,
                benchmark.registeredDate,
              )}
            </p>
          </div>
          <ReqTag id="FM-003" />
        </div>
      )}

      <div className="grid gap-5 @3xl:grid-cols-2">
        {halfWidth.map((panel) => (
          <Panel key={panel.title} title={panel.title} tags={panel.reqTags}>
            <PanelBody panel={panel} i18n={i18n} lang={lang} />
            {"footnote" in panel && panel.footnote && (
              <p className="mt-3 text-label text-muted-foreground">{panel.footnote}</p>
            )}
            {"action" in panel && panel.action && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {panel.action.href ? (
                  <Link
                    href={panel.action.href}
                    className="inline-flex min-h-12 items-center rounded-sm border-2 border-primary px-5 py-3 text-table font-bold text-primary transition-colors hover:bg-secondary"
                  >
                    {panel.action.text}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="min-h-12 rounded-sm border-2 border-primary px-5 py-3 text-table font-bold text-primary transition-colors hover:bg-secondary"
                  >
                    {panel.action.text}
                  </button>
                )}
                {panel.action.reqTag && <ReqTag id={panel.action.reqTag} />}
              </div>
            )}
          </Panel>
        ))}
      </div>

      {fullWidth.map((panel) => (
        <div key={panel.title} className="mt-5">
          <Panel title={panel.title} tags={panel.reqTags}>
            <PanelBody panel={panel} i18n={i18n} lang={lang} />
          </Panel>
        </div>
      ))}
    </AppShell>
  );
}
