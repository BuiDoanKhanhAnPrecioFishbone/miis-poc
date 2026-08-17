import type { Metadata } from "next";

import { AppShell } from "@/components/miis/AppShell";
import {
  Button,
  ConfidentialityMarker,
  EmptyState,
  PageHeading,
  Panel,
  ReqTag,
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
  const { i18n } = session;
  const documents = await listDocuments();
  const t = i18n.dokument;

  return (
    <AppShell
      role={session.role}
      dataset={session.dataset}
      lang={session.lang}
      reqTags={session.reqTags}
    >
      <PageHeading
        title={t.title}
        subtitle={t.subtitle}
        tags={["FD-001"]}
        action={<Button variant="outline">{t.upload}</Button>}
      />

      <Panel title={t.title} tags={["FD-001", "FAI-003"]}>
        {documents.length === 0 ? (
          <EmptyState text={t.empty} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[52rem] text-table">
              <thead>
                <tr className="border-b border-border text-left text-label text-muted-foreground">
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    {t.table.fileName}
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    {t.table.type}
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    {t.table.uploaded}
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    {t.table.linkedTo}
                  </th>
                  <th scope="col" className="py-2 font-semibold">
                    {t.table.confidential}
                  </th>
                </tr>
              </thead>
              <tbody>
                {documents.map((d) => (
                  <tr key={d.id} className="border-b border-border/60 last:border-0">
                    <td className="py-3 pr-4">
                      <a href="#" className="font-semibold text-primary underline underline-offset-2">
                        {d.fileName}
                      </a>
                    </td>
                    <td className="py-3 pr-4">{t.types[d.type]}</td>
                    <td className="py-3 pr-4 tabular-nums">{d.uploadedDate}</td>
                    <td className="py-3 pr-4">{d.linkedTo}</td>
                    <td className="py-3">
                      {d.confidential ? (
                        <ConfidentialityMarker label={i18n.confidentiality.marked} />
                      ) : (
                        <span className="text-muted-foreground">{i18n.common.none}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-4 text-label text-muted-foreground">{t.ocrNote}</p>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-label text-muted-foreground">
          {t.confidentialNote}
          <ReqTag id="D-001" />
          <ReqTag id="D-002" />
          <ReqTag id="NFÅ-004" />
        </p>
      </Panel>
    </AppShell>
  );
}
