import type { Metadata } from "next";

import { AppShell } from "@/components/miis/AppShell";
import { DataTable, type Column, type Row } from "@/components/miis/DataTable";
import { Badge, PageHeading, Panel, Rationale } from "@/components/miis/primitives";
import { listNegotiations } from "@/lib/data/negotiations";
import { NEGOTIATION_TYPE_LABEL } from "@/lib/domain/mediation";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const { i18n } = await getSession();
  const title = `${i18n.common.appName} – ${i18n.forhandlingar.title}`;
  const description = i18n.forhandlingar.subtitle;
  return { title, description, openGraph: { title, description } };
}

/**
 * The negotiation register — FF-001 to FF-004.
 *
 * FF-001 names two kinds and they are not a label on one thing: a
 * *avtalsrörelse* belongs to an agreement and is how that agreement's next
 * period comes about (FF-002), while an *övrig förhandling* can stand alone and
 * links straight to the parties (FF-003). The register shows both in one table
 * because an administrator asks "what is open right now" across both, and the
 * agreement column is empty for the standalone ones — which is a fact about
 * them, not missing data. The note under the table says so, because an empty
 * cell that means something has to be told apart from one that means nothing.
 *
 * The ids are the ones `/registrera` offers when linking a protocol, so a
 * reviewer who saw FÖ-2025/218 there finds it here.
 */
export default async function ForhandlingarPage() {
  const session = await getSession();
  const { i18n, lang } = session;
  const t = i18n.forhandlingar;
  const rows = await listNegotiations();

  const columns: Column[] = [
    { key: "id", header: t.table.id, sortable: true },
    { key: "type", header: t.table.type, sortable: true },
    { key: "agreement", header: t.table.agreement, sortable: true },
    { key: "parties", header: t.table.parties, sortable: true },
    { key: "status", header: t.table.status, sortable: true },
    { key: "closed", header: t.table.closed, sortable: true },
  ];

  const tableRows: Row[] = rows.map(({ negotiation: n, agreementName }) => {
    const type = NEGOTIATION_TYPE_LABEL[lang][n.type];
    const status = t.status[n.status];
    return {
      key: n.id,
      cells: [
        <span key="i" className="font-semibold tabular-nums">
          {n.id}
        </span>,
        <Badge key="t" tone="neutral">
          {type}
        </Badge>,
        agreementName ?? (
          /* FF-003 — the absence is the information, so it is labelled. */
          <span key="a" className="text-muted-foreground">
            {t.standalone}
          </span>
        ),
        n.parties.join(" / "),
        <Badge key="s" tone={n.status === "ongoing" ? "attention" : "ok"}>
          {status}
        </Badge>,
        <span key="c" className="tabular-nums">
          {n.closedDate ?? i18n.common.none}
        </span>,
      ],
      sort: [n.id, type, agreementName ?? "", n.parties.join(" / "), status, n.closedDate ?? ""],
    };
  });

  return (
    <AppShell role={session.role} dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      <PageHeading
        title={t.title}
        subtitle={t.subtitle}
        tags={["FF-001", "FF-002", "FF-003", "FF-004"]}
      />

      <Panel title={t.register.heading} tags={["FF-001", "FF-004"]}>
        <p className="mb-4 max-w-4xl text-table">{t.register.intro}</p>
        {tableRows.length === 0 ? (
          <p className="text-table text-muted-foreground">{i18n.common.empty}</p>
        ) : (
          <DataTable
            columns={columns}
            rows={tableRows}
            lang={lang}
            caption={t.register.heading}
            minWidth="66rem"
          />
        )}
        <p className="mt-3 max-w-4xl text-label text-muted-foreground">
          {t.register.standaloneNote}
        </p>
        <Rationale>{t.linkNote}</Rationale>
      </Panel>
    </AppShell>
  );
}
