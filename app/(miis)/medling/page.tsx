import type { Metadata } from "next";
import Link from "next/link";

import { AppShell } from "@/components/miis/AppShell";
import { EmptyState, PageHeading, Panel, StatusDot } from "@/components/miis/primitives";
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

  return (
    <AppShell role={session.role} dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      <PageHeading title={m.title} subtitle={m.subtitle} tags={["FF-006", "FF-007"]} />

      <Panel title={m.title} tags={["FF-008"]}>
        {cases.length === 0 ? (
          <EmptyState text={m.empty} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[52rem] text-table">
              <thead>
                <tr className="border-b border-border text-left text-label text-muted-foreground">
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    {m.table.status}
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    {m.table.caseNumber}
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    {m.table.name}
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    {m.table.type}
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    {m.table.dgDecision}
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    {m.table.agreements}
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    {m.table.mediators}
                  </th>
                  <th scope="col" className="py-2 font-semibold">
                    {m.table.status}
                  </th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c) => (
                  <tr key={c.id} className="border-b border-border/60 last:border-0">
                    <td className="py-3 pr-4">
                      <StatusDot
                        status={statusInfo(c.ongoing ? "after-mediation" : "remaining", lang)}
                        showLabel
                      />
                    </td>
                    <td className="py-3 pr-4 font-semibold text-primary">
                      <Link
                        href={`/medling/${c.id}`}
                        className="underline underline-offset-2"
                      >
                        {caseNumber(c.id)}
                      </Link>
                    </td>
                    <td className="py-3 pr-4">{c.name}</td>
                    <td className="py-3 pr-4">{MEDIATION_TYPE_LABEL[lang][c.type]}</td>
                    <td className="py-3 pr-4 tabular-nums">
                      {c.dgDecision.number} · {c.dgDecision.date}
                    </td>
                    <td className="py-3 pr-4">{i18n.common.agreementCount(c.agreementIds.length)}</td>
                    <td className="py-3 pr-4">
                      {c.mediators.length === 0
                        ? m.noMediators
                        : c.mediators.map((x) => x.name).join(", ")}
                    </td>
                    <td className="py-3">{t(c.status, lang)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </AppShell>
  );
}
