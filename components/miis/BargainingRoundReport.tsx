import type { Lang } from "@/lib/domain/lang";
import { monthShare, type BargainingMonthRow, type BargainingRoundReport } from "@/lib/domain/report";
import { statusInfo } from "@/lib/domain/status";
import { decimal } from "@/lib/format";
import { dictionary } from "@/lib/i18n";
import { Panel, Rationale, StatusDot } from "./primitives";

/**
 * Avtalsrörelserapporten — FR-006, after Bilaga F's Rapport 3.
 *
 * MI's own printout is two tables of twelve months and two bar charts: how many
 * agreements, and how many employees, fall due in each month of the year, split
 * into *kvarstående*, *nytecknade* and *nytecknade efter medling*. It is the
 * picture a bargaining round is read from — how much of the labour market is
 * open in April, and how much of it has been settled by now.
 *
 * **It is derived, not transcribed**, and that is the opposite choice from
 * Avtalskonstruktioner in the panel above. The construction report counts the
 * whole Swedish labour market and could never come out of a sample; this one
 * counts the agreements MI holds, which is exactly what the register is. Adding
 * an agreement to `lib/mock/agreements.ts` moves a bar here.
 *
 * The three series use FR-012's own colours and are labelled, because FR-012
 * says the colours mean something and a chart legend is not a label on a row.
 * The bars are CSS, not a chart library: three series over twelve months needs
 * a width and a background, and shipping a canvas renderer to draw thirty-six
 * rectangles would be the only external dependency on this screen.
 */

const MONTHS: Record<Lang, string[]> = {
  sv: [
    "Januari", "Februari", "Mars", "April", "Maj", "Juni",
    "Juli", "Augusti", "September", "Oktober", "November", "December",
  ],
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
};

const SHORT_MONTHS: Record<Lang, string[]> = {
  sv: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

/* The three series, in FR-012's own order and carrying its own status codes. */
const SERIES = [
  { key: "remaining", code: "remaining" },
  { key: "newlySigned", code: "newly-signed" },
  { key: "afterMediation", code: "after-mediation" },
] as const;

const BAR_FILL: Record<string, string> = {
  remaining: "bg-[var(--status-blue)]",
  "newly-signed": "bg-[var(--status-green)]",
  "after-mediation": "bg-[var(--status-red)]",
};

function total(row: BargainingMonthRow): number {
  return row.remaining + row.newlySigned + row.afterMediation;
}

function Half({
  lang,
  heading,
  intro,
  rows,
  totals,
  countLabel,
}: {
  lang: Lang;
  heading: string;
  intro: string;
  rows: BargainingMonthRow[];
  totals: BargainingMonthRow;
  countLabel: string;
}) {
  const t = dictionary(lang).rapporter.bargainingRound;
  const grandTotal = total(totals);
  const peak = Math.max(1, ...rows.map(total));

  return (
    <div className="min-w-0">
      <h3 className="font-display text-section font-semibold">{heading}</h3>
      <p className="mt-1 max-w-2xl text-label text-muted-foreground">{intro}</p>

      {/*
        A definition list per month rather than a table, because `DataTable`
        would give twelve rows six sortable columns and none of them is worth
        sorting: the month order *is* the information. The values stay tabular
        so the columns line up down the page.
      */}
      <table className="mt-4 w-full text-label">
        <caption className="sr-only">{heading}</caption>
        <thead>
          <tr className="text-left text-muted-foreground">
            <th scope="col" className="border-b border-border py-2 pr-3 font-semibold">
              {t.month}
            </th>
            {SERIES.map((s) => (
              <th
                key={s.key}
                scope="col"
                className="border-b border-border py-2 pr-3 text-right font-semibold"
              >
                {statusInfo(s.code, lang).label}
              </th>
            ))}
            <th scope="col" className="border-b border-border py-2 text-right font-semibold">
              {countLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const rowTotal = total(row);
            return (
              <tr key={row.month} className="border-b border-border/60">
                <th scope="row" className="py-1.5 pr-3 text-left font-normal">
                  {MONTHS[lang][i]}
                </th>
                {SERIES.map((s) => (
                  <td
                    key={s.key}
                    className="whitespace-nowrap py-1.5 pr-3 text-right tabular-nums"
                  >
                    {decimal(row[s.key], lang)}
                    <span className="ml-2 text-muted-foreground">
                      {decimal(monthShare(row[s.key], grandTotal), lang)} %
                    </span>
                  </td>
                ))}
                <td className="py-1.5 text-right font-semibold tabular-nums">
                  {decimal(rowTotal, lang)}
                </td>
              </tr>
            );
          })}
          <tr className="bg-secondary/60">
            <th scope="row" className="py-2 pr-3 text-left font-bold">
              {t.sum}
            </th>
            {SERIES.map((s) => (
              <td key={s.key} className="py-2 pr-3 text-right font-bold tabular-nums">
                {decimal(totals[s.key], lang)}
              </td>
            ))}
            <td className="py-2 text-right font-bold tabular-nums">{decimal(grandTotal, lang)}</td>
          </tr>
        </tbody>
      </table>

      {/*
        MI's own bar chart, as a stacked bar per month. `aria-hidden` because
        every value it shows is in the table directly above it — a chart that
        repeats a table needs no second reading for a screen reader, and giving
        it one would mean hearing the same thirty-six numbers twice.
      */}
      <div aria-hidden className="mt-5 flex items-end gap-1.5">
        {rows.map((row, i) => (
          <div key={row.month} className="flex min-w-0 flex-1 flex-col items-center gap-1">
            {/*
              A fixed track, and the segments size against it. Percentage
              heights need a definite containing block: with the column left to
              `flex-1` inside an `auto` parent the segments resolved to zero and
              the chart rendered as twelve month labels and nothing above them.
            */}
            <div className="flex h-32 w-full flex-col justify-end border-b border-border">
              {SERIES.map((s) =>
                row[s.key] > 0 ? (
                  <div
                    key={s.key}
                    className={BAR_FILL[s.code]}
                    style={{ height: `${Math.max(2, (row[s.key] / peak) * 100)}%` }}
                  />
                ) : null,
              )}
            </div>
            <span className="text-meta text-muted-foreground">{SHORT_MONTHS[lang][i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BargainingRoundReportView({
  report,
  lang,
}: {
  report: BargainingRoundReport;
  lang: Lang;
}) {
  const t = dictionary(lang).rapporter.bargainingRound;

  return (
    <Panel title={t.title(report.year)} tags={["FR-006", "FR-012", "FA-023"]}>
      <p className="mb-4 max-w-4xl text-table">{t.intro}</p>

      {/*
        The key, once, above both halves. FR-012's colours are the report's
        three series, and `StatusDot` carries the colour, the shape and the word
        together — which is the only reason a chart is allowed to use them.
      */}
      <div className="mb-6 flex flex-wrap gap-x-6 gap-y-2">
        {SERIES.map((s) => (
          <StatusDot key={s.key} status={statusInfo(s.code, lang)} showLabel />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 @5xl:grid-cols-2">
        <Half
          lang={lang}
          heading={t.byAgreement}
          intro={t.byAgreementIntro}
          rows={report.agreements}
          totals={report.agreementTotal}
          countLabel={t.agreements}
        />
        <Half
          lang={lang}
          heading={t.byEmployee}
          intro={t.byEmployeeIntro}
          rows={report.employees}
          totals={report.employeeTotal}
          countLabel={t.employees}
        />
      </div>

      <Rationale>{t.derivedNote}</Rationale>
    </Panel>
  );
}
