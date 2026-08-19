import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  Lock,
  Plus,
  Sparkles,
  TriangleAlert,
  X,
  type LucideIcon,
} from "lucide-react";

/**
 * The icon set — one library, no emoji.
 *
 * MIIS was drawing its icons as text characters: ✓ for a completed step, ✕ to
 * remove a chip, ! in a warning, 🔒 on a sekretessmarkering, ▲▼↕ on a sortable
 * column, ✦ on the AI callout. Twelve glyphs from four Unicode blocks, and each
 * one renders differently depending on the machine — 🔒 is a colour emoji on
 * Windows and a flat outline on Linux, ✦ has no emoji presentation at all, and
 * a screen reader may announce any of them by their Unicode name. None of that
 * is controllable from our stylesheet, which is the whole problem: the padlock
 * on a confidentiality marker is carrying a legal status and cannot look like a
 * different object on the evaluator's laptop than it does on ours.
 *
 * `lucide-react` was already a dependency — it ships with the vendored
 * shadcn/ui components — so this is a swap, not a new choice. Every icon is an
 * SVG that inherits `currentColor` and the surrounding font size, so it obeys
 * the design tokens like everything else.
 *
 * **An icon never stands alone.** Each one here is decorative in the accessible
 * sense — `aria-hidden` — because the label beside it, or the `sr-only` text
 * that replaces it, is what carries the meaning. WCAG 1.1.1 is satisfied by the
 * words, not by the picture.
 */
const SIZE = {
  /* Inline with 13–15px text: matches the cap height rather than the line box. */
  sm: 14,
  /* Inline with body text, and the default for a control's own mark. */
  md: 16,
  /* A marker that has to read as an object — the confidentiality padlock. */
  lg: 18,
} as const;

export type IconSize = keyof typeof SIZE;

function icon(Component: LucideIcon, displayName: string) {
  function Icon({ size = "md", className }: { size?: IconSize; className?: string }) {
    return (
      <Component
        aria-hidden
        focusable="false"
        size={SIZE[size]}
        strokeWidth={2.25}
        className={`inline-block shrink-0 ${className ?? ""}`}
      />
    );
  }
  Icon.displayName = displayName;
  return Icon;
}

/** A completed step, an approved form, a passed check. */
export const IconCheck = icon(Check, "IconCheck");
/** Add — the unpressed state of a toggle chip. */
export const IconPlus = icon(Plus, "IconPlus");
/** Remove a chip, dismiss, reject. */
export const IconClose = icon(X, "IconClose");
/** Attention — a `Callout` that needs reading before acting. */
export const IconAlert = icon(TriangleAlert, "IconAlert");
/** A sekretessmarkering (D-001). A legal status, so it gets the larger size. */
export const IconLock = icon(Lock, "IconLock");
/** Back to the register a detail view came from. */
export const IconBack = icon(ArrowLeft, "IconBack");
/** A consequence or an onward step, in running text. */
export const IconForward = icon(ArrowRight, "IconForward");
/** A closed list. */
export const IconChevronDown = icon(ChevronDown, "IconChevronDown");
/** Sorted ascending / descending / sortable-but-unsorted. */
export const IconSortAsc = icon(ChevronUp, "IconSortAsc");
export const IconSortDesc = icon(ChevronDown, "IconSortDesc");
export const IconSortable = icon(ChevronsUpDown, "IconSortable");

/**
 * AI, and the only icon in MIIS that is allowed to be the second half of a
 * two-part mark. It never appears without the letters `AI` beside it: a sparkle
 * on its own has come to mean "magic" in consumer software, and what it has to
 * mean here is "machine-generated and not yet approved by a case officer". The
 * letters say that; the sparkle makes it findable at a glance.
 */
export const IconAi = icon(Sparkles, "IconAi");
