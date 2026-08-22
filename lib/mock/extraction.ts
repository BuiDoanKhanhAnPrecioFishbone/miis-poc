/**
 * Mock AI extraction for US-01.
 *
 * The values are what an extraction of MI's own protocol — Bilaga D of
 * `Bilaga_1_Kravspecifikation.pdf`, Föreningen Industriarbetsgivarna and
 * Unionen, Stål- och metallindustrin — plausibly returns. Every one appears on
 * the scanned page in `public/protokoll-sida-1.png`, and each names the line it
 * came from, so the screen can show the source rather than claim it.
 *
 * `employeeOrg` carries a correction on purpose. The page names *Unionen*; the
 * extraction picked up a confederation instead, which is the kind of near-miss
 * a real model makes on Swedish party names and exactly the case FAI-002 exists
 * for. The field opens on the officer's corrected value with the AI's original
 * kept beside it — US-01's "the officer corrects freely before approval".
 *
 * Week 2: becomes supabase/seed.sql. Nothing outside lib/data/ imports it.
 */

import type { ExtractionProposal } from "@/lib/domain/extraction";

/**
 * The agreement this protocol belongs to.
 *
 * `matched` above carries the *name* the AI read off the heading, which is what
 * the officer checks. The id is what the screen needs once the registration is
 * approved: FA-022 puts the protocol on an agreement that already exists, so
 * the act ends somewhere — on that agreement — rather than on a register of
 * seventeen where the officer has to find it again.
 */
export const MATCHED_AGREEMENT_ID = "A-001";

export const EXTRACTION_PROPOSALS: ExtractionProposal[] = [
  /*
    Read out of MI's own protocol (Bilaga D): Föreningen Industriarbetsgivarna
    and Unionen, Stål- och metallindustrin, 2020-11-01 – 2023-03-31. Every value
    below appears on the page in `public/protokoll-sida-1.png`, and every
    `source` names the line it appears on.
  */
  { id: "area", value: "Stål- och metallindustrin", source: "area" },
  {
    id: "matched",
    value: "Stål- och metallindustrin – Industriarbetsgivarna / Unionen",
    source: "heading",
  },
  { id: "alternativeName", value: "Avtal 20", source: "negotiation" },
  { id: "agreementType", value: "Löneavtal + Allmänna villkor", source: "wageAppendix" },
  { id: "employerOrg", value: "Föreningen Industriarbetsgivarna", source: "employerParty" },
  {
    id: "employeeOrg",
    /*
      Where the extraction got it wrong: the page names Unionen, and an
      earlier pass proposed the confederation above it. US-01's alternative
      flow — "the officer corrects freely before approval".
    */
    value: "PTK – Förhandlings- och samverkansrådet",
    correction: "Unionen",
    source: "employeeParty",
  },
  { id: "signedDate", value: "2020-10-31", source: "negotiation" },
  { id: "validity", value: "2020-11-01 – 2023-03-31", source: "period" },
  { id: "termination", value: "Ja, senast 2021-09-30", source: "terminationLead" },
];
