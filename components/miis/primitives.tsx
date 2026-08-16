/**
 * Shared MIIS presentation primitives.
 *
 * These are server components on purpose — no hooks, no state. That lets pages
 * stay server-rendered and `await` data directly. Anything interactive belongs
 * in its own "use client" component.
 */

import type { ReactNode } from "react";

import type { StatusInfo } from "@/lib/domain/status";

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
              <h2 className="font-display text-xl font-semibold text-[var(--mi-slate-900)]">
                {title}
              </h2>
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

/**
 * A read-only field display for the mockup. Deliberately not a <label>, since
 * there is no form control to associate it with — a label pointing at nothing
 * is worse for screen readers than a plain caption.
 */
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
      {(label || ai) && (
        <div className="mb-1 flex items-center gap-2">
          {label && <span className="text-[0.95rem] font-bold text-foreground">{label}</span>}
          {ai && (
            <span className="rounded-sm border border-ai-border bg-ai px-2 py-0.5 text-[0.7rem] font-bold tracking-wide text-ai-foreground">
              AI-FÖRSLAG
            </span>
          )}
        </div>
      )}
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

/**
 * FR-012 status marker. Takes the whole StatusInfo so the colour can never be
 * rendered without its label — the label is visually hidden in dense tables but
 * always present for assistive technology (WCAG 2.1 AA, 1.4.1).
 */
export function StatusDot({ status, visaEtikett = false }: { status: StatusInfo; visaEtikett?: boolean }) {
  const bg =
    status.farg === "green"
      ? "bg-status-green"
      : status.farg === "red"
        ? "bg-status-red"
        : "bg-status-blue";

  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden className={`inline-block size-3 rounded-full ${bg}`} />
      <span className={visaEtikett ? "text-sm" : "sr-only"}>{status.etikett}</span>
    </span>
  );
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
          <h1 className="font-display text-4xl font-medium tracking-tight text-[var(--mi-slate-900)]">
            {title}
          </h1>
          {tags?.map((t) => <ReqTag key={t} id={t} />)}
        </div>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
