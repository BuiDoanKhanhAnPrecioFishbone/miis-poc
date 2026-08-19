import type { Metadata } from "next";
import Link from "next/link";

import { AppShell } from "@/components/miis/AppShell";
import { NewParty } from "@/components/miis/NewParty";
import { PageHeading } from "@/components/miis/primitives";
import { listParties } from "@/lib/data/parties";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const { i18n } = await getSession();
  return { title: `${i18n.common.appName} – ${i18n.parter.newParty.title}` };
}

/**
 * Registering a party.
 *
 * A separate route rather than a dialog, because US-03's merger is a real piece
 * of work — a type, a dated name, the properties FP-001 puts on an employer
 * organisation, and the predecessors this party replaces — and a modal is the
 * wrong container for something an officer may leave and come back to.
 */
export default async function NyPartPage() {
  const session = await getSession();
  const { i18n, lang } = session;
  const register = await listParties();
  const t = i18n.parter;

  return (
    <AppShell role={session.role} dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      <PageHeading
        title={t.newParty.title}
        subtitle={t.newParty.subtitle}
        tags={["FP-001", "FP-002", "FP-006"]}
        back={
          <Link href="/parter" className="font-semibold text-primary underline underline-offset-2">
            ← {t.title}
          </Link>
        }
      />
      <NewParty lang={lang} register={register} />
    </AppShell>
  );
}
