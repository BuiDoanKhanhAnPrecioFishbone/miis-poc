import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/miis/Placeholder";
import { getSession } from "@/lib/session";

/** Requirement IDs are structure, so they stay here; the sentences are copy. */
const FEATURE_IDS = ["FF-009", "FF-009", "FE-001", "FH-001", "D-004"];

export async function generateMetadata(): Promise<Metadata> {
  const { i18n } = await getSession();
  const title = `${i18n.common.appName} – ${i18n.medlare.title}`;
  const description = i18n.medlare.subtitle;
  return { title, description, openGraph: { title, description } };
}

export default async function MedlarePage() {
  const session = await getSession();
  const t = session.i18n.medlare;

  return (
    <PlaceholderPage
      title={t.title}
      epic={t.epic}
      subtitle={t.subtitle}
      features={t.features}
      featureIds={FEATURE_IDS}
      role={session.role}
      dataset={session.dataset}
      lang={session.lang}
      reqTags={session.reqTags}
      i18n={session.i18n}
    />
  );
}
