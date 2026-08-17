"use client";

import { useState } from "react";

import type { Lang } from "@/lib/domain/lang";
import { dictionary } from "@/lib/i18n";
import { Button, Callout, Chip, Panel, Rationale, ReqTag } from "./primitives";

/**
 * FR-002 — the query builder.
 *
 * The screen's whole argument is that MIIS beats the current system, whose
 * builder cannot combine more than two document types and offers only a flat
 * list of conditions. A flat OCH/ELLER between sibling rows cannot express
 * `(A ELLER B) OCH C`, so the builder has to visibly do more: conditions live in
 * groups, each group has its own operator, and the groups are combined with each
 * other. The expression is written out above the criteria so the user can read
 * back what they built rather than infer it from indentation.
 *
 * Chips borrowed from SCB's Statistikdatabasen, which MI's statistics users are
 * in every day: the active selection sits above the results as removable chips,
 * so what the numbers are filtered by is visible from the numbers themselves.
 */

type Join = "all" | "any";

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface Group {
  id: string;
  join: Join;
  conditions: Condition[];
}

interface SeedCondition {
  field: string;
  operator: string;
  value: string;
}

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
  children: React.ReactNode;
}) {
  const d = dictionary(lang);
  const t = d.sok;
  const c = t.criteria;

  const [groups, setGroups] = useState<Group[]>(() =>
    c.seedGroups.map((g, gi) => ({
      id: `g${gi}`,
      join: g.join === "any" ? "any" : "all",
      conditions: g.conditions.map((cond, ci) => ({ id: `g${gi}c${ci}`, ...cond })),
    })),
  );
  const [nextId, setNextId] = useState(100);
  const [columns, setColumns] = useState<boolean[]>(() => t.columns.items.map((_, i) => i < 4));

  const newCondition: SeedCondition = c.newCondition;

  function addCondition(groupId: string) {
    const id = `c${nextId}`;
    setNextId((n) => n + 1);
    setGroups((gs) =>
      gs.map((g) =>
        g.id === groupId ? { ...g, conditions: [...g.conditions, { id, ...newCondition }] } : g,
      ),
    );
  }

  function addGroup() {
    const id = `g${nextId}`;
    setNextId((n) => n + 2);
    setGroups((gs) => [
      ...gs,
      { id, join: "all", conditions: [{ id: `${id}c0`, ...newCondition }] },
    ]);
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

  const joinWord = (join: Join) => (join === "any" ? c.groupJoinAny : c.groupJoinAll);

  /** "(A ELLER B) OCH (C OCH D)" — the selection, written out. */
  const expression = groups
    .map((g) => {
      const parts = g.conditions.map((x) => `${x.field} ${x.operator} ${x.value}`);
      const inner = parts.join(` ${joinWord(g.join)} `);
      return parts.length > 1 ? `(${inner})` : inner;
    })
    .join(` ${c.groupJoinAll} `);

  const allConditions = groups.flatMap((g) => g.conditions);

  return (
    <>
      <div className="grid gap-5 @3xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
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
                  {g.conditions.map((cond, ci) => (
                    <li key={cond.id}>
                      {ci > 0 && (
                        <p className="mb-2 text-meta font-bold uppercase tracking-wide text-muted-foreground">
                          {joinWord(g.join)}
                        </p>
                      )}
                      <div className="grid gap-2 @xl:grid-cols-[minmax(0,1fr)_7rem_minmax(0,1.3fr)_auto]">
                        <span className="field-input">{cond.field} ▾</span>
                        <span className="field-input">{cond.operator} ▾</span>
                        <span className="field-input">{cond.value} ▾</span>
                        <Button
                          variant="ghost"
                          onClick={() => removeCondition(cond.id)}
                          ariaLabel={c.removeCondition(`${cond.field} ${cond.value}`)}
                        >
                          ✕
                        </Button>
                      </div>
                    </li>
                  ))}
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

          <div className="mt-5 grid items-end gap-3 @xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
            <span className="text-label font-bold">{c.freeText}</span>
            <span className="field-input">{c.freeTextValue}</span>
            <ReqTag id="FR-003" />
          </div>

          <div className="pt-5">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="text-label font-bold">{c.documentTypes}</span>
              <ReqTag id="FR-002" />
            </div>
            <div className="flex flex-wrap gap-2">
              {c.documentTypeItems.map((h, i) => (
                <Chip key={h} selected={i < 3}>
                  {h}
                </Chip>
              ))}
            </div>
            <Rationale>{c.documentTypesNote}</Rationale>
          </div>

          <div className="mt-5 grid items-end gap-3 @xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
            <div>
              <span className="mb-1 block text-label font-bold">{c.snapshot}</span>
              <span className="field-input">{snapshotDate}</span>
            </div>
            <div>
              <span className="mb-1 block text-label font-bold">{c.snapshotMode}</span>
              <span className="field-input">{c.snapshotEnabled} ▾</span>
            </div>
            <ReqTag id="FH-003" />
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
                  removeLabel={t.chips.remove(`${cond.field} ${cond.value}`)}
                >
                  {cond.field} {cond.operator} {cond.value}
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
