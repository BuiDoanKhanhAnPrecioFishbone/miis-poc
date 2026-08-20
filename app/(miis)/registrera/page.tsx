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
  FieldLabel,
  TextField,
  StatusDot,
  StatusLegend,
  PageHeading,
  Panel,
  Rationale,
  ReqTag,
} from "@/components/miis/primitives";
import { listExtractionProposals } from "@/lib/data/extraction";
import { listWatchwords } from "@/lib/data/watchwords";
import { AGREEMENT_CONSTRUCTIONS, registrationStatusLabel } from "@/lib/domain/agreement";
import { statusInfo } from "@/lib/domain/status";
import { decimal } from "@/lib/format";
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
    <AppShell role={session.role} requires="avtal" dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
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

              {/*
                These are the officer's to register (FA-008 to FA-010), so they
                are inputs. They were `Field` — display only — and read as
                editable purely because `Field` was borrowing the input styling.
              */}
              {/*
                Three columns, not four. At four, "Kostnad för
                arbetstidsförkortning (%)" is wider than its column — the label
                is the longest string on this screen and it decides the grid,
                not the other way round.
              */}
              <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2 @3xl:grid-cols-3">
                {/*
                  The unit lives in the label and the field holds a bare number.
                  A user typing into a box that already reads "3,4 %" has to
                  decide whether to keep the sign, and a stored value of
                  "3,4 %" is a string that no report can sum.
                */}
                <TextField
                  id="wage-scope"
                  label={t.wage.scope}
                  defaultValue={decimal(3.4, lang)}
                  numeric
                width="short"
                />
                <TextField
                  id="wage-cost-frame"
                  label={t.wage.costFrame}
                  defaultValue={decimal(6.4, lang)}
                  numeric
                width="short"
                />
                <Select
                  id="wage-individual-guarantee"
                  label={t.wage.individualGuarantee}
                  defaultValue="no"
                  options={[
                    { id: "no", label: i18n.common.no },
                    { id: "yes", label: i18n.common.yes },
                  ]}
                />
                {/*
                  Two facts, two fields. This was one box reading "Ja · 0,2 %" —
                  a yes/no and a percentage joined by a separator, which cannot
                  be validated, cannot be filtered on and cannot be answered by
                  a user who has one of the two.
                */}
                <Select
                  id="wage-working-time"
                  label={t.wage.workingTimeFlag}
                  defaultValue="yes"
                  options={[
                    { id: "yes", label: i18n.common.yes },
                    { id: "no", label: i18n.common.no },
                  ]}
                />
                <TextField
                  id="wage-working-time-cost"
                  label={t.wage.workingTimeCost}
                  defaultValue={decimal(0.2, lang)}
                  numeric
                width="short"
                />
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <ReqTag id="FA-008" />
                <ReqTag id="FA-009" />
                <ReqTag id="FA-010" />
              </div>

              <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2">
                <TextField
                  id="wage-revision-date"
                  label={t.wage.revisionDate}
                  type="date"
                  defaultValue="2027-06-01"
                  numeric
                width="short"
                />
                <TextField
                  id="wage-revision-percent"
                  label={t.wage.revisionPercent}
                  defaultValue={decimal(3.4, lang)}
                  hint={t.wage.revisionHint}
                  numeric
                width="short"
                />
                <TextField
                  id="wage-minimum"
                  label={t.wage.minimumWage}
                  defaultValue={decimal(25480, lang)}
                  numeric
                width="short"
                />
                <TextField
                  id="wage-minimum-date"
                  label={t.wage.minimumWageDate}
                  type="date"
                  defaultValue="2025-08-01"
                  hint={t.wage.minimumWageHint}
                  numeric
                width="short"
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
              <TextField
                id="terms-signed"
                label={t.terms.ownSignedDate}
                type="date"
                defaultValue="2025-07-15"
                numeric
              width="short"
              />
              <TextField
                id="terms-validity"
                label={t.terms.ownValidity}
                defaultValue="2025-08-01 – 2027-07-31"
                numeric
              width="short"
              />
            </div>
            <Rationale>{t.terms.note}</Rationale>
          </Panel>

          <Panel title={t.link.title} tags={["FF-002", "FD-001"]}>
            <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2">
              {/*
                FF-002 links the protocol to a negotiation that already exists,
                so this is a choice from a register rather than free text.
              */}
              <Select
                id="link-negotiation"
                label={t.link.negotiation}
                options={[
                  { id: "fo-218", label: "FÖ-2025/218 – Kommunikation, 2025-07-15" },
                  { id: "fo-204", label: "FÖ-2025/204 – Stål- och metallindustrin, 2025-06-02" },
                ]}
              />
              <Field label={t.link.documentLinkedTo} value={t.link.documentLinkedToValue} />
            </div>
          </Panel>
        </div>

        <div id="steg-spara" className="scroll-mt-24">
          <Panel title={t.save.title} tags={["FA-021", "D-001"]}>
            {/*
              There is no registration-status dropdown any more, and its absence
              is the fix.

              FA-021 gives a registration two states, Ofullständig and Klar. The
              panel offered both a dropdown *and* two buttons that each set one
              of them — so an officer could choose Klar and then press "Spara
              som ofullständig", and nothing on the screen said which of the two
              won. Two controls over one value is not a preference; it is a bug
              waiting to be found in a demo.

              The action sets the status, because that is what the action means.
              The status the current choice will produce is shown below, derived
              rather than chosen.
            */}
            <div className="max-w-2xl">
              {/*
                The agreement's own FR-012 status, with the key beside it. The
                label used to read "Färgkodning i vyerna" — a sentence about the
                interface rather than about the agreement, which told the
                officer where the value would be seen and not what it was.
              */}
              <div>
                <FieldLabel>{t.save.agreementStatus}</FieldLabel>
                <div className="min-h-11 border-b border-border py-2 text-body">
                  <StatusDot status={statusInfo("newly-signed", lang)} showLabel />
                </div>
                <p className="mt-2 text-label text-muted-foreground">{t.save.statusKey}</p>
                <div className="mt-1">
                  <StatusLegend lang={lang} />
                </div>
              </div>
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
