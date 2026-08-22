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
import { IconAi, IconClose, IconForward } from "./icons";
import { AssistantChat } from "./AssistantChat";
import { Badge, LinkButton, Rationale, ReqTags } from "./primitives";
import { Tabs } from "./Select";

/**
 * The AI assistant — Appendix 1 §4.1, gathered into one place.
 *
 * §4.1 asks for *"ett integrerat AI-stöd"* and §4.3's system sketch carries
 * AI-assisted registration as a module of the system in its own right. Until
 * now MIIS answered that with two panels on two screens and no way to see the
 * whole of it: an officer could not find out what the AI does, where it runs,
 * what it is holding for them, or where it is not allowed to go.
 *
 * **Four tabs, and three of them are one loop.** *Fråga* asks the register a
 * question and gets rows back. *Starta* sets one of §4.1's four functions
 * going on the screen the requirement puts it on. *Granska* is what those
 * functions produced and nobody has accepted yet — FAI-002's guarantee,
 * expressed as a number that goes down when the officer clears it. Ask, start,
 * review: the officer can see where they are in that cycle from the tab strip
 * alone, which is what the drawer could not previously say.
 *
 * *Om* is the fourth: the four functions, MI's own two limits on what the AI
 * may not do, and where the traceability lands. It is what a competitor's demo
 * will not have — a boundary an interface never states is a boundary the buyer
 * takes on trust — and it is reference material, so it is beside the work
 * rather than beneath it.
 *
 * NFÅ-003 applies inside it: the queue is filtered by write access, a role that
 * may only read is told so, and a role with no AI screen gets no launcher.
 */

interface AiContextValue {
  queue: readonly AiQueueItem[];
  facts: AssistantFacts;
  open: boolean;
  setOpen: (open: boolean) => void;
  /**
   * Queue items the officer has cleared in this session.
   *
   * The count on the launcher is FAI-002's guarantee expressed as a number:
   * *this many machine-made proposals exist and no human has accepted them*.
   * It never moved, because the queue is derived on the server and approval
   * happened in a component's own state three screens away — so an evaluator
   * approving nine extracted values watched the badge keep saying nine, which
   * is the one thing that would make them doubt the guarantee.
   *
   * It is session state, not a stored decision: reloading brings the work
   * back, the same way every other action in this prototype does.
   */
  cleared: readonly string[];
  setQueueItemCleared: (id: string, cleared: boolean) => void;
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
 * Clearing and restoring a queue item, from wherever the review happens.
 *
 * `ProtocolReview` clears when the officer approves the extraction, which is
 * what closes the loop the drawer opens: the queue said nine values were
 * waiting, the officer approved them on the screen the queue sent them to, and
 * the number goes to zero. Reopening the form puts them back, because the
 * proposals are unapproved again the moment the approval is undone — a count
 * that only ever falls is a count that stops describing anything.
 */
export function useAiQueueReview(): {
  clearQueueItem: (id: string) => void;
  restoreQueueItem: (id: string) => void;
} {
  const set = useContext(AiContext)?.setQueueItemCleared;
  return {
    clearQueueItem: (id: string) => set?.(id, true),
    restoreQueueItem: (id: string) => set?.(id, false),
  };
}

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
  const [cleared, setCleared] = useState<readonly string[]>([]);
  const setQueueItemCleared = useCallback(
    (id: string, done: boolean) =>
      setCleared((prev) =>
        done
          ? prev.includes(id)
            ? prev
            : [...prev, id]
          : prev.filter((x) => x !== id),
      ),
    [],
  );
  return (
    <AiContext.Provider value={{ queue, facts, open, setOpen, cleared, setQueueItemCleared }}>
      {children}
    </AiContext.Provider>
  );
}

function useAi(): AiContextValue {
  return (
    useContext(AiContext) ?? {
      queue: [],
      facts: NO_FACTS,
      open: false,
      setOpen: () => {},
      cleared: [],
      setQueueItemCleared: () => {},
    }
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
  const { queue, setOpen, open, cleared } = useAi();
  const t = dictionary(lang).ai;
  const mine = visibleQueue(queue, role).filter((i) => !cleared.includes(i.id));
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
      className="print-hide fixed bottom-6 right-6 z-50 inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-ai-solid bg-ai-solid px-5 py-3 text-table font-bold text-ai-solid-foreground shadow-lg transition-colors hover:bg-[var(--mi-ai-800)]"
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
  const { queue, facts, open, setOpen, cleared } = useAi();
  const pathname = usePathname();
  const d = dictionary(lang);
  const t = d.ai;
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  /* Opens on the question, because that is the part an officer reaches for
     without already knowing which screen they need. */
  const [tab, setTab] = useState("ask");

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
  const mine = visibleQueue(queue, role).filter((i) => !cleared.includes(i.id));
  const waiting = queueTotal(mine);
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

        {/*
          Four tabs, and the words on them do the explaining.

          *Uppgifter* was the worst label in the system. In a register it reads
          as **data** — uppgifter om ett avtal — so the tab that offered things
          the AI could *do* was named after the things it holds. An officer who
          pressed it found buttons that navigated away and no data, which is why
          the tab was reported as having no clear purpose: its name promised the
          wrong noun.

          The three verbs now say who acts. *Fråga* — you ask. *Starta* — you set
          the machine going. *Granska* — you judge what it produced, which is
          FAI-002's own word. Between them they describe one loop, and the count
          on *Granska* is where that loop is currently stuck.

          *Om* is the fourth, and it is a tab rather than a disclosure under the
          content. The catalogue, MI's limits and the traceability are reference
          material; sitting them beneath the queue meant every officer scrolled
          past the work to reach the bottom of a panel they had no reason to
          read. A different question deserves a different tab, not a longer page.
        */}
        <div className="border-b border-border px-5 pt-3">
          <Tabs
            label={t.tabsLabel}
            value={tab}
            onChange={setTab}
            tabs={[
              { id: "ask", label: t.tabAsk },
              { id: "here", label: t.tabTasks },
              {
                id: "queue",
                label: t.tabQueue,
                count: waiting,
                countLabel: t.queueCount(waiting),
              },
              { id: "about", label: t.tabAbout },
            ]}
          />
        </div>

        {/*
          The question tab owns its own scrolling, because its composer is
          pinned to the bottom of the panel and the transcript above it is what
          moves. The other three are ordinary scrolling documents.
        */}
        {tab === "ask" ? (
          <div className="min-h-0 flex-1">
            <AssistantChat lang={lang} role={role} facts={facts} onNavigate={close} />
          </div>
        ) : (
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-4">
            {tab === "here" && (
              /*
                Where the machine is, and where it is not.

                This tab was a **launcher** — "here is what you can ask the AI
                to do" — and nothing in §4.1 or §5.8 asks for one. §4.1's word
                is *integrerat*: the AI lives on the screens where the work
                happens, so a button that starts it from somewhere else is a
                navigation shortcut wearing an AI hat. On Rapporter it had
                degenerated into exactly that: one link to another screen.

                What it answers now is a question an authority buying AI
                genuinely has, on every screen, and that no competitor's demo
                will answer: *is the machine touching this page, and what does
                it do here?* Both halves are shown, because the half that says
                **no** is the one that makes the other half credible — a
                boundary an interface never states is a boundary the buyer has
                to take on trust. Four functions, named, each either working on
                this page with a way to the region, or named with the screen it
                works on instead.
              */
              <Section title={t.here} lead={t.hereRationale}>
                <p className="mb-4 text-table">{t.hereLead}</p>

                {here.length > 0 ? (
                  <>
                    <h4 className="mi-kicker mb-2 text-muted-foreground">{t.hereActive}</h4>
                    <p className="mb-3 text-table">{t.hereActiveLead}</p>
                    <ul className="space-y-4">
                      {here.map((f) => (
                        <li key={f.id} className="border-l-4 border-ai-solid pl-3">
                          <p className="font-semibold">{f.label}</p>
                          <p className="mt-1 text-label text-muted-foreground">{f.what}</p>
                          <div className="mt-2">
                            {/* The region on this page, not the page itself. */}
                            <LinkButton
                              href={aiTaskHref(f, pathname)}
                              size="sm"
                              iconEnd={<IconForward />}
                            >
                              {f.ask}
                            </LinkButton>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="text-table">{t.hereNone}</p>
                )}

                {elsewhere.length > 0 && (
                  <div className="mt-5 border-t border-border pt-4">
                    <h4 className="mi-kicker mb-2 text-muted-foreground">{t.hereElsewhere}</h4>
                    {/*
                      Quiet rows, not buttons. These functions do not apply
                      here, and drawing them as controls is what made the old
                      tab offer three protocol tasks on Rapporter — every one
                      of which navigated away from the screen the officer was
                      standing on.

                      The function's own name is the link, and where it works
                      sits under it. Two wordings failed before this one.
                      `f.where` is a sentence, not a place — *"I protokollvyn,
                      och tabellen underhålls under Administration"* — so
                      "Gå till …" produced a link that was a paragraph.
                      Substituting the menu item's name gave three rows all
                      reading *Gå till Avtal*, because three of the four
                      functions belong to the same register: identical labels
                      on controls that go to different places, which is the
                      fault the walkthrough's step buttons were fixed for. The
                      name is unique by construction.
                    */}
                    <ul className="space-y-3">
                      {elsewhere.map((f) => (
                        <li key={f.id}>
                          <Link
                            href={f.href}
                            className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-primary underline underline-offset-2"
                          >
                            {f.label}
                            <IconForward />
                          </Link>
                          <p className="text-label text-muted-foreground">{f.where}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Section>
            )}

            {tab === "queue" && (
              <Section title={t.queue} lead={canReview ? t.queueLead : t.readOnly}>
                {/*
                  What the number counts, and whose it is — the two questions
                  asked of this tab, answered above the list rather than left to
                  be worked out from it. The queue is not personal: it is every
                  unapproved proposal in the registers this role may write to, so
                  two agreement administrators see the same list and either of
                  them can clear it. Saying so matters, because a list headed
                  "waiting for your review" that is in fact shared would have an
                  officer read a colleague's work as their own backlog.
                */}
                <p className="mb-3 text-table">{canReview ? t.queueWhat : t.readOnly}</p>
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
            )}

            {tab === "about" && (
              <>
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
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
