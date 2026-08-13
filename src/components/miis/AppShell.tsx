import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { AiPanel, AiPanelTrigger } from "./AiPanel";

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
  user,
  role,
  children,
  aiTitle,
  aiIntro,
  aiSuggestions,
  aiReqTag,
}: {
  user: string;
  role: string;
  children: ReactNode;
  aiTitle?: string;
  aiIntro?: string;
  aiSuggestions?: string[];
  aiReqTag?: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
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
          <Link to="/" className="flex items-center gap-4">
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
          <div className="text-right text-sm leading-tight opacity-90">
            <div>miis.mi.se · Inloggad via EFOS</div>
            <div>
              {user} · {role}
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-88px)]">
        <nav aria-label="Huvudmeny" className="w-60 shrink-0 border-r border-sidebar-border bg-sidebar py-4">
          <ul className="space-y-0.5">
            {nav.map((item) => {
              const active =
                item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
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

        <main
          id="innehall"
          className="@container min-w-0 flex-1 bg-background px-5 py-8 sm:px-8 xl:px-10"
        >
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

export function ReqTag({ id }: { id: string }) {
  return (
    <span className="inline-flex items-center rounded-sm bg-req px-2.5 py-0.5 text-[0.7rem] font-semibold tracking-wide text-req-foreground">
      {id}
    </span>
  );
}

export function Panel({
  title,
  action,
  tags,
  children,
  tone = "default",
}: {
  title?: string;
  action?: ReactNode;
  tags?: string[];
  children: ReactNode;
  tone?: "default" | "sand" | "mint";
}) {
  const toneClass =
    tone === "sand"
      ? "bg-sand border-sand-border"
      : tone === "mint"
        ? "bg-mint border-mint-border"
        : "card-panel";

  return (
    <section className={`rounded-lg border p-5 ${toneClass}`}>
      {(title || action || tags) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3">
          <div className="flex items-center gap-2">
            {title && (
              <h2 className="font-display text-xl font-semibold text-[var(--mi-slate-900)]">{title}</h2>
            )}
            {tags?.map((t) => <ReqTag key={t} id={t} />)}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Field({
  label,
  value,
  hint,
  ai,
}: {
  label: string;
  value: string;
  hint?: string;
  ai?: boolean;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-2">
        <label className="text-[0.95rem] font-bold text-foreground">{label}</label>
        {ai && (
          <span className="rounded-sm border border-ai-border bg-ai px-2 py-0.5 text-[0.7rem] font-bold tracking-wide text-ai-foreground">
            AI-FÖRSLAG
          </span>
        )}
      </div>
      <div className="field-input">{value}</div>
      {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
}: {
  children: ReactNode;
  variant?: "primary" | "outline";
}) {
  return (
    <button
      type="button"
      className={
        variant === "primary"
          ? "min-h-12 rounded-sm border-2 border-transparent bg-primary px-5 py-3 text-[0.95rem] font-bold text-primary-foreground transition-colors hover:bg-[var(--mi-slate-900)]"
          : "min-h-12 rounded-sm border-2 border-primary bg-transparent px-5 py-3 text-[0.95rem] font-bold text-primary transition-colors hover:bg-secondary"
      }
    >
      {children}
    </button>
  );
}

export function StatusDot({ color }: { color: "green" | "red" | "blue" }) {
  const bg =
    color === "green"
      ? "bg-status-green"
      : color === "red"
        ? "bg-status-red"
        : "bg-status-blue";
  return <span className={`inline-block size-3 rounded-full ${bg}`} />;
}

export function PageHeading({
  title,
  subtitle,
  action,
  tags,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  tags?: string[];
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-4xl font-medium tracking-tight text-[var(--mi-slate-900)]">{title}</h1>
          {tags?.map((t) => <ReqTag key={t} id={t} />)}
        </div>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
