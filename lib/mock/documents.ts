/**
 * Mock documents (FD-001).
 *
 * The five kinds the requirement names: agreement protocols, agreements,
 * Director-General mediation decisions, mediator reports and party meeting
 * documentation.
 *
 * `confidential` is set here, but lib/data/documents.ts re-derives it from the
 * agreement before anything is shown — D-001 puts the mark on the agreement and
 * lets it carry to the attachments, so the agreement is the authority and this
 * field is only a default.
 *
 * Week 2: becomes supabase/seed.sql. Nothing outside lib/data/ imports it.
 */

import type { StoredDocument } from "@/lib/domain/event";

export const DOCUMENTS: StoredDocument[] = [
  {
    id: "DOK-001",
    fileName: "Avtalsprotokoll_Stal_och_metall_2027.pdf",
    type: "protocol",
    uploadedDate: "2027-04-02",
    linkedTo: "Stål- och metallindustrin – Industriarbetsgivarna / IF Metall",
    confidential: false,
    agreementId: "A-001",
  },
  {
    id: "DOK-002",
    fileName: "Avtalsprotokoll_Sparttrafik_2027.pdf",
    type: "protocol",
    uploadedDate: "2027-05-13",
    linkedTo: "Spårtrafik – Tågföretagen / Seko",
    confidential: false,
    agreementId: "A-002",
  },
  {
    id: "DOK-003",
    fileName: "GD-beslut_12-2027.pdf",
    type: "dg-decision",
    uploadedDate: "2027-05-03",
    linkedTo: "Medlingsärende M-2027/12 – Spårtrafik",
    confidential: false,
    agreementId: "A-002",
  },
  {
    id: "DOK-004",
    fileName: "Medlarrapport_2027-04-28.pdf",
    type: "mediator-report",
    uploadedDate: "2027-04-28",
    linkedTo: "Medlingsärende M-2027/09 – Hemserviceföretag",
    confidential: false,
    agreementId: "A-009",
  },
  {
    id: "DOK-010",
    fileName: "Avtalsprotokoll_Apotek_2027.pdf",
    type: "protocol",
    uploadedDate: "2027-06-03",
    linkedTo: "Apotek – Almega Tjänsteförbunden / Sveriges Farmaceuter",
    confidential: false,
    agreementId: "A-004",
  },
  {
    id: "DOK-011",
    fileName: "Avtalsprotokoll_Hemservicefortag_2027.pdf",
    type: "protocol",
    uploadedDate: "2027-04-29",
    linkedTo: "Hemserviceföretag – Almega Tjänsteförbunden / Kommunal",
    confidential: false,
    agreementId: "A-009",
  },
  {
    id: "DOK-012",
    fileName: "Avtalsprotokoll_Bemanning_2027.pdf",
    type: "protocol",
    uploadedDate: "2027-03-16",
    linkedTo: "Bemanning – Kompetensföretagen / Unionen",
    confidential: false,
    agreementId: "A-010",
  },
  {
    id: "DOK-005",
    fileName: "Partstraff_IF_Metall_2027-06-11.docx",
    type: "party-meeting",
    uploadedDate: "2027-06-11",
    linkedTo: "Partsträff – IF Metall, samordnade avtalskrav",
    confidential: false,
  },
  {
    id: "DOK-006",
    fileName: "Avtalsprotokoll_Fristaende_skolor_2027.pdf",
    type: "protocol",
    uploadedDate: "2027-05-05",
    linkedTo: "Fristående skolor – Fremia / Sveriges Lärare",
    confidential: true,
    agreementId: "A-011",
  },
  {
    id: "DOK-007",
    fileName: "Allmanna_villkor_Fristaende_skolor_2027.pdf",
    type: "agreement",
    uploadedDate: "2027-05-05",
    linkedTo: "Fristående skolor – Fremia / Sveriges Lärare",
    confidential: true,
    agreementId: "A-011",
  },
  {
    id: "DOK-008",
    fileName: "Avtalsprotokoll_Kommunikation_2027.pdf",
    type: "protocol",
    uploadedDate: "2027-05-28",
    linkedTo: "Kommunikation – Almega Tjänsteförbunden / Seko",
    confidential: false,
    agreementId: "A-005",
  },
  {
    id: "DOK-009",
    fileName: "Forhandlingsordningsavtal_Bemanning.pdf",
    type: "other",
    uploadedDate: "2027-02-28",
    linkedTo: "Bemanning – Kompetensföretagen / Unionen",
    confidential: false,
    agreementId: "A-010",
  },
  /*
    The two documents Scenario 3's last bullet needs — *"öppnar och laddar ned
    avtal"*. Without them the public page offered a download control over an
    empty list, which demonstrates the opposite of the bullet.

    An *avtalstryck* beside the protocol on purpose: FR-011 releases both to
    the public, and they are different things — the protocol is what the
    parties signed, the tryck is the agreement as it is published.
  */
  {
    id: "DOK-013",
    fileName: "Avtalsprotokoll_Teknikavtalet_IF_Metall_2027.pdf",
    type: "protocol",
    uploadedDate: "2027-04-05",
    linkedTo: "Teknikavtalet IF Metall – Teknikföretagen / IF Metall",
    confidential: false,
    agreementId: "A-013",
  },
  {
    id: "DOK-014",
    fileName: "Avtalstryck_Teknikavtalet_IF_Metall_2027-2029.pdf",
    type: "agreement",
    uploadedDate: "2027-04-06",
    linkedTo: "Teknikavtalet IF Metall – Teknikföretagen / IF Metall",
    confidential: false,
    agreementId: "A-013",
  },
];
