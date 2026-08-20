import type { Metadata } from "next";
import Link from "next/link";

import { AppShell } from "@/components/miis/AppShell";
import { IconPlus } from "@/components/miis/icons";
import { DataTable, type Column, type Row } from "@/components/miis/DataTable";
import { PartyFilters } from "@/components/miis/PartyFilters";
import { Badge, LinkButton, PageHeading, Panel, Rationale } from "@/components/miis/primitives";
import { listCooperationBodies, listParties } from "@/lib/data/parties";
import { SECTOR_LABEL } from "@/lib/domain/agreement";
import {
  COOPERATION_BODY_TYPE_LABEL,
  PARTY_TYPE_ABBREVIATION,
  PARTY_TYPE_LABEL,
} from "@/lib/domain/party";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const { i18n } = await getSession();
  const title = `${i18n.common.appName} – ${i18n.parter.title}`;
  const description = i18n.parter.subtitle;
  return { title, description, openGraph: { title, description } };
}

/**
 * The party register — FP-001 to FP-006, US-03.
 *
 * A register and its detail, the same shape `/medling` and `/partstraffar` use:
 * this page lists and filters, `/parter/[id]` opens one. FP-005 is the filtering
 * — *"söka fram parter med vissa egenskaper"* — and the properties it filters on
 * are the ones FP-001 names, because those are the properties MI says a party
 * has.
 */
export default async function ParterPage() {
  const session = await getSession();
  const { i18n, lang } = session;
  const [parties, bodies] = await Promise.all([listParties(), listCooperationBodies()]);
  const t = i18n.parter;

  const columns: Column[] = [
    { key: "name", header: t.table.name, sortable: true },
    { key: "type", header: t.table.type, sortable: true },
    { key: "sector", header: t.table.sector, sortable: true },
    { key: "group", header: t.table.group, sortable: true },
    { key: "history", header: t.table.formerNames, numeric: true, sortable: true },
  ];

  const rows: Row[] = parties.map((p) => {
    const former = p.nameHistory.filter((n) => n.validTo).length;
    return {
      key: p.id,
      cells: [
        <Link
          key="n"
          href={`/parter/${p.id}`}
          className="font-semibold text-primary underline underline-offset-2"
        >
          {p.name}
        </Link>,
        <Badge key="t" tone="neutral">
          {PARTY_TYPE_ABBREVIATION[p.type]}
        </Badge>,
        p.sector ? SECTOR_LABEL[lang][p.sector] : i18n.common.none,
        p.employerGroup ?? i18n.common.none,
        former,
      ],
      sort: [
        p.name,
        PARTY_TYPE_LABEL[lang][p.type],
        p.sector ? SECTOR_LABEL[lang][p.sector] : "",
        p.employerGroup ?? "",
        former,
      ],
      /* FP-005's "vissa egenskaper", as plain values the filter can compare. */
      facets: {
        type: p.type,
        sector: p.sector ?? "",
        group: p.employerGroup ?? "",
      },
    };
  });

  const bodyColumns: Column[] = [
    { key: "name", header: t.bodies.name, sortable: true },
    { key: "type", header: t.bodies.type, sortable: true },
    { key: "negotiating", header: t.bodies.negotiating, sortable: true },
    { key: "members", header: t.bodies.members, numeric: true },
    { key: "period", header: t.bodies.period },
  ];

  const bodyRows: Row[] = bodies.map((b) => ({
    key: b.id,
    cells: [
      b.name,
      COOPERATION_BODY_TYPE_LABEL[lang][b.type],
      /*
        FF-006 makes this decision-critical rather than descriptive: MI may not
        appoint mediators against the will of parties covered by a negotiation
        procedure agreement, and whether a body negotiates is part of that
        picture.
      */
      <Badge key="n" tone={b.negotiatingBody ? "attention" : "neutral"}>
        {b.negotiatingBody ? i18n.common.yes : i18n.common.no}
      </Badge>,
      b.members.length,
      <span key="p" className="tabular-nums">
        {b.validFrom} – {b.validTo ?? ""}
      </span>,
    ],
    sort: [
      b.name,
      COOPERATION_BODY_TYPE_LABEL[lang][b.type],
      b.negotiatingBody ? "1" : "0",
      b.members.length,
      b.validFrom,
    ],
  }));

  return (
    <AppShell role={session.role} requires="parter" dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      <PageHeading
        title={t.title}
        subtitle={t.subtitle}
        tags={["FP-001", "FP-002", "FP-005", "FP-006"]}
        action={
          <LinkButton href="/parter/ny" iconStart={<IconPlus />}>
            {t.newParty.action}
          </LinkButton>
        }
      />

      <Panel title={t.register.heading} tags={["FP-001", "FP-002", "FP-005"]}>
        <p className="mb-4 max-w-4xl text-table">{t.register.intro}</p>
        {/* FP-005 — the properties are the ones FP-001 gives a party, and the
            controls own the table so choosing one actually narrows it. */}
        <PartyFilters
          lang={lang}
          columns={columns}
          rows={rows}
          caption={t.register.heading}
        />
        <Rationale>{t.register.sectorNote}</Rationale>
      </Panel>

      <div className="mt-5">
        <Panel title={t.bodies.heading} tags={["FP-003"]}>
          <p className="mb-3 max-w-4xl text-table">{t.bodies.intro}</p>
          <DataTable
            columns={bodyColumns}
            rows={bodyRows}
            lang={lang}
            caption={t.bodies.heading}
            minWidth="40rem"
          />
        </Panel>
      </div>
    </AppShell>
  );
}
