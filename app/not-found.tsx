import Link from "next/link";

import { activeDictionary } from "@/lib/session";

export default async function NotFound() {
  const i18n = await activeDictionary();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p aria-hidden className="font-display text-7xl font-bold text-[var(--mi-slate-500)]">
          404
        </p>
        <h1 className="mt-4 font-display text-page-title font-semibold text-foreground">
          {i18n.notFound.title}
        </h1>
        <p className="mt-2 text-table text-muted-foreground">{i18n.notFound.body}</p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-5 py-3 text-table font-bold text-primary-foreground transition-colors hover:bg-[var(--mi-slate-900)]"
          >
            {i18n.notFound.home}
          </Link>
        </div>
      </div>
    </div>
  );
}
