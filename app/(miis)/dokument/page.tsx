import type { Metadata } from "next";

import { AppShell } from "@/components/miis/AppShell";
import { DataTable, type Column, type Row } from "@/components/miis/DataTable";
import {
  Button,
  ConfidentialityMarker,
  EmptyState,
  PageHeading,
  Panel,
  Rationale,
  ReqTags,
} from "@/components/miis/primitives";
import { listDocuments } from "@/lib/data/documents";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const { i18n } = await getSession();
  const title = `${i18n.common.appName} – ${i18n.dokument.title}`;
  const description = i18n.dokument.subtitle;
  return { title, description, openGraph: { title, description } };
}

export default async function DokumentPage() {
  const session = await getSession();
  const { i18n, lang } = session;
  const documents = await listDocuments();
  const t = i18n.dokument;

  const columns: Column[] = [
    { key: "file", header: t.table.fileName, sortable: true },
    { key: "type", header: t.table.type, sortable: true },
    { key: "uploaded", header: t.table.uploaded, sortable: true },
    { key: "linked", header: t.table.linkedTo, sortable: true },
    { key: "conf", header: t.table.confidential, sortable: true },
  ];

  const rows: Row[] = documents.map((d) => ({
    key: d.id,
    cells: [
      <a key="f" href="#" className="font-semibold text-primary underline underline-offset-2">
        {d.fileName}
      </a>,
      t.types[d.type],
      <span key="u" className="tabular-nums">
        {d.uploadedDate}
      </span>,
      d.linkedTo,
      d.confidential ? (
        <ConfidentialityMarker
          key="c"
          compact
          label={i18n.confidentiality.marked}
          note={i18n.confidentiality.setBy}
        />
      ) : (
        <span key="c" className="text-muted-foreground">
          {i18n.common.none}
        </span>
      ),
    ],
    sort: [
      d.fileName,
      t.types[d.type],
      d.uploadedDate,
      d.linkedTo,
      d.confidential ? i18n.confidentiality.marked : "",
    ],
  }));

  return (
    <AppShell
      walkthrough={session.walkthrough} role={session.role} requires="dokument" dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      <PageHeading
        title={t.title}
        subtitle={t.subtitle}
        tags={["FD-001"]}
        action={<Button variant="secondary"
        disabled
        disabledReason={i18n.common.uploadNeedsStore}
      >{t.upload}</Button>}
      />

      <Panel title={t.title} tags={["FD-001", "FAI-003"]}>
        {documents.length === 0 ? (
          <EmptyState text={t.empty} />
        ) : (
          <DataTable columns={columns} rows={rows} lang={lang} caption={t.title} />
        )}

        <Rationale>{t.ocrNote}</Rationale>
        <Rationale>
          {t.confidentialNote} <ReqTags ids={["D-001", "D-002", "NFÅ-004"]} />
        </Rationale>
      </Panel>
    </AppShell>
  );
}
