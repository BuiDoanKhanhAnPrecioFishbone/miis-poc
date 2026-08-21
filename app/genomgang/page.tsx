import type { Metadata } from "next";
import Link from "next/link";

import { DemoBar } from "@/components/miis/DemoBar";
import { WalkthroughGuide } from "@/components/miis/WalkthroughGuide";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const { i18n } = await getSession();
  const title = `${i18n.common.appName} – ${i18n.walkthrough.title}`;
  const description = i18n.walkthrough.subtitle;
  return { title, description, openGraph: { title, description } };
}

/**
 * The reviewer's guided walkthrough — outside MIIS on purpose.
 *
 * It is not in the `(miis)` route group, so it has no application shell, no
 * navigation and no menu entry: an evaluator can only arrive here from the demo
 * strip or from a link we send them, and nobody can mistake it for proposed
 * functionality. That is the same rule the demo bar follows, and it matters for
 * the same reason — the award criterion includes demonstrated understanding of
 * the assignment's conditions, and inventing a "walkthrough module" would work
 * against it.
 *
 * The address is worth writing down: **miis-poc.vercel.app/genomgang** is where
 * a reviewer should be sent, and it is what the fifteen-minute presentation runs
 * from.
 */
export default async function GenomgangPage() {
  const session = await getSession();
  const { i18n, lang } = session;
  const t = i18n.walkthrough;

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#innehall"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-sm focus:bg-card focus:px-4 focus:py-2 focus:font-bold"
      >
        {i18n.common.skipToContent}
      </a>

      <DemoBar
        role={session.role.id}
        dataset={session.dataset}
        lang={lang}
        reqTags={session.reqTags}
      />

      <main id="innehall" className="@container mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8">
        {/*
          The page says what it is in its first sentence and wears the demo
          strip's own colour rather than the product's. A reviewer has to be able
          to tell the guide from the system in one glance.
        */}
        <div className="rounded-md border-2 border-demo-border bg-demo px-4 py-3">
          <p className="mi-kicker text-demo-foreground">{t.marker}</p>
          <p className="mt-1 max-w-4xl text-table text-demo-foreground">{t.markerBody}</p>
        </div>

        <h1 className="mt-6 font-display text-page-title font-semibold text-[var(--mi-slate-900)]">
          {t.title}
        </h1>
        <p className="mt-2 max-w-4xl text-body">{t.subtitle}</p>

        <div className="mt-8">
          <WalkthroughGuide lang={lang} currentRole={session.role.id} />
        </div>

        <p className="mt-10 border-t border-border pt-4 text-label">
          <Link href="/" className="font-semibold text-primary underline underline-offset-2">
            {t.toStart}
          </Link>
        </p>
      </main>
    </div>
  );
}
