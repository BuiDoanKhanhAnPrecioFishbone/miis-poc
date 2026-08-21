/**
 * The reviewer's guided walkthrough — the scored criterion, in the order it is
 * scored.
 *
 * The criterion names **three** roles: System Administrator, Agreement
 * Administrator/Case Officer, and The Public Access Computer. The prototype
 * implements all eight §3.1 defines, which is right — NFÅ-003 is a requirement
 * about the system — but an evaluator opening the deployed URL cold used to
 * land on a start page with no orientation, and the demo led with two roles the
 * criterion does not name.
 *
 * So this is data rather than a page of prose: the three scored scenarios first,
 * each with the four things the criterion asks for, and the rest kept as
 * evidence that the system is complete rather than as the opening.
 *
 * **Every step names the role it is performed as.** That is the part worth
 * testing: a step that sends a reviewer to a screen its own role is refused is
 * the worst possible thing to find during a fifteen-minute presentation, and
 * `accessLevel` already knows the answer.
 *
 * Pure domain — no React, no data access, no I/O.
 */

import type { Lang, Text } from "./lang";
import type { Role } from "./role";

export interface WalkthroughStep {
  label: Text;
  /** What to look at, and why it is worth looking at. */
  detail: Text;
  /** The role the step is performed as — the guide switches to it. */
  role: Role;
  href: string;
  requirements: readonly string[];
}

export interface WalkthroughScenario {
  id: string;
  /** One of the three the criterion names, or supporting evidence. */
  scored: boolean;
  role: Role;
  /** MI's own scenario number from chapter 8. */
  scenario: string;
  title: Text;
  /** The criterion's first element. */
  taskAndGoal: Text;
  /** The criterion's fourth element, in one paragraph. */
  usability: Text;
  steps: readonly WalkthroughStep[];
}

export const WALKTHROUGH: readonly WalkthroughScenario[] = [
  {
    id: "agreement-admin",
    scored: true,
    role: "agreement-admin",
    scenario: "US-01",
    title: {
      sv: "Registrera ett inkommet avtalsprotokoll",
      en: "Register an incoming agreement protocol",
    },
    taskAndGoal: {
      sv: "Ett undertecknat avtalsprotokoll kommer in till Medlingsinstitutet, oftast som en inskannad PDF. Handläggaren ska få in det i registret: identifiera vilket avtal det gäller, registrera löneavtalet och de allmänna villkoren, och koppla dokumentet. Målet är en korrekt, komplett och spårbar registrering — allt nedströms läser det handläggaren skriver in, från Konjunkturlönerapporten till Medlingsinstitutets årsrapport.",
      en: "A signed agreement protocol arrives at Medlingsinstitutet, normally as a scanned PDF. The case officer has to get it into the register: identify which agreement it concerns, register the wage agreement and the general terms, and link the document. The goal is a correct, complete and traceable registration — everything downstream reads what the officer types, from the Short-Term Wage Report to Medlingsinstitutet's annual report.",
    },
    usability: {
      sv: "Protokollet står kvar bredvid formuläret medan handläggaren scrollar, så en kontroll är en blick i stället för en scroll fram och tillbaka. Fältets bredd säger vad som ska stå i det, enheten står i etiketten och värdet är ett rent tal. Fem steg — Medlingsinstitutets egna, inga påhittade. En ofullständig registrering går att spara och ger en påminnelse, så ett protokoll med en lucka inte blockerar kön. WCAG 2.1 AA verifieras automatiskt vid varje ändring: 0 fel, ingen horisontell scroll mellan 375 och 1920 pixlar, och FR-012:s status bärs alltid av färg, form och ord tillsammans.",
      en: "The protocol stays beside the form while the officer scrolls, so a check is a glance rather than a scroll up and back. A field's width says what belongs in it, the unit lives in the label and the value stays a bare number. Five steps — Medlingsinstitutet's own, with none invented. An incomplete registration is savable and generates a reminder, so a protocol with a gap does not block the queue. WCAG 2.1 AA is verified automatically on every change: 0 violations, no horizontal scroll between 375 and 1920 pixels, and FR-012's status is always carried by colour, shape and word together.",
    },
    steps: [
      {
        label: { sv: "Startsidan", en: "The start page" },
        detail: {
          sv: "Rollanpassat innehåll: påminnelser, ofullständiga registreringar och Märket som referens. Registrering är en åtgärd, inte ett menyval — den börjar med den primära knappen här.",
          en: "Role-adapted content: reminders, incomplete registrations and Märket as a reference. Registration is an action rather than a menu item — it begins with the primary button here.",
        },
        role: "agreement-admin",
        href: "/",
        requirements: ["FS-001", "FA-021", "FA-022"],
      },
      {
        label: { sv: "Registrera avtalsprotokoll", en: "Register the agreement protocol" },
        detail: {
          sv: "Ladda upp protokollet och gå igenom Medlingsinstitutets egna fem steg (§4.4). OCR, bevakningsord och matchning körs automatiskt; AI-förslagen är källkopplade — välj ett så markeras stycket det lästes ur. Ett förslag är avsiktligt fel, så den avvisade vägen visas och inte bara påstås.",
          en: "Upload the protocol and walk Medlingsinstitutet's own five steps (§4.4). OCR, watchwords and matching run automatically; the AI proposals are source-linked — select one and the passage it was read from is highlighted. One proposal is deliberately wrong, so the rejected path is shown rather than merely asserted.",
        },
        role: "agreement-admin",
        href: "/registrera",
        requirements: ["FAI-001", "FAI-002", "FAI-003", "FAI-004", "FA-021"],
      },
      {
        label: { sv: "Avtalsregistret", en: "The agreement register" },
        detail: {
          sv: "Där registreringen hamnar. Filtren avgränsar tabellen på riktigt, och FR-012:s färgmarkering bär både form och ord.",
          en: "Where the registration lands. The filters genuinely narrow the table, and FR-012's colour coding carries a shape and a word as well.",
        },
        role: "agreement-admin",
        href: "/avtal",
        requirements: ["FA-005", "FA-006", "FR-012"],
      },
      {
        label: { sv: "Avtalet i sin helhet", en: "One agreement in full" },
        detail: {
          sv: "Bilaga F:s Rapport 4, Huvudrapporten, på skärm: basfakta, löneavtal per avtalsrörelse, arbetsgrupper, lägstlöner, livscykel och händelselogg.",
          en: "Appendix F's Report 4, the Main Report, on screen: base facts, wage agreements per bargaining round, working groups, minimum wages, lifecycle and event log.",
        },
        role: "agreement-admin",
        href: "/avtal/A-001",
        requirements: ["FA-001", "FA-002", "FA-014", "FH-002"],
      },
      {
        label: { sv: "Rapportuttag", en: "Report extract" },
        detail: {
          sv: "Bilaga F inleds med att det för varje rapport visas urvalsbild och resultat. Välj rapport, fyll i urvalet — kriterierna skiljer sig mellan rapporterna — och generera. Urvalskriterierna skrivs ut överst i resultatet.",
          en: "Appendix F opens by stating that for every report a selection screen and a result are shown. Choose the report, fill in the selection — the criteria differ per report — and generate. The criteria are printed at the head of the result.",
        },
        role: "agreement-admin",
        href: "/rapporter",
        requirements: ["FR-005", "FR-006", "FR-007", "FR-008"],
      },
    ],
  },
  {
    id: "system-admin",
    scored: true,
    role: "system-admin",
    scenario: "US-13",
    title: {
      sv: "Granska loggar och underhålla systemkonfigurationen",
      en: "Review logs and maintain system configuration",
    },
    taskAndGoal: {
      sv: "Systemadministratören svarar för systemet, inte för handläggningen i det. Frågan är: vad har systemet gjort, och kan Medlingsinstitutet svara för det utan att kontakta leverantören? När en siffra i en publicerad rapport ifrågasätts ska det gå att rekonstruera vem som ändrade den, när, och vad den var innan. Inför en avtalsrörelse ska bevakningsordstabellen vara aktuell.",
      en: "The system administrator answers for the system rather than for the case work in it. The question is: what has this system done, and can Medlingsinstitutet answer for it without contacting the supplier? When a figure in a published report is questioned, it must be possible to reconstruct who changed it, when, and what it was before. Ahead of a bargaining round the watchword table has to be current.",
    },
    usability: {
      sv: "En skärm svarar på rollens fråga, eftersom de två loggarna, stödtabellen och inställningarna är fyra delar av samma sak. Långa tabeller fäster sin rubrikrad och scrollar i en egen, namngiven region som går att nå med tangentbord. Loggen säger med egna ord att den skrivs av systemet och inte kan redigeras härifrån. En inställning som nekas säger åt vilket håll den är fel och vilken gräns som gäller, så administratören inte behöver gissa.",
      en: "One screen answers the role's question, because the two logs, the support table and the settings are four parts of one subject. Long tables pin their header row and scroll inside their own named region, reachable by keyboard. The log states in its own words that it is written by the system and cannot be edited from here. A setting that is refused says which way it is wrong and what the limit is, so the administrator does not have to guess.",
    },
    steps: [
      {
        label: { sv: "Startsidan", en: "The start page" },
        detail: {
          sv: "Samma system, en annan roll: menyn och innehållet följer behörigheten (NFÅ-003). Byt roll i demoraden och se skillnaden.",
          en: "The same system, a different role: the menu and the content follow the authorisation (NFÅ-003). Switch role in the demo bar and see the difference.",
        },
        role: "system-admin",
        href: "/",
        requirements: ["FS-001", "NFÅ-003"],
      },
      {
        label: { sv: "Systeminställningar", en: "System settings" },
        detail: {
          sv: "Fyra inställningar, och två av dem går avsiktligt inte att ändra: NFL-003 nämner systemadministratören i sitt förbud, och NFÅ-006:s IP-spärr ligger i driftmiljön. Sessionens tidsgräns är konfigurerbar på riktigt — sätt den till tio minuter och startsidan säger tio.",
          en: "Four settings, and two of them deliberately cannot be changed: NFL-003 names the system administrator in its prohibition, and NFÅ-006's IP restriction sits in the operating environment. The session limit is genuinely configurable — set it to ten minutes and the start page says ten.",
        },
        role: "system-admin",
        href: "/administration",
        requirements: ["NFÅ-002", "NFL-003", "NFÅ-006", "FAI-004"],
      },
      {
        label: { sv: "Ändrings- och händelselogg", en: "Change log and event log" },
        detail: {
          sv: "FH-001 kräver gammalt och nytt värde — skillnaden mellan en logg som registrerar att något ändrades och en som kan rekonstruera vad det var. Det är också det som gör FAI-002:s garanti kontrollerbar i efterhand. Utskriften är NFL-004:s exportfunktion som faktiskt körs.",
          en: "FH-001 requires the old and the new value — the difference between a log that records that something changed and one that can reconstruct what it was. It is also what makes FAI-002's guarantee checkable after the fact. The print is NFL-004's export function, and it runs.",
        },
        role: "system-admin",
        href: "/administration",
        requirements: ["FH-001", "FH-002", "NFL-003", "NFL-004"],
      },
      {
        label: { sv: "Behörighetsmatrisen", en: "The authorisation matrix" },
        detail: {
          sv: "Läses av den här rollen men ändras inte: §3.1 ger systemadministratören systemkonfiguration men uttryckligen inte behörigheter. Användare och rolltilldelning administreras av behörighetsadministratören (NFÅ-005).",
          en: "Read by this role but not changed: §3.1 gives the system administrator system configuration but explicitly not permissions. Users and role assignment are administered by the authorisation administrator (NFÅ-005).",
        },
        role: "permission-admin",
        href: "/administration/anvandare",
        requirements: ["NFÅ-003", "NFÅ-005"],
      },
    ],
  },
  {
    id: "public",
    scored: true,
    role: "public",
    scenario: "US-14",
    title: {
      sv: "Ta fram avtalsinformation från den publika datorn",
      en: "Produce agreement information from the public computer",
    },
    taskAndGoal: {
      sv: "En besökare kommer till Medlingsinstitutets lokaler — en journalist som kontrollerar ett påstående, en student, en anställd som vill veta vilket avtal som gäller. Målet är att få veta vilket avtal som gäller ett område, hur länge det löper och om det har omförhandlats, och att kunna ta med sig svaret. Besökaren har ingen inloggning, ingen introduktion och ett försök.",
      en: "A visitor comes to Medlingsinstitutet's premises — a journalist checking a claim, a student, an employee wanting to know which agreement applies. The goal is to learn which agreement covers an area, how long it runs and whether it has been renegotiated, and to take the answer away. The visitor has no sign-in, no introduction and one attempt.",
    },
    usability: {
      sv: "En skärm, ett sökfält, ett resultat. Ingen meny, ingen inloggning, inget internt fackspråk och inget som går att redigera. Besökaren behöver aldrig välja i en lista innan hen kan börja — hen skriver, och det som skrivits visas som ett borttagbart filter ovanför resultatet så det alltid framgår vad listan är en lista över. Det här är rollen där tillgängligheten betyder mest: vyn är verifierad från 375 till 1920 pixlar utan horisontell scroll, med 0 fel från axe, och varje status bärs av färg, form och ord.",
      en: "One screen, one search field, one result. No menu, no sign-in, no internal vocabulary and nothing editable. The visitor never has to choose from a list before they can begin — they type, and what they typed appears as a removable filter above the result so it is always clear what the list is a list of. This is the role where accessibility matters most: the view is verified from 375 to 1920 pixels with no horizontal scroll, 0 axe violations, and every status carried by colour, shape and word.",
    },
    steps: [
      {
        label: { sv: "Den publika ingången", en: "The public entrance" },
        detail: {
          sv: "Ingen inloggningssida, och det är avsiktligt: NFÅ-001 lägger autentiseringen hos Försäkringskassans IdP för personalen, och NFÅ-006 begränsar publik åtkomst till Medlingsinstitutets egen IP-adress — datorn i rummet är legitimationen.",
          en: "No sign-in page, and that is deliberate: NFÅ-001 puts authentication with Försäkringskassan's IdP for staff, and NFÅ-006 restricts public access to Medlingsinstitutet's own IP address — the machine in the room is the credential.",
        },
        role: "public",
        href: "/allmanheten",
        requirements: ["NFÅ-006", "FR-011"],
      },
      {
        label: { sv: "Sök, avgränsa och skriv ut", en: "Search, narrow and print" },
        detail: {
          sv: "Skriv ett ord så smalnar listan av medan du skriver. Under det ligger Medlingsinstitutets egna tre kriterier ur Bilaga F:s Rapport 1, och ett datum för vad som gällde vid en viss tidpunkt. Sekretessmarkerade avtal syns i listan och räknas med — det som utelämnas är deras uppgifter, och det utelämnas i markupen, inte i stilmallen.",
          en: "Type a word and the list narrows as you type. Below it are Medlingsinstitutet's own three criteria from Appendix F's Report 1, and a date for what applied at a given point. Confidentiality-marked agreements appear in the list and are counted — what is withheld is their detail, and it is withheld in the markup rather than in the stylesheet.",
        },
        role: "public",
        href: "/allmanheten",
        requirements: ["FR-001", "FR-003", "FR-011", "D-002"],
      },
    ],
  },

  /* Supporting evidence. Not scored, and kept because a bid that shows only the
     minimum is not the bid that scores *mycket högt mervärde*. */
  {
    id: "mediation-admin",
    scored: false,
    role: "mediation-admin",
    scenario: "US-07, US-08",
    title: {
      sv: "Medlingsärenden och partsträffar",
      en: "Mediation cases and party meetings",
    },
    taskAndGoal: {
      sv: "Medlingsadministratören skapar ett medlingsärende ur ett generaldirektörsbeslut och håller partsträffar inför avtalsrörelsen. Partsträffsvyn är den mest särpräglade skärmen i systemet: den används live, under mötet.",
      en: "The mediation administrator creates a mediation case from a Director-General decision and holds party meetings ahead of the bargaining round. The party-meeting view is the most distinctive screen in the system: it is used live, during the meeting.",
    },
    usability: {
      sv: "Tre skeden, och det mellersta är en inmatningsyta snarare än en sammanfattning — anteckningar tidsstämplas när de skrivs, och ett yrkande blir en post i samma stund det hörs.",
      en: "Three phases, and the middle one is an input surface rather than a summary — notes are time-stamped as they are typed, and a demand becomes a record the moment it is heard.",
    },
    steps: [
      {
        label: { sv: "Medlingsärendet", en: "The mediation case" },
        detail: {
          sv: "Skapat ur GD-beslutet, med §4.1:s beslutsstöd och dokumentmallen med och utan varsel.",
          en: "Created from the Director-General decision, with §4.1's decision support and the document template with and without notice.",
        },
        role: "mediation-admin",
        href: "/medling/M-2027-12",
        requirements: ["FF-006", "FF-007", "FSD-001"],
      },
      {
        label: { sv: "Partsträffen", en: "The party meeting" },
        detail: {
          sv: "Inför, under och efter mötet. Ett yrkande kan lyftas till bevakningsordstabellen och börjar då markera text i protokoll som kommer in månader senare.",
          en: "Before, during and after the meeting. A demand can be promoted to the watchword table, and then starts marking text in protocols that arrive months later.",
        },
        role: "mediation-admin",
        href: "/partstraffar/PT-2027-05",
        requirements: ["FF-004", "FF-005", "FAI-004", "FSD-002"],
      },
    ],
  },
  {
    id: "statistics-user",
    scored: false,
    role: "statistics-user",
    scenario: "US-11",
    title: { sv: "Sammansatt sökning och uttag", en: "Composite search and extract" },
    taskAndGoal: {
      sv: "Statistikanvändaren bygger en sammansatt fråga över avtalsinformationen och tar ut resultatet. Rollen är läsande: §3.1 ger den läsa och datauttag, och behörighetsmatrisen säger samma sak.",
      en: "The statistics user builds a composite query over the agreement information and extracts the result. The role is read-only: §3.1 gives it read and data extract, and the authorisation matrix says the same.",
    },
    usability: {
      sv: "Villkoren skrivs ut som en läsbar mening, så en fråga med grupperingar går att kontrollera utan att läsa formuläret bakåt.",
      en: "The conditions are written out as a readable sentence, so a query with groupings can be checked without reading the form backwards.",
    },
    steps: [
      {
        label: { sv: "Sökbyggaren", en: "The search builder" },
        detail: {
          sv: "Fält, operator och värde med och/eller, grupperingar och valda presentationskolumner (FR-002).",
          en: "Field, operator and value with and/or, groupings and chosen presentation columns (FR-002).",
        },
        role: "statistics-user",
        href: "/sok",
        requirements: ["FR-002", "FR-003", "FR-004"],
      },
    ],
  },
  {
    id: "mediator-admin",
    scored: false,
    role: "mediator-admin",
    scenario: "US-10",
    title: { sv: "Medlarregistret", en: "The mediator register" },
    taskAndGoal: {
      sv: "Medlaradministratören underhåller registret över medlare och använder statistiken per medlare — år, avtalsområde och position ettan eller tvåan — som underlag när en medlare ska utses.",
      en: "The mediator administrator maintains the register of mediators and uses the statistics per mediator — year, agreement area and first or second chair — as the basis when a mediator is to be appointed.",
    },
    usability: {
      sv: "Statistiken härleds ur uppdragen i stället för att lagras, så registret aldrig kan säga något annat än de medlingsärenden det sammanfattar.",
      en: "The statistics are derived from the assignments rather than stored, so the register can never say anything other than the mediation cases it summarises.",
    },
    steps: [
      {
        label: { sv: "Medlarregistret", en: "The mediator register" },
        detail: {
          sv: "Register, statistik per medlare och ett formulär för att lägga till en ny (FF-009).",
          en: "Register, statistics per mediator, and a form for adding a new one (FF-009).",
        },
        role: "mediator-admin",
        href: "/medlare",
        requirements: ["FF-009", "FE-001", "D-004"],
      },
    ],
  },
  {
    id: "permission-admin",
    scored: false,
    role: "permission-admin",
    scenario: "US-12",
    title: { sv: "Användare och rolltilldelning", en: "Users and role assignment" },
    taskAndGoal: {
      sv: "Behörighetsadministratören lägger upp användare och tilldelar roller — det NFÅ-005 uttryckligen lägger hos Medlingsinstitutet, utan leverantörens medverkan.",
      en: "The authorisation administrator sets up users and assigns roles — what NFÅ-005 explicitly places with Medlingsinstitutet, without the supplier's involvement.",
    },
    usability: {
      sv: "Inget lösenordsfält och ingen kontoskapning: autentiseringen ligger hos Försäkringskassans IdP, så en användare här är en koppling till en identitet som redan finns.",
      en: "No password field and no account creation: authentication sits with Försäkringskassan's IdP, so a user here is a link to an identity that already exists.",
    },
    steps: [
      {
        label: { sv: "Användare och behörigheter", en: "Users and permissions" },
        detail: {
          sv: "Användarregistret går att ändra; behörighetsmatrisen under det gör det inte, eftersom NFÅ-003 definierar åtkomsten utifrån §3.1:s åtta roller.",
          en: "The user register is editable; the permission matrix under it is not, because NFÅ-003 defines access by §3.1's eight roles.",
        },
        role: "permission-admin",
        href: "/administration/anvandare",
        requirements: ["NFÅ-005", "NFÅ-001", "FH-001"],
      },
    ],
  },
] as const;

/** The criterion's three, in the order it names them. */
export function scoredScenarios(): readonly WalkthroughScenario[] {
  return WALKTHROUGH.filter((s) => s.scored);
}

/** Everything else — evidence that the system is complete, not the opening. */
export function supportingScenarios(): readonly WalkthroughScenario[] {
  return WALKTHROUGH.filter((s) => !s.scored);
}

export function scenarioTitle(scenario: WalkthroughScenario, lang: Lang): string {
  return scenario.title[lang];
}

/** Every distinct route the walkthrough sends a reviewer to. */
export function walkthroughRoutes(): string[] {
  return [...new Set(WALKTHROUGH.flatMap((s) => s.steps.map((step) => step.href)))];
}

/** Every requirement the walkthrough cites, deduplicated. */
export function walkthroughRequirements(): string[] {
  return [
    ...new Set(WALKTHROUGH.flatMap((s) => s.steps.flatMap((step) => step.requirements))),
  ];
}

/* -------------------------------------------------------------------------- */
/* The cursor — walking a scenario from inside the product                     */
/* -------------------------------------------------------------------------- */

/**
 * Where a reviewer has got to in the walkthrough.
 *
 * The guide was a page you left. Clicking step 2 opened `/registrera`, and the
 * only way to step 3 was to go back to a 5 000-pixel document and find your
 * place in it — which is a bad thing to do once and an impossible thing to do
 * in front of an evaluator with fifteen minutes. So the position travels: it is
 * written when a step is opened, and the demo strip carries the way onward from
 * whatever screen the reviewer is standing on.
 *
 * A cursor rather than history: what a reviewer needs is *the next step*, not a
 * record of where they have been.
 */
export interface WalkthroughPosition {
  scenarioId: string;
  /** 0-based, into `scenario.steps`. */
  stepIndex: number;
}

export function encodePosition(p: WalkthroughPosition): string {
  return `${p.scenarioId}:${p.stepIndex}`;
}

/**
 * Reads the cookie back, and returns null for anything that no longer resolves.
 *
 * A scenario can be renamed or a step removed between deployments, and a stale
 * cookie must not put a "Nästa" control in the demo strip that leads nowhere —
 * that is the same failure as the dead link this whole cursor exists to fix.
 */
export function decodePosition(raw: string | undefined): WalkthroughPosition | null {
  if (!raw) return null;
  const [scenarioId, index] = raw.split(":");
  if (!scenarioId || index === undefined) return null;
  const stepIndex = Number(index);
  if (!Number.isInteger(stepIndex) || stepIndex < 0) return null;
  const scenario = scenarioById(scenarioId);
  if (!scenario || stepIndex >= scenario.steps.length) return null;
  return { scenarioId, stepIndex };
}

export function scenarioById(id: string): WalkthroughScenario | undefined {
  return WALKTHROUGH.find((s) => s.id === id);
}

export interface WalkthroughCursor {
  scenario: WalkthroughScenario;
  step: WalkthroughStep;
  /** 1-based, for display: "Steg 2 av 5". */
  number: number;
  total: number;
  /** The step after this one, within the same scenario. */
  next: { position: WalkthroughPosition; step: WalkthroughStep } | null;
}

/**
 * Resolve a position, with the step after it.
 *
 * `next` stops at the end of the scenario rather than running on into the next
 * one. A scenario is one officer doing one task; carrying a reviewer silently
 * from the agreement administrator into the public computer would be the guide
 * changing the subject without saying so.
 */
export function cursorAt(position: WalkthroughPosition | null): WalkthroughCursor | null {
  if (!position) return null;
  const scenario = scenarioById(position.scenarioId);
  const step = scenario?.steps[position.stepIndex];
  if (!scenario || !step) return null;

  const nextStep = scenario.steps[position.stepIndex + 1];
  return {
    scenario,
    step,
    number: position.stepIndex + 1,
    total: scenario.steps.length,
    next: nextStep
      ? {
          position: { scenarioId: scenario.id, stepIndex: position.stepIndex + 1 },
          step: nextStep,
        }
      : null,
  };
}

/** Every step in the walkthrough, for a total the guide can state up front. */
export function totalSteps(): number {
  return WALKTHROUGH.reduce((n, s) => n + s.steps.length, 0);
}

export type { Text };
