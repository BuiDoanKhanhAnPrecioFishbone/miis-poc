import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/miis/Placeholder";
import { getSession } from "@/lib/session";

/** Requirement IDs are structure, so they stay here; the sentences are copy. */
/*
  Every Ska-krav in Bilaga 1 §5.2 that no built screen shows, so chapter 5 is
  covered end to end rather than only where a screen happens to exist. The
  order matches the sentences in `i18n.avtal.features` — Placeholder pairs the
  two positionally.
*/
const FEATURE_IDS = [
  "FA-001",
  "FA-002",
  "FA-003",
  "FA-004",
  "FA-005",
  "FA-006",
  "FA-011",
  "FA-013",
  "FA-014",
  "FA-015",
  "FA-016",
  "FA-017",
  "FA-021",
  "FA-022",
];

export async function generateMetadata(): Promise<Metadata> {
  const { i18n } = await getSession();
  const title = `${i18n.common.appName} – ${i18n.avtal.title}`;
  const description = i18n.avtal.subtitle;
  return { title, description, openGraph: { title, description } };
}

export default async function AvtalPage() {
  const session = await getSession();
  const t = session.i18n.avtal;

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
