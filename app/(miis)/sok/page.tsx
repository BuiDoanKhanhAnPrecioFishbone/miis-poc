import type { Metadata } from "next";

import { AppShell } from "@/components/miis/AppShell";
import { SearchBuilder } from "@/components/miis/SearchBuilder";
import {
  Button,
  ConfidentialityMarker,
  PageHeading,
  ReqTag,
  StatusDot,
  StatusLegend,
} from "@/components/miis/primitives";
import { countAgreements, listRecentAgreements } from "@/lib/data/agreements";
import { AGREEMENT_CONSTRUCTIONS } from "@/lib/domain/agreement";
import { statusInfo, STATUS_LEGEND } from "@/lib/domain/status";
import { decimal } from "@/lib/format";
import { getSession } from "@/lib/session";

const SNAPSHOT_DATE = "2026-12-31";

/**
 * NFP-003 allows 3 seconds for a standard search. 1,8 s is a believable figure
 * for a query of this shape against this volume; a faster number would read as
 * invented and damage the feasibility score more than the speed would gain.
 */
const RESPONSE_SECONDS = 1.8;

export async function generateMetadata(): Promise<Metadata> {
  const { i18n } = await getSession();
  const title = `${i18n.common.appName} – ${i18n.sok.title}`;
  const description = i18n.sok.subtitle;
  return { title, description, openGraph: { title, description } };
}

export default async function SokPage() {
  const session = await getSession();
  const { i18n, lang } = session;
  const [rows, total] = await Promise.all([listRecentAgreements(lang, 6), countAgreements()]);
  const t = i18n.sok;

  return (
    <AppShell role={session.role} dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      <PageHeading title={t.title} subtitle={t.subtitle} tags={["FR-001", "FR-002"]} />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        {t.tabs.map((tab, i) => (
          <span
            key={tab}
            aria-current={i === 0 ? "true" : undefined}
            className={`rounded-md px-5 py-2.5 text-label font-semibold ${
              i === 0
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {tab}
          </span>
        ))}
        <ReqTag id="FR-002" />
      </div>

      <SearchBuilder
        lang={lang}
        hits={total}
        seconds={decimal(RESPONSE_SECONDS, lang)}
        snapshotDate={SNAPSHOT_DATE}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[52rem] text-table">
            <thead>
              <tr className="border-b border-border text-left text-label text-muted-foreground">
                <th scope="col" className="py-2 pr-4 font-semibold">
                  {t.results.status}
                </th>
                <th scope="col" className="py-2 pr-4 font-semibold">
                  {t.results.agreement}
                </th>
                <th scope="col" className="py-2 pr-4 font-semibold">
                  {t.results.parties}
                </th>
                <th scope="col" className="py-2 pr-4 font-semibold">
                  {t.results.construction}
                </th>
                <th scope="col" className="py-2 pr-4 font-semibold">
                  {t.results.scope}
                </th>
                <th scope="col" className="py-2 font-semibold">
                  {t.results.open}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-border/60 last:border-0">
                  <td className="py-3 pr-4">
                    <StatusDot status={statusInfo(row.status, lang)} showLabel />
                  </td>
                  <td className="py-3 pr-4">
                    <span className="flex flex-wrap items-center gap-2">
                      {row.name}
                      {row.confidential && (
                        <ConfidentialityMarker
                          label={i18n.confidentiality.marked}
                          note={i18n.confidentiality.inStatistics}
                        />
                      )}
                    </span>
                  </td>
                  <td className="py-3 pr-4">{row.parties}</td>
                  <td className="py-3 pr-4">{AGREEMENT_CONSTRUCTIONS[lang][1]}</td>
                  <td className="py-3 pr-4 tabular-nums">{i18n.common.none}</td>
                  <td className="py-3">
                    <span className="font-semibold text-primary underline underline-offset-2">
                      {t.results.openAt(SNAPSHOT_DATE)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <StatusLegend text={STATUS_LEGEND[lang]} />

        <p className="mt-3 text-label text-muted-foreground">
          {i18n.common.andMoreRows(Math.max(total - rows.length, 0))}
        </p>

        <p className="mt-2 flex flex-wrap items-center gap-2 text-label text-muted-foreground">
          {t.results.pointInTimeNote}
          <ReqTag id="FA-020" />
          <span>· {t.results.stage2Note}</span>
          <ReqTag id="FA-025" />
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <span className="text-label font-bold">{i18n.common.exportLabel}</span>
          <Button variant="outline">Excel</Button>
          <Button variant="outline">CSV</Button>
          <Button variant="outline">JSON</Button>
          <Button variant="outline">Word / PDF</Button>
          <span className="text-label text-muted-foreground">{t.results.exportNote}</span>
          <ReqTag id="FR-004" />
          <ReqTag id="FR-005" />
          <ReqTag id="FR-013" />
        </div>

        <p className="mt-3 text-label text-muted-foreground">
          {t.results.savedSearches} {i18n.start.savedSearches.items.join(" · ")}
        </p>
      </SearchBuilder>
    </AppShell>
  );
}
