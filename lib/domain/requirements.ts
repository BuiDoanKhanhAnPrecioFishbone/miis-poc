/**
 * Requirement ID → the sentence the requirement actually says.
 *
 * `ReqTag` reads this for its tooltip. An evaluator tracing requirement →
 * interface can then verify a tag by hovering it, instead of holding the
 * specification open in a second window — which is the whole point of putting
 * the IDs on screen.
 *
 * The English text is condensed from `docs/requirements/requirements-v2.5-EN.txt`
 * (the working translation); the Swedish is the same requirement in the language
 * the system is delivered in. Keep both faithful — a tooltip that overstates a
 * requirement is worse than no tooltip.
 *
 * Add the sentence whenever you add a tag. An unknown ID still renders; it just
 * has nothing to explain itself with.
 *
 * Identifiers are English; user-facing strings exist in both languages.
 * Pure domain — no imports beyond sibling types, no I/O.
 */

import type { Text } from "./lang";

export const REQUIREMENTS: Record<string, Text> = {
  // Epic F1 – start page
  "FS-001": {
    sv: "Startsida med information som är relevant för användaren, anpassad efter rollerna i systemet – en medlingsadministratör ska t.ex. se pågående medlingar.",
    en: "A start page showing information relevant to the user, adapted to the roles in the system — a mediation administrator shall, for example, see ongoing mediations.",
  },

  // Epic F2 – agreement registration and management
  "FA-001": {
    sv: "Registrering av avtalsområde och avtal som övergripande enhet med avtalsnamn, alternativt avtalsnamn, avtalsparter och avtalstyp.",
    en: "Registration of agreement area and agreement as an overarching entity with agreement name, alternative name, parties and agreement type.",
  },
  "FA-002": {
    sv: "Registrering av löneavtal – en ny rad per avtalsrörelse och period.",
    en: "Registration of wage agreements — one new row per bargaining round and period.",
  },
  "FA-003": {
    sv: "Registrering av allmänna anställningsvillkor.",
    en: "Registration of general terms and conditions of employment.",
  },
  "FA-004": {
    sv: "Hantering av separata löptider för löneavtal respektive allmänna villkor inom samma avtalsuppgörelse.",
    en: "Handling of separate validity periods for wage agreements and general terms within the same agreement settlement.",
  },
  "FA-005": {
    sv: "Registrering av försäkringsinformation.",
    en: "Registration of insurance information.",
  },
  "FA-006": {
    sv: "Registrering av övriga avtal, t.ex. förhandlingsordningsavtal.",
    en: "Registration of other agreements, e.g. negotiation procedure agreements.",
  },
  "FA-007": {
    sv: "Registrering av löneavtalets konstruktion: generell höjning, lönepott, individuell förhandling m.fl.",
    en: "Registration of the wage agreement construction: general increase, wage pot, individual negotiation and others.",
  },
  "FA-008": {
    sv: "Registrering av löneutrymme och kostnadsram.",
    en: "Registration of wage increase scope and cost frame.",
  },
  "FA-009": {
    sv: "Registrering av arbetstidsförkortning och dess kostnad.",
    en: "Registration of working time reduction and its cost.",
  },
  "FA-010": {
    sv: "Registrering av individgarantier.",
    en: "Registration of individual guarantees.",
  },
  "FA-011": {
    sv: "Jämställdhetsflagga per avtal.",
    en: "Gender equality flag per agreement.",
  },
  "FA-012": {
    sv: "Registrering av industrimärkesflagga – vilka avtal som ingår i de märkessättande industriavtalen.",
    en: "Registration of the industry benchmark flag — which agreements are part of the norm-setting industry agreements.",
  },
  "FA-013": {
    sv: "Registrering av lägstalöner grupperade per yrkesgrupp med revisionsdatum.",
    en: "Registration of minimum wages grouped by occupational group with revision date.",
  },
  /*
    Present in MI's Bilaga 1 chapter 5 but absent from our English rendering,
    found by the chapter 5 diff on 2026-08-18. FA-014 is a Stage 1 Ska-krav;
    the other four are the Steg 2 requirements MI defers itself.
  */
  "FA-014": {
    sv: "Registrering av arbetsgrupper med frågeområden.",
    en: "Registration of working groups with subject areas.",
  },
  "FA-023": {
    sv: "Full registrering av pensionsavtal inklusive upp till tre pensionssystem med lönegränser och premier.",
    en: "Full registration of pension agreements including up to three pension systems with wage thresholds and premiums.",
  },
  "FA-024": {
    sv: "Registrering av försäkringsinformation (källa, sjukdom, arbetsskada, föräldraskap, dödsfall, omställning, annan).",
    en: "Registration of insurance information (source, sickness, occupational injury, parenthood, death, transition, other).",
  },
  "FR-009": {
    sv: "Rapporter för Medlingsinstitutets hemsida.",
    en: "Reports for the Mediation Office website.",
  },
  "FR-010": {
    sv: "Rapporter för Eurofound och Minimilön.",
    en: "Reports for Eurofound and Minimum Wage.",
  },
  "FA-015": {
    sv: "Registrering av avtal som löper ut och inte förnyas.",
    en: "Registration of agreements that expire and are not renewed.",
  },
  "FA-016": {
    sv: "Registrering av förtida uppsägning.",
    en: "Registration of early termination.",
  },
  "FA-017": {
    sv: "Registrering av medling i parternas egen regi, via förhandlingsordningsavtal.",
    en: "Registration of mediation under the parties' own procedure, via negotiation procedure agreements.",
  },
  "FA-018": {
    sv: "Hantering av protokoll där avtalsnamnet inte framgår.",
    en: "Handling of protocols where the agreement name is not stated.",
  },
  "FA-019": {
    sv: "Användaren ska kunna söka efter avtal med vissa egenskaper.",
    en: "The user shall be able to search for agreements with certain properties.",
  },
  "FA-020": {
    sv: "Visa ett avtal med tillhörande löneavtal och allmänna villkor som var giltiga vid en viss tidpunkt.",
    en: "Display an agreement with its associated wage agreements and general terms valid at a given point in time.",
  },
  "FA-021": {
    sv: "Stöd för ofullständig registrering av avtal – registreringsstatus Ofullständig respektive Klar.",
    en: "Support for incomplete registration of agreements — registration status Incomplete versus Complete.",
  },
  "FA-022": {
    sv: "Markering av påminnelse om att uppdatera ett avtal ett visst datum.",
    en: "Marking of a reminder to update an agreement on a given date.",
  },
  "FA-025": {
    sv: "Steg 2: visa ett avtalsområde och avtal med tillhörande löneavtal, allmänna villkor och övriga avtal giltiga vid en viss tidpunkt.",
    en: "Stage 2: display an agreement area and agreement with associated wage agreements, general terms and other agreements valid at a given point in time.",
  },

  // Epic F3 – party management
  "FP-001": {
    sv: "Register över arbetsgivarorganisationer (AGO) med namnbyteshistorik. AGO kopplas till sektor och arbetsgivargrupp; AGO inom Svenskt Näringsliv kopplas till branschkod.",
    en: "Register of employer organisations (AGO) with name-change history. AGOs are linked to sector and employer group; AGOs within the Confederation of Swedish Enterprise carry an industry code.",
  },
  "FP-002": {
    sv: "Register över arbetstagarorganisationer (ATO) med historik över namnbyten och organisationsförändringar.",
    en: "Register of employee organisations (ATO) with history of name changes and organisational changes.",
  },
  "FP-003": {
    sv: "Register över samverkansorgan med kopplingar till AGO och ATO samt tidsperiod.",
    en: "Register of cooperation bodies with links to AGO and ATO and a time period.",
  },
  "FP-004": {
    sv: "Namnbyte på part görs på ett ställe och slår automatiskt igenom på alla aktuella avtal. Namnbyten ska inte slå igenom på historiska avtal.",
    en: "A party name change is made in one place and automatically propagates to all current agreements. Name changes shall not propagate to historical agreements.",
  },
  "FP-005": {
    sv: "Användaren ska kunna söka efter parter med vissa egenskaper.",
    en: "The user shall be able to search for parties with certain properties.",
  },
  "FP-006": {
    sv: "Koppling av kontaktpersoner – namn, titel, telefon och e-post – för både AGO och ATO.",
    en: "Linking of contact persons — name, title, phone and e-mail — for both AGO and ATO.",
  },

  // Epic F4 – document management
  "FD-001": {
    sv: "Uppladdning och hantering av dokument kopplade till avtal (protokoll, avtal, övriga dokument), GD-beslut om medling, medlarrapporter och partsträffsdokumentation.",
    en: "Upload and management of documents linked to agreements (protocols, agreements, other documents), Director-General mediation decisions, mediator reports and party meeting documentation.",
  },

  // Epic F5 – event and change log
  "FH-001": {
    sv: "Ändringslogg som registrerar vilken information som ändrats, av vem och när.",
    en: "A change log recording what information was changed, by whom and when.",
  },
  "FH-002": {
    sv: "Händelselogg för övergripande händelser kopplade till ett avtal, t.ex. ”medling startar” och ”avtal tecknat”.",
    en: "An event log for high-level events linked to an agreement, e.g. “mediation starts” and “agreement signed”.",
  },
  "FH-003": {
    sv: "Bokslut – återskapa hur data såg ut ett visst datum, t.ex. den 31 december ett givet år.",
    en: "Snapshot (bokslut) — reconstruct how the data looked on a specific date, e.g. 31 December of a given year.",
  },

  // Epic F6 – search, export and reporting
  "FR-001": {
    sv: "Sökning på alla nyckelbegrepp med relevanta sökfilter, både i urval och i dokument.",
    en: "Search on all key concepts with relevant search filters, both in selections and in documents.",
  },
  "FR-002": {
    sv: "Sökbyggare: val av informationstyp, flexibel filtrering på alla relevanta egenskaper kombinerbara med och/eller, val av presentationskolumner och möjlighet att spara sökningar.",
    en: "Query builder: choice of information type, flexible filtering on all relevant properties combinable with and/or, choice of presentation columns and the ability to save searches.",
  },
  "FR-003": {
    sv: "Fritextsökning i uppladdade dokument och i urval.",
    en: "Free-text search in uploaded documents and in selections.",
  },
  "FR-004": { sv: "Export till Excel.", en: "Export to Excel." },
  "FR-005": {
    sv: "Rapportgenerator som stödjer minst Word, Excel och PDF.",
    en: "Report generator supporting at least Word, Excel and PDF.",
  },
  "FR-006": {
    sv: "Generera Avtalsrörelserapporten – prioriterad befintlig rapport.",
    en: "Generate the Bargaining Round Report (Avtalsrörelserapporten) — a prioritised existing report.",
  },
  "FR-007": {
    sv: "Generera rapporten Avtalskonstruktioner – prioriterad befintlig rapport.",
    en: "Generate the Agreement Constructions report — a prioritised existing report.",
  },
  "FR-008": {
    sv: "Generera Konjunkturlönerapporten. Skrivs ut från en vy som listar bevakade avtal med statuskolumn (registrerat / delvis registrerat), länk till protokollet även när registreringen är ofullständig, och spårning av vilka avtal som tidigare exporterats till rapporten.",
    en: "Generate the Short-Term Wage Report (Konjunkturlönerapporten). Printed from a view listing monitored agreements with a status column (registered / partially registered), a link to the protocol even when registration is incomplete, and tracking of which agreements have previously been exported.",
  },
  "FR-011": {
    sv: "Utlämning av protokoll och avtalsutskrifter utan sekretessmarkerad avtalsinformation, till medlare och allmänhet.",
    en: "Release of protocols and agreement prints without confidentiality-marked agreement information, for mediators and the public.",
  },
  "FR-012": {
    sv: "Färgkodning av avtalsstatus: nytecknade avtal utan medling gröna, avtal tecknade efter medling röda, kvarstående avtal blå men röda vid koppling till medling.",
    en: "Colour coding of agreement status: newly signed agreements without mediation green, agreements signed after mediation red, remaining agreements blue but marked red when linked to mediation.",
  },
  "FR-013": {
    sv: "Export i strukturerade format, t.ex. CSV och JSON, för statistiska ändamål.",
    en: "Export in structured formats, e.g. CSV and JSON, for statistical purposes.",
  },
  "FR-014": {
    sv: "Schemalagda rapportuttag.",
    en: "Scheduled report extracts.",
  },

  // Epic F7 – create documents
  "FSD-001": {
    sv: "Skapa GD-beslut om medling från dokumentmallar – en variant med varsel och en utan.",
    en: "Create Director-General mediation decisions from document templates — one variant with an industrial action notice and one without.",
  },
  "FSD-002": {
    sv: "Skapa partsträffsdokument från dokumentmall.",
    en: "Create party meeting documents from a document template.",
  },

  // Epic F8 – AI functionality
  "FAI-001": {
    sv: "Vid avtalsregistrering ska systemet kunna föreslå extrahering av nyckelinformation som löptid, parter och löneutrymme ur ett uppladdat protokoll med AI-stöd.",
    en: "When registering agreements, the system shall be able to propose extraction of key information such as validity period, parties and wage increase scope from an uploaded protocol using AI support.",
  },
  "FAI-002": {
    sv: "AI-förslag ska alltid kräva manuell granskning och godkännande av handläggare innan de sparas. Ingenting får ske automatiskt.",
    en: "AI proposals shall always require manual review and approval by a case officer before being saved. Nothing shall be done automatically.",
  },
  "FAI-003": {
    sv: "OCR-tolkning av inskannade dokument.",
    en: "OCR interpretation of scanned documents.",
  },
  "FAI-004": {
    sv: "Funktion för att markera och extrahera bevakningsord ur dokument. Tabellen är fördefinierad och anpassningsbar enligt Bilaga 1 §4.1.",
    en: "Functionality to highlight and extract watchwords from documents. The table is predefined and customisable per Bilaga 1 §4.1.",
  },

  // Epic F9 – negotiation and mediation management
  "FF-001": {
    sv: "Registrering av förhandlingar, antingen kopplade till avtal eller fristående.",
    en: "Registration of negotiations, either linked to agreements or standalone.",
  },
  "FF-002": {
    sv: "Förhandlingar som leder till avtal kopplas till det nytecknade avtalet via protokollsuppladdningen.",
    en: "Negotiations that lead to an agreement are linked to the newly signed agreement via the protocol upload.",
  },
  "FF-003": {
    sv: "Förhandlingar som inte leder till avtal ska kunna markeras som avslutade med angiven status, manuellt eller automatiskt.",
    en: "Negotiations that do not lead to an agreement shall be markable as closed with a given status, manually or automatically.",
  },
  "FF-004": {
    sv: "Registrering och utskrift av partsträffsinformation – före och efter mötet, samt en interaktiv vy för att föra in information direkt under mötet.",
    en: "Registration and printout of party meeting information — before and after a meeting, plus an interactive view for entering information directly during the meeting.",
  },
  "FF-005": {
    sv: "Registrering av samordnade avtalskrav med flagga för samordnat eller eget förbund, kopplingar till de förbund som står bakom kravet, och möjlighet att lagra kopplade dokument.",
    en: "Registration of coordinated bargaining demands with a coordinated/own-union flag, links to the unions backing the demand, and the ability to store linked documents.",
  },
  "FF-006": {
    sv: "Hantering av medlingsinformation för både särskild medling (förbundsförhandlingar med GD-beslut) och fast medling (lokala tvister, förenklat formulär). Systemet ska visa om ett avtal omfattas av förhandlingsordningsavtal.",
    en: "Handling of mediation information for both special mediations (union-level negotiations with a Director-General decision) and standing mediations (local disputes, simplified form). The system shall show whether an agreement is covered by a negotiation procedure agreement.",
  },
  "FF-007": {
    sv: "Möjlighet att ange diarienummer i ett eget fält när ett medlingsärende kopplas till ett ärende i diariesystemet.",
    en: "Ability to enter a registry number in a dedicated field when a mediation case is linked to a case in the registry system.",
  },
  "FF-008": {
    sv: "Ett medlingsärende ska kunna kopplas till flera avtal.",
    en: "A mediation case shall be linkable to several agreements.",
  },
  "FF-009": {
    sv: "Medlarregister med kontaktuppgifter, typ av medling, statistik per medlare (år och avtalsområde) och historik inklusive position ettan eller tvåan.",
    en: "Mediator register with contact details, type of mediation, statistics per mediator (year and agreement area) and history including position, first or second chair.",
  },
  "FF-010": {
    sv: "Registrera och visa medlingsresultat med fält för typ av medling, stridsåtgärder, förlorade arbetsdagar, antal berörda anställda och typ av stridsåtgärd.",
    en: "Register and display mediation outcomes with fields for type of mediation, industrial action, lost working days, number of affected employees and type of industrial action.",
  },

  // Epic F10 – Märket
  "FM-001": {
    sv: "Registrera Märket som en periodiserad inställning med fritext för kostnadsram, periodisering och tilläggsöverenskommelser.",
    en: "Register Märket (the industry benchmark) as a periodised setting with free text for cost frame, periodisation and supplementary agreements.",
  },
  "FM-002": {
    sv: "Larm när ett nytt avtalsprotokoll för Industriavtalet registreras för en period utan märkesdefinition.",
    en: "Alert when a new agreement protocol for the Industry Agreement is registered for a period without a benchmark definition.",
  },
  "FM-003": {
    sv: "Information om Märket ska visas i relevanta vyer i systemet, inklusive medlarvyn.",
    en: "Information about the benchmark shall be displayed in relevant views in the system, including the mediator view.",
  },

  // Epic F11 – e-mail
  "FE-001": {
    sv: "Skicka notifieringar och påminnelser via e-post, t.ex. till medlaradministratören när ett medlingsbeslut klarmarkerats och till avtalsadministratören när en påminnelse satts.",
    en: "Send notifications and reminders via e-mail, e.g. to the mediator administrator when a mediation decision is finalised and to the agreement administrator when a reminder has been set.",
  },
  "FE-002": {
    sv: "E-post från systemet får innehålla information – meddelandetext eller bifogade dokument – samt en länk in i systemet för att öppna ett avtal eller ett medlingsärende.",
    en: "E-mails from the system may contain information — message text or attached documents — as well as a link into the system to open an agreement or a mediation case.",
  },
  "FE-003": {
    sv: "Skickad e-post ska loggas i händelseloggen.",
    en: "Sent e-mails shall be logged in the event log.",
  },

  // Non-functional
  "NFP-002": {
    sv: "Rapporter ska genereras inom rimlig tid. Ingen rapport får ”hänga sig” på grund av datamängd.",
    en: "Reports shall be generated within reasonable time. No report shall hang due to data volume.",
  },
  "NFP-003": {
    sv: "Sökning ska ge resultat inom 3 sekunder för standardsökningar.",
    en: "Search shall return results within 3 seconds for standard searches.",
  },
  "NFÅ-001": {
    sv: "Autentisering via federerad identitetslösning baserad på SAML 2.0 genom Försäkringskassans IdP (EFOS-kort).",
    en: "Authentication via a federated identity solution based on SAML 2.0 through Försäkringskassan's IdP (EFOS cards).",
  },
  "NFÅ-002": {
    sv: "Inaktiva sessioner avslutas automatiskt efter en konfigurerbar tidsgräns, som standard högst 30 minuters inaktivitet.",
    en: "Inactive sessions are terminated automatically after a configurable time limit, by default a maximum of 30 minutes of inactivity.",
  },
  "NFÅ-003": {
    sv: "Rollbaserad behörighetsstyrning så att användargrupper bara kan se och ändra information de är behöriga till, enligt rollbeskrivningarna i bilaga 1 avsnitt 3.",
    en: "Role-based access control so that user groups can only view and change information they are authorised for, per the role descriptions in Appendix 1 section 3.",
  },
  "NFÅ-004": {
    sv: "Sekretessmarkerad avtalsinformation ska inte visas för obehöriga användare – medlare och allmänhet.",
    en: "Confidentiality-marked agreement information shall not be shown to unauthorised users — mediators and the public.",
  },
  "NFÅ-005": {
    sv: "Behörigheter ska kunna administreras av MI:s egna behörighetsadministratörer utan leverantörens medverkan.",
    en: "Permissions shall be administrable by MI's own permission administrators without supplier involvement.",
  },
  "NFÅ-006": {
    sv: "Publik åtkomst begränsas till Medlingsinstitutets IP-adress – särskild klientdator, IP-spärr, utan inloggning.",
    en: "Public access is restricted to the Mediation Office's IP address — a dedicated client computer, IP allow-listing, no login.",
  },
  "NFÅ-007": {
    sv: "Externa användare, medlare, ska autentiseras via Bank-ID eller liknande genom Försäkringskassans identifieringslösning (option, steg 2).",
    en: "External users, mediators, shall be authenticated via Bank-ID or similar through Försäkringskassan's identification solution (option, stage 2).",
  },
  "NFL-001": {
    sv: "Logga alla in- och utloggningar med tidsstämpel och användar-id.",
    en: "Log all logins and logouts with timestamp and user ID.",
  },
  "NFL-002": {
    sv: "Logga alla skapanden, ändringar och raderingar av data, inklusive vem, när och vad som ändrades – gammalt och nytt värde.",
    en: "Log all creations, changes and deletions of data, including who, when, and what was changed — old and new value.",
  },
  "NFL-003": {
    sv: "Loggar bevaras i minst 24 månader och kan inte ändras eller raderas av vanliga användare eller systemadministratörer.",
    en: "Logs are retained for at least 24 months and cannot be changed or deleted by regular users or system administrators.",
  },
  "NFL-004": {
    sv: "MI ska ha åtkomst till loggarna via ett administrativt gränssnitt eller en exportfunktion utan att kontakta leverantören.",
    en: "MI shall have access to the logs via an administrative interface or export function without needing to contact the supplier.",
  },
  "NFUI-002": { sv: "Responsivt användargränssnitt.", en: "Responsive user interface." },
  "NFUI-003": {
    sv: "Tillgänglighet enligt WCAG 2.1 nivå AA.",
    en: "Accessibility per WCAG 2.1 level AA.",
  },

  // Data and confidentiality
  "D-001": {
    sv: "Sekretessmarkering av avtal som innehåller känslig information. Sätts av avtalsadministratören och gäller främst bifogade dokument.",
    en: "Confidentiality marking of agreements containing sensitive information. Set by the agreement administrator; applies primarily to attached documents.",
  },
  "D-002": {
    sv: "Detaljerad information i sekretessmarkerade avtal visas inte för obehöriga användare eller i publika rapporter, men ingår i statistiken.",
    en: "Detailed information in confidentiality-marked agreements is not shown to unauthorised users or in public reports, but is included in statistics.",
  },
  "D-004": {
    sv: "Gallring av personuppgifter enligt MI:s bevarandrutiner, inklusive möjlighet att definiera automatiska gallringsregler.",
    en: "Deletion of personal data per MI's retention routines, including the ability to define automatic deletion rules.",
  },

  // Appendix 1 sections referenced directly by a view
  "§4.1": {
    sv: "Bilaga 1 §4.1 – beslutsstöd i medlingsärendet: övriga parter på avtalsområdet, tidigare medlingar och spridningsrisk.",
    en: "Appendix 1 §4.1 — decision support on the mediation case: other parties in the agreement area, previous mediations and contagion risk.",
  },
  "§4.2": {
    sv: "Bilaga 1 §4.2 – datamodellen för avtal, löneavtal, allmänna villkor och undergrupper.",
    en: "Appendix 1 §4.2 — the data model for agreements, wage agreements, general terms and subgroups.",
  },
};

/** The requirement sentence for a tag, if there is one. */
export function requirementText(id: string, lang: keyof Text): string | undefined {
  return REQUIREMENTS[id]?.[lang];
}
