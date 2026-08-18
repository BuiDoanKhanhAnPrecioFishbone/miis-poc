"use client";

import { useState, type ReactNode } from "react";

import type { Lang } from "@/lib/domain/lang";
import {
  DOCUMENT_TYPE_CHOICES,
  INFO_TYPES,
  OPERATOR_LABEL,
  SEARCH_FIELDS,
  defaultValueFor,
  searchField,
  valueLabel,
  type OperatorId,
  type SearchFieldId,
} from "@/lib/domain/options";
import { dictionary } from "@/lib/i18n";
import { Button, Callout, Chip, Panel, Rationale, ReqTag } from "./primitives";
import { Select, Tabs } from "./Select";

/**
 * FR-002 — the query builder.
 *
 * Two things the screen has to demonstrate rather than depict:
 *
 * 1. **Criteria that compose.** Today's builder offers a flat list, which cannot
 *    express `(A ELLER B) OCH C`. Conditions live in groups, each group has its
 *    own operator, and the groups combine — with the expression written out so
 *    the user can read back what they built. This is the one place we depart
 *    from the sketch, which draws the operator per junction (update plan §5.3).
 * 2. **More than two document types at once.** §2.5 names today's limit — "a
 *    query builder limited to two document types simultaneously" — so the four
 *    types have to be genuinely tickable. A static row of chips proves nothing.
 *
 * Field, operator and value are chained through `lib/domain/options.ts`:
 * choosing a field decides which operators are offered and what the value
 * control becomes. Three dropdowns that ignored each other would satisfy the
 * picture and not the requirement.
 *
 * Chips borrowed from SCB's Statistikdatabasen, which MI's statistics users are
 * in every day: the active selection sits above the results, removable.
 */

type Join = "all" | "any";

interface Condition {
  id: string;
  field: SearchFieldId;
  operator: OperatorId;
  value: string;
}

interface Group {
  id: string;
  join: Join;
  conditions: Condition[];
}

/** The selection the screen opens with — the sketch's example, as ids. */
const SEED: Group[] = [
  {
    id: "g0",
    join: "any",
    conditions: [
      { id: "g0c0", field: "construction", operator: "is", value: "1" },
      { id: "g0c1", field: "construction", operator: "is", value: "2" },
    ],
  },
  {
    id: "g1",
    join: "all",
    conditions: [
      { id: "g1c0", field: "sector", operator: "is", value: "private" },
      { id: "g1c1", field: "validAt", operator: "asOf", value: "2026-12-31" },
    ],
  },
];

export function SearchBuilder({
  lang,
  hits,
  seconds,
  snapshotDate,
  children,
}: {
  lang: Lang;
  hits: number;
  /** Already formatted for the language — 1,8 in Swedish, 1.8 in English. */
  seconds: string;
  snapshotDate: string;
  /** The results table, rendered on the server from real agreement records. */
  children: ReactNode;
}) {
  const d = dictionary(lang);
  const t = d.sok;
  const c = t.criteria;

  const [infoType, setInfoType] = useState(INFO_TYPES[0]!.id);
  const [groups, setGroups] = useState<Group[]>(SEED);
  const [nextId, setNextId] = useState(100);
  const [columns, setColumns] = useState<boolean[]>(() => t.columns.items.map((_, i) => i < 4));
  const [docTypes, setDocTypes] = useState<string[]>(() =>
    DOCUMENT_TYPE_CHOICES.slice(0, 3).map((x) => x.id),
  );
  const [freeText, setFreeText] = useState(c.freeTextValue);

  function newCondition(id: string): Condition {
    const field = SEARCH_FIELDS[0]!;
    return {
      id,
      field: field.id,
      operator: field.operators[0]!,
      value: defaultValueFor(field),
    };
  }

  function addCondition(groupId: string) {
    const id = `c${nextId}`;
    setNextId((n) => n + 1);
    setGroups((gs) =>
      gs.map((g) =>
        g.id === groupId ? { ...g, conditions: [...g.conditions, newCondition(id)] } : g,
      ),
    );
  }

  function addGroup() {
    const id = `g${nextId}`;
    setNextId((n) => n + 2);
    setGroups((gs) => [...gs, { id, join: "all", conditions: [newCondition(`${id}c0`)] }]);
  }

  function removeCondition(conditionId: string) {
    setGroups((gs) =>
      gs
        .map((g) => ({ ...g, conditions: g.conditions.filter((x) => x.id !== conditionId) }))
        .filter((g) => g.conditions.length > 0),
    );
  }

  function removeGroup(groupId: string) {
    setGroups((gs) => gs.filter((g) => g.id !== groupId));
  }

  function setJoin(groupId: string, join: Join) {
    setGroups((gs) => gs.map((g) => (g.id === groupId ? { ...g, join } : g)));
  }

  function update(conditionId: string, patch: Partial<Condition>) {
    setGroups((gs) =>
      gs.map((g) => ({
        ...g,
        conditions: g.conditions.map((x) => (x.id === conditionId ? { ...x, ...patch } : x)),
      })),
    );
  }

  /** Changing the field invalidates the operator and the value under it. */
  function changeField(conditionId: string, fieldId: string) {
    const field = searchField(fieldId as SearchFieldId);
    update(conditionId, {
      field: field.id,
      operator: field.operators[0]!,
      value: defaultValueFor(field),
    });
  }

  const joinWord = (join: Join) => (join === "any" ? c.groupJoinAny : c.groupJoinAll);

  function conditionText(cond: Condition): string {
    const field = searchField(cond.field);
    return `${field.label[lang]} ${OPERATOR_LABEL[cond.operator][lang]} ${valueLabel(field, cond.value, lang)}`;
  }

  /** "(A ELLER B) OCH (C OCH D)" — the selection, written out. */
  const expression = groups
    .map((g) => {
      const parts = g.conditions.map(conditionText);
      const inner = parts.join(` ${joinWord(g.join)} `);
      return parts.length > 1 ? `(${inner})` : inner;
    })
    .join(` ${c.groupJoinAll} `);

  const allConditions = groups.flatMap((g) => g.conditions);

  return (
    <>
      {/* FR-002 — "choice of information type", the sketch's four pill tabs. */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Tabs
          label={c.infoTypeLabel}
          value={infoType}
          onChange={setInfoType}
          tabs={INFO_TYPES.map((x) => ({ id: x.id, label: x.label[lang] }))}
        />
        <ReqTag id="FR-002" />
      </div>

      <div className="grid grid-cols-1 gap-5 @3xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
        <Panel title={c.title} tags={["FR-002"]}>
          <Rationale>{c.joinExplain}</Rationale>

          <div className="space-y-4">
            {groups.map((g, gi) => (
              <fieldset key={g.id} className="rounded-md border-2 border-border bg-surface/40 p-4">
                <legend className="flex flex-wrap items-center gap-3 px-1">
                  <span className="text-label font-bold">{c.groupLabel(gi + 1)}</span>
                  <span className="inline-flex overflow-hidden rounded-md border-2 border-primary">
                    {(["all", "any"] as const).map((j) => (
                      <Button
                        key={j}
                        variant={g.join === j ? "primary" : "ghost"}
                        size="sm"
                        pressed={g.join === j}
                        onClick={() => setJoin(g.id, j)}
                      >
                        {joinWord(j)}
                      </Button>
                    ))}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => removeGroup(g.id)}>
                    {c.removeGroup(gi + 1)}
                  </Button>
                </legend>

                <ul className="mt-3 space-y-2">
                  {g.conditions.map((cond, ci) => {
                    const field = searchField(cond.field);
                    return (
                      <li key={cond.id}>
                        {ci > 0 && (
                          <p className="mb-2 text-meta font-bold uppercase tracking-[0.12em] text-muted-foreground">
                            {joinWord(g.join)}
                          </p>
                        )}
                        <div className="grid grid-cols-1 gap-2 @xl:grid-cols-[minmax(0,1fr)_8rem_minmax(0,1.3fr)_auto]">
                          <Select
                            id={`${cond.id}-field`}
                            srOnlyLabel
                            label={c.fieldAria(gi + 1, ci + 1)}
                            value={cond.field}
                            onChange={(v) => changeField(cond.id, v)}
                            options={SEARCH_FIELDS.map((f) => ({ id: f.id, label: f.label[lang] }))}
                          />
                          <Select
                            id={`${cond.id}-operator`}
                            srOnlyLabel
                            label={c.operatorAria(gi + 1, ci + 1)}
                            value={cond.operator}
                            onChange={(v) => update(cond.id, { operator: v as OperatorId })}
                            options={field.operators.map((o) => ({
                              id: o,
                              label: OPERATOR_LABEL[o][lang],
                            }))}
                          />
                          {field.value.kind === "choice" ? (
                            <Select
                              id={`${cond.id}-value`}
                              srOnlyLabel
                              label={c.valueAria(gi + 1, ci + 1)}
                              value={cond.value}
                              onChange={(v) => update(cond.id, { value: v })}
                              options={field.value.choices.map((o) => ({
                                id: o.id,
                                label: o.label[lang],
                              }))}
                            />
                          ) : (
                            <div>
                              <label htmlFor={`${cond.id}-value`} className="sr-only">
                                {c.valueAria(gi + 1, ci + 1)}
                              </label>
                              <input
                                id={`${cond.id}-value`}
                                type="date"
                                value={cond.value}
                                onChange={(e) => update(cond.id, { value: e.target.value })}
                                className="field-input tabular-nums"
                              />
                            </div>
                          )}
                          <Button
                            variant="ghost"
                            onClick={() => removeCondition(cond.id)}
                            ariaLabel={c.removeCondition(conditionText(cond))}
                          >
                            ✕
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-3">
                  <Button variant="secondary" size="sm" onClick={() => addCondition(g.id)}>
                    {c.addCondition}
                  </Button>
                </div>
              </fieldset>
            ))}
          </div>

          <div className="mt-4">
            <Button onClick={addGroup}>{c.addGroup}</Button>
          </div>

          <div className="mt-4">
            <Callout tone="attention" label={c.expression}>
              <span className="break-words">{expression || t.chips.empty}</span>
            </Callout>
          </div>

          {/* FR-003 — free text in uploaded documents and in selections. */}
          <div className="mt-5">
            <label htmlFor="free-text" className="mb-1 block text-label font-bold">
              {c.freeText}
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <input
                id="free-text"
                type="search"
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                className="field-input max-w-md"
              />
              <ReqTag id="FR-003" />
            </div>
          </div>

          {/*
            §2.5 — today's builder is limited to two document types at once.
            Being able to tick all four is the concrete claim this screen makes,
            so the chips have to be real.
          */}
          <div className="pt-5">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="text-label font-bold">{c.documentTypes}</span>
              <ReqTag id="FR-002" />
            </div>
            <ul className="flex flex-wrap gap-2">
              {DOCUMENT_TYPE_CHOICES.map((h) => {
                const on = docTypes.includes(h.id);
                return (
                  <li key={h.id}>
                    <Chip
                      selected={on}
                      pressed={on}
                      onToggle={() =>
                        setDocTypes((xs) => (on ? xs.filter((x) => x !== h.id) : [...xs, h.id]))
                      }
                    >
                      {h.label[lang]}
                    </Chip>
                  </li>
                );
              })}
            </ul>
            <p aria-live="polite" className="mt-2 text-label text-muted-foreground">
              {c.documentTypesSelected(docTypes.length, DOCUMENT_TYPE_CHOICES.length)}
            </p>
            <Rationale>{c.documentTypesNote}</Rationale>
          </div>

          {/*
            FH-003 — a snapshot is a date, not a mode. The "Bokslutsläge" select
            we had was a control we invented; the date carries it, and the
            results header states which date the figures are as at.
          */}
          <div className="mt-5 max-w-xs">
            <label htmlFor="snapshot-date" className="mb-1 block text-label font-bold">
              {c.snapshot}
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <input
                id="snapshot-date"
                type="date"
                defaultValue={snapshotDate}
                className="field-input tabular-nums"
              />
              <ReqTag id="FH-003" />
            </div>
          </div>
        </Panel>

        <Panel title={t.columns.title} tags={["FR-002"]}>
          <ul className="space-y-2">
            {t.columns.items.map((item, i) => (
              <li key={item}>
                <label className="flex min-h-11 items-center gap-3 text-table">
                  <input
                    type="checkbox"
                    checked={columns[i] ?? false}
                    onChange={() => setColumns((cs) => cs.map((on, j) => (j === i ? !on : on)))}
                    className="size-5 accent-[var(--primary)]"
                  />
                  {item}
                </label>
              </li>
            ))}
          </ul>

          <div className="mt-5 space-y-3">
            <Button variant="secondary" fullWidth>
              {t.columns.saveSearch}: {t.columns.savedSearchName}
            </Button>
            <Rationale>{t.columns.savedSearchNote}</Rationale>
            <Button fullWidth>{d.common.search}</Button>
          </div>
        </Panel>
      </div>

      {/* The selection, above the numbers it produced. */}
      <div className="mt-5 rounded-lg border border-border bg-card p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h2 className="font-display text-body font-semibold">{t.chips.heading}</h2>
          <ReqTag id="FR-002" />
        </div>
        {allConditions.length === 0 ? (
          <p className="text-label text-muted-foreground">{t.chips.empty}</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {allConditions.map((cond) => (
              <li key={cond.id}>
                <Chip
                  selected
                  onRemove={() => removeCondition(cond.id)}
                  removeLabel={t.chips.remove(conditionText(cond))}
                >
                  {conditionText(cond)}
                </Chip>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-5">
        <Panel title={t.results.title(hits, seconds, snapshotDate)} tags={["FH-003", "NFP-003"]}>
          {children}
          <Rationale>{t.results.responseNote(seconds)}</Rationale>
        </Panel>
      </div>
    </>
  );
}
