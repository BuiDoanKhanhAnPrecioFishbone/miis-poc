import { describe, expect, it } from "vitest";

import { NAV_HREF } from "./nav";
import { REQUIREMENTS } from "./requirements";
import { accessLevel, ROLES } from "./role";
import {
  scoredScenarios,
  supportingScenarios,
  WALKTHROUGH,
  walkthroughRequirements,
  walkthroughRoutes,
} from "./walkthrough";

const role = (id: string) => {
  const found = ROLES.find((r) => r.id === id);
  if (!found) throw new Error(`no role ${id}`);
  return found;
};

/**
 * The criterion names three roles. The prototype implements eight, which is
 * right, but the presentation is marked on three — and the guide exists because
 * the demo used to lead with two the criterion does not name.
 */
describe("the scored scenarios", () => {
  it("are the criterion's three, in the order it names them", () => {
    expect(scoredScenarios().map((s) => s.role)).toEqual([
      "agreement-admin",
      "system-admin",
      "public",
    ]);
  });

  it("come before the supporting ones", () => {
    const firstSupporting = WALKTHROUGH.findIndex((s) => !s.scored);
    const lastScored = WALKTHROUGH.map((s) => s.scored).lastIndexOf(true);
    expect(lastScored).toBeLessThan(firstSupporting);
  });

  it("each carry the four elements the criterion asks for", () => {
    for (const s of scoredScenarios()) {
      expect(s.taskAndGoal.sv.length, `${s.id} task and goal`).toBeGreaterThan(100);
      expect(s.usability.sv.length, `${s.id} usability`).toBeGreaterThan(100);
      expect(s.steps.length, `${s.id} workflow`).toBeGreaterThan(1);
      /* The visualisation is the screen each step opens. */
      expect(s.steps.every((step) => step.href.startsWith("/"))).toBe(true);
    }
  });

  it("keeps the other roles as supporting evidence rather than dropping them", () => {
    const supporting = supportingScenarios().map((s) => s.role);
    expect(supporting).toContain("mediation-admin");
    expect(supporting).toContain("statistics-user");
    expect(supporting).toContain("mediator-admin");
    expect(supporting).toContain("permission-admin");
  });
});

describe("every scenario", () => {
  it("is written in both languages", () => {
    for (const s of WALKTHROUGH) {
      expect(s.title.en.length, s.id).toBeGreaterThan(0);
      expect(s.taskAndGoal.en.length, s.id).toBeGreaterThan(0);
      expect(s.usability.en.length, s.id).toBeGreaterThan(0);
      for (const step of s.steps) {
        expect(step.label.en.length, `${s.id}/${step.href}`).toBeGreaterThan(0);
        expect(step.detail.en.length, `${s.id}/${step.href}`).toBeGreaterThan(0);
      }
    }
  });

  it("cites only requirement IDs that exist", () => {
    for (const id of walkthroughRequirements()) {
      expect(REQUIREMENTS[id], id).toBeDefined();
    }
  });
});

/**
 * The one that would ruin a fifteen-minute presentation.
 *
 * Every step names the role it is performed as, and the guide switches to that
 * role before navigating. If a step sends a reviewer to a screen its own role is
 * refused, they get the authorisation notice on stage — so `accessLevel` decides
 * it here instead, from the same function the screen guard asks.
 */
describe("every step is reachable by the role it names", () => {
  /** Which menu item owns a route, for the routes the nav does not name directly. */
  const OWNER: Record<string, string> = {
    "/": "start",
    "/registrera": "avtal",
    "/avtal": "avtal",
    "/avtal/A-001": "avtal",
    "/rapporter": "rapporter",
    "/administration": "administration",
    "/administration/anvandare": "anvandare",
    "/medling/M-2027-12": "medling",
    "/partstraffar/PT-2027-05": "partstraffar",
    "/sok": "sok",
    "/medlare": "medlare",
  };

  it("covers every route the walkthrough uses", () => {
    for (const href of walkthroughRoutes()) {
      /* The public entrance is outside the app shell and has no menu item. */
      if (href === "/allmanheten") continue;
      expect(OWNER[href], `no owner mapped for ${href}`).toBeDefined();
    }
  });

  it("never sends a role somewhere it would be refused", () => {
    for (const scenario of WALKTHROUGH) {
      for (const step of scenario.steps) {
        if (step.href === "/allmanheten") {
          expect(step.role, "the public entrance is the public role's").toBe("public");
          continue;
        }
        const owner = OWNER[step.href]!;
        expect(
          accessLevel(role(step.role), owner as never),
          `${scenario.id}: ${step.role} cannot open ${step.href}`,
        ).not.toBe("none");
      }
    }
  });

  it("uses routes the navigation actually knows", () => {
    const known = new Set(Object.values(NAV_HREF));
    for (const href of walkthroughRoutes()) {
      const base = href.split("/").slice(0, 2).join("/") || "/";
      expect(
        known.has(href) || known.has(base) || href === "/allmanheten" || href === "/registrera",
        `${href} is not a route the navigation knows`,
      ).toBe(true);
    }
  });
});
