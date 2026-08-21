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
  aiTaskHref,
  queueTotal,
  visibleQueue,
  type AiQueueItem,
} from "@/lib/domain/ai";
import { t as text, type Lang } from "@/lib/domain/lang";
import type { RoleInfo } from "@/lib/domain/role";
import type { AssistantFacts } from "@/lib/domain/assistant";
import { dictionary } from "@/lib/i18n";
import { IconAi, IconChevronDown, IconClose, IconForward } from "./icons";
import { AssistantChat } from "./AssistantChat";
import { Badge, LinkButton, Rationale, ReqTags } from "./primitives";

/**
 * The AI assistant — Appendix 1 §4.1, gathered into one place.
 *
 * §4.1 asks for *"ett integrerat AI-stöd"* and §4.3's system sketch carries
 * AI-assisted registration as a module of the system in its own right. Until
 * now MIIS answered that with two panels on two screens and no way to see the
 * whole of it: an officer could not find out what the AI does, where it runs,
 * what it is holding for them, or where it is not allowed to go.
 *
 * **It is interactive, and it is still not a chatbot.** The drawer opens on the
 * two things an officer acts on — *what can I ask it to do here*, and *what is
 * it holding for me* — and everything explanatory is folded behind one control.
 * The tasks are real: each is one of §4.1's four functions, run on the screen
 * §4.1 puts it on, producing a proposal FAI-002 then requires a human to
 * approve. What there is no room for is a free prompt box, and refusing to
 * build one is the argument rather than a limitation — an authority procuring
 * AI is buying a bounded set of behaviours, and a box that accepts any
 * instruction is the opposite of a bounded set.
 *
 * The explanatory half is still here, one press away: the four functions, MI's
 * own two limits on what the AI may not do, and where the traceability lands.
 * That last section is what a competitor's demo will not have — a boundary an
 * interface never states is a boundary the buyer takes on trust.
 *
 * NFÅ-003 applies inside it: the queue is filtered by write access, a role that
 * may only read is told so, and a role with no AI screen gets no launcher.
 */

interface AiContextValue {
  queue: readonly AiQueueItem[];
  facts: AssistantFacts;
  open: boolean;
  setOpen: (open: boolean) => void;
}

/** Nothing to answer from — the shape, so the drawer never has to null-check. */
const NO_FACTS: AssistantFacts = {
  expiring: [],
  incomplete: [],
  unpublished: [],
  mediations: [],
  benchmark: [],
  agreements: [],
};

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
  facts,
  children,
}: {
  queue: readonly AiQueueItem[];
  facts: AssistantFacts;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <AiContext.Provider value={{ queue, facts, open, setOpen }}>{children}</AiContext.Provider>
  );
}

function useAi(): AiContextValue {
  return (
    useContext(AiContext) ?? { queue: [], facts: NO_FACTS, open: false, setOpen: () => {} }
  );
}

/**
 * The way in — fixed to the bottom right of every screen the role may act on.
 *
 * It was in the application header, between the signed-in name and Sign out,
 * and it was findable only by someone already looking for it: the header is
 * where a user goes to leave, not where they go for help with the screen in
 * front of them. Down here it sits in the corner the eye returns to after
 * reading, at a constant place across nineteen screens, and it is the one thing
 * on the page whose position does not depend on what the page contains.
 *
 * It is a **labelled pill, not a bare circle.** A floating circle with a mark in
 * it has to be learned; a control in a system a case officer uses every day for
 * eight hours should be readable the first time and every time. The count is a
 * number rather than a dot because "3" is actionable and a dot is only anxiety.
 *
 * `print-hide`, because it is chrome. And it steps out of the way of the
 * session dialog by sitting below it in the stack.
 */
export function AiAssistantLauncher({ lang, role }: { lang: Lang; role: RoleInfo }) {
  const { queue, setOpen, open } = useAi();
  const t = dictionary(lang).ai;
  const mine = visibleQueue(queue, role);
  const waiting = queueTotal(mine);

  /* A role with no AI surface at all gets no launcher — NFÅ-003 in the chrome. */
  if (aiFunctionsForRole(role).length === 0) return null;
  /* One AI surface at a time: the drawer replaces the launcher while it is up. */
  if (open) return null;

  return (
    <button
      type="button"
      /*
        A stable hook, so the screenshot pass can take it out of shots where it
        is not the subject. A fixed control lands mid-content in a full-page
        capture and reads as a defect in the tender document.
      */
      data-ai-launcher
      onClick={() => setOpen(true)}
      aria-haspopup="dialog"
      aria-label={waiting > 0 ? t.launcherWaiting(waiting) : t.launcher}
      className="print-hide fixed bottom-6 right-6 z-50 inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-ai-solid bg-ai-solid px-5 py-3 text-table font-bold text-ai-solid-foreground shadow-lg transition-colors hover:bg-[var(--mi-ai-700)]"
    >
      <IconAi />
      <span>{t.launcher}</span>
      {waiting > 0 && (
        <span
          aria-hidden
          className="inline-flex min-w-6 justify-center rounded-full bg-ai-solid-foreground px-1.5 py-0.5 text-label font-bold tabular-nums text-ai-solid"
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
  /**
   * Why the section is here, in requirement terms.
   *
   * A `Rationale`, not a paragraph, and that is the fix for the drawer being
   * hard to read on first open: both sections led with two sentences of
   * justification, so an officer met about sixty words before the first thing
   * they could press. Neither sentence is needed to do the task — they explain
   * that these are §4.1's four functions and that nothing is saved until it is
   * approved — so they belong on the `miis_reqtags` layer with every other
   * sentence of that kind. The product view opens on a heading and a control.
   */
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border pt-4 first:border-t-0 first:pt-0">
      <h3 className="mi-kicker mb-2 text-muted-foreground">{title}</h3>
      {children}
      {lead && <Rationale>{lead}</Rationale>}
    </section>
  );
}

export function AiAssistant({ lang, role }: { lang: Lang; role: RoleInfo }) {
  const { queue, facts, open, setOpen } = useAi();
  const pathname = usePathname();
  const d = dictionary(lang);
  const t = d.ai;
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [details, setDetails] = useState(false);

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
  const reachable = aiFunctionsForRole(role).map((f) => aiFunctionInfo(f, lang));
  const elsewhere = reachable.filter((f) => !here.some((h) => h.id === f.id));
  const mine = visibleQueue(queue, role);
  const canReview = mayReviewAi(role);

  return (
    <div className="print-hide fixed inset-0 z-[65] flex justify-end bg-[var(--mi-ink)]/50">
      {/*
        The scrim closes on click, and it is a plain div rather than a button:
        it is a convenience for a mouse, never the only way out. Escape and the
        Stäng control in the header are the ways the requirement is met.
      */}
      <div aria-hidden className="flex-1" onClick={close} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-assistant-title"
        className="flex h-full w-full max-w-lg flex-col overflow-hidden border-l-[6px] border-ai-solid bg-card shadow-card"
      >
        {/*
          The banded header the inline AI compartments carry, and the only Close
          control. There used to be a second one in a footer, which put the way
          out at both ends of a scrolling panel and made the last thing in the
          drawer a dismissal rather than the content.
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
            <h2
              id="ai-assistant-title"
              className="min-w-0 font-display text-section font-semibold text-ai-solid-foreground"
            >
              {t.title}
            </h2>
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
          {/*
            The question, first and on every screen.

            An officer with a question in their head should not have to work out
            which screen answers it — that translation is the system's job, and
            this is where it happens. What comes back is a query MIIS could
            already run, with the rows it counted and a way to the screen they
            live on; nothing here is composed, and nothing here writes.
          */}
          <Section title={t.askQuestion} lead={t.askQuestionLead}>
            <AssistantChat lang={lang} role={role} facts={facts} onNavigate={close} />
          </Section>

          {/*
            What the officer can ask for, first and as controls.

            This is the answer to "can the user ask the AI to do things": yes,
            and the things are §4.1's four functions rather than free text. Each
            takes them to the screen the function runs on, because that is where
            the proposal appears and where FAI-002's approve and reject live.
          */}
          {/*
            Two different screens, and the drawer used to show the first one
            everywhere.

            `here.length > 0 ? here : elsewhere` fell back to *every* function
            the role can reach, so on Rapporter, Parter, Sök and the start page
            an officer was offered three protocol tasks that had nothing to do
            with where they were standing — and all three linked away. That is
            why it read as the same panel on every screen and as impossible to
            place on the first try.

            On a screen where a function runs, the drawer names the functions
            and points at the region on **this** page. Where none runs, it says
            so in one sentence and offers one way to the nearest screen that
            does, rather than three that look like they apply here.
          */}
          {here.length > 0 ? (
            <Section title={t.ask} lead={t.askLead}>
              <ul className="space-y-2">
                {here.map((f) => (
                  <li key={f.id}>
                    {/* The region on this page, not the page itself. */}
                    <LinkButton
                      href={aiTaskHref(f, pathname)}
                      fullWidth
                      iconEnd={<IconForward />}
                    >
                      {f.ask}
                    </LinkButton>
                  </li>
                ))}
              </ul>
            </Section>
          ) : (
            <Section title={t.ask} lead={t.askElsewhere}>
              <p className="mb-3 text-table">{t.notHere}</p>
              {elsewhere.length === 0 ? (
                <p className="text-table text-muted-foreground">{t.onThisScreenNone}</p>
              ) : (
                <LinkButton href={elsewhere[0]!.href} fullWidth iconEnd={<IconForward />}>
                  {t.goWhereItWorks(elsewhere[0]!.where)}
                </LinkButton>
              )}
            </Section>
          )}

          <Section title={t.queue} lead={canReview ? t.queueLead : t.readOnly}>
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

          {/*
            Everything explanatory, behind one control.

            The drawer opened on five sections and the officer had to read past
            three of them to reach the queue. What the AI can do, where it stops
            and how it is logged are all still here — they are the sections a
            competitor will not have — but they are reference material, and
            reference material does not belong above the work.
          */}
          <div className="border-t border-border pt-4">
            <button
              type="button"
              onClick={() => setDetails((v) => !v)}
              aria-expanded={details}
              aria-controls="ai-details"
              className="flex min-h-11 w-full items-center justify-between gap-3 text-left text-table font-bold text-primary"
            >
              {t.details}
              <span
                aria-hidden
                className={`flex h-5 items-center transition-transform ${details ? "rotate-180" : ""}`}
              >
                <IconChevronDown />
              </span>
            </button>

            <div id="ai-details" className={`space-y-5 pt-3 ${details ? "block" : "hidden"}`}>
              <Section title={t.functions}>
                <ul className="space-y-3">
                  {reachable.map((f) => (
                    <li key={f.id}>
                      <p className="font-semibold">{f.label}</p>
                      <p className="mt-1 text-table">{f.what}</p>
                      <p className="mt-1 text-label text-muted-foreground">
                        <span className="font-bold">{t.where}: </span>
                        {f.where}
                      </p>
                      <div className="mt-1">
                        <ReqTags ids={f.requirements} />
                      </div>
                    </li>
                  ))}
                </ul>
              </Section>

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
          </div>
        </div>
      </div>
    </div>
  );
}
