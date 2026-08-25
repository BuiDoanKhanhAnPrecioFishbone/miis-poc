"use client";

import { useState } from "react";

import type { Lang } from "@/lib/domain/lang";
import {
  RETENTION_ACTION_LABEL,
  RETENTION_RULES,
  describeRule,
  isEditable,
  maySetMonths,
  setAutomatic,
  setMonths,
} from "@/lib/domain/retention";
import { dictionary } from "@/lib/i18n";
import { DataTable, type Column, type Row } from "./DataTable";
import { Toggle } from "./Toggle";
import { Badge, Callout, Panel, Rationale, TextField } from "./primitives";

/**
 * D-004's second half — *"möjlighet att definiera automatiska gallringsregler"*.
 *
 * The requirement was answered by a Rationale on two screens saying contact
 * details fall under MI's retention routines. That is a sentence *about* a
 * rule; the ska-krav names the ability to define one, and an evaluator reading
 * D-004 against the interface would have found nothing to press.
 *
 * **The fixed row is the point of the screen, not an omission from it.**
 * NFL-003 keeps the logs for at least 24 months and puts them beyond *"vanliga
 * användare eller systemadministratörer"* — which is the role standing here. So
 * D-004 says define rules and NFL-003 says not for these, and both are on the
 * screen: three rows an administrator sets, and one that carries MI's own
 * sentence instead of a control. Four editable rows would say we built a form.
 * `SYSTEM_SETTINGS` does the same thing for the same reason.
 *
 * The period is a bare number with its unit in the label, and each rule states
 * what starts its clock — a gallringstid with no trigger is a number, and
 * "24 months from what" is the first question anybody asks of one.
 */
export function RetentionRules({ lang }: { lang: Lang }) {
  const d = dictionary(lang);
  const t = d.administration.gallring;

  const [rules, setRules] = useState(RETENTION_RULES);
  const [saved, setSaved] = useState<string | null>(null);

  function changeMonths(id: string, raw: string) {
    const months = Number.parseInt(raw, 10);
    const rule = rules.find((r) => r.id === id);
    if (!rule || Number.isNaN(months) || !maySetMonths(rule, months)) return;
    const next = setMonths(rules, id, months);
    setRules(next);
    setSaved(describeRule(next.find((r) => r.id === id)!, lang));
  }

  function changeAutomatic(id: string, on: boolean) {
    const next = setAutomatic(rules, id, on);
    setRules(next);
    const rule = next.find((r) => r.id === id)!;
    setSaved(on ? t.nowAutomatic(rule.subject[lang]) : t.nowManual(rule.subject[lang]));
  }

  const columns: Column[] = [
    { key: "subject", header: t.table.subject, sortable: true },
    { key: "trigger", header: t.table.trigger },
    { key: "months", header: t.table.months, numeric: true, sortable: true },
    { key: "action", header: t.table.action, sortable: true },
    { key: "automatic", header: t.table.automatic },
  ];

  const rows: Row[] = rules.map((rule) => {
    const editable = isEditable(rule);
    return {
      key: rule.id,
      cells: [
        <span key="s" className="min-w-0">
          <span className="block font-semibold">{rule.subject[lang]}</span>
          <span className="block text-label text-muted-foreground">{rule.source[lang]}</span>
        </span>,
        <span key="t" className="text-label">
          {rule.trigger[lang]}
          {/* The requirement that fixes it, on the row it fixes. A greyed
              control with no reason reads as something unfinished. */}
          {!editable && rule.fixedReason && (
            <span className="mt-1 block font-semibold">{rule.fixedReason[lang]}</span>
          )}
        </span>,
        editable ? (
          <TextField
            key="m"
            id={`ret-${rule.id}`}
            label={t.table.months}
            srOnlyLabel
            width="short"
            numeric
            value={String(rule.months)}
            onChange={(v) => changeMonths(rule.id, v)}
          />
        ) : (
          <span key="m" className="tabular-nums">
            {rule.months}
          </span>
        ),
        <Badge key="a" tone="neutral">
          {RETENTION_ACTION_LABEL[lang][rule.action]}
        </Badge>,
        editable ? (
          <Toggle
            key="auto"
            id={`ret-auto-${rule.id}`}
            label={t.table.automatic}
            srOnlyLabel
            lang={lang}
            checked={rule.automatic}
            onChange={(on) => changeAutomatic(rule.id, on)}
          />
        ) : (
          <span key="auto" className="text-label">
            {d.common.no}
          </span>
        ),
      ],
      sort: [
        rule.subject[lang],
        rule.trigger[lang],
        rule.months,
        RETENTION_ACTION_LABEL[lang][rule.action],
        rule.automatic ? "1" : "0",
      ],
    };
  });

  return (
    <Panel title={t.heading} tags={["D-004", "NFL-003"]}>
      <p className="mb-4 max-w-4xl text-table">{t.intro}</p>

      {saved && (
        <div className="mb-4">
          <Callout tone="ok" live tags={["D-004"]}>
            {saved}
          </Callout>
        </div>
      )}

      <DataTable columns={columns} rows={rows} lang={lang} caption={t.heading} minWidth="60rem" />
      <Rationale>{t.anonymiseNote}</Rationale>
      <Rationale>{t.logNote}</Rationale>
    </Panel>
  );
}
