import { cookies } from "next/headers";

import { DEFAULT_ROLE, isRole, roleInfo, type Role, type RoleInfo } from "@/lib/domain/role";
import { DEFAULT_DATASET, isDatasetName, type DatasetName } from "@/lib/domain/dataset";
import { DEFAULT_LANG, isLang, type Lang } from "@/lib/domain/lang";
import { dictionary, type Dictionary } from "@/lib/i18n";
import {
  DATASET_COOKIE,
  LANG_COOKIE,
  REQTAGS_COOKIE,
  ROLE_COOKIE,
  SESSION_TIMEOUT_COOKIE,
} from "@/lib/cookies";
import { sessionTimeoutMinutes } from "@/lib/domain/settings";

/**
 * The active role for the current request.
 *
 * Week 1 this is the demo role-switcher cookie. Week 2 it becomes a real
 * session — production authenticates with EFOS cards over SAML 2.0 through
 * Försäkringskassan's IdP (NFÅ-001) and consumes Enterprise IAM/SSID for
 * permissions. Screens only ever see the resolved role, so that swap does not
 * reach them.
 */
export async function activeRole(): Promise<Role> {
  const value = (await cookies()).get(ROLE_COOKIE)?.value;
  return isRole(value) ? value : DEFAULT_ROLE;
}

/**
 * Which mock dataset this request sees — quiet, normal or peak.
 * Demo-only; it disappears when a real database arrives.
 */
export async function activeDataset(): Promise<DatasetName> {
  const value = (await cookies()).get(DATASET_COOKIE)?.value;
  return isDatasetName(value) ? value : DEFAULT_DATASET;
}

/**
 * The interface language. Swedish unless the reviewer asked for English —
 * the same cookie pattern as role and dataset, which is what lets pages stay
 * server components.
 */
export async function activeLang(): Promise<Lang> {
  const value = (await cookies()).get(LANG_COOKIE)?.value;
  return isLang(value) ? value : DEFAULT_LANG;
}

/**
 * NFÅ-002's limit, in minutes — the one thing §3.1's "systemkonfiguration"
 * actually configures in this prototype.
 *
 * A cookie is user input, so the value goes through `sessionTimeoutMinutes`,
 * which falls back to MI's own default rather than to zero: a bad value must not
 * be able to end every session immediately.
 */
export async function activeSessionTimeout(): Promise<number> {
  return sessionTimeoutMinutes((await cookies()).get(SESSION_TIMEOUT_COOKIE)?.value);
}

export async function activeDictionary(): Promise<Dictionary> {
  return dictionary(await activeLang());
}

export async function activeRoleInfo(): Promise<RoleInfo> {
  const [role, lang] = await Promise.all([activeRole(), activeLang()]);
  return roleInfo(role, lang);
}

/**
 * Whether requirement-ID tags are rendered.
 *
 * **Off by default.** With the tags on, the screen is a traceability document;
 * with them off, it is the product MI is being asked to evaluate. Both views
 * have to exist, and the plain one is the one an evaluator forms an impression
 * of the interface from.
 */
export async function reqTagsEnabled(): Promise<boolean> {
  return (await cookies()).get(REQTAGS_COOKIE)?.value === "on";
}

/** Everything a screen needs about the current request, in one round of awaits. */
export interface Session {
  role: RoleInfo;
  dataset: DatasetName;
  lang: Lang;
  i18n: Dictionary;
  reqTags: boolean;
  /** NFÅ-002's configured limit, in minutes. */
  sessionTimeoutMinutes: number;
}

export async function getSession(): Promise<Session> {
  const [role, dataset, lang, reqTags, timeout] = await Promise.all([
    activeRole(),
    activeDataset(),
    activeLang(),
    reqTagsEnabled(),
    activeSessionTimeout(),
  ]);
  return {
    role: roleInfo(role, lang),
    dataset,
    lang,
    i18n: dictionary(lang),
    reqTags,
    sessionTimeoutMinutes: timeout,
  };
}
