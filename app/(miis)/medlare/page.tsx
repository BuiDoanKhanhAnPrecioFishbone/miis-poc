import type { Metadata } from "next";

import { AppShell } from "@/components/miis/AppShell";
import { MediatorAdmin } from "@/components/miis/MediatorAdmin";
import { Callout, PageHeading, Panel } from "@/components/miis/primitives";
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

  /*
    The derived figures, computed here rather than in the client component.

    `mediatorStats` lives in `lib/data/`, which nothing outside the seam may
    import — and the register is now a client component so an administrator can
    edit a row. So the page computes the statistics and hands them down by id.
    That split is also the honest one: the figures come from the assignment
    history and are not among the things an administrator can change.
  */
  const stats = Object.fromEntries(mediators.map((m) => [m.id, mediatorStats(m)]));

  return (
    <AppShell
      walkthrough={session.walkthrough}
      role={session.role}
      requires="medlare"
      dataset={session.dataset}
      lang={lang}
      reqTags={session.reqTags}
    >
      <PageHeading title={t.title} subtitle={t.subtitle} tags={["FF-009", "D-004"]} />

      {/*
        Bilaga 1 §3.1 gives Medlaradministratör *"registrerar och redigerar
        medlare"* twice over, and both halves are this one panel.

        They were two panels — an inline form above the table for *Ändra*, and a
        separate `NewMediator` below it for *Lägg till*, with the same five
        fields, its own disclosure button and its own confirmation. One register,
        one form. See `MediatorAdmin` for what is editable and what is derived.
      */}
      <MediatorAdmin mediators={mediators} stats={stats} lang={lang} />

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
