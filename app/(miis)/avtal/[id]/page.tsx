import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  AgreementBasicFactsPanel,
  LimitedSectionPanel,
  ReportSelectionPanel,
  SpecialQuestionsPanel,
} from "@/components/miis/AgreementRecord";
import {
  AgreementIdentity,
  AgreementPublication,
  AgreementScope,
  RegistrationCompletion,
} from "@/components/miis/AgreementAdmin";
import { AppShell } from "@/components/miis/AppShell";
import { DataTable, type Column, type Row } from "@/components/miis/DataTable";
import { IconBack } from "@/components/miis/icons";
import { PrintButton } from "@/components/miis/Print";
import { SectionTabs } from "@/components/miis/SectionTabs";
import { WageAgreementAdmin } from "@/components/miis/WageAgreementAdmin";
import {
  Badge,
  Callout,
  ConfidentialityMarker,
  Field,
  PageHeading,
  Panel,
  Rationale,
  StatusDot,
  EmptyState,
} from "@/components/miis/primitives";
import { getAgreementDetail } from "@/lib/data/agreements";
import { countAgreementProtocols } from "@/lib/data/documents";
import {
  AGREEMENT_CONSTRUCTIONS,
  agreementTitle,
  isSectionLimited,
  registrationStatusLabel,
  validityLabel,
} from "@/lib/domain/agreement";
import { EVENT_TYPE_LABEL } from "@/lib/domain/event";
import { maySeeConfidential } from "@/lib/domain/role";
import { agreementStatus } from "@/lib/domain/status";
import { amount, percent } from "@/lib/format";
import { getSession } from "@/lib/session";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const [{ id }, { i18n }] = await Promise.all([params, getSession()]);
  const detail = await getAgreementDetail(id);
  if (!detail) return { title: `${i18n.common.appName} – ${i18n.avtal.title}` };
  const title = agreementTitle(detail.agreement);
  return {
    title: `${i18n.common.appName} – ${title}`,
    description: i18n.avtal.subtitle,
    openGraph: { title, description: i18n.avtal.subtitle },
  };
}

/**
 * One agreement — FA-001 to FA-004, FA-007 to FA-016, FR-012.
 *
 * The register's detail, and the reason the register's rows are links. It shows
 * the three things MI's model keeps apart and the interface kept collapsing:
 * the agreement itself, the **wage agreements** that hang off it one per
 * bargaining round (FA-002), and the lifecycle facts that decide whether it
 * needs attention (FA-015, FA-016).
 *
 * The wage agreements are a table rather than a stack of panels because their
 * whole point is comparison across rounds — the construction, the scope and the
 * cost frame for this round set against the last.
 */
export default async function AgreementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, session] = await Promise.all([params, getSession()]);
  const { i18n, lang } = session;
  const detail = await getAgreementDetail(id);
  if (!detail) notFound();

  const { agreement, wageAgreements, workingGroups, specialQuestions, events } = detail;
  /* FD-001 — one of the five things the registration checklist can answer. */
  const protocolCount = await countAgreementProtocols(id);
  const t = i18n.avtal.detail;
  const status = agreementStatus(agreement, lang);
  const latest = wageAgreements[0];

  /*
    Informationsbegränsning (Bilaga 3 §3.3) needs both halves: the record says
    *what* is restricted, `maySeeConfidential` says *who* may read it. Resolved
    here, on the server, so the restricted section is never in the document —
    FR-011 and D-002 are enforced in the markup, not the stylesheet.
  */
  const mayReadLimited = maySeeConfidential(session.role.id);
  const hideWorkingGroups = !mayReadLimited && isSectionLimited(agreement, "workingGroups");
  const hideMinimumWages = !mayReadLimited && isSectionLimited(agreement, "minimumWages");

  const wageColumns: Column[] = [
    { key: "period", header: t.period, sortable: true },
    { key: "construction", header: t.construction },
    { key: "scope", header: t.scope, numeric: true, sortable: true },
    { key: "costFrame", header: t.costFrame, numeric: true, sortable: true },
    { key: "guarantee", header: t.guarantee },
    { key: "revision", header: t.revision },
  ];

  const wageRows: Row[] = wageAgreements.map((w) => ({
    key: w.id,
    cells: [
      /* Each date whole, the break allowed only between them. The cell was
         wrapping *inside* a date — "2027-04-" / "01 – 2029-" / "03-31" — which
         no reader can take in at a glance, and this row exists to be compared
         with the one above it. Nowrapping the whole period instead would push
         the table 64px past its column and put it back behind a scrollbar. */
      <span key="p" className="tabular-nums">
        <span className="whitespace-nowrap">{w.validFrom}</span> –{" "}
        <span className="whitespace-nowrap">{w.validTo}</span>
      </span>,
      `${w.construction}. ${AGREEMENT_CONSTRUCTIONS[lang][w.construction]}`,
      w.wageScopePercent === undefined ? i18n.common.none : percent(w.wageScopePercent, lang),
      w.costFramePercent === undefined ? i18n.common.none : percent(w.costFramePercent, lang),
      w.individualGuarantee ? i18n.common.yes : i18n.common.no,
      w.wageRevision ? (
        /* Same rule as the period: the date stays whole, the break falls at
           the separator. This cell was reading "2027-04-" / "01 · 3,2 %". */
        <span key="r" className="tabular-nums">
          <span className="whitespace-nowrap">{w.wageRevision.date}</span> ·{" "}
          <span className="whitespace-nowrap">{percent(w.wageRevision.percent, lang)}</span>
        </span>
      ) : (
        i18n.common.none
      ),
    ],
    sort: [
      w.validFrom,
      w.construction,
      w.wageScopePercent ?? 0,
      w.costFramePercent ?? 0,
      w.individualGuarantee ? "1" : "0",
      w.wageRevision?.date ?? "",
    ],
  }));

  const minimumWages = latest?.minimumWages ?? [];
  const minColumns: Column[] = [
    { key: "group", header: t.occupationalGroup, sortable: true },
    { key: "amount", header: t.amount, numeric: true, sortable: true },
    { key: "date", header: t.revisionDate, sortable: true },
  ];
  const minRows: Row[] = minimumWages.map((m) => ({
    key: m.occupationalGroup,
    cells: [
      m.occupationalGroup,
      <span key="a" className="tabular-nums">
        {amount(m.amountSekPerMonth, lang)}
      </span>,
      <span key="d" className="tabular-nums">
        {m.revisionDate}
      </span>,
    ],
    sort: [m.occupationalGroup, m.amountSekPerMonth, m.revisionDate],
  }));

  return (
    <AppShell
      walkthrough={session.walkthrough}
      role={session.role}
      requires="avtal"
      dataset={session.dataset}
      lang={lang}
      reqTags={session.reqTags}
    >
      <PageHeading
        title={agreementTitle(agreement)}
        back={
          <Link
            href="/avtal"
            className="inline-flex min-h-11 items-center gap-1 text-label font-semibold text-primary underline underline-offset-2"
          >
            <IconBack /> {i18n.common.backTo(i18n.avtal.title)}
          </Link>
        }
        tags={["FA-001", "FA-002", "FR-012"]}
        action={
          /*
            Bilaga 1 §3.1: "Registrerar och redigerar avtalsinformation" — the detail
            showed only the first half, so an agreement could be read and never
            corrected. Inert here because editing needs a store the mockup does
            not have; the point is that the capability is visible and named
            rather than silently absent.
          */
          /* The edit lives with the values it changes, in the panel below —
             a header button that opened a second screen would make the officer
             remember what the record said. */
          <PrintButton lang={lang} />
        }
      />

      {/*
        A fixed sidebar, not a fraction.

        `0.85fr` gave the short facts — status, flags, lifecycle, basfakta,
        rapporturval — 46 % of the page, and left the wage-agreement table,
        which is six columns and the substance of the screen, scrolling inside
        a 618px column at 1440. The sidebar is one value per row and does not
        get better with more width; the table does. 20rem holds its longest
        label, gives the table 738px at 1440 — enough to fit whole — and below
        `@3xl` both stack as before. Narrower than 1440 the table still scrolls
        inside its own region, which is the overflow guard working rather than
        columns collapsing to slivers.
      */}
      <div className="print-stack grid grid-cols-1 gap-5 @3xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">
          {/*
            Three jobs, one at a time.

            The record had grown to nine panels in one column, and an officer
            who came to check a lägstalön scrolled past five of them. `CLAUDE.md`
            named this screen as the *stacking* case, on the reading that an
            agreement is one subject read in order. That is true of the
            printout and had stopped being true of the screen: Bilaga F's
            Rapport 4 is a document read start to finish, and this is a
            workbench.

            The grouping is by what an officer came to do. **Avtalet** is the
            record itself — who the agreement is between and how big it is.
            **Löneavtal** is what the bargaining round produced, the row per
            avtalsrörelse and the lägstalöner under it. **Frågor och grupper**
            is what the round left open, which is why an agreement that looks
            finished is not.

            **The sidebar stays outside the tabs**, and so does the event log.
            Status, publication, Märket and the validity period are the facts
            every one of these jobs is done against; a tab that hid them would
            have the officer switching back to check what they were editing.
          */}
          <SectionTabs
            label={t.tabs.label}
            lang={lang}
            sections={[
              {
                id: "avtalet",
                label: t.tabs.record,
                node: (
                  <>
                  {/*
                    Bilaga 2 §3.5, Scenario 2 — *"lägger till eller uppdaterar
                    information kopplad till avtalet"* — happens **in** the record now,
                    not in a panel underneath it. There is no longer a second copy of
                    the agreement's name on this page, and what can be corrected is no
                    longer whatever one panel happened to hold. See `EditablePanel`.
                  */}
                  <AgreementIdentity agreement={agreement} lang={lang} />

                  <AgreementScope agreement={agreement} lang={lang} />
                  </>
                ),
              },
              {
                id: "loneavtal",
                label: t.tabs.pay,
                node: (
                  <>
                  {/*
                    Bilaga 1 §3.1 — *"Registrerar och redigerar avtalsinformation"*
                    and §3.1 gives this role the verb twice. The tab held two
                    tables and not one control, so the versions could be read and
                    never corrected — and a löneutrymme read off a scanned
                    protocol under time pressure is the figure most likely to be
                    wrong in the whole register.
                  */}
                  {wageRows.length === 0 ? (
                    <Panel title={t.wageAgreements} tags={["FA-002", "FA-007"]}>
                      <p className="mb-3 max-w-4xl text-table">{t.wageIntro}</p>
                      <EmptyState text={t.noWageAgreements} />
                    </Panel>
                  ) : (
                    <WageAgreementAdmin
                      lang={lang}
                      rounds={wageAgreements.map((w) => ({
                        id: w.id,
                        validFrom: w.validFrom,
                        validTo: w.validTo,
                        construction: w.construction,
                        ...(w.wageScopePercent !== undefined
                          ? { wageScopePercent: w.wageScopePercent }
                          : {}),
                        ...(w.costFramePercent !== undefined
                          ? { costFramePercent: w.costFramePercent }
                          : {}),
                        individualGuarantee: w.individualGuarantee,
                      }))}
                      /* The revision is MI's own recorded figure rather than
                         something this form sets, so it is handed down already
                         formatted and stays read-only on the row. */
                      hasRevision={Object.fromEntries(
                        wageAgreements
                          .filter((w) => w.wageRevision)
                          .map((w) => [
                            w.id,
                            `${w.wageRevision!.date} · ${percent(w.wageRevision!.percent, lang)}`,
                          ]),
                      )}
                    />
                  )}

                  {hideMinimumWages ? (
                    <LimitedSectionPanel title={t.minimumWages} lang={lang} tags={["FA-013"]} />
                  ) : (
                    minRows.length > 0 && (
                      <Panel title={t.minimumWages} tags={["FA-013"]}>
                        <p className="mb-3 max-w-4xl text-table">{t.minimumWagesIntro}</p>
                        <DataTable
                          columns={minColumns}
                          rows={minRows}
                          lang={lang}
                          caption={t.minimumWages}
                          minWidth="34rem"
                        />
                      </Panel>
                    )
                  )}
                  </>
                ),
              },
              {
                id: "fragor",
                label: t.tabs.open,
                node: (
                  <>
                  {/*
                    FA-014. This is also where Bilaga B's `Särskilda frågor` lands: the
                    current system keeps it as a document type of its own, and MI's
                    requirement folds it into the group that owns the question.
                  */}
                  {hideWorkingGroups ? (
                    <LimitedSectionPanel title={t.workingGroups} lang={lang} tags={["FA-014"]} />
                  ) : (
                    <Panel title={t.workingGroups} tags={["FA-014"]}>
                      <p className="mb-3 max-w-4xl text-table">{t.workingGroupsIntro}</p>
                      {workingGroups.length === 0 ? (
                        <EmptyState text={t.noWorkingGroups} />
                      ) : (
                        <ul className="space-y-4">
                          {workingGroups.map((g) => (
                            <li
                              key={g.id}
                              className="border-t border-border pt-3 first:border-t-0 first:pt-0"
                            >
                              <p className="font-semibold">{g.name}</p>
                              <p className="mt-1 text-table">
                                <span className="text-label font-bold">{t.subjectAreas}: </span>
                                {g.subjectAreas.join(" · ")}
                              </p>
                              {g.reportsBy && (
                                <p className="mt-1 text-label text-muted-foreground">
                                  {t.reportsBy} <span className="tabular-nums">{g.reportsBy}</span>
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </Panel>
                  )}

                  {/* §3.11's three numbered slots — a question the agreement text
                      answers, which is not the same thing as a working group. */}
                  <SpecialQuestionsPanel sets={specialQuestions} lang={lang} />
                  </>
                ),
              },
            ]}
          />
        </div>

        <div className="print-first space-y-5">
          {/*
            FR-012 leads the sidebar because it is the one fact every other view
            of this agreement shows too — the register, the search results and
            the reports all colour it by this.
          */}
          <Panel title={t.statusHeading} tags={["FR-012", "FA-021"]} headingLevel={2}>
            <div className="space-y-3">
              <StatusDot status={status} showLabel />
              {/*
                FA-021's state *and* the act that changes it, in one component.
                This was a read-only badge, and nothing anywhere could move the
                registration to *Klar* — so `mayPublish` refused every agreement
                the officer had registered themselves, naming a control that did
                not exist.
              */}
              <RegistrationCompletion
                agreement={agreement}
                wageAgreementCount={wageAgreements.length}
                protocolCount={protocolCount}
                lang={lang}
              />
              <p className="text-table tabular-nums">{validityLabel(agreement, lang)}</p>
              {agreement.confidential && (
                <ConfidentialityMarker
                  label={i18n.confidentiality.marked}
                  note={i18n.confidentiality.inStatistics}
                />
              )}
            </div>
          </Panel>

          {/*
            Publication sits beside the status it changes, not inside a panel
            about correcting typos. *Is this out yet?* is a question a reader
            asks while looking at FR-012's status and the validity period, so
            the answer and the act belong in the same column.
          */}
          <AgreementPublication agreement={agreement} lang={lang} />

          {latest && (
            <Panel title={t.flags} tags={["FA-011", "FA-012"]} tone="sand">
              <ul className="space-y-2 text-table text-sand-foreground">
                <li>
                  {t.equality}: {latest.genderEqualityFlag ? i18n.common.yes : i18n.common.no}
                </li>
                <li>
                  {t.benchmark}: {latest.industryBenchmark ? i18n.common.yes : i18n.common.no}
                </li>
              </ul>
            </Panel>
          )}

          <Panel title={t.lifecycle} tags={["FA-015", "FA-016", "FA-017"]}>
            {agreement.expiresWithoutRenewal || agreement.earlyTermination ? (
              <div className="space-y-3">
                {agreement.expiresWithoutRenewal && (
                  <Callout tone="attention" tags={["FA-015"]}>
                    {t.expires}
                  </Callout>
                )}
                {agreement.earlyTermination && (
                  <Callout tone="attention" tags={["FA-016"]}>
                    {t.earlyTermination}: {agreement.earlyTermination.date} ·{" "}
                    {agreement.earlyTermination.party}
                  </Callout>
                )}
              </div>
            ) : (
              <EmptyState text={t.noLifecycle} />
            )}
            {agreement.mediationLinked && (
              <div className="mt-3">
                <Badge tone="attention">{t.mediation}</Badge>
              </div>
            )}
            <Rationale>{i18n.avtal.register.areaNote}</Rationale>
          </Panel>

          <AgreementBasicFactsPanel agreement={agreement} lang={lang} />
          <ReportSelectionPanel agreement={agreement} lang={lang} />
        </div>
      </div>

      {/*
        FH-002 — *"an event log for high-level events linked to an agreement"*.
        Mandatory, Stage 1, and the mediation case had one while the agreement
        it concerns did not.
      */}
      <div className="mt-5">
        <Panel title={t.eventLog} tags={["FH-002"]}>
          <p className="mb-3 max-w-4xl text-table">{t.eventLogIntro}</p>
          {events.length === 0 ? (
            <EmptyState text={t.noEvents} />
          ) : (
            <ul className="divide-y divide-border">
              {events.map((e) => (
                <li key={e.id} className="flex flex-wrap gap-x-3 py-2.5 text-table">
                  <span className="tabular-nums text-muted-foreground">{e.timestamp}</span>
                  <span className="font-semibold">{EVENT_TYPE_LABEL[lang][e.type]}</span>
                  <span className="min-w-0">{e.detail}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
