/**
 * Party references used across the mock data.
 *
 * Real Swedish labour-market organisations, so the prototype reads as real.
 * Nothing outside lib/data/ imports this.
 */

import type { PartyRef } from "@/lib/domain/agreement";

export const PARTIES = {
  industriarbetsgivarna: { id: "P-010", name: "Industriarbetsgivarna" },
  tagforetagen: { id: "P-011", name: "Tågföretagen" },
  almega: { id: "P-012", name: "Almega Tjänsteförbunden", shortName: "Almega" },
  kompetensforetagen: { id: "P-013", name: "Kompetensföretagen" },
  svenskHandel: { id: "P-014", name: "Svensk Handel" },
  teknikforetagen: { id: "P-015", name: "Teknikföretagen" },
  fremia: { id: "P-016", name: "Fremia" },
  sobona: { id: "P-017", name: "Sobona" },

  ifMetall: { id: "P-020", name: "IF Metall" },
  seko: { id: "P-021", name: "Seko" },
  unionen: { id: "P-022", name: "Unionen" },
  farmaceuter: { id: "P-023", name: "Sveriges Farmaceuter" },
  hrf: { id: "P-024", name: "Hotell- och Restaurangfacket", shortName: "HRF" },
  st: { id: "P-025", name: "ST" },
  kommunal: { id: "P-026", name: "Kommunal" },
  ledarna: { id: "P-027", name: "Ledarna" },
  sverigesLarare: { id: "P-028", name: "Sveriges Lärare" },
  ingenjorer: { id: "P-029", name: "Sveriges Ingenjörer" },
  srat: { id: "P-030", name: "SRAT" },
} as const satisfies Record<string, PartyRef>;

export const EMPLOYER_ORGS: PartyRef[] = [
  PARTIES.industriarbetsgivarna,
  PARTIES.tagforetagen,
  PARTIES.almega,
  PARTIES.kompetensforetagen,
  PARTIES.svenskHandel,
  PARTIES.teknikforetagen,
  PARTIES.fremia,
  PARTIES.sobona,
];

export const EMPLOYEE_ORGS: PartyRef[] = [
  PARTIES.ifMetall,
  PARTIES.seko,
  PARTIES.unionen,
  PARTIES.farmaceuter,
  PARTIES.hrf,
  PARTIES.st,
  PARTIES.kommunal,
  PARTIES.ledarna,
  PARTIES.sverigesLarare,
  PARTIES.ingenjorer,
];
