/**
 * Data access for "Märket" — THE SEAM.
 */

import { benchmarkAtDate, type Benchmark } from "@/lib/domain/benchmark";
import { getDataset } from "@/lib/mock";
import { activeDataset } from "@/lib/session";

/** FM-003 – the benchmark in force at a given date, shown wherever relevant. */
export async function getCurrentBenchmark(date = "2027-06-01"): Promise<Benchmark | undefined> {
  const benchmarks = getDataset(await activeDataset()).benchmarks;
  return benchmarkAtDate(benchmarks, date) ?? benchmarks[0];
}

export async function listBenchmarks(): Promise<Benchmark[]> {
  return getDataset(await activeDataset()).benchmarks;
}

/**
 * FA-012 — the agreements flagged as norm-setting, newest period first.
 *
 * `/market` needs them because Märket is not a number MI invents: it is the
 * cost norm the industry agreements set, so the screen that registers it should
 * show which agreements it was read from.
 */
export async function listBenchmarkAgreements(): Promise<
  { id: string; name: string; parties: string; period: string; costFramePercent?: number }[]
> {
  const data = getDataset(await activeDataset());
  return data.wageAgreements
    .filter((w) => w.industryBenchmark)
    .map((w) => {
      const agreement = data.agreements.find((a) => a.id === w.agreementId);
      const row = {
        id: w.id,
        name: agreement?.name ?? w.agreementId,
        parties: agreement
          ? `${agreement.employerOrg.name} / ${agreement.employeeOrg.name}`
          : "",
        period: `${w.validFrom} – ${w.validTo}`,
      };
      return w.costFramePercent === undefined ? row : { ...row, costFramePercent: w.costFramePercent };
    })
    .sort((a, b) => b.period.localeCompare(a.period));
}
