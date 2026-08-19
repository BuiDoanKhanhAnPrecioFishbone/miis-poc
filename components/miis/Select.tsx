"use client";

import { useState, type ReactNode } from "react";

import { FieldLabel } from "./primitives";

/**
 * A closed list of options.
 *
 * A native `<select>` on purpose. The longest closed list anywhere in the
 * requirements is seven — FA-007's agreement constructions — so nothing here
 * needs a searchable combobox, and a custom one would mean re-implementing
 * keyboard handling, mobile pickers and screen-reader behaviour in order to end
 * up slightly worse. Native also inherits the global focus ring.
 *
 * Self-contained state, so it drops into a server-rendered page without turning
 * that page into a client component.
 *
 * Where the caller needs to know the value — the query builder chains field to
 * operator to value — pass `value` and `onChange` and it becomes controlled.
 */
/**
 * The mark at the end of a closed list, drawn by us so its distance from the
 * border is a number we chose. Sized and positioned from the same two custom
 * properties that reserve the select's end padding, so the gap and the space
 * kept clear for it can never drift apart.
 */
export function SelectChevron() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-[var(--select-chevron-gap)] flex items-center text-foreground"
    >
      {/*
        Sized from CSS, not from `width`/`height` attributes — an SVG
        presentation attribute takes a number, not a `var()`, so the custom
        property has to arrive through a class or it is silently ignored.
      */}
      <svg
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[var(--select-chevron-size)] w-[var(--select-chevron-size)]"
      >
        <path d="M2 4.5 6 8.5 10 4.5" />
      </svg>
    </span>
  );
}

export function Select({
  id,
  label,
  options,
  defaultValue,
  value,
  onChange,
  hint,
  badge,
  srOnlyLabel,
}: {
  id: string;
  label: string;
  options: { id: string; label: string }[];
  defaultValue?: string;
  /** Controlled mode; omit both to let the select keep its own state. */
  value?: string;
  onChange?: (value: string) => void;
  hint?: string;
  badge?: ReactNode;
  /** For the query builder, where the row already reads as a sentence. */
  srOnlyLabel?: boolean;
}) {
  const [internal, setInternal] = useState(defaultValue ?? options[0]?.id ?? "");
  const current = value ?? internal;

  return (
    <div>
      {srOnlyLabel ? (
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
      ) : (
        <FieldLabel htmlFor={id} badge={badge}>
          {label}
        </FieldLabel>
      )}
      {/*
        The chevron is drawn here rather than by the platform. A native select
        anchors its own mark to the border box and ignores `padding-inline-end`
        while doing it, so the gap could not be set from CSS — measured in
        Chrome, 24px of end padding left the mark 10px from the border. The
        select keeps `appearance: none` (see `globals.css`), which removes the
        painting and nothing else, and this span sits at a stated distance from
        the edge. `pointer-events-none` so clicking the mark still opens the
        list; `aria-hidden` because the select already announces itself.
      */}
      <div className="relative">
        {/*
          `title` carries the full value. A native select clips a long option
          rather than ellipsising it, and the constructions MI defines run to 56
          characters — longer than any column that also has to hold an operator
          and a value. The dropdown and the written-out expression below both
          still show it in full; this is the third way to reach it.
        */}
        <select
          id={id}
          title={options.find((o) => o.id === current)?.label}
          value={current}
          onChange={(e) => {
            if (value === undefined) setInternal(e.target.value);
            onChange?.(e.target.value);
          }}
          className="field-input"
        >
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <SelectChevron />
      </div>
      {hint && <p className="mt-1 text-label text-muted-foreground">{hint}</p>}
    </div>
  );
}

/**
 * A choice between a few mutually exclusive values — the third of MIIS's three
 * "pick one" controls, and the one that had no component.
 *
 * The three are not interchangeable, and telling them apart is the point:
 *
 * - **`Toggle`** is a `switch`. It sets a flag on or off — jämställdhetsflagga,
 *   sekretessmarkering. There is a default state and a changed one.
 * - **`Tabs`** is a `tablist`. It changes which panel is shown. Nothing about
 *   the case is different afterwards.
 * - **`SegmentedControl`** is a `radiogroup`. It is a value with two or three
 *   options, and the value is part of the data — the OCH/ELLER operator joining
 *   search conditions is a property of the query, not a view preference and not
 *   a flag.
 *
 * The query builder was building this by hand out of two `Button`s inside a
 * bordered span, which gave the system a third look for "pick one" and told
 * assistive technology it was a pair of unrelated toggle buttons. Radio
 * semantics also bring the arrow-key behaviour a keyboard user expects: the
 * group is one tab stop, and arrows move within it.
 */
export function SegmentedControl({
  label,
  options,
  value,
  onChange,
  size = "md",
}: {
  label: string;
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  size?: "sm" | "md";
}) {
  const index = Math.max(
    0,
    options.findIndex((o) => o.id === value),
  );

  function onKeyDown(e: React.KeyboardEvent) {
    const delta =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (delta === 0) return;
    e.preventDefault();
    const next = options[(index + delta + options.length) % options.length];
    if (next) onChange(next.id);
  }

  const pad = size === "sm" ? "min-h-11 px-3 text-label" : "min-h-12 px-4 text-table";

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className="inline-flex overflow-hidden rounded-md border-2 border-primary"
    >
      {options.map((o) => {
        const selected = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(o.id)}
            className={`${pad} font-bold transition-colors ${
              selected
                ? "bg-primary text-primary-foreground"
                : "bg-card text-primary hover:bg-secondary"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * FR-002's information type, as the four pill tabs the US-11 sketch draws.
 *
 * Roving tabindex and arrow keys, so the group is one tab stop rather than
 * four, and `aria-selected` carries the state — the fill alone would not.
 */
export function Tabs({
  label,
  tabs,
  value,
  onChange,
}: {
  label: string;
  tabs: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  const index = Math.max(
    0,
    tabs.findIndex((t) => t.id === value),
  );

  function onKeyDown(e: React.KeyboardEvent) {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (delta === 0) return;
    e.preventDefault();
    const next = tabs[(index + delta + tabs.length) % tabs.length];
    if (next) onChange(next.id);
  }

  return (
    <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className="flex flex-wrap gap-2">
      {tabs.map((t) => {
        const selected = t.id === value;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(t.id)}
            className={`min-h-11 rounded-md border-2 px-5 py-2 text-label transition-colors ${
              selected
                ? "border-primary bg-primary font-bold text-primary-foreground"
                : "border-transparent bg-secondary font-semibold text-secondary-foreground hover:bg-accent"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
