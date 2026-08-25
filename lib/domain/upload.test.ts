import { describe, expect, it } from "vitest";

import type { RegistrationStage } from "./upload";
import { canRegister, registrationSteps } from "./upload";

const STAGES: RegistrationStage[] = ["empty", "analysing", "review", "approved", "registered"];

/**
 * MI's five-step registration flow (Appendix 1 §4.4). The stepper is the claim
 * that MIIS follows the customer's process in the customer's order, so the
 * states it can report are a domain rule and not a presentation detail.
 */
describe("registrationSteps — Appendix 1 §4.4", () => {
  it("reports five steps at every stage", () => {
    for (const stage of STAGES) expect(registrationSteps(stage)).toHaveLength(5);
  });

  it("starts with the upload current and nothing done", () => {
    expect(registrationSteps("empty")).toEqual([
      "current",
      "upcoming",
      "upcoming",
      "upcoming",
      "upcoming",
    ]);
  });

  /*
    The defect this rule was extracted to fix: the flow could not reach its own
    end. Whatever the officer did, steps 4 and 5 stayed unfinished.
  */
  it("completes every step once the protocol is registered", () => {
    expect(registrationSteps("registered")).toEqual(["done", "done", "done", "done", "done"]);
  });

  it("marks exactly one step current until the flow is finished", () => {
    for (const stage of STAGES) {
      const current = registrationSteps(stage).filter((s) => s === "current").length;
      expect(current).toBe(stage === "registered" ? 0 : 1);
    }
  });

  /* Progress only ever moves forward: no stage un-does a completed step. */
  it("never reduces the number of completed steps as the flow advances", () => {
    const done = STAGES.map((s) => registrationSteps(s).filter((x) => x === "done").length);
    expect(done).toEqual([...done].sort((a, b) => a - b));
  });
});

/**
 * FAI-002 — *"approval before being saved"*. The gate belongs to the domain
 * because it is the requirement, not a convenience: saving must be unreachable
 * while proposals are unapproved.
 */
describe("canRegister — FAI-002", () => {
  it("refuses to register before the proposals are approved", () => {
    expect(canRegister("empty")).toBe(false);
    expect(canRegister("analysing")).toBe(false);
    expect(canRegister("review")).toBe(false);
  });

  it("allows registering once the officer has approved", () => {
    expect(canRegister("approved")).toBe(true);
  });

  it("stays true afterwards, so a registered protocol is not re-gated", () => {
    expect(canRegister("registered")).toBe(true);
  });
});
