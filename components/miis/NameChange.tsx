"use client";

import { useState } from "react";

import type { Lang } from "@/lib/domain/lang";
import type { Party } from "@/lib/domain/party";
import { nameAtDate } from "@/lib/domain/party";
import { dictionary } from "@/lib/i18n";
import { Badge, Button, Callout, Field, Panel, Rationale, ReqTag } from "./primitives";

/**
 * FP-004, demonstrated rather than described.
 *
 * > Namnändring på en part ska kunna göras på ett ställe och automatiskt slå
 * > igenom i samtliga gällande avtal. Namnändringar ska inte slå igenom på
 * > historiska avtal.
 *
 * Registering a change here rewrites nothing. It appends an entry to the name
 * history with a validity date, and every name shown anywhere else is then
 * derived by asking `nameAtDate` what the party was called on the date that
 * matters — the agreement's own. That is why the historical column below does
 * not move when the change is applied: nothing propagated to it, because nothing
 * was ever copied into it in the first place.
 *
 * The same function is unit-tested at both period boundaries in
 * `lib/domain/party.test.ts`, which is the other half of the argument: the rule
 * is visible here and provable there.
 */

interface AgreementRef {
  id: string;
  name: string;
  validTo?: string;
}

export function NameChange({
  party,
  lang,
  today,
  current,
  historical,
}: {
  party: Party;
  lang: Lang;
  today: string;
  current: AgreementRef[];
  historical: AgreementRef[];
}) {
  const d = dictionary(lang);
  const t = d.parter.nameChange;
  const [history, setHistory] = useState(party.nameHistory);
  const [draft, setDraft] = useState("");
  const [from, setFrom] = useState("2027-07-01");
  const [applied, setApplied] = useState(false);

  const withChange: Party = { ...party, nameHistory: history };
  const nameToday = nameAtDate(withChange, applied ? from : today);

  function apply() {
    const value = draft.trim();
    if (!value) return;
    const previous = history[history.length - 1];
    setHistory([
      /* The outgoing name is closed the day before the new one starts. */
      ...history.slice(0, -1),
      ...(previous ? [{ ...previous, validTo: dayBefore(from) }] : []),
      { name: value, validFrom: from },
    ]);
    setApplied(true);
    setDraft("");
  }

  return (
    <Panel title={t.heading} tags={["FP-004", "FH-001"]}>
      <p className="mb-4 max-w-4xl text-table">{t.intro}</p>

      <h3 className="mb-2 font-display text-body font-semibold">{t.historyHeading}</h3>
      <ol className="mb-5 space-y-2 text-table">
        {history.map((n) => (
          <li key={`${n.name}-${n.validFrom}`} className="flex flex-wrap items-baseline gap-x-3">
            <span className="w-52 shrink-0 tabular-nums text-muted-foreground">
              {n.validFrom} – {n.validTo ?? ""}
            </span>
            <span className="font-semibold">{n.name}</span>
            {!n.validTo && <Badge tone="ok">{t.currentName}</Badge>}
            {n.note && <span className="text-label text-muted-foreground">{n.note}</span>}
          </li>
        ))}
      </ol>

      {/* One place — FP-004's own words. */}
      <div className="grid grid-cols-1 gap-4 border-t border-border pt-4 @xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto]">
        <div>
          <label htmlFor="new-name" className="mb-1 block text-label font-bold">
            {t.newName}
          </label>
          <input
            id="new-name"
            type="text"
            value={draft}
            placeholder={t.newNamePlaceholder}
            onChange={(e) => setDraft(e.target.value)}
            className="field-input"
          />
        </div>
        <div>
          <label htmlFor="new-name-from" className="mb-1 block text-label font-bold">
            {t.validFrom}
          </label>
          <input
            id="new-name-from"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="field-input tabular-nums"
          />
        </div>
        <div className="flex items-end">
          <Button
            onClick={apply}
            disabled={draft.trim().length === 0}
            disabledReason={t.nameRequired}
          >
            {t.apply}
          </Button>
        </div>
      </div>

      {applied && (
        <div className="mt-4">
          <Callout tone="ok" live tags={["FP-004", "FH-001"]}>
            {t.appliedNote(nameToday, current.length, historical.length)}
          </Callout>
        </div>
      )}

      {/*
        The two halves of the requirement, beside each other. Current agreements
        show the party as it is now; historical ones show it as it was when they
        were signed. Neither column was edited to make that true.
      */}
      <div className="mt-5 grid grid-cols-1 gap-5 @3xl:grid-cols-2">
        <div>
          <h3 className="mb-2 font-display text-body font-semibold">
            {t.currentHeading(current.length)}
          </h3>
          {current.length === 0 ? (
            <p className="text-table text-muted-foreground">{t.noAgreements}</p>
          ) : (
            <ul className="space-y-2 text-table">
              {current.map((a) => (
                <li key={a.id} className="border-t border-border pt-2 first:border-t-0 first:pt-0">
                  <span className="block">{a.name}</span>
                  <span className="text-label text-muted-foreground">
                    {t.showsAs} <strong className="text-foreground">{nameToday}</strong>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-label text-muted-foreground">{t.currentExplain}</p>
        </div>

        <div>
          <h3 className="mb-2 font-display text-body font-semibold">
            {t.historicalHeading(historical.length)}
          </h3>
          {historical.length === 0 ? (
            <p className="text-table text-muted-foreground">{t.noAgreements}</p>
          ) : (
            <ul className="space-y-2 text-table">
              {historical.map((a) => (
                <li key={a.id} className="border-t border-border pt-2 first:border-t-0 first:pt-0">
                  <span className="block">{a.name}</span>
                  <span className="text-label text-muted-foreground">
                    {t.showsAs}{" "}
                    <strong className="text-foreground">
                      {nameAtDate(withChange, a.validTo ?? today)}
                    </strong>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-label text-muted-foreground">{t.historicalExplain}</p>
          <ReqTag id="FP-004" />
        </div>
      </div>

      <Rationale>{t.derivedNote}</Rationale>
    </Panel>
  );
}

/** ISO date arithmetic without a Date, so the output cannot drift by a timezone. */
function dayBefore(iso: string): string {
  const [y, m, dd] = iso.split("-").map(Number) as [number, number, number];
  if (dd > 1) return `${y}-${pad(m)}-${pad(dd - 1)}`;
  if (m > 1) return `${y}-${pad(m - 1)}-${pad(daysIn(y, m - 1))}`;
  return `${y - 1}-12-31`;
}

const pad = (n: number) => String(n).padStart(2, "0");

function daysIn(year: number, month: number): number {
  const lengths = [31, isLeap(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return lengths[month - 1]!;
}

const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
