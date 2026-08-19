/**
 * The party register — FP-001 to FP-006.
 *
 * The organisational changes here are real, and two of them are the ones MI
 * names in §2.3 of the requirement specification: *Lärarförbundet* and
 * *Lärarnas Riksförbund* forming **Sveriges Lärare** in 2023, and *KFO* and
 * *Idea* merging into **Fremia** in 2021. US-03 cites both as the kind of change
 * the register has to survive.
 *
 * That is what makes FP-004 worth demonstrating rather than describing: a name
 * change is made once and reaches every *current* agreement, while an agreement
 * signed in 2019 keeps the name that was correct in 2019. Get it wrong and every
 * historical report quietly rewrites the past.
 *
 * Sector, employer group and industry code are on employer organisations only,
 * as FP-001 specifies — industry codes exist for those inside Svenskt
 * Näringsliv, which is why Fremia and Sobona have none.
 *
 * Week 2: becomes supabase/seed.sql. Nothing outside lib/data/ imports it.
 */

import type { CooperationBody, Party } from "@/lib/domain/party";

export const PARTY_REGISTER: Party[] = [
  {
    id: "P-028",
    type: "employee",
    name: "Sveriges Lärare",
    /*
      MI's own example. Two unions merged on 2023-01-01, so an agreement signed
      before that date must still show the union that actually signed it.
    */
    nameHistory: [
      {
        name: "Lärarförbundet",
        validFrom: "1991-01-01",
        validTo: "2022-12-31",
        note: "Gick samman med Lärarnas Riksförbund",
      },
      { name: "Sveriges Lärare", validFrom: "2023-01-01" },
    ],
    /* Information model §4.2 — a merger is a new party with relationships to
       its predecessors, not a note in the name history. */
    predecessorIds: ["P-101", "P-102"],
    contacts: [
      {
        name: "Karin Sundberg",
        title: "Förhandlingschef",
        phone: "08-737 65 00",
        email: "karin.sundberg@example.se",
      },
    ],
    active: true,
  },
  {
    id: "P-016",
    type: "employer",
    name: "Fremia",
    sector: "private",
    employerGroup: "Fristående arbetsgivarorganisationer",
    /* Outside Svenskt Näringsliv, so no industry code — FP-001. */
    nameHistory: [
      {
        name: "Arbetsgivarföreningen KFO",
        validFrom: "1946-01-01",
        validTo: "2020-12-31",
        note: "Gick samman med Idea",
      },
      { name: "Fremia", validFrom: "2021-01-01" },
    ],
    predecessorIds: ["P-103", "P-104"],
    contacts: [
      {
        name: "Anders Björk",
        title: "Förhandlingsansvarig",
        phone: "010-138 90 00",
        email: "anders.bjork@example.se",
      },
      { name: "Lena Ohlsson", title: "Avtalsansvarig", phone: "010-138 90 12", email: "lena.ohlsson@example.se" },
    ],
    active: true,
  },
  {
    id: "P-015",
    type: "employer",
    name: "Teknikföretagen",
    sector: "private",
    employerGroup: "Svenskt Näringsliv",
    industryCode: "25–30 Metallvaru- och maskinindustri",
    nameHistory: [
      { name: "Sveriges Verkstadsindustrier", validFrom: "1990-01-01", validTo: "2001-12-31" },
      { name: "Teknikföretagen", validFrom: "2002-01-01" },
    ],
    contacts: [
      { name: "Erik Lundgren", title: "Förhandlingschef", phone: "08-782 08 00", email: "erik.lundgren@example.se" },
    ],
    active: true,
  },
  {
    id: "P-010",
    type: "employer",
    name: "Industriarbetsgivarna",
    sector: "private",
    employerGroup: "Svenskt Näringsliv",
    industryCode: "24 Stål- och metallframställning",
    nameHistory: [{ name: "Industriarbetsgivarna", validFrom: "2011-01-01" }],
    contacts: [
      { name: "Per Hidesten", title: "Verkställande direktör", phone: "08-762 67 00", email: "per.hidesten@example.se" },
    ],
    active: true,
  },
  {
    id: "P-012",
    type: "employer",
    name: "Almega Tjänsteförbunden",
    sector: "private",
    employerGroup: "Svenskt Näringsliv",
    industryCode: "61 Telekommunikation",
    nameHistory: [{ name: "Almega Tjänsteförbunden", validFrom: "2005-01-01" }],
    contacts: [
      { name: "Maria Ek", title: "Förhandlare", phone: "08-762 69 00", email: "maria.ek@example.se" },
    ],
    active: true,
  },
  {
    id: "P-017",
    type: "employer",
    name: "Sobona",
    sector: "municipal",
    employerGroup: "Kommunala företagens arbetsgivarorganisation",
    nameHistory: [
      { name: "KFS", validFrom: "1994-01-01", validTo: "2019-12-31", note: "Gick samman med Pacta" },
      { name: "Sobona", validFrom: "2020-01-01" },
    ],
    contacts: [
      { name: "Johan Ivarsson", title: "Avtalsansvarig", phone: "08-452 77 00", email: "johan.ivarsson@example.se" },
    ],
    active: true,
  },
  {
    id: "P-020",
    type: "employee",
    name: "IF Metall",
    nameHistory: [
      { name: "Svenska Metallindustriarbetareförbundet", validFrom: "1888-01-01", validTo: "2005-12-31" },
      { name: "IF Metall", validFrom: "2006-01-01", note: "Bildades av Metall och Industrifacket" },
    ],
    contacts: [
      { name: "Marie Nilsson", title: "Förbundsordförande", phone: "08-786 80 00", email: "marie.nilsson@example.se" },
    ],
    active: true,
  },
  {
    id: "P-022",
    type: "employee",
    name: "Unionen",
    nameHistory: [
      { name: "Unionen", validFrom: "2008-01-01", note: "Bildades av HTF och Sif" },
    ],
    contacts: [
      { name: "Martin Linder", title: "Förbundsordförande", phone: "0770-870 870", email: "martin.linder@example.se" },
    ],
    active: true,
  },
  {
    id: "P-021",
    type: "employee",
    name: "Seko",
    nameHistory: [
      { name: "Statsanställdas förbund", validFrom: "1970-01-01", validTo: "1994-12-31" },
      { name: "Seko", validFrom: "1995-01-01" },
    ],
    contacts: [
      { name: "Gabriella Lavecchia", title: "Förbundsordförande", phone: "08-791 41 00", email: "gabriella.lavecchia@example.se" },
    ],
    active: true,
  },
  {
    id: "P-026",
    type: "employee",
    name: "Kommunal",
    nameHistory: [{ name: "Kommunal", validFrom: "1910-01-01" }],
    contacts: [
      { name: "Malin Ragnegård", title: "Förbundsordförande", phone: "010-442 70 00", email: "malin.ragnegard@example.se" },
    ],
    active: true,
  },
  /*
    The organisations that were replaced. They stay in the register rather than
    being deleted: an agreement signed in 2019 still references one of them, and
    FP-002's history of organisational changes is only navigable if both ends of
    the relationship exist.
  */
  {
    id: "P-101",
    type: "employee",
    name: "Lärarförbundet",
    nameHistory: [{ name: "Lärarförbundet", validFrom: "1991-01-01", validTo: "2022-12-31" }],
    contacts: [],
    active: false,
    successorId: "P-028",
  },
  {
    id: "P-102",
    type: "employee",
    name: "Lärarnas Riksförbund",
    nameHistory: [{ name: "Lärarnas Riksförbund", validFrom: "1884-01-01", validTo: "2022-12-31" }],
    contacts: [],
    active: false,
    successorId: "P-028",
  },
  {
    id: "P-103",
    type: "employer",
    name: "Arbetsgivarföreningen KFO",
    sector: "private",
    employerGroup: "Fristående arbetsgivarorganisationer",
    nameHistory: [
      { name: "Arbetsgivarföreningen KFO", validFrom: "1946-01-01", validTo: "2020-12-31" },
    ],
    contacts: [],
    active: false,
    successorId: "P-016",
  },
  {
    id: "P-104",
    type: "employer",
    name: "Idea",
    sector: "private",
    employerGroup: "Fristående arbetsgivarorganisationer",
    nameHistory: [{ name: "Idea", validFrom: "1993-01-01", validTo: "2020-12-31" }],
    contacts: [],
    active: false,
    successorId: "P-016",
  },
];

/**
 * FP-003 — cooperation bodies, with links to employer and employee
 * organisations and a time period. *Facken inom industrin* is the one that sets
 * Märket, so whether it is a negotiating body is decision-critical rather than
 * decorative.
 */
export const COOPERATION_BODIES: CooperationBody[] = [
  {
    id: "SO-001",
    name: "Facken inom industrin",
    type: "cooperation",
    negotiatingBody: true,
    validFrom: "1997-01-01",
    members: ["P-020", "P-022", "P-029"],
  },
  {
    id: "SO-002",
    name: "Svenskt Näringsliv",
    type: "umbrella",
    negotiatingBody: false,
    validFrom: "2001-01-01",
    members: ["P-010", "P-012", "P-015"],
  },
  {
    id: "SO-003",
    name: "LO",
    type: "umbrella",
    negotiatingBody: false,
    validFrom: "1898-01-01",
    members: ["P-020", "P-021", "P-026"],
  },
];
