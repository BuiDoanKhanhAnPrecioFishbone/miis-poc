import type { Metadata } from "next";

import { AppShell } from "@/components/miis/AppShell";
import { DataTable, type Column, type Row } from "@/components/miis/DataTable";
import {
  Callout,
  Field,
  PageHeading,
  Panel,
  Rationale,
} from "@/components/miis/primitives";
import {
  getCurrentBenchmark,
  listBenchmarkAgreements,
  listBenchmarks,
} from "@/lib/data/benchmark";
import { percent } from "@/lib/format";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const { i18n } = await getSession();
  const title = `${i18n.common.appName} – ${i18n.market.title}`;
  const description = i18n.market.subtitle;
  return { title, description, openGraph: { title, description } };
}

/**
 * Märket — FM-001, FM-002, FM-003, FA-012.
 *
 * Three panels, and the order is the argument. FM-001 registers Märket as a
 * **periodised setting**, so the screen leads with the period in force and
 * follows with the periods registered before it — a single figure could not
 * show that it is periodised at all. FM-002's alarm sits beside it, because the
 * thing it warns about is a gap in exactly that list of periods. FA-012 closes:
 * MI does not decide Märket, it reads it out of the norm-setting industry
 * agreements, so the screen names which agreements those are.
 *
 * The term stays *Märket* in both languages. It has no English equivalent, and
 * "the benchmark" would name something the reader could confuse with a target
 * MI had set.
 */
export default async function MarketPage() {
  const session = await getSession();
  const { i18n, lang } = session;
  const t = i18n.market;
  const [current, all, sources] = await Promise.all([
    getCurrentBenchmark(),
    listBenchmarks(),
    listBenchmarkAgreements(),
  ]);

  const historyColumns: Column[] = [
    { key: "period", header: t.history.period, sortable: true },
    { key: "validity", header: t.history.validity, sortable: true },
    { key: "costFrame", header: t.history.costFrame, numeric: true, sortable: true },
    { key: "periodisation", header: t.history.periodisation },
    { key: "months", header: t.history.months, numeric: true, sortable: true },
    { key: "registered", header: t.history.registered, sortable: true },
  ];

  const historyRows: Row[] = [...all]
    .sort((a, b) => b.validFrom.localeCompare(a.validFrom))
    .map((b) => ({
      key: b.id,
      cells: [
        b.period,
        <span key="v" className="tabular-nums">
          {b.validFrom} – {b.validTo}
        </span>,
        percent(b.costFramePercent, lang),
        b.periodisation,
        b.months,
        <span key="r" className="tabular-nums">
          {b.registeredDate}
        </span>,
      ],
      sort: [b.period, b.validFrom, b.costFramePercent, b.periodisation, b.months, b.registeredDate],
    }));

  const sourceColumns: Column[] = [
    { key: "name", header: t.sources.name, sortable: true },
    { key: "parties", header: t.sources.parties, sortable: true },
    { key: "period", header: t.sources.period, sortable: true },
    { key: "costFrame", header: t.sources.costFrame, numeric: true, sortable: true },
  ];

  const sourceRows: Row[] = sources.map((s) => ({
    key: s.id,
    cells: [
      s.name,
      s.parties,
      <span key="p" className="tabular-nums">
        {s.period}
      </span>,
      s.costFramePercent === undefined ? i18n.common.none : percent(s.costFramePercent, lang),
    ],
    sort: [s.name, s.parties, s.period, s.costFramePercent ?? 0],
  }));

  return (
    <AppShell role={session.role} dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      <PageHeading title={t.title} subtitle={t.subtitle} tags={["FM-001", "FM-002", "FM-003"]} />

      <div className="grid grid-cols-1 gap-5 @3xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <Panel title={t.current.heading} tags={["FM-001", "FM-003"]} tone="sand">
          {current ? (
            <>
              <p className="mb-4 max-w-3xl text-table text-sand-foreground">{t.current.intro}</p>
              <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2">
                <Field label={t.current.period} value={current.period} />
                <Field label={t.current.costFrame} value={percent(current.costFramePercent, lang)} />
                <Field label={t.current.periodisation} value={current.periodisation} />
                <Field label={t.current.months} value={String(current.months)} />
                <Field
                  label={t.current.supplementary}
                  value={
                    current.supplementaryAgreements.length > 0
                      ? current.supplementaryAgreements.join(" · ")
                      : i18n.common.none
                  }
                />
                <Field label={t.current.registered} value={current.registeredDate} />
              </div>
            </>
          ) : (
            <p className="text-table text-sand-foreground">{t.current.none}</p>
          )}
        </Panel>

        {/*
          FM-002 as a state rather than a promise. The alarm has a resting form —
          "everything is covered" — because a warning that only exists when it
          fires cannot be shown to an evaluator, and its absence is then
          indistinguishable from its not having been built.
        */}
        <Panel title={t.alarm.label} tags={["FM-002"]}>
          <Callout tone={current ? "ok" : "attention"} label={t.alarm.label}>
            {current ? t.alarm.covered : t.alarm.missing("2027–2029")}
          </Callout>
          <Rationale>{t.current.intro}</Rationale>
        </Panel>
      </div>

      <div className="mt-5">
        <Panel title={t.history.heading} tags={["FM-001"]}>
          <p className="mb-3 max-w-4xl text-table">{t.history.intro}</p>
          <DataTable
            columns={historyColumns}
            rows={historyRows}
            lang={lang}
            caption={t.history.heading}
            minWidth="52rem"
          />
        </Panel>
      </div>

      <div className="mt-5">
        <Panel title={t.sources.heading} tags={["FA-012"]}>
          <p className="mb-3 max-w-4xl text-table">{t.sources.intro}</p>
          {sourceRows.length === 0 ? (
            <p className="text-table text-muted-foreground">{t.sources.empty}</p>
          ) : (
            <DataTable
              columns={sourceColumns}
              rows={sourceRows}
              lang={lang}
              caption={t.sources.heading}
              minWidth="46rem"
            />
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
