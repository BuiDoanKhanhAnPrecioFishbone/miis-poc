import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/miis/AppShell";
import { DataTable, type Column, type Row } from "@/components/miis/DataTable";
import { IconBack } from "@/components/miis/icons";
import {
  Badge,
  Callout,
  ConfidentialityMarker,
  Field,
  PageHeading,
  Panel,
  Rationale,
  StatusDot,
} from "@/components/miis/primitives";
import { getAgreementDetail } from "@/lib/data/agreements";
import {
  AGREEMENT_CONSTRUCTIONS,
  agreementTitle,
  registrationStatusLabel,
  validityLabel,
} from "@/lib/domain/agreement";
import { agreementStatus } from "@/lib/domain/status";
import { amount, percent } from "@/lib/format";
import { getSession } from "@/lib/session";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const [{ id }, { i18n }] = await Promise.all([params, getSession()]);
  const detail = await getAgreementDetail(id);
  if (!detail) return { title: `${i18n.common.appName} – ${i18n.avtal.title}` };
  const title = agreementTitle(detail.agreement);
  return {
    title: `${i18n.common.appName} – ${title}`,
    description: i18n.avtal.subtitle,
    openGraph: { title, description: i18n.avtal.subtitle },
  };
}

/**
 * One agreement — FA-001 to FA-004, FA-007 to FA-016, FR-012.
 *
 * The register's detail, and the reason the register's rows are links. It shows
 * the three things MI's model keeps apart and the interface kept collapsing:
 * the agreement itself, the **wage agreements** that hang off it one per
 * bargaining round (FA-002), and the lifecycle facts that decide whether it
 * needs attention (FA-015, FA-016).
 *
 * The wage agreements are a table rather than a stack of panels because their
 * whole point is comparison across rounds — the construction, the scope and the
 * cost frame for this round set against the last.
 */
export default async function AgreementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, session] = await Promise.all([params, getSession()]);
  const { i18n, lang } = session;
  const detail = await getAgreementDetail(id);
  if (!detail) notFound();

  const { agreement, wageAgreements } = detail;
  const t = i18n.avtal.detail;
  const status = agreementStatus(agreement, lang);
  const latest = wageAgreements[0];

  const wageColumns: Column[] = [
    { key: "period", header: t.period, sortable: true },
    { key: "construction", header: t.construction },
    { key: "scope", header: t.scope, numeric: true, sortable: true },
    { key: "costFrame", header: t.costFrame, numeric: true, sortable: true },
    { key: "guarantee", header: t.guarantee },
    { key: "revision", header: t.revision },
  ];

  const wageRows: Row[] = wageAgreements.map((w) => ({
    key: w.id,
    cells: [
      <span key="p" className="tabular-nums">
        {w.validFrom} – {w.validTo}
      </span>,
      `${w.construction}. ${AGREEMENT_CONSTRUCTIONS[lang][w.construction]}`,
      w.wageScopePercent === undefined ? i18n.common.none : percent(w.wageScopePercent, lang),
      w.costFramePercent === undefined ? i18n.common.none : percent(w.costFramePercent, lang),
      w.individualGuarantee ? i18n.common.yes : i18n.common.no,
      w.wageRevision ? (
        <span key="r" className="tabular-nums">
          {w.wageRevision.date} · {percent(w.wageRevision.percent, lang)}
        </span>
      ) : (
        i18n.common.none
      ),
    ],
    sort: [
      w.validFrom,
      w.construction,
      w.wageScopePercent ?? 0,
      w.costFramePercent ?? 0,
      w.individualGuarantee ? "1" : "0",
      w.wageRevision?.date ?? "",
    ],
  }));

  const minimumWages = latest?.minimumWages ?? [];
  const minColumns: Column[] = [
    { key: "group", header: t.occupationalGroup, sortable: true },
    { key: "amount", header: t.amount, numeric: true, sortable: true },
    { key: "date", header: t.revisionDate, sortable: true },
  ];
  const minRows: Row[] = minimumWages.map((m) => ({
    key: m.occupationalGroup,
    cells: [
      m.occupationalGroup,
      <span key="a" className="tabular-nums">
        {amount(m.amountSekPerMonth, lang)}
      </span>,
      <span key="d" className="tabular-nums">
        {m.revisionDate}
      </span>,
    ],
    sort: [m.occupationalGroup, m.amountSekPerMonth, m.revisionDate],
  }));

  return (
    <AppShell role={session.role} requires="avtal" dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      <PageHeading
        title={agreementTitle(agreement)}
        back={
          <Link
            href="/avtal"
            className="inline-flex min-h-11 items-center gap-1 text-label font-semibold text-primary underline underline-offset-2"
          >
            <IconBack /> {i18n.common.backTo(i18n.avtal.title)}
          </Link>
        }
        tags={["FA-001", "FA-002", "FR-012"]}
      />

      <div className="grid grid-cols-1 gap-5 @3xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="space-y-5">
          <Panel title={t.identity} tags={["FA-001", "FA-005"]}>
            <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2">
              <Field label={t.area} value={agreement.agreementArea} />
              <Field label={t.type} value={agreement.agreementType} />
              <Field label={t.employerOrg} value={agreement.employerOrg.name} />
              <Field label={t.employeeOrg} value={agreement.employeeOrg.name} />
              <Field
                label={t.alternativeName}
                value={agreement.alternativeName ?? i18n.common.none}
              />
              <Field
                label={t.signedDate}
                value={agreement.signedDate ?? i18n.common.none}
              />
            </div>
          </Panel>

          <Panel title={t.wageAgreements} tags={["FA-002", "FA-007", "FA-008", "FA-009"]}>
            <p className="mb-3 max-w-4xl text-table">{t.wageIntro}</p>
            {wageRows.length === 0 ? (
              <p className="text-table text-muted-foreground">{t.noWageAgreements}</p>
            ) : (
              <DataTable
                columns={wageColumns}
                rows={wageRows}
                lang={lang}
                caption={t.wageAgreements}
                minWidth="46rem"
              />
            )}
          </Panel>

          {minRows.length > 0 && (
            <Panel title={t.minimumWages} tags={["FA-013"]}>
              <p className="mb-3 max-w-4xl text-table">{t.minimumWagesIntro}</p>
              <DataTable
                columns={minColumns}
                rows={minRows}
                lang={lang}
                caption={t.minimumWages}
                minWidth="34rem"
              />
            </Panel>
          )}
        </div>

        <div className="space-y-5">
          {/*
            FR-012 leads the sidebar because it is the one fact every other view
            of this agreement shows too — the register, the search results and
            the reports all colour it by this.
          */}
          <Panel title={t.statusHeading} tags={["FR-012", "FA-021"]} headingLevel={2}>
            <div className="space-y-3">
              <StatusDot status={status} showLabel />
              <div>
                <Badge tone={agreement.registrationStatus === "complete" ? "ok" : "attention"}>
                  {registrationStatusLabel(agreement.registrationStatus, lang)}
                </Badge>
              </div>
              <p className="text-table tabular-nums">{validityLabel(agreement, lang)}</p>
              {agreement.confidential && (
                <ConfidentialityMarker
                  label={i18n.confidentiality.marked}
                  note={i18n.confidentiality.inStatistics}
                />
              )}
            </div>
          </Panel>

          {latest && (
            <Panel title={t.flags} tags={["FA-011", "FA-012"]} tone="sand">
              <ul className="space-y-2 text-table text-sand-foreground">
                <li>
                  {t.equality}: {latest.genderEqualityFlag ? i18n.common.yes : i18n.common.no}
                </li>
                <li>
                  {t.benchmark}: {latest.industryBenchmark ? i18n.common.yes : i18n.common.no}
                </li>
              </ul>
            </Panel>
          )}

          <Panel title={t.lifecycle} tags={["FA-015", "FA-016", "FA-017"]}>
            {agreement.expiresWithoutRenewal || agreement.earlyTermination ? (
              <div className="space-y-3">
                {agreement.expiresWithoutRenewal && (
                  <Callout tone="attention" tags={["FA-015"]}>
                    {t.expires}
                  </Callout>
                )}
                {agreement.earlyTermination && (
                  <Callout tone="attention" tags={["FA-016"]}>
                    {t.earlyTermination}: {agreement.earlyTermination.date} ·{" "}
                    {agreement.earlyTermination.party}
                  </Callout>
                )}
              </div>
            ) : (
              <p className="text-table text-muted-foreground">{t.noLifecycle}</p>
            )}
            {agreement.mediationLinked && (
              <div className="mt-3">
                <Badge tone="attention">{t.mediation}</Badge>
              </div>
            )}
            <Rationale>{i18n.avtal.register.areaNote}</Rationale>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
