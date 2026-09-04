"use client";

import { useState } from "react";

import {
  SECTOR_LABEL,
  type Sector,
} from "@/lib/domain/agreement";
import type { Lang } from "@/lib/domain/lang";
import { PARTY_TYPE_ABBREVIATION, type Party } from "@/lib/domain/party";
import { dictionary } from "@/lib/i18n";
import { EditablePanel } from "./EditablePanel";
import { Field, FormGrid, TextField } from "./primitives";
import { Select } from "./Select";

const TODAY = "2027-06-14";

/**
 * FP-001's registered attributes, correctable where they apply.
 *
 * The party register could be added to and renamed but not corrected: a
 * mis-registered sector or a wrong SNI code needed the supplier. FP-001 says
 * the system *holds* a register in which employer organisations are linked to a
 * sector and an employer group, and §3.1 gives the agreement administrator
 * write access to parter — a register whose registered attributes cannot be
 * corrected does not answer either.
 *
 * **Two things stay read-only and say why on their own row**, which is the same
 * rule the agreement record follows. The party's *type* is what it is: an AGO
 * that became an ATO would invalidate every agreement holding it as the party
 * on one side, and an organisation does not change which side of the table it
 * sits on. And for an employee organisation the sector, the employer group and
 * the industry code are not blank-because-nobody-typed-them — they are
 * registered on the employer side, which is what FP-001 says.
 *
 * Saving is local to the visit, exactly as the agreement's panels are: this
 * demonstrates the interaction and the change log entry it produces, not a
 * write to a database the prototype does not have.
 */
export function PartyIdentity({ party, lang }: { party: Party; lang: Lang }) {
  const d = dictionary(lang);
  const t = d.parter;
  const [editing, setEditing] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [sector, setSector] = useState<string>(party.sector ?? "");
  const [group, setGroup] = useState(party.employerGroup ?? "");
  const [industry, setIndustry] = useState(party.industryCode ?? "");

  /* An employee organisation carries none of the three: they are registered on
     the employer side, so there is nothing here to correct. */
  const employerSide = party.type !== "employee";

  const sectorOptions = [
    { id: "", label: d.common.none },
    ...(["private", "state", "municipal"] as Sector[]).map((s) => ({
      id: s,
      label: SECTOR_LABEL[lang][s],
    })),
  ];

  return (
    <EditablePanel
      title={t.detail.identity}
      tags={["FP-001", "FP-002"]}
      lang={lang}
      editing={editing}
      onEdit={() => setEditing(true)}
      onSave={() => {
        setSavedAt(TODAY);
        setEditing(false);
      }}
      onCancel={() => {
        setSector(party.sector ?? "");
        setGroup(party.employerGroup ?? "");
        setIndustry(party.industryCode ?? "");
        setEditing(false);
      }}
      {...(savedAt ? { savedAt } : {})}
      {...(employerSide ? {} : { canSave: false, saveBlockedReason: t.detail.employeeSideOnly })}
    >
      <div className="@container/form">
        <FormGrid>
          {/*
            Never editable, and the row says why rather than being greyed with
            no reason. Which side of the table an organisation sits on is not a
            correction — it is a different party.
          */}
          <Field
            label={t.table.type}
            value={PARTY_TYPE_ABBREVIATION[party.type]}
            hint={t.detail.typeFixed}
            width="short"
          />

          {editing && employerSide ? (
            <>
              <Select
                id="party-sector"
                label={t.table.sector}
                value={sector}
                onChange={setSector}
                options={sectorOptions}
                width="medium"
              />
              <TextField
                id="party-group"
                label={t.table.group}
                value={group}
                onChange={setGroup}
                width="medium"
              />
              <TextField
                id="party-industry"
                label={t.detail.industryCode}
                value={industry}
                onChange={setIndustry}
                hint={t.detail.industryCodeHint}
                width="medium"
              />
            </>
          ) : (
            <>
              <Field
                label={t.table.sector}
                value={sector ? SECTOR_LABEL[lang][sector as Sector] : d.common.none}
                {...(employerSide ? {} : { hint: t.detail.sectorEmployeeHint })}
                width="medium"
              />
              <Field
                label={t.table.group}
                value={group || d.common.none}
                {...(employerSide ? {} : { hint: t.detail.sectorEmployeeHint })}
                width="medium"
              />
              <Field
                label={t.detail.industryCode}
                value={industry || d.common.none}
                hint={employerSide ? t.detail.industryCodeHint : t.detail.sectorEmployeeHint}
                width="medium"
              />
            </>
          )}
        </FormGrid>
      </div>
    </EditablePanel>
  );
}
