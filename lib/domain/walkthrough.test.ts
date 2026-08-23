import { describe, expect, it } from "vitest";

import { NAV_HREF } from "./nav";
import { REQUIREMENTS } from "./requirements";
import { accessLevel, ROLES } from "./role";
import {
  cursorAt,
  decodePosition,
  encodePosition,
  scoredScenarios,
  supportingScenarios,
  totalSteps,
  WALKTHROUGH,
  walkthroughRequirements,
  stepRoute,
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
  });

  /*
    All eight §3.1 roles still appear, and the authorisation administrator now
    appears inside the *scored* system administrator scenario rather than in a
    supporting one of its own — that is where Bilaga 2 §3.5 puts the work, and a
    supporting scenario repeating it would show an evaluator the same screen
    twice.
  */
  it("performs some scored steps as the authorisation administrator", () => {
    const roles = WALKTHROUGH.flatMap((s) => s.steps.map((step) => step.role));
    expect(roles).toContain("permission-admin");
    expect(
      scoredScenarios().flatMap((s) => s.steps.map((step) => step.role)),
    ).toContain("permission-admin");
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
    "/avtal/ny": "avtal",
    "/avtal/A-001": "avtal",
    "/avtal/A-010": "avtal",
    "/rapporter": "rapporter",
    "/administration": "administration",
    "/administration/anvandare": "anvandare",
    "/medling/M-2027-12": "medling",
    "/partstraffar/PT-2027-05": "partstraffar",
    "/sok": "sok",
    "/medlare": "medlare",
  };

  /* Everything under `/allmanheten` is outside the app shell and has no menu
     item: NFÅ-006 puts that role on a whitelisted machine with no sign-in, so
     there is nothing for `accessLevel` to answer about. */
  const isPublicRoute = (href: string) => href === "/allmanheten" || href.startsWith("/allmanheten/");
  /* A step may deep-link into a section; the fragment is not part of the route. */
  const routeOf = (href: string) => stepRoute(href);

  it("covers every route the walkthrough uses", () => {
    for (const href of walkthroughRoutes()) {
      if (isPublicRoute(href)) continue;
      expect(OWNER[href], `no owner mapped for ${href}`).toBeDefined();
    }
  });

  it("never sends a role somewhere it would be refused", () => {
    for (const scenario of WALKTHROUGH) {
      for (const step of scenario.steps) {
        if (isPublicRoute(routeOf(step.href))) {
          expect(step.role, "the public entrance is the public role's").toBe("public");
          continue;
        }
        const owner = OWNER[routeOf(step.href)]!;
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
        known.has(href) || known.has(base) || isPublicRoute(href) || href === "/registrera",
        `${href} is not a route the navigation knows`,
      ).toBe(true);
    }
  });
});

/**
 * The cursor — the thing that makes the guide usable during a presentation.
 *
 * The walkthrough used to be a page you left: clicking a step opened a screen,
 * and the only way onward was back to a five-thousand-pixel document to find
 * your place. These assertions are about the position surviving the jump, and
 * about a stale one never producing a control that leads nowhere.
 */
describe("the walkthrough cursor", () => {
  const first = WALKTHROUGH[0]!;

  it("round-trips a position", () => {
    const p = { scenarioId: first.id, stepIndex: 1 };
    expect(decodePosition(encodePosition(p))).toEqual(p);
  });

  it("resolves a position to its step, with the one after it", () => {
    const c = cursorAt({ scenarioId: first.id, stepIndex: 0 })!;
    expect(c.scenario.id).toBe(first.id);
    expect(c.number).toBe(1);
    expect(c.total).toBe(first.steps.length);
    expect(c.next?.step).toBe(first.steps[1]);
    expect(c.next?.position.stepIndex).toBe(1);
  });

  /* A scenario is one officer doing one task. Running on into the next one
     would be the guide changing the subject without saying so. */
  it("stops at the end of a scenario rather than running into the next", () => {
    const last = cursorAt({ scenarioId: first.id, stepIndex: first.steps.length - 1 })!;
    expect(last.next).toBeNull();
  });

  /*
    A renamed scenario or a removed step must not leave a "Nästa" control in the
    demo strip that leads nowhere — that is the same dead control the cursor
    exists to remove.
  */
  it("refuses a stale or malformed cookie", () => {
    expect(decodePosition(undefined)).toBeNull();
    expect(decodePosition("")).toBeNull();
    expect(decodePosition("nope:0")).toBeNull();
    expect(decodePosition(`${first.id}:999`)).toBeNull();
    expect(decodePosition(`${first.id}:-1`)).toBeNull();
    expect(decodePosition(`${first.id}:x`)).toBeNull();
    expect(decodePosition(first.id)).toBeNull();
    expect(cursorAt(null)).toBeNull();
  });

  it("counts every step, so the guide can state the total up front", () => {
    expect(totalSteps()).toBe(WALKTHROUGH.reduce((n, s) => n + s.steps.length, 0));
    expect(totalSteps()).toBeGreaterThan(10);
  });
});

/**
 * Bilaga 2 §3.5 prescribes the steps, and it is the only document that does.
 *
 * The walkthrough was cut from our own US-* scenarios before §3.5 arrived, and
 * it did not match: the system administrator's scenario was logs and settings
 * where MI asks for users, roles and permissions first. These assertions are
 * about the **shape** of the scored scenarios rather than their wording, so a
 * step can be rewritten and a bullet cannot quietly go missing.
 */
describe("the scored scenarios follow Bilaga 2 §3.5", () => {
  const scored = scoredScenarios();

  it("names MI's three roles, in MI's order", () => {
    expect(scored.map((s) => s.role)).toEqual(["agreement-admin", "system-admin", "public"]);
  });

  /*
    §3.5 Scenario 1 has five bullets, and four of them are the authorisation
    administrator's under Bilaga 1 §3.1. The scenario spanning two roles is the
    answer to that contradiction, not an oversight — so it is asserted rather
    than left to be noticed.
  */
  it("covers Scenario 1's five bullets, across the two roles §3.1 separates", () => {
    const s = scored.find((x) => x.role === "system-admin")!;
    expect(s.steps).toHaveLength(6);
    const users = s.steps.filter((step) => step.href === "/administration/anvandare");
    expect(users, "overview, create, assign, change/revoke").toHaveLength(4);
    for (const step of users) expect(step.role).toBe("permission-admin");
    const settings = s.steps.filter((step) => step.href === "/administration");
    expect(settings.length).toBeGreaterThanOrEqual(1);
    for (const step of settings) expect(step.role).toBe("system-admin");
  });

  it("covers Scenario 2's four bullets — register, update, versions, publish", () => {
    const s = scored.find((x) => x.role === "agreement-admin")!;
    const routes = s.steps.map((step) => step.href);
    expect(routes, "a wholly new agreement, registered manually").toContain("/avtal/ny");
    expect(routes, "the AI-assisted protocol path").toContain("/registrera");
    expect(routes.filter((r) => r.startsWith("/avtal/A-")).length).toBeGreaterThanOrEqual(2);
  });

  it("covers Scenario 3's four bullets — search, narrow, read, download", () => {
    const s = scored.find((x) => x.role === "public")!;
    const routes = s.steps.map((step) => step.href);
    expect(routes.filter((r) => r === "/allmanheten").length).toBeGreaterThanOrEqual(2);
    expect(
      routes.some((r) => r.startsWith("/allmanheten/") && r !== "/allmanheten"),
      "opening one agreement, which is where the download lives",
    ).toBe(true);
  });
});

describe("stepping back through a scenario", () => {
  const first = WALKTHROUGH[0]!;

  /* A walkthrough is explored rather than marched. The browser's own Back
     button restores the page without restoring the role, which is the
     confusion the cursor exists to prevent — so going back is a control. */
  it("offers the step before, and none at the start", () => {
    expect(cursorAt({ scenarioId: first.id, stepIndex: 0 })!.previous).toBeNull();
    const second = cursorAt({ scenarioId: first.id, stepIndex: 1 })!;
    expect(second.previous?.step).toBe(first.steps[0]);
    expect(second.previous?.position.stepIndex).toBe(0);
  });

  it("keeps both directions available in the middle", () => {
    const middle = cursorAt({ scenarioId: first.id, stepIndex: 1 })!;
    expect(middle.previous).not.toBeNull();
    expect(middle.next).not.toBeNull();
  });
});
