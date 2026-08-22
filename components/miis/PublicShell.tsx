"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import type { DatasetName } from "@/lib/domain/dataset";
import type { Lang } from "@/lib/domain/lang";
import type { Role } from "@/lib/domain/role";
import type { WalkthroughPosition } from "@/lib/domain/walkthrough";
import { dictionary } from "@/lib/i18n";
import { IconBack } from "./icons";
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
  walkthrough,
  back,
  children,
}: {
  lang: Lang;
  dataset: DatasetName;
  role: Role;
  reqTags: boolean;
  /** The reviewer's place in `/genomgang`, carried into the demo strip. */
  walkthrough?: WalkthroughPosition | null;
  /**
   * The way back, for a member of MI's own staff who arrived from a report.
   *
   * The public view deliberately has no menu — a visitor at the computer in
   * the lobby has one screen and no way to wander — so an officer who followed
   * *Avtal – Allmänheten* here had the browser's Back button and nothing else.
   * This appears only when the officer came from somewhere and only when their
   * role may read that somewhere; the public computer never renders it.
   */
  back?: { href: string; label: string };
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
      <DemoBar role={role} dataset={dataset} lang={lang} reqTags={reqTags} walkthrough={walkthrough} />

      <header className="border-b-4 border-[var(--mi-sand-500)] bg-primary text-primary-foreground">
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-4">
            {/* Placeholder mark — see CLAUDE.md. The official logo is never redrawn. */}
            {/*
              Medlingsinstitutet's own mark, supplied by MI and installed
              verbatim — the crown is a protected state emblem and is never
              redrawn (CLAUDE.md rule 6). The file is the white version, which
              is the one MI's artwork is drawn for: every path is #FFFFFF, i.e.
              it is made for a dark or coloured ground, which is what the header
              is. Its own proportions are 284.8 × 511.5, so it is set by height
              and left to find its width rather than forced into the square the
              placeholder used.
            */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mi-mark-white.svg"
              alt=""
              aria-hidden
              width={25}
              height={44}
              className="h-11 w-auto shrink-0"
            />
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
        {/* Above the content and `print-hide`: a control is not part of a
            document, and this one is not part of the public view either. */}
        {back && (
          <div className="print-hide mb-4">
            <Link
              href={back.href}
              className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline underline-offset-2"
            >
              <IconBack />
              {back.label}
            </Link>
          </div>
        )}
        {children}
        <p className="print-hide mt-8 border-t border-border pt-4 text-label text-muted-foreground">
          <Link href="/" className="font-semibold text-primary underline underline-offset-2">
            {t.common.appName}
          </Link>{" "}
          · {t.allmanheten.subtitle}
        </p>
      </main>
    </div>
  );
}
