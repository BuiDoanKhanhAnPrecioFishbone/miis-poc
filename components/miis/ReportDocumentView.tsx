import type { Lang } from "@/lib/domain/lang";
import type {
  ReportAgreement,
  ReportDocument,
  ReportDocumentLabels,
} from "@/lib/domain/report";
import { dictionary, type Dictionary } from "@/lib/i18n";
import { DataTable } from "./DataTable";
import { Callout, Panel,
  EmptyState,
} from "./primitives";

/**
 * A report's result, as a document.
 *
 * Bilaga 3 §7: *"För varje rapport visas urvalsbild och resultat."* This is the
 * resultat half for every report whose result is one record rather than a
 * population — §7.1 Huvudrapport, §7.3 Allmänheten, §7.4 Medlare — and it is
 * rendered here rather than by sending the officer to the register.
 *
 * **It decides nothing.** Every question about what may be read was answered by
 * `agreementDocument` on the server: a withheld value is absent from the
 * structure, not hidden by this component. That is the whole reason the document
 * is a data structure — FR-011 is about what may leave the building, and a
 * component that receives a value and chooses not to paint it has already let it
 * leave.
 *
 * Server-side by design: no hooks, no state. It is handed a finished document.
 */
export function ReportDocumentView({ doc, lang }: { doc: ReportDocument; lang: Lang }) {
  const d = dictionary(lang);

  if (doc.withheld) {
    return (
      <Panel title={doc.title} headingLevel={2} tags={["FR-011", "D-002"]}>
        {/*
          Named and refused, rather than absent. D-002 keeps the agreement
          listed and counted; telling the reader it does not exist would be a
          different and wrong answer.
        */}
        <Callout tone="attention" label={d.confidentiality.marked}>
          {doc.withheld[lang]}
        </Callout>
      </Panel>
    );
  }

  return (
    <div className="space-y-5">
      {doc.parts.map((part) => (
        <Panel key={part.heading.sv} title={part.heading[lang]} headingLevel={2}>
          {part.facts && (
            <dl className="grid grid-cols-1 gap-x-8 gap-y-3 @xl:grid-cols-2 @3xl:grid-cols-3">
              {part.facts.map((fact) => (
                <div key={fact.label.sv} className="border-b border-border pb-2">
                  <dt className="text-label font-bold text-muted-foreground">
                    {fact.label[lang]}
                  </dt>
                  {/* Nowrap so a date never breaks inside itself — the wrap
                      falls on the separator, not between 2027-04- and 01. */}
                  <dd className="mt-0.5 whitespace-nowrap text-table">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {part.table && (
            <DataTable
              lang={lang}
              caption={part.heading[lang]}
              columns={part.table.headers.map((h, i) => ({
                key: `c${i}`,
                header: h[lang],
                sortable: true,
              }))}
              rows={part.table.rows.map((row, i) => ({
                key: `r${i}`,
                cells: [...row],
                sort: [...row],
              }))}
            />
          )}

          {/* An empty part is a sentence. "Inget löneavtal registrerat" is a
              fact about the record; an empty table with a header on it is not. */}
          {part.note && <EmptyState text={part.note[lang]} />}
        </Panel>
      ))}
    </div>
  );
}

/**
 * The document's labels, in one language.
 *
 * `agreementDocument` is pure domain and cannot reach the dictionary, so the
 * caller resolves the words and the rule keeps deciding only what is in the
 * document. This is the same split `StatusDot` uses: the rule returns a shape,
 * the caller supplies the language.
 */
export function reportDocumentLabels(d: Dictionary): ReportDocumentLabels {
  const r = d.rapporter.document;
  return {
    none: d.common.none,
    yes: d.common.yes,
    no: d.common.no,
    withheld: r.withheld,
    identity: r.identity,
    rounds: r.rounds,
    noRounds: r.noRounds,
    lifecycle: r.lifecycle,
    scope: r.scope,
    agreement: r.agreement,
    employerOrg: r.employerOrg,
    employeeOrg: r.employeeOrg,
    agreementType: r.agreementType,
    sector: r.sector,
    industryCode: r.industryCode,
    signedDate: r.signedDate,
    validity: r.validity,
    year: r.year,
    construction: r.construction,
    wageScope: r.wageScope,
    costFrame: r.costFrame,
    period: r.period,
    expiresWithoutRenewal: r.expiresWithoutRenewal,
    earlyTermination: r.earlyTermination,
    terminated: r.terminated,
    employees: r.employees,
  };
}

/**
 * A report whose result is a population rather than one record.
 *
 * §7.5 (pension and other agreements) and FR-009/FR-010 (mi.se, Eurofound and
 * Minimilön) list which agreements the selection leaves. All three used to
 * produce nothing at all — a link and two *Steg 2* notices — which made the
 * catalogue a menu with items that were not on it.
 */
export function PopulationReport({
  lang,
  heading,
  note,
  rows,
}: {
  lang: Lang;
  heading: string;
  note: string;
  rows: readonly ReportAgreement[];
}) {
  const d = dictionary(lang);
  return (
    <Panel title={`${heading} · ${d.common.agreementCount(rows.length)}`} headingLevel={2}>
      <p className="field-hint mb-4">{note}</p>
      <DataTable
        lang={lang}
        caption={heading}
        empty={d.rapporter.document.emptyPopulation}
        columns={[
          { key: "name", header: d.rapporter.document.agreement[lang], sortable: true },
          { key: "employer", header: d.rapporter.document.employerOrg[lang], sortable: true },
          { key: "employee", header: d.rapporter.document.employeeOrg[lang], sortable: true },
          { key: "validity", header: d.rapporter.document.validity[lang], sortable: true },
        ]}
        rows={rows.map((a) => ({
          key: a.id,
          cells: [a.name, a.employerOrg, a.employeeOrg, a.validity],
          sort: [a.name, a.employerOrg, a.employeeOrg, a.validity],
        }))}
      />
    </Panel>
  );
}
