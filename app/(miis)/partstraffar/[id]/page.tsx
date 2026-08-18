import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/miis/AppShell";
import { PartyMeetingView } from "@/components/miis/PartyMeetingView";
import { PageHeading } from "@/components/miis/primitives";
import { getPartyMeeting } from "@/lib/data/party-meetings";
import { listEmployeeOrgs } from "@/lib/data/parties";
import type { PartyMeeting } from "@/lib/domain/party-meeting";
import { getSession } from "@/lib/session";

/**
 * One party meeting, through MI's three phases.
 *
 * `ny` is a real id here rather than a separate route: a new meeting is the
 * same record with nothing in it, which is what US-08 starts from — *"a party
 * meeting is booked ahead of a bargaining round"* and nothing has been
 * registered yet. It is also the state that shows what the screen is *for*,
 * the way `/registrera` opens on an empty drop zone rather than a filled form.
 */
const EMPTY: PartyMeeting = {
  id: "ny",
  party: "",
  partyType: "employee",
  agreementArea: { sv: "", en: "" },
  date: "",
  location: { sv: "", en: "" },
  state: "planned",
  purpose: { sv: "", en: "" },
  agenda: [],
  participants: [],
  notes: [],
  demands: [],
  documents: [],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { i18n, lang } = await getSession();
  const { id } = await params;
  const meeting = id === "ny" ? EMPTY : await getPartyMeeting(id);
  const name = meeting && meeting.id !== "ny" ? meeting.party : i18n.partstraffar.newMeeting.title;
  void lang;
  return { title: `${i18n.common.appName} – ${name}` };
}

export default async function PartyMeetingPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  const { i18n, lang } = session;
  const { id } = await params;
  const [meeting, employeeOrgs] = await Promise.all([
    id === "ny" ? Promise.resolve(EMPTY) : getPartyMeeting(id),
    listEmployeeOrgs(),
  ]);
  if (!meeting) notFound();
  const t = i18n.partstraffar;
  const isNew = meeting.id === "ny";

  return (
    <AppShell role={session.role} dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      <PageHeading
        title={isNew ? t.newMeeting.title : t.current.heading(meeting.party, meeting.date)}
        subtitle={isNew ? t.newMeeting.subtitle : t.subtitle}
        tags={["FF-004", "FF-005", "FSD-002", "FAI-004"]}
        back={
          <Link
            href="/partstraffar"
            className="font-semibold text-primary underline underline-offset-2"
          >
            ← {t.title}
          </Link>
        }
      />

      <PartyMeetingView
        meeting={meeting}
        lang={lang}
        unions={employeeOrgs.map((p) => p.name)}
      />
    </AppShell>
  );
}
