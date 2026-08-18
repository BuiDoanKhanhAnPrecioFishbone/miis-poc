/**
 * Mock AI extraction for US-01.
 *
 * The values are what an extraction of `Avtalsprotokoll_Kommunikation_2027.pdf`
 * plausibly returns, and each one names the passage it came from so the screen
 * can show the source rather than claim it.
 *
 * `employeeOrg` carries a correction on purpose. The protocol names *Seko –
 * Service- och kommunikationsfacket*; the extraction picked up the parent
 * confederation instead, which is exactly the kind of near-miss a real model
 * makes on Swedish party names and exactly the case FAI-002 exists for. The
 * field opens on the officer's corrected value with the AI's original kept
 * beside it — US-01's "the officer corrects freely before approval".
 *
 * Week 2: becomes supabase/seed.sql. Nothing outside lib/data/ imports it.
 */

import type { ExtractionProposal } from "@/lib/domain/extraction";

export const EXTRACTION_PROPOSALS: ExtractionProposal[] = [
  {
    id: "area",
    value: "Kommunikation",
    source: "heading",
  },
  {
    id: "matched",
    value: "Kommunikation – Almega Tjänsteförbunden / Seko",
    source: "parties",
  },
  {
    id: "alternativeName",
    value: "Kommunikationsavtalet",
    source: "heading",
  },
  {
    id: "agreementType",
    value: "Löneavtal + Allmänna villkor",
    source: "wageAppendix",
  },
  {
    id: "employerOrg",
    value: "Almega Tjänsteförbunden",
    source: "parties",
  },
  {
    id: "employeeOrg",
    value: "LO – Landsorganisationen i Sverige",
    source: "parties",
    correction: "Seko – Service- och kommunikationsfacket",
  },
  {
    id: "signedDate",
    value: "2025-07-15",
    source: "negotiation",
  },
  {
    id: "validity",
    value: "2025-08-01 – 2027-07-31",
    source: "period",
  },
  {
    id: "termination",
    value: "Ja, senast 2027-04-30",
    source: "terminationLead",
  },
];
