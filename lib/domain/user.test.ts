import { describe, expect, it } from "vitest";

import { ROLES } from "./role";
import {
  changeRole,
  deactivateUser,
  mayChangeRole,
  mayDeactivate,
  reactivateUser,
  unstaffedRoles,
  usersPerRole,
  type SystemUser,
} from "./user";

const user = (id: string, role: SystemUser["role"], active = true): SystemUser => ({
  id,
  name: id,
  efosIdentity: `SE-EFOS-${id}`,
  email: `${id}@mi.se`,
  unit: { sv: "Enhet", en: "Unit" },
  role,
  active,
  roleAssigned: { date: "2027-01-01", by: "Karin Lundqvist" },
});

describe("usersPerRole", () => {
  it("counts only active users", () => {
    const counts = usersPerRole([
      user("a", "agreement-admin"),
      user("b", "agreement-admin"),
      user("c", "agreement-admin", false),
      user("d", "statistics-user"),
    ]);
    expect(counts["agreement-admin"]).toBe(2);
    expect(counts["statistics-user"]).toBe(1);
  });
});

describe("unstaffedRoles", () => {
  it("names the roles nobody can reach", () => {
    const unstaffed = unstaffedRoles([user("a", "agreement-admin")], ROLES);
    expect(unstaffed).not.toContain("agreement-admin");
    expect(unstaffed).toContain("mediation-admin");
  });

  it("counts a deactivated user as nobody", () => {
    expect(unstaffedRoles([user("a", "agreement-admin", false)], ROLES)).toContain(
      "agreement-admin",
    );
  });
});

/**
 * The one lock-out worth preventing in code. NFÅ-005 requires MI to administer
 * permissions *without the supplier's involvement*, and a system whose last
 * authorisation administrator has just deactivated themselves can only be
 * repaired by us — which is the state the requirement exists to rule out.
 */
describe("mayDeactivate — NFÅ-005", () => {
  it("allows any ordinary user to be deactivated", () => {
    const users = [user("a", "agreement-admin"), user("b", "permission-admin")];
    expect(mayDeactivate(users[0]!, users)).toBe(true);
  });

  it("refuses the last active authorisation administrator", () => {
    const users = [user("a", "agreement-admin"), user("b", "permission-admin")];
    expect(mayDeactivate(users[1]!, users)).toBe(false);
  });

  it("allows one of two authorisation administrators", () => {
    const users = [user("a", "permission-admin"), user("b", "permission-admin")];
    expect(mayDeactivate(users[0]!, users)).toBe(true);
  });

  /* A deactivated administrator does not keep the seat warm for the other one. */
  it("does not count an inactive administrator as cover", () => {
    const users = [user("a", "permission-admin"), user("b", "permission-admin", false)];
    expect(mayDeactivate(users[0]!, users)).toBe(false);
  });

  it("says no to deactivating someone who is already inactive", () => {
    const users = [user("a", "agreement-admin", false)];
    expect(mayDeactivate(users[0]!, users)).toBe(false);
  });
});

/**
 * Bilaga 2 §3.5, Scenario 1: *"Ändrar eller återkallar behörigheter för en
 * befintlig användare."* The screen had creation and assignment; changing and
 * revoking existed as a disabled button and nothing else.
 */
describe("changing and revoking a role — Bilaga 2 §3.5", () => {
  const user = (over: Partial<SystemUser>): SystemUser => ({
    id: "U", name: "A", efosIdentity: "SE-EFOS-1", email: "a@mi.se",
    unit: { sv: "Enhet", en: "Unit" }, role: "agreement-admin", active: true,
    roleAssigned: { date: "2027-01-01", by: "B" }, ...over,
  });

  const users = [
    user({ id: "U-1" }),
    user({ id: "U-2", role: "permission-admin" }),
    user({ id: "U-3", role: "permission-admin", active: false }),
  ];

  it("moves the role and re-stamps who assigned it and when", () => {
    const next = changeRole(users, "U-1", "statistics-user", "Karin", "2027-08-21");
    const changed = next.find((u) => u.id === "U-1")!;
    expect(changed.role).toBe("statistics-user");
    expect(changed.roleAssigned).toEqual({ date: "2027-08-21", by: "Karin" });
    /* Everyone else is untouched, and the input is not mutated. */
    expect(next.find((u) => u.id === "U-2")!.role).toBe("permission-admin");
    expect(users.find((u) => u.id === "U-1")!.role).toBe("agreement-admin");
  });

  /*
    The same lock-out deactivation guards against. Moving the last authorisation
    administrator to another role leaves MI unable to administer permissions,
    which is the one repair NFÅ-005 exists to keep the supplier out of.
  */
  it("refuses to move the last active authorisation administrator", () => {
    expect(mayChangeRole(users[1]!, users, "statistics-user")).toBe(false);
    const withTwo = [...users, user({ id: "U-4", role: "permission-admin" })];
    expect(mayChangeRole(withTwo[1]!, withTwo, "statistics-user")).toBe(true);
  });

  it("refuses a change that changes nothing, and a change to an inactive user", () => {
    expect(mayChangeRole(users[0]!, users, "agreement-admin")).toBe(false);
    expect(mayChangeRole(users[2]!, users, "agreement-admin")).toBe(false);
  });

  it("revokes access by deactivating, under the same guard", () => {
    expect(deactivateUser(users, "U-1").find((u) => u.id === "U-1")!.active).toBe(false);
    /* U-2 is the only active authorisation administrator. */
    expect(deactivateUser(users, "U-2").find((u) => u.id === "U-2")!.active).toBe(true);
  });
});

/*
  The other half of §3.1's *redigera användare*. A register that can switch
  someone off and not on again is half a register, and the case is ordinary: a
  colleague returns from leave, or a revocation made in error has to be undone
  without involving the supplier — which is what NFÅ-005 exists for.
*/
describe("reactivateUser", () => {
  const team = [
    user("anna", "agreement-admin"),
    user("bo", "permission-admin"),
    user("cecilia", "statistics-user", false),
  ];

  it("puts the link back", () => {
    const on = reactivateUser(team, "cecilia");
    expect(on.find((u) => u.id === "cecilia")!.active).toBe(true);
  });

  it("leaves everybody else alone", () => {
    const on = reactivateUser(team, "cecilia");
    expect(on.filter((u) => u.id !== "cecilia").map((u) => u.active)).toEqual([true, true]);
  });

  /* Nothing to refuse on the way back: `mayDeactivate` exists because losing
     the last authorisation administrator locks MI out, and adding one cannot
     lock anybody out of anything. */
  it("is a no-op on somebody already active", () => {
    expect(reactivateUser(team, "anna")).toEqual(team);
  });

  /* The round trip, which is the act an administrator actually performs. */
  it("undoes a deactivation", () => {
    const off = deactivateUser(team, "anna");
    expect(off.find((u) => u.id === "anna")!.active).toBe(false);
    expect(reactivateUser(off, "anna").find((u) => u.id === "anna")!.active).toBe(true);
  });
});
