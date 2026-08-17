import type { Metadata } from "next";
import Link from "next/link";

import { AppShell } from "@/components/miis/AppShell";
import {
  Button,
  EmptyState,
  PageHeading,
  Panel,
  ReqTag,
  StatusDot,
} from "@/components/miis/primitives";
import { getDashboard } from "@/lib/data/dashboard";
import { registrationStatusLabel } from "@/lib/domain/agreement";
import { isHalfWidth, type DashboardPanel } from "@/lib/domain/dashboard";
import { statusInfo, STATUS_LEGEND } from "@/lib/domain/status";
import { percent } from "@/lib/format";
import { activeDataset, activeRole } from "@/lib/session";

export const metadata: Metadata = {
  title: "MIIS – Rollanpassad startsida",
  description:
    "Rollanpassad startsida i MIIS med påminnelser, ofullständiga registreringar, senast registrerade avtal och händelselogg.",
  openGraph: {
    title: "MIIS – Rollanpassad startsida",
    description:
      "Rollanpassad dashboard för Medlingsinstitutets informationssystem: påminnelser, avtal och händelser.",
  },
};

function PanelBody({ panel }: { panel: DashboardPanel }) {
  switch (panel.kind) {
    case "reminders":
      if (panel.items.length === 0) {
        return <EmptyState text={panel.emptyText ?? "Inget att visa."} />;
      }
      return (
        <ul className="divide-y divide-border">
          {panel.items.map((r) => (
            <li key={r.id} className="py-2.5 text-[0.95rem]">
              {r.date} · {r.text}
            </li>
          ))}
        </ul>
      );

    case "list":
      if (panel.items.length === 0) {
        return <EmptyState text={panel.emptyText ?? "Inget att visa."} />;
      }
      return (
        <ul className="divide-y divide-border">
          {panel.items.map((item) => (
            <li key={item.text} className="flex items-center justify-between gap-4 py-2.5">
              <span className="text-[0.95rem]">{item.text}</span>
              {item.badge && (
                <span className="shrink-0 rounded-md border border-mint-border bg-mint px-3 py-1 text-[0.7rem] font-bold tracking-wide text-primary">
                  {item.badge}
                </span>
              )}
            </li>
          ))}
        </ul>
      );

    case "events":
      if (panel.items.length === 0) {
        return <EmptyState text={panel.emptyText ?? "Inget att visa."} />;
      }
      return (
        <ul className="divide-y divide-border">
          {panel.items.map((e) => (
            <li key={e.id} className="py-2.5 text-[0.95rem]">
              {e.timestamp} · {e.text}
            </li>
          ))}
        </ul>
      );

    case "agreement-table":
      if (panel.rows.length === 0) {
        return <EmptyState text={panel.emptyText ?? "Inget att visa."} />;
      }
      return (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] text-[0.95rem]">
              <thead>
                <tr className="border-b border-border text-left text-sm font-semibold text-muted-foreground">
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    Status
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    Avtal
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    Tecknades
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    Löptid
                  </th>
                  <th scope="col" className="py-2 font-semibold">
                    Reg.status
                  </th>
                </tr>
              </thead>
              <tbody>
                {panel.rows.map((row) => (
                  <tr key={row.id} className="border-b border-border/60 last:border-0">
                    <td className="py-3 pr-4">
                      <StatusDot status={statusInfo(row.status)} />
                    </td>
                    <td className="py-3 pr-4">{row.name}</td>
                    <td className="py-3 pr-4">{row.signedDate ?? "–"}</td>
                    <td className="py-3 pr-4">{row.validity}</td>
                    <td className="py-3">{registrationStatusLabel(row.registrationStatus)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{STATUS_LEGEND}</p>
        </>
      );
  }
}

export default async function DashboardPage() {
  const [role, dataset] = await Promise.all([activeRole(), activeDataset()]);
  const page = await getDashboard(role);
  const { benchmark } = page;

  const halfWidth = page.panels.filter(isHalfWidth);
  const fullWidth = page.panels.filter((p) => !isHalfWidth(p));

  return (
    <AppShell
      role={page.role}
      dataset={dataset}
      aiIntro={page.aiIntro}
      aiSuggestions={page.aiSuggestions}
      aiReqTag="FS-001"
    >
      <PageHeading
        title={page.heading}
        subtitle={page.subheading}
        tags={["FS-001"]}
        action={
          page.primaryAction ? (
            <Link
              href={page.primaryAction.href}
              className="inline-flex min-h-12 items-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {page.primaryAction.text}
            </Link>
          ) : undefined
        }
      />

      {benchmark && (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-sand-border bg-sand px-5 py-4">
          <div className="flex-1">
            <p className="text-[0.95rem] text-sand-foreground">
              <span className="font-bold">Märket {benchmark.period}:</span>{" "}
              <span className="ml-4">
                Kostnadsram {percent(benchmark.costFramePercent)} · Periodisering{" "}
                {benchmark.periodisation}
                {benchmark.supplementaryAgreements.length > 0 &&
                  ` · Tilläggsöverenskommelse: ${benchmark.supplementaryAgreements.join(", ")}`}
              </span>
            </p>
            <p className="mt-1 text-sm text-sand-foreground/80">
              Gäller fr.o.m. {benchmark.validFrom} t.o.m. {benchmark.validTo} · Registrerad{" "}
              {benchmark.registeredDate}
            </p>
          </div>
          <ReqTag id="FM-003" />
        </div>
      )}

      <div className="grid gap-5 @3xl:grid-cols-2">
        {halfWidth.map((panel) => (
          <Panel key={panel.title} title={panel.title} tags={panel.reqTags}>
            <PanelBody panel={panel} />
            {"footnote" in panel && panel.footnote && (
              <p className="mt-3 text-sm text-muted-foreground">{panel.footnote}</p>
            )}
            {"action" in panel && panel.action && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {panel.action.href ? (
                  <Link
                    href={panel.action.href}
                    className="inline-flex min-h-12 items-center rounded-sm border-2 border-primary px-5 py-3 text-[0.95rem] font-bold text-primary transition-colors hover:bg-secondary"
                  >
                    {panel.action.text}
                  </Link>
                ) : (
                  <Button variant="outline">{panel.action.text}</Button>
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
            <PanelBody panel={panel} />
            {"footnote" in panel && panel.footnote && (
              <p className="mt-3 text-sm text-muted-foreground">{panel.footnote}</p>
            )}
          </Panel>
        </div>
      ))}
    </AppShell>
  );
}
