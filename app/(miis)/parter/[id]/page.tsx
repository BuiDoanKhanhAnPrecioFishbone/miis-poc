import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/miis/AppShell";
import { IconBack } from "@/components/miis/icons";
import { NameChange } from "@/components/miis/NameChange";
import { PartyContacts } from "@/components/miis/PartyContacts";
import { Badge, Field, PageHeading, Panel, Rationale } from "@/components/miis/primitives";
import { agreementsForParty, getParty } from "@/lib/data/parties";
import { SECTOR_LABEL } from "@/lib/domain/agreement";
import { PARTY_TYPE_ABBREVIATION, PARTY_TYPE_LABEL } from "@/lib/domain/party";
import { getSession } from "@/lib/session";

/**
 * A party, and the change that makes the register worth having.
 *
 * FP-004 is the requirement this page exists for, and it is exact:
 *
 * > Namnändring på en part ska kunna göras på ett ställe och automatiskt slå
 * > igenom i samtliga gällande avtal. Namnändringar ska inte slå igenom på
 * > historiska avtal.
 *
 * One place, every current agreement, and never a historical one. That last
 * clause is the hard half — an agreement signed in 2019 has to keep showing the
 * organisation that actually signed it, or every report about the past quietly
 * rewrites it. The screen shows both halves side by side rather than claiming
 * the rule holds.
 */

/** The register's "today". Fixed, so screenshots do not drift. */
const TODAY = "2027-06-01";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { i18n } = await getSession();
  const party = await getParty((await params).id);
  return { title: `${i18n.common.appName} – ${party?.name ?? i18n.parter.title}` };
}

export default async function PartyPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  const { i18n, lang } = session;
  const { id } = await params;
  const party = await getParty(id);
  if (!party) notFound();
  const { current, historical } = await agreementsForParty(id, TODAY);
  const t = i18n.parter;

  return (
    <AppShell
      walkthrough={session.walkthrough} role={session.role} requires="parter" dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      <PageHeading
        title={party.name}
        subtitle={PARTY_TYPE_LABEL[lang][party.type]}
        tags={["FP-001", "FP-002", "FP-004", "FP-006"]}
        back={
          <Link href="/parter" className="font-semibold text-primary underline underline-offset-2">
            <IconBack /> {t.title}
          </Link>
        }
      />

      <Panel title={t.detail.identity} tags={["FP-001", "FP-002"]}>
        <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4">
          <Field label={t.table.type} value={PARTY_TYPE_ABBREVIATION[party.type]} />
          <Field
            label={t.table.sector}
            value={party.sector ? SECTOR_LABEL[lang][party.sector] : i18n.common.none}
            hint={party.type === "employee" ? t.detail.sectorEmployeeHint : undefined}
          />
          <Field label={t.table.group} value={party.employerGroup ?? i18n.common.none} />
          <Field
            label={t.detail.industryCode}
            value={party.industryCode ?? i18n.common.none}
            hint={t.detail.industryCodeHint}
          />
        </div>
      </Panel>

      <div className="mt-5">
        <NameChange
          party={party}
          lang={lang}
          today={TODAY}
          current={current.map((a) => ({ id: a.id, name: a.name, validTo: a.validTo }))}
          historical={historical.map((a) => ({ id: a.id, name: a.name, validTo: a.validTo }))}
        />
      </div>

      {/*
        FP-006's verb is *"stödja **koppling till** kontaktpersoner"*, and the
        panel could only display one. An organisation's negotiator changes every
        bargaining round; a list with no way in supports nothing.
      */}
      <div className="mt-5">
        <PartyContacts contacts={party.contacts} lang={lang} />
      </div>

      <div className="mt-5">
        <Panel title={t.detail.status} tags={["FP-002", "FH-001"]}>
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone={party.active ? "ok" : "neutral"}>
              {party.active ? t.detail.active : t.detail.inactive}
            </Badge>
            <span className="text-label text-muted-foreground">{t.detail.logNote}</span>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
