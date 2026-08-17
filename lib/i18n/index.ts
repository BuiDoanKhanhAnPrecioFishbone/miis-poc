/**
 * The dictionary lookup.
 *
 * Pages resolve the language once, on the server, and pass the dictionary down
 * as a prop. There is no context, no provider and no client-side loading — the
 * language is a cookie read per request, so both translations are already in the
 * bundle and switching costs one server render.
 */

import { DEFAULT_LANG, type Lang } from "@/lib/domain/lang";
import { en } from "./en";
import { sv, type Dictionary } from "./sv";

export type { Dictionary };

const DICTIONARIES: Record<Lang, Dictionary> = { sv, en };

export function dictionary(lang: Lang = DEFAULT_LANG): Dictionary {
  return DICTIONARIES[lang] ?? sv;
}
