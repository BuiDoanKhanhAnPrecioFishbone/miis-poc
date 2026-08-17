/**
 * The eight user roles from Appendix 1, section 3.1.
 *
 * Identifiers are English; every user-facing string is Swedish.
 * Pure domain — no imports, no I/O.
 */

export type Role =
  | "agreement-admin"
  | "mediation-admin"
  | "mediator-admin"
  | "statistics-user"
  | "system-admin"
  | "permission-admin"
  | "public"
  | "mediator";

export interface RoleInfo {
  id: Role;
  /** Swedish label shown in the interface. */
  label: string;
  /** Demo persona, so screens have a named user. */
  person: string;
  /** What the role may do (Appendix 1 §3.1). */
  permissions: string;
}

export const ROLES: readonly RoleInfo[] = [
  {
    id: "agreement-admin",
    label: "Avtalsadministratör",
    person: "Anna Andersson",
    permissions: "Registrerar och redigerar avtalsinformation",
  },
  {
    id: "mediation-admin",
    label: "Medlingsadministratör",
    person: "Per Persson",
    permissions: "Registrerar och redigerar medling och medlingsbeslut",
  },
  {
    id: "mediator-admin",
    label: "Medlaradministratör",
    person: "Eva Ek",
    permissions: "Registrerar och redigerar medlare",
  },
  {
    id: "statistics-user",
    label: "Statistikanvändare",
    person: "Karin Karlsson",
    permissions: "Läser och exporterar data för statistiska ändamål",
  },
  {
    id: "system-admin",
    label: "Systemadministratör",
    person: "Lars Lund",
    permissions: "Full åtkomst inkl. systemkonfiguration (ej behörigheter)",
  },
  {
    id: "permission-admin",
    label: "Behörighetsadministratör",
    person: "Maria Molin",
    permissions: "Registrerar och administrerar användare",
  },
  {
    id: "public",
    label: "Publik dator",
    person: "Besökare",
    permissions: "Begränsad publik åtkomst via särskild klientdator (IP-spärr)",
  },
  {
    id: "mediator",
    label: "Medlare",
    person: "Gunilla Runnquist",
    permissions: "Åtkomst till medlingsrelaterad information (option, steg 2)",
  },
] as const;

export const DEFAULT_ROLE: Role = "agreement-admin";

export function roleInfo(role: Role): RoleInfo {
  return ROLES.find((r) => r.id === role) ?? ROLES[0]!;
}

export function isRole(value: string | undefined): value is Role {
  return ROLES.some((r) => r.id === value);
}
