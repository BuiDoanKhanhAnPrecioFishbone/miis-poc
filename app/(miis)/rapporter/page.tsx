import type { Metadata } from "next";

import { AppShell } from "@/components/miis/AppShell";
import { ConstructionsReport } from "@/components/miis/ConstructionsReport";
import { DataTable, type Column, type Row } from "@/components/miis/DataTable";
import { Badge, Button, PageHeading, Panel, Rationale, ReqTag } from "@/components/miis/primitives";
import { ShortTermWageReport } from "@/components/miis/ShortTermWageReport";
import {
  EXTRACT_PERIOD_END,
  LAST_EXPORT_DATE,
  listMonitoredAgreements,
} from "@/lib/data/reports";
import { AGREEMENT_CONSTRUCTIONS } from "@/lib/domain/agreement";
import { percent } from "@/lib/format";
import { getConstructionsReport } from "@/lib/data/constructions";
import { getSession } from "@/lib/session";

const EXTRACT_PERIOD_START = "2027-06-01";

export async function generateMetadata(): Promise<Metadata> {
  const { i18n } = await getSession();
  const title = `${i18n.common.appName} – ${i18n.rapporter.title}`;
  const description = i18n.rapporter.subtitle;
  return { title, description, openGraph: { title, description } };
}

export default async function RapporterPage() {
  const session = await getSession();
  const { i18n, lang } = session;
  const [rows, constructionsReport] = await Promise.all([
    listMonitoredAgreements(lang),
    getConstructionsReport(),
  ]);
  const t = i18n.rapporter;

  const exportedCount = rows.filter((r) => r.lastExported).length;



  const scheduleColumns: Column[] = [
    { key: "report", header: t.scheduled.table.report, sortable: true },
    { key: "schedule", header: t.scheduled.table.schedule },
    { key: "recipients", header: t.scheduled.table.recipients, sortable: true },
    { key: "lastRun", header: t.scheduled.table.lastRun, sortable: true },
    { key: "status", header: t.scheduled.table.status, sortable: true },
  ];

  const scheduleRows: Row[] = t.scheduled.items.map((item) => ({
    key: item.report,
    cells: [
      item.report,
      item.schedule,
      item.recipients,
      <span key="l" className="tabular-nums">
        {item.lastRun}
      </span>,
      <Badge key="s" tone={item.active ? "ok" : "neutral"}>
        {item.active ? t.scheduled.active : t.scheduled.paused}
      </Badge>,
    ],
    sort: [
      item.report,
      item.schedule,
      item.recipients,
      item.lastRun,
      item.active ? t.scheduled.active : t.scheduled.paused,
    ],
  }));

  return (
    <AppShell role={session.role} dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      <PageHeading title={t.title} subtitle={t.subtitle} tags={["FR-005", "FR-008", "NFP-002"]} />

      {/*
        A hub rather than four screens. The three reports MI calls prioritised
        share a period, a selection and an export path, and the scheduled
        extracts are how all three are actually delivered — splitting them apart
        would mean building the same header three times.
      */}
      <nav aria-label={t.title} className="mb-6 flex flex-wrap gap-2">
        {[t.tabs.shortTerm, t.tabs.bargainingRound, t.tabs.constructions, t.tabs.scheduled].map(
          (tab, i) => (
            <a
              key={tab}
              href={`#rapport-${i}`}
              className="inline-flex min-h-11 items-center rounded-sm border-2 border-primary px-4 py-2 text-label font-bold text-primary transition-colors hover:bg-secondary"
            >
              {tab}
            </a>
          ),
        )}
      </nav>

      <div id="rapport-0" className="scroll-mt-4">
        <ShortTermWageReport
          rows={rows}
          lang={lang}
          periodValue={`${EXTRACT_PERIOD_START} – ${EXTRACT_PERIOD_END}`}
          lastExportValue={`${LAST_EXPORT_DATE} · ${i18n.common.agreementCount(exportedCount)}`}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 @3xl:grid-cols-2">
        <div id="rapport-1" className="scroll-mt-4">
          <Panel title={t.bargainingRound.heading} tags={["FR-006", "FR-012"]}>
            <p className="text-table">{t.bargainingRound.intro}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-table">
              {t.bargainingRound.contents.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <div className="mt-4">
              <Button variant="secondary"
        disabled
        disabledReason={i18n.common.notInDemo}
      >{t.bargainingRound.generate}</Button>
            </div>
          </Panel>
        </div>

      </div>

      {/*
        MI's own report, full width. It carries a selection block, two figures,
        two detail tables and a legend, so it does not belong in a half-width
        column beside another report.
      */}
      <div id="rapport-2" className="mt-5 scroll-mt-24">
        <ConstructionsReport report={constructionsReport} lang={lang} d={i18n} />
      </div>

      <div id="rapport-3" className="mt-5 scroll-mt-4">
        <Panel title={t.scheduled.heading} tags={["FR-014", "FE-001", "FE-002"]}>
          <p className="max-w-4xl text-table">{t.scheduled.intro}</p>
          <DataTable
            columns={scheduleColumns}
            rows={scheduleRows}
            lang={lang}
            caption={t.scheduled.heading}
            minWidth="48rem"
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button variant="secondary"
        disabled
        disabledReason={i18n.common.notInDemo}
      >{t.scheduled.add}</Button>
            <ReqTag id="FE-003" />
          </div>
          <Rationale>{t.scheduled.logNote}</Rationale>
        </Panel>
      </div>
    </AppShell>
  );
}
