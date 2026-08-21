import type { Metadata } from "next";

import { PrintHeader } from "@/components/miis/Print";
import { type Column, type Row } from "@/components/miis/DataTable";
import { PublicSearch } from "@/components/miis/PublicSearch";
import { PublicShell } from "@/components/miis/PublicShell";
import {
  ConfidentialityMarker,
  PageHeading,
  Panel,
  Rationale,
  StatusDot,
} from "@/components/miis/primitives";
import { listAgreements } from "@/lib/data/agreements";
import { listEmployeeOrgs, listEmployerOrgs } from "@/lib/data/parties";
import { validityLabel } from "@/lib/domain/agreement";
import type { PublicSearchable } from "@/lib/domain/public-search";
import { agreementStatus } from "@/lib/domain/status";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const { i18n } = await getSession();
  const title = `${i18n.common.appName} – ${i18n.allmanheten.title}`;
  const description = i18n.allmanheten.subtitle;
  return { title, description, openGraph: { title, description } };
}

/**
 * The public computer — FR-011, NFÅ-006, D-002, and US-14.
 *
 * The one screen a role gets, so it has to carry the whole scenario: find the
 * agreement, read its status and period, take the answer away. There is no
 * sign-in and there should not be — NFÅ-001 puts staff authentication in
 * Försäkringskassan's IdP, and NFÅ-006 restricts public access to MI's own IP
 * address, so the machine in the room is the credential.
 *
 * The cells are rendered here and handed to the client component as a map. The
 * status marker, the confidentiality marker and the masked validity are
 * decisions about what may be *shown*, and those stay on the server; the browser
 * decides only which rows are in the selection.
 */
export default async function AllmanhetenPage() {
  const session = await getSession();
  const { i18n, lang } = session;
  const [agreements, employerOrgs, employeeOrgs] = await Promise.all([
    listAgreements(),
    listEmployerOrgs(),
    listEmployeeOrgs(),
  ]);
  const t = i18n.allmanheten;

  const columns: Column[] = [
    { key: "status", header: t.result.table.status, sortable: true },
    { key: "agreement", header: t.result.table.agreement, sortable: true },
    { key: "ago", header: t.result.table.employerOrg, sortable: true },
    { key: "ato", header: t.result.table.employeeOrg, sortable: true },
    { key: "validity", header: t.result.table.validity, sortable: true },
  ];

  const rowFor: Record<string, Row> = {};
  for (const a of agreements) {
    const status = agreementStatus(a, lang);
    rowFor[a.id] = {
      key: a.id,
      cells: [
        <StatusDot key="s" status={status} showLabel />,
        <span key="a" className="flex flex-wrap items-center gap-2">
          {a.name}
          {/*
            D-002: a marked agreement is still listed and still counted. What is
            withheld is the detail, and the row says so rather than leaving a blank.
          */}
          {a.confidential && (
            <ConfidentialityMarker
              compact
              label={i18n.confidentiality.marked}
              note={i18n.confidentiality.reasonPublic}
            />
          )}
        </span>,
        a.employerOrg.name,
        a.employeeOrg.name,
        a.confidential ? (
          <span key="v" className="text-muted-foreground">
            {i18n.confidentiality.maskedValue}
          </span>
        ) : (
          <span key="v" className="tabular-nums">
            {validityLabel(a, lang)}
          </span>
        ),
      ],
      sort: [
        status.label,
        a.name,
        a.employerOrg.name,
        a.employeeOrg.name,
        a.confidential ? "" : validityLabel(a, lang),
      ],
    };
  }

  /* Only what a public search may read — see `lib/domain/public-search.ts`. */
  const searchable: PublicSearchable[] = agreements.map((a) => ({
    id: a.id,
    name: a.name,
    agreementArea: a.agreementArea,
    employerOrg: { id: a.employerOrg.id, name: a.employerOrg.name },
    employeeOrg: { id: a.employeeOrg.id, name: a.employeeOrg.name },
    ...(a.validFrom ? { validFrom: a.validFrom } : {}),
    ...(a.validTo ? { validTo: a.validTo } : {}),
  }));

  return (
    <PublicShell
      lang={lang}
      dataset={session.dataset}
      role={session.role.id}
      reqTags={session.reqTags}
    >
      <PrintHeader lang={lang} />
      <PageHeading
        title={t.title}
        subtitle={t.subtitle}
        tags={["FR-011", "NFÅ-006", "D-002"]}
        marker={
          <p className="max-w-3xl rounded-md border-2 border-public-border bg-public px-4 py-3 text-table text-public-foreground">
            {t.publicExplain}
          </p>
        }
      />

      <PublicSearch
        agreements={searchable}
        employerOrgs={employerOrgs.map((p) => ({ id: p.id, name: p.name }))}
        employeeOrgs={employeeOrgs.map((p) => ({ id: p.id, name: p.name }))}
        lang={lang}
        columns={columns}
        rowFor={rowFor}
      />

      <div className="mt-5">
        <Panel title={t.help.title} tone="sand" tags={["D-002"]}>
          <ul className="list-disc space-y-1 pl-5 text-table text-sand-foreground">
            {t.help.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Rationale>{i18n.confidentiality.setBy}</Rationale>
        </Panel>
      </div>
    </PublicShell>
  );
}
