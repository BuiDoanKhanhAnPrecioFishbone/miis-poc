/**
 * Mock party meetings for US-08.
 *
 * Real Swedish parties and real coordination structures. The LO unions
 * genuinely coordinate their demands ahead of a round, and *Facken inom
 * industrin* — IF Metall, Unionen, Sveriges Ingenjörer, GS and Livs — is the
 * grouping that sets the mark, so a coordinated demand backed by those five is
 * what MI would actually record. Demands are the topics that dominated recent
 * Swedish rounds: låglönesatsning, avtalsperiodens längd, arbetstidsförkortning
 * and deltidspension.
 *
 * MI meets one party at a time, so each record names one party and no
 * counterparty — see the note in `lib/domain/party-meeting.ts`.
 *
 * Week 2: becomes supabase/seed.sql. Nothing outside lib/data/ imports it.
 */

import type { PartyMeeting } from "@/lib/domain/party-meeting";

export const PARTY_MEETINGS: PartyMeeting[] = [
  {
    id: "PT-2027-04",
    party: "Facken inom industrin",
    partyType: "employee",
    agreementArea: { sv: "Industrin", en: "Industry" },
    date: "2027-01-21",
    location: { sv: "Medlingsinstitutet, Stockholm", en: "The Mediation Office, Stockholm" },
    state: "held",
    purpose: {
      sv: "Stämma av förhandlingsklimatet inför avtalsrörelsen 2027 och identifiera frågor med konfliktrisk.",
      en: "Gauge the negotiating climate ahead of the 2027 bargaining round and identify issues carrying a risk of conflict.",
    },
    agenda: [
      { sv: "Samordningens innehåll och beslutsordning", en: "The scope of the coordination and how it is decided" },
      { sv: "Avtalsperiodens längd", en: "The length of the agreement period" },
      { sv: "Arbetstidsförkortning och deltidspension", en: "Working time reduction and part-time pension" },
      { sv: "Bedömd konfliktrisk per avtalsområde", en: "Assessed risk of conflict per agreement area" },
    ],
    participants: ["Anna Andersson (MI)", "Per Ewaldsson (MI)", "Marie Nilsson", "Martin Linder"],
    templateDocument: "Partsträff_Facken_inom_industrin_2027-01-21.docx",
    notes: [
      {
        at: "09:15",
        text: {
          sv: "Samordningen omfattar fem förbund. Beslut om plattform tas i förbundsstyrelserna i februari.",
          en: "The coordination covers five unions. The platform is decided by the union boards in February.",
        },
      },
      {
        at: "09:40",
        text: {
          sv: "Låglönesatsningen beskrivs som en principfråga, inte förhandlingsbar i sak.",
          en: "The low-wage initiative is described as a matter of principle, not negotiable on the substance.",
        },
      },
      {
        at: "10:05",
        text: {
          sv: "Öppning för treårigt avtal om arbetstidsförkortning ingår. Motparten uppges vara emot.",
          en: "Openness to a three-year agreement if working time reduction is included. The counterparty is said to be against.",
        },
      },
    ],
    demands: [
      {
        id: "YRK-01",
        topic: { sv: "Låglönesatsning med krontalspåslag", en: "Low-wage initiative with a fixed-krona supplement" },
        kind: "coordinated",
        backedBy: ["IF Metall", "Unionen", "Sveriges Ingenjörer", "GS", "Livsmedelsarbetareförbundet"],
        documents: ["Avtalsplattform_FI_2027.pdf"],
        watchword: true,
      },
      {
        id: "YRK-02",
        topic: { sv: "Arbetstidsförkortning 0,2 %", en: "Working time reduction of 0.2 %" },
        kind: "coordinated",
        backedBy: ["IF Metall", "Unionen", "GS"],
        documents: [],
        watchword: true,
      },
      {
        id: "YRK-03",
        topic: { sv: "Avtalsperiod om två år", en: "A two-year agreement period" },
        kind: "coordinated",
        backedBy: ["IF Metall", "Unionen", "Sveriges Ingenjörer", "GS", "Livsmedelsarbetareförbundet"],
        documents: [],
        watchword: false,
      },
      {
        id: "YRK-04",
        topic: { sv: "Höjd deltidspensionspremie", en: "An increased part-time pension premium" },
        kind: "own",
        backedBy: [],
        documents: [],
        watchword: false,
      },
    ],
    conflictRisk: "medium",
    summary: {
      sv: "Samordningen är stabil. Arbetstidsfrågan är den mest sannolika konfliktpunkten; låglönesatsningen beskrivs som icke förhandlingsbar.",
      en: "The coordination is stable. Working time is the most likely point of conflict; the low-wage initiative is described as non-negotiable.",
    },
    documents: ["Partsträff_Facken_inom_industrin_2027-01-21.docx"],
  },
  {
    id: "PT-2027-05",
    party: "Teknikföretagen",
    partyType: "employer",
    agreementArea: { sv: "Industrin", en: "Industry" },
    date: "2027-01-28",
    location: { sv: "Medlingsinstitutet, Stockholm", en: "The Mediation Office, Stockholm" },
    state: "planned",
    purpose: {
      sv: "Arbetsgivarsidans bild av kostnadsläget och av de samordnade kraven inför avtalsrörelsen 2027.",
      en: "The employer side's view of the cost position and of the coordinated demands ahead of the 2027 round.",
    },
    agenda: [
      { sv: "Kostnadsläge och internationell konkurrenskraft", en: "Cost position and international competitiveness" },
      { sv: "Synen på arbetstidsförkortning", en: "The view on working time reduction" },
      { sv: "Avtalsperiodens längd", en: "The length of the agreement period" },
    ],
    participants: ["Anna Andersson (MI)", "Erik Lundgren"],
    notes: [],
    demands: [],
    documents: [],
  },
  {
    id: "PT-2026-11",
    party: "Kommunal",
    partyType: "employee",
    agreementArea: { sv: "Kommuner och regioner", en: "Municipalities and regions" },
    date: "2026-11-19",
    location: { sv: "Medlingsinstitutet, Stockholm", en: "The Mediation Office, Stockholm" },
    state: "completed",
    purpose: {
      sv: "Uppföljning av avtalsrörelsen i kommunsektorn och bedömning av kvarstående tvistefrågor.",
      en: "Follow-up on the bargaining round in the municipal sector and assessment of outstanding disputes.",
    },
    agenda: [
      { sv: "Kvarstående avtalsområden", en: "Remaining agreement areas" },
      { sv: "Bemanning och arbetstidens förläggning", en: "Staffing and the scheduling of working time" },
    ],
    participants: ["Johan Berg (MI)", "Malin Ragnegård"],
    templateDocument: "Partsträff_Kommunal_2026-11-19.docx",
    notes: [
      {
        at: "13:30",
        text: {
          sv: "Arbetstidens förläggning kvarstår som huvudfråga i två avtalsområden.",
          en: "The scheduling of working time remains the main issue in two agreement areas.",
        },
      },
    ],
    demands: [
      {
        id: "YRK-05",
        topic: { sv: "Arbetstidens förläggning i skiftgång", en: "Scheduling of working time in shift work" },
        kind: "own",
        backedBy: [],
        documents: ["Yrkande_Kommunal_2026.pdf"],
        watchword: true,
      },
    ],
    conflictRisk: "low",
    summary: {
      sv: "Låg konfliktrisk. Parterna bedöms nå avtal utan medling.",
      en: "Low risk of conflict. The parties are judged likely to reach agreement without mediation.",
    },
    documents: ["Partsträff_Kommunal_2026-11-19.docx", "Yrkande_Kommunal_2026.pdf"],
  },
];
