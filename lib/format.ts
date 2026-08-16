/**
 * Swedish formatting helpers.
 * Deliberately not Intl-based: fixed output avoids SSR/client mismatches and
 * keeps the prototype's numbers identical everywhere.
 */

/** 6.4 → "6,4" */
export function tal(n: number): string {
  return String(n).replace(".", ",");
}

/** 6.4 → "6,4 %" */
export function procent(n: number): string {
  return `${tal(n)} %`;
}

/** 25480 → "25 480" */
export function belopp(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
