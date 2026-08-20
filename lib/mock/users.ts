/**
 * MIIS's own users — the people behind the eight roles in Appendix 1 §3.1.
 *
 * The demo personas that already appear in the header (Anna Andersson, Per
 * Persson …) are here as real rows rather than as a `person` string on the role,
 * which is what made the authorisation matrix read as an example: a column
 * headed "Exempelanvändare" tells an evaluator that nobody has thought about
 * who actually holds the role.
 *
 * Names are ordinary Swedish names and the units are MI's own — the office has
 * an analysis unit, a mediation unit and an administrative unit. Every address
 * is `@mi.se`, and the EFOS identity is the shape Försäkringskassan issues.
 *
 * Two rows are deliberate cases rather than filler: one inactive user, because
 * NFL-003's retention means a departed colleague stays visible in the log and
 * therefore in the register; and two authorisation administrators, because
 * `mayDeactivate` refuses to let the last one lock MI out and that rule needs
 * something to be true against.
 *
 * Week 2: rows in `Anvandare`. Nothing outside lib/data/ imports this.
 */

import type { SystemUser } from "@/lib/domain/user";

const ANALYSIS = { sv: "Analysenheten", en: "Analysis unit" };
const MEDIATION = { sv: "Medlingsenheten", en: "Mediation unit" };
const ADMIN = { sv: "Administrativa enheten", en: "Administrative unit" };
const IT = { sv: "IT och förvaltning", en: "IT and system management" };

export const USERS: SystemUser[] = [
  {
    id: "U-001",
    name: "Anna Andersson",
    efosIdentity: "SE-EFOS-198203-4471",
    email: "anna.andersson@mi.se",
    unit: ANALYSIS,
    role: "agreement-admin",
    active: true,
    lastSignIn: "2027-06-11 08:42",
    roleAssigned: { date: "2024-01-15", by: "Maria Molin" },
  },
  {
    id: "U-002",
    name: "Johan Berglund",
    efosIdentity: "SE-EFOS-197711-2094",
    email: "johan.berglund@mi.se",
    unit: ANALYSIS,
    role: "agreement-admin",
    active: true,
    lastSignIn: "2027-06-10 16:20",
    roleAssigned: { date: "2025-08-04", by: "Maria Molin" },
  },
  {
    id: "U-003",
    name: "Per Persson",
    efosIdentity: "SE-EFOS-196905-8123",
    email: "per.persson@mi.se",
    unit: MEDIATION,
    role: "mediation-admin",
    active: true,
    lastSignIn: "2027-06-11 09:05",
    roleAssigned: { date: "2023-03-01", by: "Maria Molin" },
  },
  {
    id: "U-004",
    name: "Eva Ek",
    efosIdentity: "SE-EFOS-199001-6650",
    email: "eva.ek@mi.se",
    unit: MEDIATION,
    role: "mediator-admin",
    active: true,
    lastSignIn: "2027-06-09 13:37",
    roleAssigned: { date: "2026-02-17", by: "Maria Molin" },
  },
  {
    id: "U-005",
    name: "Karin Karlsson",
    efosIdentity: "SE-EFOS-198507-3318",
    email: "karin.karlsson@mi.se",
    unit: ANALYSIS,
    role: "statistics-user",
    active: true,
    lastSignIn: "2027-06-11 07:58",
    roleAssigned: { date: "2024-09-02", by: "Maria Molin" },
  },
  {
    id: "U-006",
    name: "Maria Molin",
    efosIdentity: "SE-EFOS-197402-1187",
    email: "maria.molin@mi.se",
    unit: ADMIN,
    role: "permission-admin",
    active: true,
    lastSignIn: "2027-06-11 08:15",
    roleAssigned: { date: "2022-05-30", by: "Irene Wennemo" },
  },
  {
    id: "U-007",
    name: "Tobias Grahn",
    efosIdentity: "SE-EFOS-198811-7702",
    email: "tobias.grahn@mi.se",
    unit: ADMIN,
    role: "permission-admin",
    active: true,
    lastSignIn: "2027-05-28 11:04",
    roleAssigned: { date: "2026-11-09", by: "Maria Molin" },
  },
  {
    id: "U-008",
    name: "Lars Lund",
    efosIdentity: "SE-EFOS-198009-4426",
    email: "lars.lund@mi.se",
    unit: IT,
    role: "system-admin",
    active: true,
    lastSignIn: "2027-06-10 17:49",
    roleAssigned: { date: "2023-01-09", by: "Maria Molin" },
  },
  /*
    Left MI in April. Deactivated rather than deleted: NFL-001 logged their
    sign-ins and NFL-003 keeps those for the retention period, so the log has to
    go on pointing at a person.
  */
  {
    id: "U-009",
    name: "Sofia Nyström",
    efosIdentity: "SE-EFOS-199304-9038",
    email: "sofia.nystrom@mi.se",
    unit: ANALYSIS,
    role: "agreement-admin",
    active: false,
    lastSignIn: "2027-04-24 15:11",
    roleAssigned: { date: "2025-01-13", by: "Maria Molin" },
  },
];
