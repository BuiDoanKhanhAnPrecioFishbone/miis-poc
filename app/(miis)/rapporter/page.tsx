import type { Metadata } from "next";

import { AppShell } from "@/components/miis/AppShell";
import { PageHeading, Panel, ReqTag } from "@/components/miis/primitives";
import { ShortTermWageReport } from "@/components/miis/ShortTermWageReport";
import {
  EXTRACT_PERIOD_END,
  LAST_EXPORT_DATE,
  listMonitoredAgreements,
  listRegisteredConstructions,
} from "@/lib/data/reports";
import { AGREEMENT_CONSTRUCTIONS } from "@/lib/domain/agreement";
import { constructionCounts } from "@/lib/domain/report";
import { percent } from "@/lib/format";
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
  const [rows, constructions] = await Promise.all([
    listMonitoredAgreements(lang),
    listRegisteredConstructions(),
  ]);
  const t = i18n.rapporter;

  const counts = constructionCounts(constructions, AGREEMENT_CONSTRUCTIONS[lang], lang);
  const exportedCount = rows.filter((r) => r.lastExported).length;

  return (
    <AppShell role={session.role} dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      <PageHeading
        title={t.title}
        subtitle={t.subtitle}
        tags={["FR-005", "FR-008", "NFP-002"]}
      />

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
              className="min-h-11 rounded-md border-2 border-primary px-4 py-2 text-label font-bold text-primary transition-colors hover:bg-secondary"
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

      <div className="mt-5 grid gap-5 @3xl:grid-cols-2">
        <div id="rapport-1" className="scroll-mt-4">
          <Panel title={t.bargainingRound.heading} tags={["FR-006", "FR-012"]}>
            <p className="text-table">{t.bargainingRound.intro}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-table">
              {t.bargainingRound.contents.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <div className="mt-4">
              <button
                type="button"
                className="min-h-12 rounded-sm border-2 border-primary px-5 py-3 text-table font-bold text-primary transition-colors hover:bg-secondary"
              >
                {t.bargainingRound.generate}
              </button>
            </div>
          </Panel>
        </div>

        <div id="rapport-2" className="scroll-mt-4">
          <Panel title={t.constructions.heading} tags={["FR-007", "FA-007"]}>
            <p className="text-table">{t.constructions.intro}</p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[24rem] text-table">
                <thead>
                  <tr className="border-b border-border text-left text-label text-muted-foreground">
                    <th scope="col" className="py-2 pr-4 font-semibold">
                      {t.constructions.table.construction}
                    </th>
                    <th scope="col" className="py-2 pr-4 font-semibold">
                      {t.constructions.table.agreements}
                    </th>
                    <th scope="col" className="py-2 font-semibold">
                      {t.constructions.table.share}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {counts.map((c) => (
                    <tr key={c.construction} className="border-b border-border/60 last:border-0">
                      <td className="py-2.5 pr-4">
                        {c.construction}. {c.label}
                      </td>
                      <td className="py-2.5 pr-4 tabular-nums">{c.count}</td>
                      <td className="py-2.5 tabular-nums">{percent(c.sharePercent, lang)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="min-h-12 rounded-sm border-2 border-primary px-5 py-3 text-table font-bold text-primary transition-colors hover:bg-secondary"
              >
                {t.constructions.generate}
              </button>
            </div>
          </Panel>
        </div>
      </div>

      <div id="rapport-3" className="mt-5 scroll-mt-4">
        <Panel title={t.scheduled.heading} tags={["FR-014", "FE-001", "FE-002"]}>
          <p className="max-w-4xl text-table">{t.scheduled.intro}</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[48rem] text-table">
              <thead>
                <tr className="border-b border-border text-left text-label text-muted-foreground">
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    {t.scheduled.table.report}
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    {t.scheduled.table.schedule}
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    {t.scheduled.table.recipients}
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    {t.scheduled.table.lastRun}
                  </th>
                  <th scope="col" className="py-2 font-semibold">
                    {t.scheduled.table.status}
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.scheduled.items.map((item) => (
                  <tr key={item.report} className="border-b border-border/60 last:border-0">
                    <td className="py-3 pr-4">{item.report}</td>
                    <td className="py-3 pr-4">{item.schedule}</td>
                    <td className="py-3 pr-4">{item.recipients}</td>
                    <td className="py-3 pr-4 tabular-nums">{item.lastRun}</td>
                    <td className="py-3">
                      <span
                        className={`inline-block rounded-sm border px-2 py-0.5 text-meta font-bold tracking-wide ${
                          item.active
                            ? "border-mint-border bg-mint text-primary"
                            : "border-input bg-card text-muted-foreground"
                        }`}
                      >
                        {item.active ? t.scheduled.active : t.scheduled.paused}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="min-h-12 rounded-sm border-2 border-primary px-5 py-3 text-table font-bold text-primary transition-colors hover:bg-secondary"
            >
              {t.scheduled.add}
            </button>
            <span className="text-label text-muted-foreground">{t.scheduled.logNote}</span>
            <ReqTag id="FE-003" />
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
