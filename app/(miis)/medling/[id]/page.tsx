import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Link from "next/link";

import { AppShell } from "@/components/miis/AppShell";
import { IconBack, IconForward } from "@/components/miis/icons";
import {
  AiRegion,
  Badge,
  Button,
  Callout,
  Field,
  PageHeading,
  Panel,
  Rationale,
  ReqTag,
  StatusDot,
} from "@/components/miis/primitives";
import { getCurrentBenchmark } from "@/lib/data/benchmark";
import { getMediationCase } from "@/lib/data/mediation";
import { t } from "@/lib/domain/lang";
import {
  caseNumber,
  MEDIATION_TYPE_LABEL,
  MEDIATOR_POSITION_LABEL,
  miAppointsMediators,
} from "@/lib/domain/mediation";
import { amount, percent } from "@/lib/format";
import { getSession } from "@/lib/session";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const [{ id }, { i18n, lang }] = await Promise.all([params, getSession()]);
  const detail = await getMediationCase(id, lang);
  if (!detail) return { title: `${i18n.common.appName} – ${i18n.medling.title}` };

  const title = i18n.mediationCase.heading(
    caseNumber(detail.mediationCase.id),
    MEDIATION_TYPE_LABEL[lang][detail.mediationCase.type],
  );
  const description = i18n.medling.subtitle;
  return {
    title: `${i18n.common.appName} – ${title}`,
    description,
    openGraph: { title, description },
  };
}

export default async function MediationCasePage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, session] = await Promise.all([params, getSession()]);
  const { i18n, lang } = session;
  const detail = await getMediationCase(id, lang);
  if (!detail) notFound();

  const { mediationCase, linkedAgreements, events } = detail;
  const benchmark = await getCurrentBenchmark();
  const miAppoints = miAppointsMediators(mediationCase);
  const c = i18n.mediationCase;
  const ds = i18n.decisionSupport;

  return (
    <AppShell role={session.role} requires="medling" dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      <PageHeading
        title={c.heading(
          caseNumber(mediationCase.id),
          MEDIATION_TYPE_LABEL[lang][mediationCase.type],
        )}
        back={
          <Link
            href="/medling"
            className="inline-flex min-h-11 items-center gap-1 text-label font-semibold text-primary underline underline-offset-2"
          >
            <IconBack /> {i18n.common.backTo(i18n.medling.title)}
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-5 @3xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-5">
          <Panel title={c.uploaded(mediationCase.dgDecision.number)} tags={["FF-007"]}>
            <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4">
              <Field
                label={c.registryNumber}
                value={mediationCase.registryNumber ?? i18n.common.none}
              />
              <Field label={c.decisionDate} value={mediationCase.dgDecision.date} />
              <Field label={c.type} value={MEDIATION_TYPE_LABEL[lang][mediationCase.type]} />
              <Field label={c.dgDecisionDocument} value={mediationCase.dgDecision.document} />
            </div>
          </Panel>

          <Panel
            title={c.linkedAgreements(linkedAgreements.length)}
            tags={["FF-008"]}
            action={<Button variant="secondary"
        disabled
        disabledReason={i18n.common.notInDemo}
      >{c.linkAgreement}</Button>}
          >
            <ul className="space-y-3">
              {linkedAgreements.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center gap-3 text-table">
                  <StatusDot status={a.status} showLabel />
                  <span>
                    {a.name} · {a.validity}
                  </span>
                </li>
              ))}
            </ul>
            <Rationale>{c.linkedNote}</Rationale>
          </Panel>

          <Panel
            title={c.mediators}
            tags={["FF-009"]}
            action={<Button variant="secondary"
        disabled
        disabledReason={i18n.common.notInDemo}
      >{c.addMediator}</Button>}
          >
            {mediationCase.mediators.length === 0 ? (
              <p className="text-table text-muted-foreground">{c.noMediators}</p>
            ) : (
              <ul className="space-y-2 text-table">
                {mediationCase.mediators.map((m) => (
                  <li key={m.id}>
                    {m.name} · {MEDIATION_TYPE_LABEL[lang][mediationCase.type]} ·{" "}
                    {c.position(MEDIATOR_POSITION_LABEL[lang][m.position])} ·{" "}
                    {c.previousAssignments(m.previousAssignments)}
                  </li>
                ))}
              </ul>
            )}
            <Rationale>{c.mediatorStatsNote}</Rationale>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title={c.procedureAgreement} tags={["FF-006", "FA-017"]} tone="mint">
            <p className="text-table">{miAppoints ? c.coveredNot : c.covered}</p>
            {/* The consequence of the rule above, marked as one. */}
            <p className="mt-3 flex items-start gap-2 font-semibold text-primary">
              <span className="flex h-6 items-center">
                <IconForward />
              </span>
              <span className="min-w-0">{miAppoints ? c.miAppoints : c.partiesMediate}</span>
            </p>
            <Rationale>{c.procedureNote}</Rationale>
          </Panel>

          {/*
            §4.1 decision support — the only free-standing AI surface in MIIS.
            It answers the three questions the requirement names for a mediation
            case (other parties in the agreement area, previous mediations,
            contagion risk) out of information MIIS already holds. It is not a
            general assistant: nothing in the requirements asks for one, and an
            unrequested feature reads as requirements that were not read closely.
          */}
          {mediationCase.decisionSupport && (
            <AiRegion
              title={ds.title}
              mark={i18n.common.aiMark}
              notice={i18n.common.aiNotice}
              regionLabel={i18n.common.aiRegionLabel}
              tags={["§4.1", "FAI-002"]}
            >
              <p className="mb-3 text-label text-muted-foreground">{ds.subtitle}</p>

              <dl className="space-y-3">
                <div>
                  <dt className="text-label font-bold">{ds.otherParties}</dt>
                  <dd className="text-table">
                    {t(mediationCase.decisionSupport.otherParties, lang)}
                  </dd>
                </div>
                <div>
                  <dt className="text-label font-bold">{ds.previousMediations}</dt>
                  <dd className="text-table">
                    {t(mediationCase.decisionSupport.previousMediations, lang)}
                  </dd>
                </div>
                <div>
                  <dt className="text-label font-bold">{ds.contagionRisk}</dt>
                  <dd className="text-table">
                    {t(mediationCase.decisionSupport.contagionRisk, lang)}
                  </dd>
                </div>
              </dl>

              <div className="mt-4">
                <Callout tone="ai">{ds.scopeNote}</Callout>
              </div>
            </AiRegion>
          )}

          {benchmark && (
            <Panel title={c.benchmarkTitle} tags={["FM-003"]} tone="sand">
              <p className="text-table text-sand-foreground">
                {i18n.start.benchmarkCostFrame(percent(benchmark.costFramePercent, lang))} ·{" "}
                {c.benchmarkMonths(benchmark.months)}
              </p>
              <p className="text-table text-sand-foreground">
                {i18n.start.benchmarkPeriodisation(benchmark.periodisation)}
              </p>
              <p className="mt-2 text-label text-sand-foreground">
                {c.benchmarkPeriod(benchmark.validFrom, benchmark.validTo)}
              </p>
            </Panel>
          )}
        </div>
      </div>

      <div className="mt-5 space-y-5">
        <Panel title={c.documents} tags={["FSD-001", "FD-001"]}>
          <p className="text-table">
            {mediationCase.documents
              ? t(mediationCase.documents, lang)
              : mediationCase.dgDecision.document}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Button variant="secondary"
        disabled
        disabledReason={i18n.common.notInDemo}
      >{c.createWithNotice}</Button>
            <Button variant="secondary"
        disabled
        disabledReason={i18n.common.notInDemo}
      >{c.createWithoutNotice}</Button>
            <Button
        disabled
        disabledReason={i18n.common.notInDemo}
      >{c.finalise}</Button>
            <ReqTag id="FE-001" />
            <span className="flex items-start gap-2 text-label text-muted-foreground">
              <span className="flex h-6 items-center">
                <IconForward size="sm" />
              </span>
              <span className="min-w-0">{c.finaliseNote}</span>
            </span>
          </div>
          <Rationale>{c.templateNote}</Rationale>
        </Panel>

        {mediationCase.outcome && (
          <Panel title={c.outcome} tags={["FF-010"]}>
            <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2 @3xl:grid-cols-3 @xl:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-5">
              <Field
                label={c.outcomeType}
                value={MEDIATION_TYPE_LABEL[lang][mediationCase.outcome.mediationType]}
              />
              <Field
                label={c.industrialAction}
                value={mediationCase.outcome.industrialAction ? i18n.common.yes : i18n.common.no}
              />
              <Field
                label={c.industrialActionType}
                value={mediationCase.outcome.industrialActionType ?? i18n.common.none}
              />
              <Field
                label={c.lostWorkingDays}
                value={
                  mediationCase.outcome.lostWorkingDays
                    ? amount(mediationCase.outcome.lostWorkingDays, lang)
                    : i18n.common.none
                }
              />
              <Field
                label={c.affectedEmployees}
                value={
                  mediationCase.outcome.affectedEmployees
                    ? amount(mediationCase.outcome.affectedEmployees, lang)
                    : i18n.common.none
                }
              />
            </div>
            <Rationale>{c.outcomeNote}</Rationale>
            <div className="mt-4">
              <Button variant="secondary"
        disabled
        disabledReason={i18n.common.notInDemo}
      >{c.registerStanding}</Button>
            </div>
          </Panel>
        )}

        {/*
          No status marker here. These are events, not agreements, and the log
          has no FR-012 status of its own to show — the previous version asserted
          "tecknat efter medling" on every row regardless.
        */}
        {events.length > 0 && (
          <Panel title={c.eventLog} tags={["FH-002"]}>
            <ul className="divide-y divide-border text-table">
              {events.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center gap-3 py-2.5">
                  <span className="tabular-nums text-muted-foreground">{e.timestamp}</span>
                  <span>{e.detail}</span>
                </li>
              ))}
            </ul>
            <Rationale>{c.eventLogNote}</Rationale>
          </Panel>
        )}
      </div>
    </AppShell>
  );
}
