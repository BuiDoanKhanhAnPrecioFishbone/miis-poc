import type { Metadata } from "next";

import { AppShell } from "@/components/miis/AppShell";
import { DataTable, type Column, type Row } from "@/components/miis/DataTable";
import { SearchBuilder } from "@/components/miis/SearchBuilder";
import {
  Button,
  ConfidentialityMarker,
  PageHeading,
  Rationale,
  ReqTag,
  ReqTags,
  StatusDot,
} from "@/components/miis/primitives";
import { countAgreements, listRecentAgreements } from "@/lib/data/agreements";
import { listWageAgreements } from "@/lib/data/reports";
import { AGREEMENT_CONSTRUCTIONS } from "@/lib/domain/agreement";
import { statusInfo } from "@/lib/domain/status";
import { decimal, percent } from "@/lib/format";
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
  const [rows, total, wageAgreements] = await Promise.all([
    listRecentAgreements(lang, 6),
    countAgreements(),
    listWageAgreements(),
  ]);
  const t = i18n.sok;

  // The construction and wage scope come from the wage agreement (FA-002, one
  // row per bargaining round), not from the agreement. Both columns used to be
  // hardcoded, which read as a contradiction once the criteria became real —
  // the filter said "construction 1 or 2" and every row answered "1".
  const wageByAgreement = new Map(wageAgreements.map((w) => [w.agreementId, w]));

  const columns: Column[] = [
    { key: "status", header: t.results.status, sortable: true },
    { key: "agreement", header: t.results.agreement, sortable: true },
    { key: "parties", header: t.results.parties, sortable: true },
    { key: "construction", header: t.results.construction, sortable: true },
    { key: "scope", header: t.results.scope, numeric: true },
    { key: "open", header: t.results.open },
  ];

  const tableRows: Row[] = rows.map((row) => {
    const status = statusInfo(row.status, lang);
    const wage = wageByAgreement.get(row.id);
    return {
      key: row.id,
      cells: [
        <StatusDot key="s" status={status} showLabel />,
        <span key="a" className="flex flex-wrap items-center gap-2">
          {row.name}
          {row.confidential && (
            <ConfidentialityMarker
              compact
              label={i18n.confidentiality.marked}
              note={i18n.confidentiality.inStatistics}
            />
          )}
        </span>,
        wage
          ? `${wage.construction}. ${AGREEMENT_CONSTRUCTIONS[lang][wage.construction]}`
          : i18n.common.none,
        wage?.wageScopePercent === undefined
          ? i18n.common.none
          : percent(wage.wageScopePercent, lang),
        <span key="o" className="font-semibold text-primary underline underline-offset-2">
          {t.results.openAt(SNAPSHOT_DATE)}
        </span>,
      ],
      sort: [
        status.label,
        row.name,
        row.parties,
        wage?.construction ?? 99,
        wage?.wageScopePercent ?? -1,
        "",
      ],
    };
  });

  return (
    <AppShell role={session.role} dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      {/* FA-019 "söka fram avtal med vissa egenskaper" is what this screen is; it
          sat untagged because our English rendering filed the same capability
          under FR-001/FR-002 only. */}
      <PageHeading
        title={t.title}
        subtitle={t.subtitle}
        tags={["FA-019", "FR-001", "FR-002"]}
      />

      <SearchBuilder
        lang={lang}
        hits={total}
        seconds={decimal(RESPONSE_SECONDS, lang)}
        snapshotDate={SNAPSHOT_DATE}
      >
        <DataTable
          columns={columns}
          rows={tableRows}
          lang={lang}
          caption={t.results.title(total, decimal(RESPONSE_SECONDS, lang), SNAPSHOT_DATE)}
        />

        <p className="mt-3 text-label text-muted-foreground">
          {i18n.common.andMoreRows(Math.max(total - rows.length, 0))}
        </p>

        <Rationale>
          {t.results.pointInTimeNote} · {t.results.stage2Note}{" "}
          <ReqTags ids={["FA-020", "FA-025"]} />
        </Rationale>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <span className="text-label font-bold">{i18n.common.exportLabel}</span>
          <Button variant="secondary" size="sm">
            Excel
          </Button>
          <Button variant="secondary" size="sm">
            CSV
          </Button>
          <Button variant="secondary" size="sm">
            JSON
          </Button>
          <Button variant="secondary" size="sm">
            Word / PDF
          </Button>
          <ReqTags ids={["FR-004", "FR-005", "FR-013"]} />
        </div>
        <Rationale>{t.results.exportNote}</Rationale>

        <p className="mt-3 text-label text-muted-foreground">
          {t.results.savedSearches} {i18n.start.savedSearches.items.join(" · ")}
        </p>
      </SearchBuilder>
    </AppShell>
  );
}
