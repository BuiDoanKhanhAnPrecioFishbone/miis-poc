/**
 * Data access for MIIS's own users — THE SEAM.
 *
 * The register is the same in every demo dataset. A dataset varies how much
 * *work* has arrived, not how MI is staffed, and an "empty" MI with no
 * authorisation administrator would be a state the system must never be in
 * (see `mayDeactivate`).
 *
 * Week 2 this is a query against `Anvandare`, joined to the role table. Nothing
 * outside `lib/data/` imports `lib/mock/`.
 */

import type { SystemUser } from "@/lib/domain/user";
import { USERS } from "@/lib/mock/users";

export async function listUsers(): Promise<SystemUser[]> {
  return USERS;
}
