"use client";

import { useState, type ReactNode } from "react";

import type { Lang } from "@/lib/domain/lang";
import { dictionary } from "@/lib/i18n";
import { FieldLabel } from "./primitives";

/**
 * A flag the requirements name as a flag — FA-011 gender equality, FA-012
 * industry benchmark, D-001 confidentiality, FA-009, FA-010, FF-005, FF-010.
 *
 * It manages its own state, so it can be dropped into a server-rendered page
 * without turning that page into a client component. Pages stay server
 * components that `await` a `lib/data/` function; only the switch is a client.
 *
 * The state is in **text beside the switch**, not only in the position of the
 * knob and the colour of the track. A switch whose only "on" signal is a green
 * fill fails 1.4.1 in exactly the way the FR-012 status markers were fixed for.
 *
 * The three flags this replaces were two nested `<span>`s and could not be
 * operated at all.
 */
export function Toggle({
  id,
  label,
  lang,
  defaultOn = false,
  onLabel,
  offLabel,
  children,
}: {
  id: string;
  label: string;
  lang: Lang;
  defaultOn?: boolean;
  /** Defaults to Ja/Nej — override where the flag reads better another way. */
  onLabel?: string;
  offLabel?: string;
  /** Shown only while the flag is on, e.g. the confidentiality marker. */
  children?: ReactNode;
}) {
  const common = dictionary(lang).common;
  const [on, setOn] = useState(defaultOn);
  const stateText = on ? (onLabel ?? common.yes) : (offLabel ?? common.no);

  return (
    <div>
      {/*
        The shared label row, so a switch lines up with the fields beside it.
        Its own row was a different height, which put the toggle below its
        neighbour whenever the label wrapped — "Industrimärke (märkessättande
        avtal)" takes two lines where "Jämställdhetsflagga" takes one.
      */}
      <FieldLabel id={`${id}-label`}>{label}</FieldLabel>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          id={id}
          role="switch"
          aria-checked={on}
          aria-labelledby={`${id}-label`}
          onClick={() => setOn((v) => !v)}
          className={`flex h-8 w-14 shrink-0 items-center rounded-full border-2 px-1 transition-colors ${
            on ? "border-[var(--status-green)] bg-status-green" : "border-input bg-secondary"
          }`}
        >
          <span
            className={`size-5 rounded-full bg-card transition-transform ${
              on ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
        <span className={`text-table ${on ? "font-semibold" : "text-muted-foreground"}`}>
          {stateText}
        </span>
        {on && children}
      </div>
    </div>
  );
}
