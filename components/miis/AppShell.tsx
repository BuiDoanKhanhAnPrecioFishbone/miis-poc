"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /*
    Below `md` the menu was a permanently open list above the content, capped
    at `max-h-56` and scrolled. That works for nine items and stops working for
    twelve: a scrolling strip of links is not navigation, and the first thing a
    phone user sees should be the page they asked for. It is a disclosure now.

    Nothing changes at `md` and up — the rail is still one DOM, still no
    JavaScript for its layout — so the desktop the evaluators will use is
    untouched.
  */
  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);
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
        onClick={() => setMenuOpen(false)}
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
          className="w-full shrink-0 border-b border-sidebar-border bg-sidebar md:w-44 md:border-b-0 md:border-r md:py-4 lg:w-60"
        >
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="huvudmeny"
            className="flex min-h-12 w-full items-center gap-3 px-5 py-3 text-left text-table font-bold text-sidebar-foreground md:hidden"
          >
            {/* Three bars, or a cross when open — the state is in `aria-expanded`
                for assistive technology and in the shape for everyone else. */}
            <span aria-hidden className="grid size-5 shrink-0 place-items-center">
              <span
                className={`relative block h-0.5 w-5 bg-current transition-all before:absolute before:left-0 before:block before:h-0.5 before:w-5 before:bg-current before:transition-all before:content-[''] after:absolute after:left-0 after:block after:h-0.5 after:w-5 after:bg-current after:transition-all after:content-[''] ${
                  menuOpen
                    ? "rotate-45 before:top-0 before:rotate-90 after:top-0 after:opacity-0"
                    : "before:-top-1.5 after:top-1.5"
                }`}
              />
            </span>
            {t.common.mainMenu}
          </button>

          <ul
            id="huvudmeny"
            className={`space-y-0.5 pb-2 md:block md:pb-0 ${menuOpen ? "block" : "hidden"}`}
          >
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
