import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/miis/Placeholder";
import { getSession } from "@/lib/session";

/** Requirement IDs are structure, so they stay here; the sentences are copy. */
const FEATURE_IDS = ["FP-001", "FP-002", "FP-003", "FP-004", "FP-005", "FP-006"];

export async function generateMetadata(): Promise<Metadata> {
  const { i18n } = await getSession();
  const title = `${i18n.common.appName} – ${i18n.parter.title}`;
  const description = i18n.parter.subtitle;
  return { title, description, openGraph: { title, description } };
}

export default async function ParterPage() {
  const session = await getSession();
  const t = session.i18n.parter;

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
