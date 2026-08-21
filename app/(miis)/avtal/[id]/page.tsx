import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  AgreementBasicFactsPanel,
  AgreementScopePanel,
  LimitedSectionPanel,
  ReportSelectionPanel,
  SpecialQuestionsPanel,
} from "@/components/miis/AgreementRecord";
import { AppShell } from "@/components/miis/AppShell";
import { DataTable, type Column, type Row } from "@/components/miis/DataTable";
import { IconBack } from "@/components/miis/icons";
import { PrintButton, PrintHeader } from "@/components/miis/Print";
import {
  Badge,
  Button,
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
  isSectionLimited,
  registrationStatusLabel,
  validityLabel,
} from "@/lib/domain/agreement";
import { EVENT_TYPE_LABEL } from "@/lib/domain/event";
import { maySeeConfidential } from "@/lib/domain/role";
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
export default async function AgreementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, session] = await Promise.all([params, getSession()]);
  const { i18n, lang } = session;
  const detail = await getAgreementDetail(id);
  if (!detail) notFound();

  const { agreement, wageAgreements, workingGroups, specialQuestions, events } = detail;
  const t = i18n.avtal.detail;
  const status = agreementStatus(agreement, lang);
  const latest = wageAgreements[0];

  /*
    Informationsbegränsning (Bilaga 3 §3.3) needs both halves: the record says
    *what* is restricted, `maySeeConfidential` says *who* may read it. Resolved
    here, on the server, so the restricted section is never in the document —
    FR-011 and D-002 are enforced in the markup, not the stylesheet.
  */
  const mayReadLimited = maySeeConfidential(session.role.id);
  const hideWorkingGroups = !mayReadLimited && isSectionLimited(agreement, "workingGroups");
  const hideMinimumWages = !mayReadLimited && isSectionLimited(agreement, "minimumWages");

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
    <AppShell
      role={session.role}
      requires="avtal"
      dataset={session.dataset}
      lang={lang}
      reqTags={session.reqTags}
    >
      <PrintHeader lang={lang} title={agreementTitle(agreement)} />
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
        action={
          /*
            FA-001 is "registrera och redigera avtalsinformation" — the detail
            showed only the first half, so an agreement could be read and never
            corrected. Inert here because editing needs a store the mockup does
            not have; the point is that the capability is visible and named
            rather than silently absent.
          */
          <div className="flex flex-wrap items-center gap-3">
            <PrintButton lang={lang} />
            <Button variant="secondary" disabled disabledReason={i18n.common.notInDemo}>
              {t.edit}
            </Button>
          </div>
        }
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
              <Field label={t.signedDate} value={agreement.signedDate ?? i18n.common.none} />
            </div>
          </Panel>

          <AgreementScopePanel agreement={agreement} lang={lang} />

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

          {/*
            FA-014. This is also where Bilaga B's `Särskilda frågor` lands: the
            current system keeps it as a document type of its own, and MI's
            requirement folds it into the group that owns the question.
          */}
          {hideWorkingGroups ? (
            <LimitedSectionPanel title={t.workingGroups} lang={lang} tags={["FA-014"]} />
          ) : (
            <Panel title={t.workingGroups} tags={["FA-014"]}>
              <p className="mb-3 max-w-4xl text-table">{t.workingGroupsIntro}</p>
              {workingGroups.length === 0 ? (
                <p className="text-table text-muted-foreground">{t.noWorkingGroups}</p>
              ) : (
                <ul className="space-y-4">
                  {workingGroups.map((g) => (
                    <li
                      key={g.id}
                      className="border-t border-border pt-3 first:border-t-0 first:pt-0"
                    >
                      <p className="font-semibold">{g.name}</p>
                      <p className="mt-1 text-table">
                        <span className="text-label font-bold">{t.subjectAreas}: </span>
                        {g.subjectAreas.join(" · ")}
                      </p>
                      {g.reportsBy && (
                        <p className="mt-1 text-label text-muted-foreground">
                          {t.reportsBy} <span className="tabular-nums">{g.reportsBy}</span>
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          )}

          {/* §3.11's three numbered slots — a question the agreement text
              answers, which is not the same thing as a working group. */}
          <SpecialQuestionsPanel sets={specialQuestions} lang={lang} />

          {hideMinimumWages ? (
            <LimitedSectionPanel title={t.minimumWages} lang={lang} tags={["FA-013"]} />
          ) : (
            minRows.length > 0 && (
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
            )
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

          <AgreementBasicFactsPanel agreement={agreement} lang={lang} />
          <ReportSelectionPanel agreement={agreement} lang={lang} />
        </div>
      </div>

      {/*
        FH-002 — *"an event log for high-level events linked to an agreement"*.
        Mandatory, Stage 1, and the mediation case had one while the agreement
        it concerns did not.
      */}
      <div className="mt-5">
        <Panel title={t.eventLog} tags={["FH-002"]}>
          <p className="mb-3 max-w-4xl text-table">{t.eventLogIntro}</p>
          {events.length === 0 ? (
            <p className="text-table text-muted-foreground">{t.noEvents}</p>
          ) : (
            <ul className="divide-y divide-border">
              {events.map((e) => (
                <li key={e.id} className="flex flex-wrap gap-x-3 py-2.5 text-table">
                  <span className="tabular-nums text-muted-foreground">{e.timestamp}</span>
                  <span className="font-semibold">{EVENT_TYPE_LABEL[lang][e.type]}</span>
                  <span className="min-w-0">{e.detail}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
