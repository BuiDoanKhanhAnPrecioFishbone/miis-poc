import { cookies } from "next/headers";

import { arRoll, rollInfo, STANDARDROLL, type Roll, type RollInfo } from "@/lib/domain/roll";

/**
 * The active role for the current request.
 *
 * Week 1 this is the demo role-switcher cookie. Week 2 it becomes a real
 * session — production authenticates with EFOS cards over SAML 2.0 through
 * Försäkringskassan's IdP (NFÅ-001) and consumes Enterprise IAM/SSID for
 * permissions. Screens only ever see the resolved role, so that swap does not
 * reach them.
 */
export async function aktivRoll(): Promise<Roll> {
  const varde = (await cookies()).get("miis_roll")?.value;
  return arRoll(varde) ? varde : STANDARDROLL;
}

export async function aktivRollInfo(): Promise<RollInfo> {
  return rollInfo(await aktivRoll());
}
