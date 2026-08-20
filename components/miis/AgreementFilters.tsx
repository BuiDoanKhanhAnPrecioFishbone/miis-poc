"use client";

import { useState } from "react";

import { registrationStatusLabel, type RegistrationStatus } from "@/lib/domain/agreement";
import type { Lang } from "@/lib/domain/lang";
import { statusInfo, type StatusCode } from "@/lib/domain/status";
import { dictionary } from "@/lib/i18n";
import { DataTable, matchesFacets, type Column, type Row } from "./DataTable";
import { FilterChips } from "./primitives";
import { Select } from "./Select";

/**
 * FA-005 and FA-006 — finding an agreement by the properties it has.
 *
 * The three are not a guess at what might be useful. FA-001 makes the agreement
 * area the overarching unit, so that is the first thing anyone narrows by;
 * FA-021 makes registration status a state the officer works through, so
 * "show me what is still incomplete" is a real task rather than a filter; and
 * FR-012 is the agreement's own status, which is what the register is colour
 * coded by in the first place.
 *
 * The chips restate the criteria as a sentence, the same treatment `/sok` and
 * `/parter` use — a filter should be visible and removable, not hidden inside a
 * control the reader has to go and inspect.
 *
 * **It owns the table, and that is a fix rather than a structure preference.**
 * The controls used to sit above a `DataTable` the page rendered separately, so
 * choosing an agreement area changed the chips and left all seven rows exactly
 * where they were. A control that looks live and is not teaches an evaluator
 * that the whole prototype is a picture, which is the one thing this mockup
 * cannot afford. The rows still arrive already rendered from the server — each
 * carrying a small map of plain values to compare against — so the filtering
 * happens in the browser without moving a single cell off the server.
 */
export function AgreementFilters({
  lang,
  areas,
  columns,
  rows,
  caption,
  minWidth,
}: {
  lang: Lang;
  areas: string[];
  columns: Column[];
  rows: Row[];
  caption: string;
  minWidth?: string;
}) {
  const d = dictionary(lang);
  const t = d.avtal.filters;
  const [area, setArea] = useState("");
  const [registration, setRegistration] = useState("");
  const [status, setStatus] = useState("");

  const active: { key: string; label: string; clear: () => void }[] = [];
  if (area) active.push({ key: "area", label: `${t.area}: ${area}`, clear: () => setArea("") });
  if (registration) {
    active.push({
      key: "registration",
      label: `${t.registration}: ${registrationStatusLabel(registration as RegistrationStatus, lang)}`,
      clear: () => setRegistration(""),
    });
  }
  if (status) {
    active.push({
      key: "status",
      label: `${t.status}: ${statusInfo(status as StatusCode, lang).label}`,
      clear: () => setStatus(""),
    });
  }

  const visible = rows.filter((row) => matchesFacets(row, { area, registration, status }));

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2 @3xl:grid-cols-3">
        <Select
          id="agreement-area"
          label={t.area}
          value={area}
          onChange={setArea}
          options={[
            { id: "", label: t.all },
            ...areas.map((a) => ({ id: a, label: a })),
          ]}
        />
        <Select
          id="agreement-registration"
          label={t.registration}
          value={registration}
          onChange={setRegistration}
          options={[
            { id: "", label: t.all },
            { id: "complete", label: registrationStatusLabel("complete", lang) },
            { id: "incomplete", label: registrationStatusLabel("incomplete", lang) },
          ]}
        />
        <Select
          id="agreement-status"
          label={t.status}
          value={status}
          onChange={setStatus}
          options={[
            { id: "", label: t.all },
            { id: "newly-signed", label: statusInfo("newly-signed", lang).label },
            { id: "after-mediation", label: statusInfo("after-mediation", lang).label },
            { id: "remaining", label: statusInfo("remaining", lang).label },
          ]}
        />
      </div>

      <FilterChips
        active={active}
        lang={lang}
        onClearAll={() => {
          setArea("");
          setRegistration("");
          setStatus("");
        }}
      />

      <div className="mt-4">
        <DataTable
          columns={columns}
          rows={visible}
          lang={lang}
          caption={caption}
          minWidth={minWidth}
          empty={t.noMatch}
        />
      </div>
    </div>
  );
}
