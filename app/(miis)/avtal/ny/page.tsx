import type { Metadata } from "next";
import Link from "next/link";

import { AppShell } from "@/components/miis/AppShell";
import { IconBack } from "@/components/miis/icons";
import { NewAgreement } from "@/components/miis/NewAgreement";
import { PageHeading } from "@/components/miis/primitives";
import { listAgreementAreas, listAgreements } from "@/lib/data/agreements";
import { listEmployeeOrgs, listEmployerOrgs } from "@/lib/data/parties";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const { i18n } = await getSession();
  const title = `${i18n.common.appName} – ${i18n.avtal.newAgreement.title}`;
  return { title, description: i18n.avtal.newAgreement.subtitle };
}

/**
 * US-02 — a wholly new collective agreement, registered by hand.
 *
 * Bilaga 2 §3.5 makes this the first bullet of the scored agreement
 * administrator scenario, and it had no screen: `/registrera` reads an incoming
 * protocol against an agreement MIIS already holds, which is a different task
 * with a different starting point.
 *
 * It is reached from the register rather than from the menu, for the same
 * reason `/registrera` is: registration is an action, not a place.
 */
export default async function NewAgreementPage() {
  const session = await getSession();
  const { i18n, lang } = session;
  const t = i18n.avtal.newAgreement;

  const [employerOrgs, employeeOrgs, areas, agreements] = await Promise.all([
    listEmployerOrgs(),
    listEmployeeOrgs(),
    listAgreementAreas(),
    listAgreements(),
  ]);

  /* The types already in use, so a new agreement joins the vocabulary the
     reports group by rather than inventing a fourteenth spelling of one. */
  const agreementTypes = [...new Set(agreements.map((a) => a.agreementType))].sort((a, b) =>
    a.localeCompare(b, "sv"),
  );

  return (
    <AppShell
      walkthrough={session.walkthrough}
      role={session.role}
      requires="avtal"
      dataset={session.dataset}
      lang={lang}
      reqTags={session.reqTags}
    >
      <PageHeading
        title={t.title}
        subtitle={t.subtitle}
        tags={["FA-001", "FA-005", "FAI-002"]}
        back={
          <Link
            href="/avtal"
            className="inline-flex min-h-11 items-center gap-1 text-label font-semibold text-primary underline underline-offset-2"
          >
            <IconBack /> {i18n.common.backTo(i18n.avtal.title)}
          </Link>
        }
      />

      <NewAgreement
        lang={lang}
        employerOrgs={employerOrgs.map((p) => p.name)}
        employeeOrgs={employeeOrgs.map((p) => p.name)}
        agreementTypes={agreementTypes}
        areas={areas}
      />
    </AppShell>
  );
}
