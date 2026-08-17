/**
 * "Märket" – the industry cost norm, Epic F10.
 *
 * Registered as a periodised setting (FM-001) and displayed wherever relevant,
 * including the mediator view (FM-003).
 *
 * Identifiers are English; every user-facing string is Swedish.
 * Pure domain — no imports, no I/O.
 */

export interface Benchmark {
  id: string;
  /** Swedish period label, e.g. "2027–2029". */
  period: string;
  validFrom: string;
  validTo: string;
  costFramePercent: number;
  /** Free text per FM-001, e.g. "3,2 % / 3,2 %". */
  periodisation: string;
  supplementaryAgreements: string[];
  registeredDate: string;
  months: number;
}

/** FM-002 – alert when an Industry Agreement protocol is registered for a period with no benchmark. */
export function lacksBenchmarkForDate(benchmarks: Benchmark[], date: string): boolean {
  return !benchmarks.some((b) => b.validFrom <= date && b.validTo >= date);
}

export function benchmarkAtDate(benchmarks: Benchmark[], date: string): Benchmark | undefined {
  return benchmarks.find((b) => b.validFrom <= date && b.validTo >= date);
}
