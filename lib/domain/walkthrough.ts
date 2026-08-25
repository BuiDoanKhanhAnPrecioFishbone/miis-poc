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
  /**
   * True where an AI function actually runs on this screen.
   *
   * Stated rather than inferred. The flow document highlights AI, and the
   * obvious inference — does the step cite an `FAI-*` rule — marks the step
   * where the AI is *forbidden*, because explaining a prohibition means citing
   * the rule that imposes it. `walkthrough.test.ts` holds this to
   * `aiFunctionsForPath`, so a function added or moved cannot leave it stale.
   */
  ai?: true;
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
      sv: "Registrera, uppdatera och publicera ett kollektivavtal",
      en: "Register, update and publish a collective agreement",
    },
    taskAndGoal: {
      sv: "Ett kollektivavtal ska in i registret, hållas aktuellt och till slut lämnas ut. Det kommer två vägar: som ett helt nytt avtal utan tidigare motsvarighet, vilket alltid registreras manuellt (§4.1), eller som ett undertecknat avtalsprotokoll — oftast en inskannad PDF — om ett avtal systemet redan har. Därefter ska uppgifterna gå att komplettera och rätta, varje avtalsrörelse ska lägga sin egen rad, och avtalet ska publiceras när registreringen är klar. Målet är en korrekt, komplett och spårbar post: allt nedströms läser det handläggaren skriver in, från Konjunkturlönerapporten till Medlingsinstitutets årsrapport och den publika datorn.",
      en: "A collective agreement has to get into the register, be kept current, and finally be released. It arrives two ways: as a wholly new agreement with no previous counterpart, which is always registered manually (§4.1), or as a signed agreement protocol — normally a scanned PDF — about an agreement the system already holds. After that the details have to be correctable, every bargaining round adds its own row, and the agreement is published once the registration is complete. The goal is a correct, complete and traceable record: everything downstream reads what the officer types, from the Short-Term Wage Report to Medlingsinstitutet's annual report and the public computer.",
    },
    usability: {
      sv: "Protokollet står kvar bredvid formuläret medan handläggaren scrollar, så en kontroll är en blick i stället för en scroll fram och tillbaka. Fältets bredd säger vad som ska stå i det, enheten står i etiketten och värdet är ett rent tal. Fem steg — Medlingsinstitutets egna, inga påhittade. En ofullständig registrering går att spara och ger en påminnelse, så ett protokoll med en lucka inte blockerar kön. WCAG 2.1 AA verifieras automatiskt vid varje ändring: 0 fel, ingen horisontell scroll mellan 375 och 1920 pixlar, och FR-012:s status bärs alltid av färg, form och ord tillsammans.",
      en: "The protocol stays beside the form while the officer scrolls, so a check is a glance rather than a scroll up and back. A field's width says what belongs in it, the unit lives in the label and the value stays a bare number. Five steps — Medlingsinstitutet's own, with none invented. An incomplete registration is savable and generates a reminder, so a protocol with a gap does not block the queue. WCAG 2.1 AA is verified automatically on every change: 0 violations, no horizontal scroll between 375 and 1920 pixels, and FR-012's status is always carried by colour, shape and word together.",
    },
    steps: [
      {
        label: {
          sv: "Registrera ett nytt kollektivavtal",
          en: "Register a new collective agreement",
        },
        detail: {
          sv: "Ett avtal utan tidigare motsvarighet i MIIS. Det här är den enda registreringen AI-stödet inte får göra: §4.1 säger att helt nya avtal alltid registreras manuellt, och skälet syns på skärmen — AI:t läser ett protokoll mot ett avtal systemet redan har, och för ett förstagångsavtal finns ingenting att matcha mot. Avtalet sparas som ofullständigt och opublicerat, och skärmen räknar upp vad som återstår. Resten av scenariot följer ett annat avtal — det som protokollet i nästa steg gäller — eftersom ett förstagångsavtal per definition inte har något inkommet protokoll att läsa.",
          en: "An agreement with no previous counterpart in MIIS. This is the one registration the AI support is not allowed to do: §4.1 says wholly new agreements are always registered manually, and the reason is on the screen — the AI reads a protocol against an agreement the system already holds, and for a first-time agreement there is nothing to match against. It is saved as incomplete and unpublished, and the screen lists what remains. The rest of the scenario follows a different agreement — the one the protocol in the next step concerns — because a first-time agreement has, by definition, no incoming protocol to read.",
        },
        role: "agreement-admin",
        href: "/avtal/ny",
        requirements: ["FA-001", "FA-005", "FAI-002"],
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
        ai: true,
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
        label: {
          sv: "Lägg till eller uppdatera information",
          en: "Add or update information",
        },
        detail: {
          sv: "FA-001 är att registrera *och redigera* avtalsinformation. Varje avsnitt som går att rätta har sin egen Redigera — identiteten och avtalets omfattning, de fyra mått Medlingsinstitutet faktiskt räknar om mellan ronderna. Ändringen sker på värdena själva i stället för på en andra skärm, och skrivs till ändringsloggen med tidpunkt och användare. Två fält är avsiktligt låsta och säger varför på sin egen rad: avtalstypen följer av vilka löneavtal som finns, och parterna ändras i partsregistret så att avtalshistoriken följer med. Organisationsgrad räknas fram medan de två talen ovanför skrivs in — den följer, den skrivs inte.",
          en: "FA-001 is to register *and edit* agreement information. Every section that can be corrected carries its own Edit — the identity and the agreement's scope, the four measures Medlingsinstitutet actually revises between rounds. The change happens on the values themselves rather than on a second screen, and is written to the change log with the time and the user. Two fields are deliberately locked and say why on their own row: the agreement type follows from which wage agreements exist, and the parties are changed in the party register so that the agreement history follows. Union density is calculated while the two figures above it are typed — it follows, it is not entered.",
        },
        role: "agreement-admin",
        href: "/avtal/A-001",
        requirements: ["FA-001", "FA-014", "FH-001"],
      },
      {
        label: {
          sv: "Versioner och ändringar av avtalet",
          en: "Versions and changes to the agreement",
        },
        detail: {
          sv: "Ett avtal har ingen versionslista utan en rad per avtalsrörelse: FA-002 ger varje omförhandling ett eget löneavtal med sin egen konstruktion, sitt utrymme och sin kostnadsram, så jämförelsen mot förra ronden är tabellen. Raden går att rätta: konstruktion, löneutrymme, kostnadsram och individgaranti ändras per avtalsrörelse, från ett formulär som namnger den period det gäller. Löptiden ändras däremot på avtalet och inte här — en avtalsrörelse kan inte gälla längre än avtalet den tillhör. Vad som ändrats *inom* en period står i händelseloggen, med gammalt och nytt värde (FH-001).",
          en: "An agreement has no version list but a row per bargaining round: FA-002 gives every renegotiation its own wage agreement with its own construction, scope and cost frame, so the comparison against the last round *is* the table. The row can be corrected: construction, wage scope, cost frame and individual guarantee are changed per bargaining round, from a form that names the period it applies to. The validity period is changed on the agreement instead — a round cannot run longer than the agreement it belongs to. What changed *within* a period is in the event log, with the old and the new value (FH-001).",
        },
        role: "agreement-admin",
        /* The rounds live in their own tab, so the step opens it — otherwise
           this lands on the previous step's screen. */
        href: "/avtal/A-001#loneavtal",
        requirements: ["FA-002", "FH-001", "FH-002"],
      },
      {
        label: { sv: "Publicera avtalet", en: "Publish the agreement" },
        detail: {
          sv: "Publicering är en handling med datum och person, inte en följd av att posten är komplett — myndigheten avgör när ett avtal lämnas ut. Den ligger i högerspalten bredvid statusen den ändrar, inte i redigeringen: att rätta en uppgift och att lämna ut avtalet är två olika saker. Kontrollen erbjuds bara på en registrering som är markerad som klar och där avtalet är tecknat; på ett halvregistrerat avtal nekas den och säger varför. Samma avtal som de fyra stegen ovan: protokollet lästes mot det, uppgifterna rättades i det, och det är det som nu lämnas ut. Efteråt går det att öppna avtalet som allmänheten ser det.",
          en: "Publication is an act with a date and a person, not a consequence of the record being complete — the authority decides when an agreement is released. It sits in the right-hand column beside the status it changes, not inside editing: correcting a detail and releasing the agreement are two different things. The control is offered only on a registration marked complete whose agreement is signed; on a half-registered one it is refused and says why. The same agreement as the four steps above: the protocol was read against it, the details were corrected in it, and it is the one now being released. Afterwards the agreement can be opened as the public sees it.",
        },
        role: "agreement-admin",
        href: "/avtal/A-001",
        requirements: ["FR-009", "FR-011", "FH-001"],
      },
      {
        label: { sv: "Rapportuttag", en: "Report extract" },
        detail: {
          sv: "Behovet går att beskriva i en mening överst: förslaget namnger rapporten och fyller urvalsbilden, med de ord det lästes ur, och kör ingenting — en rapport en roll inte får köra avvisas med skälet i stället för att tyst utelämnas. Bilaga F inleds med att det för varje rapport visas urvalsbild och resultat. Välj rapport, fyll i urvalet — kriterierna skiljer sig mellan rapporterna — och generera. Urvalskriterierna skrivs ut överst i resultatet.",
          en: "The need can be described in a sentence at the top: the proposal names the report and fills the selection screen, with the words it was read from, and runs nothing — a report the role may not run is refused with the reason rather than quietly dropped. Appendix F opens by stating that for every report a selection screen and a result are shown. Choose the report, fill in the selection — the criteria differ per report — and generate. The criteria are printed at the head of the result.",
        },
        role: "agreement-admin",
        href: "/rapporter",
        requirements: ["FR-005", "FR-006", "FR-007", "FR-008", "FAI-002"],
        ai: true,
      },
    ],
  },
  {
    id: "system-admin",
    scored: true,
    role: "system-admin",
    scenario: "US-13",
    title: {
      sv: "Användare, roller, behörigheter och systemets förvaltning",
      en: "Users, roles, permissions and the system's administration",
    },
    taskAndGoal: {
      sv: "Systemadministratören svarar för systemet, inte för handläggningen i det: vem som har åtkomst, som vad, och vad systemet har gjort. Målet är att Medlingsinstitutet ska kunna lägga upp en ny medarbetare, ge, ändra och återkalla behörighet, och svara för en ifrågasatt siffra i en publicerad rapport — allt utan att kontakta leverantören. Scenariot går över två roller, och det är avsiktligt: Bilaga 1 §3.1 ger systemadministratören full åtkomst inklusive systemkonfiguration men uttryckligen inte behörigheter, och lägger användare och rolltilldelning hos behörighetsadministratören. Uppdelningen är ansvarsfördelning — den som konfigurerar systemet är inte den som ger åtkomst till det — och genomgången byter roll där §3.1 kräver det i stället för att vidga en behörighet som myndigheten har skrivit en parentes för att begränsa.",
      en: "The system administrator answers for the system rather than for the case work in it: who has access, as what, and what the system has done. The goal is that Medlingsinstitutet can add a new colleague, grant, change and revoke access, and answer for a questioned figure in a published report — all without contacting the supplier. The scenario spans two roles, deliberately: Appendix 1 §3.1 gives the system administrator full access including system configuration but explicitly not permissions, and places users and role assignment with the authorisation administrator. The split is separation of duties — whoever configures the system is not whoever grants access to it — and the walkthrough switches role where §3.1 requires it rather than widening a permission the authority wrote a parenthesis to limit.",
    },
    usability: {
      sv: "Behörighetsregistret svarar på rollens fyra frågor i den ordning de ställs — vem har åtkomst, som vad, sedan när och av vem, och är personen kvar. Rollbytet sker i raden, så handläggaren har personen, den nuvarande rollen och vem som tilldelade den framför sig när den ändras. En åtgärd som nekas säger varför på sig själv: den sista behörighetsadministratören går varken att flytta eller inaktivera, eftersom det är den utelåsning bara leverantören kan reparera. Ingen post raderas — inloggningarna ligger i loggen och måste gå att härleda (NFL-001). Långa tabeller fäster sin rubrikrad och scrollar i en egen namngiven region som går att nå med tangentbord, och en inställning som nekas säger åt vilket håll den är fel och vilken gräns som gäller.",
      en: "The authorisation register answers the role's four questions in the order they are asked — who has access, as what, since when and granted by whom, and are they still here. The role change happens in the row, so the officer has the person, the current role and who assigned it in front of them while changing it. A refused action says why on itself: the last authorisation administrator can neither be moved nor deactivated, because that is the lock-out only the supplier could repair. Nothing is deleted — the sign-ins are in the log and have to stay resolvable (NFL-001). Long tables pin their header row and scroll inside their own named region, reachable by keyboard, and a setting that is refused says which way it is wrong and what the limit is.",
    },
    steps: [
      {
        label: {
          sv: "Överblick över användare, roller och behörigheter",
          en: "Overview of users, roles and permissions",
        },
        detail: {
          sv: "Vem som har åtkomst, som vad, sedan när och av vem. Under registret ligger behörighetsmatrisen, som visar vad varje roll får göra i varje modul — den läses och ändras inte, eftersom NFÅ-003 definierar åtkomsten utifrån §3.1:s åtta roller och en matris som gick att flytta om skulle beskriva en konfiguration i stället för myndighetens eget dokument.",
          en: "Who has access, as what, since when and granted by whom. Under the register is the permission matrix showing what each role may do in each module — read, not edited, because NFÅ-003 defines access by §3.1's eight roles and a matrix an administrator could rearrange would describe a configuration rather than the authority's own document.",
        },
        role: "permission-admin",
        href: "/administration/anvandare",
        requirements: ["NFÅ-005", "NFÅ-003", "FH-001"],
      },
      {
        label: { sv: "Skapa en ny användare", en: "Create a new user" },
        detail: {
          sv: "Namn, EFOS-identitet, e-post och roll. Inget lösenordsfält och ingen kontoskapande åtgärd: NFÅ-001 lägger autentiseringen i Försäkringskassans IdP över SAML med EFOS-kort, så en användare i MIIS är en länk till en identitet som redan finns — att rita ett kontoformulär vore att påstå att vi byggt en identitetsleverantör.",
          en: "Name, EFOS identity, e-mail and role. No password field and no account creation: NFÅ-001 puts authentication in Försäkringskassan's IdP over SAML with an EFOS card, so a user in MIIS is a link to an identity that already exists — drawing an account form would claim we had built an identity provider.",
        },
        role: "permission-admin",
        href: "/administration/anvandare",
        requirements: ["NFÅ-005", "NFÅ-001"],
      },
      {
        label: { sv: "Tilldela roll och behörighet", en: "Assign role and permission" },
        detail: {
          sv: "Rollen är behörigheten: §3.1 ger varje roll ett verb, och det är rollen som avgör vad personen ser och får göra. Tilldelningen stämplas med datum och vem som gjorde den, vilket är FH-001-halvan av NFÅ-005.",
          en: "The role is the permission: §3.1 gives each role a verb, and it is the role that decides what the person sees and may do. The assignment is stamped with the date and who made it, which is the FH-001 half of NFÅ-005.",
        },
        role: "permission-admin",
        href: "/administration/anvandare",
        requirements: ["NFÅ-005", "NFÅ-003"],
      },
      {
        label: { sv: "Ändra eller återkalla behörighet", en: "Change or revoke a permission" },
        detail: {
          sv: "Ändra rollen i raden, eller återkalla åtkomsten. Båda skrivs till ändringsloggen. Pröva den sista behörighetsadministratören: både flytten och inaktiveringen nekas, och kontrollen säger varför på sig själv — det är den utelåsning NFÅ-005 finns för att förhindra. Ingen användare raderas, eftersom inloggningarna i loggen måste gå att härleda.",
          en: "Change the role in the row, or revoke access. Both are written to the change log. Try the last authorisation administrator: both the move and the deactivation are refused, and the control says why on itself — that is the lock-out NFÅ-005 exists to prevent. No user is deleted, because the sign-ins in the log have to stay resolvable.",
        },
        role: "permission-admin",
        href: "/administration/anvandare",
        requirements: ["NFÅ-005", "FH-001", "NFL-001"],
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
        ai: true,
      },
      {
        label: { sv: "Ändrings- och händelselogg", en: "Change log and event log" },
        detail: {
          sv: "Den övriga administration som gör att myndigheten kan svara för systemet själv. FH-001 kräver gammalt och nytt värde — skillnaden mellan en logg som registrerar att något ändrades och en som kan rekonstruera vad det var, och det som gör FAI-002:s garanti kontrollerbar i efterhand. Utskriften är NFL-004:s exportfunktion som faktiskt körs. Under fliken Bevakningsord underhålls FAI-004:s tabell: §4.1 kallar den fördefinierad *och* anpassningsbar, så administratören lägger till egna ord och tar bort dem igen. Medlingsinstitutets egna fyra går inte att ta bort, och raden säger varför.",
          en: "The other administration that lets the authority answer for the system itself. FH-001 requires the old and the new value — the difference between a log that records that something changed and one that can reconstruct what it was, and what makes FAI-002's guarantee checkable after the fact. The print is NFL-004's export function, and it runs. Under the Watchwords tab, FAI-004's table is maintained: §4.1 calls it predefined *and* adaptable, so the administrator adds their own terms and removes them again. Medlingsinstitutet's own four cannot be removed, and the row says why.",
        },
        role: "system-admin",
        href: "/administration",
        requirements: ["FH-001", "FH-002", "NFL-003", "NFL-004", "FAI-004"],
        ai: true,
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
        label: {
          sv: "Sök efter avtal på bransch eller avtalsområde",
          en: "Search for an agreement by industry or agreement area",
        },
        detail: {
          sv: "Skriv ett ord så smalnar listan av medan du skriver. Under fritexten ligger bransch först — en besökare tänker i branscher långt innan hen tänker i arbetsgivarorganisationer — och sedan Medlingsinstitutets egna tre kriterier ur Bilaga F:s Rapport 1 och ett datum för vad som gällde vid en viss tidpunkt.",
          en: "Type a word and the list narrows as you type. Under the free text comes industry first — a visitor thinks in industries long before they think in employer organisations — then Medlingsinstitutet's own three criteria from Appendix F's Report 1 and a date for what applied at a given point.",
        },
        role: "public",
        href: "/allmanheten",
        requirements: ["FR-001", "FR-003", "FR-011"],
      },
      {
        label: { sv: "Avgränsa träfflistan", en: "Narrow the result" },
        detail: {
          sv: "Varje valt kriterium blir en chip som går att ta bort ett i taget, och tabellen smalnar av på riktigt. Sekretessmarkerade avtal står kvar i listan och räknas med — det som utelämnas är deras uppgifter, och de utelämnas i markupen, inte i stilmallen. Bara publicerade avtal finns här: ett halvregistrerat avtal på den publika datorn vore myndigheten som publicerar ett utkast.",
          en: "Every chosen criterion becomes a chip that can be removed one at a time, and the table genuinely narrows. Confidentiality-marked agreements stay in the list and are counted — what is withheld is their detail, and it is withheld in the markup rather than in the stylesheet. Only published agreements are here: a half-registered agreement on the public computer would be the authority publishing a draft.",
        },
        role: "public",
        href: "/allmanheten",
        requirements: ["FR-003", "FR-011", "D-002"],
      },
      {
        label: { sv: "Ta del av avtalet", en: "Read the agreement" },
        detail: {
          sv: "Bilaga F:s Rapport 1 i sin helhet: parter, avtalsområde, bransch, löptider per avtalsrörelse, uppsägning och prolongering, och de länkade handlingarna. Inga löneuppgifter — kostnadsram och löneutrymme är myndighetens arbetsmaterial, och det här är utlämnandet.",
          en: "Appendix F's Report 1 in full: parties, agreement area, industry, validity periods per bargaining round, termination and prolongation, and the linked documents. No wage figures — the cost frame and the wage scope are the authority's working material, and this is the release.",
        },
        role: "public",
        href: "/allmanheten/A-013",
        requirements: ["FR-011", "D-002", "FA-002"],
      },
      {
        label: { sv: "Öppna och ladda ned", en: "Open and download" },
        detail: {
          sv: "Två uttag, och båda körs. Utskriften får Medlingsinstitutets brevhuvud och ett utskriftsdatum och kan sparas som PDF i webbläsaren; nedladdningen skriver en riktig CSV-fil ur uppgifterna på skärmen, utan serverdrift (FR-013). Besökarens uppgift slutar med att svaret följer med hem, och en streckad knapp hade avslutat det bedömda scenariot på en kontroll som inte gör något.",
          en: "Two exports, and both of them run. The printout carries Medlingsinstitutet's letterhead and a print date and can be saved as PDF in the browser; the download writes a real CSV file from the details on screen, with no server behind it (FR-013). The visitor's task ends with the answer going home with them, and a dashed button would have ended the scored scenario on a control that does nothing.",
        },
        role: "public",
        href: "/allmanheten/A-013",
        requirements: ["FR-011", "FR-013"],
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
          sv: "Skapat ur GD-beslutet, med §4.1:s beslutsstöd och dokumentmallen med och utan varsel. Ärendet är fyra flikar, eftersom det är fyra olika arbetsuppgifter: **Ärendet** är vad GD beslutade och vilka avtal det omfattar, **Medlare** är förordnandet, **Handlingar** är GD-beslutet och klarmarkeringen, och **Utfall** är vad medlingen gav. Det som varje uppgift utförs mot — förhandlingsordningen, beslutsstödet och Märket — står kvar i högerspalten oavsett flik. Medlarlistan visar bara aktiva medlare som tar den här medlingstypen. Utfallet är underlaget för Medlingsinstitutets statistik över stridsåtgärder — förlorade arbetsdagar och berörda anställda visas bara när det förekom en stridsåtgärd, eftersom en nolla i den kolumnen är en mätning och inte en frånvaro. GD-beslutets nummer och datum går inte att ändra: de kommer ur ett beslut, inte ur registret.",
          en: "Created from the Director-General decision, with §4.1's decision support and the document template with and without notice. The case is four tabs, because it is four different jobs: **Ärendet** is what the Director-General decided and which agreements it covers, **Medlare** is the appointment, **Handlingar** is the decision and its sign-off, and **Utfall** is what the mediation produced. What each job is done against — the procedure agreement, the decision support and Märket — stays in the right-hand column whichever tab is open. The mediator list offers only active mediators who take this mediation type. The outcome is the basis for Medlingsinstitutet's statistics on industrial action — lost working days and affected employees appear only when there was industrial action, because a zero in that column is a measurement rather than an absence. The decision's number and date cannot be changed: they come from a decision, not from the register.",
        },
        role: "mediation-admin",
        href: "/medling/M-2027-12",
        ai: true,
        requirements: ["FF-006", "FF-007", "FF-008", "FF-009", "FF-010", "FSD-001"],
      },
      {
        label: { sv: "Partsträffen", en: "The party meeting" },
        detail: {
          sv: "Inför, under och efter mötet. Ett yrkande kan lyftas till bevakningsordstabellen och börjar då markera text i protokoll som kommer in månader senare.",
          en: "Before, during and after the meeting. A demand can be promoted to the watchword table, and then starts marking text in protocols that arrive months later.",
        },
        role: "mediation-admin",
        href: "/partstraffar/PT-2027-05",
        ai: true,
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
          sv: "Ovanför byggaren går det att beskriva sökningen i en mening. Förslaget visar vilket register och vilka villkor maskinen läste ut, med de ord varje villkor lästes ur, och ingenting ställs in förrän handläggaren godkänt det — det som inte kunde tolkas står också där. FR-002:s val av informationstyp är ett val av vilket register som söks: fyra flikar med var sina rader, var sina kriterier och var sina kolumner. Villkoren är fält, operator och värde; grupperna kombineras med OCH och villkoren inom en grupp med OCH eller ELLER, vilket är formen W3D3 inte klarar. Det finns ingen Sök-knapp — resultatet smalnar av medan urvalet ändras. Bokslutsdatumet visas bara där raderna har löptider. Varje träff öppnar sin egen post, presentationskolumnerna tas bort ur både tabellen och utskriften, och ett sparat urval laddas: det är urvalet som sparas, aldrig träffarna.",
          en: "Above the builder the search can be described in a sentence. The proposal shows which register and which conditions the machine read out, with the words each condition was read from, and nothing is set until the officer approves it — what could not be interpreted is shown too. FR-002’s choice of information type is a choice of which register is searched: four tabs with their own rows, their own criteria and their own columns. A condition is field, operator and value; groups join with OCH and the conditions inside a group with OCH or ELLER, which is the shape W3D3 cannot express. There is no search button — the result narrows as the selection changes. The snapshot date appears only where the rows have periods. Every hit opens its own record, the presentation columns are removed from both the table and the printout, and a saved search loads: what is saved is the selection, never the hits.",
        },
        role: "statistics-user",
        href: "/sok",
        requirements: ["FR-002", "FR-003", "FR-004", "FAI-002"],
        ai: true,
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
          sv: "Registret går att underhålla, inte bara läsa: kontaktuppgifter och medlingstyper ändras på raden, en ny medlare läggs till från registrets egen rubrikrad — samma formulär som rättar en befintlig, eftersom det är samma fält, och en medlare som slutat inaktiveras i stället för att raderas — FF-009:s statistik per medlare skulle annars försvinna med personen. Uppdrag, ettan, tvåan och senaste år räknas ur uppdragshistoriken och går inte att skriva in.",
          en: "The register can be maintained, not only read: contact details and mediation types are changed on the row, a new mediator is added from the register’s own header — the same form that corrects an existing one, because they are the same fields, and a mediator who has stopped is deactivated rather than deleted — FF-009's statistics per mediator would otherwise leave with the person. Assignments, first chair, second chair and latest year are calculated from the assignment history and cannot be typed in.",
        },
        role: "mediator-admin",
        href: "/medlare",
        requirements: ["FF-009", "FE-001", "D-004"],
      },
    ],
  },
  /*
    US-12, the authorisation administrator, used to be a supporting scenario of
    its own. Bilaga 2 §3.5 moved that work into the *scored* system
    administrator scenario — MI's Scenario 1 is overview, create, assign, change
    and revoke — so the four steps live there now, performed as the role §3.1
    gives them to. Keeping a supporting scenario that repeated them would show
    an evaluator the same screen twice and say nothing new the second time.
  */
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
/**
 * The screen a step opens, without the part that only says where to look.
 *
 * A step may deep-link into a section — `/avtal/A-001#loneavtal` — and the
 * fragment is not part of the route: authorisation is per screen (NFÅ-003), and
 * `accessLevel` has never heard of a hash. Both the route check and the
 * authorisation check ask through here, so neither can start disagreeing with
 * what the strip actually pushes.
 */
export function stepRoute(href: string): string {
  return href.split("#")[0]!;
}

export function walkthroughRoutes(): string[] {
  return [...new Set(WALKTHROUGH.flatMap((s) => s.steps.map((step) => stepRoute(step.href))))];
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
  /**
   * And the step before it.
   *
   * A walkthrough is explored, not marched: a reviewer who has just seen
   * something wants to go back and look again, and the browser's own Back
   * button restores the page without restoring the role — which is exactly the
   * confusion the cursor exists to prevent.
   */
  previous: { position: WalkthroughPosition; step: WalkthroughStep } | null;
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
  const previousStep =
    position.stepIndex > 0 ? scenario.steps[position.stepIndex - 1] : undefined;
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
    previous: previousStep
      ? {
          position: { scenarioId: scenario.id, stepIndex: position.stepIndex - 1 },
          step: previousStep,
        }
      : null,
  };
}

/** Every step in the walkthrough, for a total the guide can state up front. */
export function totalSteps(): number {
  return WALKTHROUGH.reduce((n, s) => n + s.steps.length, 0);
}

export type { Text };
