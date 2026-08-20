import type { Metadata } from "next";

import { AppShell } from "@/components/miis/AppShell";
import { NewMediator } from "@/components/miis/NewMediator";
import { DataTable, type Column, type Row } from "@/components/miis/DataTable";
import { Badge, Callout, PageHeading, Panel, Rationale } from "@/components/miis/primitives";
import { listMediators, mediatorStats } from "@/lib/data/mediators";
import { MEDIATION_TYPE_LABEL } from "@/lib/domain/mediation";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const { i18n } = await getSession();
  const title = `${i18n.common.appName} – ${i18n.medlare.title}`;
  const description = i18n.medlare.subtitle;
  return { title, description, openGraph: { title, description } };
}

/**
 * The mediator register — FF-009, FE-001, FH-001, D-004.
 *
 * FF-009 asks for the register *and* "statistik per medlare (år och
 * avtalsområde) samt position ettan eller tvåan", so the statistics are columns
 * of the register rather than a separate report: the question a mediation
 * administrator is actually asking is "who could take this, and what have they
 * done before", and that is one look at one table.
 *
 * The figures are derived from each mediator's history in `mediatorStats`, not
 * stored. A stored count is a count that can drift from the assignments it
 * claims to describe.
 *
 * Contact details are on the row because this register exists to let an
 * administrator reach a mediator. D-004 puts them under MI's retention
 * routines, which is what the note says — and why they appear for this role and
 * not in the public view.
 */
export default async function MedlarePage() {
  const session = await getSession();
  const { i18n, lang } = session;
  const t = i18n.medlare;
  const mediators = await listMediators();

  const columns: Column[] = [
    { key: "name", header: t.table.name, sortable: true },
    { key: "types", header: t.table.types, sortable: true },
    { key: "assignments", header: t.table.assignments, numeric: true, sortable: true },
    { key: "first", header: t.table.firstChair, numeric: true, sortable: true },
    { key: "second", header: t.table.secondChair, numeric: true, sortable: true },
    { key: "latest", header: t.table.latest, numeric: true, sortable: true },
    { key: "areas", header: t.table.areas },
    { key: "contact", header: t.table.contact },
    { key: "status", header: t.table.status, sortable: true },
  ];

  const rows: Row[] = mediators.map((m) => {
    const stats = mediatorStats(m);
    const types = m.types.map((x) => MEDIATION_TYPE_LABEL[lang][x]).join(" · ");
    return {
      key: m.id,
      cells: [
        <span key="n" className="font-semibold">
          {m.name}
        </span>,
        types,
        stats.assignments,
        stats.firstChair,
        stats.secondChair,
        <span key="y" className="tabular-nums">
          {stats.latestYear ?? i18n.common.none}
        </span>,
        stats.areas.join(", "),
        <span key="c" className="whitespace-nowrap">
          {m.phone}
        </span>,
        <Badge key="s" tone={m.active ? "ok" : "neutral"}>
          {m.active ? t.active : t.inactive}
        </Badge>,
      ],
      sort: [
        m.name,
        types,
        stats.assignments,
        stats.firstChair,
        stats.secondChair,
        stats.latestYear ?? 0,
        stats.areas.join(", "),
        m.phone,
        m.active ? "1" : "0",
      ],
    };
  });

  return (
    <AppShell role={session.role} requires="medlare" dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      <PageHeading title={t.title} subtitle={t.subtitle} tags={["FF-009", "D-004"]} />

      <Panel title={t.register.heading} tags={["FF-009", "FH-001"]}>
        <p className="mb-4 max-w-4xl text-table">{t.register.intro}</p>
        <DataTable
          columns={columns}
          rows={rows}
          lang={lang}
          caption={t.register.heading}
          minWidth="76rem"
        />
        <Rationale>{t.register.privacyNote}</Rationale>
      </Panel>

      {/*
        FE-001's notification, stated where the register is — the mediator
        administrator is the recipient, so this is the screen where knowing it
        happens is worth anything.
      */}
      <div className="mt-5">
        <Panel title={t.notify.heading} tags={["FE-001", "FH-001"]}>
          <Callout tone="ok" label={t.notify.heading}>
            {t.notify.body}
          </Callout>
        </Panel>
      </div>
    </AppShell>
  );
}
