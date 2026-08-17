/**
 * Shared MIIS presentation primitives.
 *
 * These are plain components — no hooks, no state, no async. That lets pages
 * stay server-rendered AND lets the same primitives be used inside the few
 * "use client" screens without a second set of look-alikes. Anything that needs
 * the request (role, language, cookies) is resolved in the page and passed in.
 *
 * If a screen needs a button, a badge, a note box or a chip, it comes from here.
 * A raw <button> outside components/ fails `npm run lint` — see eslint.config.mjs.
 */

import type { ReactNode } from "react";

import { REQUIREMENTS } from "@/lib/domain/requirements";
import type { StatusInfo } from "@/lib/domain/status";

/* -------------------------------------------------------------------------- */
/* Annotation layer                                                            */
/* -------------------------------------------------------------------------- */

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

/**
 * Prose that explains *why* a screen is built this way, rather than telling the
 * user what to do next.
 *
 * It rides the same `data-reqtags` switch as `ReqTag`, so the product view stays
 * a product and the traceability view carries the argument. If a sentence is
 * something a case officer needs in order to do the task correctly, it does not
 * belong in here — it belongs in the screen.
 */
export function Rationale({ children }: { children: ReactNode }) {
  return <p className="rationale mt-3 text-label text-muted-foreground">{children}</p>;
}

/* -------------------------------------------------------------------------- */
/* Controls                                                                     */
/* -------------------------------------------------------------------------- */

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  primary: "border-transparent bg-primary text-primary-foreground hover:bg-[var(--mi-slate-900)]",
  secondary: "border-primary bg-transparent text-primary hover:bg-secondary",
  ghost: "border-transparent bg-transparent text-primary hover:bg-secondary",
  danger: "border-error-border bg-transparent text-error-foreground hover:bg-error",
};

/**
 * The one button.
 *
 * `md` is 48px and `sm` is 44px — both clear the 44×44 target minimum, so an
 * in-row action can be compact without failing it.
 *
 * `disabledReason` exists because a control that silently does nothing teaches
 * an evaluator that the prototype is a picture. If something is not wired up,
 * say so on the control rather than letting the click vanish.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  onClick,
  disabled,
  disabledReason,
  fullWidth,
  pressed,
  ariaLabel,
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: "md" | "sm";
  type?: "button" | "submit";
  /** Only passed from client components; server pages leave it out. */
  onClick?: () => void;
  disabled?: boolean;
  disabledReason?: string;
  fullWidth?: boolean;
  pressed?: boolean;
  ariaLabel?: string;
}) {
  const sizeClass =
    size === "sm" ? "min-h-11 px-3 py-2 text-label" : "min-h-12 px-5 py-3 text-table";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      aria-pressed={pressed}
      aria-label={ariaLabel}
      title={disabled ? disabledReason : undefined}
      className={[
        "rounded-sm border-2 font-bold transition-colors",
        sizeClass,
        BUTTON_VARIANT[variant],
        fullWidth ? "w-full" : "",
        disabled ? "cursor-not-allowed opacity-60" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}

export type Tone = "neutral" | "ok" | "attention" | "error" | "ai";

const BADGE_TONE: Record<Tone, string> = {
  neutral: "border-input bg-card text-muted-foreground",
  ok: "border-ok-border bg-ok text-ok-foreground",
  attention: "border-attention-border bg-attention text-attention-foreground",
  error: "border-error-border bg-error text-error-foreground",
  ai: "border-ai-border bg-ai text-ai-foreground",
};

/**
 * A short state word — registration status, case lifecycle, active/inactive.
 *
 * **`Badge` for everything except FR-012; `StatusDot` for FR-012 and nothing
 * else.** They look different because they are different: FR-012 is the only
 * status whose colours the customer specified, and it is drawn as a small mark
 * with the label beside it rather than as a filled pill precisely so a red
 * agreement can never be mistaken for a red error. A badge uses our own tones
 * and never the status hues.
 *
 * A row carries one status, of its own kind. A mediation case is not an
 * agreement and has no FR-012 colour; its status is whether it is open.
 *
 * Always a word — a badge is never a bare colour.
 *
 * **Casing lives here, not in the dictionary.** MI's design system defines this
 * exact treatment — `.mi-kicker { text-transform: uppercase; letter-spacing:
 * .12em; font-size: .78rem; font-weight: 700 }` — and doing it in CSS rather
 * than typing capitals into the copy has two payoffs: chips cannot drift out of
 * step with each other, and a screen reader announces the natural casing rather
 * than being handed a shouted string it may try to spell out.
 *
 * So write `Ofullständig` in `lib/i18n/`, never `OFULLSTÄNDIG`.
 */
export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={`inline-block shrink-0 rounded-sm border px-2 py-0.5 text-meta font-bold uppercase tracking-[0.12em] ${BADGE_TONE[tone]}`}
    >
      {children}
    </span>
  );
}

const CALLOUT_TONE: Record<Exclude<Tone, "neutral">, string> = {
  ok: "border-l-ok-border bg-ok text-ok-foreground",
  attention: "border-l-attention-border bg-attention text-attention-foreground",
  error: "border-l-error-border bg-error text-error-foreground",
  ai: "border-l-ai-border bg-ai text-ai-foreground",
};

const CALLOUT_ICON: Record<Exclude<Tone, "neutral">, string> = {
  ok: "✓",
  attention: "!",
  error: "✕",
  ai: "✦",
};

/**
 * System feedback.
 *
 * Deliberately shaped rather than merely coloured: a 4px left rule, an icon and
 * an optional bold label word. That is what keeps it distinguishable from an
 * agreement's FR-012 status, which owns green, red and blue and means something
 * else entirely.
 */
export function Callout({
  children,
  tone = "attention",
  label,
  live,
  tags,
}: {
  children: ReactNode;
  tone?: Exclude<Tone, "neutral">;
  label?: string;
  /** Set when the message changes in response to what the user just did. */
  live?: boolean;
  tags?: readonly string[];
}) {
  return (
    <div
      aria-live={live ? "polite" : undefined}
      className={`flex flex-wrap items-start gap-x-2 gap-y-1 rounded-md border border-l-4 px-4 py-3 text-label ${CALLOUT_TONE[tone]}`}
    >
      <span aria-hidden className="font-bold">
        {CALLOUT_ICON[tone]}
      </span>
      <span className="min-w-0 flex-1">
        {label && <span className="font-bold">{label} </span>}
        {children}
      </span>
      <ReqTags ids={tags} />
    </div>
  );
}

/** A selection, shown where its effect is — removable when the user chose it. */
export function Chip({
  children,
  selected,
  onRemove,
  removeLabel,
}: {
  children: ReactNode;
  selected?: boolean;
  onRemove?: () => void;
  removeLabel?: string;
}) {
  const base =
    "inline-flex items-center gap-2 rounded-full border-2 px-4 py-1.5 text-label font-semibold";
  const tone = selected
    ? "border-primary bg-accent text-accent-foreground"
    : "border-border bg-secondary text-secondary-foreground";

  if (!onRemove) {
    return <span className={`${base} ${tone}`}>{children}</span>;
  }

  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={removeLabel}
      className={`${base} ${tone} min-h-11 transition-colors hover:bg-accent`}
    >
      <span>{children}</span>
      <span aria-hidden className="font-bold">
        ✕
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Layout                                                                       */
/* -------------------------------------------------------------------------- */

export function Panel({
  title,
  action,
  tags,
  children,
  tone = "default",
  headingLevel = 2,
  id,
}: {
  title?: string;
  action?: ReactNode;
  tags?: readonly string[];
  children: ReactNode;
  tone?: "default" | "sand" | "mint" | "demo";
  /** Drops to 3 when the panel sits under another heading — order matters (WCAG 1.3.1). */
  headingLevel?: 2 | 3;
  id?: string;
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
    <section id={id} className={`rounded-lg border p-5 ${toneClass}`}>
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
          {ai && aiLabel && <Badge tone="ai">{aiLabel}</Badge>}
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

/* -------------------------------------------------------------------------- */
/* Domain markers                                                               */
/* -------------------------------------------------------------------------- */

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
 *
 * **Keep `showLabel` on in tables.** With the label beside the mark, the row
 * explains itself and a legend underneath is pure repetition — which is what a
 * legend under every status table used to be. If a future view ever has to show
 * the mark alone, that view needs `STATUS_LEGEND` back; nothing else does.
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

  const shapeClass = status.shape === "square" ? "rounded-[2px]" : "rounded-full";

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

/**
 * D-001 / D-002. A marked record says so in words, not by colour, and says in
 * the same breath that it still counts in the statistics — that distinction is
 * the requirement's actual substance.
 *
 * `compact` is for table rows. The full marker with its note triples the height
 * of any row it lands in, which pushes the rest of the table off screen; in a
 * row the icon carries the meaning and the label goes to assistive technology
 * and to the tooltip. Detail views, which have the room, keep the full marker.
 */
export function ConfidentialityMarker({
  label,
  note,
  compact,
}: {
  label: string;
  note?: string;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <span
        title={note ? `${label} — ${note}` : label}
        className="inline-flex size-6 shrink-0 items-center justify-center rounded-sm border border-attention-border bg-attention text-attention-foreground"
      >
        <span aria-hidden>🔒</span>
        <span className="sr-only">{note ? `${label}. ${note}` : label}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-2 rounded-sm border-2 border-attention-border bg-attention px-3 py-1 text-label font-bold text-attention-foreground">
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
  back,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  tags?: readonly string[];
  marker?: ReactNode;
  /** A way out of a detail view that is not the main menu. */
  back?: ReactNode;
}) {
  return (
    <div className="mb-6">
      {back && <div className="mb-2">{back}</div>}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-page-title font-semibold text-[var(--mi-slate-900)]">
              {title}
            </h1>
            <ReqTags ids={tags} />
          </div>
          {subtitle && (
            <p className="mt-1 max-w-3xl text-label text-muted-foreground">{subtitle}</p>
          )}
          {marker && <div className="mt-3">{marker}</div>}
        </div>
        {action}
      </div>
    </div>
  );
}
