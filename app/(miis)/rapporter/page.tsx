import type { Metadata } from "next";

import { AppShell } from "@/components/miis/AppShell";
import { ConstructionsReport } from "@/components/miis/ConstructionsReport";
import { DataTable, type Column, type Row } from "@/components/miis/DataTable";
import { PrintButton } from "@/components/miis/Print";
import { ReportRunner, type CriterionOptions } from "@/components/miis/ReportRunner";
import { ScheduledExtracts, type ScheduledExtract } from "@/components/miis/ScheduledExtracts";
import { SectionTabs } from "@/components/miis/SectionTabs";
import { Badge, Button, PageHeading, Panel, Rationale, ReqTag } from "@/components/miis/primitives";
import {
  PopulationReport,
  reportDocumentLabels,
} from "@/components/miis/ReportDocumentView";
import { ShortTermWageReport } from "@/components/miis/ShortTermWageReport";
import { getConstructionsReport } from "@/lib/data/constructions";
import { listAgreements } from "@/lib/data/agreements";
import { listWageAgreements } from "@/lib/data/reports";
import { listDocuments } from "@/lib/data/documents";
import { listSetReminders } from "@/lib/data/events";
import { listCooperationBodies, listParties } from "@/lib/data/parties";
import {
  EXTRACT_PERIOD_END,
  LAST_EXPORT_DATE,
  listBargainingYears,
  listMonitoredAgreements,
} from "@/lib/data/reports";
import {
  AGREEMENT_CONSTRUCTIONS,
  SECTOR_LABEL,
  validityLabel,
  type WageAgreement,
} from "@/lib/domain/agreement";
import {
  agreementDocument,
  type ReleaseDocument,
  type ReportAgreement,
} from "@/lib/domain/report";
import type { Role } from "@/lib/domain/role";
import { getSession } from "@/lib/session";

const EXTRACT_PERIOD_START = "2027-06-01";

/** The two roles §3.1 gives *"Specifika rapporter"* rather than the catalogue. */
const EXTERNAL_ROLES: Role[] = ["mediator", "public"];

export async function generateMetadata(): Promise<Metadata> {
  const { i18n } = await getSession();
  const title = `${i18n.common.appName} – ${i18n.rapporter.title}`;
  const description = i18n.rapporter.subtitle;
  return { title, description, openGraph: { title, description } };
}

/**
 * Reports — FR-005 to FR-014, and Bilaga F.
 *
 * The screen is built around the sentence Bilaga F opens with: *"För varje
 * rapport visas urvalsbild och resultat."* So the top of the page is MI's own
 * selection screen — choose the report, fill in the criteria that report takes,
 * choose the format, generate — and the result appears under it with the
 * criteria printed above it.
 *
 * Two reports are then always on the page below, because they are not really
 * printouts: **Konjunkturlönerapporten** is a working view by FR-008's own
 * wording, and the **scheduled extracts** (FR-014) are how the reports are
 * actually delivered rather than a report themselves.
 */
export default async function RapporterPage() {
  const session = await getSession();
  const { i18n, lang } = session;
  const t = i18n.rapporter;

  const [
    rows,
    constructionsReport,
    bargainingYears,
    agreements,
    parties,
    bodies,
    documents,
    wageAgreements,
    setReminders,
  ] = await Promise.all([
    listMonitoredAgreements(lang),
    getConstructionsReport(),
    listBargainingYears(),
    listAgreements(),
    listParties(),
    listCooperationBodies(),
    listDocuments(),
    listWageAgreements(),
    /* FA-022's markings for this session, read on the server so the row knows
       which agreements already carry one. */
    listSetReminders(),
  ]);

  const exportedCount = rows.filter((r) => r.lastExported).length;
  const isExternal = EXTERNAL_ROLES.includes(session.role.id);

  /*
    The option lists behind MI's criteria, taken from the register rather than
    hard-coded — a selection screen offering an organisation the register does
    not hold is a selection that can return nothing for a reason the user cannot
    see. `Array.from(new Set(...))` because a party signs many agreements and
    the list is of parties, not of rows.
  */
  const unique = (values: (string | undefined)[]) =>
    [...new Set(values.filter((v): v is string => Boolean(v)))].sort((a, b) =>
      a.localeCompare(b, lang === "sv" ? "sv" : "en"),
    );

  const criterionOptions: CriterionOptions = {
    employers: unique(parties.filter((p) => p.type === "employer").map((p) => p.name)),
    employees: unique(parties.filter((p) => p.type === "employee").map((p) => p.name)),
    agreements: unique(agreements.map((a) => a.name)),
    sectors: (["private", "state", "municipal"] as const).map((s) => ({
      id: SECTOR_LABEL[lang][s],
      label: SECTOR_LABEL[lang][s],
    })),
    industryCodes: unique(parties.map((p) => p.industryCode)),
    /* Per side. Confederations do not span the two — offering Svenskt
       Näringsliv under Centralorganisation (ATO) is a criterion that can only
       return nothing. */
    employerCentralOrgs: unique(
      parties.filter((p) => p.type === "employer").map((p) => p.centralOrganisation),
    ),
    employeeCentralOrgs: unique(
      parties.filter((p) => p.type === "employee").map((p) => p.centralOrganisation),
    ),
    employerGroups: unique(parties.map((p) => p.employerGroup)),
    cooperationGroups: unique(bodies.map((b) => b.name)),
    years: bargainingYears.years,
    defaultYear: bargainingYears.busiest,
    otherAgreementTypes: unique(agreements.map((a) => a.agreementType)),
  };

  /*
    The register reduced to what a report selection compares against. Sector,
    confederation, employer group and industry code live on the *party*, not on
    the agreement (FP-001), so they are resolved here — the report screen asks
    "agreements whose employer organisation is in the state sector", and that is
    a join the seam should do once rather than the browser doing per keystroke.
  */
  const partyByName = new Map(parties.map((p) => [p.name, p]));
  const reportAgreements: ReportAgreement[] = agreements.map((a) => {
    const employer = partyByName.get(a.employerOrg.name);
    const employee = partyByName.get(a.employeeOrg.name);
    return {
      id: a.id,
      name: a.name,
      confidential: a.confidential,
      validity: validityLabel(a, lang),
      ...(a.validFrom ? { validFrom: a.validFrom } : {}),
      ...(a.expiresWithoutRenewal ? { expiresWithoutRenewal: true } : {}),
      ...(a.earlyTermination ? { earlyTermination: a.earlyTermination } : {}),
      ...(a.validTo ? { validTo: a.validTo } : {}),
      ...(a.employees !== undefined ? { employees: a.employees } : {}),
      ...(a.signedDate ? { signedDate: a.signedDate } : {}),
      ...(a.terminated?.value ? { terminated: true } : {}),
      ...(a.mediationLinked ? { mediationLinked: true } : {}),
      /* FR-009 and FR-010 select on this rather than on the party criteria:
         MI decides per agreement what goes out where, and a report that
         re-derived the population from sector and branschkod would disagree
         with the officer who ticked the box. */
      reportSelection: {
        website: a.reportSelection.website,
        eurofound: a.reportSelection.eurofound,
        minimumWage: a.reportSelection.minimumWage,
      },
      employerOrg: a.employerOrg.name,
      employeeOrg: a.employeeOrg.name,
      ...(employer?.sector ? { sector: SECTOR_LABEL[lang][employer.sector] } : {}),
      ...(employer?.industryCode ? { industryCode: employer.industryCode } : {}),
      ...(employer?.centralOrganisation
        ? { employerCentralOrg: employer.centralOrganisation }
        : {}),
      ...(employee?.centralOrganisation
        ? { employeeCentralOrg: employee.centralOrganisation }
        : {}),
      ...(employer?.employerGroup ? { employerGroup: employer.employerGroup } : {}),
      ...(bodies.find((b) => b.members.includes(a.employeeOrg.id))
        ? { cooperationGroup: bodies.find((b) => b.members.includes(a.employeeOrg.id))!.name }
        : {}),
      agreementType: a.agreementType,
    };
  });

  /* Rapport 5's three document sections. `confidential` is already derived from
     the agreement by the seam, so the release rule reads one field. */
  const releaseDocuments: ReleaseDocument[] = documents.map((d) => ({
    id: d.id,
    fileName: d.fileName,
    uploadedDate: d.uploadedDate,
    type: d.type,
    confidential: d.confidential,
    ...(d.agreementId ? { agreementId: d.agreementId } : {}),
  }));

  /*
    The schedule's own records. They come from the dictionary rather than the
    mock register because a scheduled extract is a *setting*, not a record the
    authority is accountable for — nothing counts it, and FE-003 is about the
    schedule rather than about what it sent.
  */
  const scheduleItems: ScheduledExtract[] = t.scheduled.items.map((item, i) => ({
    id: `SCH-${i + 1}`,
    report: item.report,
    schedule: item.schedule,
    recipients: item.recipients,
    lastRun: item.lastRun,
    active: item.active,
  }));


  /*
    Every report's result, built here.

    Six of the ten used to resolve to a link or to the words *Steg 2*, so half
    the catalogue had a urvalsbild and no resultat — which is the opposite of
    what Bilaga 3 §7 opens by requiring. The documents are built on the server
    because that is where the confidentiality rule has to run: what an audience
    may not read is **absent** from the structure handed down, not hidden in it.
  */
  const docLabels = reportDocumentLabels(i18n);
  const roundsByAgreement = new Map<string, WageAgreement[]>();
  for (const w of wageAgreements) {
    const list = roundsByAgreement.get(w.agreementId) ?? [];
    list.push(w);
    roundsByAgreement.set(w.agreementId, list);
  }

  const agreementDocuments = Object.fromEntries(
    reportAgreements.map((a) => {
      const rounds = (roundsByAgreement.get(a.id) ?? []).map((w) => ({
        /* A wage agreement has no year of its own — FA-002 dates it by the
           period it runs, and the round is the year it starts. */
        year: Number(w.validFrom.slice(0, 4)),
        ...(w.construction !== undefined ? { construction: w.construction } : {}),
        constructionLabel:
          w.construction === undefined
            ? undefined
            : `${w.construction}. ${AGREEMENT_CONSTRUCTIONS[lang][w.construction]}`,
        ...(w.wageScopePercent !== undefined ? { wageScopePercent: w.wageScopePercent } : {}),
        ...(w.costFramePercent !== undefined ? { costFramePercent: w.costFramePercent } : {}),
        ...(w.validFrom ? { validFrom: w.validFrom } : {}),
        ...(w.validTo ? { validTo: w.validTo } : {}),
      }));
      return [
        a.name,
        {
          internal: agreementDocument(a, rounds, "internal", docLabels),
          public: agreementDocument(a, rounds, "public", docLabels),
        },
      ];
    }),
  );


  return (
    <AppShell
      walkthrough={session.walkthrough}
      role={session.role}
      requires="rapporter"
      dataset={session.dataset}
      lang={lang}
      reqTags={session.reqTags}
    >
      <PageHeading
        title={t.title}
        subtitle={t.subtitle}
        tags={["FR-005", "FR-006", "FR-007", "FR-011"]}
        action={<PrintButton lang={lang} />}
      />

      {/*
        Three separate jobs, one at a time.

        The screen carried all three stacked: the report catalogue with its own
        selection screen and result, Konjunkturlönerapporten's watch list of
        seventeen agreements, and the schedule of recurring extracts. That is a
        very long page on which an officer who came to do one of the three
        scrolls past the other two, and the third was below the fold on every
        screen size — the same fault Administration had, and `SectionTabs` is
        the same answer. Every section still prints; the strip does not.

        The order is the order they are used in: a report is taken out far more
        often than the watch list is reviewed, and the schedule is maintained
        once a quarter.
      */}
      <SectionTabs
        label={t.tabs.label}
        lang={lang}
        sections={[
          {
            id: "uttag",
            label: t.tabs.run,
            node: (
              /*
                §3.1 gives Medlare and Allmänhetens dator "Specifika rapporter",
                and Bilaga 3 §4.3 and §5.1 name which. The picker is narrowed by
                the role rather than by hiding options, so a URL cannot reach a
                report the role was not given.
              */
              <ReportRunner
                lang={lang}
                options={criterionOptions}
                agreements={reportAgreements}
                documents={releaseDocuments}
                role={session.role.id}
                isExternal={isExternal}
                agreementDocuments={agreementDocuments}
                results={{
                  constructions: (
                    <ConstructionsReport report={constructionsReport} lang={lang} d={i18n} />
                  ),
                  /*
                    §7.5 and FR-009/FR-010 are populations, so their result is a
                    table of the agreements the selection leaves. They were a
                    link and two *Steg 2* notices.
                  */
                  pension: (
                    <PopulationReport
                      lang={lang}
                      heading={t.population.pension}
                      note={t.population.pensionNote}
                      rows={reportAgreements.filter((a) => a.agreementType !== undefined)}
                    />
                  ),
                  "report-selection-website": (
                    <PopulationReport
                      lang={lang}
                      heading={t.population.website}
                      note={t.population.selectionNote}
                      rows={reportAgreements.filter((a) => a.reportSelection?.website)}
                    />
                  ),
                  "report-selection-eurofound": (
                    <PopulationReport
                      lang={lang}
                      heading={t.population.eurofound}
                      note={t.population.selectionNote}
                      rows={reportAgreements.filter(
                        (a) => a.reportSelection?.eurofound || a.reportSelection?.minimumWage,
                      )}
                    />
                  ),
                  /* FR-008's own view: the watch list *is* the selection, which
                     is why this report has no criteria of its own. */
                  "short-term-wage": (
                    <ShortTermWageReport
                      lang={lang}
                      rows={rows}
                      reminders={setReminders}
                      periodValue={`${EXTRACT_PERIOD_START} – ${EXTRACT_PERIOD_END}`}
                      lastExportValue={`${LAST_EXPORT_DATE} · ${i18n.common.agreementCount(exportedCount)}`}
                    />
                  ),
                }}
              />
            ),
          },
          /*
            Not for the two roles §3.1 limits to specific reports: the
            Short-Term Wage Report is not one of the three Bilaga 3 §5.1 names,
            and a tab would hand a mediator a report the table does not give
            them. With both of these gone the strip disappears too — one tab is
            not a choice.
          */
          ...(isExternal
            ? []
            : [
                {
                  id: "konjunkturlon",
                  label: t.tabs.shortTerm,
                  node: (
                    /*
                      FR-008 puts this one on a screen rather than behind a
                      selection: the report *"ska skrivas ut/exporteras från en
                      vy som visar en lista med bevakade avtal"*, so the list is
                      the selection and it is always visible within its tab. The
                      id is the report catalogue's own link target, and
                      `SectionTabs` opens the tab that owns it.
                    */
                    <div id="konjunkturlon" className="scroll-mt-4">
                      <ShortTermWageReport
                        rows={rows}
                        reminders={setReminders}
                        lang={lang}
                        periodValue={`${EXTRACT_PERIOD_START} – ${EXTRACT_PERIOD_END}`}
                        lastExportValue={`${LAST_EXPORT_DATE} · ${i18n.common.agreementCount(exportedCount)}`}
                      />
                    </div>
                  ),
                },
                {
                  id: "schemalagt",
                  label: t.tabs.scheduled,
                  node: (
                    /*
                      FE-003 is *"schemalagda rapportuttag"*, and the schedule
                      was a read-only table with a `disabled` *Nytt schemalagt
                      uttag* beneath it reading "Ej aktiv i demon". A list an
                      administrator can only read is not a schedule anybody
                      keeps — and that phrase states a fact about the demo,
                      which is never the answer to why a system refuses
                      something.
                    */
                    <ScheduledExtracts lang={lang} initial={scheduleItems} />
                  ),
                },
              ]),
        ]}
      />
    </AppShell>
  );
}
