"use client";

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
  type ReportFormat,
} from "@/lib/domain/report";
import { agreementStatus } from "@/lib/domain/status";
import { dictionary } from "@/lib/i18n";
import { BargainingRoundReportView } from "./BargainingRoundReport";
import { ExpiryReportView } from "./ExpiryReport";
import { MediatorReleaseView } from "./MediatorRelease";
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

  return (
    <>
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
            {report.stage === 2 ? (
              <Button disabled disabledReason={t.stage2Reason}>
                {t.generate}
              </Button>
            ) : (
              <Button id="report-run" onClick={() => setGenerated(report.id)}>
                {t.generate}
              </Button>
            )}
            {format !== "pdf" && (
              <span className="text-label text-muted-foreground">{t.formatNote}</span>
            )}
          </div>
          <Rationale>{t.rationale}</Rationale>
        </Panel>
      </div>

      {generated === report.id && (
        <div id="rapportresultat" className="mt-5 scroll-mt-4">
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
          {report.id === "avtalskonstruktioner" && (
            <div className="mt-5">
              <Callout tone="attention" label={t.transcribedLabel}>
                {t.transcribed}
              </Callout>
            </div>
          )}

          <div className="mt-5">
            {report.result.kind === "inline" ? (
              report.result.component === "bargaining-round" ? (
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
              ) : (
                (results[report.result.component] ?? (
                  <Panel title={report.label[lang]}>
                    <p className="text-table text-muted-foreground">{t.notBuilt}</p>
                  </Panel>
                ))
              )
            ) : report.result.kind === "screen" ? (
              /*
                The selection has to reach the destination.

                Three of MI's own reports — Bilaga F's Rapport 1, 4 and 6 — are
                *one agreement*, and their criteria exist to say which. The
                button used to open the register regardless, so an officer who
                had just chosen Teknikavtalet arrived at a list of seventeen
                with the choice thrown away. `filterForReport` is the same
                narrowing the inline reports use; when it leaves exactly one
                agreement the button opens that agreement's own view, which
                *is* the printout — same data, same confidentiality rules,
                because it is the same page rather than a second rendering of
                it.
              */
              (() => {
                const matched = report.result.detailBase
                  ? filterForReport(agreements, values)
                  : [];
                const only = matched.length === 1 ? matched[0]! : undefined;
                return (
                  <Panel title={report.label[lang]} tags={report.requirements}>
                    <p className="max-w-4xl text-table">{t.onScreen}</p>
                    {report.result.detailBase && (
                      <p className="mt-2 max-w-4xl text-table">
                        {only
                          ? t.onScreenOne(only.name)
                          : matched.length === 0
                            ? t.onScreenNone
                            : t.onScreenMany(matched.length)}
                      </p>
                    )}
                    <div className="mt-4">
                      <LinkButton
                        href={
                          only && report.result.detailBase
                            ? `${report.result.detailBase}/${only.id}`
                            : report.result.href
                        }
                        iconEnd={<IconForward />}
                      >
                        {only ? t.openAgreement(only.name) : t.openView}
                      </LinkButton>
                    </div>
                  </Panel>
                );
              })()
            ) : (
              <Panel title={report.label[lang]} tags={report.requirements}>
                <Callout tone="attention" label={t.stage2}>
                  {t.stage2Reason}
                </Callout>
              </Panel>
            )}
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
