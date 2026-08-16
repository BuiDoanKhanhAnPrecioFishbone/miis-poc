/**
 * The eight user roles from Appendix 1, section 3.1.
 * Pure domain — no imports, no I/O.
 */

export type Roll =
  | "avtalsadministrator"
  | "medlingsadministrator"
  | "medlaradministrator"
  | "statistikanvandare"
  | "systemadministrator"
  | "behorighetsadministrator"
  | "publik"
  | "medlare";

export interface RollInfo {
  id: Roll;
  /** Swedish label shown in the interface. */
  etikett: string;
  /** A demo persona, so screens have a named user. */
  person: string;
  /** Short description of what the role may do (Appendix 1 §3.1). */
  behorighet: string;
}

export const ROLLER: readonly RollInfo[] = [
  {
    id: "avtalsadministrator",
    etikett: "Avtalsadministratör",
    person: "Anna Andersson",
    behorighet: "Registrerar och redigerar avtalsinformation",
  },
  {
    id: "medlingsadministrator",
    etikett: "Medlingsadministratör",
    person: "Per Persson",
    behorighet: "Registrerar och redigerar medling och medlingsbeslut",
  },
  {
    id: "medlaradministrator",
    etikett: "Medlaradministratör",
    person: "Eva Ek",
    behorighet: "Registrerar och redigerar medlare",
  },
  {
    id: "statistikanvandare",
    etikett: "Statistikanvändare",
    person: "Karin Karlsson",
    behorighet: "Läser och exporterar data för statistiska ändamål",
  },
  {
    id: "systemadministrator",
    etikett: "Systemadministratör",
    person: "Lars Lund",
    behorighet: "Full åtkomst inkl. systemkonfiguration (ej behörigheter)",
  },
  {
    id: "behorighetsadministrator",
    etikett: "Behörighetsadministratör",
    person: "Maria Molin",
    behorighet: "Registrerar och administrerar användare",
  },
  {
    id: "publik",
    etikett: "Publik dator",
    person: "Besökare",
    behorighet: "Begränsad publik åtkomst via särskild klientdator (IP-spärr)",
  },
  {
    id: "medlare",
    etikett: "Medlare",
    person: "Gunilla Runnquist",
    behorighet: "Åtkomst till medlingsrelaterad information (option, steg 2)",
  },
] as const;

export const STANDARDROLL: Roll = "avtalsadministrator";

export function rollInfo(roll: Roll): RollInfo {
  return ROLLER.find((r) => r.id === roll) ?? ROLLER[0]!;
}

export function arRoll(varde: string | undefined): varde is Roll {
  return ROLLER.some((r) => r.id === varde);
}
