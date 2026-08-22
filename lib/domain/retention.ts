/**
 * D-004 — gallring of personal data, and the rules that drive it.
 *
 * MI's own sentence, and it is a ska-krav: *"Systemet ska stödja gallring av
 * personuppgifter i enlighet med Medlingsinstitutets gallringsrutiner,
 * inklusive **möjlighet att definiera automatiska gallringsregler**."* The
 * requirement was answered twice in the prototype by a Rationale saying contact
 * details fall under MI's retention routines — a sentence about a rule, not the
 * ability to define one, which is the half the requirement actually names.
 *
 * **This is also the answer to "should everything be deletable".** No, and the
 * four categories are not a preference:
 *
 * 1. **Records the authority is accountable for** — agreements, mediation
 *    cases, parties, Märket periods. Never deleted and never deactivated
 *    either: an agreement that ran from 2023 does not stop having existed, and
 *    MI publishes statistics off it. What they carry is a validity period and
 *    FR-012's status.
 * 2. **People a register offers up** — users, mediators. Deactivated, so they
 *    stop being offered while everything that references them still resolves.
 *    NFL-001 logged the user's sign-ins; FF-009 counts the mediator's
 *    assignments.
 * 3. **Attributes nothing counts** — a contact person, a watchword, a saved
 *    search, a reminder. Removed outright.
 * 4. **Personal data** — gallras, on a schedule, by rule rather than by
 *    somebody deciding. That is this file, and it is the only deletion MI asked
 *    for.
 *
 * **NFL-003 is the boundary, and it is why this is not just a list.** The logs
 * must be kept *"i minst 24 månader"* and *"ska inte kunna ändras eller raderas
 * av vanliga användare **eller systemadministratörer**"*. So D-004 says define
 * gallring rules and NFL-003 says not for these, and the screen has to hold
 * both: a rule over the logs is shown, fixed, with the sentence that fixes it —
 * the same treatment `SYSTEM_SETTINGS` gives NFL-003 and NFÅ-006. A gallring
 * screen with four editable rows would say we built a form.
 *
 * Pure domain — no React, no data access, no I/O.
 */

import type { Lang, Text } from "./lang";

/** What happens when the retention period runs out. */
export type RetentionAction = "erase" | "anonymise";

export const RETENTION_ACTION_LABEL: Record<Lang, Record<RetentionAction, string>> = {
  sv: { erase: "Gallras", anonymise: "Anonymiseras" },
  en: { erase: "Erased", anonymise: "Anonymised" },
};

export interface RetentionRule {
  id: string;
  /** The personal data the rule governs. */
  subject: Text;
  /** Where it lives, so an administrator can see the rule points at something. */
  source: Text;
  /** What starts the clock — a rule with no trigger is a number. */
  trigger: Text;
  months: number;
  action: RetentionAction;
  /** Whether it runs without anybody pressing anything — D-004's own word. */
  automatic: boolean;
  requirements: readonly string[];
  /**
   * Set where no rule may be defined, carrying the requirement that forbids it.
   *
   * Shown rather than hidden. A screen that quietly omitted the logs would look
   * complete and would not say that NFL-003 had been read.
   */
  fixedReason?: Text;
}

/**
 * NFL-003's floor, in months.
 *
 * A floor here rather than a ceiling, which is the opposite of NFÅ-002's
 * session limit and for the same kind of reason: MI may keep logs *longer* than
 * two years, and a rule that culled them sooner would break the requirement
 * rather than configure it.
 */
export const LOG_RETENTION_MIN_MONTHS = 24;

/** The shortest period worth offering. Below a month, gallring is a deletion. */
export const RETENTION_MIN_MONTHS = 1;
export const RETENTION_MAX_MONTHS = 120;

export const RETENTION_RULES: RetentionRule[] = [
  {
    id: "party-contacts",
    subject: { sv: "Kontaktpersoner hos parter", en: "Contact persons at parties" },
    source: { sv: "Partsregistret", en: "The party register" },
    trigger: {
      sv: "Räknas från att kontaktpersonen tagits bort från parten",
      en: "Counted from when the contact person was removed from the party",
    },
    months: 24,
    action: "erase",
    automatic: true,
    requirements: ["D-004", "FP-006"],
  },
  {
    id: "mediator-contacts",
    subject: { sv: "Medlares kontaktuppgifter", en: "Mediators' contact details" },
    source: { sv: "Medlarregistret", en: "The mediator register" },
    trigger: {
      sv: "Räknas från medlarens senaste avslutade uppdrag",
      en: "Counted from the mediator's most recent completed assignment",
    },
    months: 36,
    action: "erase",
    automatic: true,
    requirements: ["D-004", "FF-009"],
  },
  {
    /*
      Anonymised rather than erased, and the distinction is the whole reason
      `RetentionAction` has two values. NFL-001 logged this person's sign-ins
      and those entries have to survive; what goes is the name behind them.
      Erasing the user would leave a log MI cannot account for.
    */
    id: "inactive-users",
    subject: { sv: "Inaktiverade användarkonton", en: "Deactivated user accounts" },
    source: { sv: "Användarregistret", en: "The user register" },
    trigger: {
      sv: "Räknas från att kontot inaktiverades",
      en: "Counted from when the account was deactivated",
    },
    months: 24,
    action: "anonymise",
    automatic: true,
    requirements: ["D-004", "NFL-001", "NFÅ-005"],
  },
  {
    /*
      Shown, fixed, with MI's own sentence on the row. D-004 asks for definable
      rules and NFL-003 removes exactly one register from that — including from
      the system administrator, which is the role reading this screen.
    */
    id: "logs",
    subject: { sv: "Ändringslogg och säkerhetslogg", en: "Change log and security log" },
    source: { sv: "Loggarna", en: "The logs" },
    trigger: { sv: "Räknas från händelsen", en: "Counted from the event" },
    months: LOG_RETENTION_MIN_MONTHS,
    action: "erase",
    automatic: false,
    requirements: ["NFL-003", "D-004"],
    fixedReason: {
      sv: "Loggar lagras i minst 24 månader och kan inte ändras eller raderas – inte heller av systemadministratörer.",
      en: "Logs are stored for at least 24 months and cannot be changed or deleted — not even by system administrators.",
    },
  },
];

export function isEditable(rule: RetentionRule): boolean {
  return rule.fixedReason === undefined;
}

/**
 * Whether a period may be set on a rule.
 *
 * Two refusals, and both come from a requirement rather than from taste: a
 * fixed rule takes no period at all, and no rule may be shortened below what
 * NFL-003 requires of the logs it touches.
 */
export function maySetMonths(rule: RetentionRule, months: number): boolean {
  if (!isEditable(rule)) return false;
  if (!Number.isInteger(months)) return false;
  if (months < RETENTION_MIN_MONTHS || months > RETENTION_MAX_MONTHS) return false;
  return true;
}

export function setMonths(
  rules: readonly RetentionRule[],
  id: string,
  months: number,
): RetentionRule[] {
  return rules.map((r) => (r.id === id && maySetMonths(r, months) ? { ...r, months } : r));
}

export function setAutomatic(
  rules: readonly RetentionRule[],
  id: string,
  automatic: boolean,
): RetentionRule[] {
  return rules.map((r) => (r.id === id && isEditable(r) ? { ...r, automatic } : r));
}

/** The rule as a sentence — what goes, when, and whether anyone has to act. */
export function describeRule(rule: RetentionRule, lang: Lang): string {
  const action = RETENTION_ACTION_LABEL[lang][rule.action].toLowerCase();
  const years = rule.months / 12;
  const period =
    lang === "sv"
      ? Number.isInteger(years)
        ? `${years} år`
        : `${rule.months} månader`
      : Number.isInteger(years)
        ? `${years} year${years === 1 ? "" : "s"}`
        : `${rule.months} months`;
  return lang === "sv"
    ? `${rule.subject.sv} ${action} efter ${period}.`
    : `${rule.subject.en}: ${action} after ${period}.`;
}
