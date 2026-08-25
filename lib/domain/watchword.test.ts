import { describe, expect, it } from "vitest";

import { addWatchword, countHits, segment, suggestTerm } from "./watchword";

const table = [{ term: "fredsplikt" }, { term: "avtalsperioden" }];

describe("segment — FAI-004", () => {
  it("returns the whole line untouched when the table is empty", () => {
    expect(segment("Fredsplikt gäller.", [])).toEqual([{ text: "Fredsplikt gäller.", hit: false }]);
  });

  it("marks a term wherever it appears in the line", () => {
    const out = segment("Fredsplikt gäller under avtalsperioden.", table);
    expect(out.filter((s) => s.hit).map((s) => s.text)).toEqual(["Fredsplikt", "avtalsperioden"]);
  });

  /*
    A protocol writes Fredsplikt at the head of a clause and fredsplikt inside
    one. An officer watching the term means both.
  */
  it("matches regardless of case", () => {
    expect(segment("FREDSPLIKT", table).every((s) => s.hit)).toBe(true);
  });

  it("preserves the line exactly when the segments are rejoined", () => {
    const line = "Fredsplikt gäller under avtalsperioden 2020-2023.";
    expect(
      segment(line, table)
        .map((s) => s.text)
        .join(""),
    ).toBe(line);
  });

  /*
    A table holding both deltidspension and deltidspensionspremie must mark the
    longer phrase, not the shorter one with a ragged tail after it.
  */
  it("prefers the longer term when one contains another", () => {
    const out = segment("ytterligare deltidspensionspremie avsätts", [
      { term: "deltidspension" },
      { term: "deltidspensionspremie" },
    ]);
    expect(out.filter((s) => s.hit).map((s) => s.text)).toEqual(["deltidspensionspremie"]);
  });

  it("marks every occurrence of a repeated term", () => {
    const out = segment("fredsplikt och åter fredsplikt", [{ term: "fredsplikt" }]);
    expect(out.filter((s) => s.hit)).toHaveLength(2);
  });

  it("leaves Swedish letters alone", () => {
    const out = segment("Arbetstidsförkortning om 0,2 %", [{ term: "arbetstidsförkortning" }]);
    expect(out.filter((s) => s.hit).map((s) => s.text)).toEqual(["Arbetstidsförkortning"]);
  });

  it("ignores a blank term rather than marking everything", () => {
    expect(segment("Fredsplikt gäller.", [{ term: "   " }])).toEqual([
      { text: "Fredsplikt gäller.", hit: false },
    ]);
  });
});

describe("countHits", () => {
  it("counts hits across lines", () => {
    expect(countHits(["Fredsplikt gäller.", "Under avtalsperioden."], table)).toBe(2);
  });

  it("is zero for an empty table", () => {
    expect(countHits(["Fredsplikt gäller."], [])).toBe(0);
  });
});

describe("addWatchword — the table is anpassningsbar", () => {
  it("appends a new term with its origin", () => {
    const out = addWatchword(table, "arbetstidsförkortning", "Partsträff 2027-01-21");
    expect(out).toHaveLength(3);
    expect(out[2]).toEqual({ term: "arbetstidsförkortning", origin: "Partsträff 2027-01-21" });
  });

  it("does not add a term the table already holds, whatever the case", () => {
    expect(addWatchword(table, "FREDSPLIKT")).toHaveLength(2);
  });

  it("ignores an empty term", () => {
    expect(addWatchword(table, "   ")).toHaveLength(2);
  });

  it("does not mutate the table it was given", () => {
    const before = [...table];
    addWatchword(table, "nytt ord");
    expect(table).toEqual(before);
  });
});

describe("suggestTerm — a demand is a sentence, a watchword is a word", () => {
  it.each([
    ["Höjd deltidspensionspremie", "deltidspensionspremie"],
    ["Arbetstidsförkortning 0,2 %", "Arbetstidsförkortning"],
    ["Låglönesatsning med krontalspåslag", "Låglönesatsning"],
    ["Avtalsperiod om två år", "Avtalsperiod"],
  ])("%s → %s", (topic, expected) => {
    expect(suggestTerm(topic)).toBe(expected);
  });

  /* A leading figure is never the term being watched. */
  it("skips words that start with a digit", () => {
    expect(suggestTerm("0,2 % arbetstidsförkortning")).toBe("arbetstidsförkortning");
  });

  it("falls back to the whole topic when there is nothing to pick", () => {
    expect(suggestTerm("  ")).toBe("");
  });
});
