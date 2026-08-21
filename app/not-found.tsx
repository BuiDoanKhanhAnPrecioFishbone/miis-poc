import { LinkButton } from "@/components/miis/primitives";
import { activeDictionary } from "@/lib/session";

export default async function NotFound() {
  const i18n = await activeDictionary();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        {/*
          `aria-hidden` hides it from a screen reader; it does not exempt it
          from NFUI-003. Slate 500 measured 2.4:1 against paper, which fails
          even the 3:1 large-text threshold — a decorative numeral is still
          text on a screen, and axe flagged it on every 404 in the audit.
        */}
        <p aria-hidden className="font-display text-7xl font-bold text-muted-foreground">
          404
        </p>
        <h1 className="mt-4 font-display text-page-title font-semibold text-foreground">
          {i18n.notFound.title}
        </h1>
        <p className="mt-2 text-table text-muted-foreground">{i18n.notFound.body}</p>
        {/* One size scale and one shape — this was the eighth screen to
            hand-roll a link that `LinkButton` already draws. */}
        <div className="mt-6">
          <LinkButton href="/">{i18n.notFound.home}</LinkButton>
        </div>
      </div>
    </div>
  );
}
