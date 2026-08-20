import { describe, expect, it } from "vitest";

import { ROLES } from "./role";
import { mayDeactivate, unstaffedRoles, usersPerRole, type SystemUser } from "./user";

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
