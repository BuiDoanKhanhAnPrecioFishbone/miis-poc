"use client";

import { useEffect, useState } from "react";

import type { Lang } from "@/lib/domain/lang";
import { dictionary } from "@/lib/i18n";
import { IconPrint } from "./icons";
import { Button } from "./primitives";

/**
 * The letterhead a MIIS print carries — FR-011, after Bilaga F.
 *
 * MI's own six reports are described as *"faktiska utskrifter från nuvarande
 * system"*, and each opens the same way: the mark, an *Utskriftsdatum*, then a
 * rule and the data. A print that does not look like that is a screenshot of a
 * web page; MI's reader is expecting a document.
 *
 * Print-only, so it costs the screen nothing. The mark is `icon.svg` — MI's own
 * file, untouched, which fills #0B2A38 on a light ground; it is never redrawn or
 * recoloured (CLAUDE.md rule 8).
 *
 * **No page number.** Bilaga F prints "Sida 1 (1)", and Chrome does not support
 * the `@page` margin boxes that would put a real one there. Every browser adds
 * its own page numbers to a print, so the honest choice is to let it, rather
 * than to print "1 (1)" on a report that ran to four pages.
 */
export function PrintHeader({ lang, title }: { lang: Lang; title?: string }) {
  const t = dictionary(lang).print;
  const [printed, setPrinted] = useState("");

  /*
    Stamped when the print dialog opens, not when the page renders.

    A server-rendered date would be the day the deployment was built — wrong by
    however long it has been up — and setting it on mount would be both a
    hydration mismatch and a value that goes stale in a tab left open
    overnight. `beforeprint` is the moment the date actually means something.
  */
  useEffect(() => {
    const stamp = () => setPrinted(new Date().toISOString().slice(0, 10));
    window.addEventListener("beforeprint", stamp);
    return () => window.removeEventListener("beforeprint", stamp);
  }, []);

  return (
    <div className="print-only mb-6 hidden border-b-2 border-[var(--mi-ink)] pb-3">
      <div className="flex items-start justify-between gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon.svg" alt="Medlingsinstitutet" width={28} height={50} className="h-12 w-auto" />
        <div className="text-right text-label">
          <div className="font-bold">{t.printedAt}</div>
          <div className="tabular-nums">{printed}</div>
        </div>
      </div>
      {title && <p className="mt-3 font-display text-section font-semibold">{title}</p>}
    </div>
  );
}

/**
 * The one export in MIIS that can actually run.
 *
 * Every other one — Excel, CSV, JSON, a scheduled extract — needs a server, so
 * they say so on the control. Printing does not: the browser owns it, the
 * stylesheet shapes it, and FR-011 is satisfied by what is on the page when the
 * dialog opens. A working output beats four dashed buttons.
 */
export function PrintButton({
  lang,
  variant = "secondary",
}: {
  lang: Lang;
  variant?: "primary" | "secondary";
}) {
  const t = dictionary(lang).print;
  return (
    <Button variant={variant} onClick={() => window.print()} iconStart={<IconPrint />}>
      {t.action}
    </Button>
  );
}
