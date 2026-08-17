/**
 * FR-012 – colour coding of agreement status.
 *
 * Newly signed without mediation = green, signed after mediation = red,
 * remaining = blue, but red when linked to mediation.
 *
 * The return type carries the label together with the colour, so no view can
 * render the colour on its own. Colour is never the only carrier of meaning
 * (WCAG 2.1 AA, 1.4.1).
 *
 * Pure domain — no imports, no I/O.
 */

export type StatusCode = "newly-signed" | "after-mediation" | "remaining";

export type StatusColor = "green" | "red" | "blue";

export interface StatusInfo {
  code: StatusCode;
  color: StatusColor;
  /** Swedish label, always rendered alongside the colour. */
  label: string;
}

const STATUS: Record<StatusCode, StatusInfo> = {
  "newly-signed": {
    code: "newly-signed",
    color: "green",
    label: "Nytecknat utan medling",
  },
  "after-mediation": {
    code: "after-mediation",
    color: "red",
    label: "Tecknat efter medling",
  },
  remaining: {
    code: "remaining",
    color: "blue",
    label: "Kvarstående",
  },
};

export function statusInfo(code: StatusCode): StatusInfo {
  return STATUS[code];
}

/**
 * Derives the status of an agreement. An agreement linked to a mediation is
 * always red, whether it has been signed yet or not (FR-012).
 */
export function agreementStatus(agreement: {
  signedDate?: string | undefined;
  mediationLinked?: boolean | undefined;
}): StatusInfo {
  if (agreement.mediationLinked) {
    return agreement.signedDate
      ? STATUS["after-mediation"]
      : { code: "remaining", color: "red", label: "Kvarstående – kopplat till medling" };
  }
  return agreement.signedDate ? STATUS["newly-signed"] : STATUS.remaining;
}

/** The legend shown under status-coded tables. */
export const STATUS_LEGEND =
  "Grön = nytecknat utan medling · Röd = tecknat efter medling / medlingskoppling · Blå = kvarstående";
