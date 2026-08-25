"use client";

import { useState } from "react";

import { SECTOR_LABEL, type Sector } from "@/lib/domain/agreement";
import type { Lang } from "@/lib/domain/lang";
import { PARTY_TYPE_LABEL, type PartyType } from "@/lib/domain/party";
import { dictionary } from "@/lib/i18n";
import { DataTable, matchesFacets, type Column, type Row } from "./DataTable";
import { FilterChips } from "./primitives";
import { Select } from "./Select";

/**
 * FP-005 — *"söka fram parter med vissa egenskaper"*.
 *
 * The properties are not invented: FP-001 says an employer organisation is
 * linked to sector, to employer group, and — inside Svenskt Näringsliv — to an
 * industry code, so those are what a party can be found by. Type is here
 * because AGO and ATO are the register's two halves and MI's own abbreviations.
 *
 * The chips below the controls are the criteria as a sentence, the same
 * treatment `/sok` uses, so a filter is visible and removable rather than
 * hidden inside a control the reader has to go and inspect.
 *
 * It owns the register's table for the same reason `AgreementFilters` does: a
 * filter that changes the chips and not the rows is a control that looks live
 * and is not. The rows come in already rendered from the server, each with the
 * plain values the criteria compare against.
 */
export function PartyFilters({
  lang,
  columns,
  rows,
  caption,
  minWidth,
}: {
  lang: Lang;
  columns: Column[];
  rows: Row[];
  caption: string;
  minWidth?: string;
}) {
  const d = dictionary(lang);
  const t = d.parter.filters;
  const [type, setType] = useState("");
  const [sector, setSector] = useState("");
  const [group, setGroup] = useState("");

  const active: { key: string; label: string; clear: () => void }[] = [];
  if (type) {
    active.push({
      key: "type",
      label: `${t.type}: ${PARTY_TYPE_LABEL[lang][type as PartyType]}`,
      clear: () => setType(""),
    });
  }
  if (sector) {
    active.push({
      key: "sector",
      label: `${t.sector}: ${SECTOR_LABEL[lang][sector as Sector]}`,
      clear: () => setSector(""),
    });
  }
  if (group) {
    active.push({ key: "group", label: `${t.group}: ${group}`, clear: () => setGroup("") });
  }

  const visible = rows.filter((row) => matchesFacets(row, { type, sector, group }));

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2 @3xl:grid-cols-3">
        <Select
          id="party-type"
          label={t.type}
          value={type}
          onChange={setType}
          options={[
            { id: "", label: t.all },
            { id: "employer", label: PARTY_TYPE_LABEL[lang].employer },
            { id: "employee", label: PARTY_TYPE_LABEL[lang].employee },
          ]}
        />
        <Select
          id="party-sector"
          label={t.sector}
          value={sector}
          onChange={setSector}
          hint={t.sectorHint}
          options={[
            { id: "", label: t.all },
            { id: "private", label: SECTOR_LABEL[lang].private },
            { id: "state", label: SECTOR_LABEL[lang].state },
            { id: "municipal", label: SECTOR_LABEL[lang].municipal },
          ]}
        />
        <Select
          id="party-group"
          label={t.group}
          value={group}
          onChange={setGroup}
          options={[
            { id: "", label: t.all },
            { id: "Svenskt Näringsliv", label: "Svenskt Näringsliv" },
            { id: "Fristående arbetsgivarorganisationer", label: "Fristående arbetsgivarorganisationer" },
            {
              id: "Kommunala företagens arbetsgivarorganisation",
              label: "Kommunala företagens arbetsgivarorganisation",
            },
          ]}
        />
      </div>

      <FilterChips
        active={active}
        lang={lang}
        onClearAll={() => {
          setType("");
          setSector("");
          setGroup("");
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
