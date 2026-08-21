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

export const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
