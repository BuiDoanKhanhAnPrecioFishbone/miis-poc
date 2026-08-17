"use client";

import Link from "next/link";
import { useEffect } from "react";

import { DEFAULT_LANG, isLang, type Lang } from "@/lib/domain/lang";
import { dictionary } from "@/lib/i18n";

/**
 * An error boundary is a client component, so it cannot read the language
 * cookie on the server. It reads the `data-lang` attribute the root layout
 * already put on <html> instead — the same source, one step later.
 */
function currentLang(): Lang {
  if (typeof document === "undefined") return DEFAULT_LANG;
  const value = document.documentElement.dataset.lang;
  return isLang(value) ? value : DEFAULT_LANG;
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const i18n = dictionary(currentLang());

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-page-title font-semibold text-foreground">
          {i18n.error.title}
        </h1>
        <p className="mt-2 text-table text-muted-foreground">{i18n.error.body}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-5 py-3 text-table font-bold text-primary-foreground transition-colors hover:bg-[var(--mi-slate-900)]"
          >
            {i18n.error.retry}
          </button>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-md border-2 border-primary bg-background px-5 py-3 text-table font-bold text-foreground transition-colors hover:bg-secondary"
          >
            {i18n.notFound.home}
          </Link>
        </div>
      </div>
    </div>
  );
}
