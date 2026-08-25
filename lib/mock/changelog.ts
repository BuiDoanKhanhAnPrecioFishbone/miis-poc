/**
 * Mock change log — FH-001.
 *
 * The rows are the changes the demo scenarios actually make, so an evaluator
 * who follows the walkthrough can find their own edit here: the corrected
 * employee party from US-01's registration, the confidentiality marking, the
 * merged party from US-03, the watchword added at a party meeting.
 *
 * `oldValue: null` is a creation and `newValue: null` a removal — FH-001 asks
 * for both values, and a field that was empty before is not the same as one
 * that is unknown.
 *
 * Week 2: becomes supabase/seed.sql. Nothing outside lib/data/ imports it.
 */

import type { ChangeLogEntry } from "@/lib/domain/event";

export const CHANGE_LOG: ChangeLogEntry[] = [
  {
    id: "CL-012",
    timestamp: "2027-05-12 14:02",
    user: "Anna Andersson",
    entity: "Avtal",
    entityId: "A-006",
    field: "Avtalspart ATO",
    oldValue: "PTK – Förhandlings- och samverkansrådet",
    newValue: "Unionen",
  },
  {
    id: "CL-011",
    timestamp: "2027-05-12 14:02",
    user: "Anna Andersson",
    entity: "Avtal",
    entityId: "A-006",
    field: "Registreringsstatus",
    oldValue: "Ofullständig",
    newValue: "Klar",
  },
  {
    id: "CL-010",
    timestamp: "2027-05-11 09:41",
    user: "Anna Andersson",
    entity: "Avtal",
    entityId: "A-004",
    field: "Sekretessmarkering",
    oldValue: "Nej",
    newValue: "Ja",
  },
  {
    id: "CL-009",
    timestamp: "2027-05-08 16:15",
    user: "Per Persson",
    entity: "Bevakningsord",
    entityId: "BO-014",
    field: "Ord",
    oldValue: null,
    newValue: "deltidspensionspremie",
  },
  {
    id: "CL-008",
    timestamp: "2027-05-04 11:27",
    user: "Anna Andersson",
    entity: "Part",
    entityId: "P-028",
    field: "Namn",
    oldValue: "Lärarförbundet",
    newValue: "Sveriges Lärare",
  },
  {
    id: "CL-007",
    timestamp: "2027-05-03 09:15",
    user: "Per Persson",
    entity: "Medlingsärende",
    entityId: "M-2027-12",
    field: "Medlare",
    oldValue: null,
    newValue: "Gunilla Runnquist (ettan)",
  },
  {
    id: "CL-006",
    timestamp: "2027-04-02 08:50",
    user: "Anna Andersson",
    entity: "Löneavtal",
    entityId: "LA-001",
    field: "Kostnadsram",
    oldValue: "6,2 %",
    newValue: "6,4 %",
  },
  {
    id: "CL-005",
    timestamp: "2027-03-18 13:04",
    user: "Lars Lund",
    entity: "Märket",
    entityId: "MK-2027",
    field: "Periodisering",
    oldValue: null,
    newValue: "3,2 % / 3,2 %",
  },
];
