import type { Metadata } from "next";
import Link from "next/link";

import { AppShell } from "@/components/miis/AppShell";
import { DataTable, type Column, type Row } from "@/components/miis/DataTable";
import { SearchBuilder, type SearchPopulation } from "@/components/miis/SearchBuilder";
import {
  Button,
  ConfidentialityMarker,
  PageHeading,
  Rationale,
  ReqTag,
  ReqTags,
  StatusDot,
} from "@/components/miis/primitives";
import { countAgreements, listAgreements, listRecentAgreements } from "@/lib/data/agreements";
import { listMediationCases } from "@/lib/data/mediation";
import { listNegotiations } from "@/lib/data/negotiations";
import { listParties } from "@/lib/data/parties";
import { listWageAgreements } from "@/lib/data/reports";
import { AGREEMENT_CONSTRUCTIONS, SECTOR_LABEL } from "@/lib/domain/agreement";
import { MEDIATION_TYPE_LABEL, NEGOTIATION_TYPE_LABEL, caseNumber } from "@/lib/domain/mediation";
import type { InfoTypeId } from "@/lib/domain/options";
import { PARTY_TYPE_LABEL } from "@/lib/domain/party";
import type { Searchable } from "@/lib/domain/query";
import { statusInfo } from "@/lib/domain/status";
import { decimal, percent } from "@/lib/format";
import { getSession } from "@/lib/session";

/* FH-003's own example is a year-end, and this one falls inside the round the
   sample data describes — see the seed in `SearchBuilder`. */
const SNAPSHOT_DATE = "2027-12-31";

/**
 * NFP-003 allows 3 seconds for a standard search. 1,8 s is a believable figure
 * for a query of this shape against this volume; a faster number would read as
 * invented and damage the feasibility score more than the speed would gain.
 */
const RESPONSE_SECONDS = 1.8;

/*
  A found record opens. The search result is the register reached a different
  way, so its name cell is the same link the register draws — a search that
  finds an agreement and cannot open it is a lookup table, which is most of what
  "no value actions here" was pointing at.
*/
const RESULT_LINK = "font-semibold text-primary underline underline-offset-2";

export async function generateMetadata(): Promise<Metadata> {
  const { i18n } = await getSession();
  const title = `${i18n.common.appName} – ${i18n.sok.title}`;
  const description = i18n.sok.subtitle;
  return { title, description, openGraph: { title, description } };
}

export default async function SokPage() {
  const session = await getSession();
  const { i18n, lang } = session;
  const [rows, total, wageAgreements, agreements, parties, cases, negotiations] =
    await Promise.all([
      listRecentAgreements(lang, Number.MAX_SAFE_INTEGER),
      countAgreements(),
      listWageAgreements(),
      /* The full records and the party register: the validity dates live on the
         agreement and the sector on its employer organisation (FP-001), and
         `AgreementRow` is a display projection that carries neither. */
      listAgreements(),
      listParties(),
      /* FR-002 has four information types. The tab strip used to change a
         variable nothing read; choosing an information type is choosing which
         register is searched, so each one has to be here. */
      listMediationCases(),
      listNegotiations(),
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
  ];

  /*
    What the query runs over. The construction lives on the latest wage
    agreement rather than on the agreement, so the join happens once here — a
    pure rule reaching for that relation would need the whole register to answer
    one condition.
  */
  const sectorOf = new Map(parties.map((p) => [p.name, p.sector]));
  const searchable: Searchable[] = agreements.map((a) => {
    const wage = wageByAgreement.get(a.id);
    const sector = sectorOf.get(a.employerOrg.name);
    return {
      id: a.id,
      facets: {
        construction: wage ? String(wage.construction) : undefined,
        sector,
        benchmarkFlag: wage ? (wage.industryBenchmark ? "yes" : "no") : undefined,
      },
      ...(a.validFrom ? { validFrom: a.validFrom } : {}),
      ...(a.validTo ? { validTo: a.validTo } : {}),
    };
  });

  const rowFor: Record<string, Row> = {};
  const tableRows: Row[] = rows.map((row) => {
    const status = statusInfo(row.status, lang);
    const wage = wageByAgreement.get(row.id);
    return {
      key: row.id,
      cells: [
        <StatusDot key="s" status={status} showLabel />,
        <span key="a" className="flex flex-wrap items-center gap-2">
          <Link href={`/avtal/${row.id}`} className={RESULT_LINK}>
            {row.name}
          </Link>
          {row.confidential && (
            <ConfidentialityMarker
              compact
              label={i18n.confidentiality.marked}
              note={i18n.confidentiality.inStatistics}
            />
          )}
        </span>,
        /* The Parter column had no cell at all: five headers, four cells, so
           construction rendered under *Parter* and *Löneutr. %* came out empty.
           Found by the column picker, which could not line the two up. */
        row.parties,
        wage
          ? `${wage.construction}. ${AGREEMENT_CONSTRUCTIONS[lang][wage.construction]}`
          : i18n.common.none,
        wage?.wageScopePercent === undefined
          ? i18n.common.none
          : percent(wage.wageScopePercent, lang),
      ],
      sort: [
        status.label,
        row.name,
        row.parties,
        wage?.construction ?? 99,
        wage?.wageScopePercent ?? -1,
      ],
    };
  });
  for (const r of tableRows) rowFor[r.key] = r;

  /* ---------------------------------------------------------------------- */
  /* The other three registers. Same shape each time: the rows the query runs
     over, the server-rendered row per id, and the columns that register
     prints. They share no criterion and no column, which is the point.       */
  /* ---------------------------------------------------------------------- */

  const mediationRows: Searchable[] = cases.map((mc) => ({
    id: mc.id,
    facets: {
      mediationType: mc.type,
      mediationOngoing: mc.ongoing ? "yes" : "no",
      procedureAgreement: mc.coveredByProcedureAgreement ? "yes" : "no",
    },
  }));
  const mediationTable: Row[] = cases.map((mc) => ({
    key: mc.id,
    cells: [
      <Link key="c" href={`/medling/${mc.id}`} className={RESULT_LINK}>
        {`${caseNumber(mc.id)} · ${mc.name}`}
      </Link>,
      MEDIATION_TYPE_LABEL[lang][mc.type],
      mc.mediators.length === 0 ? i18n.common.none : mc.mediators.map((m) => m.name).join(", "),
      mc.status[lang],
    ],
    sort: [mc.id, MEDIATION_TYPE_LABEL[lang][mc.type], mc.mediators.length, mc.status[lang]],
  }));

  const negotiationRows: Searchable[] = negotiations.map(({ negotiation }) => ({
    id: negotiation.id,
    facets: { negotiationType: negotiation.type, negotiationStatus: negotiation.status },
  }));
  const negotiationTable: Row[] = negotiations.map(({ negotiation, agreementName }) => {
    const status = t.results.negotiationStatus[negotiation.status];
    const type = NEGOTIATION_TYPE_LABEL[lang][negotiation.type];
    /* FF-003 - a standalone negotiation has no agreement, and that is data
       rather than a gap, so its own id carries the row instead of a blank. */
    const label = agreementName ?? negotiation.id;
    /* FF-002 - a negotiation is read on the agreement it belongs to; a
       standalone one (FF-003) has no record of its own to open, and a link
       that went nowhere would be worse than none. */
    const cell = negotiation.agreementId ? (
      <Link key="n" href={`/avtal/${negotiation.agreementId}`} className={RESULT_LINK}>
        {label}
      </Link>
    ) : (
      label
    );
    return {
      key: negotiation.id,
      cells: [cell, type, negotiation.parties.join(", "), status],
      sort: [label, type, negotiation.parties.join(", "), status],
    };
  });

  const partyRows: Searchable[] = parties.map((party) => ({
    id: party.id,
    facets: { partyType: party.type, partySector: party.sector },
  }));
  const partyTable: Row[] = parties.map((party) => {
    const sector = party.sector ? SECTOR_LABEL[lang][party.sector] : i18n.common.none;
    const central = party.centralOrganisation ?? i18n.common.none;
    return {
      key: party.id,
      cells: [
        <Link key="p" href={`/parter/${party.id}`} className={RESULT_LINK}>
          {party.name}
        </Link>,
        PARTY_TYPE_LABEL[lang][party.type],
        sector,
        central,
      ],
      sort: [party.name, PARTY_TYPE_LABEL[lang][party.type], sector, central],
    };
  });

  const byKey = (list: Row[]): Record<string, Row> =>
    Object.fromEntries(list.map((r) => [r.key, r]));

  const populations: Record<InfoTypeId, SearchPopulation> = {
    /* The agreement register leads with FR-012's status, so the identity
        column is the name rather than the first one. */
    agreements: { rows: searchable, rowFor, columns, identityColumn: "agreement" },
    mediation: {
      rows: mediationRows,
      rowFor: byKey(mediationTable),
      identityColumn: "case",
      columns: [
        { key: "case", header: t.results.mediationCase, sortable: true },
        { key: "type", header: t.results.mediationType, sortable: true },
        { key: "mediators", header: t.results.mediators, sortable: true },
        { key: "status", header: t.results.status, sortable: true },
      ],
    },
    negotiations: {
      rows: negotiationRows,
      rowFor: byKey(negotiationTable),
      identityColumn: "negotiation",
      columns: [
        { key: "negotiation", header: t.results.negotiation, sortable: true },
        { key: "type", header: t.results.negotiationType, sortable: true },
        { key: "parties", header: t.results.parties, sortable: true },
        { key: "status", header: t.results.status, sortable: true },
      ],
    },
    parties: {
      rows: partyRows,
      rowFor: byKey(partyTable),
      identityColumn: "party",
      columns: [
        { key: "party", header: t.results.party, sortable: true },
        { key: "type", header: t.results.partyType, sortable: true },
        { key: "sector", header: t.results.sector, sortable: true },
        { key: "central", header: t.results.centralOrganisation, sortable: true },
      ],
    },
  };

  return (
    <AppShell
      walkthrough={session.walkthrough} role={session.role} requires="sok" dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      {/* FA-019 "söka fram avtal med vissa egenskaper" is what this screen is; it
          sat untagged because our English rendering filed the same capability
          under FR-001/FR-002 only. */}
      <PageHeading
        title={t.title}
        subtitle={t.subtitle}
        tags={["FA-019", "FR-001", "FR-002"]}
      />

      {/*
        The criteria run. `lib/domain/query.ts` decides which rows match; the
        cells stay on the server because they carry FR-012's status marker and
        the confidentiality marker, which must not be re-decided in the browser.
      */}
      <SearchBuilder
        lang={lang}
        populations={populations}
        seconds={decimal(RESPONSE_SECONDS, lang)}
        snapshotDate={SNAPSHOT_DATE}
      />

      <div className="mt-5">
        <Rationale>
          {t.results.pointInTimeNote} · {t.results.stage2Note}{" "}
          <ReqTags ids={["FA-020", "FA-025"]} />
        </Rationale>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <span className="text-label font-bold">{i18n.common.exportLabel}</span>
          <Button variant="secondary" size="sm"
        disabled
        disabledReason={i18n.common.exportNeedsServer}
      >
            Excel
          </Button>
          <Button variant="secondary" size="sm"
        disabled
        disabledReason={i18n.common.exportNeedsServer}
      >
            CSV
          </Button>
          <Button variant="secondary" size="sm"
        disabled
        disabledReason={i18n.common.exportNeedsServer}
      >
            JSON
          </Button>
          <Button variant="secondary" size="sm"
        disabled
        disabledReason={i18n.common.exportNeedsServer}
      >
            Word / PDF
          </Button>
          <ReqTags ids={["FR-004", "FR-005", "FR-013"]} />
        </div>
        <Rationale>{t.results.exportNote}</Rationale>

      </div>
    </AppShell>
  );
}
