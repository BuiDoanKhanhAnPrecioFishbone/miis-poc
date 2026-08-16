/**
 * FS-001 – the role-adapted start page — THE SEAM.
 *
 * "The information shall be adapted to the different roles in the system; for
 * example, a mediation administrator shall see ongoing mediations."
 *
 * Week 1 reads from lib/mock/. Week 2 talks to Supabase; no page changes.
 */

import { parterKort } from "@/lib/domain/avtal";
import { arendenummer, MEDLINGSTYP_ETIKETT } from "@/lib/domain/medling";
import { rollInfo, type Roll } from "@/lib/domain/roll";
import type { StartPanel, Startsida } from "@/lib/domain/startsida";
import { listOfullstandigaAvtal, listSenasteAvtal } from "./avtal";
import { antalPaminnelser, listHandelser, listPaminnelser } from "./handelser";
import { getGallandeMarke } from "./marke";
import { listMedlare, listMedlingsarenden } from "./medling";

export async function getStartsida(roll: Roll): Promise<Startsida> {
  const info = rollInfo(roll);
  const marke = await getGallandeMarke();

  const bas = {
    roll: info,
    rubrik: `Startsida – ${info.etikett}`,
    underrubrik:
      "Rollanpassat innehåll enligt tilldelad roll och behörighet (FS-001, NFÅ-003). Inloggad via EFOS-kort, session avslutas efter 30 min inaktivitet (NFÅ-001, NFÅ-002).",
    marke,
  };

  switch (roll) {
    case "avtalsadministrator": {
      const [paminnelser, antal, ofullstandiga, senaste, handelser] = await Promise.all([
        listPaminnelser(),
        antalPaminnelser(),
        listOfullstandigaAvtal(),
        listSenasteAvtal(),
        listHandelser(2),
      ]);

      const paneler: StartPanel[] = [
        {
          sort: "paminnelser",
          titel: "Mina påminnelser",
          reqTaggar: ["FA-022"],
          poster: paminnelser,
          fotnot: "Påminnelser skickas även som e-post med länk till avtalet",
          knapp: { text: `Visa alla (${antal})` },
        },
        {
          sort: "lista",
          titel: "Ofullständiga registreringar",
          reqTaggar: ["FA-021"],
          // Registrations still awaiting information come first — those are the
          // ones an agreement administrator has to chase (US-04).
          poster: ofullstandiga
            .slice()
            .sort((a, b) => Number(Boolean(a.teckningsdatum)) - Number(Boolean(b.teckningsdatum)))
            .slice(0, 3)
            .map((a) => ({
              text: `${a.namn} – ${parterKort(a)}`,
              badge: "OFULLSTÄNDIG",
            })),
          fotnot:
            "Visas i Konjunkturlönerapportens vy med statuskolumn (registrerat / delvis registrerat), protokollslänk och vilka avtal som redan exporterats",
          knapp: { text: "Öppna Konjunkturlönerapportens vy", reqTag: "FR-008" },
        },
        {
          sort: "avtalstabell",
          titel: "Senast registrerade avtal",
          reqTaggar: ["FR-012"],
          rader: senaste,
        },
        {
          sort: "handelser",
          titel: "Senaste händelser",
          reqTaggar: ["FH-002"],
          poster: handelser,
          fotnot: "Ur händelseloggen – fullständig logg under Administration",
        },
      ];

      return {
        ...bas,
        primarAtgard: { text: "+ Ladda upp avtalsprotokoll", href: "/registrera" },
        paneler,
        aiIntro:
          "Ställ frågor om påminnelser, ofullständiga registreringar och senast registrerade avtal – som komplement till vyerna på startsidan.",
        aiForslag: [
          "Vilka avtal löper ut inom 90 dagar?",
          "Sammanfatta mina ofullständiga registreringar",
          "Vad innebär märket 2027–2029 för mina avtal?",
          "Visa händelser kopplade till medling senaste månaden",
        ],
      };
    }

    case "medlingsadministrator": {
      const [arenden, handelser] = await Promise.all([listMedlingsarenden(), listHandelser(2)]);
      const pagaende = arenden.filter((a) => a.status === "Pågående");

      const paneler: StartPanel[] = [
        {
          sort: "lista",
          titel: "Pågående medlingar",
          reqTaggar: ["FF-006", "FS-001"],
          poster: pagaende.map((a) => ({
            text: `${arendenummer(a.id)} · ${a.namn} · ${MEDLINGSTYP_ETIKETT[a.typ]}`,
            badge: "PÅGÅENDE",
          })),
          fotnot: "Medlingsärenden skapas automatiskt när ett GD-beslut laddas upp",
          knapp: { text: "Öppna medlingsärenden", href: "/medling" },
        },
        {
          sort: "lista",
          titel: "GD-beslut att slutföra",
          reqTaggar: ["FSD-001", "FE-001"],
          poster: pagaende.map((a) => ({
            text: `${a.gdBeslut.nummer} · ${a.namn}`,
            badge: "EJ KLARMARKERAT",
          })),
          fotnot:
            "Vid klarmarkering skickas notifierings-epost med länk till medlaradministratören och sändningen loggas",
        },
        {
          sort: "lista",
          titel: "Kommande partsträffar",
          reqTaggar: ["FF-004"],
          poster: [
            { text: "2027-06-04 · Almega Tjänsteförbunden – inför avtalsrörelsen" },
            { text: "2027-06-11 · IF Metall – samordnade avtalskrav" },
          ],
          fotnot: "Interaktiv vy för att föra in information direkt under mötet",
          knapp: { text: "Öppna partsträffar", href: "/partstraffar" },
        },
        {
          sort: "handelser",
          titel: "Senaste händelser",
          reqTaggar: ["FH-002"],
          poster: handelser,
          fotnot: "Ur händelseloggen – fullständig logg under Administration",
        },
      ];

      return {
        ...bas,
        primarAtgard: { text: "+ Ladda upp GD-beslut", href: "/medling" },
        paneler,
        aiIntro:
          "Ställ frågor om pågående medlingar, berörda avtal, spridningsrisker och tidigare medlingar på avtalsområdet.",
        aiForslag: [
          "Vilka avtal berörs av M-2027/12?",
          "Finns spridningsrisk till närliggande avtalsområden?",
          "Vilka avtal omfattas av förhandlingsordningsavtal?",
          "Sammanfatta tidigare medlingar inom spårtrafik",
        ],
      };
    }

    case "medlaradministrator": {
      const medlare = await listMedlare();
      const paneler: StartPanel[] = [
        {
          sort: "lista",
          titel: "Medlarregister",
          reqTaggar: ["FF-009"],
          poster: medlare.map((m) => ({
            text: `${m.namn} · ${m.typer.map((t) => MEDLINGSTYP_ETIKETT[t]).join(", ")} · ${m.historik.length} uppdrag`,
            badge: m.aktiv ? "AKTIV" : "INAKTIV",
          })),
          fotnot:
            "Statistik per medlare (år/avtalsområde) visas som beslutsstöd inför tillsättning",
          knapp: { text: "Öppna medlarregistret", href: "/medlare" },
        },
        {
          sort: "lista",
          titel: "Ärenden att komplettera med medlare",
          reqTaggar: ["FE-001", "FF-009"],
          poster: [
            { text: "M-2027/12 · Spårtrafik – Tågföretagen / Seko", badge: "MEDLARE TILLSATTA" },
            { text: "M-2027/09 · Hemserviceföretag – Almega / Kommunal", badge: "KLAR" },
          ],
          fotnot:
            "Notifiering kommer via e-post när ett medlingsbeslut klarmarkeras (FE-001)",
        },
      ];

      return {
        ...bas,
        paneler,
        aiIntro:
          "Ställ frågor om medlarnas historik, statistik per avtalsområde och underlag inför tillsättning.",
        aiForslag: [
          "Vilka medlare har erfarenhet av spårtrafik?",
          "Visa uppdrag per medlare 2027",
          "Vilka medlare är aktiva för fast medling?",
        ],
      };
    }

    case "statistikanvandare": {
      const paneler: StartPanel[] = [
        {
          sort: "lista",
          titel: "Sparade sökningar",
          reqTaggar: ["FR-002"],
          poster: [
            { text: "Årsrapport 2026" },
            { text: "Eurofound-urval" },
            { text: "Sifferlösa avtal privat sektor" },
          ],
          fotnot: "Sammansatta sökningar över flera handlingstyper – utan hjälpvariabler",
          knapp: { text: "Öppna sökbyggaren", href: "/sok" },
        },
        {
          sort: "lista",
          titel: "Bokslut och uttag",
          reqTaggar: ["FH-003", "FR-004", "FR-013"],
          poster: [
            { text: "Bokslut per 2026-12-31 · 143 träffar", badge: "SENAST" },
            { text: "Export till Excel · 2026-12-31" },
            { text: "Export till CSV/JSON · 2026-11-30" },
          ],
          fotnot:
            "Bokslut återskapar hur data såg ut vid en viss tidpunkt. Standardsökningar svarar inom 3 sekunder (NFP-003)",
        },
      ];

      return {
        ...bas,
        primarAtgard: { text: "Ny sökning", href: "/sok" },
        paneler,
        aiIntro:
          "Beskriv ditt urval i naturligt språk så föreslår AI villkor, presentationskolumner och export.",
        aiForslag: [
          "Alla sifferlösa avtal i privat sektor giltiga 2026-12-31",
          "Jämför löneutrymme mellan Almega-avtal 2025 och 2026",
          "Skapa underlag för Eurofound-rapporten",
        ],
      };
    }

    case "systemadministrator": {
      const paneler: StartPanel[] = [
        {
          sort: "lista",
          titel: "Loggar",
          reqTaggar: ["NFL-001", "NFL-002", "NFL-004"],
          poster: [
            { text: "Ändringslogg · 1 284 poster senaste 30 dagarna" },
            { text: "Händelselogg · 96 poster senaste 30 dagarna" },
            { text: "Inloggningar · 412 poster senaste 30 dagarna" },
          ],
          fotnot:
            "Loggar bevaras i minst 24 månader och kan inte ändras eller raderas – inte heller av systemadministratören (NFL-003)",
          knapp: { text: "Öppna administrationsvyn", href: "/administration" },
        },
        {
          sort: "lista",
          titel: "Bevakningsord",
          reqTaggar: ["FAI-004"],
          poster: [
            { text: "arbetstidsförkortning", badge: "AKTIVT" },
            { text: "deltidspension", badge: "AKTIVT" },
            { text: "jämställdhetspott", badge: "AKTIVT" },
          ],
          fotnot: "Tabellen uppdateras inför kommande avtalsrörelse",
        },
      ];

      return {
        ...bas,
        paneler,
        aiIntro: "Ställ frågor om loggar, ändringshistorik och systemkonfiguration.",
        aiForslag: [
          "Vem ändrade avtal A-002 senast?",
          "Visa inloggningar senaste veckan",
          "Vilka bevakningsord saknas inför avtalsrörelsen?",
        ],
      };
    }

    case "behorighetsadministrator": {
      const paneler: StartPanel[] = [
        {
          sort: "lista",
          titel: "Användare och roller",
          reqTaggar: ["NFÅ-005", "NFÅ-003"],
          poster: [
            { text: "Anna Andersson · Avtalsadministratör", badge: "AKTIV" },
            { text: "Per Persson · Medlingsadministratör", badge: "AKTIV" },
            { text: "Karin Karlsson · Statistikanvändare", badge: "AKTIV" },
          ],
          fotnot:
            "Behörigheter administreras av MI:s egna behörighetsadministratörer utan leverantörens medverkan",
          knapp: { text: "Öppna administrationsvyn", href: "/administration" },
        },
        {
          sort: "lista",
          titel: "Att hantera",
          reqTaggar: ["NFÅ-005"],
          poster: [
            { text: "Ny medarbetare finns i Enterprise IAM/SSID – roll ej tilldelad", badge: "ÅTGÄRD" },
          ],
          fotnot: "Användare autentiseras med EFOS-kort via Försäkringskassans IdP (SAML 2.0)",
        },
      ];

      return {
        ...bas,
        paneler,
        aiIntro: "Ställ frågor om roller, behörigheter och användaradministration.",
        aiForslag: ["Vilka roller finns i MIIS?", "Vem har behörighet att sekretessmarkera avtal?"],
      };
    }

    case "publik": {
      const paneler: StartPanel[] = [
        {
          sort: "lista",
          titel: "Tillgängliga rapporter",
          reqTaggar: ["FR-011", "NFÅ-006"],
          poster: [
            { text: "Avtal – Allmänheten · urval på AGO, ATO och avtal" },
            { text: "Avtalsrörelserapporten · publik version" },
          ],
          fotnot:
            "Åtkomst endast från Medlingsinstitutets IP-adress, utan inloggning. Sekretessmarkerad avtalsinformation visas inte (NFÅ-004, D-002)",
        },
      ];

      return {
        ...bas,
        rubrik: "Publik åtkomst – Medlingsinstitutet",
        underrubrik:
          "Åtkomst från Medlingsinstitutets lokaler via särskild klientdator med IP-spärr, utan inloggning (NFÅ-006).",
        paneler,
        aiIntro: "Sök bland de publika rapporterna.",
        aiForslag: ["Vilka avtal löper ut under 2027?", "Visa avtal för Almega Tjänsteförbunden"],
      };
    }

    case "medlare": {
      const paneler: StartPanel[] = [
        {
          sort: "lista",
          titel: "Mina medlingsuppdrag",
          reqTaggar: ["FF-006", "NFÅ-007"],
          poster: [
            { text: "M-2027/12 · Spårtrafik – Tågföretagen / Seko · Ettan", badge: "PÅGÅENDE" },
          ],
          fotnot:
            "Extern åtkomst via Bank-ID genom Försäkringskassans identifieringslösning (option, steg 2)",
        },
        {
          sort: "lista",
          titel: "Underlag",
          reqTaggar: ["FM-003", "FR-011"],
          poster: [
            { text: "Märket 2027–2029 · kostnadsram 6,4 %" },
            { text: "Protokoll och avtalsutskrifter utan sekretessmarkerad information" },
          ],
        },
      ];

      return {
        ...bas,
        paneler,
        aiIntro: "Ställ frågor om ditt medlingsuppdrag och gällande märke.",
        aiForslag: ["Vad är märket för perioden?", "Vilka avtal omfattas av mitt uppdrag?"],
      };
    }
  }
}
