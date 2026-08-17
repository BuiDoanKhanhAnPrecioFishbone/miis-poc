import type { Metadata } from "next";

import { PublicShell } from "@/components/miis/PublicShell";
import {
  ConfidentialityMarker,
  EmptyState,
  PageHeading,
  Panel,
  ReqTag,
  StatusDot,
  StatusLegend,
} from "@/components/miis/primitives";
import { listAgreements } from "@/lib/data/agreements";
import { listEmployeeOrgs, listEmployerOrgs } from "@/lib/data/parties";
import { validityLabel } from "@/lib/domain/agreement";
import { agreementStatus, STATUS_LEGEND } from "@/lib/domain/status";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const { i18n } = await getSession();
  const title = `${i18n.common.appName} – ${i18n.allmanheten.title}`;
  const description = i18n.allmanheten.subtitle;
  return { title, description, openGraph: { title, description } };
}

export default async function AllmanhetenPage() {
  const session = await getSession();
  const { i18n, lang } = session;
  const [agreements, employerOrgs, employeeOrgs] = await Promise.all([
    listAgreements(),
    listEmployerOrgs(),
    listEmployeeOrgs(),
  ]);
  const t = i18n.allmanheten;

  return (
    <PublicShell
      lang={lang}
      dataset={session.dataset}
      role={session.role.id}
      reqTags={session.reqTags}
    >
      <PageHeading
        title={t.title}
        subtitle={t.subtitle}
        tags={["FR-011", "NFÅ-006", "D-002"]}
        marker={
          <p className="max-w-3xl rounded-md border-2 border-public-border bg-public px-4 py-3 text-table text-public-foreground">
            {t.publicExplain}
          </p>
        }
      />

      <Panel title={t.selection.title} tags={["FR-011"]}>
        {/*
          Selections on employer organisation, employee organisation and
          agreement, then a report — the shape the requirement describes. Not a
          kiosk: the real users need a usable selection, not big buttons.
        */}
        <div className="grid gap-4 @xl:grid-cols-2 @3xl:grid-cols-4">
          <div>
            <label htmlFor="pub-ago" className="mb-1 block text-label font-bold">
              {t.selection.employerOrg}
            </label>
            <select id="pub-ago" className="field-input" defaultValue="">
              <option value="">{t.selection.all}</option>
              {employerOrgs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="pub-ato" className="mb-1 block text-label font-bold">
              {t.selection.employeeOrg}
            </label>
            <select id="pub-ato" className="field-input" defaultValue="">
              <option value="">{t.selection.all}</option>
              {employeeOrgs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="pub-avtal" className="mb-1 block text-label font-bold">
              {t.selection.agreement}
            </label>
            <select id="pub-avtal" className="field-input" defaultValue="">
              <option value="">{t.selection.all}</option>
              {agreements.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="pub-datum" className="mb-1 block text-label font-bold">
              {t.selection.period}
            </label>
            <input
              id="pub-datum"
              type="date"
              defaultValue="2027-06-01"
              className="field-input tabular-nums"
            />
          </div>
        </div>

        <p className="mt-3 text-label text-muted-foreground">{t.selection.hint}</p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="min-h-12 rounded-sm border-2 border-transparent bg-primary px-5 py-3 text-table font-bold text-primary-foreground transition-colors hover:bg-[var(--mi-slate-900)]"
          >
            {t.selection.search}
          </button>
          <button
            type="button"
            className="min-h-12 rounded-sm border-2 border-primary px-5 py-3 text-table font-bold text-primary transition-colors hover:bg-secondary"
          >
            {t.selection.reset}
          </button>
        </div>
      </Panel>

      <div className="mt-5">
        <Panel
          title={`${t.result.title} · ${i18n.common.agreementCount(agreements.length)}`}
          tags={["FR-012"]}
        >
          {agreements.length === 0 ? (
            <EmptyState text={t.result.empty} />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[52rem] text-table">
                  <thead>
                    <tr className="border-b border-border text-left text-label text-muted-foreground">
                      <th scope="col" className="py-2 pr-4 font-semibold">
                        {t.result.table.status}
                      </th>
                      <th scope="col" className="py-2 pr-4 font-semibold">
                        {t.result.table.agreement}
                      </th>
                      <th scope="col" className="py-2 pr-4 font-semibold">
                        {t.result.table.employerOrg}
                      </th>
                      <th scope="col" className="py-2 pr-4 font-semibold">
                        {t.result.table.employeeOrg}
                      </th>
                      <th scope="col" className="py-2 font-semibold">
                        {t.result.table.validity}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {agreements.map((a) => (
                      <tr key={a.id} className="border-b border-border/60 last:border-0">
                        <td className="py-3 pr-4">
                          <StatusDot status={agreementStatus(a, lang)} showLabel />
                        </td>
                        <td className="py-3 pr-4">
                          <span className="flex flex-wrap items-center gap-2">
                            {a.name}
                            {/*
                              D-002: a marked agreement is still listed and still
                              counted. What is withheld is the detail, and the
                              row says so rather than leaving a blank.
                            */}
                            {a.confidential && (
                              <ConfidentialityMarker
                                label={i18n.confidentiality.marked}
                                note={i18n.confidentiality.reasonPublic}
                              />
                            )}
                          </span>
                        </td>
                        <td className="py-3 pr-4">{a.employerOrg.name}</td>
                        <td className="py-3 pr-4">{a.employeeOrg.name}</td>
                        <td className="py-3 tabular-nums">
                          {a.confidential ? (
                            <span className="text-muted-foreground">
                              {i18n.confidentiality.maskedValue}
                            </span>
                          ) : (
                            validityLabel(a, lang)
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <StatusLegend text={STATUS_LEGEND[lang]} />

              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
                <button
                  type="button"
                  className="min-h-12 rounded-sm border-2 border-primary px-5 py-3 text-table font-bold text-primary transition-colors hover:bg-secondary"
                >
                  {t.result.download}
                </button>
                <span className="text-label text-muted-foreground">{t.result.downloadNote}</span>
                <ReqTag id="FR-011" />
                <ReqTag id="NFÅ-004" />
              </div>
            </>
          )}
        </Panel>
      </div>

      <div className="mt-5">
        <Panel title={t.help.title} tone="sand" tags={["D-002"]}>
          <ul className="list-disc space-y-1 pl-5 text-table text-sand-foreground">
            {t.help.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Panel>
      </div>
    </PublicShell>
  );
}
