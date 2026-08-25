/**
 * What a system administrator may configure — US-13, and §3.1's own verb.
 *
 * §3.1 gives the role *"Full åtkomst inkl. systemkonfiguration (exkl.
 * behörigheter)"*, and US-13's goal names the second half of the job: *"the
 * system's configurable parts – such as the watchword table – are kept
 * current."* MIIS had the logs and the watchword table and nothing that was a
 * setting, so the role had a screen to read and nothing to administer.
 *
 * **The interesting part is which of these MI's own requirements say the system
 * administrator may *not* change.** Two of the four settings below are
 * deliberately read-only, and each has a sentence behind it:
 *
 * - **Log retention** is NFL-003, and the requirement names this role
 *   explicitly: *"Loggar ska lagras i minst 24 månader och ska inte kunna
 *   ändras eller raderas av vanliga användare **eller systemadministratörer**."*
 *   A field an administrator could shorten would contradict the sentence that
 *   created it.
 * - **The public IP restriction** is NFÅ-006 and belongs to Försäkringskassan's
 *   operation of the environment, not to a form in the application.
 *
 * Showing the two that are fixed beside the two that are not is a stronger
 * demonstration than four editable boxes: it says the sentence was read.
 *
 * Pure domain — no React, no data access, no I/O.
 */

import type { Lang, Text } from "./lang";

export type SettingId = "session-timeout" | "log-retention" | "public-ip" | "watchwords";

export interface SystemSetting {
  id: SettingId;
  label: Text;
  /** What it governs, in the officer's terms rather than the developer's. */
  description: Text;
  requirements: readonly string[];
  /** Whether the system administrator may change it, and why not when they may not. */
  editable: boolean;
  fixedReason?: Text;
}

/**
 * NFÅ-002 — *"Inaktiva sessioner ska avslutas automatiskt efter en
 * konfigurerbar tidsgräns (default max 30 minuter inaktivitet)."*
 *
 * Configurable, with a **ceiling rather than a floor**, which is the reading a
 * security setting deserves: MI may shorten the limit, and raising it above
 * thirty minutes would weaken the requirement rather than configure it. The
 * lower bound is five minutes because a limit shorter than a coffee break is a
 * limit that gets worked around.
 *
 * If MI reads the sentence the other way, this constant is the one line to
 * change — which is the point of it being a constant.
 */
export const SESSION_TIMEOUT: {
  defaultMinutes: number;
  minMinutes: number;
  maxMinutes: number;
  /** The warning arrives this long before the session ends. */
  warnBeforeMinutes: number;
} = {
  defaultMinutes: 30,
  minMinutes: 5,
  maxMinutes: 30,
  warnBeforeMinutes: 2,
};

/** NFL-003's floor. Not a preference — the requirement's own number. */
export const LOG_RETENTION_MIN_MONTHS = 24;

export interface SettingProblem {
  kind: "too-low" | "too-high" | "not-a-number";
}

/**
 * Whether a proposed session timeout is allowed, and if not, which way it is
 * wrong. The caller turns that into a sentence in the reader's language; the
 * domain does not hold copy.
 */
export function checkSessionTimeout(minutes: number): SettingProblem | null {
  if (!Number.isFinite(minutes) || !Number.isInteger(minutes)) return { kind: "not-a-number" };
  if (minutes < SESSION_TIMEOUT.minMinutes) return { kind: "too-low" };
  if (minutes > SESSION_TIMEOUT.maxMinutes) return { kind: "too-high" };
  return null;
}

/** Reads the stored value, falling back to MI's default rather than to zero. */
export function sessionTimeoutMinutes(raw: string | undefined): number {
  const parsed = Number(raw);
  return checkSessionTimeout(parsed) === null ? parsed : SESSION_TIMEOUT.defaultMinutes;
}

/**
 * When the warning is due, in minutes from the start of inactivity.
 *
 * Never below one minute: at a five-minute limit a two-minute warning would
 * leave three, which is fine, but the arithmetic has to survive a limit set to
 * the floor without scheduling the warning at zero.
 */
export function warnAtMinutes(timeoutMinutes: number): number {
  return Math.max(1, timeoutMinutes - SESSION_TIMEOUT.warnBeforeMinutes);
}

export const SYSTEM_SETTINGS: readonly SystemSetting[] = [
  {
    id: "session-timeout",
    label: { sv: "Sessionens tidsgräns", en: "Session time limit" },
    description: {
      sv: "Hur länge en session får vara inaktiv innan användaren loggas ut automatiskt. Varningen visas två minuter innan.",
      en: "How long a session may be inactive before the user is signed out automatically. The warning appears two minutes before.",
    },
    requirements: ["NFÅ-002"],
    editable: true,
  },
  {
    id: "watchwords",
    label: { sv: "Bevakningsord", en: "Watchwords" },
    description: {
      sv: "Tabellen som avgör vilken text som markeras i inkommande protokoll. Underhålls inför avtalsrörelsen.",
      en: "The table that decides which text is marked in incoming protocols. Maintained ahead of the bargaining round.",
    },
    requirements: ["FAI-004"],
    editable: true,
  },
  {
    id: "log-retention",
    label: { sv: "Gallringstid för loggar", en: "Log retention period" },
    description: {
      sv: "Hur länge ändrings- och händelseloggen bevaras.",
      en: "How long the change log and the event log are retained.",
    },
    requirements: ["NFL-003"],
    editable: false,
    fixedReason: {
      sv: "Loggar bevaras i minst 24 månader och kan varken ändras eller raderas – inte heller av systemadministratören. Gallringstiden ändras därför inte här.",
      en: "Logs are retained for at least 24 months and can neither be altered nor deleted — not by the system administrator either. The retention period is therefore not changed here.",
    },
  },
  {
    id: "public-ip",
    label: { sv: "Publik åtkomst", en: "Public access" },
    description: {
      sv: "Den publika vyn nås bara från Medlingsinstitutets egen IP-adress.",
      en: "The public view is reachable only from Medlingsinstitutet's own IP address.",
    },
    requirements: ["NFÅ-006"],
    editable: false,
    fixedReason: {
      sv: "Begränsningen ligger i driftmiljön hos Försäkringskassan, inte i applikationen. Ett fält här skulle antyda att MIIS kunde öppna sig självt.",
      en: "The restriction sits in the operating environment at Försäkringskassan, not in the application. A field here would imply that MIIS could open itself up.",
    },
  },
] as const;

export function settingLabel(setting: SystemSetting, lang: Lang): string {
  return setting.label[lang];
}
