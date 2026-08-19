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

import type { Lang } from "@/lib/domain/lang";

import { IconAi, IconAlert, IconCheck, IconClose, IconLock, IconPlus } from "./icons";
import { REQUIREMENTS } from "@/lib/domain/requirements";
import { statusInfo, STATUS_LEGEND_CODES, type StatusInfo } from "@/lib/domain/status";

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

  /*
    Disabled replaces the variant rather than fading it.

    `opacity-60` over a filled primary rendered white on #8C9BA3 — 2.86:1,
    measured. WCAG exempts inactive controls from the contrast minimum, so no
    tool flags it, but the label is still a sentence someone has to read in
    order to understand why they cannot proceed, and the house rule against
    softening text with opacity exists precisely to stop this.

    The border is **dashed**, and that is the whole point. A solid outline in a
    lighter colour is still an outlined button, so a disabled control sat in the
    same visual class as a real secondary action and an evaluator could not tell
    the page's actual priority at a glance. Dashed is a shape difference: it
    survives greyscale, and it reads as "not available" rather than "available,
    quietly". The label lands at 6.21:1.
  */
  const look = disabled
    ? "cursor-not-allowed border-dashed border-input bg-transparent text-muted-foreground"
    : BUTTON_VARIANT[variant];

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
        look,
        fullWidth ? "w-full" : "",
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
  /*
    The only filled badge in MIIS, and deliberately the only one.

    Every other tone is a dark word on a pale tint, so they read as a family and
    a violet member of that family is just a differently coloured one — at a
    glance, across a screen that already carries sand, mint and slate chips, hue
    alone does not announce anything. Inverting the fill changes the silhouette
    instead, which is what makes AI findable before it is read, and what keeps it
    findable in greyscale, on a projector, and to a reader who cannot separate
    violet from slate.
  */
  ai: "border-ai-solid bg-ai-solid text-ai-solid-foreground",
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

const CALLOUT_ICON: Record<Exclude<Tone, "neutral">, () => ReactNode> = {
  ok: () => <IconCheck />,
  attention: () => <IconAlert />,
  error: () => <IconClose />,
  ai: () => <IconAi />,
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
      <span className="flex h-6 items-center">{CALLOUT_ICON[tone]()}</span>
      <span className="min-w-0 flex-1">
        {label && <span className="font-bold">{label} </span>}
        {children}
      </span>
      <ReqTags ids={tags} />
    </div>
  );
}

/**
 * A compartment holding machine-generated material — FAI-002.
 *
 * Everything AI produces in MIIS lives inside one of these, and nothing else
 * does. The point is not decoration: a case officer scrolling a case must be
 * able to tell, without reading a word, which parts of the screen are MI's
 * registered facts and which are a proposal that has not been approved yet.
 * FAI-002 makes that a requirement, and a tinted badge somewhere in the middle
 * of a panel does not deliver it — by the time you have found the badge you
 * have already read the content as though it were true.
 *
 * So the signal is structural, and it is four signals at once, because any one
 * of them can be lost:
 *
 * - a **banded header**, which no `Panel` in the system has, so the compartment
 *   is visible as a shape before any colour is processed;
 * - the **`AI` mark**, letters rather than a pictogram — there is no
 *   conventional icon for this and an invented one has to be learned;
 * - a **6px spine** down the leading edge, which survives being cropped,
 *   projected or printed in grey;
 * - the **violet**, the one deliberate step outside MI's palette, and the last
 *   of the four rather than the first.
 *
 * The standing sentence under the header states the guarantee rather than
 * implying it. FAI-002 is a promise about what the system will not do on its
 * own, and a promise the interface never says out loud is one the evaluator has
 * to take on trust.
 */
export function AiRegion({
  title,
  notice,
  mark,
  regionLabel,
  action,
  tags,
  children,
  headingLevel = 2,
  id,
}: {
  title: string;
  /** The FAI-002 guarantee, in the reader's language. */
  notice: string;
  /** The letters, from the dictionary — `i18n.common.aiMark`. */
  mark: string;
  /** What the compartment is called to a screen reader. */
  regionLabel: string;
  action?: ReactNode;
  tags?: readonly string[];
  children: ReactNode;
  headingLevel?: 2 | 3;
  id?: string;
}) {
  const Heading = headingLevel === 3 ? "h3" : "h2";

  return (
    /*
      Three layers, and the violet fades out as you move into the content: a
      solid band, a tinted strip carrying the guarantee, then the ordinary
      reading surface. Tinting the content as well was the first attempt and it
      was worse — it colours the case officer's information rather than the
      frame around it, and a whole panel of violet is harder to scan than a
      white one with a violet edge. The identity belongs to the container.
    */
    <section
      id={id}
      aria-label={regionLabel}
      className="min-w-0 overflow-hidden rounded-lg border-2 border-l-[6px] border-ai-border border-l-ai-solid bg-card shadow-card"
    >
      <div className="ai-band flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2.5">
        <div className="flex min-w-0 flex-wrap items-center gap-2.5">
          {/*
            Sparkle *and* letters, never one without the other. The sparkle is
            what the eye finds; the letters are what it means. A sparkle alone
            has come to read as "magic" in consumer software, and the thing this
            has to say is "machine-generated, not yet approved" — which no
            pictogram says on its own, and which has to survive greyscale and a
            projector.
          */}
          <span
            aria-hidden
            className="inline-flex shrink-0 items-center gap-1 rounded-sm bg-ai-solid-foreground px-1.5 py-0.5 text-meta font-bold tracking-[0.14em] text-ai-solid"
          >
            <IconAi size="sm" />
            {mark}
          </span>
          <Heading className="min-w-0 font-display text-section font-semibold text-ai-solid-foreground">
            {title}
          </Heading>
        </div>
        {action}
      </div>
      <p className="border-b border-ai-border bg-ai px-5 py-2.5 text-label text-ai-foreground">
        {notice}
      </p>
      <div className="px-5 py-4">
        {children}
        <ReqTags ids={tags} />
      </div>
    </section>
  );
}

/**
 * A selection, shown where its effect is.
 *
 * Three modes: static, removable (`onRemove`) and toggleable (`onToggle`).
 * Selected state is never colour alone — the border weight changes and, in
 * toggle mode, `aria-pressed` carries it.
 */
export function Chip({
  children,
  selected,
  onRemove,
  removeLabel,
  onToggle,
  pressed,
}: {
  children: ReactNode;
  selected?: boolean;
  onRemove?: () => void;
  removeLabel?: string;
  onToggle?: () => void;
  pressed?: boolean;
}) {
  const base =
    "inline-flex items-center gap-2 rounded-full border-2 px-4 py-1.5 text-label font-semibold";
  /*
    Selected is filled; unselected is an empty outline.

    The two states used to be two pale tints — sand for selected, slate for
    unselected — which measured **1.01:1 against each other**. Identical in
    lightness, differing only in hue, so at a glance a set of chips read as one
    undifferentiated row and the answer to "which of these did I pick" was
    carried entirely by a small tick. Inverting the fill changes the silhouette,
    which is the same reason the AI badge is filled: a state you have to find
    before you can read it cannot rely on hue.

    Unselected sits on `card` rather than `secondary` so the contrast between
    the states is the full 7.40:1, and its border is `input` — the token for a
    control's own edge, which WCAG 1.4.11 puts a 3:1 floor on.
  */
  /*
    `selected || pressed`, and the `||` is a bug fix rather than tidying. The
    three shapes of this component carry their state in two different props —
    `selected` on a static chip, `pressed` on a toggle — and `tone` read only
    the first. A toggle chip therefore never changed colour at all: pressing
    one swapped a + for a ✓ and nothing else, so "which unions back this
    demand" was answered by a 14px glyph.
  */
  const on = selected || pressed;
  const tone = on
    ? "border-primary bg-primary text-primary-foreground"
    : "border-input bg-card text-foreground hover:bg-secondary";

  if (onToggle) {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={pressed}
        className={`${base} ${tone} min-h-11 transition-colors`}
      >
        {pressed ? <IconCheck size="sm" /> : <IconPlus size="sm" />}
        <span>{children}</span>
      </button>
    );
  }

  if (!onRemove) {
    return <span className={`${base} ${tone}`}>{children}</span>;
  }

  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={removeLabel}
      className={`${base} ${tone} min-h-11 transition-colors`}
    >
      <span>{children}</span>
      <IconClose size="sm" />
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
    /*
      `min-w-0` so a panel can shrink below the intrinsic width of what is
      inside it. Without it a grid or flex parent sizes the panel to the widest
      thing it contains — and `DataTable` sets a `minWidth` — so a table meant
      to scroll inside its own region widened the page instead.
    */
    <section id={id} className={`min-w-0 rounded-lg border p-5 ${toneClass}`}>
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
/**
 * The label row above a control, shared by `Field`, `TextField` and `Select`.
 *
 * It exists because they disagreed. `Select` reserved a 28px row so an optional
 * badge would fit; the other two used a plain ~20px line. Put a select next to
 * a field in the same grid row — which `/registrera` does twice — and the
 * select's control started 8px below its neighbour's. One row definition is the
 * only way that stays fixed.
 *
 * `htmlFor` is optional: `Field` has no control to point at, and a `<label>`
 * with nothing to label is invalid, so it renders a span instead.
 */
export function FieldLabel({
  htmlFor,
  id,
  children,
  badge,
}: {
  htmlFor?: string;
  /** For a control that names its label by id — `Toggle`'s `aria-labelledby`. */
  id?: string;
  children: ReactNode;
  badge?: ReactNode;
}) {
  /*
    `hyphens` rather than `break-words`. Swedish compounds long words —
    "arbetstidsförkortning" is 21 characters — and `break-words` splits them at
    an arbitrary letter, which is how "Arbetstidsförkortnin / g" appeared. With
    hyphenation the browser breaks at a syllable and marks it, and the word
    stays readable when it has to wrap.
  */
  const text = "min-w-0 hyphens-auto text-label font-bold text-foreground";
  return (
    <div className="mb-1 flex min-h-7 flex-wrap items-center gap-2">
      {htmlFor ? (
        <label htmlFor={htmlFor} className={text}>
          {children}
        </label>
      ) : (
        <span id={id} className={text}>
          {children}
        </span>
      )}
      {badge}
    </div>
  );
}

/**
 * A value the officer enters — the editable counterpart to `Field`.
 *
 * `Field` displays what is registered; `TextField` registers it. Keeping them
 * as two components is what stops the confusion that made this necessary: the
 * wage agreement, the general terms and the linking panels were built out of
 * `Field`, so nothing on those screens could be typed into, and nobody noticed
 * because `Field` was borrowing the input styling and looked editable. FA-002
 * and FA-007 to FA-012 put those values in the officer's hands.
 *
 * Uncontrolled, so a server-rendered page can use it without becoming a client
 * component. This is a prototype: nothing is persisted, and pretending
 * otherwise would need a store the mockup does not have.
 */
export function TextField({
  id,
  label,
  defaultValue,
  hint,
  type = "text",
  numeric,
  placeholder,
}: {
  id: string;
  label: string;
  defaultValue?: string;
  hint?: string;
  type?: "text" | "date";
  /** Tabular figures, for amounts and percentages. */
  numeric?: boolean;
  placeholder?: string;
}) {
  return (
    /*
      Top-aligned: label, then the control immediately under it.

      This used to bottom-align the control so that a hinted field and an
      unhinted one ended level at the foot of the row. It bought that at the
      cost of the thing a form is actually read by — the row of boxes. Two
      fields side by side, one with a hint and one without, put their inputs at
      different heights, and the eye follows the inputs, not the hints.
    */
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={`field-input ${numeric ? "tabular-nums" : ""}`}
      />
      {hint && <p className="mt-1 text-label text-muted-foreground">{hint}</p>}
    </div>
  );
}

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
        <FieldLabel badge={ai && aiLabel ? <Badge tone="ai">{aiLabel}</Badge> : undefined}>
          {label}
        </FieldLabel>
      )}
      {/*
        A registered value is text, not a control.

        This used to render `field-input` — the *editable* style: 2px border,
        48px tall, white, radius 8. `Button variant="secondary"` is 2px border,
        48px tall, white, radius 4. A value the officer can only read was drawn
        as something they could press, four pixels of corner radius away from
        the button beside it. On the mediation case that put four unpressable
        boxes in a row next to a real `+ Koppla avtal`.

        The rule keeps the rhythm the boxes were providing, and a long value now
        wraps where a box would have clipped it.

        Top-aligned, like `TextField` and `Select`: label, then the value
        directly under it. An earlier version bottom-aligned the block so the
        rules ended level across a row, which held only until two fields
        differed in whether they had a hint — and then it put the *inputs* at
        different heights to keep the *rules* level, which is the wrong thing to
        hold steady. A form is read down its column of controls.

        The hint stays inside the rule because it belongs to the field rather
        than to the space under it.
      */}
      <div className={`border-b ${masked ? "border-dashed border-border" : "border-border"}`}>
        {masked ? (
          <div className="flex min-h-11 items-center gap-2 py-2 text-body text-muted-foreground">
            <IconLock size="md" />
            <span className="min-w-0 break-words">{maskedText}</span>
          </div>
        ) : (
          <div className="min-h-11 py-2 text-body break-words">{value}</div>
        )}
        {masked && maskedReason && (
          <p className="pb-2 text-label text-muted-foreground">{maskedReason}</p>
        )}
        {!masked && hint && <p className="pb-2 text-label text-muted-foreground">{hint}</p>}
      </div>
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
/**
 * The FR-012 key — the three agreement statuses, drawn by the same component
 * that draws them on a row.
 *
 * Earns its place only where a single status is on screen and the other two
 * need explaining; `/registrera` is that place. A table does not get one,
 * because `StatusDot` already carries colour, shape and label together on every
 * row and a legend would repeat what each row already says.
 */
export function StatusLegend({ lang }: { lang: Lang }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2">
      {STATUS_LEGEND_CODES.map((code) => (
        <li key={code} className="text-label">
          <StatusDot status={statusInfo(code, lang)} showLabel />
        </li>
      ))}
    </ul>
  );
}

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
        <IconLock size="md" />
        <span className="sr-only">{note ? `${label}. ${note}` : label}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-2 rounded-sm border-2 border-attention-border bg-attention px-3 py-1 text-label font-bold text-attention-foreground">
      <IconLock size="lg" />
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
