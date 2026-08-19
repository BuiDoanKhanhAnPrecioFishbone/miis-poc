"use client";

import Link from "next/link";
import { createContext, useContext, type ReactNode } from "react";

import type { Lang } from "@/lib/domain/lang";
import { canRegister, type RegistrationStage } from "@/lib/domain/upload";
import { dictionary } from "@/lib/i18n";
import { IconForward } from "./icons";
import { Button, Callout, ReqTag } from "./primitives";

/**
 * The registration's stage, shared between the stepper and the save panel.
 *
 * These two are far apart in the tree and have to agree. `ProtocolReview` owns
 * the state and draws the stepper; the save panel is server-rendered on
 * `/registrera` and handed down as `children`, so it cannot be given the state
 * as a prop. Context is what crosses that boundary — a client component nested
 * inside server-rendered children still reads a client provider above it.
 *
 * Before this existed the save button had no `onClick` at all. Pressing the
 * control that finishes MI's five-step flow did nothing, and the stepper's last
 * two steps could not be completed by any action on the screen.
 */
interface Registration {
  stage: RegistrationStage;
  setRegistered: (value: boolean) => void;
}

const RegistrationContext = createContext<Registration | null>(null);

export function RegistrationProvider({
  value,
  children,
}: {
  value: Registration;
  children: ReactNode;
}) {
  return <RegistrationContext.Provider value={value}>{children}</RegistrationContext.Provider>;
}

/**
 * The controls that end the flow — FA-022, and FAI-002's gate.
 *
 * Two states, and the second one matters as much as the first: once the
 * protocol is registered the panel says so and offers the way back, rather than
 * leaving a button that has already been pressed looking exactly as it did
 * before. An evaluator clicking through the scenario needs to see the flow
 * arrive somewhere.
 */
export function RegistrationSave({ lang }: { lang: Lang }) {
  const ctx = useContext(RegistrationContext);
  const t = dictionary(lang).registrera.save;

  /* Rendered outside the flow (a static preview) — show the buttons inert. */
  const stage: RegistrationStage = ctx?.stage ?? "empty";
  const allowed = canRegister(stage);

  if (stage === "registered") {
    return (
      <div className="mt-5">
        {/*
          Where it went and what to do next. A confirmation that only says
          "done" leaves the officer — and an evaluator walking the scenario —
          at a dead end on the screen where the work was supposed to produce
          something. FA-022 puts the agreement in the register; this says so and
          offers the way there.
        */}
        <Callout tone="ok" live label={t.registered} tags={["FA-022", "FAI-002"]}>
          {t.registeredWhere}
        </Callout>
        {/*
          No badge repeating the callout's own label. A `Badge` is a short state
          word and is `shrink-0`, so a sentence in one cannot wrap — this said
          "Protokollet är registrerat och kopplat" and pushed the page 57px wide
          at 375.
        */}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Link
            href="/avtal"
            className="inline-flex min-h-12 items-center gap-2 rounded-sm border-2 border-transparent bg-primary px-5 py-3 font-bold text-primary-foreground transition-colors hover:bg-[var(--mi-slate-900)]"
          >
            {t.registeredNext}
            <IconForward />
          </Link>
          <Button variant="secondary" onClick={() => ctx?.setRegistered(false)}>
            {t.reopen}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {/*
          FAI-002 as a gate the officer can see. A control that silently does
          nothing teaches an evaluator that the prototype is a picture, so the
          reason is on the control rather than discovered by pressing it.
        */}
        <Button
          onClick={() => ctx?.setRegistered(true)}
          disabled={!allowed}
          disabledReason={t.approveFirst}
        >
          {t.approveAndLink}
        </Button>
        <Button variant="secondary">{t.saveIncomplete}</Button>
        <ReqTag id="FA-022" />
      </div>
      {!allowed && (
        <p className="mt-2 text-label text-muted-foreground">{t.approveFirst}</p>
      )}
    </>
  );
}
