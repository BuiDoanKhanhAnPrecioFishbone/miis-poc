import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Link from "next/link";

import { AppShell } from "@/components/miis/AppShell";
import { DocumentTemplate } from "@/components/miis/DocumentTemplate";
import {
  CaseAgreements,
  CaseDecision,
  CaseMediators,
  CaseOutcome,
} from "@/components/miis/MediationCaseAdmin";
import { SectionTabs } from "@/components/miis/SectionTabs";
import { IconBack, IconForward } from "@/components/miis/icons";
import {
  AiRegion,
  Callout,
  Field,
  PageHeading,
  Panel,
  Rationale,
  ReqTag,
  StatusDot,
} from "@/components/miis/primitives";
import { getCurrentBenchmark } from "@/lib/data/benchmark";
import { listAgreements } from "@/lib/data/agreements";
import { getMediationCase } from "@/lib/data/mediation";
import { listMediators, mediatorStats } from "@/lib/data/mediators";
import { t } from "@/lib/domain/lang";
import {
  caseNumber,
  MEDIATION_TYPE_LABEL,
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

  /*
    What may be linked and who may be appointed, decided on the server.

    The mediator list is narrowed here rather than in the browser: only someone
    active who takes this case's mediation type can be appointed, and a picker
    offering anyone else is a control whose choice has to be undone. The
    agreement rows are server-rendered for the same reason the public search's
    are — they carry FR-012's status marker, which is a decision that belongs on
    the server.
  */
  const [allAgreements, allMediators] = await Promise.all([listAgreements(), listMediators()]);
  const mediatorCandidates = allMediators
    .filter((m) => m.active && m.types.includes(mediationCase.type))
    .map((m) => ({
      id: m.id,
      name: m.name,
      previousAssignments: mediatorStats(m).assignments,
    }));
  const agreementCandidates = allAgreements.map((a) => ({ id: a.id, name: a.name }));
  const linkedRows: Record<string, React.ReactNode> = {};
  for (const a of linkedAgreements) {
    linkedRows[a.id] = (
      <span className="flex flex-wrap items-center gap-3 text-table">
        <StatusDot status={a.status} showLabel />
        <span>
          {a.name} · {a.validity}
        </span>
      </span>
    );
  }
  const miAppoints = miAppointsMediators(mediationCase);
  const c = i18n.mediationCase;
  const ds = i18n.decisionSupport;
  /* `number` reads "GD-beslut nr 12/2027" already, so the template heading and
     the file name take the bare number rather than prefixing it a second time. */
  const decisionNumber = mediationCase.dgDecision.number.replace(/^GD-beslut nr\s*/i, "");

  return (
    <AppShell
      walkthrough={session.walkthrough} role={session.role} requires="medling" dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
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

      {/*
        A mediation case is four jobs, not one column of ten panels.

        This screen was stacked on the reading that a case is one subject read
        in order. It is not. **Arendet** is what the Director-General decided and
        which agreements it covers, **Medlare** is the appointment, **Handlingar**
        is the GD-beslut and its klarmarkering, and **Utfall** is what the
        mediation produced and what the log recorded. An administrator who came
        to appoint a mediator scrolled past the other three, and FF-010's
        outcome — the act that ends a mediation and produces the statistics MI
        publishes on industrial action — sat below the fold at every width.

        **The sidebar stays outside the tabs**, because it is what every one of
        those jobs is done against: whether a forhandlingsordning applies decides
        whether MI appoints anybody at all (FF-006), the decision support is read
        while appointing, and Market is the frame the outcome is judged in. A tab
        that hid them would have the administrator switching back to see what
        they were deciding under.

        The sidebar is `20rem` rather than `0.9fr`, too. A column of short facts
        does not take 45 % of the page — the same measurement that fixed the
        agreement view, and this screen still had the old proportion.
      */}
      <div className="print-stack grid grid-cols-1 gap-5 @3xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">
          <SectionTabs
            label={c.tabs.label}
            lang={lang}
            sections={[
              {
                id: "arendet",
                label: c.tabs.case,
                node: (
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

          {/*
            FF-008 — *"ett medlingsärende ska kunna kopplas till flera avtal"*.
            The control was `disabled` with "Ej aktiv i demon", so a case could
            be read and never told which agreements it was about.
          */}
          <CaseAgreements
            linked={linkedAgreements.map((a) => ({ id: a.id, label: a.name }))}
            candidates={agreementCandidates}
            rowFor={linkedRows}
            lang={lang}
          />
                  </div>
                ),
              },
              {
                id: "medlare",
                label: c.tabs.mediators,
                node: (
                  <div className="space-y-5">
          {/*
            FF-009 — appointing a mediator, with the position that FF-009's own
            statistics count. Also a `disabled` button until now.
          */}
          <CaseMediators
            mediators={mediationCase.mediators}
            candidates={mediatorCandidates}
            type={mediationCase.type}
            lang={lang}
          />
                  </div>
                ),
              },
              {
                id: "handlingar",
                label: c.tabs.documents,
                node: (
                  <div className="space-y-5">
        <Panel title={c.documents} tags={["FSD-001", "FD-001"]}>
          <p className="text-table">
            {mediationCase.documents
              ? t(mediationCase.documents, lang)
              : mediationCase.dgDecision.document}
          </p>
          {/*
            FE-001 names this act as its own trigger — *"notifierings-epost
            skickas till medlaradministratör när ett medlingsbeslut
            klarmarkerats"* — and the control was disabled, so the requirement
            was described beside a button that refused to perform it.
          */}
          <CaseDecision lang={lang} />
          <div className="mt-2">
            <ReqTag id="FE-001" />
          </div>
          <Rationale>{c.templateNote}</Rationale>
        </Panel>

        {/*
          FSD-001 — *"skapa GD-beslut om medling utifrån dokumentmallar, en
          variant med varsel och en utan varsel"*.

          One document with a variant, not two documents: it was two disabled
          buttons side by side, which said the opposite and gave the officer no
          way to see which of the two they were about to produce. Bilaga E is
          MI's own example of the output, and its shape — decision number,
          decider, presenter, the *Ärende: Medling* line, the mediators, the
          copy list — is what the template fills in from the case.
        */}
        <DocumentTemplate
          lang={lang}
          heading={c.createDecision}
          intro={c.templateNote}
          requirements={["FSD-001", "FD-001", "FH-001"]}
          logNote={c.decisionLogNote}
          fields={[
            {
              label: c.registryNumber,
              value: mediationCase.registryNumber ?? i18n.common.none,
              source: c.sourceCase,
            },
            {
              label: c.decisionNumber,
              value: mediationCase.dgDecision.number,
              source: c.sourceCase,
            },
            { label: c.decisionDate, value: mediationCase.dgDecision.date, source: c.sourceCase },
            {
              label: c.mediators,
              value: mediationCase.mediators.map((m) => m.name).join(", "),
              source: c.sourceRegister,
            },
          ]}
          variants={[
            {
              id: "with-notice",
              label: c.withNotice,
              fileName: `GD-beslut ${decisionNumber.replace("/", "-")} med varsel.docx`,
              body: [
                c.decisionHeading(decisionNumber),
                "",
                `${c.decider}: Irene Wennemo`,
                `${c.presenter}: Per Ewaldsson`,
                "",
                `${c.matter}: ${c.mediation}`,
                "",
                c.bodyWithNotice(
                  mediationCase.name,
                  mediationCase.mediators.map((m) => m.name).join(", "),
                ),
              ].join("\n"),
            },
            {
              id: "without-notice",
              label: c.withoutNotice,
              fileName: `GD-beslut ${decisionNumber.replace("/", "-")}.docx`,
              body: [
                c.decisionHeading(decisionNumber),
                "",
                `${c.decider}: Irene Wennemo`,
                `${c.presenter}: Per Ewaldsson`,
                "",
                `${c.matter}: ${c.mediation}`,
                "",
                c.bodyWithoutNotice(
                  mediationCase.name,
                  mediationCase.mediators.map((m) => m.name).join(", "),
                ),
              ].join("\n"),
            },
          ]}
        />
                  </div>
                ),
              },
              {
                id: "utfall",
                label: c.tabs.outcome,
                node: (
                  <div className="space-y-5">
        {/*
          FF-010's outcome, always shown.

          It rendered only when an outcome already existed, so the act that ends
          a mediation — and produces the statistics MI publishes on industrial
          action — was demonstrable on a case that had already ended and
          impossible on a live one.
        */}
        <CaseOutcome
          outcome={mediationCase.outcome}
          type={mediationCase.type}
          lang={lang}
        />

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
                ),
              },
            ]}
          />
        </div>

        {/* The right-hand column: what the case is read against. */}
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
              id="beslutsstod"
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
    </AppShell>
  );
}
