"use client";

import { useState, type ReactNode } from "react";

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
      <div className={srOnlyLabel ? "" : "mb-1 flex min-h-7 flex-wrap items-center gap-2"}>
        <label
          htmlFor={id}
          className={srOnlyLabel ? "sr-only" : "text-label font-bold text-foreground"}
        >
          {label}
        </label>
        {!srOnlyLabel && badge}
      </div>
      <select
        id={id}
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
      {hint && <p className="mt-1 text-label text-muted-foreground">{hint}</p>}
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
