/**
 * Number formatting.
 *
 * Deliberately not Intl-based: fixed output avoids SSR/client mismatches and
 * keeps the prototype's numbers identical everywhere.
 *
 * Swedish uses a decimal comma and a space as thousands separator; English uses
 * a decimal point. Dates are ISO `YYYY-MM-DD` in both languages — that is what
 * MI writes today and it removes a whole class of ambiguity.
 */

import { DEFAULT_LANG, type Lang } from "@/lib/domain/lang";

/** 6.4 → "6,4" (sv) · "6.4" (en) */
export function decimal(n: number, lang: Lang = DEFAULT_LANG): string {
  return lang === "sv" ? String(n).replace(".", ",") : String(n);
}

/** 6.4 → "6,4 %" (sv) · "6.4 %" (en) */
export function percent(n: number, lang: Lang = DEFAULT_LANG): string {
  return `${decimal(n, lang)} %`;
}

/** 25480 → "25 480" (sv) · "25,480" (en) */
export function amount(n: number, lang: Lang = DEFAULT_LANG): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, lang === "sv" ? " " : ",");
}
