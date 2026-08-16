/**
 * FS-001 – the role-adapted start page.
 *
 * One rendering path, different content per role. Adding a role means adding
 * panels in lib/data/start.ts, not writing a new screen.
 *
 * Pure domain — no imports beyond sibling types, no I/O.
 */

import type { AvtalRad } from "./avtal";
import type { Handelse, Paminnelse } from "./handelse";
import type { Marke } from "./marke";
import type { RollInfo } from "./roll";

export interface Lankknapp {
  text: string;
  href?: string;
  reqTag?: string;
}

export type StartPanel =
  | {
      sort: "lista";
      titel: string;
      reqTaggar?: string[];
      poster: { text: string; badge?: string }[];
      fotnot?: string;
      knapp?: Lankknapp;
    }
  | {
      sort: "paminnelser";
      titel: string;
      reqTaggar?: string[];
      poster: Paminnelse[];
      fotnot?: string;
      knapp?: Lankknapp;
    }
  | {
      sort: "avtalstabell";
      titel: string;
      reqTaggar?: string[];
      rader: AvtalRad[];
    }
  | {
      sort: "handelser";
      titel: string;
      reqTaggar?: string[];
      poster: Handelse[];
      fotnot?: string;
    };

export interface Startsida {
  roll: RollInfo;
  rubrik: string;
  underrubrik: string;
  primarAtgard?: { text: string; href: string };
  /** FM-003 – benchmark shown wherever relevant. */
  marke?: Marke;
  /** Panels laid out two-up, then full width. */
  paneler: StartPanel[];
  aiIntro: string;
  aiForslag: string[];
}
