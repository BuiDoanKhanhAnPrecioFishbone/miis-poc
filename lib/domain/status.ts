/**
 * FR-012 – colour coding of agreement status.
 *
 * Newly signed without mediation = green, signed after mediation = red,
 * remaining = blue, but red when linked to mediation.
 *
 * The return type deliberately carries the label together with the colour, so
 * that no view can render the colour on its own. Colour is never the only
 * carrier of meaning (WCAG 2.1 AA, 1.4.1).
 */

export type AvtalStatusKod = "nytecknat" | "efter-medling" | "kvarstaende";

export type StatusFarg = "green" | "red" | "blue";

export interface StatusInfo {
  kod: AvtalStatusKod;
  farg: StatusFarg;
  /** Always rendered next to the colour. */
  etikett: string;
}

const STATUS: Record<AvtalStatusKod, StatusInfo> = {
  nytecknat: {
    kod: "nytecknat",
    farg: "green",
    etikett: "Nytecknat utan medling",
  },
  "efter-medling": {
    kod: "efter-medling",
    farg: "red",
    etikett: "Tecknat efter medling",
  },
  kvarstaende: {
    kod: "kvarstaende",
    farg: "blue",
    etikett: "Kvarstående",
  },
};

export function statusInfo(kod: AvtalStatusKod): StatusInfo {
  return STATUS[kod];
}

/**
 * Derives the status of an agreement. An agreement linked to a mediation is
 * always red, whether it has been signed yet or not (FR-012).
 */
export function avtalStatus(avtal: {
  teckningsdatum?: string | undefined;
  medlingskoppling?: boolean | undefined;
}): StatusInfo {
  if (avtal.medlingskoppling) {
    return avtal.teckningsdatum
      ? STATUS["efter-medling"]
      : { kod: "kvarstaende", farg: "red", etikett: "Kvarstående – kopplat till medling" };
  }
  return avtal.teckningsdatum ? STATUS.nytecknat : STATUS.kvarstaende;
}

/** The legend shown under status-coded tables. */
export const STATUSFORKLARING =
  "Grön = nytecknat utan medling · Röd = tecknat efter medling / medlingskoppling · Blå = kvarstående";
