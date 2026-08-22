"use client";

import { useState, type ReactNode } from "react";

import type { Lang } from "@/lib/domain/lang";

import { fieldSpan, FieldLabel } from "./primitives";

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
  required,
  lang,
  width = "full",
}: {
  id: string;
  /** Marks the field as one that must be chosen — the same rule `TextField` follows. */
  required?: boolean;
  /** Needed only when `required` is set: the word is translated. */
  lang?: Lang;
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
  /**
   * Width matched to the longest option, the same rule `TextField` follows.
   *
   * Narrowing the text inputs and leaving the selects full-column made the
   * forms *worse*, not better: a row of short boxes beside full-width ones
   * reads as broken alignment rather than as deliberate sizing. A Ja/Nej select
   * is `short`; a list of party names or the seven constructions is `full`.
   */
  width?: "short" | "medium" | "full";
}) {
  const [internal, setInternal] = useState(defaultValue ?? options[0]?.id ?? "");
  const current = value ?? internal;

  return (
    <div data-span={fieldSpan(width)}>
      {srOnlyLabel ? (
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
      ) : (
        <FieldLabel htmlFor={id} badge={badge} required={required} lang={lang}>
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
      {/*
        `field-control` is what lets a form row take the width back. Inside a
        `FormGrid` the column is already the field's width, so a second cap here
        would leave the select short of its own column while the text field
        beside it filled one — the "these are not aligned" fault, one component
        deep. Outside a form row the cap is still doing its job.
      */}
      <div
        className={`field-control relative ${
          width === "short" ? "max-w-[12rem]" : width === "medium" ? "max-w-[26rem]" : ""
        }`}
      >
        {/*
          `title` carries the full value. A native select clips a long option
          rather than ellipsising it, and the constructions MI defines run to 56
          characters — longer than any column that also has to hold an operator
          and a value. The dropdown and the written-out expression below both
          still show it in full; this is the third way to reach it.
        */}
        <select
          aria-required={required || undefined}
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
      {/* `field-hint`, so print can drop it: a prompt for someone filling the
          form in is not part of the document the form produces. */}
      {hint && <p className="field-hint mt-1 text-label text-muted-foreground">{hint}</p>}
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
 * Which panel is shown — a tab strip, and now shaped like one.
 *
 * It used to be a row of filled pills, which made it identical to
 * `SegmentedControl` and to a selected `Chip`. Three controls that mean three
 * different things — *which panel is shown*, *which value is set*, *which
 * option is chosen* — cannot all be a dark filled rounded rectangle; an
 * officer learns the shape, not the ARIA role, and there was nothing to learn.
 *
 * A tab now sits **on a rule and breaks it**: the selected one carries a 3px
 * mark in the primary colour and the page's own text weight, the rest are
 * quiet labels on the same baseline. That is the one tab convention every
 * reader already has, it survives greyscale and a projector because the
 * carrier is a shape rather than a fill, and it can never be mistaken for a
 * button — which is exactly what the filled pill was being mistaken for.
 *
 * Roving tabindex and arrow keys, so the group is one tab stop rather than
 * four, and `aria-selected` carries the state — the mark alone would not.
 *
 * `Home` and `End` jump to the ends, which WAI-ARIA's tabs pattern expects and
 * which matters more here than it looks: the drawer's queue is the last tab and
 * the one an officer reaches for most.
 */
export function Tabs({
  label,
  tabs,
  value,
  onChange,
}: {
  label: string;
  /**
   * `count` rides on the tab rather than being written into the label.
   *
   * The drawer was building `"Väntar (3)"` by string concatenation, which meant
   * the number could not be styled, could not be given its own accessible name
   * and was announced as part of the tab's title. Here it is a pill the eye
   * finds before it reads, and the tab's `aria-label` says what the number
   * counts instead of leaving a screen reader to guess at a bare digit.
   */
  tabs: { id: string; label: string; count?: number; countLabel?: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  const index = Math.max(
    0,
    tabs.findIndex((t) => t.id === value),
  );

  function onKeyDown(e: React.KeyboardEvent) {
    const target =
      e.key === "ArrowRight"
        ? index + 1
        : e.key === "ArrowLeft"
          ? index - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? tabs.length - 1
              : null;
    if (target === null) return;
    e.preventDefault();
    const next = tabs[(target + tabs.length) % tabs.length];
    if (next) onChange(next.id);
  }

  return (
    /*
      The rule belongs to the strip, and each tab breaks it with `-mb-[2px]`.
      Wrapping is allowed — four tabs at 375px do not fit on one line — and a
      wrapped row keeps its own marks, which is legible even though the shared
      baseline is gone. Scrolling the strip instead would hide a tab behind a
      gesture, and a hidden tab is a hidden section.
    */
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className="flex flex-wrap items-end gap-x-1 gap-y-0 border-b-2 border-border"
    >
      {tabs.map((t) => {
        const selected = t.id === value;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-label={
              t.count !== undefined && t.countLabel ? `${t.label} – ${t.countLabel}` : undefined
            }
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(t.id)}
            className={`-mb-[2px] inline-flex min-h-11 items-center gap-2 border-b-[3px] px-3 py-2 text-table transition-colors ${
              selected
                ? "border-primary font-bold text-foreground"
                : "border-transparent font-semibold text-muted-foreground hover:border-input hover:text-foreground"
            }`}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span
                aria-hidden
                className={`inline-flex min-w-5 justify-center rounded-full px-1.5 py-0.5 text-meta font-bold tabular-nums ${
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
