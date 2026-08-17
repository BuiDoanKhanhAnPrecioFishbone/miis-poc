/**
 * Mock AI extraction for US-01.
 *
 * The values are what an extraction of `Avtalsprotokoll_Kommunikation_2027.pdf`
 * plausibly returns, and each one names the passage it came from so the screen
 * can show the source rather than claim it.
 *
 * `employeeOrg` is seeded as rejected on purpose. The protocol names *Seko –
 * Service- och kommunikationsfacket*; the extraction picked up the parent
 * confederation instead, which is exactly the kind of near-miss a real model
 * makes on Swedish party names and exactly the case FAI-002 exists for.
 *
 * Week 2: becomes supabase/seed.sql. Nothing outside lib/data/ imports it.
 */

import type { ExtractionProposal } from "@/lib/domain/extraction";

export const EXTRACTION_PROPOSALS: ExtractionProposal[] = [
  {
    id: "area",
    value: "Kommunikation",
    source: "heading",
    confidence: "high",
    initialState: "approved",
  },
  {
    id: "matched",
    value: "Kommunikation – Almega Tjänsteförbunden / Seko",
    source: "parties",
    confidence: "high",
    initialState: "approved",
  },
  {
    id: "alternativeName",
    value: "Kommunikationsavtalet",
    source: "heading",
    confidence: "low",
    initialState: "pending",
  },
  {
    id: "agreementType",
    value: "Löneavtal + Allmänna villkor",
    source: "wageAppendix",
    confidence: "high",
    initialState: "approved",
  },
  {
    id: "employerOrg",
    value: "Almega Tjänsteförbunden",
    source: "parties",
    confidence: "high",
    initialState: "approved",
  },
  {
    id: "employeeOrg",
    value: "LO – Landsorganisationen i Sverige",
    source: "parties",
    confidence: "low",
    initialState: "rejected",
    correction: "Seko – Service- och kommunikationsfacket",
  },
  {
    id: "signedDate",
    value: "2027-05-28",
    source: "negotiation",
    confidence: "high",
    initialState: "approved",
  },
  {
    id: "validity",
    value: "2027-06-01 – 2029-05-31",
    source: "period",
    confidence: "high",
    initialState: "approved",
  },
  {
    id: "termination",
    value: "Ja, senast 2028-11-30",
    source: "terminationLead",
    confidence: "high",
    initialState: "pending",
  },
];
