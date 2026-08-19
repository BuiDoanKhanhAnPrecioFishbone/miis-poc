"use client";

import { useState } from "react";

import { SECTOR_LABEL, type Sector } from "@/lib/domain/agreement";
import type { Lang } from "@/lib/domain/lang";
import { PARTY_TYPE_LABEL, type Party, type PartyType } from "@/lib/domain/party";
import { dictionary } from "@/lib/i18n";
import { Badge, Button, Callout, Chip, Panel, Rationale, ReqTag, ReqTags } from "./primitives";
import { Select } from "./Select";

/**
 * Registering a party — FP-001, FP-002, FP-006, and US-03's merger.
 *
 * Three things shape this form, and none of them is a layout preference.
 *
 * **Type decides what follows.** FP-001 puts sector, employer group and industry
 * code on employer organisations, and the industry code only on those inside
 * Svenskt Näringsliv. So those fields appear when the type says employer and are
 * absent otherwise — not greyed out, absent. A disabled field still says "this
 * belongs here"; an ATO has no sector at all.
 *
 * **The name is dated from the start.** A party's name in this model is always
 * an entry in the history with a validity date, because that is what makes
 * FP-004 work later. Registering one without a date would create a party whose
 * first name could never be superseded correctly.
 *
 * **A merger is a new party pointing at its predecessors.** The information
 * model §4.2: *"Mergers (Sveriges Lärare, Fremia) are handled as new parties
 * with relationships to their predecessors … preserving statistical
 * continuity."* So the predecessor picker is part of registering a party, not a
 * separate screen — US-03 is a merger scenario, and this is where it happens.
 */
export function NewParty({ lang, register }: { lang: Lang; register: Party[] }) {
  const d = dictionary(lang);
  const t = d.parter.newParty;

  const [type, setType] = useState<PartyType>("employee");
  const [name, setName] = useState("");
  const [validFrom, setValidFrom] = useState("2027-07-01");
  const [sector, setSector] = useState<Sector | "">("");
  const [group, setGroup] = useState("");
  const [industryCode, setIndustryCode] = useState("");
  const [predecessors, setPredecessors] = useState<string[]>([]);
  const [saved, setSaved] = useState<string | null>(null);

  /* Only a party of the same side can be a predecessor: an AGO does not merge
     into an ATO, and offering it would invite a record that means nothing. */
  const candidates = register.filter((p) => p.type === type);

  function save() {
    const value = name.trim();
    if (!value) return;
    setSaved(value);
  }

  return (
    <>
      <Panel title={t.identity} tags={["FP-001", "FP-002"]}>
        <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2">
          <Select
            id="np-type"
            label={t.type}
            value={type}
            onChange={(v) => {
              setType(v as PartyType);
              setPredecessors([]);
              if (v === "employee") {
                setSector("");
                setGroup("");
                setIndustryCode("");
              }
            }}
            hint={t.typeHint}
            options={[
              { id: "employee", label: PARTY_TYPE_LABEL[lang].employee },
              { id: "employer", label: PARTY_TYPE_LABEL[lang].employer },
            ]}
          />
          <div>
            <label htmlFor="np-name" className="mb-1 block text-label font-bold">
              {t.name}
            </label>
            <input
              id="np-name"
              type="text"
              value={name}
              placeholder={t.namePlaceholder}
              onChange={(e) => setName(e.target.value)}
              className="field-input"
            />
          </div>
        </div>

        {/*
          FP-004 works because a name is always dated. Registering one without a
          validity date would create a party whose first name could never be
          superseded correctly.
        */}
        <div className="mt-4 grid grid-cols-1 gap-4 @xl:grid-cols-2">
          <div>
            <label htmlFor="np-from" className="mb-1 block text-label font-bold">
              {t.validFrom}
            </label>
            <input
              id="np-from"
              type="date"
              value={validFrom}
              onChange={(e) => setValidFrom(e.target.value)}
              className="field-input tabular-nums"
            />
            <p className="mt-1 text-label text-muted-foreground">{t.validFromHint}</p>
          </div>
        </div>

        {/* FP-001 scopes these to employer organisations. */}
        {type === "employer" && (
          <div className="mt-4 grid grid-cols-1 gap-4 border-t border-border pt-4 @xl:grid-cols-3">
            <Select
              id="np-sector"
              label={t.sector}
              value={sector}
              onChange={(v) => setSector(v as Sector | "")}
              options={[
                { id: "", label: t.choose },
                { id: "private", label: SECTOR_LABEL[lang].private },
                { id: "state", label: SECTOR_LABEL[lang].state },
                { id: "municipal", label: SECTOR_LABEL[lang].municipal },
              ]}
            />
            <Select
              id="np-group"
              label={t.group}
              value={group}
              onChange={setGroup}
              options={[
                { id: "", label: t.choose },
                { id: "Svenskt Näringsliv", label: "Svenskt Näringsliv" },
                {
                  id: "Fristående arbetsgivarorganisationer",
                  label: "Fristående arbetsgivarorganisationer",
                },
                {
                  id: "Kommunala företagens arbetsgivarorganisation",
                  label: "Kommunala företagens arbetsgivarorganisation",
                },
              ]}
            />
            {/* The industry code exists only inside Svenskt Näringsliv (FP-001). */}
            {group === "Svenskt Näringsliv" && (
              <div>
                <label htmlFor="np-code" className="mb-1 block text-label font-bold">
                  {t.industryCode}
                </label>
                <input
                  id="np-code"
                  type="text"
                  value={industryCode}
                  placeholder={t.industryCodePlaceholder}
                  onChange={(e) => setIndustryCode(e.target.value)}
                  className="field-input"
                />
              </div>
            )}
          </div>
        )}
        <Rationale>{t.scopeNote}</Rationale>
      </Panel>

      <div className="mt-5">
        <Panel title={t.merger} tags={["FP-002"]}>
          <p className="mb-3 max-w-4xl text-table">{t.mergerIntro}</p>
          <fieldset>
            <legend className="mb-2 text-label font-bold">{t.predecessors}</legend>
            <div className="flex flex-wrap gap-2">
              {candidates.map((p) => (
                <Chip
                  key={p.id}
                  pressed={predecessors.includes(p.id)}
                  onToggle={() =>
                    setPredecessors((list) =>
                      list.includes(p.id) ? list.filter((x) => x !== p.id) : [...list, p.id],
                    )
                  }
                >
                  {p.name}
                </Chip>
              ))}
            </div>
            <p aria-live="polite" className="mt-2 text-label text-muted-foreground">
              {predecessors.length === 0 ? t.noPredecessors : t.predecessorCount(predecessors.length)}
            </p>
          </fieldset>
          <Rationale>{t.mergerNote}</Rationale>
        </Panel>
      </div>

      <div className="mt-5">
        <Panel title={t.save} tags={["FP-001", "FH-001"]}>
          {saved ? (
            <Callout tone="ok" live tags={["FP-002", "FH-001"]}>
              {t.savedNote(saved, predecessors.length)}
            </Callout>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={save} disabled={name.trim().length === 0}>
                {t.saveAction}
              </Button>
              <Badge tone="neutral">{PARTY_TYPE_LABEL[lang][type]}</Badge>
              <span className="text-label text-muted-foreground">{t.saveHint}</span>
              <ReqTags ids={["FP-001", "FH-001"]} />
            </div>
          )}
          <Rationale>{t.logNote}</Rationale>
          <ReqTag id="FP-006" />
          <p className="mt-2 text-label text-muted-foreground">{t.contactsLater}</p>
        </Panel>
      </div>
    </>
  );
}
