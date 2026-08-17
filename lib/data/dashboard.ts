/**
 * FS-001 – the role-adapted start page — THE SEAM.
 *
 * "The information shall be adapted to the different roles in the system; for
 * example, a mediation administrator shall see ongoing mediations."
 *
 * Identifiers are English; every user-facing string is Swedish.
 */

import { partiesShort } from "@/lib/domain/agreement";
import type { Dashboard, DashboardPanel } from "@/lib/domain/dashboard";
import { caseNumber, MEDIATION_TYPE_LABEL } from "@/lib/domain/mediation";
import { roleInfo, type Role } from "@/lib/domain/role";
import { listIncompleteAgreements, listRecentAgreements } from "./agreements";
import { getCurrentBenchmark } from "./benchmark";
import { listEvents, listReminders, reminderCount } from "./events";
import { listMediationCases, listMediators, listOngoingMediationCases } from "./mediation";

export async function getDashboard(role: Role): Promise<Dashboard> {
  const info = roleInfo(role);
  const benchmark = await getCurrentBenchmark();

  const base = {
    role: info,
    heading: `Startsida – ${info.label}`,
    subheading:
      "Rollanpassat innehåll enligt tilldelad roll och behörighet (FS-001, NFÅ-003). Inloggad via EFOS-kort, session avslutas efter 30 min inaktivitet (NFÅ-001, NFÅ-002).",
    ...(benchmark ? { benchmark } : {}),
  };

  switch (role) {
    case "agreement-admin": {
      const [reminders, total, incomplete, recent, events] = await Promise.all([
        listReminders(),
        reminderCount(),
        listIncompleteAgreements(),
        listRecentAgreements(),
        listEvents(2),
      ]);

      const panels: DashboardPanel[] = [
        {
          kind: "reminders",
          title: "Mina påminnelser",
          reqTags: ["FA-022"],
          items: reminders,
          emptyText: "Inga påminnelser just nu.",
          footnote: "Påminnelser skickas även som e-post med länk till avtalet",
          ...(total > 0 ? { action: { text: `Visa alla (${total})` } } : {}),
        },
        {
          kind: "list",
          title: "Ofullständiga registreringar",
          reqTags: ["FA-021"],
          // Registrations still awaiting information come first — those are the
          // ones an agreement administrator has to chase (US-04).
          items: incomplete
            .slice()
            .sort((a, b) => Number(Boolean(a.signedDate)) - Number(Boolean(b.signedDate)))
            .slice(0, 3)
            .map((a) => ({ text: `${a.name} – ${partiesShort(a)}`, badge: "OFULLSTÄNDIG" })),
          emptyText: "Alla registreringar är kompletta.",
          footnote:
            "Visas i Konjunkturlönerapportens vy med statuskolumn (registrerat / delvis registrerat), protokollslänk och vilka avtal som redan exporterats",
          action: { text: "Öppna Konjunkturlönerapportens vy", reqTag: "FR-008" },
        },
        {
          kind: "agreement-table",
          title: "Senast registrerade avtal",
          reqTags: ["FR-012"],
          rows: recent,
          emptyText: "Inga avtal registrerade ännu.",
        },
        {
          kind: "events",
          title: "Senaste händelser",
          reqTags: ["FH-002"],
          items: events,
          emptyText: "Inga händelser loggade ännu.",
          footnote: "Ur händelseloggen – fullständig logg under Administration",
        },
      ];

      return {
        ...base,
        primaryAction: { text: "+ Ladda upp avtalsprotokoll", href: "/registrera" },
        panels,
        aiIntro:
          "Ställ frågor om påminnelser, ofullständiga registreringar och senast registrerade avtal – som komplement till vyerna på startsidan.",
        aiSuggestions: [
          "Vilka avtal löper ut inom 90 dagar?",
          "Sammanfatta mina ofullständiga registreringar",
          "Vad innebär märket 2027–2029 för mina avtal?",
          "Visa händelser kopplade till medling senaste månaden",
        ],
      };
    }

    case "mediation-admin": {
      const [ongoing, events] = await Promise.all([listOngoingMediationCases(), listEvents(2)]);

      const panels: DashboardPanel[] = [
        {
          kind: "list",
          title: "Pågående medlingar",
          reqTags: ["FF-006", "FS-001"],
          items: ongoing.map((c) => ({
            text: `${caseNumber(c.id)} · ${c.name} · ${MEDIATION_TYPE_LABEL[c.type]}`,
            badge: "PÅGÅENDE",
          })),
          emptyText: "Inga pågående medlingar.",
          footnote: "Medlingsärenden skapas automatiskt när ett GD-beslut laddas upp",
          action: { text: "Öppna medlingsärenden", href: "/medling" },
        },
        {
          kind: "list",
          title: "GD-beslut att slutföra",
          reqTags: ["FSD-001", "FE-001"],
          items: ongoing.map((c) => ({
            text: `${c.dgDecision.number} · ${c.name}`,
            badge: "EJ KLARMARKERAT",
          })),
          emptyText: "Inga beslut väntar på klarmarkering.",
          footnote:
            "Vid klarmarkering skickas notifierings-epost med länk till medlaradministratören och sändningen loggas",
        },
        {
          kind: "list",
          title: "Kommande partsträffar",
          reqTags: ["FF-004"],
          items: [
            { text: "2027-06-04 · Almega Tjänsteförbunden – inför avtalsrörelsen" },
            { text: "2027-06-11 · IF Metall – samordnade avtalskrav" },
          ],
          footnote: "Interaktiv vy för att föra in information direkt under mötet",
          action: { text: "Öppna partsträffar", href: "/partstraffar" },
        },
        {
          kind: "events",
          title: "Senaste händelser",
          reqTags: ["FH-002"],
          items: events,
          emptyText: "Inga händelser loggade ännu.",
          footnote: "Ur händelseloggen – fullständig logg under Administration",
        },
      ];

      return {
        ...base,
        primaryAction: { text: "+ Ladda upp GD-beslut", href: "/medling" },
        panels,
        aiIntro:
          "Ställ frågor om pågående medlingar, berörda avtal, spridningsrisker och tidigare medlingar på avtalsområdet.",
        aiSuggestions: [
          "Vilka avtal berörs av M-2027/12?",
          "Finns spridningsrisk till närliggande avtalsområden?",
          "Vilka avtal omfattas av förhandlingsordningsavtal?",
          "Sammanfatta tidigare medlingar inom spårtrafik",
        ],
      };
    }

    case "mediator-admin": {
      const [mediators, cases] = await Promise.all([listMediators(), listMediationCases()]);

      const panels: DashboardPanel[] = [
        {
          kind: "list",
          title: "Medlarregister",
          reqTags: ["FF-009"],
          items: mediators.map((m) => ({
            text: `${m.name} · ${m.types.map((t) => MEDIATION_TYPE_LABEL[t]).join(", ")} · ${m.history.length} uppdrag`,
            badge: m.active ? "AKTIV" : "INAKTIV",
          })),
          emptyText: "Inga medlare registrerade ännu.",
          footnote: "Statistik per medlare (år/avtalsområde) visas som beslutsstöd inför tillsättning",
          action: { text: "Öppna medlarregistret", href: "/medlare" },
        },
        {
          kind: "list",
          title: "Ärenden att komplettera med medlare",
          reqTags: ["FE-001", "FF-009"],
          items: cases.map((c) => ({
            text: `${caseNumber(c.id)} · ${c.name}`,
            badge: c.mediators.length > 0 ? "MEDLARE TILLSATTA" : "MEDLARE SAKNAS",
          })),
          emptyText: "Inga ärenden att komplettera.",
          footnote: "Notifiering kommer via e-post när ett medlingsbeslut klarmarkeras (FE-001)",
        },
      ];

      return {
        ...base,
        panels,
        aiIntro:
          "Ställ frågor om medlarnas historik, statistik per avtalsområde och underlag inför tillsättning.",
        aiSuggestions: [
          "Vilka medlare har erfarenhet av spårtrafik?",
          "Visa uppdrag per medlare 2027",
          "Vilka medlare är aktiva för fast medling?",
        ],
      };
    }

    case "statistics-user": {
      const panels: DashboardPanel[] = [
        {
          kind: "list",
          title: "Sparade sökningar",
          reqTags: ["FR-002"],
          items: [
            { text: "Årsrapport 2026" },
            { text: "Eurofound-urval" },
            { text: "Sifferlösa avtal privat sektor" },
          ],
          footnote: "Sammansatta sökningar över flera handlingstyper – utan hjälpvariabler",
          action: { text: "Öppna sökbyggaren", href: "/sok" },
        },
        {
          kind: "list",
          title: "Bokslut och uttag",
          reqTags: ["FH-003", "FR-004", "FR-013"],
          items: [
            { text: "Bokslut per 2026-12-31 · 143 träffar", badge: "SENAST" },
            { text: "Export till Excel · 2026-12-31" },
            { text: "Export till CSV/JSON · 2026-11-30" },
          ],
          footnote:
            "Bokslut återskapar hur data såg ut vid en viss tidpunkt. Standardsökningar svarar inom 3 sekunder (NFP-003)",
        },
      ];

      return {
        ...base,
        primaryAction: { text: "Ny sökning", href: "/sok" },
        panels,
        aiIntro:
          "Beskriv ditt urval i naturligt språk så föreslår AI villkor, presentationskolumner och export.",
        aiSuggestions: [
          "Alla sifferlösa avtal i privat sektor giltiga 2026-12-31",
          "Jämför löneutrymme mellan Almega-avtal 2025 och 2026",
          "Skapa underlag för Eurofound-rapporten",
        ],
      };
    }

    case "system-admin": {
      const panels: DashboardPanel[] = [
        {
          kind: "list",
          title: "Loggar",
          reqTags: ["NFL-001", "NFL-002", "NFL-004"],
          items: [
            { text: "Ändringslogg · 1 284 poster senaste 30 dagarna" },
            { text: "Händelselogg · 96 poster senaste 30 dagarna" },
            { text: "Inloggningar · 412 poster senaste 30 dagarna" },
          ],
          footnote:
            "Loggar bevaras i minst 24 månader och kan inte ändras eller raderas – inte heller av systemadministratören (NFL-003)",
          action: { text: "Öppna administrationsvyn", href: "/administration" },
        },
        {
          kind: "list",
          title: "Bevakningsord",
          reqTags: ["FAI-004"],
          items: [
            { text: "arbetstidsförkortning", badge: "AKTIVT" },
            { text: "deltidspension", badge: "AKTIVT" },
            { text: "jämställdhetspott", badge: "AKTIVT" },
          ],
          footnote: "Tabellen uppdateras inför kommande avtalsrörelse",
        },
      ];

      return {
        ...base,
        panels,
        aiIntro: "Ställ frågor om loggar, ändringshistorik och systemkonfiguration.",
        aiSuggestions: [
          "Vem ändrade avtal A-002 senast?",
          "Visa inloggningar senaste veckan",
          "Vilka bevakningsord saknas inför avtalsrörelsen?",
        ],
      };
    }

    case "permission-admin": {
      const panels: DashboardPanel[] = [
        {
          kind: "list",
          title: "Användare och roller",
          reqTags: ["NFÅ-005", "NFÅ-003"],
          items: [
            { text: "Anna Andersson · Avtalsadministratör", badge: "AKTIV" },
            { text: "Per Persson · Medlingsadministratör", badge: "AKTIV" },
            { text: "Karin Karlsson · Statistikanvändare", badge: "AKTIV" },
          ],
          footnote:
            "Behörigheter administreras av MI:s egna behörighetsadministratörer utan leverantörens medverkan",
          action: { text: "Öppna administrationsvyn", href: "/administration" },
        },
        {
          kind: "list",
          title: "Att hantera",
          reqTags: ["NFÅ-005"],
          items: [
            { text: "Ny medarbetare finns i Enterprise IAM/SSID – roll ej tilldelad", badge: "ÅTGÄRD" },
          ],
          footnote: "Användare autentiseras med EFOS-kort via Försäkringskassans IdP (SAML 2.0)",
        },
      ];

      return {
        ...base,
        panels,
        aiIntro: "Ställ frågor om roller, behörigheter och användaradministration.",
        aiSuggestions: [
          "Vilka roller finns i MIIS?",
          "Vem har behörighet att sekretessmarkera avtal?",
        ],
      };
    }

    case "public": {
      const panels: DashboardPanel[] = [
        {
          kind: "list",
          title: "Tillgängliga rapporter",
          reqTags: ["FR-011", "NFÅ-006"],
          items: [
            { text: "Avtal – Allmänheten · urval på AGO, ATO och avtal" },
            { text: "Avtalsrörelserapporten · publik version" },
          ],
          footnote:
            "Åtkomst endast från Medlingsinstitutets IP-adress, utan inloggning. Sekretessmarkerad avtalsinformation visas inte (NFÅ-004, D-002)",
        },
      ];

      return {
        ...base,
        heading: "Publik åtkomst – Medlingsinstitutet",
        subheading:
          "Åtkomst från Medlingsinstitutets lokaler via särskild klientdator med IP-spärr, utan inloggning (NFÅ-006).",
        panels,
        aiIntro: "Sök bland de publika rapporterna.",
        aiSuggestions: [
          "Vilka avtal löper ut under 2027?",
          "Visa avtal för Almega Tjänsteförbunden",
        ],
      };
    }

    case "mediator": {
      const panels: DashboardPanel[] = [
        {
          kind: "list",
          title: "Mina medlingsuppdrag",
          reqTags: ["FF-006", "NFÅ-007"],
          items: [
            { text: "M-2027/12 · Spårtrafik – Tågföretagen / Seko · Ettan", badge: "PÅGÅENDE" },
          ],
          emptyText: "Inga aktiva uppdrag.",
          footnote:
            "Extern åtkomst via Bank-ID genom Försäkringskassans identifieringslösning (option, steg 2)",
        },
        {
          kind: "list",
          title: "Underlag",
          reqTags: ["FM-003", "FR-011"],
          items: [
            { text: "Märket 2027–2029 · kostnadsram 6,4 %" },
            { text: "Protokoll och avtalsutskrifter utan sekretessmarkerad information" },
          ],
        },
      ];

      return {
        ...base,
        panels,
        aiIntro: "Ställ frågor om ditt medlingsuppdrag och gällande märke.",
        aiSuggestions: ["Vad är märket för perioden?", "Vilka avtal omfattas av mitt uppdrag?"],
      };
    }
  }
}
