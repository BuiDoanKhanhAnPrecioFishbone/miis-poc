import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/miis/Placeholder";
import { getSession } from "@/lib/session";

/** Requirement IDs are structure, so they stay here; the sentences are copy. */
const FEATURE_IDS = ["NFÅ-001", "NFÅ-003", "NFÅ-005", "NFL-001"];

export async function generateMetadata(): Promise<Metadata> {
  const { i18n } = await getSession();
  const title = `${i18n.common.appName} – ${i18n.anvandare.title}`;
  const description = i18n.anvandare.subtitle;
  return { title, description, openGraph: { title, description } };
}

export default async function AnvandarePage() {
  const session = await getSession();
  const t = session.i18n.anvandare;

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
