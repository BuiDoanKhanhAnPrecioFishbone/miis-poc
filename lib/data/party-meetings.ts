/**
 * Data access for party meetings — THE SEAM.
 *
 * Week 1 this reads `lib/mock/`. Week 2 it queries the register, and the screen
 * does not change: the contract is "the meetings, newest first, and one of them
 * by id".
 */

import type { PartyMeeting } from "@/lib/domain/party-meeting";
import { PARTY_MEETINGS } from "@/lib/mock/party-meetings";

export async function listPartyMeetings(): Promise<PartyMeeting[]> {
  return [...PARTY_MEETINGS].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPartyMeeting(id: string): Promise<PartyMeeting | undefined> {
  return PARTY_MEETINGS.find((m) => m.id === id);
}
