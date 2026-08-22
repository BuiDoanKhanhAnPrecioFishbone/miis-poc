"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { COOKIE_MAX_AGE_SECONDS, WATCHWORD_COOKIE } from "@/lib/cookies";
import type { Lang } from "@/lib/domain/lang";
import { addWatchword, encodeWatchwords, type Watchword } from "@/lib/domain/watchword";
import { dictionary } from "@/lib/i18n";
import { DataTable, type Column, type Row } from "./DataTable";
import { IconPlus } from "./icons";
import { Badge, Button, Callout, FormGrid, Panel, Rationale, TextField } from "./primitives";

/**
 * FAI-004's table, maintained — §4.1's word is *anpassningsbar*.
 *
 * *"Systemet ska kunna markera och lyfta fram text i olika dokument utifrån en
 * **fördefinierad och anpassningsbar** tabell med bevakningsord."* Both
 * adjectives are requirements. The predefined half was here from the start; the
 * adaptable half was not, so Administration showed a table an administrator
 * could read and never change — on the one screen whose whole purpose is
 * maintaining things.
 *
 * The terms could already be *added* from a party meeting, which is where §4.1
 * says they come from (*"sådana som identifierats vid partsträffar"*). What was
 * missing is the other route: an administrator setting up the table ahead of a
 * bargaining round, before any meeting has been held.
 *
 * **MI's own terms cannot be removed here, and the row says so.** The table is
 * *fördefinierad och* anpassningsbar — a baseline MI maintains centrally, plus
 * what this authority adds around it — so removal applies to the additions.
 * An administrator who could silently drop a term from MI's own list would be
 * able to make a protocol stop lighting up with no record of why.
 *
 * The cookie is the transport, because `/registrera` and `/partstraffar` are
 * separate server renders that read the same table; `router.refresh()` is the
 * same mechanism the demo bar uses. In week 2 this is a row in `Bevakningsord`
 * and nothing above this line changes.
 */
/*
  Module scope on purpose. The React compiler's `immutability` rule refuses an
  assignment to anything declared outside the component body, and
  `document.cookie` is exactly that — the same helper the demo bar keeps for the
  same reason.
*/
function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}

export function WatchwordTable({
  watchwords,
  predefined,
  lang,
}: {
  /** The whole table as the server assembled it: MI's terms plus the added. */
  watchwords: Watchword[];
  /**
   * MI's own baseline, by term.
   *
   * Not `origin`: every row carries one, MI's included — the predefined terms
   * say *Fördefinierad* there. Testing `origin` therefore marked all four of
   * MI's terms as removable additions and labelled them *Tillagt*, which is
   * the opposite of what the table means.
   */
  predefined: string[];
  lang: Lang;
}) {
  const d = dictionary(lang);
  const t = d.administration.watchwords;
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [table, setTable] = useState(watchwords);
  const [term, setTerm] = useState("");
  const [note, setNote] = useState<string | null>(null);

  const isPredefined = (w: Watchword) => predefined.includes(w.term);

  /** Only the added ones travel in the cookie; MI's baseline is the code's. */
  function persist(next: Watchword[]) {
    const added = next.filter((w) => !isPredefined(w));
    setCookie(WATCHWORD_COOKIE, encodeWatchwords(added));
    setTable(next);
    startTransition(() => router.refresh());
  }

  function add() {
    const value = term.trim();
    if (!value) return;
    const next = addWatchword(table, value, t.addedHere);
    /* `addWatchword` refuses a duplicate silently, so say which happened. */
    setNote(next.length === table.length ? t.duplicate(value) : t.addedNote(value));
    setTerm("");
    persist(next);
  }

  function remove(value: string) {
    setNote(t.removedNote(value));
    persist(table.filter((w) => w.term !== value));
  }

  const columns: Column[] = [
    { key: "term", header: t.term, sortable: true },
    { key: "source", header: t.source, sortable: true },
    { key: "action", header: t.action },
  ];

  const rows: Row[] = table.map((w) => ({
    key: w.term,
    cells: [
      <span key="t" className="font-semibold">
        {w.term}
      </span>,
      <span key="s" className="flex flex-wrap items-center gap-2">
        <Badge tone={isPredefined(w) ? "neutral" : "attention"}>
          {isPredefined(w) ? t.predefined : t.added}
        </Badge>
        {/* Where an added term came from — a party meeting, or here. */}
        {!isPredefined(w) && w.origin && (
          <span className="text-label text-muted-foreground">{w.origin}</span>
        )}
      </span>,
      !isPredefined(w) ? (
        <Button key="a" size="sm" variant="danger" onClick={() => remove(w.term)}>
          {t.remove}
        </Button>
      ) : (
        /*
          Refused, and the reason on the control rather than a missing button.
          A blank cell would read as a row the table forgot about.
        */
        <Button key="a" size="sm" variant="danger" disabled disabledReason={t.predefinedLocked}>
          {t.remove}
        </Button>
      ),
    ],
    sort: [w.term, isPredefined(w) ? t.predefined : t.added, ""],
  }));

  return (
    <Panel title={t.heading} tags={["FAI-004"]}>
      <p className="mb-4 max-w-3xl text-table">{t.intro}</p>

      {note && (
        <div className="mb-4">
          <Callout tone="ok" live tags={["FAI-004", "FH-001"]}>
            {note}
          </Callout>
        </div>
      )}

      <div className="print-hide mb-5 border-b border-border pb-5">
        <FormGrid>
          <TextField
            id="ww-term"
            label={t.newTerm}
            hint={t.newTermHint}
            width="medium"
            value={term}
            onChange={setTerm}
            placeholder={t.newTermPlaceholder}
          />
        </FormGrid>
        <div className="mt-3">
          <Button
            onClick={add}
            iconStart={<IconPlus />}
            disabled={term.trim().length === 0}
            disabledReason={t.newTermRequired}
          >
            {t.add}
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        lang={lang}
        caption={t.heading}
        minWidth="34rem"
      />
      <Rationale>{t.note}</Rationale>
    </Panel>
  );
}
