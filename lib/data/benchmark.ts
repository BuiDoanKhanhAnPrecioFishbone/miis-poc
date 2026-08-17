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
