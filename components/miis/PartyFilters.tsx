"use client";

import { useState } from "react";

import { SECTOR_LABEL, type Sector } from "@/lib/domain/agreement";
import type { Lang } from "@/lib/domain/lang";
import { PARTY_TYPE_LABEL, type PartyType } from "@/lib/domain/party";
import { dictionary } from "@/lib/i18n";
import { Button, Chip } from "./primitives";
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
 */
export function PartyFilters({ lang }: { lang: Lang }) {
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

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 @xl:grid-cols-3">
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

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span aria-live="polite" className="text-label text-muted-foreground">
          {active.length === 0 ? t.none : t.count(active.length)}
        </span>
        {active.map((f) => (
          <Chip key={f.key} onRemove={f.clear} removeLabel={t.remove(f.label)}>
            {f.label}
          </Chip>
        ))}
        {active.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => { setType(""); setSector(""); setGroup(""); }}>
            {t.clearAll}
          </Button>
        )}
      </div>
    </div>
  );
}
