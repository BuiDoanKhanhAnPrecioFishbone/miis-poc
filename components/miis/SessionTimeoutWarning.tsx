"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Lang } from "@/lib/domain/lang";
import { dictionary } from "@/lib/i18n";
import { Button, ReqTag } from "./primitives";

/**
 * NFÅ-002 — inactive sessions end automatically after a configurable limit,
 * by default 30 minutes.
 *
 * The requirement is about what happens to the user, not about a timer: an
 * administrator halfway through registering a protocol needs to be told before
 * the work is lost, in time to do something about it. So the warning arrives at
 * 28 minutes with two minutes of countdown and two plain choices.
 *
 * It is a modal alert dialog: focus moves into it, Tab is trapped inside it,
 * Escape dismisses it (WCAG 2.1.2 no keyboard trap and 2.5.5 target size both
 * apply), and the remaining time is announced once a minute rather than once a
 * second, which would flood a screen reader.
 *
 * The demo bar can trigger it on demand — a warning nobody can reach in a
 * 15-minute presentation is a warning nobody can evaluate.
 */

const INACTIVITY_BEFORE_WARNING_MS = 28 * 60 * 1000;
const COUNTDOWN_SECONDS = 120;

function mmss(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function SessionTimeoutWarning({
  lang,
  forcedOpen,
  onDismiss,
}: {
  lang: Lang;
  /** Set by the demo bar so the state can be shown on request. */
  forcedOpen: boolean;
  onDismiss: () => void;
}) {
  const t = dictionary(lang).session;
  const [open, setOpen] = useState(false);
  const [remaining, setRemaining] = useState(COUNTDOWN_SECONDS);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const visible = open || forcedOpen;

  const close = useCallback(() => {
    setOpen(false);
    setRemaining(COUNTDOWN_SECONDS);
    onDismiss();
  }, [onDismiss]);

  // Idle detection. Any real interaction restarts the clock, which is what
  // "inactivity" means — not "time since page load".
  useEffect(() => {
    if (visible) return;
    let timer = window.setTimeout(() => setOpen(true), INACTIVITY_BEFORE_WARNING_MS);
    const restart = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setOpen(true), INACTIVITY_BEFORE_WARNING_MS);
    };
    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, restart, { passive: true }));
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, restart));
    };
  }, [visible]);

  // Countdown while the warning is up.
  useEffect(() => {
    if (!visible) return;
    const id = window.setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [visible]);

  // Focus management: remember where focus was, move it in, put it back after.
  useEffect(() => {
    if (!visible) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const first = dialogRef.current?.querySelector<HTMLElement>("button");
    first?.focus();
    return () => previouslyFocused.current?.focus();
  }, [visible]);

  // Trap Tab inside the dialog and let Escape out, per WCAG 2.1.2.
  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
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
  }, [visible, close]);

  if (!visible) return null;

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[var(--mi-ink)]/60 px-4">
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="session-title"
        aria-describedby="session-body"
        className="w-full max-w-lg rounded-lg border-2 border-border bg-card p-6 shadow-card"
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h2 id="session-title" className="font-display text-section font-semibold">
            {t.title}
          </h2>
          <ReqTag id="NFÅ-002" />
        </div>

        <p id="session-body" className="text-table">
          {t.body}
        </p>

        <p className="mt-4 font-display text-page-title font-semibold tabular-nums text-[var(--mi-slate-900)]">
          {t.remaining(mmss(remaining))}
        </p>

        {/* Announced once a minute, not once a second. */}
        <p aria-live="polite" className="sr-only">
          {t.remainingAria(minutes, seconds)}
        </p>

        <p className="mt-3 text-label text-muted-foreground">{t.unsaved}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={close}>{t.continueWorking}</Button>
          <Button variant="secondary" onClick={close}>
            {t.logout}
          </Button>
        </div>
      </div>
    </div>
  );
}
