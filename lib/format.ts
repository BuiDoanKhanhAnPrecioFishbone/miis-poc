/**
 * Swedish number formatting.
 *
 * Deliberately not Intl-based: fixed output avoids SSR/client mismatches and
 * keeps the prototype's numbers identical everywhere.
 */

/** 6.4 → "6,4" */
export function decimal(n: number): string {
  return String(n).replace(".", ",");
}

/** 6.4 → "6,4 %" */
export function percent(n: number): string {
  return `${decimal(n)} %`;
}

/** 25480 → "25 480" */
export function amount(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
