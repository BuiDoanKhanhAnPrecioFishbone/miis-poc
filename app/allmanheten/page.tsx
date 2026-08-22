import type { Metadata } from "next";
import Link from "next/link";

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
import { listPublicAgreements } from "@/lib/data/public";
import { listEmployeeOrgs, listEmployerOrgs, listParties } from "@/lib/data/parties";
import { validityLabel } from "@/lib/domain/agreement";
import type { PublicSearchable } from "@/lib/domain/public-search";
import { accessLevel } from "@/lib/domain/role";
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
export default async function AllmanhetenPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [session, query] = await Promise.all([getSession(), searchParams]);
  const { i18n, lang } = session;

  /*
    The selection the report carried here.

    *Avtal – Allmänheten* is Bilaga F's Rapport 1 and its criteria are AGO, ATO
    and Avtal; an officer who narrowed on the report screen and pressed the
    button used to arrive at an unfiltered list, having done the narrowing
    twice. The criterion ids are the report's own, so nothing has to be
    translated between the two screens.
  */
  const one = (key: string) => {
    const v = query[key];
    return typeof v === "string" ? v : "";
  };
  const initial = {
    employerOrgId: one("employerOrg"),
    employeeOrgId: one("employeeOrg"),
    agreementId: one("agreement"),
  };
  const fromReport = one("fran") === "rapport";
  const [agreements, employerOrgs, employeeOrgs, parties] = await Promise.all([
    /* Only what MI has published — Bilaga 2 §3.5, Scenario 2's fourth bullet
       seen from the other end. An agreement nobody released is in the register
       and not here. */
    listPublicAgreements(),
    listEmployerOrgs(),
    listEmployeeOrgs(),
    listParties(),
  ]);
  /* Bransch lives on the employer organisation (FP-001), so it is joined once
     here rather than looked up per row in the browser. */
  const industryOf = new Map(parties.map((p) => [p.name, p.industryCode]));
  const industryCodes = [
    ...new Set(parties.map((p) => p.industryCode).filter((c): c is string => Boolean(c))),
  ].sort((a, b) => a.localeCompare(b, "sv"));
  const t = i18n.allmanheten;

  /*
    The agreement's name leads, and the status follows it.

    On the internal register FR-012's status is the first thing an officer
    needs — how the agreement came about is what they are triaging by. A member
    of the public standing at the computer in MI's lobby is not triaging: they
    arrived with the name of an industry or a union in their head, and the first
    column was *Nytecknat utan medling*, a phrase from MI's own vocabulary that
    tells them nothing about which row is theirs. Same data, same requirement,
    different reader — so the thing they came for goes first.
  */
  const columns: Column[] = [
    { key: "agreement", header: t.result.table.agreement, sortable: true },
    { key: "ago", header: t.result.table.employerOrg, sortable: true },
    { key: "ato", header: t.result.table.employeeOrg, sortable: true },
    { key: "validity", header: t.result.table.validity, sortable: true },
    { key: "status", header: t.result.table.status, sortable: true },
  ];

  const rowFor: Record<string, Row> = {};
  for (const a of agreements) {
    const status = agreementStatus(a, lang);
    rowFor[a.id] = {
      key: a.id,
      cells: [
        <span key="a" className="flex flex-wrap items-center gap-2">
          {a.confidential ? (
            a.name
          ) : (
            <Link
              href={`/allmanheten/${a.id}`}
              className="font-semibold text-primary underline underline-offset-2"
            >
              {a.name}
            </Link>
          )}
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
        <StatusDot key="s" status={status} showLabel />,
      ],
      /* Same order as the cells above — a sort array out of step with its
         columns sorts the table by the wrong field, silently. */
      sort: [
        a.name,
        a.employerOrg.name,
        a.employeeOrg.name,
        a.confidential ? "" : validityLabel(a, lang),
        status.label,
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
    ...(industryOf.get(a.employerOrg.name)
      ? { industryCode: industryOf.get(a.employerOrg.name)! }
      : {}),
    ...(a.validFrom ? { validFrom: a.validFrom } : {}),
    ...(a.validTo ? { validTo: a.validTo } : {}),
  }));

  return (
    <PublicShell
      walkthrough={session.walkthrough}
      lang={lang}
      dataset={session.dataset}
      role={session.role.id}
      reqTags={session.reqTags}
      {...(fromReport && accessLevel(session.role, "rapporter") !== "none"
        ? { back: { href: "/rapporter", label: t.backToReport } }
        : {})}
    >
      <PrintHeader lang={lang} />
      <PageHeading
        title={t.title}
        subtitle={t.subtitle}
        tags={["FR-011", "NFÅ-006", "D-002"]}
        marker={
          /* `print-hide`: this explains what the *view* is — a limited,
             read-only version of MIIS — which is a fact about the screen the
             reader is no longer looking at. */
          <p className="print-hide max-w-3xl rounded-md border-2 border-public-border bg-public px-4 py-3 text-table text-public-foreground">
            {t.publicExplain}
          </p>
        }
      />

      <PublicSearch
        initial={initial}
        {...(fromReport ? { fromReport: t.fromReport } : {})}
        agreements={searchable}
        employerOrgs={employerOrgs.map((p) => ({ id: p.id, name: p.name }))}
        employeeOrgs={employeeOrgs.map((p) => ({ id: p.id, name: p.name }))}
        industryCodes={industryCodes}
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
