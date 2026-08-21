import type { Metadata } from "next";

import { AppShell } from "@/components/miis/AppShell";
import { PrintButton } from "@/components/miis/Print";
import { SystemSettings } from "@/components/miis/SystemSettings";
import { DataTable, type Column, type Row } from "@/components/miis/DataTable";
import { Badge, Button, Callout, PageHeading, Panel, Rationale } from "@/components/miis/primitives";
import { listChangeLog, listEvents } from "@/lib/data/events";
import { listWatchwords } from "@/lib/data/watchwords";
import { EVENT_TYPE_LABEL } from "@/lib/domain/event";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const { i18n } = await getSession();
  const title = `${i18n.common.appName} – ${i18n.administration.title}`;
  const description = i18n.administration.subtitle;
  return { title, description, openGraph: { title, description } };
}

/**
 * Administration — FH-001, FH-002, FAI-004, NFL-003, NFL-004.
 *
 * Two logs and a support table, and they are on one screen because they answer
 * one question: what has this system done, and can MI see it without asking us.
 *
 * **The change log is the one that matters for the bid.** FH-001 asks for the
 * old *and* the new value, which is the difference between a log that records
 * that something changed and one that can reconstruct what it was — and it is
 * what makes FAI-002's guarantee checkable after the fact. The rows are the
 * changes the walkthrough's own scenarios make, so a reviewer who corrects the
 * employee party in US-01 finds that correction here.
 *
 * NFL-003 and NFL-004 are stated rather than demonstrated, and the note says
 * which: retention and vendor-free access are properties of the delivered
 * system, not of a prototype with no database behind it.
 */
export default async function AdministrationPage() {
  const session = await getSession();
  const { i18n, lang } = session;
  const t = i18n.administration;
  const [changes, events, watchwords] = await Promise.all([
    listChangeLog(),
    listEvents(8),
    listWatchwords(),
  ]);

  const changeColumns: Column[] = [
    { key: "time", header: t.changeLog.time, sortable: true },
    { key: "user", header: t.changeLog.user, sortable: true },
    { key: "object", header: t.changeLog.object, sortable: true },
    { key: "field", header: t.changeLog.field, sortable: true },
    { key: "from", header: t.changeLog.from },
    { key: "to", header: t.changeLog.to },
  ];

  const changeRows: Row[] = changes.map((c) => ({
    key: c.id,
    cells: [
      <span key="t" className="whitespace-nowrap tabular-nums">
        {c.timestamp}
      </span>,
      c.user,
      `${c.entity} ${c.entityId}`,
      c.field,
      /* A null is "there was no value", which is not the same as "unknown". */
      c.oldValue ?? <span className="text-muted-foreground">{i18n.common.none}</span>,
      c.newValue ?? <span className="text-muted-foreground">{i18n.common.none}</span>,
    ],
    sort: [c.timestamp, c.user, `${c.entity} ${c.entityId}`, c.field, c.oldValue ?? "", c.newValue ?? ""],
  }));

  const eventColumns: Column[] = [
    { key: "time", header: t.eventLog.time, sortable: true },
    { key: "type", header: t.eventLog.type, sortable: true },
    { key: "detail", header: t.eventLog.detail },
  ];

  const eventRows: Row[] = events.map((e) => ({
    key: e.id,
    cells: [
      <span key="t" className="whitespace-nowrap tabular-nums">
        {e.timestamp}
      </span>,
      EVENT_TYPE_LABEL[lang][e.type],
      e.detail,
    ],
    sort: [e.timestamp, EVENT_TYPE_LABEL[lang][e.type], e.detail],
  }));

  const watchwordColumns: Column[] = [
    { key: "term", header: t.watchwords.term, sortable: true },
    { key: "source", header: t.watchwords.source, sortable: true },
  ];

  const watchwordRows: Row[] = watchwords.map((w) => ({
    key: w.term,
    cells: [
      w.term,
      /* `origin` is set by the predefined table; a term promoted from a party
         meeting arrives without one, and that is what tells them apart. */
      <Badge key="s" tone={w.origin ? "neutral" : "attention"}>
        {w.origin ? t.watchwords.predefined : t.watchwords.added}
      </Badge>,
    ],
    sort: [w.term, w.origin ? "0" : "1"],
  }));

  return (
    <AppShell role={session.role} requires="administration" dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      <PageHeading
        title={t.title}
        subtitle={t.subtitle}
        tags={["FH-001", "FH-002", "NFL-003", "NFL-004"]}
        /*
          NFL-004 — *"tillgång till loggarna via ett administrativt gränssnitt
          eller exportfunktion utan att behöva kontakta leverantören"*. The
          interface is this screen, and the export that actually runs is the
          print: it needs no server, and it carries MI's letterhead and an
          Utskriftsdatum the way their own printouts do.
        */
        action={<PrintButton lang={lang} />}
      />

      {/*
        US-13's second half. §3.1 gives this role "systemkonfiguration", and the
        screen had two logs and a support table — things to read, and nothing to
        administer.
      */}
      <div className="mb-5">
        <SystemSettings
          lang={lang}
          timeoutMinutes={session.sessionTimeoutMinutes}
          watchwordCount={watchwords.length}
        />
      </div>

      <Panel title={t.changeLog.heading} tags={["FH-001"]}>
        <p className="mb-4 max-w-4xl text-table">{t.changeLog.intro}</p>
        <DataTable
          columns={changeColumns}
          rows={changeRows}
          lang={lang}
          caption={t.changeLog.heading}
          minWidth="70rem"
        />
      </Panel>

      <div className="mt-5 grid grid-cols-1 gap-5 @5xl:grid-cols-2">
        <Panel title={t.eventLog.heading} tags={["FH-002"]}>
          <p className="mb-3 max-w-3xl text-table">{t.eventLog.intro}</p>
          <DataTable
            columns={eventColumns}
            rows={eventRows}
            lang={lang}
            caption={t.eventLog.heading}
            minWidth="34rem"
          />
        </Panel>

        {/*
          FAI-004's table, maintained here rather than inside the registration
          flow: the terms are set ahead of the bargaining round, and the screen
          that reads them is not the screen that owns them.
        */}
        <Panel title={t.watchwords.heading} tags={["FAI-004"]}>
          <p className="mb-3 max-w-3xl text-table">{t.watchwords.intro}</p>
          <DataTable
            columns={watchwordColumns}
            rows={watchwordRows}
            lang={lang}
            caption={t.watchwords.heading}
            minWidth="26rem"
          />
          <Rationale>{t.watchwords.note}</Rationale>
        </Panel>
      </div>

      <div className="mt-5">
        <Panel title={t.retention.heading} tags={["NFL-003", "NFL-004"]}>
          <Callout tone="ok" label={t.retention.heading}>
            {t.retention.body}
          </Callout>
          <div className="mt-4">
            <Button variant="secondary" disabled disabledReason={i18n.common.notInDemo}>
              {t.retention.export}
            </Button>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
