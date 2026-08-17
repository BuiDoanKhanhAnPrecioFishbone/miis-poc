import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/miis/Placeholder";
import { getSession } from "@/lib/session";

/** Requirement IDs are structure, so they stay here; the sentences are copy. */
const FEATURE_IDS = ["FF-001", "FF-002", "FF-003", "FF-004"];

export async function generateMetadata(): Promise<Metadata> {
  const { i18n } = await getSession();
  const title = `${i18n.common.appName} – ${i18n.forhandlingar.title}`;
  const description = i18n.forhandlingar.subtitle;
  return { title, description, openGraph: { title, description } };
}

export default async function ForhandlingarPage() {
  const session = await getSession();
  const t = session.i18n.forhandlingar;

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
