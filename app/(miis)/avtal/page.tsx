import type { Metadata } from "next";
import Link from "next/link";

import { AgreementFilters } from "@/components/miis/AgreementFilters";
import { AppShell } from "@/components/miis/AppShell";
import { IconPlus } from "@/components/miis/icons";
import { type Column, type Row } from "@/components/miis/DataTable";
import {
  LinkButton,
  Badge,
  ConfidentialityMarker,
  PageHeading,
  Panel,
  Rationale,
  StatusDot,
} from "@/components/miis/primitives";
import { listAgreementAreas, listAgreements, listWageAgreements } from "@/lib/data/agreements";
import {
  partiesLabel,
  registrationStatusLabel,
  validityLabel,
} from "@/lib/domain/agreement";
import { agreementStatus } from "@/lib/domain/status";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const { i18n } = await getSession();
  const title = `${i18n.common.appName} – ${i18n.avtal.title}`;
  const description = i18n.avtal.subtitle;
  return { title, description, openGraph: { title, description } };
}

/**
 * The agreement register — FA-001 to FA-006, FA-021, FR-012.
 *
 * The register a registration lands in. `/registrera` now says the agreement
 * "is now in the agreement register" and offers the way here, so this is the
 * far side of the system's central flow and could not stay a stub.
 *
 * Same shape as `/parter`, `/medling` and `/partstraffar`: the page lists and
 * filters, `/avtal/[id]` opens one. FR-012's colour lives on the row through
 * `StatusDot`, which carries the mark, the shape and the label together — so
 * the table needs no legend under it.
 */
export default async function AvtalPage() {
  const session = await getSession();
  const { i18n, lang } = session;
  const t = i18n.avtal;
  const [agreements, areas] = await Promise.all([listAgreements(), listAgreementAreas()]);
  const wageCounts = await Promise.all(
    agreements.map(async (a) => (await listWageAgreements(a.id)).length),
  );

  const columns: Column[] = [
    { key: "name", header: t.table.name, sortable: true },
    { key: "parties", header: t.table.parties, sortable: true },
    { key: "validity", header: t.table.validity, sortable: true },
    { key: "status", header: t.table.status, sortable: true },
    { key: "registration", header: t.table.registration, sortable: true },
    { key: "wage", header: t.table.wageRows, numeric: true, sortable: true },
  ];

  const rows: Row[] = agreements.map((a, i) => {
    const status = agreementStatus(a, lang);
    return {
      key: a.id,
      cells: [
        <span key="n" className="flex flex-wrap items-center gap-2">
          <Link
            href={`/avtal/${a.id}`}
            className="font-semibold text-primary underline underline-offset-2"
          >
            {a.name}
          </Link>
          {/* D-001 travels with the row; a marker lost in a list is a marker
              that was not set. */}
          {a.confidential && (
            <ConfidentialityMarker
              compact
              label={i18n.confidentiality.marked}
              note={i18n.confidentiality.inStatistics}
            />
          )}
        </span>,
        partiesLabel(a),
        <span key="v" className="tabular-nums">
          {validityLabel(a, lang)}
        </span>,
        <StatusDot key="s" status={status} showLabel />,
        <Badge key="r" tone={a.registrationStatus === "complete" ? "ok" : "attention"}>
          {registrationStatusLabel(a.registrationStatus, lang)}
        </Badge>,
        wageCounts[i],
      ],
      sort: [
        a.name,
        partiesLabel(a),
        a.validFrom ?? "",
        status.label,
        registrationStatusLabel(a.registrationStatus, lang),
        wageCounts[i] ?? 0,
      ],
      /*
        What FA-005 and FA-006 let the register be narrowed by, as plain values
        the filter can compare. They are the row's own properties, not its
        rendered cells — a cell is a `ReactNode` by the time the filter sees it.
      */
      facets: {
        area: a.agreementArea,
        registration: a.registrationStatus,
        status: status.code,
      },
    };
  });

  return (
    <AppShell
      walkthrough={session.walkthrough} role={session.role} requires="avtal" dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      <PageHeading
        title={t.title}
        subtitle={t.subtitle}
        tags={["FA-001", "FA-005", "FA-006", "FR-012"]}
        action={
          /*
            Registration is an action, not a place, so it is a button and never
            a menu item — but it was only on the start page. The agreement
            register is where an officer stands when the next protocol arrives,
            and it had no way to begin one.
          */
          <div className="flex flex-wrap items-center gap-3">
            <LinkButton href="/registrera" iconStart={<IconPlus />}>
              {i18n.registrera.title}
            </LinkButton>
            {/*
              Two ways in, because they are two tasks. A protocol arrives about
              an agreement MIIS already holds; a wholly new agreement has no
              protocol to read and, by §4.1, is always registered by hand.
            */}
            <LinkButton href="/avtal/ny" variant="secondary" iconStart={<IconPlus />}>
              {i18n.avtal.newAgreement.title}
            </LinkButton>
          </div>
        }
      />

      <Panel title={t.register.heading} tags={["FA-001", "FA-021", "FR-012"]}>
        <p className="mb-4 max-w-4xl text-table">{t.register.intro}</p>
        {/*
          The filters own the table. They used to sit above one the page
          rendered itself, so choosing an agreement area changed the chips and
          nothing else.
        */}
        <AgreementFilters
          lang={lang}
          areas={areas}
          columns={columns}
          rows={rows}
          caption={t.register.heading}
          minWidth="62rem"
        />
        <Rationale>{t.register.areaNote}</Rationale>
      </Panel>
    </AppShell>
  );
}
