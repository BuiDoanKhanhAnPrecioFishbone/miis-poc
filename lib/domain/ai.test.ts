import { describe, expect, it } from "vitest";

import {
  AI_BOUNDARIES,
  AI_FUNCTIONS,
  aiFunctionsForPath,
  aiFunctionsForRole,
  mayReviewAi,
  queueTotal,
  visibleQueue,
  aiTaskHref,
  type AiQueueItem,
} from "./ai";
import { REQUIREMENTS } from "./requirements";
import { ROLES } from "./role";

const role = (id: string) => {
  const found = ROLES.find((r) => r.id === id);
  if (!found) throw new Error(`no role ${id}`);
  return found;
};

/**
 * §4.1 names four AI functions and no more. The catalogue is the claim the
 * assistant makes to an evaluator, so a fifth appearing here without a
 * requirement behind it is exactly the failure these assertions exist to catch.
 */
describe("the §4.1 catalogue", () => {
  it("has MI's four functions and nothing else", () => {
    expect(AI_FUNCTIONS.map((f) => f.id)).toEqual([
      "quick-registration",
      "watchwords",
      "field-extraction",
      "mediation-support",
    ]);
  });

  it("cites only requirement IDs that exist", () => {
    const ids = [
      ...AI_FUNCTIONS.flatMap((f) => f.requirements),
      ...AI_BOUNDARIES.flatMap((b) => b.requirements),
    ];
    for (const id of ids) expect(REQUIREMENTS[id], id).toBeDefined();
  });

  it("states both of the limits §4.1 puts in writing", () => {
    const ids = AI_BOUNDARIES.map((b) => b.id);
    expect(ids).toContain("manual-approval");
    expect(ids).toContain("new-agreements-manual");
  });
});

describe("aiFunctionsForPath", () => {
  it("finds the registration functions on the registration screen", () => {
    expect(aiFunctionsForPath("/registrera").map((f) => f.id)).toEqual([
      "quick-registration",
      "watchwords",
      "field-extraction",
    ]);
  });

  it("lets a detail view inherit its register's answer", () => {
    expect(aiFunctionsForPath("/medling/M-2027-12").map((f) => f.id)).toEqual([
      "mediation-support",
    ]);
  });

  /* The one that would be silently wrong: `/` prefix-matching everything. */
  it("claims nothing on the start page", () => {
    expect(aiFunctionsForPath("/")).toHaveLength(0);
  });

  it("claims nothing on a screen no requirement puts AI on", () => {
    expect(aiFunctionsForPath("/rapporter")).toHaveLength(0);
    expect(aiFunctionsForPath("/parter")).toHaveLength(0);
  });
});

/**
 * NFÅ-003, applied to the AI. §3.1 gives the statistics user "läsa, datauttag",
 * so an Approve control in front of them would contradict the authorisation
 * matrix two screens away.
 */
describe("mayReviewAi — NFÅ-003", () => {
  it("lets the agreement administrator approve", () => {
    expect(mayReviewAi(role("agreement-admin"))).toBe(true);
  });

  it("lets the mediation administrator approve", () => {
    expect(mayReviewAi(role("mediation-admin"))).toBe(true);
  });

  it("does not let a read-only role approve", () => {
    expect(mayReviewAi(role("statistics-user"))).toBe(false);
    expect(mayReviewAi(role("public"))).toBe(false);
    expect(mayReviewAi(role("mediator"))).toBe(false);
  });
});

describe("aiFunctionsForRole", () => {
  it("gives the mediation administrator the mediation function", () => {
    expect(aiFunctionsForRole(role("mediation-admin")).map((f) => f.id)).toContain(
      "mediation-support",
    );
  });

  it("gives the public role nothing, so it gets no launcher", () => {
    expect(aiFunctionsForRole(role("public"))).toHaveLength(0);
  });
});

describe("the review queue", () => {
  const queue: AiQueueItem[] = [
    {
      id: "registration",
      functionId: "quick-registration",
      subject: { sv: "Avtal", en: "Agreement" },
      detail: { sv: "…", en: "…" },
      href: "/registrera",
      proposals: 9,
      nav: "avtal",
    },
    {
      id: "M-2027/12",
      functionId: "mediation-support",
      subject: { sv: "Medling", en: "Mediation" },
      detail: { sv: "…", en: "…" },
      href: "/medling/M-2027-12",
      proposals: 3,
      nav: "medling",
    },
  ];

  it("adds up what is waiting", () => {
    expect(queueTotal(queue)).toBe(12);
  });

  /*
    The mediation administrator can *read* the agreement register, so filtering
    on read access put the agreement administrator's protocol in their queue —
    work they cannot clear. The queue is what this role may approve.
  */
  it("shows a role only the items it may approve", () => {
    const forMediation = visibleQueue(queue, role("mediation-admin"));
    expect(forMediation.map((i) => i.id)).toEqual(["M-2027/12"]);
  });

  it("shows the agreement administrator the registration it owns", () => {
    const forAgreements = visibleQueue(queue, role("agreement-admin"));
    expect(forAgreements.map((i) => i.id)).toEqual(["registration"]);
  });

  it("shows a read-only role nothing", () => {
    expect(visibleQueue(queue, role("statistics-user"))).toHaveLength(0);
    expect(visibleQueue(queue, role("public"))).toHaveLength(0);
  });
});

/**
 * §4.1's third function is *"via fritextsökning"*, and the assistant's task
 * button for it used to link to the screen it was already on.
 */
describe("aiTaskHref", () => {
  const fn = { href: "/registrera", anchor: "#steg-fritext" };

  it("goes to the region when the officer is already on the screen", () => {
    expect(aiTaskHref(fn, "/registrera")).toBe("#steg-fritext");
  });

  it("goes to the screen and then the region from anywhere else", () => {
    expect(aiTaskHref(fn, "/rapporter")).toBe("/registrera#steg-fritext");
  });

  it("falls back to the screen for a function with no region", () => {
    expect(aiTaskHref({ href: "/medling" }, "/rapporter")).toBe("/medling");
    expect(aiTaskHref({ href: "/medling" }, "/medling")).toBe("/medling");
  });

  /* Every function that runs on a screen names its region, or the button on
     that screen navigates nowhere. */
  it("gives every function a region on the screen it runs on", () => {
    for (const f of AI_FUNCTIONS) {
      if (f.routes.includes(f.href)) {
        expect(f.anchor, `${f.id} has no anchor`).toBeDefined();
      }
    }
  });
});
