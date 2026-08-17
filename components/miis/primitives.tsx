/**
 * Shared MIIS presentation primitives.
 *
 * These are plain components — no hooks, no state, no async. That lets pages
 * stay server-rendered AND lets the same primitives be used inside the few
 * "use client" screens without a second set of look-alikes. Anything that needs
 * the request (role, language, cookies) is resolved in the page and passed in.
 */

import type { ReactNode } from "react";

import { REQUIREMENTS } from "@/lib/domain/requirements";
import type { StatusInfo } from "@/lib/domain/status";

/**
 * A requirement ID, rendered as a margin annotation.
 *
 * Visibility is CSS, not a prop: `<html data-reqtags="off">` hides every tag at
 * once, so a tag can be dropped anywhere in the tree — server or client — with
 * no plumbing. `visibility: hidden` rather than `display: none` is deliberate:
 * the space stays reserved, so toggling the tags on and off does not reflow the
 * page and an evaluator can compare the two views of the same screen.
 *
 * The tooltip carries the requirement sentence in both languages and CSS shows
 * the active one, for the same reason — no language prop at 200 call sites.
 *
 * The chip is focusable so a keyboard user can reach the sentence. It is not a
 * control and has no action, which is why the 44×44 target rule for actionable
 * elements is not applied to it.
 */
export function ReqTag({ id }: { id: string }) {
  const requirement = REQUIREMENTS[id];
  const tipId = `req-${id.replace(/[^\w-]/g, "")}`;

  return (
    <span className="req-tag group relative inline-flex align-middle">
      <span
        tabIndex={0}
        aria-describedby={requirement ? tipId : undefined}
        className="inline-flex items-center rounded-sm border border-req-border bg-req px-2 py-0.5 text-meta font-bold tracking-wide text-req-foreground"
      >
        {id}
      </span>
      {requirement && (
        <span
          id={tipId}
          role="tooltip"
          className="req-tip pointer-events-none absolute left-0 top-full z-50 mt-1 hidden w-80 max-w-[min(20rem,70vw)] rounded-md border-2 border-req-border bg-card p-3 text-label font-normal leading-snug text-foreground shadow-card group-hover:block group-focus-within:block"
        >
          <span className="mb-1 block text-meta font-bold tracking-wide text-muted-foreground">
            {id}
          </span>
          <span className="req-sv">{requirement.sv}</span>
          <span className="req-en">{requirement.en}</span>
        </span>
      )}
    </span>
  );
}

/** Several tags in a row, e.g. on a panel heading. */
export function ReqTags({ ids }: { ids?: readonly string[] }) {
  if (!ids || ids.length === 0) return null;
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {ids.map((id) => (
        <ReqTag key={id} id={id} />
      ))}
    </span>
  );
}

export function Panel({
  title,
  action,
  tags,
  children,
  tone = "default",
  headingLevel = 2,
}: {
  title?: string;
  action?: ReactNode;
  tags?: readonly string[];
  children: ReactNode;
  tone?: "default" | "sand" | "mint" | "demo";
  /** Drops to 3 when the panel sits under another heading — order matters (WCAG 1.3.1). */
  headingLevel?: 2 | 3;
}) {
  const toneClass =
    tone === "sand"
      ? "bg-sand border-sand-border"
      : tone === "mint"
        ? "bg-mint border-mint-border"
        : tone === "demo"
          ? "bg-demo border-demo-border"
          : "card-panel";

  const Heading = headingLevel === 3 ? "h3" : "h2";

  return (
    <section className={`rounded-lg border p-5 ${toneClass}`}>
      {(title || action || tags) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            {title && (
              <Heading className="font-display text-section font-semibold text-[var(--mi-slate-900)]">
                {title}
              </Heading>
            )}
            <ReqTags ids={tags} />
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
 *
 * `masked` is D-002: a confidentiality-marked value is replaced by a neutral
 * placeholder with a stated reason, never left as an empty gap. An empty field
 * reads as missing data; a masked one reads as withheld data, and those are
 * different facts.
 */
export function Field({
  label,
  value,
  hint,
  ai,
  aiLabel,
  masked,
  maskedText,
  maskedReason,
}: {
  label: string;
  value: string;
  hint?: string;
  ai?: boolean;
  aiLabel?: string;
  masked?: boolean;
  maskedText?: string;
  maskedReason?: string;
}) {
  return (
    <div>
      {(label || ai) && (
        <div className="mb-1 flex flex-wrap items-center gap-2">
          {label && <span className="text-label font-bold text-foreground">{label}</span>}
          {ai && aiLabel && (
            <span className="rounded-sm border border-ai-border bg-ai px-2 py-0.5 text-meta font-bold tracking-wide text-ai-foreground">
              {aiLabel}
            </span>
          )}
        </div>
      )}
      {masked ? (
        <div className="field-input flex items-center gap-2 border-dashed text-muted-foreground">
          <span aria-hidden>🔒</span>
          <span>{maskedText}</span>
        </div>
      ) : (
        <div className="field-input">{value}</div>
      )}
      {masked && maskedReason && (
        <p className="mt-1 text-label text-muted-foreground">{maskedReason}</p>
      )}
      {!masked && hint && <p className="mt-1 text-label text-muted-foreground">{hint}</p>}
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
          ? "min-h-12 rounded-sm border-2 border-transparent bg-primary px-5 py-3 text-table font-bold text-primary-foreground transition-colors hover:bg-[var(--mi-slate-900)]"
          : "min-h-12 rounded-sm border-2 border-primary bg-transparent px-5 py-3 text-table font-bold text-primary transition-colors hover:bg-secondary"
      }
    >
      {children}
    </button>
  );
}

/**
 * FR-012 status marker.
 *
 * Three carriers of the same fact: colour, shape and label. Colour alone fails
 * WCAG 1.4.1 and greyscale printing; the previous version differed only by hue,
 * with all three states drawn as the same filled circle. Now a newly signed
 * agreement is a filled circle, one signed after mediation a filled square, and
 * a remaining one a hollow ring — legible with no colour at all.
 *
 * 16px, because a 12px mark is too small for the shape to be readable.
 */
export function StatusDot({
  status,
  showLabel = false,
}: {
  status: StatusInfo;
  showLabel?: boolean;
}) {
  const color =
    status.color === "green"
      ? "var(--status-green)"
      : status.color === "red"
        ? "var(--status-red)"
        : "var(--status-blue)";

  const shapeClass =
    status.shape === "square" ? "rounded-[2px]" : status.shape === "ring" ? "rounded-full" : "rounded-full";

  const style =
    status.shape === "ring"
      ? { borderColor: color, borderWidth: "3px", backgroundColor: "transparent" }
      : { backgroundColor: color, borderColor: color, borderWidth: "0px" };

  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden
        style={style}
        className={`inline-block size-4 shrink-0 border-solid ${shapeClass}`}
      />
      <span className={showLabel ? "text-table" : "sr-only"}>{status.label}</span>
    </span>
  );
}

/** The legend under a status-coded table. Names the shape, not only the colour. */
export function StatusLegend({ text }: { text: string }) {
  return <p className="mt-3 text-label text-muted-foreground">{text}</p>;
}

/**
 * D-001 / D-002. A marked record says so in words, not by colour, and says in
 * the same breath that it still counts in the statistics — that distinction is
 * the requirement's actual substance.
 */
export function ConfidentialityMarker({
  label,
  note,
}: {
  label: string;
  note?: string;
}) {
  return (
    <span className="inline-flex flex-wrap items-center gap-2 rounded-sm border-2 border-sand-border bg-sand px-3 py-1 text-label font-bold text-sand-foreground">
      <span aria-hidden>🔒</span>
      {label}
      {note && <span className="font-normal">· {note}</span>}
    </span>
  );
}

/** Shown when a panel or table has nothing in it. */
export function EmptyState({ text }: { text: string }) {
  return (
    <p className="rounded-md border border-dashed border-border px-4 py-6 text-center text-table text-muted-foreground">
      {text}
    </p>
  );
}

export function PageHeading({
  title,
  subtitle,
  action,
  tags,
  marker,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  tags?: readonly string[];
  marker?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-display text-page-title font-semibold text-[var(--mi-slate-900)]">
            {title}
          </h1>
          <ReqTags ids={tags} />
        </div>
        {subtitle && <p className="mt-1 max-w-3xl text-label text-muted-foreground">{subtitle}</p>}
        {marker && <div className="mt-3">{marker}</div>}
      </div>
      {action}
    </div>
  );
}
