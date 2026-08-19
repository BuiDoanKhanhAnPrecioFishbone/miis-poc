/**
 * The eight user roles from Appendix 1, section 3.1.
 *
 * Each role carries the menu it may see. The award criterion is *role-based
 * user scenarios and user interface*, and switching role and watching the
 * navigation itself change is the most direct evidence of it available —
 * NFÅ-003 is authorisation, and a menu that offers what the role may not use
 * contradicts the requirement on screen (§4.2 of the update plan).
 *
 * Identifiers are English; user-facing strings exist in both languages.
 * Pure domain — no imports beyond sibling types, no I/O.
 */

import { DEFAULT_LANG, type Lang, type Text } from "./lang";
import type { NavId } from "./nav";

export type Role =
  | "agreement-admin"
  | "mediation-admin"
  | "mediator-admin"
  | "statistics-user"
  | "system-admin"
  | "permission-admin"
  | "public"
  | "mediator";

export interface RoleDefinition {
  id: Role;
  /** Demo persona, so screens have a named user. Names are not translated. */
  person: string;
  label: Text;
  /** What the role may do (Appendix 1 §3.1). */
  permissions: Text;
  /** The menu items this role sees (NFÅ-003). */
  nav: readonly NavId[];
}

/** A role resolved into one language — what screens and components receive. */
export interface RoleInfo {
  id: Role;
  label: string;
  person: string;
  permissions: string;
  nav: readonly NavId[];
}

export const ROLES: readonly RoleDefinition[] = [
  {
    id: "agreement-admin",
    person: "Anna Andersson",
    label: { sv: "Avtalsadministratör", en: "Agreement administrator" },
    permissions: {
      sv: "Registrerar och redigerar avtalsinformation",
      en: "Registers and edits agreement information",
    },
    nav: ["start", "avtal", "parter", "forhandlingar", "dokument", "rapporter", "sok", "market"],
  },
  {
    id: "mediation-admin",
    person: "Per Persson",
    label: { sv: "Medlingsadministratör", en: "Mediation administrator" },
    permissions: {
      sv: "Registrerar och redigerar medling och medlingsbeslut",
      en: "Registers and edits mediation and mediation decisions",
    },
    nav: [
      "start",
      "avtal",
      "medling",
      "partstraffar",
      "medlare",
      "dokument",
      "rapporter",
      "sok",
      "market",
    ],
  },
  {
    id: "mediator-admin",
    person: "Eva Ek",
    label: { sv: "Medlaradministratör", en: "Mediator administrator" },
    permissions: {
      sv: "Registrerar och redigerar medlare",
      en: "Registers and edits mediators",
    },
    // Reaches Mediation only as the container for the mediator register.
    nav: ["start", "medlare", "sok"],
  },
  {
    id: "statistics-user",
    person: "Karin Karlsson",
    label: { sv: "Statistikanvändare", en: "Statistics user" },
    permissions: {
      sv: "Läser och exporterar data för statistiska ändamål",
      en: "Reads and exports data for statistical purposes",
    },
    nav: ["start", "rapporter", "sok"],
  },
  {
    id: "system-admin",
    person: "Lars Lund",
    label: { sv: "Systemadministratör", en: "System administrator" },
    permissions: {
      sv: "Full åtkomst inkl. systemkonfiguration (ej behörigheter)",
      en: "Full access including system configuration (not authorisations)",
    },
    nav: [
      "start",
      "avtal",
      "parter",
      "forhandlingar",
      "medling",
      "partstraffar",
      "medlare",
      "dokument",
      "rapporter",
      "sok",
      "market",
      "administration",
    ],
  },
  {
    id: "permission-admin",
    person: "Maria Molin",
    label: { sv: "Behörighetsadministratör", en: "Authorisation administrator" },
    permissions: {
      sv: "Registrerar och administrerar användare",
      en: "Registers and administers users",
    },
    // Reaches Administration only as the container for user administration.
    nav: ["start", "anvandare"],
  },
  {
    id: "public",
    person: "Besökare",
    label: { sv: "Publik dator", en: "Public computer" },
    permissions: {
      sv: "Begränsad publik åtkomst via särskild klientdator (IP-spärr)",
      en: "Limited public access from a dedicated client computer (IP restricted)",
    },
    // Separate entrance — /allmanheten carries its own reduced navigation.
    nav: [],
  },
  {
    id: "mediator",
    person: "Gunilla Runnquist",
    label: { sv: "Medlare", en: "Mediator" },
    permissions: {
      sv: "Åtkomst till medlingsrelaterad information (option, steg 2)",
      en: "Access to mediation-related information (option, step 2)",
    },
    nav: ["start", "medling", "dokument", "market"],
  },
] as const;

export const DEFAULT_ROLE: Role = "agreement-admin";

/** The role whose entrance is the public computer view rather than the app shell. */
export const PUBLIC_ROLE: Role = "public";

function definition(role: Role): RoleDefinition {
  return ROLES.find((r) => r.id === role) ?? ROLES[0]!;
}

export function roleInfo(role: Role, lang: Lang = DEFAULT_LANG): RoleInfo {
  const d = definition(role);
  return {
    id: d.id,
    label: d.label[lang],
    person: d.person,
    permissions: d.permissions[lang],
    nav: d.nav,
  };
}

/** Options for the demo role switcher, in one language. */
export function roleOptions(lang: Lang = DEFAULT_LANG): { id: Role; label: string }[] {
  return ROLES.map((r) => ({ id: r.id, label: r.label[lang] }));
}

export function isRole(value: string | undefined): value is Role {
  return ROLES.some((r) => r.id === value);
}

/**
 * NFÅ-003 — whether a role may open a screen.
 *
 * The same list drives three things and that is the point: the menu a role
 * sees, the screens it may open, and the table on
 * `/administration/anvandare`. Authorisation that lives only in the navigation
 * is a navigation feature — a statistics user who could not see an
 * Administration item could still type `/administration` and read the change
 * log — so the shell asks this before it renders a screen, not only before it
 * renders a link.
 */
export function canAccess(role: Pick<RoleDefinition, "nav">, screen: NavId): boolean {
  return role.nav.includes(screen);
}
