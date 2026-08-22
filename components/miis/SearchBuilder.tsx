"use client";

import { IconClose, IconPlus } from "./icons";
import { useState } from "react";

import type { Lang } from "@/lib/domain/lang";
import {
  DOCUMENT_TYPE_CHOICES,
  INFO_TYPES,
  OPERATOR_LABEL,
  SEARCH_FIELDS,
  defaultValueFor,
  fieldsForInfoType,
  searchField,
  valueLabel,
  type InfoTypeId,
  type OperatorId,
  type SearchFieldDef,
  type SearchFieldId,
} from "@/lib/domain/options";
import { dictionary } from "@/lib/i18n";
import {
  SAVED_SEARCHES,
  conditionCount,
  coversDate,
  runQuery,
  type SavedSearch,
  type Searchable,
} from "@/lib/domain/query";
import { DataTable, type Column, type Row } from "./DataTable";
import { PrintButton } from "./Print";
import { Button, Callout, Chip, FilterChips, Panel, Rationale, ReqTag } from "./primitives";
import { SegmentedControl, Select, Tabs } from "./Select";

/**
 * FR-002 — the query builder.
 *
 * **The criteria run.** They did not: the screen composed a query correctly and
 * then showed every agreement regardless, *Sök* was `disabled` with "Ej aktiv i
 * demon", and changing a condition left the count where it was. So the one
 * screen whose whole argument is that MI cannot get data out of W3D3 was itself
 * a picture of a search. `lib/domain/query.ts` is the rule and it is tested;
 * this renders what it returns.
 *
 * There is no *Sök* button, and that is the point rather than an omission. The
 * result narrows as the selection changes, the way both registers and the
 * public view do — a button whose only effect is to confirm what is already on
 * screen is the dead control this screen was built out of.
 *
 * Two more things the screen has to demonstrate rather than depict:
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
      /*
        Sector only. The seed used to carry a `validAt` condition dated
        2026-12-31 — which predates every agreement in the register, so the
        screen opened on nought hits the moment the criteria started running,
        and it asked the point-in-time question twice over, once here and once
        in the Bokslut field below. The Bokslut date is the one that applies to
        the whole result; `Giltig vid tidpunkt` stays available as a condition
        for a query that needs it inside a group.
      */
      { id: "g1c0", field: "sector", operator: "is", value: "private" },
    ],
  },
];

/** One information type's searchable population, assembled on the server. */
export interface SearchPopulation {
  /**
   * What the query runs over — the projection, not the records.
   *
   * An agreement's construction lives on its latest wage agreement, so the data
   * layer joins that once rather than making a pure rule reach for a relation
   * it cannot see.
   */
  rows: Searchable[];
  /**
   * The rendered row per id, from the server.
   *
   * The cells carry FR-012's status marker and the confidentiality marker, and
   * those are decisions that must not be re-made in the browser — the same
   * arrangement the public search uses. The client decides which ids are shown
   * and nothing else.
   */
  rowFor: Record<string, Row>;
  /** Named apart from the presentation-column state below, which is a different
      list entirely: these are the table's columns, those are the officer's pick. */
  columns: Column[];
  /**
   * The column carrying the record's name and the link that opens it.
   *
   * Not always the first: an agreement's register leads with FR-012's status,
   * because an officer triages by how the agreement came about. Locking column
   * zero would have locked Status and offered to remove the agreement name.
   */
  identityColumn: string;
}

export function SearchBuilder({
  lang,
  populations,
  seconds,
  snapshotDate,
}: {
  lang: Lang;
  /**
   * FR-002's *val av informationstyp*, with something behind each one.
   *
   * The tab strip used to set a state variable nothing read: four tabs, one
   * result, no difference between them. A choice of information type is a
   * choice of **what is being searched** — different register, different
   * criteria, different columns — so each type brings its own population and
   * the criteria are rebuilt when it changes.
   */
  populations: Record<InfoTypeId, SearchPopulation>;
  /** Already formatted for the language — 1,8 in Swedish, 1.8 in English. */
  seconds: string;
  snapshotDate: string;
}) {
  const d = dictionary(lang);
  const t = d.sok;
  const c = t.criteria;

  const [infoType, setInfoType] = useState<InfoTypeId>("agreements");
  const [groups, setGroups] = useState<Group[]>(SEED);
  const [nextId, setNextId] = useState(100);
  /*
    FR-002's *presentationskolumner* — which columns the result prints.

    Was a fixed list of six labels in the dictionary, ticked into a boolean
    array nothing read: six checkboxes, one column set, no effect. The same dead
    control as the information-type tabs, on the same screen, one panel down.

    Now it is keyed off the population's own columns, because there are four
    registers and they share no column either. `undefined` means "not chosen
    yet", which is every column — a picker that started with two of six ticked
    would be hiding data nobody asked it to hide.
  */
  const [hidden, setHidden] = useState<Record<string, string[]>>({});
  const [docTypes, setDocTypes] = useState<string[]>(() =>
    DOCUMENT_TYPE_CHOICES.slice(0, 3).map((x) => x.id),
  );
  const [freeText, setFreeText] = useState(c.freeTextValue);

  /*
    FH-003's *bokslut* — one date, applied to the whole result.

    The field was an uncontrolled `<input>` wired to nothing: it looked live,
    it was not, and it escaped the sweep for dead controls only because it is
    not a `<button>`. It drives the result now, and the header states the date
    the figures are as at. Eighteen disabled "Visa per" buttons in the rows were
    the same question asked in a place that could not answer it; they are gone.
  */
  const [asOf, setAsOf] = useState(snapshotDate);

  /* The register being searched, and the criteria it can answer. */
  const population = populations[infoType];
  const fields = fieldsForInfoType(infoType);
  const infoTypeLabel = INFO_TYPES.find((x) => x.id === infoType)?.label[lang] ?? "";

  /*
    FH-003's bokslut applies to a population that has periods. An agreement is
    in force between two dates; a party is not, and a date control over the
    party register would be a criterion no row could answer — the same defect
    as the tabs, one level down.
  */
  const hasPeriods = population.rows.some((r) => r.validFrom ?? r.validTo);

  /*
    The result, from the criteria and the snapshot. `runQuery` and `coversDate`
    are the tested rules; this only decides which server-rendered rows to hand
    the table.
  */
  const matched = runQuery(population.rows, groups).filter(
    (r) => !hasPeriods || coversDate(r, asOf),
  );
  const resultRows = matched
    .map((r) => population.rowFor[r.id])
    .filter((x): x is Row => Boolean(x));

  /*
    The columns the officer left on, and the cells that go with them.

    The first column is never removable and says so: it carries the record's
    name and the link that opens it, so a result without it is a table of
    attributes belonging to nothing.
  */
  const hiddenHere = hidden[infoType] ?? [];
  const isIdentity = (key: string) => key === population.identityColumn;
  const isHidden = (key: string) => !isIdentity(key) && hiddenHere.includes(key);
  const keep = (i: number) => !isHidden(population.columns[i]?.key ?? "");
  const shownColumns = population.columns.filter((c) => !isHidden(c.key));
  const shownRows: Row[] = resultRows.map((row) => ({
    ...row,
    cells: row.cells.filter((_, i) => keep(i)),
    ...(row.sort ? { sort: row.sort.filter((_, i) => keep(i)) } : {}),
  }));

  function toggleColumn(key: string) {
    setHidden((prev) => {
      const here = prev[infoType] ?? [];
      return {
        ...prev,
        [infoType]: here.includes(key) ? here.filter((k) => k !== key) : [...here, key],
      };
    });
  }

  function newCondition(id: string, from: SearchFieldDef[] = fields): Condition {
    const field = from[0]!;
    return {
      id,
      field: field.id,
      operator: field.operators[0]!,
      value: defaultValueFor(field),
    };
  }

  /*
    Switching the information type rebuilds the criteria rather than carrying
    them across. They are not portable: no field is shared between the four
    registers, and a criterion that survived the switch would either be a field
    the new rows cannot answer or — worse, for `sector` — the same word asking a
    different question of a different register.
  */
  /*
    A saved search loads. The three names sat at the foot of the screen as a
    sentence — a claim that the feature existed rather than the feature. What is
    saved is the selection, never the hits: the register answers with whatever
    it holds today, which is the whole reason an officer keeps one.
  */
  const [loaded, setLoaded] = useState<string | undefined>(undefined);
  /* Saved this session. Kept apart from `SAVED_SEARCHES` so the catalogue that
     ships with the system and what this officer just composed are visibly two
     things — the new one is marked. */
  const [mine, setMine] = useState<SavedSearch[]>([]);

  function saveCurrent() {
    const n = mine.length + 1;
    setMine((list) => [
      ...list,
      {
        id: `egen-${n}`,
        name: { sv: `${t.columns.ownSearch} ${n}`, en: `${t.columns.ownSearch} ${n}` },
        purpose: {
          sv: `${infoTypeLabel} · ${expression}`,
          en: `${infoTypeLabel} · ${expression}`,
        },
        infoType,
        groups: groups.map((g) => ({ ...g, conditions: g.conditions.map((c) => ({ ...c })) })),
      },
    ]);
    setLoaded(`egen-${n}`);
  }

  function loadSaved(search: SavedSearch) {
    setInfoType(search.infoType);
    setGroups(search.groups.map((g) => ({ ...g, conditions: g.conditions.map((c) => ({ ...c })) })));
    setLoaded(search.id);
  }

  function changeInfoType(next: string) {
    setLoaded(undefined);
    const id = next as InfoTypeId;
    setInfoType(id);
    setGroups([
      { id: "g0", join: "all", conditions: [newCondition("g0c0", fieldsForInfoType(id))] },
    ]);
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

  /** Empty the whole selection — every group's conditions at once. */
  function clearConditions() {
    setGroups((prev) => prev.map((g) => ({ ...g, conditions: [] })));
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
      <div className="print-hide mb-6 flex flex-wrap items-center gap-3">
        <Tabs
          label={c.infoTypeLabel}
          value={infoType}
          onChange={changeInfoType}
          tabs={INFO_TYPES.map((x) => ({ id: x.id, label: x.label[lang] }))}
        />
        <ReqTag id="FR-002" />
      </div>

      {/*
        The query builder is a control, not a result. A printed search is the
        selection and the hits — the same rule the report screen follows, and
        the reason both now print as documents rather than as pictures of a
        form. The *Aktivt urval* block below stays on the paper: it is what
        says which population the hits came from.
      */}
      <div className="print-hide grid grid-cols-1 gap-5 @3xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
        <Panel title={c.title} tags={["FR-002"]}>
          <Rationale>{c.joinExplain}</Rationale>

          <div className="space-y-4">
            {groups.map((g, gi) => (
              <fieldset key={g.id} className="rounded-md border-2 border-border bg-surface/40 p-4">
                <legend className="flex flex-wrap items-center gap-3 px-1">
                  <span className="text-label font-bold">{c.groupLabel(gi + 1)}</span>
                  {/*
                    The operator is a value in the query, not a view preference
                    and not a flag, so it is a radiogroup — see
                    `SegmentedControl` for why MIIS keeps three "pick one"
                    controls apart rather than making them look alike.
                  */}
                  <SegmentedControl
                    size="sm"
                    label={c.groupJoinLabel(gi + 1)}
                    value={g.join}
                    onChange={(j) => setJoin(g.id, j as Join)}
                    options={(["all", "any"] as const).map((j) => ({
                      id: j,
                      label: joinWord(j),
                    }))}
                  />
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
                        <div /*
                          Wider on the first and third columns than it looks
                          like it needs. The field names are long Swedish
                          compounds — "Avtalskonstruktion" is 130px — and a
                          native select clips rather than ellipsising, so a
                          column sized to the average silently truncates the
                          longest. Measured: at 1fr the label overflowed its box
                          by 17px.
                        */
                          className="grid grid-cols-1 gap-2 @xl:grid-cols-[minmax(0,1.35fr)_7rem_minmax(0,1.5fr)_auto]">
                          <Select
                            id={`${cond.id}-field`}
                            srOnlyLabel
                            label={c.fieldAria(gi + 1, ci + 1)}
                            value={cond.field}
                            onChange={(v) => changeField(cond.id, v)}
                            options={fields.map((f) => ({ id: f.id, label: f.label[lang] }))}
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
                            <IconClose />
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

            It appears only where the rows have periods. A party is not in force
            between two dates, so a bokslut over the party register would be a
            control that cannot change its own result.
          */}
          <div className="mt-5 max-w-xs" hidden={!hasPeriods}>
            <label htmlFor="snapshot-date" className="mb-1 block text-label font-bold">
              {c.snapshot}
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <input
                id="snapshot-date"
                type="date"
                value={asOf}
                onChange={(e) => setAsOf(e.target.value)}
                data-filled={asOf ? "true" : undefined}
                className="field-input tabular-nums"
              />
              <ReqTag id="FH-003" />
            </div>
          </div>
        </Panel>

        <Panel title={t.columns.title} tags={["FR-002"]}>
          <p className="field-hint mb-3">{t.columns.intro}</p>
          <ul className="space-y-2">
            {population.columns.map((col, i) => (
              <li key={col.key}>
                <label className="flex min-h-11 items-center gap-3 text-table">
                  <input
                    type="checkbox"
                    checked={!isHidden(col.key)}
                    disabled={isIdentity(col.key)}
                    onChange={() => toggleColumn(col.key)}
                    className="size-5 accent-[var(--primary)] disabled:opacity-50"
                  />
                  <span>
                    {col.header}
                    {/* The reason on the row, the way a locked field carries
                        its own: a greyed box with no explanation reads as
                        something the system forgot to finish. */}
                    {isIdentity(col.key) && (
                      <span className="block text-label text-muted-foreground">
                        {t.columns.identityLocked}
                      </span>
                    )}
                  </span>
                </label>
              </li>
            ))}
          </ul>

          <div className="mt-5 space-y-3">
            {/*
              No *Sök*. The result below narrows as the selection changes, the
              way both registers and the public view do; a button whose only
              effect is to confirm what is already on screen is the dead control
              this screen was built out of.

              *Spara sökning* used to be `disabled` with a true reason — a saved
              search belongs to a user, and a user is a link to an identity in
              Försäkringskassan's IdP. But the screen now *loads* saved searches,
              so a refused Save sat next to a working Load, and the story only
              worked in one direction. It saves, for the session, the way every
              other edit in this prototype does; where the record would live is a
              Rationale rather than a dead control.
            */}
            <p className="text-label text-muted-foreground">{t.results.liveNote}</p>
            <Button
              variant="secondary"
              fullWidth
              onClick={saveCurrent}
              disabled={allConditions.length === 0}
              disabledReason={t.columns.nothingToSave}
              iconStart={<IconPlus />}
            >
              {t.columns.saveSearch}
            </Button>
            <Rationale>{t.columns.savedSearchNote}</Rationale>
            <Rationale>{t.columns.savedSearchBlocked}</Rationale>
          </div>
        </Panel>
      </div>

      {/* The selection, above the numbers it produced. */}
      <div className="mt-5 rounded-lg border border-border bg-card p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h2 className="font-display text-body font-semibold">{t.chips.heading}</h2>
          <ReqTag id="FR-002" />
        </div>
        {/*
          `FilterChips`, like both registers. These were **filled** — `Chip`'s
          selected state, which means "one of a set of options, chosen". A
          criterion already applied is not one of a set: the only thing it
          offers is removal, so filling it put the loudest treatment in the
          system on the control the reader is least likely to press. It is also
          the third place this had been hand-built, and the third livery.
        */}
        <FilterChips
          lang={lang}
          active={allConditions.map((cond) => ({
            key: cond.id,
            label: conditionText(cond),
            clear: () => removeCondition(cond.id),
          }))}
          onClearAll={clearConditions}
        />
      </div>

      {/*
        The saved searches, as controls. They belong immediately above the
        result because that is what they change; at the foot of the page they
        read as a footnote about a feature somewhere else.
      */}
      <div className="print-hide mt-6">
        <h2 className="text-label font-bold">{t.saved.title}</h2>
        <p className="field-hint mt-1">{t.saved.note}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {[...SAVED_SEARCHES, ...mine].map((s) => (
            <Chip
              key={s.id}
              selected={loaded === s.id}
              pressed={loaded === s.id}
              onToggle={() => loadSaved(s)}
            >
              {s.name[lang]}
              <span className="font-normal">
                {` · ${t.saved.conditions(conditionCount(s))}`}
              </span>
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <Panel
          title={t.results.title(matched.length, seconds, hasPeriods ? asOf : undefined)}
          tags={["FH-003", "NFP-003"]}
          action={<PrintButton lang={lang} />}
        >
          <DataTable
            columns={shownColumns}
            rows={shownRows}
            lang={lang}
            caption={t.results.title(matched.length, seconds, hasPeriods ? asOf : undefined)}
            empty={t.results.empty}
          />
          <Rationale>{t.results.responseNote(seconds)}</Rationale>
        </Panel>
      </div>
    </>
  );
}
