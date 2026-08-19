/**
 * FAI-004 — the watchword table, and the marking it drives.
 *
 * MI's §4.1 describes both halves in one paragraph:
 *
 * > Bevakningsordsmärkning. Systemet ska kunna markera och lyfta fram text i
 * > olika dokument utifrån en **fördefinierad och anpassningsbar** tabell med
 * > bevakningsord. Funktionen syftar till att snabbt ge en grov överblick över
 * > särskilt utvalda yrkanden, till exempel **sådana som identifierats vid
 * > partsträffar** inför avtalsförhandlingarna.
 *
 * So the table is not a fixed list and the marking is not decoration: a demand
 * heard at a party meeting in January is what makes a clause light up in a
 * protocol that arrives in June. Until now this repository asserted that
 * connection — the highlights on `/registrera` were four lines we chose by hand.
 * They are matched against the table now, and `/partstraffar` can add to it.
 *
 * The information model has `Watchword` as its own entity and `WatchwordHit`
 * as a second one, *"hits in documents with position and text excerpt – the
 * basis for highlighting in the UI"*. `segment` is that: it returns the runs of
 * a line with each marked as a hit or not, which is position and excerpt in the
 * form a renderer can use.
 *
 * Pure domain — no imports beyond sibling types, no I/O.
 */

export interface Watchword {
  term: string;
  /** Where it came from, so the table can say why a term is being watched. */
  origin?: string;
}

/** One run of a line: the text, and whether a watchword matched it. */
export interface Segment {
  text: string;
  hit: boolean;
}

/**
 * Split a line into hit and non-hit runs.
 *
 * Case-insensitive, because a protocol writes *Fredsplikt* at the start of a
 * clause and *fredsplikt* inside one, and an officer watching for the term
 * means both. Longest term first, so a table holding both `deltidspension` and
 * `deltidspensionspremie` marks the longer phrase rather than leaving a ragged
 * tail. Matches never overlap — once a stretch of the line is claimed, a
 * shorter term inside it does not re-mark it.
 *
 * Swedish is matched with `localeCompare`-free lowercasing, which is safe here:
 * the terms and the documents are both Swedish, and `toLocaleLowerCase("sv")`
 * leaves å, ä and ö alone.
 */
export function segment(line: string, watchwords: readonly Watchword[]): Segment[] {
  const terms = watchwords
    .map((w) => w.term.trim())
    .filter((t) => t.length > 0)
    .sort((a, b) => b.length - a.length);

  if (terms.length === 0) return [{ text: line, hit: false }];

  const lower = line.toLocaleLowerCase("sv");
  /** Which characters of the line a term has claimed. */
  const claimed = new Array<boolean>(line.length).fill(false);

  for (const term of terms) {
    const needle = term.toLocaleLowerCase("sv");
    let from = 0;
    for (;;) {
      const at = lower.indexOf(needle, from);
      if (at === -1) break;
      const end = at + needle.length;
      let free = true;
      for (let i = at; i < end; i++) {
        if (claimed[i]) {
          free = false;
          break;
        }
      }
      if (free) for (let i = at; i < end; i++) claimed[i] = true;
      from = at + 1;
    }
  }

  const out: Segment[] = [];
  let start = 0;
  for (let i = 1; i <= line.length; i++) {
    if (i === line.length || claimed[i] !== claimed[start]) {
      out.push({ text: line.slice(start, i), hit: claimed[start] === true });
      start = i;
    }
  }
  return out.length > 0 ? out : [{ text: line, hit: false }];
}

/** How many watchwords a line matches. Used for the hit count on the pane. */
export function countHits(lines: readonly string[], watchwords: readonly Watchword[]): number {
  return lines.reduce((n, line) => n + segment(line, watchwords).filter((s) => s.hit).length, 0);
}

/** Terms are compared case-insensitively, so the table cannot hold duplicates. */
export function addWatchword(
  table: readonly Watchword[],
  term: string,
  origin?: string,
): Watchword[] {
  const value = term.trim();
  if (!value) return [...table];
  const exists = table.some(
    (w) => w.term.toLocaleLowerCase("sv") === value.toLocaleLowerCase("sv"),
  );
  return exists ? [...table] : [...table, { term: value, origin }];
}

/**
 * A demand's topic is a sentence; a watchword is a word. *"Höjd
 * deltidspensionspremie"* is what the union said; *deltidspensionspremie* is
 * what an officer watches for, and it is the part that will actually appear in
 * a protocol six months later — which will say *"ytterligare
 * deltidspensionspremie avsätts"*, not the union's phrasing.
 *
 * The longest word is a good suggestion in Swedish precisely because the
 * information sits in the compound: *låglönesatsning*, *arbetstidsförkortning*,
 * *deltidspensionspremie*. It is a suggestion, not a decision — the officer
 * confirms or replaces it, because §4.1 makes the table customisable and no
 * heuristic should be quietly authoritative about what MI watches.
 */
export function suggestTerm(topic: string): string {
  const words = topic
    .split(/[\s,.;:()]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0 && !/^\d/.test(w));
  if (words.length === 0) return topic.trim();
  return words.reduce((longest, w) => (w.length > longest.length ? w : longest), words[0]!);
}

/**
 * The cookie holds terms separated by `|`, each optionally `term~origin`.
 * Deliberately not JSON: a cookie is a small, hostile place for it, and a
 * malformed value must degrade to "no extra terms" rather than throw during a
 * server render.
 */
export function decodeWatchwords(raw: string | undefined): Watchword[] {
  if (!raw) return [];
  try {
    return decodeURIComponent(raw)
      .split("|")
      .map((part) => part.split("~"))
      .filter(([term]) => term && term.trim().length > 0)
      .map(([term, origin]) => ({ term: term!.trim(), ...(origin ? { origin } : {}) }));
  } catch {
    return [];
  }
}

export function encodeWatchwords(added: readonly Watchword[]): string {
  return encodeURIComponent(
    added.map((w) => (w.origin ? `${w.term}~${w.origin}` : w.term)).join("|"),
  );
}
