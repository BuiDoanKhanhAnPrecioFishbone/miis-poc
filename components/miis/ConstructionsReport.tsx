import { DataTable, type Column, type Row } from "./DataTable";
import { Button, Panel, Rationale, ReqTags } from "./primitives";
import { AGREEMENT_CONSTRUCTIONS, type AgreementConstruction } from "@/lib/domain/agreement";
import type { Lang } from "@/lib/domain/lang";
import type { ConstructionsReport as Report } from "@/lib/data/constructions";
import { amount, decimal } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n";

/**
 * MI's *Avtalskonstruktioner 2025*, rendered as an interface rather than
 * reproduced as a printout — Bilaga F, Rapport 2.
 *
 * The parts are MI's and in MI's order: the selection the report was taken
 * with, the two figures comparing every agreement against the selection, the
 * detail table, and the legend naming the seven constructions. The figures are
 * transcribed, never derived; see `lib/mock/constructions-report.ts` for why a
 * population report is the one table that must not come out of the mock
 * records.
 *
 * Server component. Nothing here is interactive except the export buttons.
 */

type SectorKey = "privat" | "offentlig" | "alla";
const SECTORS: SectorKey[] = ["privat", "offentlig", "alla"];

function Selection({ report, t }: { report: Report; t: Dictionary["rapporter"]["constructions"] }) {
  const s = report.selection;
  const items: [string, string][] = [
    [t.employerOrg, s.employerOrg],
    [t.employeeOrg, s.employeeOrg],
    [t.sector, s.sector],
    [t.centralOrg, s.centralOrg],
    [t.cooperationGroup, s.cooperationGroup],
    [t.employerGroup, s.employerGroup],
    [t.industryCode, s.industryCode],
  ];
  return (
    <div className="mb-5 border-b border-border pb-4">
      <h3 className="mi-kicker mb-2">{t.selectionHeading}</h3>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-1 text-label @xl:grid-cols-2 @3xl:grid-cols-3">
        {items.map(([term, value]) => (
          <div key={term} className="flex flex-wrap gap-x-2">
            <dt className="min-w-0 text-muted-foreground">{term}</dt>
            <dd className="min-w-0 font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** One of MI's two figures: a band with its agreement and employee counts. */
function Figure({
  heading,
  band,
  lang,
  t,
}: {
  heading: string;
  band: { agreements: number; agreementPercent: number; employees: number; employeePercent: number };
  lang: Lang;
  t: Dictionary["rapporter"]["constructions"];
}) {
  return (
    <div className="rounded-md border border-border bg-secondary p-4">
      <h4 className="mb-2 text-label font-bold">{heading}</h4>
      <p className="text-table font-semibold">{t.bandLocal}</p>
      <p className="text-label tabular-nums text-muted-foreground">
        {t.agreementCount(amount(band.agreements, lang), decimal(band.agreementPercent, lang))}
      </p>
      <p className="text-label tabular-nums text-muted-foreground">
        {t.employeeCount(amount(band.employees, lang), decimal(band.employeePercent, lang))}
      </p>
    </div>
  );
}

function rowsFor(rows: Report["samtliga"], lang: Lang, t: Dictionary["rapporter"]["constructions"]) {
  const out: Row[] = [];
  for (const r of rows) {
    const name =
      r.construction === "total"
        ? t.total
        : `${r.construction}. ${AGREEMENT_CONSTRUCTIONS[lang][r.construction as AgreementConstruction]}`;

    const group = (
      label: string,
      figures: Record<SectorKey, { count: number; percent: number }>,
      strong: boolean,
    ) => ({
      key: `${r.construction}-${label}`,
      cells: [
        <span key="n" className={strong ? "font-bold" : "pl-4 text-muted-foreground"}>
          {label}
        </span>,
        ...SECTORS.flatMap((s) => [
          <span key={`${s}c`} className={`tabular-nums ${strong ? "font-bold" : ""}`}>
            {amount(figures[s].count, lang)}
          </span>,
          <span key={`${s}p`} className={`tabular-nums ${strong ? "font-bold" : ""}`}>
            {decimal(figures[s].percent, lang)}
          </span>,
        ]),
      ],
      sort: [name, ...SECTORS.flatMap((s) => [figures[s].count, figures[s].percent])],
    });

    out.push(group(name, r.all, true));
    out.push(group(t.arbetare, r.arbetare, false));
    out.push(group(t.tjansteman, r.tjansteman, false));
  }
  return out;
}

export function ConstructionsReport({
  report,
  lang,
  d,
}: {
  report: Report;
  lang: Lang;
  d: Dictionary;
}) {
  const t = d.rapporter.constructions;

  const columns: Column[] = [
    { key: "construction", header: t.constructionColumn },
    { key: "pc", header: t.privat, numeric: true },
    { key: "pp", header: t.privatPercent, numeric: true },
    { key: "oc", header: t.offentlig, numeric: true },
    { key: "op", header: t.offentligPercent, numeric: true },
    { key: "ac", header: t.alla, numeric: true },
    { key: "ap", header: t.allaPercent, numeric: true },
  ];

  return (
    <Panel title={t.heading} tags={["FR-007", "FA-007"]}>
      <p className="mb-1 text-label text-muted-foreground">{t.printedAt(report.selection.printedAt)}</p>
      <Selection report={report} t={t} />

      <div className="mb-5 grid grid-cols-1 gap-4 @3xl:grid-cols-2">
        <Figure heading={t.figureAll} band={report.bands[0]!.samtliga} lang={lang} t={t} />
        <Figure heading={t.figureSelection} band={report.bands[0]!.urvalet} lang={lang} t={t} />
      </div>

      <h3 className="mb-2 font-display text-body font-semibold">{t.tableAll}</h3>
      <DataTable
        columns={columns}
        rows={rowsFor(report.samtliga, lang, t)}
        lang={lang}
        caption={t.tableAll}
        minWidth="52rem"
      />

      <h3 className="mt-6 mb-2 font-display text-body font-semibold">{t.tableSelection}</h3>
      <DataTable
        columns={columns}
        rows={rowsFor(report.urvalet, lang, t)}
        lang={lang}
        caption={t.tableSelection}
        minWidth="52rem"
      />

      <h3 className="mt-6 mb-2 font-display text-body font-semibold">{t.legendHeading}</h3>
      <ol className="space-y-0.5 text-label text-muted-foreground">
        {([1, 2, 3, 4, 5, 6, 7] as const).map((n) => (
          <li key={n}>
            {n}. {AGREEMENT_CONSTRUCTIONS[lang][n]}
          </li>
        ))}
      </ol>

      <Rationale>{t.sourceNote}</Rationale>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
        <span className="text-label font-bold">{d.common.exportLabel}</span>
        <Button variant="secondary" size="sm"
        disabled
        disabledReason={d.common.notInDemo}
      >
          Excel
        </Button>
        <Button variant="secondary" size="sm"
        disabled
        disabledReason={d.common.notInDemo}
      >
          CSV
        </Button>
        <Button variant="secondary" size="sm"
        disabled
        disabledReason={d.common.notInDemo}
      >
          PDF
        </Button>
        <ReqTags ids={["FR-004", "FR-005", "FR-013"]} />
      </div>
    </Panel>
  );
}
