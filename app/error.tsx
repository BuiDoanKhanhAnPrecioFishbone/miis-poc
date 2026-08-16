"use client";

import Link from "next/link";
import { useEffect } from "react";

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Sidan kunde inte laddas
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Något gick fel. Försök igen eller gå tillbaka till startsidan.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Försök igen
          </button>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-md border-2 border-primary bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            Till startsidan
          </Link>
        </div>
      </div>
    </div>
  );
}
