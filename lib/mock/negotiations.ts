/**
 * Mock negotiations — FF-001 to FF-004.
 *
 * Two kinds, because FF-001 names two and they behave differently. A
 * *avtalsrörelse* negotiation belongs to an agreement and is how that
 * agreement's next period comes about, so it carries an `agreementId`. An
 * *övrig förhandling* need not — FF-003 says a standalone negotiation links
 * directly to the parties instead, which is what a dispute between one employer
 * organisation and one union outside a bargaining round looks like.
 *
 * FÖ-2025/218 is the negotiation `/registrera` offers when linking a protocol,
 * so the id a reviewer sees on that screen resolves to a real row here.
 *
 * Week 2: becomes supabase/seed.sql. Nothing outside lib/data/ imports it.
 */

import type { Negotiation } from "@/lib/domain/mediation";

export const NEGOTIATIONS: Negotiation[] = [
  {
    id: "FÖ-2025/218",
    type: "bargaining-round",
    agreementId: "A-006",
    parties: ["Almega Tjänsteförbunden", "Seko"],
    status: "ongoing",
  },
  {
    id: "FÖ-2027/104",
    type: "bargaining-round",
    agreementId: "A-001",
    parties: ["Industriarbetsgivarna", "IF Metall"],
    status: "closed-with-agreement",
    closedDate: "2027-03-31",
  },
  {
    id: "FÖ-2027/112",
    type: "bargaining-round",
    agreementId: "A-002",
    parties: ["Tågföretagen", "Seko"],
    status: "closed-with-agreement",
    closedDate: "2027-05-01",
  },
  {
    id: "FÖ-2027/119",
    type: "bargaining-round",
    agreementId: "A-004",
    parties: ["Almega Tjänsteförbunden", "Sveriges Farmaceuter"],
    status: "ongoing",
  },
  {
    /* FF-003 — standalone, so no agreement, only the parties. */
    id: "FÖ-2027/126",
    type: "other",
    parties: ["Teknikföretagen", "Unionen"],
    status: "ongoing",
  },
  {
    id: "FÖ-2026/087",
    type: "other",
    parties: ["Fremia", "Kommunal"],
    status: "closed-without-agreement",
    closedDate: "2026-11-20",
  },
];
