import type { Metadata } from "next";

import { AppShell } from "@/components/miis/AppShell";
import { DataTable, type Column, type Row } from "@/components/miis/DataTable";
import { PartyMeetingView } from "@/components/miis/PartyMeetingView";
import { Badge, PageHeading, Panel, Rationale } from "@/components/miis/primitives";
import { listPartyMeetings } from "@/lib/data/party-meetings";
import { t as text } from "@/lib/domain/lang";
import { MEETING_STATE_LABEL } from "@/lib/domain/party-meeting";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const { i18n } = await getSession();
  const title = `${i18n.common.appName} – ${i18n.partstraffar.title}`;
  const description = i18n.partstraffar.subtitle;
  return { title, description, openGraph: { title, description } };
}

export default async function PartstraffarPage() {
  const session = await getSession();
  const { i18n, lang } = session;
  const meetings = await listPartyMeetings();
  const t = i18n.partstraffar;

  /*
    US-08 opens on a meeting that has been held, because that is where FF-004's
    interactive view has something to show. The register above it is what makes
    the screen a module rather than a single record.
  */
  const current = meetings.find((m) => m.state === "held") ?? meetings[0]!;

  const columns: Column[] = [
    { key: "date", header: t.table.date, sortable: true },
    { key: "party", header: t.table.party, sortable: true },
    { key: "area", header: t.table.area, sortable: true },
    { key: "state", header: t.table.state, sortable: true },
    { key: "demands", header: t.table.demands, numeric: true, sortable: true },
  ];

  const rows: Row[] = meetings.map((m) => ({
    key: m.id,
    cells: [
      <span key="d" className="tabular-nums">
        {m.date}
      </span>,
      <span key="p" className={m.id === current.id ? "font-bold" : ""}>
        {m.party}
      </span>,
      text(m.agreementArea, lang),
      <Badge key="s" tone={m.state === "planned" ? "neutral" : "ok"}>
        {MEETING_STATE_LABEL[lang][m.state]}
      </Badge>,
      m.demands.length,
    ],
    sort: [m.date, m.party, text(m.agreementArea, lang), MEETING_STATE_LABEL[lang][m.state], m.demands.length],
  }));

  return (
    <AppShell role={session.role} dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      <PageHeading
        title={t.title}
        subtitle={t.subtitle}
        tags={["FF-004", "FF-005", "FSD-002", "FAI-004"]}
      />

      {/*
        A party meeting is MI meeting one party at a time — never both together
        — and it is explicitly not a negotiation (Bilaga 1 §4.2). Saying so on
        the screen matters: the whole point of the instrument is that MI can
        hear a party candidly, which only works because the other side is not
        in the room.
      */}
      <Panel title={t.register.heading} tags={["FF-004"]}>
        <p className="mb-3 max-w-4xl text-table">{t.register.intro}</p>
        <DataTable columns={columns} rows={rows} lang={lang} caption={t.register.heading} />
        <Rationale>{t.register.onePartyNote}</Rationale>
      </Panel>

      <div className="mt-5">
        <Panel
          title={t.current.heading(current.party, current.date)}
          tags={["FF-004", "FH-001"]}
          headingLevel={2}
        >
          <PartyMeetingView meeting={current} lang={lang} />
        </Panel>
      </div>
    </AppShell>
  );
}
