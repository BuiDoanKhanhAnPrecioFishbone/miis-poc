import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/miis/AppShell";
import { Button, Field, Panel, ReqTag, StatusDot } from "@/components/miis/primitives";
import { getCurrentBenchmark } from "@/lib/data/benchmark";
import { getMediationCase } from "@/lib/data/mediation";
import { t } from "@/lib/domain/lang";
import {
  caseNumber,
  MEDIATION_TYPE_LABEL,
  MEDIATOR_POSITION_LABEL,
  miAppointsMediators,
} from "@/lib/domain/mediation";
import { statusInfo } from "@/lib/domain/status";
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
  return { title: `${i18n.common.appName} – ${title}`, description, openGraph: { title, description } };
}

export default async function MediationCasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
    <AppShell role={session.role} dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      <h1 className="mb-6 font-display text-page-title font-semibold text-[var(--mi-slate-900)]">
        {c.heading(caseNumber(mediationCase.id), MEDIATION_TYPE_LABEL[lang][mediationCase.type])}
      </h1>

      <div className="grid gap-5 @3xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-5">
          <Panel title={c.uploaded(mediationCase.dgDecision.number)} tags={["FF-007"]}>
            <div className="grid gap-4 @xl:grid-cols-2 @3xl:grid-cols-4">
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
            action={<Button variant="outline">{c.linkAgreement}</Button>}
          >
            <ul className="space-y-3">
              {linkedAgreements.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center gap-3 text-table">
                  <StatusDot status={statusInfo("after-mediation", lang)} showLabel />
                  <span>
                    {a.name} · {a.validity}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-label text-muted-foreground">{c.linkedNote}</p>
          </Panel>

          <Panel
            title={c.mediators}
            tags={["FF-009"]}
            action={<Button variant="outline">{c.addMediator}</Button>}
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
            <p className="mt-3 text-label text-muted-foreground">{c.mediatorStatsNote}</p>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title={c.procedureAgreement} tags={["FF-006", "FA-017"]} tone="mint">
            <p className="text-table">{miAppoints ? c.coveredNot : c.covered}</p>
            <p className="mt-3 font-semibold text-primary">
              {miAppoints ? c.miAppoints : c.partiesMediate}
            </p>
            <p className="mt-3 text-label text-primary">{c.procedureNote}</p>
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
            <Panel title={ds.title} tags={["§4.1", "FAI-002"]}>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-sm border border-ai-border bg-ai px-2 py-0.5 text-meta font-bold tracking-wide text-ai-foreground">
                  {i18n.common.aiProposal}
                </span>
                <span className="text-label text-muted-foreground">{ds.subtitle}</span>
              </div>

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

              <p className="mt-4 rounded-md border border-border bg-secondary px-4 py-3 text-label text-muted-foreground">
                {ds.scopeNote} {ds.reviewNote}
              </p>
            </Panel>
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
            <Button variant="outline">{c.createWithNotice}</Button>
            <Button variant="outline">{c.createWithoutNotice}</Button>
            <Button>{c.finalise}</Button>
            <ReqTag id="FE-001" />
            <span className="text-label text-muted-foreground">{c.finaliseNote}</span>
          </div>
          <p className="mt-3 text-label text-muted-foreground">{c.templateNote}</p>
        </Panel>

        {mediationCase.outcome && (
          <Panel title={c.outcome} tags={["FF-010"]}>
            <div className="grid gap-4 @xl:grid-cols-3 @3xl:grid-cols-5">
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
            <p className="mt-3 text-label text-muted-foreground">{c.outcomeNote}</p>
            <div className="mt-4">
              <Button variant="outline">{c.registerStanding}</Button>
            </div>
          </Panel>
        )}

        {events.length > 0 && (
          <Panel title={c.eventLog} tags={["FH-002", "FR-012"]}>
            <ul className="divide-y divide-border text-table">
              {events.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center gap-3 py-2.5">
                  <StatusDot status={statusInfo("after-mediation", lang)} showLabel />
                  <span className="tabular-nums text-muted-foreground">{e.timestamp}</span>
                  <span>{e.detail}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-label text-muted-foreground">{c.eventLogNote}</p>
          </Panel>
        )}
      </div>
    </AppShell>
  );
}
