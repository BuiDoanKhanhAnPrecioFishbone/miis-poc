import { describe, expect, it } from "vitest";

import { NAV_TREE } from "./nav";
import { accessLevel, canAccess, canEdit, ROLES } from "./role";

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

/**
 * Appendix 1 §3.1 does not give every role the same verb. The agreement
 * administrator has "read, write, edit"; the statistics user has "read, data
 * extract"; the public computer and the mediator have "specific reports". A
 * model that only asked whether a role could open a screen would have let a
 * statistics user edit an agreement.
 */
describe("accessLevel — Appendix 1 §3.1", () => {
  const role = (id: string) => {
    const found = ROLES.find((r) => r.id === id);
    if (!found) throw new Error(`no role ${id}`);
    return found;
  };

  it("gives the agreement administrator write on the agreement domain", () => {
    expect(accessLevel(role("agreement-admin"), "avtal")).toBe("write");
    expect(accessLevel(role("agreement-admin"), "parter")).toBe("write");
  });

  it("keeps the statistics user read-only everywhere it can reach", () => {
    for (const screen of role("statistics-user").nav) {
      expect(accessLevel(role("statistics-user"), screen)).not.toBe("write");
    }
  });

  it("gives read, not write, where a role can look but not change", () => {
    expect(accessLevel(role("agreement-admin"), "market")).toBe("read");
    expect(accessLevel(role("agreement-admin"), "sok")).toBe("read");
    expect(accessLevel(role("mediator"), "medling")).toBe("read");
  });

  it("reports none for a screen the role cannot reach at all", () => {
    expect(accessLevel(role("statistics-user"), "administration")).toBe("none");
    expect(accessLevel(role("agreement-admin"), "medling")).toBe("none");
  });

  /* A role that could write to a screen it cannot open would be incoherent. */
  it("never grants write without access", () => {
    for (const r of ROLES) {
      for (const screen of r.write) expect(r.nav).toContain(screen);
    }
  });

  /* §3.1: the system administrator has full access *excluding* permissions. */
  it("keeps user administration away from the system administrator", () => {
    expect(canEdit(role("system-admin"), "anvandare")).toBe(false);
    expect(canEdit(role("permission-admin"), "anvandare")).toBe(true);
  });
});
