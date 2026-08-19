import { describe, expect, it } from "vitest";

import { NAV_TREE } from "./nav";
import { canAccess, ROLES } from "./role";

/**
 * NFÅ-003 — *"rollbaserad behörighetsstyrning enligt de åtta användarrollerna"*.
 *
 * These assertions are about the role model rather than about any screen: if a
 * role's menu list changes, the screens it can open change with it, and one of
 * these tests should be the thing that notices.
 */
describe("canAccess — NFÅ-003", () => {
  const role = (id: string) => {
    const found = ROLES.find((r) => r.id === id);
    if (!found) throw new Error(`no role ${id}`);
    return found;
  };

  it("lets a role open the screens in its own menu", () => {
    expect(canAccess(role("agreement-admin"), "avtal")).toBe(true);
    expect(canAccess(role("mediation-admin"), "medling")).toBe(true);
    expect(canAccess(role("system-admin"), "administration")).toBe(true);
  });

  /*
    The case that motivated the rule: the change log is reachable by typing a
    URL if authorisation is only a filter on the menu.
  */
  it("refuses a screen the role does not have, however it is reached", () => {
    expect(canAccess(role("statistics-user"), "administration")).toBe(false);
    expect(canAccess(role("statistics-user"), "avtal")).toBe(false);
    expect(canAccess(role("agreement-admin"), "medling")).toBe(false);
    expect(canAccess(role("mediator-admin"), "anvandare")).toBe(false);
  });

  it("gives every role a start page except the public entrance", () => {
    for (const r of ROLES) {
      expect(canAccess(r, "start")).toBe(r.id !== "public");
    }
  });

  /* A menu entry pointing at nothing would render a link to a dead route. */
  it("only names screens that exist in the navigation tree", () => {
    const known = new Set(NAV_TREE.flatMap((n) => [n.id, ...(n.children ?? [])]));
    for (const r of ROLES) {
      for (const id of r.nav) expect(known.has(id)).toBe(true);
    }
  });

  it("covers all eight roles Appendix 1 §3.1 names", () => {
    expect(ROLES).toHaveLength(8);
  });
});
