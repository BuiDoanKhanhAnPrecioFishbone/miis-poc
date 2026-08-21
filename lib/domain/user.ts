/**
 * Users and role assignment — NFÅ-005.
 *
 * The requirement is unusually specific about who does this and what it covers:
 * *"Behörigheter ska kunna administreras i systemet utan leverantörens
 * medverkan av Medlingsinstitutets egna behörighetsadministratörer. Det gäller
 * **upplägg och redigering av användare och rolltilldelning**."* So two things
 * are MI's own to edit — the user, and which role that user has — and neither
 * of them needs us.
 *
 * **What is not editable is the permission matrix itself**, and that is a
 * design decision worth stating rather than a gap. NFÅ-003 defines access by
 * the eight roles in §3.1, each with a verb MI wrote down; letting an
 * administrator move "write on Avtal" from one role to another would mean the
 * matrix on screen no longer described §3.1, and every authorisation claim in
 * the tender response would be about a configuration rather than about the
 * system. Roles are the contract. Assignment is the administration.
 *
 * **MIIS does not hold passwords, and cannot create an identity.** NFÅ-001 puts
 * authentication in Försäkringskassan's IdP over SAML with an EFOS card, so a
 * user here is a *link* between an identity that already exists there and a
 * role in MIIS. That is why the form asks for an EFOS identity rather than for
 * a password, and why deactivating a user removes their access to MIIS without
 * claiming to have closed an account we never opened.
 *
 * Pure domain — no React, no data access, no I/O.
 */

import { DEFAULT_LANG, type Lang, type Text } from "./lang";
import type { Role } from "./role";

/**
 * Active or not, and nothing in between.
 *
 * Deactivation rather than deletion: NFL-001 logs sign-ins and NFL-003 sets a
 * retention period, so the log has to keep pointing at a person after they stop
 * working at MI. A deleted user is a change log full of unresolvable ids.
 */
export interface SystemUser {
  id: string;
  name: string;
  /** The identity in Försäkringskassan's IdP — MIIS never holds a credential. */
  efosIdentity: string;
  email: string;
  /** MI's own unit, so an administrator can see who a role belongs with. */
  unit: Text;
  role: Role;
  active: boolean;
  /** NFL-001 — the last logged sign-in, or undefined for someone who never has. */
  lastSignIn?: string;
  /** When the role was assigned, and by whom — the FH-001 half of NFÅ-005. */
  roleAssigned: { date: string; by: string };
}

export function userUnit(user: SystemUser, lang: Lang = DEFAULT_LANG): string {
  return user.unit[lang];
}

/** How many users hold each role — what the permission matrix shows per column. */
export function usersPerRole(users: readonly SystemUser[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const user of users) {
    if (!user.active) continue;
    counts[user.role] = (counts[user.role] ?? 0) + 1;
  }
  return counts;
}

/**
 * A role with nobody in it is worth noticing.
 *
 * §3.1 names eight roles and MI has to staff all of them; a role with no active
 * user means a part of the system nobody can reach, which an authorisation
 * administrator should be told rather than left to work out from a table.
 */
export function unstaffedRoles(
  users: readonly SystemUser[],
  roles: readonly { id: Role }[],
): Role[] {
  const counts = usersPerRole(users);
  return roles.filter((r) => (counts[r.id] ?? 0) === 0).map((r) => r.id);
}

/**
 * Whether this user may be deactivated.
 *
 * The last active authorisation administrator may not: NFÅ-005 says MI
 * administers permissions *without the supplier*, and a system whose last
 * administrator has just deactivated themselves can only be repaired by us.
 * That is the one lock-out worth preventing in code rather than in a routine.
 */
export function mayDeactivate(user: SystemUser, users: readonly SystemUser[]): boolean {
  if (!user.active) return false;
  if (user.role !== "permission-admin") return true;
  return users.filter((u) => u.active && u.role === "permission-admin").length > 1;
}

/**
 * Changing a role — the third of Bilaga 2 §3.5's Scenario 1 bullets,
 * *"ändrar eller återkallar behörigheter för en befintlig användare"*.
 *
 * A role change is not an edit of the user; it is a **new assignment**, and
 * `roleAssigned` moves with it. NFÅ-005 pairs the administration with FH-001's
 * change log, and a log entry that could not say when the role changed or who
 * changed it would record that something happened and nothing about what.
 *
 * The guard is the same one deactivation has, for the same reason: moving the
 * last authorisation administrator to another role locks MI out exactly as
 * deactivating them would, and NFÅ-005 exists to keep the supplier out of that
 * repair.
 */
export function mayChangeRole(user: SystemUser, users: readonly SystemUser[], next: Role): boolean {
  if (!user.active) return false;
  if (next === user.role) return false;
  if (user.role !== "permission-admin") return true;
  return users.filter((u) => u.active && u.role === "permission-admin").length > 1;
}

export function changeRole(
  users: readonly SystemUser[],
  id: string,
  next: Role,
  by: string,
  date: string,
): SystemUser[] {
  return users.map((u) =>
    u.id === id && mayChangeRole(u, users, next)
      ? { ...u, role: next, roleAssigned: { date, by } }
      : u,
  );
}

/**
 * Revoking access — the other half of the same bullet.
 *
 * Deactivation *is* the revocation in this model: §3.1 defines access by role
 * and NFÅ-001 puts the identity in Försäkringskassan's IdP, so there is no
 * per-permission grant to take back. What MIIS can withdraw is the link between
 * the identity and the role, and that is what `active` holds.
 */
export function deactivateUser(users: readonly SystemUser[], id: string): SystemUser[] {
  return users.map((u) => (u.id === id && mayDeactivate(u, users) ? { ...u, active: false } : u));
}
