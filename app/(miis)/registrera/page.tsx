import type { Metadata } from "next";

import { AppShell } from "@/components/miis/AppShell";
import { ProtocolReview } from "@/components/miis/ProtocolReview";
import {
  Badge,
  Button,
  ConfidentialityMarker,
  Field,
  PageHeading,
  Panel,
  Rationale,
  ReqTag,
} from "@/components/miis/primitives";
import { listExtractionProposals } from "@/lib/data/extraction";
import { AGREEMENT_CONSTRUCTIONS } from "@/lib/domain/agreement";
import { statusInfo, STATUS_LEGEND } from "@/lib/domain/status";
import { percent } from "@/lib/format";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const { i18n } = await getSession();
  const title = `${i18n.common.appName} – ${i18n.registrera.title}`;
  const description = i18n.registrera.subtitle;
  return { title, description, openGraph: { title, description } };
}

export default async function RegistreraPage() {
  const session = await getSession();
  const { i18n, lang } = session;
  const proposals = await listExtractionProposals();
  const t = i18n.registrera;

  return (
    <AppShell role={session.role} dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      <PageHeading title={t.title} subtitle={t.subtitle} tags={["FAI-001", "FAI-002", "FAI-003"]} />

      <ol className="mb-6 flex flex-wrap gap-3">
        {t.steps.map((s, i) => (
          <li
            key={s}
            aria-current={i === 1 ? "step" : undefined}
            className={`rounded-full px-5 py-2.5 text-label font-semibold ${
              i <= 1
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {s}
          </li>
        ))}
      </ol>

      <ProtocolReview proposals={proposals} lang={lang}>
        <Panel title={t.wage.title} tags={["FA-002", "FA-007"]}>
          <div className="space-y-4">
            <Field
              label={t.wage.construction}
              value={`2. ${AGREEMENT_CONSTRUCTIONS[lang][2]}`}
              hint={t.wage.constructionHint}
            />

            <div className="grid gap-4 @xl:grid-cols-4">
              <Field label={t.wage.scope} value={percent(3.2, lang)} />
              <Field label={t.wage.costFrame} value={percent(6.4, lang)} />
              <Field label={t.wage.individualGuarantee} value={i18n.common.no} />
              <Field
                label={t.wage.workingTime}
                value={`${i18n.common.yes} · ${percent(0.2, lang)}`}
              />
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <ReqTag id="FA-008" />
              <ReqTag id="FA-009" />
              <ReqTag id="FA-010" />
            </div>

            <div className="grid gap-4 @xl:grid-cols-2">
              <Field
                label={t.wage.revision}
                value={`2027-06-01 · ${percent(3.2, lang)}`}
                hint={t.wage.revisionHint}
              />
              <Field
                label={t.wage.minimumWage}
                value="25 480 kr/mån 2027-06-01"
                hint={t.wage.minimumWageHint}
              />
            </div>

            <div className="grid gap-4 @xl:grid-cols-2">
              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="text-label font-bold">{t.wage.equalityFlag}</span>
                  <ReqTag id="FA-011" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-14 items-center rounded-full bg-status-green px-1">
                    <span className="ml-auto size-6 rounded-full bg-card" />
                  </span>
                  <span className="text-table font-semibold">{i18n.common.yes}</span>
                </div>
              </div>
              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="text-label font-bold">{t.wage.benchmarkFlag}</span>
                  <ReqTag id="FA-012" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-14 items-center rounded-full bg-secondary px-1">
                    <span className="mr-auto size-6 rounded-full bg-card" />
                  </span>
                  <span className="text-table text-muted-foreground">{i18n.common.no}</span>
                </div>
              </div>
            </div>
          </div>
        </Panel>

        <div className="grid gap-5 @5xl:grid-cols-2">
          <Panel title={t.terms.title} tags={["FA-003", "FA-004"]}>
            <div className="grid gap-4 @xl:grid-cols-2">
              <Field label={t.terms.ownSignedDate} value="2027-05-28" />
              <Field label={t.terms.ownValidity} value="2027-06-01 – 2030-05-31" />
            </div>
            <Rationale>{t.terms.note}</Rationale>
          </Panel>

          <Panel title={t.link.title} tags={["FF-002", "FD-001"]}>
            <div className="grid gap-4 @xl:grid-cols-2">
              <Field label={t.link.negotiation} value="FÖ-2027/218 – Kommunikation, 2027-05-28" />
              <Field label={t.link.documentLinkedTo} value={t.link.documentLinkedToValue} />
            </div>
          </Panel>
        </div>

        <Panel title={t.save.title} tags={["FA-021", "D-001"]}>
          <div className="grid gap-4 @xl:grid-cols-2">
            <Field
              label={t.save.registrationStatus}
              value={`${i18n.rapporter.shortTerm.partiallyRegistered} ▾`}
            />
            {/*
              FR-012 in words. The registration decides the colour the agreement
              will carry in every list, so the form says which one — the reader
              should not have to deduce it from a legend elsewhere.
            */}
            <Field
              label={t.save.colourCoding}
              value={statusInfo("newly-signed", lang).label}
              hint={STATUS_LEGEND[lang]}
            />
          </div>

          <div className="mt-4">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="text-label font-bold">{t.save.confidentialityLabel}</span>
              <ReqTag id="D-001" />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-8 w-14 items-center rounded-full bg-secondary px-1">
                <span className="mr-auto size-6 rounded-full bg-card" />
              </span>
              <ConfidentialityMarker
                label={i18n.confidentiality.marked}
                note={i18n.confidentiality.inStatistics}
              />
            </div>
            <Rationale>{t.save.confidentialityHint}</Rationale>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button>{t.save.approveAndLink}</Button>
            <Button variant="secondary">{t.save.saveIncomplete}</Button>
            <ReqTag id="FA-022" />
          </div>
          <Rationale>{t.save.incompleteNote}</Rationale>

          <Rationale>{t.save.auditNote}</Rationale>
          <div className="mt-2 flex flex-wrap gap-2">
            <ReqTag id="FH-001" />
            <ReqTag id="FH-002" />
            <ReqTag id="FR-012" />
          </div>
        </Panel>
      </ProtocolReview>
    </AppShell>
  );
}
