"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import type { DatasetName } from "@/lib/domain/dataset";
import type { Lang } from "@/lib/domain/lang";
import { isHeadingOnly, navFor, NAV_HREF, type NavId } from "@/lib/domain/nav";
import type { RoleInfo } from "@/lib/domain/role";
import { dictionary } from "@/lib/i18n";
import { DemoBar } from "./DemoBar";
import { SessionTimeoutWarning } from "./SessionTimeoutWarning";

/**
 * The application shell: demo bar, header, role-filtered navigation, content.
 *
 * There is no assistant panel here any more. The only free-standing AI surface
 * in MIIS is the §4.1 decision-support panel on a mediation case, which is what
 * the requirements actually describe; a general chatbot on all eleven screens
 * was functionality nobody asked for, on a bid partly scored on demonstrated
 * understanding of the assignment.
 */

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function AppShell({
  role,
  dataset,
  lang,
  reqTags,
  children,
}: {
  role: RoleInfo;
  dataset: DatasetName;
  lang: Lang;
  reqTags: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [sessionWarning, setSessionWarning] = useState(false);
  const t = dictionary(lang);
  const nav = navFor(role.nav);

  function itemClass(active: boolean, nested: boolean) {
    return [
      "block border-l-4 py-3 text-table transition-colors",
      nested ? "pl-9 pr-4" : "px-5",
      active
        ? "border-[var(--mi-sand-500)] bg-sidebar-accent font-bold text-sidebar-accent-foreground"
        : "border-transparent text-sidebar-foreground hover:bg-sidebar-accent/60",
    ].join(" ");
  }

  function NavLink({ id, nested = false }: { id: NavId; nested?: boolean }) {
    const href = NAV_HREF[id];
    const active = isActive(pathname, href);
    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={itemClass(active, nested)}
      >
        {t.nav[id]}
      </Link>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#innehall"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-sm focus:bg-card focus:px-4 focus:py-2 focus:font-bold"
      >
        {t.common.skipToContent}
      </a>

      <DemoBar
        role={role.id}
        dataset={dataset}
        lang={lang}
        reqTags={reqTags}
        onShowSessionWarning={() => setSessionWarning(true)}
      />

      <header className="border-b-4 border-[var(--mi-sand-500)] bg-primary text-primary-foreground">
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-4">
            {/* Placeholder mark. The official MI logo contains a protected state
                emblem and must never be redrawn — see CLAUDE.md. */}
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
          </Link>
          <div className="text-right text-label leading-tight opacity-90">
            <div>{t.common.loggedInVia}</div>
            <div>
              {role.person} · {role.label}
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[60vh] flex-col md:flex-row">
        {/*
          NFUI-002 responsive. Below 768px the menu stacks above the content with
          its own scroll, so it never eats the screen; 768–1023px it is a narrow
          rail; from 1024px the full 240px rail. One DOM, no JavaScript, no
          hydration flash.
        */}
        <nav
          aria-label={t.common.mainMenu}
          className="w-full shrink-0 border-b border-sidebar-border bg-sidebar py-2 md:w-44 md:border-b-0 md:border-r md:py-4 lg:w-60"
        >
          <ul className="max-h-56 space-y-0.5 overflow-y-auto md:max-h-none md:overflow-visible">
            {nav.map((node) => (
              <li key={node.id}>
                {isHeadingOnly(node, role.nav) ? (
                  <span className="block px-5 py-2 text-meta font-bold uppercase tracking-wide text-muted-foreground">
                    {t.nav[node.id]}
                  </span>
                ) : (
                  <NavLink id={node.id} />
                )}
                {node.children && node.children.length > 0 && (
                  <ul className="space-y-0.5">
                    {node.children.map((child) => (
                      <li key={child}>
                        <NavLink id={child} nested />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <main
          id="innehall"
          className="@container min-w-0 flex-1 bg-background px-5 py-8 sm:px-8 xl:px-10"
        >
          {children}
        </main>
      </div>

      <SessionTimeoutWarning
        lang={lang}
        forcedOpen={sessionWarning}
        onDismiss={() => setSessionWarning(false)}
      />
    </div>
  );
}
