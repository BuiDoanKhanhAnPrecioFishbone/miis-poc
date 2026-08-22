"use client";

import { useState } from "react";

import type { Benchmark } from "@/lib/domain/benchmark";
import type { Lang } from "@/lib/domain/lang";
import { percent } from "@/lib/format";
import { dictionary } from "@/lib/i18n";
import { EditablePanel } from "./EditablePanel";
import { IconPlus } from "./icons";
import { Button, Callout, Field, FormGrid, Panel, Rationale, TextField } from "./primitives";

/**
 * Registering Märket — FM-001, whose heading is the word *Registrering*.
 *
 * *"Systemet ska ha en funktion som gör det möjligt att **registrera** 'Märket'
 * som en periodiserad inställning med fritext för kostnadsram (%),
 * periodisering och tilläggsöverenskommelser."*
 *
 * The screen displayed a benchmark and had no way to enter one, which left a
 * ska-krav whose own title is a verb answered by a read-only panel. Every other
 * requirement in §5.10 depends on this one: FM-002's alarm fires when a period
 * has no definition, and the only way out of that state is to register the
 * definition. An alarm with no remedy is a dead end.
 *
 * **Periodiserad is the shape, not a detail.** Märket is not one setting that
 * gets overwritten — it is one per bargaining round, and the previous rounds
 * stay because the agreements signed under them are compared against the frame
 * that was in force at the time. So this registers a *new period* rather than
 * editing the old, and correcting the current one is a separate act.
 *
 * `costFramePercent` stays a number while periodisering and
 * tilläggsöverenskommelser are free text. FM-001's *"fritext för kostnadsram
 * (%), periodisering och tilläggsöverenskommelser"* can be read as making all
 * three free text; the agreement view compares a wage agreement's cost frame
 * against this figure, and a comparison against a string is not one. If MI
 * means the percentage literally as free text it is a change to one field, and
 * this comment is where to start.
 */

/** Fixed, so a screenshot taken twice is the same image. */
const TODAY = "2027-06-14";

export function BenchmarkAdmin({
  current,
  lang,
}: {
  current: Benchmark | undefined;
  lang: Lang;
}) {
  const d = dictionary(lang);
  const t = d.market;

  const [benchmark, setBenchmark] = useState(current);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const [period, setPeriod] = useState(benchmark?.period ?? "");
  const [from, setFrom] = useState(benchmark?.validFrom ?? "");
  const [to, setTo] = useState(benchmark?.validTo ?? "");
  const [frame, setFrame] = useState(
    benchmark?.costFramePercent === undefined ? "" : String(benchmark.costFramePercent),
  );
  const [periodisation, setPeriodisation] = useState(benchmark?.periodisation ?? "");
  const [supplementary, setSupplementary] = useState(
    (benchmark?.supplementaryAgreements ?? []).join(" · "),
  );
  const [months, setMonths] = useState(
    benchmark?.months === undefined ? "" : String(benchmark.months),
  );

  const num = (v: string) => {
    const n = Number(v.replace(/\s/g, "").replace(",", "."));
    return v.trim() === "" || Number.isNaN(n) ? undefined : n;
  };

  function fill(b: Benchmark | undefined) {
    setPeriod(b?.period ?? "");
    setFrom(b?.validFrom ?? "");
    setTo(b?.validTo ?? "");
    setFrame(b?.costFramePercent === undefined ? "" : String(b.costFramePercent));
    setPeriodisation(b?.periodisation ?? "");
    setSupplementary((b?.supplementaryAgreements ?? []).join(" · "));
    setMonths(b?.months === undefined ? "" : String(b.months));
  }

  /** What the form currently describes, as a `Benchmark`. */
  function fromForm(id: string): Benchmark {
    return {
      id,
      period: period.trim(),
      validFrom: from,
      validTo: to,
      costFramePercent: num(frame) ?? 0,
      periodisation: periodisation.trim(),
      supplementaryAgreements: supplementary
        .split("·")
        .map((x) => x.trim())
        .filter((x) => x.length > 0),
      registeredDate: TODAY,
      months: num(months) ?? 0,
    };
  }

  const complete = period.trim().length > 0 && from !== "" && to !== "" && num(frame) !== undefined;

  const fields = (mode: "read" | "write") =>
    mode === "read" ? (
      <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2 @3xl:grid-cols-3">
        <Field label={t.current.period} value={benchmark!.period} />
        {/* Displayed with its sign, the way the register's own table shows it. */}
        <Field
          label={t.current.costFrame}
          value={percent(benchmark!.costFramePercent, lang)}
          width="short"
        />
        <Field label={t.current.periodisation} value={benchmark!.periodisation} />
        <Field label={t.current.months} value={String(benchmark!.months)} width="short" />
        <Field
          label={t.current.supplementary}
          value={
            benchmark!.supplementaryAgreements.length > 0
              ? benchmark!.supplementaryAgreements.join(" · ")
              : d.common.none
          }
        />
        <Field label={t.current.registered} value={benchmark!.registeredDate} width="short" />
      </div>
    ) : (
      <FormGrid>
        <TextField
          id="bm-period"
          label={t.current.period}
          hint={t.admin.periodHint}
          width="medium"
          required
          lang={lang}
          value={period}
          onChange={setPeriod}
          placeholder={t.admin.periodPlaceholder}
        />
        <TextField
          id="bm-from"
          label={t.admin.validFrom}
          type="date"
          width="short"
          numeric
          value={from}
          onChange={setFrom}
        />
        <TextField
          id="bm-to"
          label={t.admin.validTo}
          type="date"
          width="short"
          numeric
          value={to}
          onChange={setTo}
        />
        {/*
          The unit moves into the label and the value stays a bare number — a
          box that already carries the sign makes the user decide whether to
          keep it, and "6,4 %" is a string no report can compare.
        */}
        {/*
          `medium`, not `short`, and only because it is required. A percentage
          is a short field by the house rule, but "Kostnadsram (%)" plus the
          *Obligatoriskt* tag needs about 205px and a short column is 192 — so
          the label row wrapped and pushed this one input 16px below the three
          beside it. A ragged row reads as a mistake; a slightly wide box for a
          number does not.
        */}
        <TextField
          id="bm-frame"
          label={t.admin.costFrameInput}
          width="medium"
          numeric
          required
          lang={lang}
          value={frame}
          onChange={setFrame}
        />
        <TextField
          id="bm-months"
          label={t.current.months}
          width="short"
          numeric
          value={months}
          onChange={setMonths}
        />
        {/* FM-001's free text, both of them. */}
        <TextField
          id="bm-periodisation"
          label={t.current.periodisation}
          hint={t.admin.periodisationHint}
          width="medium"
          value={periodisation}
          onChange={setPeriodisation}
          placeholder={t.admin.periodisationPlaceholder}
        />
        <TextField
          id="bm-supplementary"
          label={t.current.supplementary}
          hint={t.admin.supplementaryHint}
          width="full"
          value={supplementary}
          onChange={setSupplementary}
        />
      </FormGrid>
    );

  return (
    <>
      {benchmark ? (
        <EditablePanel
          title={t.current.heading}
          tags={["FM-001", "FM-003"]}
          tone="sand"
          intro={t.current.intro}
          lang={lang}
          editing={editing}
          savedAt={savedAt}
          canSave={complete}
          saveBlockedReason={t.admin.incomplete}
          onEdit={() => {
            fill(benchmark);
            setEditing(true);
            setAdding(false);
          }}
          onCancel={() => {
            fill(benchmark);
            setEditing(false);
          }}
          onSave={() => {
            setBenchmark(fromForm(benchmark.id));
            setSavedAt(TODAY);
            setEditing(false);
          }}
        >
          {fields(editing ? "write" : "read")}
        </EditablePanel>
      ) : (
        <Panel title={t.current.heading} tags={["FM-001", "FM-003"]}>
          <p className="text-table">{t.current.none}</p>
        </Panel>
      )}

      {/*
        A new period, not a correction of the old one.

        Märket is periodiserad — one per bargaining round — and the rounds that
        have been are what agreements signed under them are compared against.
        Overwriting the current definition would silently restate the frame
        every one of those agreements was measured by.
      */}
      <div className="mt-5">
        <Panel title={t.admin.newHeading} tags={["FM-001", "FM-002"]}>
          <p className="mb-4 max-w-3xl text-table">{t.admin.newIntro}</p>

          {note && (
            <div className="mb-4">
              <Callout tone="ok" live tags={["FM-001", "FH-001"]}>
                {note}
              </Callout>
            </div>
          )}

          {adding ? (
            <>
              {fields("write")}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  onClick={() => {
                    const next = fromForm(`BM-${from.slice(0, 4)}`);
                    setBenchmark(next);
                    setNote(t.admin.registered(next.period));
                    setAdding(false);
                  }}
                  disabled={!complete}
                  disabledReason={t.admin.incomplete}
                >
                  {t.admin.save}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    fill(benchmark);
                    setAdding(false);
                  }}
                >
                  {d.common.cancel}
                </Button>
              </div>
            </>
          ) : (
            <Button
              variant="secondary"
              iconStart={<IconPlus />}
              onClick={() => {
                fill(undefined);
                setAdding(true);
                setEditing(false);
              }}
            >
              {t.admin.open}
            </Button>
          )}
          <Rationale>{t.admin.note}</Rationale>
        </Panel>
      </div>
    </>
  );
}
