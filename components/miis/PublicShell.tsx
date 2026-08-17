"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import type { DatasetName } from "@/lib/domain/dataset";
import type { Lang } from "@/lib/domain/lang";
import type { Role } from "@/lib/domain/role";
import { dictionary } from "@/lib/i18n";
import { DemoBar } from "./DemoBar";

/**
 * US-14 — the public computer's entrance.
 *
 * Built as a **reduced version of the same system**, not as a kiosk. The people
 * who use it are journalists and union researchers who need to make a selection
 * and get something useful out; oversized buttons and minimal typing would make
 * that harder, not easier. (Whether the physical setup argues otherwise is one
 * of the open questions for MI.)
 *
 * It carries no main menu, no editing anywhere and a standing "Publik vy"
 * marker, so there is never a doubt about which surface is on screen — that
 * separation is what NFÅ-004, NFÅ-006 and D-002 are about.
 */
export function PublicShell({
  lang,
  dataset,
  role,
  reqTags,
  children,
}: {
  lang: Lang;
  dataset: DatasetName;
  role: Role;
  reqTags: boolean;
  children: ReactNode;
}) {
  const t = dictionary(lang);

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#innehall"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-sm focus:bg-card focus:px-4 focus:py-2 focus:font-bold"
      >
        {t.common.skipToContent}
      </a>

      {/* No session control here — NFÅ-006 makes this entrance login-free. */}
      <DemoBar role={role} dataset={dataset} lang={lang} reqTags={reqTags} />

      <header className="border-b-4 border-[var(--mi-sand-500)] bg-primary text-primary-foreground">
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-4">
            {/* Placeholder mark — see CLAUDE.md. The official logo is never redrawn. */}
            <span
              aria-hidden
              className="grid size-11 shrink-0 place-items-center rounded-sm bg-[var(--mi-sand-500)] font-display text-section font-bold text-[var(--mi-ink)]"
            >
              MI
            </span>
            <span className="leading-tight">
              <span className="block font-display text-section font-semibold">
                {t.common.appName}
              </span>
              <span className="block text-label opacity-85">{t.common.appSubtitle}</span>
            </span>
          </div>
          <span className="rounded-sm border-2 border-public-border bg-public px-4 py-2 text-label font-bold text-public-foreground">
            {t.allmanheten.publicMarker}
          </span>
        </div>
      </header>

      <main id="innehall" className="@container mx-auto max-w-6xl px-5 py-8 sm:px-8">
        {children}
        <p className="mt-8 border-t border-border pt-4 text-label text-muted-foreground">
          <Link href="/" className="font-semibold text-primary underline underline-offset-2">
            {t.common.appName}
          </Link>{" "}
          · {t.allmanheten.subtitle}
        </p>
      </main>
    </div>
  );
}
