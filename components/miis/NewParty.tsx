"use client";

import { useState } from "react";

import { SECTOR_LABEL, type Sector } from "@/lib/domain/agreement";
import type { Lang } from "@/lib/domain/lang";
import { PARTY_TYPE_LABEL, type Party, type PartyType } from "@/lib/domain/party";
import { dictionary } from "@/lib/i18n";
import { IconForward, IconPlus } from "./icons";
import {
  Badge,
  Button,
  Callout,
  Chip,
  FieldLabel,
  FormGrid,
  LinkButton,
  Panel,
  Rationale,
  ReqTag,
  ReqTags,
} from "./primitives";
import { Select } from "./Select";

/** The date a new registration starts from, and the value "register another" returns to. */
const INITIAL_VALID_FROM = "2027-07-01";

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
  const [validFrom, setValidFrom] = useState(INITIAL_VALID_FROM);
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

  /*
    "Registrera en part till" has to give back an empty form.

    It only cleared the confirmation, so the officer was returned to a screen
    still holding the party they had just registered — same name in the box,
    same predecessors ticked — and the next Spara would have looked like a
    duplicate. Everything the form holds goes back to its initial value, the
    page returns to the top, and focus lands on the first control, because a
    reset the user has to scroll up to find is a reset they will miss.
  */
  function registerAnother() {
    setSaved(null);
    setType("employee");
    setName("");
    setValidFrom(INITIAL_VALID_FROM);
    setSector("");
    setGroup("");
    setIndustryCode("");
    setPredecessors([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById("np-type")?.focus();
  }

  return (
    <>
      <Panel title={t.identity} tags={["FP-001", "FP-002"]}>
        {/*
          One form row for the whole panel.

          It was three grids — a two-column one for type and name, a two-column
          one holding a single date, and a three-column one for the employer
          properties. Three grids is three column widths, so the gap between
          "Typ av part" and "Namn på parten" was nothing like the gap between
          "Sektor" and "Arbetsgivargrupp", and no box lined up with the box two
          rows below it. `FormGrid` fits field-width columns to the panel once,
          and everything sits on them.
        */}
        <FormGrid>
          <Select
            id="np-type"
            width="medium"
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
          {/*
            `FieldLabel`, not a hand-rolled label. Its row reserves 28px so a
            select and a text field line up; a `mb-1 block` label is 20px, which
            is why the name sat above the type beside it.
          */}
          <div data-span="2">
            <FieldLabel htmlFor="np-name">{t.name}</FieldLabel>
            <input
              id="np-name"
              type="text"
              value={name}
              placeholder={t.namePlaceholder}
              onChange={(e) => setName(e.target.value)}
              className="field-input max-w-[26rem]"
            />
          </div>

          {/*
            FP-004 works because a name is always dated. Registering one without
            a validity date would create a party whose first name could never be
            superseded correctly.
          */}
          <div>
            <FieldLabel htmlFor="np-from">{t.validFrom}</FieldLabel>
            <input
              id="np-from"
              type="date"
              value={validFrom}
              onChange={(e) => setValidFrom(e.target.value)}
              className="field-input max-w-[12rem] tabular-nums"
            />
            <p className="mt-1 text-label text-muted-foreground">{t.validFromHint}</p>
          </div>
        </FormGrid>
        {/*
          Why the date is asked for at all, rather than what to type into it.
          It was the field's hint, at which length it broke to five lines under
          a 190px box and pushed the row below it down; it is an argument about
          FP-004 rather than an instruction, which is what `Rationale` is for.
        */}
        <Rationale>{t.validFromNote}</Rationale>

        {/* FP-001 scopes these to employer organisations. */}
        {type === "employer" && (
          <FormGrid className="mt-4 border-t border-border pt-4">
            <Select
              id="np-sector"
              width="medium"
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
              width="medium"
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
              <div data-span="2">
                <FieldLabel htmlFor="np-code">{t.industryCode}</FieldLabel>
                <input
                  id="np-code"
                  type="text"
                  value={industryCode}
                  placeholder={t.industryCodePlaceholder}
                  onChange={(e) => setIndustryCode(e.target.value)}
                  className="field-input max-w-[26rem]"
                />
              </div>
            )}
          </FormGrid>
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
            <>
              <Callout tone="ok" live tags={["FP-002", "FH-001"]}>
                {t.savedNote(saved, predecessors.length)}
              </Callout>
              {/*
                A confirmation is not an ending. The officer registered a party
                in order to use it — so the way on is to the register that now
                holds it, and the way to repeat the task is beside it.
              */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <LinkButton href="/parter" iconEnd={<IconForward />}>
                  {t.openRegister}
                </LinkButton>
                <Button variant="secondary" onClick={registerAnother} iconStart={<IconPlus />}>
                  {t.registerAnother}
                </Button>
              </div>
            </>
          ) : (
            <>
              {/*
                What will be saved, above the control that saves it. The type
                badge and the note used to sit *beside* the button, which read
                as a second and third action and left the row unbalanced.
              */}
              <dl className="mb-4 flex flex-wrap items-center gap-x-8 gap-y-2 text-table">
                <div className="flex items-center gap-2">
                  <dt className="text-label font-bold">{t.type}</dt>
                  <dd>
                    <Badge tone="neutral">{PARTY_TYPE_LABEL[lang][type]}</Badge>
                  </dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt className="text-label font-bold">{t.name}</dt>
                  <dd className={name.trim() ? "" : "text-muted-foreground"}>
                    {name.trim() || d.common.none}
                  </dd>
                </div>
              </dl>
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={save} disabled={name.trim().length === 0}>
                  {t.saveAction}
                </Button>
                <ReqTags ids={["FP-001", "FH-001"]} />
              </div>
              <p className="mt-2 text-label text-muted-foreground">{t.saveHint}</p>
            </>
          )}
          <Rationale>{t.logNote}</Rationale>
          <ReqTag id="FP-006" />
          <p className="mt-2 text-label text-muted-foreground">{t.contactsLater}</p>
        </Panel>
      </div>
    </>
  );
}
