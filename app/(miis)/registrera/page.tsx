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
  FormGrid,
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
    <AppShell
      walkthrough={session.walkthrough} role={session.role} requires="avtal" dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      <PageHeading title={t.title} subtitle={t.subtitle} tags={["FAI-001", "FAI-002", "FAI-003"]} />

      <ProtocolReview proposals={proposals} lang={lang} watchwords={watchwords}>
        <div id="steg-loneavtal" className="scroll-mt-24">
          <Panel title={t.wage.title} tags={["FA-002", "FA-007"]}>
            {/*
              The panel's title names the thing, and the sentence explains it.
              It read "Löneavtal 2027 – ny rad för avtalsrörelsen": a heading
              with a clause of prose attached, which no register in MI's own
              printouts does, and which cannot be reused as a breadcrumb, a
              print title or a table caption.
            */}
            <p className="mb-4 max-w-4xl text-table">{t.wage.intro}</p>

            <div className="space-y-5">
              {/*
                One form row, one set of columns.

                This was three grids in a column — three-across, then two, then
                two — so the panel showed a row of three, a row of two, and two
                more rows of two, with the gap changing between them. `FormGrid`
                fits as many field-width columns as the panel has, and each
                field claims one or two of them, so every box lines up with the
                one above it whatever the panel is wide.
              */}
              <FormGrid>
                <Select
                  id="wage-construction"
                  label={t.wage.construction}
                  defaultValue="2"
                  hint={t.wage.constructionHint}
                  width="full"
                  options={([1, 2, 3, 4, 5, 6, 7] as const).map((n) => ({
                    id: String(n),
                    label: `${n}. ${AGREEMENT_CONSTRUCTIONS[lang][n]}`,
                  }))}
                />

                {/*
                  These are the officer's to register (FA-008 to FA-010), so
                  they are inputs. They were `Field` — display only — and read
                  as editable purely because `Field` was borrowing the input
                  styling.

                  The unit lives in the label and the field holds a bare number.
                  A user typing into a box that already reads "3,4 %" has to
                  decide whether to keep the sign, and a stored value of "3,4 %"
                  is a string that no report can sum.
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
                  width="short"
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
                  width="short"
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
              </FormGrid>

              <div className="flex flex-wrap items-center justify-end gap-2">
                <ReqTag id="FA-008" />
                <ReqTag id="FA-009" />
                <ReqTag id="FA-010" />
              </div>

              {/*
                The two flags are switches, not fields, so they stay out of the
                form row — a `switch` in a column of boxes reads as a third kind
                of input.
              */}
              <div className="flex flex-wrap gap-x-8 gap-y-4">
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
            <p className="mb-4 max-w-4xl text-table">{t.terms.intro}</p>
            <FormGrid>
              <TextField
                id="terms-signed"
                label={t.terms.ownSignedDate}
                type="date"
                defaultValue="2025-07-15"
                numeric
                width="short"
              />
              {/*
                Two dates, not one string. "2025-08-01 – 2027-07-31" typed into
                a free-text box cannot be validated, compared or sorted, and
                lets a user type anything at all — which is what happened. Same
                rule as everywhere else: one fact per field.
              */}
              <TextField
                id="terms-valid-from"
                label={t.terms.ownValidFrom}
                type="date"
                defaultValue="2025-08-01"
                numeric
                width="short"
              />
              <TextField
                id="terms-valid-to"
                label={t.terms.ownValidTo}
                type="date"
                defaultValue="2027-07-31"
                numeric
                width="short"
              />
            </FormGrid>
            <Rationale>{t.terms.note}</Rationale>
          </Panel>

          <Panel title={t.link.title} tags={["FF-002", "FD-001"]}>
            <FormGrid>
              {/*
                FF-002 links the protocol to a negotiation that already exists,
                so this is a choice from a register rather than free text.
              */}
              <Select
                id="link-negotiation"
                label={t.link.negotiation}
                width="full"
                options={[
                  { id: "fo-218", label: "FÖ-2025/218 – Kommunikation, 2025-07-15" },
                  { id: "fo-204", label: "FÖ-2025/204 – Stål- och metallindustrin, 2025-06-02" },
                ]}
              />
              {/*
                Derived, not a constant. FD-001 links the document to whatever
                the registration produced, and that varies: a protocol that
                establishes only general terms creates no wage agreement, and a
                registration with no negotiation chosen links to none. It was a
                fixed string reading "Avtal + löneavtal + förhandling" whatever
                had happened, which is the kind of detail an evaluator checks.
              */}
              <Field
                label={t.link.documentLinkedTo}
                width="full"
                value={[t.link.linkedAgreement, t.link.linkedWage, t.link.linkedNegotiation].join(
                  " + ",
                )}
                hint={t.link.documentLinkedToHint}
              />
            </FormGrid>
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
