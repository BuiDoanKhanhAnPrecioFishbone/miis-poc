"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { Lang } from "@/lib/domain/lang";
import { canRegister, type RegistrationStage } from "@/lib/domain/upload";
import { dictionary } from "@/lib/i18n";
import { IconForward } from "./icons";
import { Button, Callout, FieldLabel, LinkButton, ReqTag } from "./primitives";

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
  incomplete: boolean;
  setIncomplete: (value: boolean) => void;
  /**
   * The agreement the officer matched the protocol to.
   *
   * FA-022 attaches the protocol to an agreement that already exists, and the
   * act has to end on that agreement rather than on a register of seventeen.
   * Which one it is used to be decided on the server and hard-coded; it is now
   * the officer's choice, so it travels the way `stage` does.
   */
  matchedId?: string;
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
export function RegistrationSave({
  lang,
  agreementHref,
}: {
  lang: Lang;
  /**
   * The agreement the protocol was registered on.
   *
   * FA-022 attaches a protocol to an agreement that already exists, so the act
   * ends *on that agreement*. The control used to open `/avtal` — the register
   * of seventeen — which made the officer find again the record they had just
   * been working on. An act that produces something should land on the thing it
   * produced.
   */
  agreementHref: string;
}) {
  const ctx = useContext(RegistrationContext);
  const t = dictionary(lang).registrera.save;

  /* Rendered outside the flow (a static preview) — show the buttons inert. */
  const stage: RegistrationStage = ctx?.stage ?? "empty";
  const allowed = canRegister(stage);

  /* FA-021 — the other way this screen ends. */
  if (ctx?.incomplete) {
    return (
      <div className="mt-5">
        <Callout tone="attention" live label={t.savedIncomplete} tags={["FA-021", "FA-022"]}>
          {t.savedIncompleteNote}
        </Callout>
        <div className="mt-3">
          <Button variant="secondary" onClick={() => ctx.setIncomplete(false)}>
            {t.reopen}
          </Button>
        </div>
      </div>
    );
  }

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
        {/*
          `LinkButton`, not a hand-rolled `<a>`. This was the eighth screen to
          draw its own, and it had drifted the way the others did: `rounded-sm`
          against `Button`'s shape and `px-5 py-3` against its size scale, so
          the two controls in this pair — one primary, one secondary, on the
          same row — rendered at two different heights and two different corner
          radii. A size difference between two adjacent buttons reads as a
          hierarchy nobody intended.
        */}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {/* The officer's match wins over the page's default: they may have
              corrected the AI's proposal, and the act ends on what they chose. */}
          <LinkButton
            href={ctx?.matchedId ? `/avtal/${ctx.matchedId}` : agreementHref}
            iconEnd={<IconForward />}
          >
            {t.registeredNext}
          </LinkButton>
          <Button variant="secondary" onClick={() => ctx?.setRegistered(false)}>
            {t.reopen}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/*
        FA-021's two states, shown as the consequence of the two actions rather
        than as a third control that could disagree with them.
      */}
      <div className="mt-5 border-t border-border pt-4">
        <FieldLabel>{t.registrationStatus}</FieldLabel>
        <p className="text-body">{t.statusFromAction}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
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
        {/*
          Wired, not marked inert: US-01's alternative flow is "save as
          incomplete and complete later", and FA-021 makes Ofullständig a real
          registration state with a reminder attached. It is one of the two ways
          this screen can end, so a demo that cannot take it is showing half the
          scenario.
        */}
        <Button variant="secondary" onClick={() => ctx?.setIncomplete(true)}>
          {t.saveIncomplete}
        </Button>
        <ReqTag id="FA-022" />
      </div>
      {!allowed && (
        <p className="mt-2 text-label text-muted-foreground">{t.approveFirst}</p>
      )}
    </>
  );
}
