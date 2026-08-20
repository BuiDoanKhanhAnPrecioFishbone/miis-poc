"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

import {
  AI_BOUNDARIES,
  aiFunctionInfo,
  aiFunctionsForPath,
  aiFunctionsForRole,
  mayReviewAi,
  queueTotal,
  visibleQueue,
  type AiQueueItem,
} from "@/lib/domain/ai";
import { t as text, type Lang } from "@/lib/domain/lang";
import type { RoleInfo } from "@/lib/domain/role";
import { dictionary } from "@/lib/i18n";
import { IconAi, IconClose, IconForward } from "./icons";
import { Badge, Button, LinkButton, ReqTags } from "./primitives";

/**
 * The AI assistant — Appendix 1 §4.1, gathered into one place.
 *
 * §4.1 asks for *"ett integrerat AI-stöd"* and §4.3's system sketch carries
 * AI-assisted registration as a module of the system in its own right. Until
 * now MIIS answered that with two panels on two screens and no way to see the
 * whole of it, which is a fair reading of the requirement tables and a poor one
 * of the requirement: an officer could not find out what the AI does, where it
 * runs, what it is holding for them, or where it is not allowed to go.
 *
 * **It is not a chatbot, and refusing to build one is the argument.** There is
 * no prompt box and nothing to converse with. The drawer answers four questions
 * a case officer at a Swedish authority actually has about a machine that reads
 * their post:
 *
 * 1. *What is it doing on this screen?* — the §4.1 functions that run here,
 *    each named with the requirement it answers, and a way into the view.
 * 2. *What is it holding for me?* — the review queue. FAI-002 guarantees that
 *    nothing is saved before approval, which means a set of unapproved things
 *    exists; this is the first place in MIIS it can be seen.
 * 3. *What can it do at all?* — the four functions, in §4.1's own order.
 * 4. *Where does it stop?* — MI's two stated limits, plus the one this design
 *    adds. This is the section a competitor's demo will not have, and it is the
 *    one an authority buying AI has to see: a boundary the interface never
 *    states is a boundary the buyer takes on trust.
 *
 * Everything it shows is `AiRegion`'s four signals in drawer form — the band,
 * the letter-mark, the spine, the violet — so nothing about "this is
 * machine-generated and unapproved" depends on colour alone.
 *
 * NFÅ-003 applies inside it: the queue is filtered by what the role may reach,
 * and a role that may only read is told so instead of being offered approval.
 */

interface AiContextValue {
  queue: readonly AiQueueItem[];
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AiContext = createContext<AiContextValue | null>(null);

/**
 * Holds the queue for the whole group.
 *
 * The queue is a `lib/data/` read, so it is fetched once in the route group's
 * layout — a server component — and handed down. The alternative was a prop on
 * `AppShell` threaded through nineteen pages, which is the kind of plumbing
 * that goes out of step the first time someone adds a screen.
 */
export function AiAssistantProvider({
  queue,
  children,
}: {
  queue: readonly AiQueueItem[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return <AiContext.Provider value={{ queue, open, setOpen }}>{children}</AiContext.Provider>;
}

function useAi(): AiContextValue {
  return useContext(AiContext) ?? { queue: [], open: false, setOpen: () => {} };
}

/**
 * The way in, in the application header.
 *
 * Filled violet with the letter-mark, because `Badge tone="ai"` is the one
 * filled treatment in the system and the reason is the same here: the AI
 * surface has to be findable before it is read. The count is the number of
 * proposals waiting, and it is a number rather than a dot — "3" is actionable,
 * a dot is only anxiety.
 */
export function AiAssistantLauncher({ lang, role }: { lang: Lang; role: RoleInfo }) {
  const { queue, setOpen } = useAi();
  const t = dictionary(lang).ai;
  const mine = visibleQueue(queue, role);
  const waiting = queueTotal(mine);

  /* A role with no AI surface at all gets no launcher — NFÅ-003 in the chrome. */
  if (aiFunctionsForRole(role).length === 0) return null;

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-haspopup="dialog"
      aria-label={waiting > 0 ? t.launcherWaiting(waiting) : t.launcher}
      className="inline-flex min-h-11 items-center gap-2 rounded-sm border-2 border-ai-solid bg-ai-solid px-3 py-2 text-label font-bold text-ai-solid-foreground transition-colors hover:bg-[var(--mi-ai-700)]"
    >
      <IconAi size="sm" />
      <span>{t.launcher}</span>
      {waiting > 0 && (
        <span
          aria-hidden
          className="inline-flex min-w-6 justify-center rounded-full bg-ai-solid-foreground px-1.5 py-0.5 text-meta font-bold tabular-nums text-ai-solid"
        >
          {waiting}
        </span>
      )}
    </button>
  );
}

function Section({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border pt-4 first:border-t-0 first:pt-0">
      <h3 className="mi-kicker mb-2 text-muted-foreground">{title}</h3>
      {lead && <p className="mb-3 text-label text-muted-foreground">{lead}</p>}
      {children}
    </section>
  );
}

export function AiAssistant({ lang, role }: { lang: Lang; role: RoleInfo }) {
  const { queue, open, setOpen } = useAi();
  const pathname = usePathname();
  const d = dictionary(lang);
  const t = d.ai;
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setOpen(false), [setOpen]);

  /* Navigating away closes it: the drawer describes the screen behind it. */
  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    panelRef.current?.querySelector<HTMLElement>("button, [href]")?.focus();
    return () => previouslyFocused.current?.focus();
  }, [open]);

  /* Same contract as the session dialog: Tab trapped, Escape out (WCAG 2.1.2). */
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        "button, [href], [tabindex]:not([tabindex='-1'])",
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  if (!open) return null;

  const here = aiFunctionsForPath(pathname).map((f) => aiFunctionInfo(f, lang));
  const mine = visibleQueue(queue, role);
  const canReview = mayReviewAi(role);
  const reachable = aiFunctionsForRole(role).map((f) => aiFunctionInfo(f, lang));

  return (
    <div className="print-hide fixed inset-0 z-[65] flex justify-end bg-[var(--mi-ink)]/50">
      {/*
        The scrim closes on click, and it is a plain div rather than a button:
        it is a convenience for a mouse, never the only way out. Escape and the
        Stäng control are the ways the requirement is met.
      */}
      <div aria-hidden className="flex-1" onClick={close} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-assistant-title"
        className="flex h-full w-full max-w-xl flex-col overflow-hidden border-l-[6px] border-ai-solid bg-card shadow-card"
      >
        {/* The same banded header the inline AI compartments carry. */}
        {/*
          `nowrap` on the row, `shrink-0` on the control: the English title is
          longer than the Swedish one and pushed Stäng onto a line of its own,
          which left a close button floating under the heading like a second
          action. The title block shrinks instead — it has room to.
        */}
        <div className="ai-band flex flex-nowrap items-start justify-between gap-x-4 px-5 py-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2.5">
            <span
              aria-hidden
              className="inline-flex shrink-0 items-center gap-1 rounded-sm bg-ai-solid-foreground px-1.5 py-0.5 text-meta font-bold tracking-[0.14em] text-ai-solid"
            >
              <IconAi size="sm" />
              {d.common.aiMark}
            </span>
            <div className="min-w-0">
              <h2
                id="ai-assistant-title"
                className="font-display text-section font-semibold text-ai-solid-foreground"
              >
                {t.title}
              </h2>
              <p className="text-label text-ai-solid-foreground/90">{t.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-sm border-2 border-ai-solid-foreground/70 px-3 py-2 text-label font-bold text-ai-solid-foreground transition-colors hover:bg-ai-solid-foreground hover:text-ai-solid"
          >
            <IconClose size="sm" />
            {d.common.close}
          </button>
        </div>

        {/* FAI-002, stated rather than implied — the same sentence as `AiRegion`. */}
        <p className="border-b border-ai-border bg-ai px-5 py-2.5 text-label text-ai-foreground">
          {d.common.aiNotice}
        </p>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-4">
          <Section title={t.onThisScreen}>
            {here.length === 0 ? (
              <p className="text-table text-muted-foreground">{t.onThisScreenNone}</p>
            ) : (
              <ul className="space-y-4">
                {here.map((f) => (
                  <li key={f.id}>
                    <p className="font-semibold">{f.label}</p>
                    <p className="mt-1 text-table">{f.what}</p>
                    <p className="mt-1 text-label text-muted-foreground">
                      <span className="font-bold">{t.where}: </span>
                      {f.where}
                    </p>
                    <div className="mt-2">
                      <ReqTags ids={f.requirements} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title={t.queue} lead={t.queueLead}>
            {!canReview && (
              <p className="mb-3 text-table text-muted-foreground">{t.readOnly}</p>
            )}
            {mine.length === 0 ? (
              <p className="text-table text-muted-foreground">{t.queueEmpty}</p>
            ) : (
              <ul className="divide-y divide-border">
                {mine.map((item) => (
                  <li key={item.id} className="py-3 first:pt-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="min-w-0 font-semibold">{text(item.subject, lang)}</p>
                      <Badge tone="ai">{t.queueCount(item.proposals)}</Badge>
                    </div>
                    <p className="mt-1 text-label text-muted-foreground">
                      {text(item.detail, lang)}
                    </p>
                    <div className="mt-2">
                      <LinkButton href={item.href} size="sm" iconEnd={<IconForward />}>
                        {t.goThere}
                      </LinkButton>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title={t.functions}>
            <ul className="space-y-3">
              {reachable.map((f) => (
                <li key={f.id}>
                  <p className="font-semibold">{f.label}</p>
                  <p className="mt-1 text-table">{f.what}</p>
                  <div className="mt-1">
                    <ReqTags ids={f.requirements} />
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          {/*
            The boundary, and the reason the drawer exists rather than a fifth
            panel. §4.1 states two limits in MI's own words; the third is this
            design's, and saying so is better than implying MI asked for it.
          */}
          <Section title={t.boundaries} lead={t.boundariesLead}>
            <ul className="space-y-3">
              {AI_BOUNDARIES.map((b) => (
                <li key={b.id} className="border-l-4 border-ai-solid pl-3">
                  <p className="text-table">{b.statement[lang]}</p>
                  <div className="mt-1">
                    <ReqTags ids={b.requirements} />
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          <Section title={t.traceability}>
            <p className="text-table">{t.traceabilityBody}</p>
            <div className="mt-3">
              <Link
                href="/administration"
                className="inline-flex min-h-11 items-center gap-1 text-label font-semibold text-primary underline underline-offset-2"
              >
                {t.traceabilityAction}
              </Link>
            </div>
            <div className="mt-1">
              <ReqTags ids={["FAI-002", "FH-001", "NFÅ-003"]} />
            </div>
          </Section>
        </div>

        <div className="border-t border-border px-5 py-3">
          <Button variant="secondary" onClick={close} fullWidth>
            {d.common.close}
          </Button>
        </div>
      </div>
    </div>
  );
}
