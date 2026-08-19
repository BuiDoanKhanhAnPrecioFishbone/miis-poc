import type { Metadata } from "next";

import { AppShell } from "@/components/miis/AppShell";
import { RegistrationSave } from "@/components/miis/RegistrationSave";
import { ProtocolReview } from "@/components/miis/ProtocolReview";
import { Select } from "@/components/miis/Select";
import { Toggle } from "@/components/miis/Toggle";
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
import { listWatchwords } from "@/lib/data/watchwords";
import { AGREEMENT_CONSTRUCTIONS, registrationStatusLabel } from "@/lib/domain/agreement";
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
  const [proposals, watchwords] = await Promise.all([
    listExtractionProposals(),
    listWatchwords(),
  ]);
  const t = i18n.registrera;

  return (
    <AppShell role={session.role} dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      <PageHeading title={t.title} subtitle={t.subtitle} tags={["FAI-001", "FAI-002", "FAI-003"]} />

      <ProtocolReview proposals={proposals} lang={lang} watchwords={watchwords}>
        <div id="steg-loneavtal" className="scroll-mt-24">
          <Panel title={t.wage.title} tags={["FA-002", "FA-007"]}>
            <div className="space-y-4">
              <Select
                id="wage-construction"
                label={t.wage.construction}
                defaultValue="2"
                hint={t.wage.constructionHint}
                options={([1, 2, 3, 4, 5, 6, 7] as const).map((n) => ({
                  id: String(n),
                  label: `${n}. ${AGREEMENT_CONSTRUCTIONS[lang][n]}`,
                }))}
              />

              <div className="grid grid-cols-1 gap-4 @xl:grid-cols-4">
                <Field label={t.wage.scope} value={percent(3.4, lang)} />
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

              <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2">
                <Field
                  label={t.wage.revision}
                  value={`2027-06-01 · ${percent(3.4, lang)}`}
                  hint={t.wage.revisionHint}
                />
                <Field
                  label={t.wage.minimumWage}
                  value="25 480 kr/mån 2025-08-01"
                  hint={t.wage.minimumWageHint}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2">
                <div className="flex flex-wrap items-start gap-2">
                  <Toggle id="flag-equality" label={t.wage.equalityFlag} lang={lang} defaultOn />
                  <ReqTag id="FA-011" />
                </div>
                <div className="flex flex-wrap items-start gap-2">
                  <Toggle id="flag-benchmark" label={t.wage.benchmarkFlag} lang={lang} />
                  <ReqTag id="FA-012" />
                </div>
              </div>
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-5 @5xl:grid-cols-2">
          <Panel title={t.terms.title} tags={["FA-003", "FA-004"]}>
            <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2">
              <Field label={t.terms.ownSignedDate} value="2025-07-15" />
              <Field label={t.terms.ownValidity} value="2025-08-01 – 2027-07-31" />
            </div>
            <Rationale>{t.terms.note}</Rationale>
          </Panel>

          <Panel title={t.link.title} tags={["FF-002", "FD-001"]}>
            <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2">
              <Field label={t.link.negotiation} value="FÖ-2025/218 – Kommunikation, 2025-07-15" />
              <Field label={t.link.documentLinkedTo} value={t.link.documentLinkedToValue} />
            </div>
          </Panel>
        </div>

        <div id="steg-spara" className="scroll-mt-24">
          <Panel title={t.save.title} tags={["FA-021", "D-001"]}>
            <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2">
              <Select
                id="registration-status"
                label={t.save.registrationStatus}
                defaultValue="incomplete"
                options={[
                  { id: "incomplete", label: registrationStatusLabel("incomplete", lang) },
                  { id: "complete", label: registrationStatusLabel("complete", lang) },
                ]}
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

            <div className="mt-4 flex flex-wrap items-start gap-2">
              <Toggle id="flag-confidential" label={t.save.confidentialityLabel} lang={lang}>
                <ConfidentialityMarker
                  label={i18n.confidentiality.marked}
                  note={i18n.confidentiality.inStatistics}
                />
              </Toggle>
              <ReqTag id="D-001" />
            </div>
            <Rationale>{t.save.confidentialityHint}</Rationale>

            {/*
              The controls live in a client component because they finish MI's
              five-step flow, and the stepper at the top of the page has to hear
              about it. They used to be plain buttons with no handler at all.
            */}
            <RegistrationSave lang={lang} />
            <Rationale>{t.save.incompleteNote}</Rationale>

            <Rationale>{t.save.auditNote}</Rationale>
            <div className="mt-2 flex flex-wrap gap-2">
              <ReqTag id="FH-001" />
              <ReqTag id="FH-002" />
              <ReqTag id="FR-012" />
            </div>
          </Panel>
        </div>
      </ProtocolReview>
    </AppShell>
  );
}
