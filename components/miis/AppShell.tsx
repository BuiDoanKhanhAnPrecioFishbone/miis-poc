"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import type { RollInfo } from "@/lib/domain/roll";
import { AiPanel, AiPanelTrigger } from "./AiPanel";
import { RollVaxlare } from "./RollVaxlare";

const nav = [
  { to: "/", label: "Start" },
  { to: "/avtal", label: "Avtal" },
  { to: "/registrera", label: "Registrera avtal" },
  { to: "/parter", label: "Parter" },
  { to: "/forhandlingar", label: "Förhandlingar" },
  { to: "/medling", label: "Medling" },
  { to: "/partstraffar", label: "Partsträffar" },
  { to: "/medlare", label: "Medlare" },
  { to: "/sok", label: "Sök & Rapporter" },
  { to: "/market", label: "Märket" },
  { to: "/administration", label: "Administration" },
] as const;

export function AppShell({
  roll,
  children,
  aiTitle,
  aiIntro,
  aiSuggestions,
  aiReqTag,
}: {
  roll: RollInfo;
  children: ReactNode;
  aiTitle?: string;
  aiIntro?: string;
  aiSuggestions?: string[];
  aiReqTag?: string;
}) {
  const pathname = usePathname();
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#innehall"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-card focus:px-4 focus:py-2 focus:font-bold"
      >
        Hoppa till innehåll
      </a>
      <header className="border-b-4 border-[var(--mi-sand-500)] bg-primary text-primary-foreground">
        <div className="flex flex-wrap items-center justify-between gap-4 px-8 py-5">
          <Link href="/" className="flex items-center gap-4">
            {/* Placeholder mark. The official MI logo contains a protected state
                emblem and must never be redrawn — see CLAUDE.md. */}
            <span
              aria-hidden
              className="grid size-11 place-items-center rounded-sm bg-[var(--mi-sand-500)] font-display text-xl font-bold text-[var(--mi-ink)]"
            >
              MI
            </span>
            <span className="leading-tight">
              <span className="block font-display text-xl font-semibold tracking-tight">MIIS</span>
              <span className="block text-sm opacity-80">
                Medlingsinstitutets informationssystem
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-5">
            <div className="text-right text-sm leading-tight opacity-90">
              <div>miis.mi.se · Inloggad via EFOS</div>
              <div>
                {roll.person} · {roll.etikett}
              </div>
            </div>
            <RollVaxlare aktiv={roll.id} />
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-88px)]">
        <nav
          aria-label="Huvudmeny"
          className="w-60 shrink-0 border-r border-sidebar-border bg-sidebar py-4"
        >
          <ul className="space-y-0.5">
            {nav.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <li key={item.to}>
                  <Link
                    href={item.to}
                    aria-current={active ? "page" : undefined}
                    className={`block border-l-4 px-5 py-3 text-[0.95rem] transition-colors ${
                      active
                        ? "border-[var(--mi-sand-500)] bg-sidebar-accent font-bold text-sidebar-accent-foreground"
                        : "border-transparent text-sidebar-foreground hover:bg-sidebar-accent/60"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <main id="innehall" className="@container min-w-0 flex-1 bg-background px-5 py-8 sm:px-8 xl:px-10">
          <div className="mb-4 flex justify-end">
            {!aiOpen && <AiPanelTrigger onOpen={() => setAiOpen(true)} />}
          </div>
          {children}
        </main>

        {aiOpen && (
          <>
            <button
              type="button"
              aria-label="Stäng AI-assistent"
              onClick={() => setAiOpen(false)}
              className="fixed inset-0 z-30 bg-[var(--mi-ink)]/40 xl:hidden"
            />
            <AiPanel
              title={aiTitle}
              intro={aiIntro}
              suggestions={aiSuggestions}
              reqTag={aiReqTag}
              onClose={() => setAiOpen(false)}
            />
          </>
        )}
      </div>
    </div>
  );
}
