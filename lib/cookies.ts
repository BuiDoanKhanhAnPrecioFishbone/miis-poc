/**
 * Cookie names for the demo session.
 *
 * Their own module because both sides need them: `lib/session.ts` reads them on
 * the server through `next/headers`, and the demo bar writes them in the
 * browser. A client component cannot import `lib/session.ts` without dragging
 * `next/headers` into the bundle.
 *
 * Role and language survive into production in some form; dataset and the
 * requirement-tag switch are demo-only and disappear with the mock data.
 */

export const ROLE_COOKIE = "miis_role";
export const DATASET_COOKIE = "miis_dataset";
export const LANG_COOKIE = "miis_lang";
export const REQTAGS_COOKIE = "miis_reqtags";

/*
  FAI-004's customisable half. A watchword added at a party meeting has to reach
  the registration screen, which is a different route rendered on the server, so
  it travels the same way role and language do. In week 2 these are rows in
  `Bevakningsord` and the cookie disappears with the mock data.
*/
export const WATCHWORD_COOKIE = "miis_watchwords";

/*
  NFÅ-002's configurable limit. The one system setting MI names as configurable,
  so it travels the same way role and language do — written by the settings panel
  in the browser, read on the server, and applied by the session warning. In week
  2 it is a row in the system configuration table and the cookie disappears.
*/
export const SESSION_TIMEOUT_COOKIE = "miis_session_timeout";

/*
  FA-022's marking. A reminder is set on Konjunkturlönerapporten's watch list and
  counted on the start page, which is a different route rendered on the server —
  so it travels the way a watchword does. In week 2 it is a row in the reminder
  table and the cookie disappears with the mock data.
*/
export const REMINDER_COOKIE = "miis_reminders";

/*
  Where the reviewer has got to in the guided walkthrough — a reviewer tool, not
  a MIIS setting, which is why it is read by the demo strip and by nothing else.
  It exists so the walkthrough can be walked from inside the product rather than
  by returning to a long page and finding your place in it.
*/
/**
 * Bilaga 2 §3.5's acts — an agreement registered, an agreement published — for
 * the length of a demo session.
 *
 * The scored bullets end in acts, and each was held in a client component's
 * state while every register is server-rendered. So the act announced itself
 * and the register went on showing what it had before. These two put the result
 * where `lib/data/` can read it, the way watchwords and reminders already do.
 */
export const DRAFT_COOKIE = "miis_drafts";
export const PUBLISHED_COOKIE = "miis_published";

export const WALKTHROUGH_COOKIE = "miis_walkthrough";

export const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
