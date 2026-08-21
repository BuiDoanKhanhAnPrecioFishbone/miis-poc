import type { Metadata } from "next";

import { AppShell } from "@/components/miis/AppShell";
import { ConstructionsReport } from "@/components/miis/ConstructionsReport";
import { DataTable, type Column, type Row } from "@/components/miis/DataTable";
import { PrintButton } from "@/components/miis/Print";
import { ReportRunner, type CriterionOptions } from "@/components/miis/ReportRunner";
import { Badge, Button, PageHeading, Panel, Rationale, ReqTag } from "@/components/miis/primitives";
import { ShortTermWageReport } from "@/components/miis/ShortTermWageReport";
import { getConstructionsReport } from "@/lib/data/constructions";
import { listAgreements } from "@/lib/data/agreements";
import { listDocuments } from "@/lib/data/documents";
import { listCooperationBodies, listParties } from "@/lib/data/parties";
import {
  EXTRACT_PERIOD_END,
  LAST_EXPORT_DATE,
  listBargainingYears,
  listMonitoredAgreements,
} from "@/lib/data/reports";
import { SECTOR_LABEL, validityLabel } from "@/lib/domain/agreement";
import type { ReleaseDocument, ReportAgreement } from "@/lib/domain/report";
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

  const [rows, constructionsReport, bargainingYears, agreements, parties, bodies, documents] =
    await Promise.all([
      listMonitoredAgreements(lang),
      getConstructionsReport(),
      listBargainingYears(),
      listAgreements(),
      listParties(),
      listCooperationBodies(),
      listDocuments(),
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

  const scheduleColumns: Column[] = [
    { key: "report", header: t.scheduled.table.report, sortable: true },
    { key: "schedule", header: t.scheduled.table.schedule },
    { key: "recipients", header: t.scheduled.table.recipients, sortable: true },
    { key: "lastRun", header: t.scheduled.table.lastRun, sortable: true },
    { key: "status", header: t.scheduled.table.status, sortable: true },
  ];

  const scheduleRows: Row[] = t.scheduled.items.map((item) => ({
    key: item.report,
    cells: [
      item.report,
      item.schedule,
      item.recipients,
      <span key="l" className="tabular-nums">
        {item.lastRun}
      </span>,
      <Badge key="s" tone={item.active ? "ok" : "neutral"}>
        {item.active ? t.scheduled.active : t.scheduled.paused}
      </Badge>,
    ],
    sort: [
      item.report,
      item.schedule,
      item.recipients,
      item.lastRun,
      item.active ? t.scheduled.active : t.scheduled.paused,
    ],
  }));

  return (
    <AppShell
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
        §3.1 gives Medlare and Allmänhetens dator "Specifika rapporter", and
        Bilaga 3 §4.3 and §5.1 name which. The picker is narrowed by the role
        rather than by hiding options, so a URL cannot reach a report the role
        was not given.
      */}
      <ReportRunner
        lang={lang}
        options={criterionOptions}
        agreements={reportAgreements}
        documents={releaseDocuments}
        role={session.role.id}
        isExternal={isExternal}
        results={{
          constructions: <ConstructionsReport report={constructionsReport} lang={lang} d={i18n} />,
        }}
      />

      {/*
        FR-008 puts this one on a screen rather than behind a selection: the
        report "ska skrivas ut/exporteras från en vy som visar en lista med
        bevakade avtal", so the list is the selection and it is always visible.

        Not for the two roles §3.1 limits to specific reports, though — the
        Short-Term Wage Report is not one of the three Bilaga 3 §5.1 names, and a
        panel below the picker would hand a mediator a report the table does not
        give them.
      */}
      {!isExternal && (
        <div id="konjunkturlon" className="mt-5 scroll-mt-4">
          <ShortTermWageReport
            rows={rows}
            lang={lang}
            periodValue={`${EXTRACT_PERIOD_START} – ${EXTRACT_PERIOD_END}`}
            lastExportValue={`${LAST_EXPORT_DATE} · ${i18n.common.agreementCount(exportedCount)}`}
          />
        </div>
      )}

      {!isExternal && (
        <div className="mt-5">
          <Panel title={t.scheduled.heading} tags={["FR-014", "FE-001", "FE-002"]}>
            <p className="max-w-4xl text-table">{t.scheduled.intro}</p>
            <DataTable
              columns={scheduleColumns}
              rows={scheduleRows}
              lang={lang}
              caption={t.scheduled.heading}
              minWidth="48rem"
            />

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button variant="secondary" disabled disabledReason={i18n.common.notInDemo}>
                {t.scheduled.add}
              </Button>
              <ReqTag id="FE-003" />
            </div>
            <Rationale>{t.scheduled.logNote}</Rationale>
          </Panel>
        </div>
      )}
    </AppShell>
  );
}
