/**
 * MI's predefined watchword table — FAI-004's *fördefinierad* half.
 *
 * These are the clause types an officer watches for when a protocol arrives:
 * the peace obligation, the period, the right to terminate, and the working
 * groups a settlement sets up. They are properties of the document, not of any
 * one bargaining round, which is why they are predefined rather than added at a
 * party meeting.
 *
 * The *anpassningsbar* half is what `/partstraffar` adds — a demand promoted
 * there joins this table for the session.
 *
 * Week 2: becomes supabase/seed.sql. Nothing outside lib/data/ imports it.
 */

import type { Watchword } from "@/lib/domain/watchword";

export const PREDEFINED_WATCHWORDS: Watchword[] = [
  { term: "fredsplikt", origin: "Fördefinierad" },
  { term: "avtalsperioden", origin: "Fördefinierad" },
  { term: "säga upp avtalet", origin: "Fördefinierad" },
  { term: "arbetsgrupp", origin: "Fördefinierad" },
];
