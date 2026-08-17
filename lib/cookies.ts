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

export const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
