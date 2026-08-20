/**
 * Mock working groups — FA-014, and the home of Bilaga B's `Särskilda frågor`.
 *
 * These are the real shape of a Swedish settlement's loose ends: the parties
 * agree the wage figure and hand the questions they could not close to a joint
 * group with a reporting date. The industrial agreement's groups on working
 * time and part-time pension are the standing example, and the protocol in
 * Bilaga D names two of them.
 *
 * Week 2: becomes supabase/seed.sql. Nothing outside lib/data/ imports it.
 */

import type { WorkingGroup } from "@/lib/domain/agreement";

export const WORKING_GROUPS: WorkingGroup[] = [
  {
    id: "AG-001",
    agreementId: "A-001",
    name: "Arbetsgrupp arbetstidsfrågor",
    subjectAreas: ["Arbetstidsförkortning", "Förläggning av arbetstid", "Beredskap"],
    reportsBy: "2028-09-30",
  },
  {
    id: "AG-002",
    agreementId: "A-001",
    name: "Arbetsgrupp deltidspension",
    subjectAreas: ["Deltidspensionspremie", "Uttag av deltidspension"],
    reportsBy: "2028-12-31",
  },
  {
    id: "AG-003",
    agreementId: "A-002",
    name: "Arbetsgrupp lönemodell",
    subjectAreas: ["Lönemodellens utformning", "Lokal lönebildning"],
    reportsBy: "2028-06-30",
  },
];
