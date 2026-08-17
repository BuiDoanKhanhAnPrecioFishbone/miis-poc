/**
 * FR-012 – colour coding of agreement status.
 *
 * Newly signed without mediation = green, signed after mediation = red,
 * remaining = blue, but red when linked to mediation.
 *
 * The return type carries the label AND a shape together with the colour, so no
 * view can render the colour on its own and no view can distinguish the three
 * states by hue alone. Colour is never the only carrier of meaning
 * (WCAG 2.1 AA, 1.4.1).
 *
 * Pure domain — no imports beyond sibling types, no I/O.
 */

import { DEFAULT_LANG, type Lang } from "./lang";

export type StatusCode = "newly-signed" | "after-mediation" | "remaining";

export type StatusColor = "green" | "red" | "blue";

/**
 * The second, non-colour channel. Filled circle, filled square and hollow ring
 * are distinguishable in greyscale and to a colour-blind reader.
 */
export type StatusShape = "circle" | "square" | "ring";

export interface StatusInfo {
  code: StatusCode;
  color: StatusColor;
  shape: StatusShape;
  /** Label in the active language, always rendered alongside the colour. */
  label: string;
}

const COLOR: Record<StatusCode, StatusColor> = {
  "newly-signed": "green",
  "after-mediation": "red",
  remaining: "blue",
};

const SHAPE: Record<StatusCode, StatusShape> = {
  "newly-signed": "circle",
  "after-mediation": "square",
  remaining: "ring",
};

export const STATUS_LABEL: Record<Lang, Record<StatusCode, string>> = {
  sv: {
    "newly-signed": "Nytecknat utan medling",
    "after-mediation": "Tecknat efter medling",
    remaining: "Kvarstående",
  },
  en: {
    "newly-signed": "Newly signed, no mediation",
    "after-mediation": "Signed after mediation",
    remaining: "Remaining",
  },
};

const LINKED_TO_MEDIATION: Record<Lang, string> = {
  sv: "Kvarstående – kopplat till medling",
  en: "Remaining – linked to mediation",
};

export function statusInfo(code: StatusCode, lang: Lang = DEFAULT_LANG): StatusInfo {
  return {
    code,
    color: COLOR[code],
    shape: SHAPE[code],
    label: STATUS_LABEL[lang][code],
  };
}

/**
 * Derives the status of an agreement. An agreement linked to a mediation is
 * always red, whether it has been signed yet or not (FR-012).
 */
export function agreementStatus(
  agreement: {
    signedDate?: string | undefined;
    mediationLinked?: boolean | undefined;
  },
  lang: Lang = DEFAULT_LANG,
): StatusInfo {
  if (agreement.mediationLinked) {
    return agreement.signedDate
      ? statusInfo("after-mediation", lang)
      : {
          code: "remaining",
          color: "red",
          shape: "ring",
          label: LINKED_TO_MEDIATION[lang],
        };
  }
  return statusInfo(agreement.signedDate ? "newly-signed" : "remaining", lang);
}

/**
 * The legend shown under status-coded tables. Names the shape as well as the
 * colour, because the shape is what a greyscale print or a colour-blind reader
 * actually goes by.
 */
export const STATUS_LEGEND: Record<Lang, string> = {
  sv:
    "● Grön cirkel = nytecknat utan medling · ■ Röd fyrkant = tecknat efter medling / medlingskoppling · ○ Blå ring = kvarstående",
  en:
    "● Green circle = newly signed without mediation · ■ Red square = signed after mediation / linked to mediation · ○ Blue ring = remaining",
};
