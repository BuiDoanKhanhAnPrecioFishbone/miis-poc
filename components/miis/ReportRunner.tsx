"use client";

import { ReportIntentAssistant } from "./IntentAssistant";
import type { ReportIntent } from "@/lib/domain/nl-intent";
import Link from "next/link";
import { useState, type ReactNode } from "react";

import type { Lang } from "@/lib/domain/lang";
import type { Role } from "@/lib/domain/role";
import {
  bargainingRoundReport,
  criteriaGroups,
  expiryReport,
  filterForReport,
  mediatorRelease,
  REPORT_FORMAT_LABEL,
  reportById,
  reportsForRole,
  selectionSummary,
  type ReportAgreement,
  type ReleaseDocument,
  type ReportCriterion,
  type ReportDocument,
  type ReportFormat,
} from "@/lib/domain/report";
import { agreementStatus } from "@/lib/domain/status";
import { dictionary } from "@/lib/i18n";
import { BargainingRoundReportView } from "./BargainingRoundReport";
import { ExpiryReportView } from "./ExpiryReport";
import { MediatorReleaseView } from "./MediatorRelease";
import { PrintButton, PrintHeader } from "./Print";
import { ReportDocumentView } from "./ReportDocumentView";
import { IconForward } from "./icons";
import {
  Badge,
  Button,
  Callout,
  FormGrid,
  LinkButton,
  Panel,
  Rationale,
  ReqTags,
  EmptyState,
} from "./primitives";
import { Select } from "./Select";

/**
 * Running a report — MI's *urvalsbild*, rebuilt.
 *
 * Bilaga F opens with the sentence this screen is built from: **"För varje
 * rapport visas urvalsbild och resultat."** In MI's current system a report is
 * never a button. It is: choose the report, fill in the criteria that report
 * takes, choose the format, press *Generera rapport* — and the printout then
 * repeats the criteria at the top, so a reader who was handed the paper knows
 * what population they are looking at.
 *
 * MIIS had four report panels with a Generate button each and no selection
 * anywhere, which is a reasonable reading of the FR table and a poor reading of
 * the appendix that shows what MI actually does forty times a year. The
 * criteria are read off MI's own screens; they differ per report, and that
 * difference is kept rather than flattened.
 *
 * **The options come from the register.** A criterion is not free text: MI's
 * own screen offers a closed list per criterion and defaults every one of them
 * to `---`, which prints as *Alla*. So an empty criterion is not a missing
 * value — it is the statement "this was not narrowed", and the printed
 * Urvalskriterier block says so on every line.
 */

export interface CriterionOptions {
  employers: string[];
  employees: string[];
  agreements: string[];
  sectors: { id: string; label: string }[];
  industryCodes: string[];
  employerCentralOrgs: string[];
  employeeCentralOrgs: string[];
  employerGroups: string[];
  cooperationGroups: string[];
  years: number[];
  /**
   * The year a year-taking report opens on — the busiest one, which is what a
   * bargaining round is. Opening on the newest year in the register showed
   * twelve rows of zeros, which reads as a broken report rather than an
   * empty year.
   */
  defaultYear: number;
  otherAgreementTypes: string[];
}

function optionsFor(
  criterion: ReportCriterion,
  o: CriterionOptions,
): { id: string; label: string }[] | null {
  const plain = (list: string[]) => list.map((v) => ({ id: v, label: v }));
  switch (criterion.kind) {
    case "party-employer":
      return plain(o.employers);
    case "party-employee":
      return plain(o.employees);
    case "agreement":
      return plain(o.agreements);
    case "sector":
      return o.sectors;
    case "industry-code":
      return plain(o.industryCodes);
    case "central-org-employer":
      return plain(o.employerCentralOrgs);
    case "central-org-employee":
      return plain(o.employeeCentralOrgs);
    case "employer-group":
      return plain(o.employerGroups);
    case "cooperation-group":
      return plain(o.cooperationGroups);
    case "other-agreement":
      return plain(o.otherAgreementTypes);
    case "year":
      return o.years.map((y) => ({ id: String(y), label: String(y) }));
    /* A checkbox in MI's own screen, so it has no option list. */
    case "pension-agreement":
      return null;
  }
}

export function ReportRunner({
  lang,
  options,
  results,
  agreementDocuments,
  agreements,
  documents,
  role,
  isExternal,
}: {
  lang: Lang;
  options: CriterionOptions;
  /** The report bodies this screen can render, keyed by `ReportResult.component`. */
  results: Record<string, ReactNode>;
  /**
   * One agreement as a document, per audience, keyed by the agreement's name —
   * which is what the *Avtal* criterion holds.
   *
   * Built on the server by `agreementDocument`, so a value the audience may not
   * read is **absent** rather than unpainted. That is the reason this crosses
   * the boundary as data instead of as a rendered node: the client picks which
   * finished document to show and decides nothing about its contents.
   */
  agreementDocuments: Record<string, { internal: ReportDocument; public: ReportDocument }>;
  /**
   * The register, reduced to what a selection can be applied to.
   *
   * It crosses the boundary because the criteria live here: filtering after
   * aggregating gives the wrong answer, so Avtalsrörelsen is aggregated in the
   * browser from the rows the selection leaves. Twelve months of three counts
   * is not a payload worth a round trip per dropdown.
   */
  agreements: ReportAgreement[];
  /**
   * The stored files, for Rapport 5's three document sections (Bilaga 3 §7.4).
   * Already narrowed to what may be released — the seam derives `confidential`
   * from the agreement, so this layer never has to.
   */
  documents: ReleaseDocument[];
  /**
   * The role, and whether it is one of the two §3.1 gives "Specifika rapporter".
   *
   * Mediators and the public computer see a named list rather than the
   * catalogue — Bilaga 3 §4.3 and §5.1 say which — so the picker is narrowed
   * here rather than by hiding options in the markup.
   */
  role: Role;
  isExternal: boolean;
}) {
  const d = dictionary(lang);
  const t = d.rapporter.runner;
  const available = reportsForRole(role, isExternal);
  const [reportId, setReportId] = useState(available[0]!.id);
  const [values, setValues] = useState<Record<string, string>>({
    year: String(options.defaultYear),
  });
  const [format, setFormat] = useState<ReportFormat>("pdf");
  const [generated, setGenerated] = useState<string | null>(null);

  const report = available.find((r) => r.id === reportId) ?? available[0]!;
  const groups = criteriaGroups(report, lang);

  /* Nine string comparisons; the React compiler memoizes what is worth memoizing. */
  const summary = selectionSummary(report, values, lang, t.all);

  /*
    Where the selection came down to exactly one agreement, the report can offer
    a way to the record itself. This used to *be* the result — press *Generera
    rapport* and receive a link — which is what made the report function feel
    unbuilt. It is a follow-up now: read the document, then go and correct it.

    `detailBase` is decided here rather than stored on the report, because it
    depends on the audience: an internal report opens the register, a released
    one opens the public view, and a role with neither gets no link at all.
  */
  const matched = filterForReport(agreements, values);
  const only = matched.length === 1 ? matched[0]! : undefined;
  const detailBase =
    report.result.component === "agreement-main"
      ? "/avtal"
      : report.result.component === "agreement-public"
        ? "/allmanheten"
        : undefined;

  function choose(id: string) {
    setReportId(id);
    /* A criterion belongs to the report it was chosen on. Carrying Sektor over
       from Avtalskonstruktioner into Huvudrapport, which has no Sektor, would
       leave a value in the printed selection that no control on screen shows.

       Årtal is the exception and is pre-filled: MI's own printouts are titled
       "Avtalskonstruktioner 2025" and "Avtalsrörelsen 2026", so a year is
       always chosen — there is no such thing as this report for "Alla" years. */
    const next = reportById(id);
    setValues(
      next?.criteria.some((c) => c.kind === "year") ? { year: String(options.defaultYear) } : {},
    );
    setGenerated(null);
  }

  /**
   * Approving a proposal sets the report and its criteria — and stops there.
   *
   * `available` has already decided what this role may run, so a refused report
   * never reaches here; the assistant states the refusal instead. What it sets
   * is the same thing the picker sets, so the officer carries on with the
   * controls they would have used by hand.
   */
  function applyIntent(intent: ReportIntent) {
    if (!intent.reportId) return;
    setReportId(intent.reportId);
    const next = reportById(intent.reportId);
    /* Årtal is pre-filled the way `choose` pre-fills it — MI's own printouts
       are titled "Avtalsrörelsen 2026", so this report has no "Alla" year. */
    const base: Record<string, string> = next?.criteria.some((c) => c.kind === "year")
      ? { year: String(options.defaultYear) }
      : {};
    setValues({
      ...base,
      ...Object.fromEntries(intent.criteria.map((c) => [c.id, c.value])),
    });
    setGenerated(null);
  }

  return (
    <>
      {/* Above the picker, because it proposes which report as well as what to
          select in it. `print-hide` with the picker, for the same reason. */}
      <div className="print-hide mb-5">
        <ReportIntentAssistant
          lang={lang}
          available={available.map((r) => r.id)}
          onApply={applyIntent}
        />
      </div>

      {/*
        The selection screen is on screen only. Bilaga F's own printouts are the
        *Urvalskriterier* block and the result — the picker is the control that
        produced them, and printing it makes the paper look like a screenshot of
        an application rather than the report MI hands over.
      */}
      <div className="print-hide">
        <Panel title={t.heading} tags={["FR-005", "FR-013"]}>
          <p className="mb-4 max-w-4xl text-table">{t.intro}</p>

          <FormGrid>
            <Select
              id="report-pick"
              width="full"
              label={t.pick}
              value={reportId}
              onChange={choose}
              options={available.map((r) => ({
                id: r.id,
                label: r.stage === 2 ? `${r.label[lang]} (${t.stage2})` : r.label[lang],
              }))}
            />
          </FormGrid>

          <div className="mt-4 flex flex-wrap items-start gap-3">
            <p className="min-w-0 max-w-3xl text-table">{report.produces[lang]}</p>
          </div>
          {/*
          The appendix badge first, the requirement tags after it: a hidden
          `ReqTag` still reserves its space so toggling the layer does not
          reflow the page, so putting them first pushed the badge into the
          middle of an empty row in the product view.
        */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {/* Which of MI's own printouts this is. Traceability rather than
                product copy, so it rides the requirement-ID layer with the
                tags beside it. */}
            {report.bilagaF && (
              <span className="req-tag">
                <Badge tone="neutral">{t.bilagaF(report.bilagaF)}</Badge>
              </span>
            )}
            <ReqTags ids={report.requirements} />
          </div>

          {/*
          The criteria, in MI's own order and MI's own grouping. The pension
          report splits them into three blocks and the others do not; keeping
          that distinction is the difference between a form built from the
          appendix and a form built from a guess.
        */}
          {report.criteria.length === 0 ? (
            <div className="mt-5">
              <Callout tone="ok" label={t.noSelectionLabel}>
                {t.noSelection}
              </Callout>
            </div>
          ) : (
            <div className="mt-5 space-y-5">
              {groups.map((group, i) => (
                <div key={group.group ?? `g${i}`}>
                  {group.group && (
                    <h3 className="mi-kicker mb-2 text-muted-foreground">{group.group}</h3>
                  )}
                  <FormGrid>
                    {group.criteria.map((criterion) => {
                      const list = optionsFor(criterion, options);
                      const key = `${report.id}-${criterion.id}`;
                      if (!list) {
                        /* Pensionsavtal is a yes/no in MI's screen. It is a closed
                         two-value choice rather than a switch, because it is
                         part of the query, not a flag on a record. */
                        return (
                          <Select
                            key={key}
                            id={key}
                            width="short"
                            label={criterion.label[lang]}
                            value={values[criterion.id] ?? ""}
                            onChange={(v) => setValues((s) => ({ ...s, [criterion.id]: v }))}
                            options={[
                              { id: "", label: t.all },
                              { id: d.common.yes, label: d.common.yes },
                              { id: d.common.no, label: d.common.no },
                            ]}
                          />
                        );
                      }
                      return (
                        <Select
                          key={key}
                          id={key}
                          width={criterion.kind === "year" ? "short" : "medium"}
                          label={criterion.label[lang]}
                          value={values[criterion.id] ?? ""}
                          onChange={(v) => setValues((s) => ({ ...s, [criterion.id]: v }))}
                          options={[{ id: "", label: t.all }, ...list]}
                        />
                      );
                    })}
                  </FormGrid>
                </div>
              ))}
            </div>
          )}

          {/*
          Format is FR-005's own list — Word, Excel, PDF at minimum — and the
          structured pair is FR-013, which is a bör-krav. Only PDF runs, because
          print is the only export that works without a server; the others say
          so on the control rather than failing quietly.
        */}
          <div className="mt-5">
            <FormGrid>
              <Select
                id="report-format"
                width="short"
                label={t.format}
                value={format}
                onChange={(v) => setFormat(v as ReportFormat)}
                options={report.formats.map((f) => ({
                  id: f,
                  label:
                    f === "pdf"
                      ? REPORT_FORMAT_LABEL[f]
                      : `${REPORT_FORMAT_LABEL[f]} — ${t.needsServer}`,
                }))}
              />
            </FormGrid>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {/*
              It runs for every report, including MI's two Steg 2 ones.

              *Generera rapport* was `disabled` on those with the reason "Steg
              2" — the same dead control this screen keeps growing, wearing a
              true fact as an excuse. The fact is about **delivery**: FR-009 and
              FR-010 are scheduled extracts MI receives in the second stage. The
              population is not a Steg 2 question at all, because the selection
              is a property the officer already sets on each agreement, so the
              report can show exactly which agreements it would carry. The
              staging is said on the result instead, where it belongs.
            */}
            <Button id="report-run" onClick={() => setGenerated(report.id)}>
              {t.generate}
            </Button>
            {format !== "pdf" && (
              <span className="text-label text-muted-foreground">{t.formatNote}</span>
            )}
          </div>
          <Rationale>{t.rationale}</Rationale>
        </Panel>
      </div>

      {generated === report.id && (
        <div id="rapportresultat" className="print-document mt-5 scroll-mt-4">
          {/*
            The document's own letterhead — the mark and the *Utskriftsdatum och
            tid* Bilaga 3 §7 names for MI's report header, plus the report's
            name, which is what tells a reader on paper which of the ten they
            are holding.

            It lives inside the document rather than in the shell because the
            print rule lifts the document out on its own: what is not inside it
            does not reach the paper, and a report with no title and no date
            would be a table nobody could file.
          */}
          <PrintHeader lang={lang} title={report.label[lang]} />
          {/*
            The printed Urvalskriterier block, above the result and inside the
            print. MI's own reports carry it on every page; ours carries it once
            at the head, because a web page has one head and six pages of paper
            do not.
          */}
          <Panel title={t.selectionHeading} headingLevel={2}>
            <dl className="grid grid-cols-1 gap-x-8 gap-y-2 @xl:grid-cols-2 @3xl:grid-cols-3">
              {summary.map((row) => (
                <div key={row.label} className="flex flex-wrap gap-x-2 text-label">
                  <dt className="font-bold">{row.label}:</dt>
                  <dd className={row.value === t.all ? "text-muted-foreground" : ""}>
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>

          {/*
            Where the figures are MI's own rather than the register's, the
            screen says so. Avtalskonstruktioner counts 3,8 million employees
            across the whole labour market; a selection screen above a
            transcription that silently ignores it would be the one thing a
            report about data accuracy must not do.
          */}
          {report.stage === 2 && (
            <div className="mt-5">
              <Callout tone="attention" label={t.stage2}>
                {t.stage2Reason}
              </Callout>
            </div>
          )}

          {report.id === "avtalskonstruktioner" && (
            <div className="mt-5">
              <Callout tone="attention" label={t.transcribedLabel}>
                {t.transcribed}
              </Callout>
            </div>
          )}

          <div className="mt-5">
            {report.result.component === "bargaining-round" ? (
                /*
                  Aggregated here, from the rows the selection left. This is the
                  difference between a selection screen and a picture of one: a
                  criterion that changes the printed Urvalskriterier and not the
                  table underneath is a control that looks live and is not.
                */
                <BargainingRoundReportView
                  lang={lang}
                  report={bargainingRoundReport(
                    filterForReport(agreements, values),
                    Number(values["year"] ?? "") || options.defaultYear,
                    (a) => agreementStatus(a),
                  )}
                />
              ) : report.result.component === "mediator-release" ? (
                /*
                  §7.4 takes one agreement, so the release is built from the
                  *Avtal* criterion rather than from the whole filtered set. If
                  the officer has not chosen one — or has chosen one that is
                  sekretessmarkerat or not in force — the report says which,
                  rather than printing an empty page.
                */
                <MediatorReleaseView
                  lang={lang}
                  notReleasable={values["agreement"] ? t.notReleasable : t.chooseAgreement}
                  release={(() => {
                    const chosen = agreements.find((a) => a.name === values["agreement"]);
                    if (!chosen) return null;
                    return mediatorRelease(chosen, documents, agreements);
                  })()}
                />
              ) : report.result.component === "expiry" ? (
                <ExpiryReportView
                  lang={lang}
                  report={expiryReport(
                    filterForReport(agreements, values),
                    Number(values["year"] ?? "") || options.defaultYear,
                  )}
                />
              ) : report.result.component === "agreement-main" ||
                report.result.component === "agreement-public" ? (
                /*
                  §7.1 and §7.3 — one agreement, as a document.

                  These used to be `kind: "screen"`: pressing *Generera rapport*
                  handed the officer a link to the register or to the public
                  view. The reasoning was that the agreement's own view already
                  *is* the printout and rendering it twice risked two places
                  disagreeing about one confidentiality rule — sound, and still
                  wrong, because a report function whose result is a link to a
                  list is not a report function. The rule still runs once; it
                  runs on the server and hands down a finished document.
                */
                (() => {
                  const chosen = values["agreement"];
                  const pair = chosen ? agreementDocuments[chosen] : undefined;
                  if (!pair) {
                    return (
                      <Panel title={report.label[lang]} headingLevel={2}>
                        <EmptyState text={t.chooseAgreement} />
                      </Panel>
                    );
                  }
                  const doc =
                    report.result.component === "agreement-public" ? pair.public : pair.internal;
                  return <ReportDocumentView doc={doc} lang={lang} />;
                })()
              ) : (
                (results[report.result.component] ?? (
                  <Panel title={report.label[lang]}>
                    <EmptyState text={t.notBuilt} />
                  </Panel>
                ))
            )}

            {/*
              The report opens on the record it produced, where there is one.

              Not as the result — that was the defect — but underneath it, so an
              officer who has read the document can go and correct it. The link
              appears only for a role that may read the screen it points at, and
              only when the selection came down to one agreement.
            */}
            <div className="print-hide mt-5 flex flex-wrap items-center gap-3">
              {/* The print belongs beside the result it prints, not only in the
                  page heading forty rows up: the officer decides to keep the
                  document while reading it. */}
              <PrintButton lang={lang} />
              {only && detailBase && (
                <LinkButton href={`${detailBase}/${only.id}?fran=rapport`} iconEnd={<IconForward />}>
                  {t.openAgreement(only.name)}
                </LinkButton>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** A quiet link out of the report list, used where a report lives on its own screen. */
export function ReportLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-1 text-label font-semibold text-primary underline underline-offset-2"
    >
      {children}
    </Link>
  );
}
