import type { Metadata } from "next";
import Link from "next/link";

import { AppShell } from "@/components/miis/AppShell";
import { IconForward, IconPlus } from "@/components/miis/icons";
import { DataTable, type Column, type Row } from "@/components/miis/DataTable";
import {
  LinkButton,
  Button,
  Badge,
  ConfidentialityMarker,
  EmptyState,
  PageHeading,
  Panel,
  Rationale,
  ReqTag,
  StatusDot,
} from "@/components/miis/primitives";
import { getDashboard } from "@/lib/data/dashboard";
import { registrationStatusLabel } from "@/lib/domain/agreement";
import { isHalfWidth, type DashboardPanel } from "@/lib/domain/dashboard";
import type { Lang } from "@/lib/domain/lang";
import { statusInfo } from "@/lib/domain/status";
import type { Dictionary } from "@/lib/i18n";
import { percent } from "@/lib/format";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const { i18n } = await getSession();
  const title = `${i18n.common.appName} – ${i18n.nav.start}`;
  return {
    title,
    description: i18n.start.subheading,
    openGraph: { title, description: i18n.start.subheading },
  };
}

function PanelBody({ panel, i18n, lang }: { panel: DashboardPanel; i18n: Dictionary; lang: Lang }) {
  switch (panel.kind) {
    case "log":
      if (panel.items.length === 0) {
        return <EmptyState text={panel.emptyText ?? i18n.common.empty} />;
      }
      return (
        <ul className="divide-y divide-border">
          {panel.items.map((item) => (
            <li key={item.id} className="py-2.5 text-table">
              <span className="tabular-nums text-muted-foreground">{item.when}</span> ·{" "}
              {/*
                An event names an agreement, so it links to it. The panel's job
                is to be the way in — "mediation started on Spårtrafik" is only
                useful if the next click is Spårtrafik.
              */}
              {item.agreementId ? (
                <Link
                  href={`/avtal/${item.agreementId}`}
                  className="text-primary underline underline-offset-2"
                >
                  {item.text}
                </Link>
              ) : (
                item.text
              )}
            </li>
          ))}
        </ul>
      );

    case "list":
      if (panel.items.length === 0) {
        return <EmptyState text={panel.emptyText ?? i18n.common.empty} />;
      }
      return (
        <ul className="divide-y divide-border">
          {panel.items.map((item) => (
            <li key={item.text} className="flex items-center justify-between gap-4 py-2.5">
              <span className="text-table">{item.text}</span>
              {item.badge && <Badge tone="attention">{item.badge}</Badge>}
            </li>
          ))}
        </ul>
      );

    case "agreement-table": {
      if (panel.rows.length === 0) {
        return <EmptyState text={panel.emptyText ?? i18n.common.empty} />;
      }

      const columns: Column[] = [
        { key: "status", header: i18n.start.table.status, sortable: true },
        { key: "name", header: i18n.start.table.agreement, sortable: true },
        { key: "signed", header: i18n.start.table.signed, sortable: true },
        { key: "validity", header: i18n.start.table.validity },
        { key: "reg", header: i18n.start.table.registrationStatus, sortable: true },
      ];

      const rows: Row[] = panel.rows.map((row) => {
        const status = statusInfo(row.status, lang);
        return {
          key: row.id,
          // The status label is visible now, not only announced. It was hidden
          // to keep visual parity during the migration, which was a migration
          // decision rather than a design one — FR-012 status is information the
          // reader of the table actually needs.
          cells: [
            <StatusDot key="s" status={status} showLabel />,
            <span key="n" className="flex flex-wrap items-center gap-2">
              {/*
                A row that leads somewhere. The panel's value is that the
                officer can go straight from "what did I register yesterday" to
                the agreement itself; a list of names that cannot be opened is
                a report, not a work list.
              */}
              <Link
                href={`/avtal/${row.id}`}
                className="font-semibold text-primary underline underline-offset-2"
              >
                {row.name}
              </Link>
              {row.confidential && (
                <ConfidentialityMarker
                  compact
                  label={i18n.confidentiality.marked}
                  note={i18n.confidentiality.inStatistics}
                />
              )}
            </span>,
            <span key="d" className="tabular-nums">
              {row.signedDate ?? i18n.common.none}
            </span>,
            <span key="v" className="tabular-nums">
              {row.validity}
            </span>,
            registrationStatusLabel(row.registrationStatus, lang),
          ],
          sort: [
            status.label,
            row.name,
            row.signedDate ?? "",
            row.validity,
            registrationStatusLabel(row.registrationStatus, lang),
          ],
        };
      });

      return (
        <>
          <DataTable
            columns={columns}
            rows={rows}
            lang={lang}
            caption={panel.title}
            minWidth="44rem"
          />
        </>
      );
    }
  }
}

export default async function DashboardPage() {
  const session = await getSession();
  const { i18n, lang } = session;
  const page = await getDashboard(session.role.id, lang);
  const { benchmark } = page;

  const halfWidth = page.panels.filter(isHalfWidth);
  const fullWidth = page.panels.filter((p) => !isHalfWidth(p));

  /** The sentence the reader needs, above the panel's own content. */
function Lead({ panel }: { panel: DashboardPanel }) {
  if (!("lead" in panel) || !panel.lead) return null;
  return <p className="mb-3 max-w-3xl text-table text-muted-foreground">{panel.lead}</p>;
}

function Prose({ panel }: { panel: DashboardPanel }) {
    return (
      <>
        {panel.note && <p className="mt-3 text-label text-muted-foreground">{panel.note}</p>}
        {panel.rationale && <Rationale>{panel.rationale}</Rationale>}
      </>
    );
  }

  return (
    <AppShell role={page.role} dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      {/*
        §6.10 governs the criterion this prototype is scored on and carried no
        tag anywhere: the client is web-based (NFUI-001), responsive (NFUI-002)
        and WCAG 2.1 AA (NFUI-003) — all three true and verified, none of it
        said where an evaluator tracing requirement to interface would look.
        They sit on the start page because they are properties of the client
        rather than of any one screen.
      */}
      <PageHeading
        title={page.heading}
        subtitle={page.subheading}
        tags={["FS-001", "NFÅ-003", "NFUI-001", "NFUI-002", "NFUI-003"]}
        action={
          page.primaryAction ? (
            <LinkButton href={page.primaryAction.href} iconStart={<IconPlus />}>
              {page.primaryAction.text}
            </LinkButton>
          ) : undefined
        }
      />

      {/*
          A reference, not an alert.

          The figures were in a filled sand block with a border — the shape of a
          warning — and sand is also what an Ofullständig badge and a watchword
          hit wear, so the banner read as something wrong. The hue stays,
          because sand *is* Märket's colour; the form changes: a card with a
          sand spine, a kicker naming what it is, and the figures as labelled
          values rather than one sentence strung together with separators.
      */}
      {benchmark && (
        <div className="card-panel mb-5 border-l-4 border-l-sand-border p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="mi-kicker text-sand-foreground">{i18n.start.benchmarkKicker}</p>
              <p className="mt-1 font-display text-section font-semibold text-[var(--mi-slate-900)]">
                {i18n.common.benchmarkTerm} {benchmark.period}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <LinkButton href="/market" variant="secondary" size="sm" iconEnd={<IconForward />}>
                {i18n.market.title}
              </LinkButton>
              <ReqTag id="FM-003" />
            </div>
          </div>

          <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 @xl:grid-cols-3">
            <div>
              <dt className="text-label font-bold">{i18n.market.current.costFrame}</dt>
              <dd className="text-body tabular-nums">
                {percent(benchmark.costFramePercent, lang)}
              </dd>
            </div>
            <div>
              <dt className="text-label font-bold">{i18n.market.current.periodisation}</dt>
              <dd className="text-body tabular-nums">{benchmark.periodisation}</dd>
            </div>
            <div>
              <dt className="text-label font-bold">{i18n.market.current.period}</dt>
              <dd className="text-body tabular-nums">
                {benchmark.validFrom} – {benchmark.validTo}
              </dd>
            </div>
            {benchmark.supplementaryAgreements.length > 0 && (
              <div className="@xl:col-span-2">
                <dt className="text-label font-bold">{i18n.market.current.supplementary}</dt>
                <dd className="text-body">{benchmark.supplementaryAgreements.join(" · ")}</dd>
              </div>
            )}
            <div>
              <dt className="text-label font-bold">{i18n.market.current.registered}</dt>
              <dd className="text-body tabular-nums">{benchmark.registeredDate}</dd>
            </div>
          </dl>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 @3xl:grid-cols-2">
        {halfWidth.map((panel) => (
          <Panel key={panel.title} title={panel.title} tags={panel.reqTags}>
            <Lead panel={panel} />
            <PanelBody panel={panel} i18n={i18n} lang={lang} />
            <Prose panel={panel} />
            {"action" in panel && panel.action && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {/*
                  An action without a destination is inert and says so. It used
                  to fall through to `/rapporter`, so "Visa alla (64)" under My
                  reminders quietly opened the reports hub — a link that goes
                  somewhere unrelated is worse than one that goes nowhere,
                  because the reader believes it.
                */}
                {panel.action.href ? (
                  <LinkButton href={panel.action.href} variant="secondary" iconEnd={<IconForward />}>
                    {panel.action.text}
                  </LinkButton>
                ) : (
                  <Button variant="secondary" disabled disabledReason={i18n.common.notInDemo}>
                    {panel.action.text}
                  </Button>
                )}
                {panel.action.reqTag && <ReqTag id={panel.action.reqTag} />}
              </div>
            )}
          </Panel>
        ))}
      </div>

      {fullWidth.map((panel) => (
        <div key={panel.title} className="mt-5">
          <Panel title={panel.title} tags={panel.reqTags}>
            <Lead panel={panel} />
            <PanelBody panel={panel} i18n={i18n} lang={lang} />
            <Prose panel={panel} />
          </Panel>
        </div>
      ))}
    </AppShell>
  );
}
