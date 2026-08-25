/**
 * Interface language.
 *
 * Swedish is the product language — MIIS is a Swedish authority's case tool and
 * every screenshot in the tender is Swedish. English is a complete second
 * translation so the internal team and non-Swedish reviewers can read the
 * mockup. It is a reviewing aid, not proposed functionality, which is why the
 * switch lives in the demo bar and not in the product chrome.
 *
 * Identifiers are English; every user-facing string is Swedish by default.
 * Pure domain — no imports, no I/O.
 */

export type Lang = "sv" | "en";

export interface LangInfo {
  id: Lang;
  /** Always written in its own language — never "Swedish" in an English menu. */
  label: string;
  htmlLang: string;
}

export const LANGS: readonly LangInfo[] = [
  { id: "sv", label: "Svenska", htmlLang: "sv" },
  { id: "en", label: "English", htmlLang: "en" },
] as const;

export const DEFAULT_LANG: Lang = "sv";

export function isLang(value: string | undefined): value is Lang {
  return LANGS.some((l) => l.id === value);
}

export function langInfo(lang: Lang): LangInfo {
  return LANGS.find((l) => l.id === lang) ?? LANGS[0]!;
}

/**
 * A piece of free-text sample content that exists in both languages.
 *
 * Used for the handful of mock strings that are prose rather than vocabulary —
 * a reminder sentence, a decision-support note. Structured content (an event
 * type, a status, a role) is not a `Text`: it is a code with a label table, so
 * it stays one record with one meaning.
 */
export type Text = Record<Lang, string>;

export function t(text: Text, lang: Lang): string {
  return text[lang];
}
