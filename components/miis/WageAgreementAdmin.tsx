"use client";

import { useState } from "react";

import { AGREEMENT_CONSTRUCTIONS, type AgreementConstruction } from "@/lib/domain/agreement";
import type { Lang } from "@/lib/domain/lang";
import { decimal, percent } from "@/lib/format";
import { dictionary } from "@/lib/i18n";
import { DataTable, type Column, type Row } from "./DataTable";
import { Select } from "./Select";
import { IconCheck } from "./icons";
import { Badge, Button, Callout, FormGrid, Panel, Rationale, TextField } from "./primitives";

/** One bargaining round's wage agreement, as this screen edits it. */
export interface EditableWageAgreement {
  id: string;
  validFrom: string;
  validTo: string;
  construction: AgreementConstruction;
  wageScopePercent?: number;
  costFramePercent?: number;
  individualGuarantee: boolean;
  wageRevision?: { date: string; percent: number };
}

/**
 * FA-002's row per avtalsrörelse, editable — Bilaga 2 §3.5, Scenario 2,
 * bullet three: *"Hanterar versioner eller ändringar av avtalet."*
 *
 * The tab held two tables and not one control. An agreement in MI's model has
 * no version list — it has a row per bargaining round — so this table **is** the
 * versions, and a version history nobody can correct is a printout. §3.1 gives
 * Avtalsadministratör *"Läsa, skriva, redigera avtalsinformation"* and FA-001
 * spells it *"registrera **och redigera**"*; a löneavtal's construction and
 * löneutrymme are avtalsinformation, and they are the figures most likely to be
 * wrong, because they are read off a scanned protocol under time pressure.
 *
 * **What is editable is what the round decided**, and deliberately not the
 * period. The löptid comes from the agreement above it — changing it here would
 * let one round claim a validity the agreement does not have — so it is shown
 * on the row and stated as belonging elsewhere.
 *
 * Editing happens **above the table with the round named**, not in the cell: six
 * columns of figures do not leave room for three inputs, and a form headed by a
 * period tells the officer which of the rows they are changing.
 */
export function WageAgreementAdmin({
  rounds: initial,
  lang,
  hasRevision,
}: {
  rounds: EditableWageAgreement[];
  lang: Lang;
  /** Whether MI recorded a lönerevision for this agreement, per round id. */
  hasRevision?: Record<string, string>;
}) {
  const d = dictionary(lang);
  const t = d.avtal.detail;
  const w = t.wageEdit;

  const [rounds, setRounds] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const [construction, setConstruction] = useState("1");
  const [scope, setScope] = useState("");
  const [costFrame, setCostFrame] = useState("");
  const [guarantee, setGuarantee] = useState("no");

  const open = rounds.find((r) => r.id === editing);

  function edit(round: EditableWageAgreement) {
    setEditing(round.id);
    setConstruction(String(round.construction));
    /* The unit is in the label and the box holds a bare number, so the decimal
       separator is the language's own — 3,4 in Swedish. */
    setScope(round.wageScopePercent === undefined ? "" : decimal(round.wageScopePercent, lang));
    setCostFrame(
      round.costFramePercent === undefined ? "" : decimal(round.costFramePercent, lang),
    );
    setGuarantee(round.individualGuarantee ? "yes" : "no");
    setSaved(null);
  }

  /** Accepts both separators: an officer typing 3.4 into a Swedish form means 3,4. */
  const num = (raw: string): number | undefined => {
    const parsed = Number.parseFloat(raw.replace(",", "."));
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  function save(id: string) {
    const round = rounds.find((r) => r.id === id);
    if (!round) return;
    setRounds((list) =>
      list.map((r) =>
        r.id === id
          ? {
              ...r,
              construction: Number(construction) as AgreementConstruction,
              ...(num(scope) === undefined
                ? { wageScopePercent: undefined }
                : { wageScopePercent: num(scope) }),
              ...(num(costFrame) === undefined
                ? { costFramePercent: undefined }
                : { costFramePercent: num(costFrame) }),
              individualGuarantee: guarantee === "yes",
            }
          : r,
      ),
    );
    setSaved(w.savedNote(`${round.validFrom} – ${round.validTo}`));
    setEditing(null);
  }

  const columns: Column[] = [
    { key: "period", header: t.period, sortable: true },
    { key: "construction", header: t.construction },
    { key: "scope", header: t.scope, numeric: true, sortable: true },
    { key: "costFrame", header: t.costFrame, numeric: true, sortable: true },
    { key: "guarantee", header: t.guarantee },
    { key: "revision", header: t.revision },
    { key: "action", header: d.common.action },
  ];

  const rows: Row[] = rounds.map((r) => ({
    key: r.id,
    cells: [
      /* Each date whole, the break allowed only between them — the row exists
         to be compared with the one above it. */
      <span key="p" className="tabular-nums">
        <span className="whitespace-nowrap">{r.validFrom}</span> –{" "}
        <span className="whitespace-nowrap">{r.validTo}</span>
        {editing === r.id && (
          <Badge tone="attention">{w.editingNow}</Badge>
        )}
      </span>,
      `${r.construction}. ${AGREEMENT_CONSTRUCTIONS[lang][r.construction]}`,
      r.wageScopePercent === undefined ? d.common.none : percent(r.wageScopePercent, lang),
      r.costFramePercent === undefined ? d.common.none : percent(r.costFramePercent, lang),
      r.individualGuarantee ? d.common.yes : d.common.no,
      hasRevision?.[r.id] ?? d.common.none,
      <Button
        key="a"
        size="sm"
        variant="secondary"
        onClick={() => edit(r)}
        disabled={editing === r.id}
        disabledReason={w.alreadyOpen}
      >
        {w.edit}
      </Button>,
    ],
    sort: [
      r.validFrom,
      r.construction,
      r.wageScopePercent ?? -1,
      r.costFramePercent ?? -1,
      r.individualGuarantee ? "1" : "0",
      hasRevision?.[r.id] ?? "",
      "",
    ],
  }));

  return (
    <Panel title={t.wageAgreements} tags={["FA-002", "FA-007", "FA-008", "FA-009"]}>
      <p className="mb-3 max-w-4xl text-table">{t.wageIntro}</p>

      {saved && (
        <div className="mb-4">
          <Callout tone="ok" live tags={["FA-001", "FH-001"]}>
            {saved}
          </Callout>
        </div>
      )}

      {open && (
        <div className="print-hide mb-5 border-b border-border pb-5">
          <h3 className="mi-kicker mb-3 text-muted-foreground">
            {w.heading(`${open.validFrom} – ${open.validTo}`)}
          </h3>
          <FormGrid>
            <Select
              id="wa-construction"
              label={t.construction}
              width="full"
              lang={lang}
              value={construction}
              onChange={setConstruction}
              options={([1, 2, 3, 4, 5, 6, 7] as const).map((n) => ({
                id: String(n),
                label: `${n}. ${AGREEMENT_CONSTRUCTIONS[lang][n]}`,
              }))}
            />
            {/* The unit in the label, a bare number in the box — a field
                carrying its own sign is a string no report can sum. */}
            <TextField
              id="wa-scope"
              label={w.scopeLabel}
              width="short"
              numeric
              value={scope}
              onChange={setScope}
            />
            <TextField
              id="wa-cost"
              label={w.costLabel}
              width="short"
              numeric
              value={costFrame}
              onChange={setCostFrame}
            />
            <Select
              id="wa-guarantee"
              label={t.guarantee}
              width="short"
              lang={lang}
              value={guarantee}
              onChange={setGuarantee}
              options={[
                { id: "yes", label: d.common.yes },
                { id: "no", label: d.common.no },
              ]}
            />
          </FormGrid>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button iconStart={<IconCheck />} onClick={() => save(open.id)}>
              {d.common.save}
            </Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              {d.common.cancel}
            </Button>
          </div>
          {/* Why the period is not in this form. A field that is not editable
              says why on its own row rather than being greyed out in silence. */}
          <p className="field-hint mt-3">{w.periodElsewhere}</p>
        </div>
      )}

      <DataTable
        columns={columns}
        rows={rows}
        lang={lang}
        caption={t.wageAgreements}
        minWidth="52rem"
      />
      <Rationale>{w.logNote}</Rationale>
    </Panel>
  );
}
