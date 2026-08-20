"use client";

import { useMemo, useState, type ReactNode } from "react";

import type { Lang } from "@/lib/domain/lang";
import { IconSortable, IconSortAsc, IconSortDesc } from "./icons";
import { dictionary } from "@/lib/i18n";

/**
 * The one table.
 *
 * Seven screens were repeating the same `<thead>` markup, the same
 * `overflow-x-auto` wrapper and the same `tabular-nums` on numeric cells. More
 * importantly they were all missing the three things that actually cost a user
 * time on a long list: a header that stays put, a row you can follow with the
 * eye, and the ability to reorder by the column you care about.
 *
 * **Cells are rendered on the server.** A page passes already-rendered
 * `ReactNode`s plus a parallel array of plain sort values, so status markers,
 * confidentiality icons and links keep being server components and only the
 * ordering happens in the browser. That keeps the mock→Supabase seam intact.
 *
 * No zebra striping: a row already carries a status shape, sometimes a
 * confidentiality icon and sometimes a badge, and alternating backgrounds on top
 * of that is noise. A clear row border plus hover does the same work quietly.
 */

export interface Column {
  key: string;
  header: string;
  /** Right-aligns and applies tabular figures. */
  numeric?: boolean;
  sortable?: boolean;
}

export interface Row {
  key: string;
  cells: ReactNode[];
  /** Parallel to `columns`. Only read for sortable columns. */
  sort?: (string | number)[];
  /**
   * The row's own values for the properties a register may be filtered by —
   * `{ area: "Apotek", registration: "complete" }`.
   *
   * Plain strings rather than the rendered cell, because by the time a filter
   * sees a cell it is a `ReactNode` and cannot be compared. The filter
   * components read these; `DataTable` never does, which keeps the table a
   * table.
   */
  facets?: Record<string, string>;
}

/** Rows whose facets match every stated criterion. An empty criterion matches all. */
export function matchesFacets(row: Row, criteria: Record<string, string>): boolean {
  return Object.entries(criteria).every(([key, value]) => !value || row.facets?.[key] === value);
}

type Direction = "asc" | "desc";

/** Long lists get a pinned header; short ones do not need the scroll box. */
const ROWS_BEFORE_STICKY = 10;

export function DataTable({
  columns,
  rows,
  lang,
  caption,
  minWidth = "52rem",
  empty,
}: {
  columns: Column[];
  rows: Row[];
  lang: Lang;
  /** Names the scroll region for assistive technology. */
  caption: string;
  minWidth?: string;
  /** Shown instead of the table when nothing is left to show. */
  empty?: string;
}) {
  const t = dictionary(lang).common;
  const [sortBy, setSortBy] = useState<number | null>(null);
  const [direction, setDirection] = useState<Direction>("asc");

  const sorted = useMemo(() => {
    if (sortBy === null) return rows;
    const factor = direction === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = a.sort?.[sortBy] ?? "";
      const bv = b.sort?.[sortBy] ?? "";
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * factor;
      return String(av).localeCompare(String(bv), lang === "sv" ? "sv" : "en") * factor;
    });
  }, [rows, sortBy, direction, lang]);

  function toggle(index: number) {
    if (sortBy === index) {
      setDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(index);
      setDirection("asc");
    }
  }

  const scrolls = rows.length > ROWS_BEFORE_STICKY;

  /*
    An empty result is a sentence, not an empty table. A header row with nothing
    under it reads as a table that failed to load; "no agreement matches the
    selected filters" is the answer the user's own filter produced. `aria-live`
    because the change happens without navigating.
  */
  if (rows.length === 0) {
    return (
      <p aria-live="polite" className="py-3 text-table text-muted-foreground">
        {empty ?? t.empty}
      </p>
    );
  }

  return (
    <div
      // Focusable and named: a scrollable region whose content is not itself
      // focusable cannot be reached by keyboard (WCAG 2.1.1).
      tabIndex={0}
      role="region"
      aria-label={caption}
      /*
        `relative` is load-bearing. `sr-only` positions absolutely, and an
        absolutely positioned descendant is clipped by `overflow` only when its
        containing block is inside the scroller. Without a positioned ancestor
        here, the hidden sort descriptions and the caption resolved against the
        page and sat at the table's full width — so a table wider than its
        column silently gave the whole document a horizontal scrollbar, on
        every route with a wide table, at every width below 1152px.
      */
      className={`relative overflow-auto ${scrolls ? "max-h-[34rem]" : ""}`}
    >
      <table className="w-full text-table" style={{ minWidth }}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="text-left text-label text-muted-foreground">
            {columns.map((column, i) => {
              const active = sortBy === i;
              const ariaSort = active
                ? direction === "asc"
                  ? "ascending"
                  : "descending"
                : undefined;

              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={ariaSort}
                  className={`sticky top-0 z-10 border-b border-border bg-card py-2 pr-4 font-semibold last:pr-0 ${
                    column.numeric ? "text-right" : ""
                  }`}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      className="inline-flex min-h-11 items-center gap-1 font-semibold text-muted-foreground hover:text-foreground"
                    >
                      {column.header}
                      {/*
                        The "sortable" glyph is the only thing telling a sighted
                        user this column can be ordered, so WCAG 1.4.11's 3:1
                        applies to it. At `opacity-40` it measured 1.91:1. The
                        active and inactive states stay distinguishable by shape
                        — a filled triangle against a double arrow — which is
                        the stronger signal anyway, and neither is now faint.
                      */}
                      <span className="flex h-4 items-center">
                        {active ? (
                          direction === "asc" ? (
                            <IconSortAsc size="sm" />
                          ) : (
                            <IconSortDesc size="sm" />
                          )
                        ) : (
                          <IconSortable size="sm" />
                        )}
                      </span>
                      <span className="sr-only">
                        {active
                          ? direction === "asc"
                            ? t.sortedAscending
                            : t.sortedDescending
                          : t.sortBy(column.header)}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr
              key={row.key}
              className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/60"
            >
              {row.cells.map((cell, i) => (
                <td
                  key={columns[i]?.key ?? i}
                  className={`py-3 pr-4 align-top last:pr-0 ${
                    columns[i]?.numeric ? "text-right tabular-nums" : ""
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
