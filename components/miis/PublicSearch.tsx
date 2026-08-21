"use client";

import { useState } from "react";

import type { Lang } from "@/lib/domain/lang";
import { hasCriteria, publicSearch, type PublicSearchable } from "@/lib/domain/public-search";
import { dictionary } from "@/lib/i18n";
import { DataTable, type Column, type Row } from "./DataTable";
import { PrintButton } from "./Print";
import { Button, FilterChips, FormGrid, Panel, Rationale, ReqTags, TextField } from "./primitives";
import { Select } from "./Select";

/**
 * The public computer's way of finding an agreement — FR-001, FR-003, FR-011,
 * US-14.
 *
 * **The selection did not select.** Three dropdowns with no state behind them,
 * two buttons disabled with "Ej aktiv i demon", and a table that showed every
 * agreement whatever was chosen. On the one role the scored criterion names,
 * the primary control was a picture of a control — the same failure as the two
 * registers, on the screen it mattered most.
 *
 * **Free text leads, and the three criteria are the precise path.** A visitor's
 * question is nearly always a word — an area, a union, an employer — and
 * Bilaga 3 §4.1 records that MI's current public interface offers free-text
 * search next to the report. The three dropdowns underneath are MI's own
 * criteria for *Avtal – Allmänheten* (Bilaga F, Rapport 1) and stay for the
 * visitor who knows exactly which agreement they want.
 *
 * **The internal query builder is deliberately not here.** W3D3 offers it to the
 * public because W3D3 is a generic diary product and the public interface was
 * *configured* rather than designed; Avropsförfrågan §18.3 says the old system
 * is not the starting point for the new one. FR-002's builder is field ×
 * operator × value with AND/OR, nested groups, chosen presentation columns and
 * saved searches — an expert instrument, handed to someone with no training and
 * one attempt. What it would answer, free text and three criteria answer in one
 * step. It is a decision rather than an omission, and if MI wants it here it is
 * the same component with `maySeeConfidential` already deciding the rest.
 *
 * **Confidentiality is not a filter.** A marked agreement is still found, still
 * listed and still counted (D-002). What is withheld is its detail, and the row
 * says so — filtering it out would tell the visitor it does not exist.
 */
export function PublicSearch({
  agreements,
  employerOrgs,
  employeeOrgs,
  industryCodes,
  lang,
  columns,
  rowFor,
}: {
  agreements: PublicSearchable[];
  employerOrgs: { id: string; name: string }[];
  employeeOrgs: { id: string; name: string }[];
  /**
   * Bransch — the parameter Bilaga 2 §3.5 names **first** for this role.
   *
   * A visitor thinks in industries before they think in employer
   * organisations, so a selection screen offering only AGO/ATO/avtal was
   * precise and unusable to anyone who did not already know the answer.
   */
  industryCodes: string[];
  lang: Lang;
  columns: Column[];
  /**
   * The rendered row for an agreement id.
   *
   * The cells stay on the server — they carry the status marker, the
   * confidentiality marker and the masked validity, and those are the things
   * that must not be re-decided in the browser. The client narrows which rows
   * are shown and nothing else.
   */
  rowFor: Record<string, Row>;
}) {
  const d = dictionary(lang);
  const t = d.allmanheten;

  const [text, setText] = useState("");
  const [employerOrgId, setEmployerOrgId] = useState("");
  const [employeeOrgId, setEmployeeOrgId] = useState("");
  const [agreementId, setAgreementId] = useState("");
  const [industryCode, setIndustryCode] = useState("");
  const [validAt, setValidAt] = useState("");

  const criteria = { text, employerOrgId, employeeOrgId, agreementId, industryCode, validAt };
  const found = publicSearch(agreements, criteria);
  const narrowed = hasCriteria(criteria);

  const name = (list: { id: string; name: string }[], id: string) =>
    list.find((x) => x.id === id)?.name ?? id;

  const active: { key: string; label: string; clear: () => void }[] = [];
  if (text.trim()) {
    active.push({ key: "text", label: `${t.selection.text}: ${text.trim()}`, clear: () => setText("") });
  }
  if (employerOrgId) {
    active.push({
      key: "ago",
      label: `${t.selection.employerOrg}: ${name(employerOrgs, employerOrgId)}`,
      clear: () => setEmployerOrgId(""),
    });
  }
  if (employeeOrgId) {
    active.push({
      key: "ato",
      label: `${t.selection.employeeOrg}: ${name(employeeOrgs, employeeOrgId)}`,
      clear: () => setEmployeeOrgId(""),
    });
  }
  if (agreementId) {
    active.push({
      key: "avtal",
      label: `${t.selection.agreement}: ${
        agreements.find((a) => a.id === agreementId)?.name ?? agreementId
      }`,
      clear: () => setAgreementId(""),
    });
  }
  if (industryCode) {
    active.push({
      key: "bransch",
      label: `${t.selection.industryCode}: ${industryCode}`,
      clear: () => setIndustryCode(""),
    });
  }
  if (validAt) {
    active.push({
      key: "datum",
      label: `${t.selection.period}: ${validAt}`,
      clear: () => setValidAt(""),
    });
  }

  function reset() {
    setText("");
    setEmployerOrgId("");
    setEmployeeOrgId("");
    setAgreementId("");
    setIndustryCode("");
    setValidAt("");
  }

  return (
    <>
      <Panel title={t.selection.title} tags={["FR-001", "FR-003", "FR-011"]}>
        <p className="mb-4 max-w-3xl text-table">{t.selection.lead}</p>

        {/*
          One field, first, and wide. Everything below it is a narrowing of what
          this returns — which is the order a visitor's question arrives in.
        */}
        <FormGrid>
          <TextField
            id="pub-text"
            label={t.selection.text}
            width="full"
            value={text}
            onChange={setText}
            placeholder={t.selection.textPlaceholder}
            hint={t.selection.textHint}
          />
        </FormGrid>

        <div className="mt-5">
          <h3 className="mi-kicker mb-2 text-muted-foreground">{t.selection.narrow}</h3>
          <FormGrid>
            {/* First, because MI names it first for this role. */}
            <Select
              id="pub-bransch"
              width="medium"
              label={t.selection.industryCode}
              value={industryCode}
              onChange={setIndustryCode}
              options={[
                { id: "", label: t.selection.all },
                ...industryCodes.map((c) => ({ id: c, label: c })),
              ]}
            />
            <Select
              id="pub-ago"
              width="medium"
              label={t.selection.employerOrg}
              value={employerOrgId}
              onChange={setEmployerOrgId}
              options={[
                { id: "", label: t.selection.all },
                ...employerOrgs.map((p) => ({ id: p.id, label: p.name })),
              ]}
            />
            <Select
              id="pub-ato"
              width="medium"
              label={t.selection.employeeOrg}
              value={employeeOrgId}
              onChange={setEmployeeOrgId}
              options={[
                { id: "", label: t.selection.all },
                ...employeeOrgs.map((p) => ({ id: p.id, label: p.name })),
              ]}
            />
            <Select
              id="pub-avtal"
              width="medium"
              label={t.selection.agreement}
              value={agreementId}
              onChange={setAgreementId}
              options={[
                { id: "", label: t.selection.all },
                ...agreements.map((a) => ({ id: a.id, label: a.name })),
              ]}
            />
            {/* FA-020 — "visa avtalet som det gällde vid ett angivet datum". */}
            <TextField
              id="pub-datum"
              label={t.selection.period}
              type="date"
              width="short"
              numeric
              value={validAt}
              onChange={setValidAt}
            />
          </FormGrid>
        </div>

        <FilterChips active={active} lang={lang} onClearAll={reset} />
        <Rationale>{t.selection.builderNote}</Rationale>
      </Panel>

      <div className="mt-5">
        <Panel
          title={`${t.result.title} · ${d.common.agreementCount(found.length)}`}
          tags={["FR-012", "D-002"]}
        >
          {/*
            The result says which population it is, every time. A visitor who
            was handed a printout has to be able to tell "every agreement MI
            holds" from "the four that matched Apotek", and a count alone does
            not say which of the two it is.
          */}
          <p className="mb-4 max-w-3xl text-table text-muted-foreground">
            {narrowed ? t.result.narrowed : t.result.all}
          </p>

          <DataTable
            columns={columns}
            rows={found.map((a) => rowFor[a.id]!).filter(Boolean)}
            lang={lang}
            caption={t.result.title}
            empty={t.result.empty}
          />

          {found.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
              <PrintButton lang={lang} variant="primary" />
              <span className="text-label text-muted-foreground">{t.result.downloadNote}</span>
              <ReqTags ids={["FR-011", "NFÅ-004"]} />
            </div>
          )}

          {found.length === 0 && narrowed && (
            <div className="mt-4">
              <Button variant="secondary" onClick={reset}>
                {t.selection.reset}
              </Button>
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}
