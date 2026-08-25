"use client";

import { useState } from "react";

import { nextDraftId } from "@/lib/domain/draft";
import { readDrafts, writeDrafts } from "@/lib/session-store";

import { SECTOR_LABEL, type ReportSelection } from "@/lib/domain/agreement";
import type { Lang } from "@/lib/domain/lang";
import { RegistrationChecklist } from "./RegistrationChecklist";
import { dictionary } from "@/lib/i18n";
import { IconCheck, IconForward } from "./icons";
import {
  Button,
  Callout,
  FormGrid,
  LinkButton,
  Panel,
  Rationale,
  ReqTags,
  TextField,
} from "./primitives";
import { Select } from "./Select";
import { Toggle } from "./Toggle";

/**
 * Registering a wholly new collective agreement — US-02, and Bilaga 2 §3.5's
 * Scenario 2 first bullet: *"Registrerar ett nytt kollektivavtal."*
 *
 * **This is the one registration the AI is not allowed to do**, and that is why
 * it needed a screen of its own rather than a branch inside `/registrera`.
 * §4.1's own boundary, in MI's own words: *"Helt nya avtal – som inte tidigare
 * tecknats – ska alltid registreras manuellt."* `/registrera` reads an incoming
 * protocol and proposes values against an agreement MIIS already holds; there is
 * nothing to match a first-time agreement against, so there is nothing for the
 * AI to propose and no source passage to link a proposal to.
 *
 * The form is what §3.1 of Bilaga 3 calls Basfakta, reduced to what has to be
 * true before an agreement can exist at all: the parties, what it is called,
 * what kind of agreement it is, and the period. Everything else — scope figures,
 * wage agreements, working groups — is registered onto it afterwards, which is
 * what the agreement view is for.
 *
 * Saving leaves it **incomplete and unpublished** on purpose. A new agreement
 * with no wage agreement under it is not a finished record, and the screen says
 * what is still missing rather than pretending the task ended here.
 */

const INITIAL: ReportSelection = {
  eurofound: false,
  minimumWage: false,
  website: true,
  shortTermWageReport: true,
};

export function NewAgreement({
  lang,
  employerOrgs,
  employeeOrgs,
  agreementTypes,
  areas,
}: {
  lang: Lang;
  employerOrgs: string[];
  employeeOrgs: string[];
  agreementTypes: string[];
  /** Existing areas, offered as a list — a new one can still be typed. */
  areas: string[];
}) {
  const d = dictionary(lang);
  const t = d.avtal.newAgreement;

  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [employerOrg, setEmployerOrg] = useState("");
  const [employeeOrg, setEmployeeOrg] = useState("");
  const [agreementType, setAgreementType] = useState(agreementTypes[0] ?? "");
  const [sector, setSector] = useState("private");
  const [signedDate, setSignedDate] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  const [confidential, setConfidential] = useState(false);
  const [reports, setReports] = useState<ReportSelection>(INITIAL);
  const [saved, setSaved] = useState<string | null>(null);
  /* The id the register will hold it under — what makes the act openable. */
  const [savedId, setSavedId] = useState<string | null>(null);

  const complete = name.trim() && area.trim() && employerOrg && employeeOrg;

  function reset() {
    setName("");
    setArea("");
    setEmployerOrg("");
    setEmployeeOrg("");
    setSignedDate("");
    setValidFrom("");
    setValidTo("");
    setConfidential(false);
    setReports(INITIAL);
    setSaved(null);
    setSavedId(null);
    window.scrollTo({ top: 0 });
  }

  /*
    A record created a moment ago: no bargaining round under it and no document
    attached, by definition. What it may already carry is what the form above
    collects — a signing date and an end date.
  */
  const savedRecord = {
    wageAgreementCount: 0,
    protocolCount: 0,
    ...(signedDate ? { signedDate } : {}),
    ...(validTo ? { validTo } : {}),
  };

  if (saved) {
    return (
      <Panel title={t.savedHeading} tags={["FA-001", "FA-005"]}>
        <Callout tone="ok" live tags={["FA-001", "FH-001"]}>
          {t.savedNote(saved)}
        </Callout>
        {/* What is still missing. A new agreement with no wage agreement under
            it is not a finished record, and saying so is the difference between
            a form and a workflow.

            The same derivation the agreement's own page renders, so this list
            is the one that will tick off as the work is done rather than a
            second copy that stays frozen at five outstanding items. Everything
            is outstanding here because the record was created a second ago —
            except a löptid or a teckningsdatum entered on the form above, which
            is exactly the difference a fixed list could not show. */}
        <div className="mt-4 max-w-4xl">
          <p className="text-table">{t.nextSteps}</p>
          <div className="mt-3">
            <RegistrationChecklist
              record={savedRecord}
              lang={lang}
              {...(savedId ? { base: `/avtal/${savedId}` } : {})}
            />
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {/*
            The act ends on what it produced. It offered *Till avtalsregistret*
            — a list of seventeen the officer then had to search for the record
            they had spent a form filling in, and which was not in it. The
            register is still offered, second, because an officer registering
            three agreements in a row wants it.
          */}
          {savedId && (
            <LinkButton href={`/avtal/${savedId}`} iconEnd={<IconForward />}>
              {t.toAgreement}
            </LinkButton>
          )}
          <LinkButton href="/avtal" variant="secondary" iconEnd={<IconForward />}>
            {t.toRegister}
          </LinkButton>
          <Button variant="secondary" onClick={reset}>
            {t.another}
          </Button>
          <ReqTags ids={["FA-001", "FA-021"]} />
        </div>
      </Panel>
    );
  }

  return (
    <>
      <Panel title={t.heading} tags={["FA-001", "FA-005", "FAI-002"]}>
        {/* The legend, once, above the fields it governs. */}
        <p className="mb-4 text-label text-muted-foreground">{d.common.requiredLegend}</p>
        {/* §4.1's own boundary, on the screen it governs. */}
        <Callout tone="attention" label={t.manualLabel} tags={["FAI-002"]}>
          {t.manualNote}
        </Callout>

        <div className="mt-5 @container/form">
          <FormGrid>
            <TextField
              id="na-name"
              required
              lang={lang}
              label={t.name}
              width="medium"
              value={name}
              onChange={setName}
              placeholder={t.namePlaceholder}
            />
            <TextField
              id="na-area"
              required
              lang={lang}
              label={t.area}
              width="medium"
              value={area}
              onChange={setArea}
              hint={t.areaHint(areas.slice(0, 3).join(", "))}
            />
            <Select
              id="na-ago"
              required
              lang={lang}
              width="medium"
              label={t.employerOrg}
              value={employerOrg}
              onChange={setEmployerOrg}
              options={[
                { id: "", label: d.common.choose },
                ...employerOrgs.map((p) => ({ id: p, label: p })),
              ]}
            />
            <Select
              id="na-ato"
              required
              lang={lang}
              width="medium"
              label={t.employeeOrg}
              value={employeeOrg}
              onChange={setEmployeeOrg}
              options={[
                { id: "", label: d.common.choose },
                ...employeeOrgs.map((p) => ({ id: p, label: p })),
              ]}
            />
            <Select
              id="na-type"
              width="medium"
              label={t.type}
              value={agreementType}
              onChange={setAgreementType}
              options={agreementTypes.map((x) => ({ id: x, label: x }))}
            />
            <Select
              id="na-sector"
              width="medium"
              label={t.sector}
              value={sector}
              onChange={setSector}
              options={(["private", "state", "municipal"] as const).map((s) => ({
                id: s,
                label: SECTOR_LABEL[lang][s],
              }))}
            />
            <TextField
              id="na-signed"
              label={t.signedDate}
              type="date"
              width="short"
              numeric
              value={signedDate}
              onChange={setSignedDate}
            />
            <TextField
              id="na-from"
              label={t.validFrom}
              type="date"
              width="short"
              numeric
              value={validFrom}
              onChange={setValidFrom}
            />
            <TextField
              id="na-to"
              label={t.validTo}
              type="date"
              width="short"
              numeric
              value={validTo}
              onChange={setValidTo}
            />
          </FormGrid>
        </div>
      </Panel>

      <div className="mt-5">
        <Panel title={t.publishing} tags={["D-001", "FR-009", "FR-010"]}>
          <p className="mb-4 max-w-4xl text-table">{t.publishingIntro}</p>
          <div className="space-y-3">
            <Toggle
              id="na-secret"
              lang={lang}
              label={t.confidential}
              checked={confidential}
              onChange={setConfidential}
            >
              <p className="text-label text-muted-foreground">{t.confidentialHint}</p>
            </Toggle>
            <Toggle
              lang={lang}
              id="na-website"
              label={t.reportWebsite}
              checked={reports.website}
              onChange={(v: boolean) => setReports((r) => ({ ...r, website: v }))}
            />
            <Toggle
              lang={lang}
              id="na-konjunktur"
              label={t.reportShortTermWage}
              checked={reports.shortTermWageReport}
              onChange={(v: boolean) => setReports((r) => ({ ...r, shortTermWageReport: v }))}
            />
            <Toggle
              lang={lang}
              id="na-minwage"
              label={t.reportMinimumWage}
              checked={reports.minimumWage}
              onChange={(v: boolean) => setReports((r) => ({ ...r, minimumWage: v }))}
            />
            <Toggle
              lang={lang}
              id="na-eurofound"
              label={t.reportEurofound}
              checked={reports.eurofound}
              onChange={(v: boolean) => setReports((r) => ({ ...r, eurofound: v }))}
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button
              iconStart={<IconCheck />}
              disabled={!complete}
              disabledReason={t.requiredReason}
              onClick={() => {
                /*
                  Bilaga 2 §3.5, bullet six. This used to set a confirmation and
                  nothing else: the agreement was announced, the officer was
                  offered the register, and the register did not contain it.
                  The draft goes to the session cookie `lib/data/agreements.ts`
                  merges, so every screen downstream — the register, the detail
                  view, the reports, the counts — holds it.
                */
                const existing = readDrafts();
                const id = nextDraftId(existing);
                writeDrafts([
                  ...existing,
                  {
                    id,
                    name: name.trim(),
                    agreementArea: area.trim(),
                    employerOrg,
                    employeeOrg,
                    agreementType,
                    ...(signedDate ? { signedDate } : {}),
                    ...(validFrom ? { validFrom } : {}),
                    ...(validTo ? { validTo } : {}),
                    confidential,
                  },
                ]);
                setSavedId(id);
                setSaved(name.trim());
              }}
            >
              {t.save}
            </Button>
            <LinkButton href="/avtal" variant="ghost">
              {d.common.close}
            </LinkButton>
            <ReqTags ids={["FA-001", "FH-001"]} />
          </div>
          <Rationale>{t.incompleteNote}</Rationale>
        </Panel>
      </div>
    </>
  );
}
