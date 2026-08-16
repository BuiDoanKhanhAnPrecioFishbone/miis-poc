/**
 * "Märket" – the industry cost norm, Epic F10.
 * Registered as a periodised setting (FM-001) and displayed wherever relevant,
 * including the mediator view (FM-003).
 *
 * Pure domain — no imports, no I/O.
 */

export interface Marke {
  id: string;
  period: string;
  giltigFrom: string;
  giltigTom: string;
  kostnadsramProcent: number;
  /** Free text per FM-001, e.g. "3,2 % / 3,2 %". */
  periodisering: string;
  tillaggsoverenskommelser: string[];
  registreradDatum: string;
  antalManader: number;
}

/** FM-002 – alert when an Industry Agreement protocol is registered for a period with no benchmark. */
export function saknarMarkeForPeriod(marken: Marke[], datum: string): boolean {
  return !marken.some((m) => m.giltigFrom <= datum && m.giltigTom >= datum);
}

export function gallandeMarke(marken: Marke[], datum: string): Marke | undefined {
  return marken.find((m) => m.giltigFrom <= datum && m.giltigTom >= datum);
}
