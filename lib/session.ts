import { cookies } from "next/headers";

import { DEFAULT_ROLE, isRole, roleInfo, type Role, type RoleInfo } from "@/lib/domain/role";
import { DEFAULT_DATASET, isDatasetName, type DatasetName } from "@/lib/domain/dataset";

export const ROLE_COOKIE = "miis_role";
export const DATASET_COOKIE = "miis_dataset";

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

export async function activeRoleInfo(): Promise<RoleInfo> {
  return roleInfo(await activeRole());
}

/**
 * Which mock dataset this request sees — quiet, normal or peak.
 * Demo-only; it disappears when a real database arrives.
 */
export async function activeDataset(): Promise<DatasetName> {
  const value = (await cookies()).get(DATASET_COOKIE)?.value;
  return isDatasetName(value) ? value : DEFAULT_DATASET;
}
