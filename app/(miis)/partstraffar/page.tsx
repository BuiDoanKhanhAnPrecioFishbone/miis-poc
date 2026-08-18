import type { Metadata } from "next";
import Link from "next/link";

import { AppShell } from "@/components/miis/AppShell";
import { DataTable, type Column, type Row } from "@/components/miis/DataTable";
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

/**
 * The party-meeting register.
 *
 * The list and one meeting's detail used to sit on the same page, which made
 * the table look selectable when it was not — the detail was pinned to
 * whichever meeting happened to have been held. A register that ignores the row
 * you click is worse than no register, so the two are separate now: this page
 * lists, `/partstraffar/[id]` opens one, and `/partstraffar/ny` starts an empty
 * one. That is also the shape `/medling` already uses.
 */
export default async function PartstraffarPage() {
  const session = await getSession();
  const { i18n, lang } = session;
  const meetings = await listPartyMeetings();
  const t = i18n.partstraffar;

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
      <Link
        key="p"
        href={`/partstraffar/${m.id}`}
        className="font-semibold text-primary underline underline-offset-2"
      >
        {m.party}
      </Link>,
      text(m.agreementArea, lang),
      <Badge key="s" tone={m.state === "planned" ? "neutral" : "ok"}>
        {MEETING_STATE_LABEL[lang][m.state]}
      </Badge>,
      m.demands.length,
    ],
    sort: [
      m.date,
      m.party,
      text(m.agreementArea, lang),
      MEETING_STATE_LABEL[lang][m.state],
      m.demands.length,
    ],
  }));

  return (
    <AppShell role={session.role} dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      <PageHeading
        title={t.title}
        subtitle={t.subtitle}
        tags={["FF-004", "FF-005", "FSD-002"]}
        action={
          <Link
            href="/partstraffar/ny"
            className="inline-flex min-h-12 items-center rounded-sm border-2 border-transparent bg-primary px-5 py-3 font-bold text-primary-foreground transition-colors hover:bg-[var(--mi-slate-900)]"
          >
            {t.register.create}
          </Link>
        }
      />

      <Panel title={t.register.heading} tags={["FF-004"]}>
        <p className="mb-3 max-w-4xl text-table">{t.register.intro}</p>
        <DataTable columns={columns} rows={rows} lang={lang} caption={t.register.heading} />
        {/*
          A party meeting is MI meeting one party at a time — never both
          together — and it is explicitly not a negotiation (Bilaga 1 §4.2).
          Saying so matters: the instrument works precisely because the other
          side is not in the room.
        */}
        <Rationale>{t.register.onePartyNote}</Rationale>
      </Panel>
    </AppShell>
  );
}
