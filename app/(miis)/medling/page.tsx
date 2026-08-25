import type { Metadata } from "next";
import Link from "next/link";

import { AppShell } from "@/components/miis/AppShell";
import { DataTable, type Column, type Row } from "@/components/miis/DataTable";
import { Badge, EmptyState, PageHeading, Panel, StatusDot } from "@/components/miis/primitives";
import { listMediationCases } from "@/lib/data/mediation";
import { t } from "@/lib/domain/lang";
import { caseNumber, MEDIATION_TYPE_LABEL } from "@/lib/domain/mediation";
import { statusInfo } from "@/lib/domain/status";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const { i18n } = await getSession();
  const title = `${i18n.common.appName} – ${i18n.medling.title}`;
  const description = i18n.medling.subtitle;
  return { title, description, openGraph: { title, description } };
}

export default async function MediationListPage() {
  const session = await getSession();
  const { i18n, lang } = session;
  const cases = await listMediationCases();
  const m = i18n.medling;

  const columns: Column[] = [
    { key: "case", header: m.table.caseNumber, sortable: true },
    { key: "name", header: m.table.name, sortable: true },
    { key: "type", header: m.table.type, sortable: true },
    { key: "dg", header: m.table.dgDecision, sortable: true },
    { key: "agreements", header: m.table.agreements, numeric: true, sortable: true },
    { key: "mediators", header: m.table.mediators },
    { key: "status", header: m.table.status, sortable: true },
  ];

  const rows: Row[] = cases.map((c) => {
    return {
      key: c.id,
      cells: [
        <Link
          key="c"
          href={`/medling/${c.id}`}
          className="font-semibold text-primary underline underline-offset-2"
        >
          {caseNumber(c.id)}
        </Link>,
        c.name,
        MEDIATION_TYPE_LABEL[lang][c.type],
        <span key="d" className="tabular-nums">
          {c.dgDecision.number} · {c.dgDecision.date}
        </span>,
        c.agreementIds.length,
        c.mediators.length === 0 ? m.noMediators : c.mediators.map((x) => x.name).join(", "),
        <Badge key="b" tone={c.ongoing ? "attention" : "ok"}>
          {t(c.status, lang)}
        </Badge>,
      ],
      sort: [
        c.id,
        c.name,
        MEDIATION_TYPE_LABEL[lang][c.type],
        c.dgDecision.date,
        c.agreementIds.length,
        "",
        t(c.status, lang),
      ],
    };
  });

  return (
    <AppShell
      walkthrough={session.walkthrough} role={session.role} requires="medling" dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      <PageHeading title={m.title} subtitle={m.subtitle} tags={["FF-006", "FF-007"]} />

      <Panel title={m.title} tags={["FF-008"]}>
        {cases.length === 0 ? (
          <EmptyState text={m.empty} />
        ) : (
          <DataTable columns={columns} rows={rows} lang={lang} caption={m.title} />
        )}
      </Panel>
    </AppShell>
  );
}
