/**
 * Swedish — the product language, and the source of truth for the dictionary.
 *
 * `Dictionary` is `typeof sv`, so `en.ts` must fill in every key or the build
 * fails. That is the mechanism that keeps the English translation complete; a
 * half-translated screen looks worse than no toggle at all.
 *
 * Keyed by screen. Strings that take a value are functions, so the sentence and
 * its grammar stay in one place instead of being concatenated at the call site.
 *
 * Do not translate terms that have no English equivalent. *Märket* stays
 * *Märket*; `common.benchmarkTerm` renders it "Märket (industry benchmark)" in
 * English on first use per screen. Dates are ISO in both languages.
 */

export const sv = {
  common: {
    appName: "MIIS",
    appSubtitle: "Medlingsinstitutets informationssystem",
    skipToContent: "Hoppa till innehåll",
    mainMenu: "Huvudmeny",
    loggedInVia: "miis.mi.se · Inloggad via EFOS",
    benchmarkTerm: "Märket",
    aiProposal: "AI-förslag",
    aiMark: "AI",
    aiNotice:
      "Maskinellt framtaget underlag. Ingenting registreras förrän en handläggare har godkänt det.",
    aiRegionLabel: "AI-förslag – granskas av handläggare",
    empty: "Inget att visa.",
    none: "–",
    yes: "Ja",
    no: "Nej",
    close: "Stäng",
    approve: "Godkänn",
    adjust: "Justera",
    reject: "Avvisa",
    save: "Spara",
    cancel: "Avbryt",
    required: "Obligatoriskt",
    action: "Åtgärd",
    requiredLegend: "Fält märkta Obligatoriskt måste fyllas i.",
    add: "Lägg till",
    choose: "Välj",
    search: "Sök",
    exportLabel: "Exportera:",
    showingOf: (shown: number, total: number) => `Visar ${shown} av ${total}`,
    showAll: (n: number) => `Visa alla (${n})`,
    agreementCount: (n: number) => `${n} avtal`,
    andMoreRows: (n: number) => `… ytterligare ${n} rader`,
    reqTagAria: (id: string) => `Krav-ID ${id}`,
    sortBy: (column: string) => `Sortera på ${column}`,
    sortedAscending: "Sorterat stigande",
    sortedDescending: "Sorterat fallande",
    backTo: (page: string) => `Tillbaka till ${page}`,
    notAuthorised: "Behörighet saknas",
    notAuthorisedFor: (screen: string, role: string) =>
      `${screen} ingår inte i behörigheten för rollen ${role}. Byt roll i demoläget för att se vyn. I MIIS styrs detta av behörighetsadministratören.`,
    uploadNeedsStore:
      "Filuppladdning kräver dokumentlagret och ingår i steg 1. Protokolluppladdningen i registreringsflödet är den som körs utan det.",
    exportNeedsServer:
      "Filexport körs på servern och ingår i steg 1. Utskriften nedan är den export som körs utan serverdrift.",
    notInDemo: "Ej aktiv i demon",
    /* One vocabulary for the filter chips, so two registers cannot describe the
       same control in two ways. */
    filtersNone: "Inga filter valda",
    filtersCount: (n: number) => (n === 1 ? "1 filter" : `${n} filter`),
    filterRemove: (label: string) => `Ta bort filtret ${label}`,
    filtersClearAll: "Rensa alla",
    requirementUnknown: "Kravtexten finns inte registrerad för detta id.",
  },

  demo: {
    title: "Demoläge – visningsinställningar, ingår ej i systemet",
    explain:
      "Rollväxlaren, språkvalet och krav-ID:na är hjälpmedel för granskningen. Inget av dem är föreslagen funktionalitet i MIIS.",
    role: "Roll",
    dataset: "Datamängd",
    language: "Språk",
    reqTags: "Krav-ID",
    reqTagsOn: "Visas",
    reqTagsOff: "Dolda",
    sessionWarning: "Visa sessionsvarning",
    resetDemo: "Återställ demodata",
    resetDone: "Återställt till exempeldata",
  },

  nav: {
    start: "Start",
    avtal: "Avtal",
    parter: "Parter",
    forhandlingar: "Förhandlingar",
    medling: "Medling",
    partstraffar: "Partsträffar",
    medlare: "Medlare",
    dokument: "Dokument",
    sokRapporter: "Sök & Rapporter",
    rapporter: "Rapporter",
    sok: "Sök",
    market: "Märket",
    administration: "Administration",
    anvandare: "Användare",
  },

  print: {
    action: "Skriv ut",
    printedAt: "Utskriftsdatum",
    withheld: "Uppgift utelämnad – sekretessmarkerat avtal",
  },

  /* AI-assistenten – Bilaga 1 §4.1. */
  ai: {
    catalogue: {
      title: "Så här arbetar AI-stödet",
      lead: "AI-stödet är fyra namngivna funktioner, var och en placerad där arbetet görs. Nedan står alla fyra och var de körs — de som gäller den här sidan först. Funktioner utanför din behörighet visas inte.",
      hereBadge: "Körs på den här sidan",
      openRegion: "Gå till funktionen på sidan",
      openScreen: "Öppna skärmen där den körs",
      noneHere: "Ingen av AI-funktionerna körs på den här sidan. Det är svaret, inte en lucka – var och en är placerad där arbetet görs.",
      approvalNote: "Allt de tar fram är förslag. Ingenting sparas förrän en handläggare har godkänt det.",
    },
    queueNew: {
      title: "Väntar på granskning",
      countLabel: (n: number) => `${n} förslag väntar`,
      shared: "Listan är gemensam för alla som får registrera i respektive register – den är inte personlig, och töms när förslagen godkänns eller avvisas.",
      empty: "Ingenting väntar på granskning just nu.",
      review: "Granska förslagen",
    },
    launcher: "AI-stöd",
    launcherWaiting: (n: number) =>
      n === 1
        ? "AI-stöd – 1 förslag väntar på granskning"
        : `AI-stöd – ${n} förslag väntar på granskning`,
    title: "AI-assistenten",
    subtitle: "Integrerat AI-stöd för registreringsarbetet (Bilaga 1 §4.1)",
    here: "AI-stödet på den här sidan",
    hereLead:
      "AI-stödet är ett bestämt antal funktioner, var och en placerad där arbetet görs. Här står vilka som gäller den här sidan och var de övriga arbetar. Funktioner utanför din behörighet visas inte.",
    hereActive: "Arbetar här",
    hereActiveLead:
      "Knappen tar dig till den del av sidan där funktionen körs. Det den tar fram är förslag som du godkänner eller avvisar – ingenting sparas på vägen.",
    hereNone:
      "AI-stödet arbetar inte på den här sidan. Det är avsiktligt: stödet finns där arbetet görs, inte överallt.",
    hereElsewhere: "Arbetar i stället i",
    hereRationale:
      "§4.1 beskriver AI-stödet som integrerat och räknar upp fyra funktioner, var och en placerad där arbetet görs. Den här vyn säger var de är och var de inte är – en gräns som gränssnittet aldrig uttalar är en gräns köparen får ta på förtroende.",
    tabAbout: "Om",
    where: "Var",
    goThere: "Granska förslagen",
    tabsLabel: "AI-stödets delar",
    tabAsk: "Fråga",
    /* Verbs, because each tab is something the officer does. "Uppgifter" meant
       both *tasks* and *data*, and in a register it reads as the second. */
    tabTasks: "På sidan",
    tabQueue: "Granska",
    chat: {
      label: "Din fråga",
      placeholder: "T.ex. Vilka avtal löper ut inom 90 dagar?",
      ask: "Fråga",
      empty: "Skriv en fråga först.",
      notAuthorised: "Behörighet saknas",
      suggestions: (n: number) => `Snabbfrågor (${n})`,
      asked: "Ställd",
      openingLead:
        "Ställ en fråga om avtalen, medlingsärendena eller Märket. Svaret hämtas ur registret och visar de poster det räknade – du kan öppna varje post direkt härifrån.",
      seeAllIn: (screen: string) => `Visa alla i ${screen}`,
      clear: "Rensa samtalet",
      notStored: "Samtalet sparas inte.",
      feedback: {
        prompt: "Blev frågan rätt uppfattad?",
        good: "Ja",
        bad: "Nej",
        report: "Rapportera",
        thanks: "Tack – återkopplingen följer med i händelseloggen.",
        reported:
          "Rapporterad. Frågan och det körda urvalet följer med i händelseloggen för systemförvaltningens uppföljning.",
      },
      refused: (screen: string) =>
        `${screen} ingår inte i din behörighet, så frågan besvaras inte här. Behörigheten styrs av din roll och administreras av behörighetsadministratören.`,
      none: (what: string) => `Inga ${what} just nu.`,
      found: (n: number, what: string) => `${n} ${what}:`,
      unmatched:
        "Den frågan kan jag inte svara på. Jag svarar genom att hämta uppgifter ur registret, inte genom att formulera något – det här är vad jag kan hämta:",
      capabilities: "Det här kan jag hämta ur registret:",
      what: {
        expiring: {
          one: "avtal löper ut inom 90 dagar",
          many: "avtal löper ut inom 90 dagar",
        },
        incomplete: {
          one: "ofullständig registrering",
          many: "ofullständiga registreringar",
        },
        unpublished: {
          one: "avtal är klart men opublicerat",
          many: "avtal är klara men opublicerade",
        },
        mediations: { one: "pågående medlingsärende", many: "pågående medlingsärenden" },
        benchmark: { one: "registrerat märke", many: "registrerade märken" },
        agreements: { one: "avtal matchar", many: "avtal matchar" },
        capabilities: { one: "fråga", many: "frågor" },
      },
      boundedNote:
        "Assistenten kör en fråga mot registret och visar posterna. Den formulerar inga svar om kollektivavtal, eftersom ett sådant svar vore ett nytt påstående om arbetsmarknaden utan en post bakom sig. Behörigheten gäller även när frågan skrivs – en roll som inte får läsa ett register får inte heller svar om det.",
    },
    goWhereItWorks: (where: string) => `Gå till ${where}`,
    queue: "Väntar på din granskning",
    queueLead:
      "Ingenting av det här är sparat. Listan är det som AI-stödet har tolkat och som ännu inte har godkänts av en handläggare.",
    queueWhat:
      "Siffran är antalet förslag som AI-stödet har tagit fram och som ingen har godkänt än. Listan är gemensam för alla som får registrera i respektive register – inte personlig – och tömns när förslagen godkänns eller avvisas.",
    queueEmpty: "Ingenting väntar på granskning just nu.",
    queueCount: (n: number) => (n === 1 ? "1 att granska" : `${n} att granska`),
    functions: "Det här gör AI-stödet",
    boundaries: "Det här gör det inte",
    boundariesLead:
      "Gränserna står i §4.1 och är en del av det som upphandlas – en handläggare som inte ser var maskinen slutar kan inte granska den.",
    traceability: "Spårbarhet",
    traceabilityBody:
      "Både AI:ns förslag och handläggarens ändring registreras i ändringsloggen med gammalt värde, nytt värde, tidpunkt och användare.",
    traceabilityAction: "Öppna ändringsloggen",
    readOnly:
      "Din roll läser AI-förslagen men godkänner dem inte. Godkännande hör till den roll som får registrera i respektive register (NFÅ-003).",
  },
/* FSD-001 och FSD-002 – dokument ur Medlingsinstitutets egna mallar. */
  documentTemplate: {
    open: "Öppna dokumentmallen",
    openNote:
      "Mallen öppnas med information från MIIS redan ifylld. Ingenting skapas förrän handläggaren har granskat och tryckt Skapa dokument.",
    variant: "Variant",
    prefilled: "Förinmatat från MIIS",
    body: "Dokumentets text",
    bodyNote: "Texten kommer från mallen och kan ändras innan dokumentet skapas.",
    editedNote: "Texten är ändrad av handläggaren. Ändringen följer med i dokumentet och i ändringsloggen.",
    create: "Skapa dokument",
    created: "Dokument skapat",
    createdNote: "Dokumentet är skapat och kopplat till ärendet.",
    reopen: "Öppna mallen igen",
    fileNote: (name: string) => `Filen får namnet ${name}`,
  },


  /* Den guidade genomgången – granskarmaterial, inte MIIS. */
  walkthrough: {
    title: "Guidad genomgång",
    subtitle:
      "Rollbaserade användarscenarier och användargränssnitt, i den ordning tilldelningskriteriet bedömer dem. Varje steg byter roll och öppnar skärmen.",
    marker: "Granskarmaterial – ingår ej i systemet",
    markerBody:
      "Den här sidan är en läshjälp för Medlingsinstitutets granskare och för den muntliga presentationen. Den finns inte i menyn, och ingenting på den är föreslagen MIIS-funktionalitet.",
    scoredHeading: "De tre roller kriteriet namnger",
    scoredLead:
      "Bilaga 1 §3.1 definierar åtta roller och prototypen har alla åtta – NFÅ-003 är ett krav på systemet. Bedömningen görs på tre, och de kommer först.",
    supportingHeading: "Övriga roller",
    supportingLead:
      "Inte bedömda, och byggda ändå: ett anbud som visar bara minimum är inte det anbud som får mycket högt mervärde. De ligger här som bevis på att systemet är komplett, inte som ingång.",
    taskAndGoal: "Uppgift och mål",
    workflow: "Arbetsflöde",
    usability: "Användbarhet, effektivitet och tillgänglighet",
    step: (n: number) => `Steg ${n}`,
    contents: "Scenarier",
    contentsNote: (total: number, scored: number, steps: number) =>
      `${total} scenarier, varav ${scored} bedöms, tillsammans ${steps} steg. Ett scenario visas i taget.`,
    stepCount: (n: number) => `${n} steg`,
    scoredMark: "Bedöms",
    startScenario: "Börja scenariot",
    startScenarioNote:
      "Rollen byts och skärmen öppnas. Vägen vidare till nästa steg finns sedan i demoraden, på varje skärm.",
    openStep: (n: number) => `Öppna steg ${n}`,
    openStepAs: (n: number, role: string) => `Öppna steg ${n} som ${role}`,
    showSupporting: (n: number) => `Visa övriga roller (${n})`,
    hideSupporting: "Dölj övriga roller",
    roleNote: (role: string) =>
      `Aktuell roll: ${role}. Rollen byts av knapparna ovan och av rollväxlaren i demoraden.`,
    toStart: "Till startsidan",
    demoLink: "Guidad genomgång",
    backToGuide: "Översikt",
    position: (scenario: string, n: number, total: number) =>
      `${scenario} · steg ${n} av ${total}`,
    next: (label: string) => `Nästa: ${label}`,
    nextAs: (label: string, role: string) => `Nästa: ${label} (som ${role})`,
    lastStep: "Sista steget i scenariot",
    previous: (label: string) => `Tillbaka: ${label}`,
    endWalkthrough: "Avsluta genomgången",
  },  session: {
    title: "Din session håller på att gå ut",
    body: (minutes: number) =>
      `Du har varit inaktiv en längre stund. Av säkerhetsskäl loggas du ut automatiskt vid ${minutes} minuters inaktivitet.`,
    remaining: (mm: string) => `Tid kvar: ${mm}`,
    remainingAria: (minutes: number, seconds: number) =>
      `Sessionen avslutas om ${minutes} minuter och ${seconds} sekunder.`,
    unsaved: "Osparade uppgifter i pågående registrering går förlorade vid utloggning.",
    continueWorking: "Fortsätt arbeta",
    logout: "Logga ut",
  },

  confidentiality: {
    marked: "Sekretessmarkerad",
    markedAgreement: "Sekretessmarkerat avtal",
    maskedValue: "Uppgiften visas inte",
    reasonPublic: "Sekretessmarkerad uppgift visas inte i publika vyer",
    reasonMediator: "Sekretessmarkerad uppgift visas inte för medlare",
    reasonUnauthorised: "Du saknar behörighet att se sekretessmarkerad avtalsinformation",
    inStatistics: "Avtalet ingår ändå i statistik och sammanräkningar",
    setBy: "Sekretessmarkering sätts av avtalsadministratören och gäller främst bifogade dokument",
  },

  start: {
    heading: (role: string) => `Startsida – ${role}`,
    subheading:
      (minutes: number) =>
        `Rollanpassat innehåll enligt tilldelad roll och behörighet. Inloggad via EFOS-kort, sessionen avslutas efter ${minutes} minuters inaktivitet.`,
    benchmarkOverMonths: (n: number) => `över ${n} månader`,
    benchmarkKicker: "Referens i avtals- och medlarvyer",
    benchmarkLine: (period: string) => `Märket ${period}:`,
    benchmarkCostFrame: (v: string) => `Kostnadsram ${v}`,
    benchmarkPeriodisation: (v: string) => `Periodisering ${v}`,
    benchmarkSupplementary: (v: string) => `Tilläggsöverenskommelse: ${v}`,
    benchmarkValidity: (from: string, to: string, registered: string) =>
      `Gäller fr.o.m. ${from} t.o.m. ${to} · Registrerad ${registered}`,

    table: {
      status: "Status",
      agreement: "Avtal",
      signed: "Tecknades",
      validity: "Löptid",
      registrationStatus: "Reg.status",
    },

    uploadProtocol: "Ladda upp avtalsprotokoll",
    uploadDgDecision: "Ladda upp GD-beslut",
    newSearch: "Ny sökning",

    reminders: {
      title: "Mina påminnelser",
      lead:
        "Datum då ett avtal behöver ses över, tidigast först. Påminnelsen skickas också som e-post med länk till avtalet.",
      empty: "Inga påminnelser just nu.",
      footnote: "Påminnelser skickas även som e-post med länk till avtalet",
    },
    incomplete: {
      title: "Ofullständiga registreringar",
      lead:
        "Avtal som sparats med status Ofullständig och väntar på komplettering. Samma urval visas i Korttidslönerapporten med statuskolumn och länk till protokollet — det är där kompletteringen görs.",
      empty: "Alla registreringar är kompletta.",
      badge: "Ofullständig",
      footnote:
        "Visas i Konjunkturlönerapportens vy med statuskolumn, protokollslänk och vilka avtal som redan exporterats",
      action: "Öppna Konjunkturlönerapporten",
    },
    recent: {
      title: "Senast registrerade avtal",
      lead:
        "De senast registrerade avtalen, nyast först — handläggarens egen arbetslista och en snabb kontroll av att gårdagens registreringar hamnade rätt.",
      empty: "Inga avtal registrerade ännu.",
    },
    events: {
      title: "Senaste händelser",
      empty: "Inga händelser loggade ännu.",
      footnote: "Ur händelseloggen – fullständig logg under Administration",
    },
    ongoingMediations: {
      title: "Pågående medlingar",
      empty: "Inga pågående medlingar.",
      badge: "Pågående",
      footnote: "Medlingsärenden skapas automatiskt när ett GD-beslut laddas upp",
      action: "Öppna medlingsärenden",
    },
    dgDecisions: {
      title: "GD-beslut att slutföra",
      empty: "Inga beslut väntar på klarmarkering.",
      badge: "Ej klarmarkerat",
      footnote:
        "Vid klarmarkering skickas notifierings-epost med länk till medlaradministratören och sändningen loggas",
    },
    partyMeetings: {
      title: "Kommande partsträffar",
      empty: "Inga inplanerade partsträffar.",
      footnote: "Interaktiv vy för att föra in information direkt under mötet",
      action: "Öppna partsträffar",
      items: [
        "2027-06-04 · Almega Tjänsteförbunden – inför avtalsrörelsen",
        "2027-06-11 · IF Metall – samordnade avtalskrav",
      ],
    },
    mediatorRegister: {
      title: "Medlarregister",
      empty: "Inga medlare registrerade ännu.",
      assignments: (n: number) => `${n} uppdrag`,
      active: "Aktiv",
      inactive: "Inaktiv",
      footnote:
        "Statistik per medlare (år och avtalsområde) visas som beslutsstöd inför tillsättning",
      action: "Öppna medlarregistret",
    },
    casesNeedingMediators: {
      title: "Ärenden att komplettera med medlare",
      empty: "Inga ärenden att komplettera.",
      assigned: "Medlare tillsatta",
      missing: "Medlare saknas",
      footnote: "Notifiering kommer via e-post när ett medlingsbeslut klarmarkeras",
    },
    savedSearches: {
      title: "Sparade sökningar",
      footnote: "Sammansatta sökningar över flera handlingstyper – utan hjälpvariabler",
      action: "Öppna sökbyggaren",
      items: ["Årsrapport 2026", "Eurofound-urval", "Sifferlösa avtal privat sektor"],
    },
    snapshots: {
      title: "Bokslut och uttag",
      footnote:
        "Bokslut återskapar hur data såg ut vid en viss tidpunkt. Standardsökningar svarar inom 3 sekunder",
      latest: "Senast",
      items: [
        "Bokslut per 2026-12-31 · 143 träffar",
        "Export till Excel · 2026-12-31",
        "Export till CSV/JSON · 2026-11-30",
      ],
    },
    logs: {
      title: "Loggar",
      footnote:
        "Loggar bevaras i minst 24 månader och kan inte ändras eller raderas – inte heller av systemadministratören",
      action: "Öppna administrationsvyn",
      items: [
        "Ändringslogg · 1 284 poster senaste 30 dagarna",
        "Händelselogg · 96 poster senaste 30 dagarna",
        "Inloggningar · 412 poster senaste 30 dagarna",
      ],
    },
    watchwords: {
      title: "Bevakningsord",
      footnote: "Tabellen uppdateras inför kommande avtalsrörelse",
      active: "Aktivt",
      items: ["arbetstidsförkortning", "deltidspension", "jämställdhetspott"],
    },
    users: {
      title: "Användare och roller",
      footnote:
        "Behörigheter administreras av MI:s egna behörighetsadministratörer utan leverantörens medverkan",
      action: "Öppna användaradministrationen",
      active: "Aktiv",
      items: [
        "Anna Andersson · Avtalsadministratör",
        "Per Persson · Medlingsadministratör",
        "Karin Karlsson · Statistikanvändare",
      ],
    },
    userTasks: {
      title: "Att hantera",
      badge: "Åtgärd",
      item: "Ny medarbetare finns i Enterprise IAM/SSID – roll ej tilldelad",
      footnote: "Användare autentiseras med EFOS-kort via Försäkringskassans IdP (SAML 2.0)",
    },
    mediatorAssignments: {
      title: "Mina medlingsuppdrag",
      empty: "Inga aktiva uppdrag.",
      badge: "Pågående",
      item: "M-2027/12 · Spårtrafik – Tågföretagen / Seko · Ettan",
      footnote:
        "Extern åtkomst via Bank-ID genom Försäkringskassans identifieringslösning (option, steg 2)",
    },
    mediatorMaterial: {
      title: "Rapporter jag har tillgång till",
      items: [
        "Avtal – Medlare · avtalets löptider, uppsägning och länkade handlingar",
        "Avtal – Avtalsrörelse · avtal och anställda efter utlöpningstidpunkt",
        "Avtal – Utlöpningstidpunkter · gällande avtal per månad och arbetsgivargrupp",
      ],
      footnote:
        "Bilaga 1 §3.1 ger rollen Medlare behörigheten Specifika rapporter, och Bilaga 3 §5.1 namnger de tre. Sekretessmarkerad information utelämnas ur samtliga (NFÅ-004, FR-011).",
      action: "Öppna rapporterna",
    },
  },

  registrera: {
    title: "Registrera avtalsprotokoll",
    subtitle: "Inkommet protokoll tolkas med AI-stöd och granskas av handläggare innan sparande",
    stepsLabel: "Registreringens steg",
    stepState: { done: "Klart", current: "Pågår", upcoming: "Återstår" },
    steps: [
      "1. Ladda upp",
      "2. AI-analys",
      "3. Avtal (matchat)",
      "4. Löneavtal / Allmänna villkor",
      "5. Koppla protokoll",
    ],
    upload: {
      title: "Ladda upp avtalsprotokoll",
      intro:
        "Protokollet kommer in till MI som skannat dokument eller PDF och laddas upp av handläggaren.",
      dropHint: "Dra protokollet hit, eller välj det från datorn.",
      dropActive: "Släpp filen så börjar tolkningen",
      choose: "Välj fil",
      accepts: "PDF, TIFF, PNG eller JPG",
      fileNameNote:
        "Framgår inte avtalsnamnet av protokollet används filnamnet som identifieringsunderlag.",
      rejected: (name: string) =>
        `${name} har ett filformat som inte kan OCR-tolkas. Ladda upp PDF, TIFF, PNG eller JPG.`,
      pipelineTitle: "Detta sker automatiskt när filen är uppladdad",
      stages: {
        receive: "Tar emot dokumentet och kopplar det till avtalet",
        ocr: "OCR-tolkar skannad text",
        watchwords: "Söker bevakningsord ur bevakningsordstabellen",
        match: "Matchar innehållet mot befintliga avtal",
      },
      progress: (done: number, total: number) => `${done} av ${total} steg klara`,
      ready: (name: string) => `${name} är inläst och tolkad.`,
      replace: "Byt protokoll",
      replaceWarning: (n: number) =>
        n === 1
          ? "Byter du protokoll nollställs formuläret, inklusive 1 uppgift du har justerat."
          : n === 0
            ? "Byter du protokoll nollställs formuläret och godkännandet."
            : `Byter du protokoll nollställs formuläret, inklusive ${n} uppgifter du har justerat.`,
      replaceConfirm: "Ja, byt protokoll",
      replaceCancel: "Behåll protokollet",
      size: (kb: string) => `${kb} kB`,
      identifiedAs: (name: string) => `Identifieringsunderlag från filnamnet: ${name}`,
      demoNote:
        "I mockupen är filens namn och storlek den uppladdade filens, medan protokolltexten nedan är förberedd exempeldata. En verklig installation OCR-tolkar den uppladdade filen.",
    },
    document: {
      ocr: "OCR",
      viewLabel: "Visning av protokollet",
      viewText: "Text",
      viewOriginal: "Original",
      originalAlt: "Inskannad sida 1 av avtalsprotokollet mellan Föreningen Industriarbetsgivarna och Unionen",
      openFullSize: "Öppna sidan i full storlek",
      originalNote: "Sidan är Medlingsinstitutets eget exempel ur Bilaga D till kravspecifikationen. Namnteckningarna är maskerade i originalet.",
      watchwordHits: (n: number) => `Markerad text = träff i bevakningsordstabellen (${n} träffar)`,
      sourceHint:
        "Välj AI-märket vid ett fält till höger så markeras stycket det lästes ur här i protokollet.",
      sourceActive: (field: string) => `Visar källa för: ${field}`,
      /*
        MI's own protocol, Bilaga D of Bilaga 1 — Föreningen Industriarbetsgivarna
        and Unionen, Stål- och metallindustrin, signed in Stockholm on
        2020-10-31. Transcribed from the scanned page in `public/protokoll-sida-1.png`,
        which is the same page the Original view shows, so the text view is the
        OCR of what the image contains and nothing else.

        Not translated: it is a Swedish document, and rendering it in English
        would describe a system reading something it will never be given.
      */
      clauseSearch: {
        title: "Sök efter en skrivning i protokollet",
        optional: "Frivilligt steg",
        intro:
          "Skriv vad du letar efter, så söker AI-stödet igenom protokollet och föreslår träffarna för registrering. Ingenting sparas förrän du godkänner det, och varje förslag pekar tillbaka på stycket det lästes ur.",
        purpose:
          "Använd den när protokollet innehåller en skrivning som inte hör hemma i något fält – jämställdhet, arbetstidsförkortning, deltidspension. Godkända träffar hamnar under Särskilda frågor på avtalet, med protokollets egen text som avtalstext.",
        label: "Sökord",
        placeholder: "T.ex. jämställdhet",
        search: "Sök i protokollet",
        tooShort: "Skriv minst två tecken.",
        suggested: "Vanliga sökningar:",
        results: (term: string) => `Träffar på ”${term}”`,
        noHits: (term: string) =>
          `Ingen skrivning om ”${term}” hittades i protokollet. Prova ett annat ord – sökningen omfattar protokollets text, inte hela registret.`,
        equality: "Jämställdhetsfråga",
        wouldRegister: (question: string) =>
          `Registreras som särskild fråga: ${question}. Stycket blir avtalstexten, oredigerat.`,
        showSource: "Visa i protokollet",
        registered: "Godkänt. Skrivningen registreras som särskild fråga på avtalet.",
        registeredWhere: "Den hittas under Särskilda frågor när avtalet är sparat.",
        rejected: "Avvisat. Ingenting registrerades.",
        boundedNote:
          "Det här är den fritextsökning §4.1 begär, och den är avgränsad som kravet avgränsar den: ett sökord, ett protokoll, och ett förslag av en känd form. En ruta som tar emot vilken instruktion som helst har ingen definierad utdata och därmed ingenting att granska – och FAI-002 är en garanti om granskning.",
      },

      lines: {
        heading: "ÖVERENSKOMMELSE",
        betweenLabel: "mellan",
        employerParty: "Föreningen Industriarbetsgivarna",
        andLabel: "och",
        employeeParty: "Unionen",
        area: "(Stål- och metallindustrin)",
        preamble:
          "Föreningen Industriarbetsgivarna och Unionen är överens om avtal avseende löner och allmänna anställningsvillkor samt övriga frågor enligt nedan.",
        validityHeading: "1  Avtalets giltighetstid",
        prolonged:
          "Parterna är överens om att avtalet om Allmänna Anställningsvillkor som sades upp den 20 december 2019 ska gälla med angivna ändringar och tillägg från och med den 1 november 2020 till och med den 31 mars 2023.",
        period:
          "Överenskommelsen omfattar avtalsperioden 2020-2023 varmed avses avtalsåren 1 november 2020 – 31 mars 2022 och den 1 april 2022 – 31 mars 2023.",
        terminationLead: "Part äger rätt att senast den 30 september 2021",
        termination: "säga upp avtalet att upphöra att gälla per den 31 mars 2022.",
        renegotiation:
          "Tidsplan och procedur mm för omförhandling framgår av Industriavtalet.",
        peaceHeading: "2  Fredsplikt",
        peace: "Fredsplikt gäller under avtalsperioden.",
        scopeHeading: "3  Överenskommelsens omfattning",
        scopeA: "Protokoll med anteckningar, Bilaga A",
        wageAppendix: "Löneavtal, Bilaga B",
        scopeC: "Tekniska anvisningar till löneavtalet, Bilaga C",
        workingTime: "Direktiv arbetsgrupp löneavtal, Bilaga D",
        scopeE: "Direktiv industrigemensamma arbetsgrupper, Bilaga E",
        pension:
          "§ 5  Parterna är överens om att ytterligare deltidspensionspremie avsätts med 0,4 % per den 1 november 2020.",
        negotiation: "Stockholm den 31 oktober 2020",
        signatures: "[Namnteckningar maskerade i MI:s exempel]",
        footer: "Avtal 20 Industriarbetsgivarna & Unionen (Stål- och metallindustrin)",
      },
    },
    analysis1: {
      title: "AI-analys 1 – identifiering av avtal",
      area: "Avtalsområde",
      matched: "Avtal (befintligt i MIIS)",
      alternativeName: "Alternativt avtalsnamn",
      agreementType: "Avtalstyp",
      employerOrg: "Avtalspart AGO",
      employeeOrg: "Avtalspart ATO",
      matchedReason: (reason: string) => `Matchat på ${reason.toLowerCase()}`,
      validation:
        "Validering och logiska kontroller: inga avvikelser. Framgår inte avtalsnamnet av protokollet används filnamnet eller parternas gemensamma avtal som underlag.",
    },
    analysis2: {
      title: "AI-analys 2 – löptid och uppsägning",
      signedDate: "Teckningsdatum",
      validity: "Löptid",
      termination: "Uppsägningsmöjlighet",
      nothingAutomatic:
        "Inget sparas automatiskt – felaktiga AI-förslag korrigeras fritt före godkännande",
    },
    review: {
      /* The sketch's title: it states the AI's claim and the obligation in one line. */
      heading: "Matchat avtal – AI-förslag kräver ditt godkännande",
      aiFilled: "AI-förslag",
      adjusted: "Justerad",
      sourceButton: (field: string) => `AI-förslag – visa källan till ${field} i protokollet`,
      aiLegend:
        "Fält märkta AI är förifyllda av AI-analysen. Välj AI-märket vid ett fält så markeras stycket det lästes ur i protokollet till vänster.",
      lockedByApproval: "Låst av godkännandet – öppna registreringen för att ändra",
      approvedLockNote:
        "Fälten är låsta av godkännandet. De går att läsa och kopiera men inte ändra – välj Öppna för ändring om något behöver rättas.",
      aiProposed: (value: string) => `AI föreslog: ${value}`,
      reset: "Återställ AI-förslaget",
      resetFor: (field: string) => `Återställ AI-förslaget för ${field}`,
      /* FAI-002, on screen next to the control it describes. */
      nothingSaved: "Inget sparas utan manuellt godkännande",
      approve: "Godkänn AI-förslagen",
      approved: "AI-förslagen är godkända",
      reopen: "Ändra",
      adjustedCount: (n: number) =>
        n === 1
          ? "1 uppgift är justerad av handläggaren"
          : `${n} uppgifter är justerade av handläggaren`,
      noneAdjusted: "Alla uppgifter är oförändrade sedan AI-analysen",
      emptyBlocks: (n: number) =>
        n === 1
          ? "1 obligatorisk uppgift är tom. Registreringen kan sparas som ofullständig och kompletteras senare."
          : `${n} obligatoriska uppgifter är tomma. Registreringen kan sparas som ofullständig och kompletteras senare.`,
      changeLogNote:
        "Både AI:ns förslag och handläggarens ändring registreras i ändringsloggen med tidpunkt och användare.",
    },
    wage: {
      title: "Löneavtal 2027",
      intro:
        "Avtalsrörelsen 2027 ger avtalet en ny rad. Föregående löneavtal ligger kvar oförändrat i avtalsvyn.",
      construction: "Avtalskonstruktion (1–7)",
      constructionHint: "Sju MI-definierade konstruktioner",
      scope: "Löneutrymme (%)",
      costFrame: "Kostnadsram (%)",
      individualGuarantee: "Individgaranti",
      workingTimeFlag: "Arbetstidsförkortning",
      workingTimeCost: "Kostnad för arbetstidsförkortning (%)",
      revisionDate: "Lönerevision, datum",
      revisionPercent: "Lönerevision (%)",
      revisionHint: "Kopplad till löneavtalet",
      minimumWage: "Lägstalön (kr/mån)",
      minimumWageDate: "Lägstalön gäller från",
      minimumWageHint: "Kopplad till löneavtalet",
      equalityFlag: "Jämställdhetsflagga – skrivning identifierad",
      benchmarkFlag: "Industrimärke (märkessättande avtal)",
    },
    terms: {
      title: "Allmänna villkor",
      intro:
        "Registreras bara när villkoren har en annan löptid än löneavtalet. Lämna fälten tomma om löptiderna följs åt.",
      ownSignedDate: "Eget teckningsdatum",
      ownValidFrom: "Egen giltighet från",
      ownValidTo: "Egen giltighet till",
      ownValidity: "Egen giltighetsperiod",
      note: "Löptiderna för löneavtal och allmänna villkor behöver inte följas åt",
    },
    link: {
      title: "Koppla förhandling och protokoll",
      negotiation: "Registrerad förhandling",
      linkedAgreement: "Avtal",
      linkedWage: "Löneavtal",
      linkedNegotiation: "Förhandling",
      documentLinkedToHint:
        "Följer av vad registreringen skapar – ett protokoll som bara etablerar allmänna villkor ger inget löneavtal att koppla till.",
      documentLinkedTo: "Dokument kopplas till",
      documentLinkedToValue: "Avtal + löneavtal + förhandling",
    },
    save: {
      title: "Spara registrering",
      registrationStatus: "Registreringsstatus",
      statusFromAction:
        "Sätts av valet nedan: Godkänn och koppla ger status Klar, Spara som ofullständig ger status Ofullständig.",
      agreementStatus: "Avtalets status",
      statusKey: "Så visas statusen i avtalslistor och rapporter:",
      approveAndLink: "Godkänn och koppla protokoll",
      approveFirst: "Godkänn AI-förslagen först — inget kan kopplas innan de är granskade.",
      registered: "Protokollet är registrerat och kopplat",
      registeredWhere:
        "Avtalet ligger nu i avtalsregistret med status Nytecknat utan medling och syns i Avtal, i Sök och i rapporterna. Ändringsloggen har registrerat vem som godkände och när.",
      registeredNext: "Öppna avtalet",
      registeredNote:
        "Avtalet, löneavtalet och förhandlingen är kopplade till protokollet. Ändringsloggen har registrerat vem som godkände och när.",
      reopen: "Ändra registreringen",
      saveIncomplete: "Spara som ofullständig",
      savedIncomplete: "Sparat som ofullständigt",
      incompleteNext: "Öppna avtalet och se vad som återstår",
      savedIncompleteNote:
        "Registreringen ligger kvar med status Ofullständig och en påminnelse skickas tills uppgifterna kompletteras. Avtalet syns i avtalsregistret, märkt Ofullständig.",
      incompleteNote: "Ofullständig registrering följs upp med påminnelse",
      confidentialityLabel: "Sekretessmarkera avtalet",
      confidentialityHint:
        "Sätts av avtalsadministratören, gäller främst bifogade dokument och döljer detaljer för medlare och allmänhet",
      auditNote:
        "Vid sparande registrerar ändringsloggen vad som ändrats, av vem och när, och händelsen ”avtal tecknat” läggs i händelseloggen. Tecknas avtalet efter medling färgkodas det rött i stället för grönt.",
    },
  },

  sok: {
    intent: {
      title: "Beskriv sökningen",
      label: "Vad vill du söka fram?",
      placeholder: "T.ex. avtal inom privat sektor som gällde 2027",
      hint: "Skriv en mening. Förslaget visas för granskning innan något ställs in.",
      emptyReason: "Skriv en mening först – det finns inget att tolka än.",
      submit: "Tolka",
      proposalLead: "Förslag till urval. Ingenting är inställt förrän du godkänner.",
      infoTypeName: "Informationstyp",
      readFrom: "Läst ur",
      assumed: "Antaget, inget ord angav register:",
      defaultRegister: "avtal",
      unused: (words: string) => `Kunde inte tolkas: ${words}. Lägg till kriteriet för hand om det behövs.`,
      replaces: (n: number) =>
        n === 1
          ? "Godkänn ersätter sökningen du redan byggt (1 villkor)."
          : `Godkänn ersätter sökningen du redan byggt (${n} villkor).`,
      approve: "Godkänn och fyll i sökningen",
      nothingLabel: "Inget förslag",
      nothing:
        "Ingen del av meningen matchade ett kriterium som sökningen har. Sök på informationstyp, sektor, avtalskonstruktion, industrimärke eller ett datum – eller bygg villkoren för hand nedan.",
      appliedLabel: "Ifyllt",
      applied:
        "Kriterierna är ifyllda i sökbyggaren nedan. Ändra dem som vanligt innan du går vidare – sökningen körs inte av förslaget.",
      rejectedLabel: "Avvisat",
      rejected: "Förslaget avvisades. Ingenting ställdes in.",
    },
    title: "Sök",
    subtitle: "Sammansatt sökning över flera handlingstyper, med bokslut och export",
    criteria: {
      title: "Urvalskriterier",
      infoTypeLabel: "Informationstyp",
      groupLabel: (n: number) => `Grupp ${n}`,
      groupJoinLabel: (n: number) => `Operator för grupp ${n}`,
      groupJoinAll: "OCH",
      groupJoinAny: "ELLER",
      joinExplain:
        "Villkor inom en grupp kombineras med gruppens operator. Grupperna kombineras med varandra. Det gör (A ELLER B) OCH C uttryckbart – dagens sökbyggare klarar bara en platt lista.",
      expression: "Uttryck:",
      addCondition: "Lägg till villkor",
      addGroup: "Lägg till grupp",
      removeCondition: (label: string) => `Ta bort villkoret ${label}`,
      removeGroup: (n: number) => `Ta bort grupp ${n}`,
      fieldAria: (group: number, row: number) => `Fält, villkor ${row} i grupp ${group}`,
      operatorAria: (group: number, row: number) => `Operator, villkor ${row} i grupp ${group}`,
      valueAria: (group: number, row: number) => `Värde, villkor ${row} i grupp ${group}`,
      freeText: "Fritext i uppladdade dokument och urval",
      freeTextValue: "arbetstidsförkortning",
      documentTypes: "Handlingstyper i sökningen",
      documentTypesSelected: (n: number, total: number) =>
        `${n} av ${total} handlingstyper valda – dagens sökbyggare klarar högst två samtidigt`,
      documentTypesNote:
        "Fullt stöd utan de tekniska hjälpvariabler som dagens sökbyggare kräver",
      snapshot: "Bokslut – återskapa data per",
    },
    columns: {
      title: "Presentationskolumner",
      intro: "Bocka ur en kolumn för att utelämna den ur resultatet och utskriften.",
      identityLocked: "Bär postens namn och länken som öppnar den",
      nothingToSave: "Inget urval att spara – lägg till minst ett villkor.",
      saveNameLabel: "Namn på sökningen",
      saveNameHint: "T.ex. Sifferlösa avtal privat sektor",
      nameRequired: "Ge sökningen ett namn först.",
      saveSearch: "Spara sökning",
      savedSearchName: "Årsrapport 2026",
      savedSearchBlocked:
        "En sparad sökning hör till en användare, och användaren är en länk till en identitet hos Försäkringskassan som prototypen inte har något lager bakom.",
      savedSearchNote:
        "En sparad sökning återanvänds senare och ger då uppdaterade siffror – urvalet sparas, inte resultatet.",
      items: [
        "Avtal",
        "Parter (AGO/ATO)",
        "Avtalskonstruktion",
        "Löneutrymme %",
        "Anställda",
        "Branschkod",
      ],
    },
    chips: {
      heading: "Aktivt urval",
      remove: (label: string) => `Ta bort urvalet ${label}`,
      clearAll: "Rensa urvalet",
      empty: "Inget urval valt – sökningen omfattar alla avtal.",
    },
    saved: {
      title: "Sparade sökningar",
      note: "Öppnar urvalet, inte ett sparat resultat – registret svarar med det som gäller idag.",
      conditions: (n: number) => `${n} villkor`,
    },
    results: {
      /* The bokslut is named only where the population has periods — a party
         is not in force between two dates. */
      title: (hits: number, seconds: string, date?: string) =>
        `Resultat · ${hits} ${hits === 1 ? "träff" : "träffar"} · ${seconds} s${date ? ` · Bokslut per ${date}` : ""}`,
      responseNote: (seconds: string) =>
        `Svarstid ${seconds} s. Kravet är svar inom 3 sekunder för standardsökningar.`,
      liveNote: "Resultatet nedan smalnar av medan urvalet ändras.",
      empty: "Ingen post matchar urvalet. Ta bort ett villkor eller byt operator.",
      /* One column set per information type — they are four registers, not one
         table with a filter on it. */
      mediationCase: "Ärende",
      mediationType: "Typ av medling",
      mediators: "Medlare",
      negotiation: "Förhandling",
      negotiationType: "Typ",
      party: "Part",
      partyType: "Partstyp",
      sector: "Sektor",
      linkedAgreements: "Kopplade avtal",
      centralOrganisation: "Centralorganisation",
      negotiationStatus: {
        ongoing: "Pågående",
        "closed-with-agreement": "Avslutad med avtal",
        "closed-without-agreement": "Avslutad utan avtal",
      },
      status: "Status",
      agreement: "Avtal",
      parties: "Parter",
      construction: "Konstruktion",
      scope: "Löneutr. %",
      open: "Öppna",
      openAt: (date: string) => `Visa per ${date}`,
      pointInTimeNote:
        "Enskilt avtal öppnas med de löneavtal och allmänna villkor som var giltiga vid tidpunkten",
      stage2Note: "Steg 2: även avtalsområde med tillhörande avtal vid vald tidpunkt",
      exportNote: "Sammansatta sökningar över flera handlingstyper – utan hjälpvariabler",
      savedSearches: "Sparade sökningar:",
    },
  },

  medling: {
    title: "Medling",
    subtitle: "Medlingsärenden från GD-beslut, med kopplade avtal och tillsatta medlare",
    empty: "Inga medlingsärenden registrerade i denna datamängd.",
    table: {
      caseNumber: "Ärende",
      name: "Avtalsområde",
      type: "Typ",
      dgDecision: "GD-beslut",
      agreements: "Kopplade avtal",
      mediators: "Medlare",
      status: "Status",
    },
    noMediators: "Inga tillsatta",
    open: "Öppna ärendet",
  },

  mediationCase: {
      tabs: {
        label: "Delar av medlingsärendet",
        case: "Ärendet",
        mediators: "Medlare",
        documents: "Handlingar",
        outcome: "Utfall",
      },
    heading: (number: string, type: string) => `Medlingsärende ${number} – ${type}`,
    uploaded: (number: string) => `${number} – uppladdat, ärende skapat automatiskt`,
    registryNumber: "Diarienummer (diariesystemet)",
    decisionDate: "Beslutsdatum",
    type: "Typ",
    dgDecisionDocument: "GD-beslut (dokument)",
    linkedAgreements: (n: number) => `Kopplade avtal (${n})`,
    linkAgreement: "Koppla avtal",
    linkedNote:
      "Röd markering = koppling till medling. Ett medlingsärende kan kopplas till flera avtal.",
    mediators: "Medlare (ur medlarregistret)",
    addMediator: "Lägg till medlare",
    noMediators:
      "Inga medlare tillsatta – parterna medlar i egen regi enligt förhandlingsordningsavtal.",
    previousAssignments: (n: number) => `${n} tidigare uppdrag`,
    position: (p: string) => `Position: ${p}`,
    mediatorStatsNote: "Statistik per medlare (år och avtalsområde) visas i medlarregistret",
    procedureAgreement: "Förhandlingsordningsavtal",
    coveredNot: "Avtalsområdet täcks INTE av förhandlingsordningsavtal.",
    covered: "Avtalsområdet täcks av förhandlingsordningsavtal.",
    miAppoints: "Medlingsinstitutet tillsätter medlare.",
    partiesMediate: "Parterna medlar i egen regi. MI tillsätter ingen medlare.",
    procedureNote:
      "Omfattas avtalet av förhandlingsordningsavtal medlar parterna i egen regi och MI tillsätter ingen medlare.",
    benchmarkTitle: "Märket (referens i medlarvyn)",
    benchmarkMonths: (n: number) => `${n} månader`,
    benchmarkPeriod: (from: string, to: string) => `Perioden ${from} – ${to}`,
    documents: "Dokument och åtgärder",
    createDecision: "Skapa GD-beslut om medling",
    withNotice: "Med varsel",
    withoutNotice: "Utan varsel",
    decisionNumber: "Beslutsnummer",
    sourceCase: "Ur medlingsärendet",
    sourceRegister: "Ur medlarregistret",
    decisionHeading: (nr: string) => `Generaldirektörens beslut nr ${nr}`,
    decider: "Beslutande",
    presenter: "Föredragande",
    matter: "Ärende",
    mediation: "Medling",
    bodyWithNotice: (area: string, mediators: string) =>
      `Efter begäran från berörda parter och med anledning av varsel om stridsåtgärder förordnar Medlingsinstitutet om medling i tvisten mellan parterna om ett nytt kollektivavtal (${area}).\n\nTill medlare utses ${mediators}.`,
    bodyWithoutNotice: (area: string, mediators: string) =>
      `Efter samtycke från berörda parter förordnar Medlingsinstitutet om medling i tvisten mellan parterna om ett nytt kollektivavtal (${area}).\n\nTill medlare utses ${mediators}.`,
    decisionLogNote:
      "Beslutet kopplas till medlingsärendet och registreras i ändringsloggen med tidpunkt och användare. Bilaga E visar Medlingsinstitutets egna exempel på båda varianterna.",
    finalise: "Klarmarkera beslut",
    finaliseNote: "Notifierings-epost med länk skickas till medlaradministratör och loggas",
    templateNote:
      "Dokumentmallarna förifylls med information från MIIS och kan redigeras före färdigställande",
    admin: {
      remove: "Ta bort",
      mediatorLabel: "Medlare ur registret",
      mediatorPlaceholder: "Välj medlare",
      positionLabel: "Position",
      appoint: "Förordna medlaren",
      pickMediator: "Välj en medlare först.",
      noCandidates:
        "Alla aktiva medlare som tar den här medlingstypen är redan förordnade i ärendet.",
      mediatorAdded: (name: string, position: string) =>
        `${name} är förordnad som ${position.toLocaleLowerCase("sv")}. Förordnandet räknas i medlarens statistik.`,
      mediatorRemoved: (name: string) => `${name} är inte längre förordnad i ärendet.`,
      mediatorNote:
        "Bara aktiva medlare som tar den här medlingstypen visas i listan. Positionen ettan eller tvåan är det som räknas i statistiken per medlare.",
      noAgreements: "Inget avtal är kopplat till ärendet ännu.",
      agreementLabel: "Avtal ur avtalsregistret",
      agreementPlaceholder: "Välj avtal",
      link: "Koppla avtalet",
      pickAgreement: "Välj ett avtal först.",
      noAgreementCandidates: "Samtliga avtal i datamängden är redan kopplade till ärendet.",
      agreementAdded: (name: string) => `${name} är kopplat till medlingsärendet.`,
      agreementRemoved: (name: string) => `${name} är inte längre kopplat till ärendet.`,
      noOutcome:
        "Inget utfall registrerat. Utfallet registreras när medlingen är avslutad och är underlaget för Medlingsinstitutets statistik över stridsåtgärder.",
      actionTypePlaceholder: "T.ex. strejk, blockad, lockout",
      finalisedLabel: "Beslutet klarmarkerat",
      finalisedNote: (date: string, by: string) =>
        `Klarmarkerat ${date} av ${by}. Notifierings-epost med länk till ärendet har skickats till medlaradministratören, och utskicket ligger i händelseloggen.`,
      reopenDecision: "Ångra klarmarkeringen",
    },
    outcome: "Medlingsresultat",
    outcomeType: "Typ av medling",
    industrialAction: "Stridsåtgärder",
    industrialActionType: "Typ av stridsåtgärd",
    lostWorkingDays: "Förlorade arbetsdagar",
    affectedEmployees: "Antal berörda anställda",
    outcomeNote:
      "Avslutas medlingen utan att avtal tecknas markeras förhandlingen som avslutad med status. Tecknas avtal efter medlingen färgkodas det rött och kopplas via protokollsregistreringen.",
    registerStanding: "Registrera fast medling (förenklat formulär)",
    eventLog: "Händelselogg på berörda avtal",
    eventLogNote: "Avtalen färgkodas röda i vyerna som avtal med koppling till medling",
  },

  decisionSupport: {
    title: "Beslutsstöd inför medlingen",
    subtitle: "Underlag ur MIIS – inget beslut fattas av systemet",
    open: "Öppna beslutsstöd",
    closeAria: "Stäng beslutsstöd",
    otherParties: "Övriga parter på avtalsområdet",
    previousMediations: "Tidigare medlingar",
    contagionRisk: "Spridningsrisk",
    scopeNote:
      "Beslutsstödet sammanställer uppgifter som redan finns i MIIS. Det föreslår aldrig en medlare, en åtgärd eller ett utfall – bedömningen görs av medlingsadministratören.",
    reviewNote: "Kontrollera alltid mot källdokumenten innan beslut.",
  },

  rapporter: {
    intent: {
      title: "Beskriv rapporten",
      label: "Vilken rapport behöver du?",
      placeholder: "T.ex. vilka avtal löper ut 2027",
      hint: "Skriv en mening. Förslaget visas för granskning innan urvalsbilden fylls i.",
      emptyReason: "Skriv en mening först – det finns inget att tolka än.",
      submit: "Tolka",
      proposalLead: "Förslag till rapport och urval. Rapporten körs inte av förslaget.",
      reportName: "Rapport",
      readFrom: "Läst ur",
      unused: (words: string) => `Kunde inte tolkas: ${words}. Komplettera urvalsbilden för hand om det behövs.`,
      assumed: "Antaget, ingen rapport namngavs",
      replaces: "Godkänn ersätter urvalsbilden du fyllt i och tar bort resultatet på skärmen.",
      approve: "Godkänn och fyll i urvalsbilden",
      nothingLabel: "Inget förslag",
      nothing:
        "Ingen rapport kunde utläsas av meningen. Nämn rapporten vid namn eller vad den svarar på, till exempel utlöpningstidpunkter, avtalsrörelse eller huvudrapport – eller välj i listan nedan.",
      refusedLabel: "Ingår inte i behörigheten",
      refused: (name: string) =>
        `${name} ingår inte i behörigheten för den här rollen. Rapportförslaget avvisas därför – vilka rapporter en roll får köra bestäms av behörigheten, inte av vad som skrivs här.`,
      appliedLabel: "Ifyllt",
      applied:
        "Rapporten är vald och urvalsbilden ifylld nedan. Kontrollera kriterierna och kör rapporten som vanligt.",
      rejectedLabel: "Avvisat",
      rejected: "Förslaget avvisades. Ingenting ställdes in.",
    },
    document: {
      withheld: {
        sv: "Avtalet är sekretessmarkerat. Uppgifterna lämnas inte ut i den här rapporten.",
        en: "The agreement is confidentiality-marked. Its details are not released in this report.",
      },
      identity: { sv: "Avtalet", en: "The agreement" },
      rounds: { sv: "Avtalsrörelser", en: "Bargaining rounds" },
      noRounds: { sv: "Inget löneavtal registrerat", en: "No wage agreement registered" },
      lifecycle: { sv: "Uppsägning och prolongering", en: "Termination and prolongation" },
      scope: { sv: "Avtalets omfattning", en: "Scope of the agreement" },
      agreement: { sv: "Avtal", en: "Agreement" },
      employerOrg: { sv: "Arbetsgivarorganisation", en: "Employer organisation" },
      employeeOrg: { sv: "Arbetstagarorganisation", en: "Employee organisation" },
      agreementType: { sv: "Avtalstyp", en: "Agreement type" },
      sector: { sv: "Sektor", en: "Sector" },
      industryCode: { sv: "Branschkod", en: "Industry code" },
      signedDate: { sv: "Avtalet tecknades", en: "Agreement signed" },
      validity: { sv: "Löptid", en: "Validity" },
      year: { sv: "Årtal", en: "Year" },
      construction: { sv: "Avtalskonstruktion", en: "Agreement construction" },
      wageScope: { sv: "Löneutrymme (%)", en: "Wage scope (%)" },
      costFrame: { sv: "Kostnadsram (%)", en: "Cost frame (%)" },
      period: { sv: "Period", en: "Period" },
      expiresWithoutRenewal: { sv: "Upphör utan uppsägning", en: "Expires without notice" },
      earlyTermination: { sv: "Uppsagt i förtid", en: "Terminated early" },
      terminated: { sv: "Avtalet upphört", en: "Agreement ended" },
      employees: { sv: "Anställda", en: "Employees" },
      emptyPopulation: "Inget avtal ingår i det här uttaget.",
    },
    population: {
      pension: "Pensionsavtal och övriga avtal",
      pensionNote:
        "Avtal med registrerad avtalstyp. Urvalskriterierna ovan avgränsar underlaget.",
      website: "Publiceringsunderlag för mi.se",
      eurofound: "Eurofound och minimilönerapportering",
      selectionNote:
        "Urvalet styrs av avtalets eget rapporturval, inte av partskriterierna – Medlingsinstitutet avgör per avtal vad som går ut var.",
    },
    title: "Rapporter",
    subtitle: "Rapportuttag, bevakningslistor och schemalagda utskick",
    tabs: {
      label: "Rapportsidans delar",
      run: "Rapportuttag",
      shortTerm: "Konjunkturlönerapporten",
      scheduled: "Schemalagda uttag",
    },
    shortTerm: {
      heading: "Konjunkturlönerapporten",
      intro:
        "Bevakade avtal inför nästa uttag. Rapporten skrivs ut ur den här vyn, och ett avtal kan tas med även när registreringen ännu inte är klar – protokollet finns länkat oavsett.",
      period: "Uttagsperiod",
      lastExport: "Senaste uttag",
      table: {
        select: "Med i uttaget",
        agreement: "Avtal",
        parties: "Parter",
        registration: "Registreringsstatus",
        protocol: "Protokoll",
        exported: "Tidigare exporterat",
        reminder: "Påminnelse",
      },
      registered: "Registrerat",
      partiallyRegistered: "Delvis registrerat",
    notRegistered: "Ej registrerat",
      openProtocol: "Öppna protokoll",
      protocolMissing: "Protokoll saknas",
      protocolIncompleteNote:
        "Protokollet är länkat även för delvis registrerade avtal – handläggaren kan läsa källan utan att först komplettera registreringen.",
      exportedYes: (date: string) => `Ja · ${date}`,
      exportedNo: "Nej",
      setReminder: "Sätt påminnelse",
      reminderSet: (date: string) => `Påminnelse ${date}`,
      reminderChange: "Ändra",
      reminderRemove: "Ta bort",
      reminderHeading: (name: string) => `Påminnelse för ${name}`,
      reminderIntro:
        "Datumet då avtalet ska ses över igen. Påminnelsen räknas på startsidan och skickas som e-post till avtalsadministratören den dagen.",
      reminderDate: "Påminn den",
      reminderSave: "Spara påminnelsen",
      reminderDateRequired: "Välj ett datum först.",
      reminderSavedNote: (name: string, date: string) =>
        `Påminnelse satt på ${name} till ${date}. Den syns på startsidan och skickas som e-post den dagen.`,
      reminderRemovedNote: (name: string) => `Påminnelsen på ${name} är borttagen.`,
      selectedCount: (selected: number, total: number) =>
        `${selected} av ${total} avtal med i uttaget`,
      incompleteWarning: (n: number) =>
        `${n} avtal i uttaget är delvis registrerade. De tas med, och markeras i rapporten.`,
      export: "Skriv ut rapporten",
      exportFormats: "Word · Excel · PDF",
      markExported: "Markera som exporterat",
      markExportedNothing: "Inget avtal är valt för uttaget.",
      markExportedDone: (n: number, date: string) =>
        `${n} avtal är markerade som exporterade ${date}.`,
      markExportedNote:
        "Uttaget noteras per avtal, så nästa uttag visar vad som redan levererats till rapporten.",
    },
    runner: {
      heading: "Rapportuttag",
      intro:
        "Välj rapport, fyll i urvalet och generera. Urvalskriterierna skiljer sig mellan rapporterna och följer Medlingsinstitutets egna urvalsbilder; de kriterier som lämnas tomma skrivs ut som Alla.",
      pick: "Välj rapport",
      all: "Alla",
      format: "Format",
      needsServer: "kräver serverdrift",
      formatNote: "Endast PDF körs i mockupen — övriga format kräver serverdrift.",
      generate: "Generera rapport",
      selectionHeading: "Urvalskriterier",
      stage2: "Steg 2",
      stage2Reason: "Rapporten är markerad som Steg 2 i Medlingsinstitutets egen kravtabell.",
      bilagaF: (n: number) => `Bilaga F, rapport ${n}`,
      noSelectionLabel: "Ingen urvalsbild",
      noSelection:
        "Konjunkturlönerapporten skrivs ut ur vyn med bevakade avtal — listan är urvalet. Det är den enda av rapporterna som fungerar så.",
      onScreen:
        "Rapporten är en utskrift av en vy som redan finns i MIIS. Öppna vyn och skriv ut den där, så följer utskriften samma sekretessregler som skärmen.",
      openView: "Öppna vyn",
      onScreenOne: (name: string) =>
        `Urvalet pekar ut ett avtal: ${name}. Knappen öppnar just det avtalet, inte listan.`,
      openAgreement: (name: string) => `Öppna ${name}`,
      onScreenMany: (n: number) =>
        `Urvalet matchar ${n} avtal, och den här rapporten skrivs ut för ett avtal i taget. Smalna av urvalet ovan tills ett avtal återstår, eller öppna vyn och välj där.`,
      onScreenNone:
        "Inget avtal matchar urvalet. Bredda urvalet ovan, eller öppna vyn och sök där.",
      notBuilt: "Rapportens innehåll är inte byggt i mockupen.",
      chooseAgreement: "Välj ett avtal i urvalet ovan. Rapporten lämnar ut ett avtal i taget.",
      notReleasable:
        "Avtalet lämnas inte ut till medlare. Antingen är det sekretessmarkerat, eller så är det inte tecknat och därmed inte gällande. Endast giltiga avtal visas.",
      transcribedLabel: "Medlingsinstitutets egna siffror",
      transcribed:
        "Avtalskonstruktioner räknar anställda på hela den svenska arbetsmarknaden – 3 797 764 personer i Medlingsinstitutets egen utskrift. Siffrorna nedan är därför Medlingsinstitutets publicerade, med det urval de togs med (Arbetsgivarorg: Almega Tjänsteförbunden), och ändras inte av urvalet ovan. Avtalsrörelsen räknar registrets egna avtal och följer urvalet fullt ut.",
      rationale:
        "Bilaga F inleds med att det för varje rapport visas urvalsbild och resultat. Urvalet är alltså en del av rapporten, inte ett steg före den – därför skrivs kriterierna ut överst i resultatet.",
    },
    mediatorRelease: {
      title: "Avtal – Medlare",
      confidentialityNote:
        "Sekretess- och GDPR-markerad information visas ej (Bilaga 3 §7.4). Ett sekretessmarkerat avtal lämnas inte ut alls – det visas inte med tomma fält.",
      notReleasableLabel: "Inget utlämnande",
      employerOrg: "Arbetsgivarorganisation",
      employeeOrg: "Arbetstagarorganisation",
      signedDate: "Teckningsdatum",
      period: "Löptid",
      expires: "Löper ut utan förnyelse",
      earlyTermination: "Förtida uppsägning",
      protocols: "Protokoll",
      agreementFiles: "Avtal",
      mediationFiles: "Medlingshandlingar",
      noDocuments: "Inga handlingar att lämna ut i det här avsnittet.",
      otherAgreements: "Övriga avtal som arbetsgivaren tecknar",
      otherAgreementsNote:
        "Sorterat på arbetstagarorganisation och avtalsnamn. Det här är avsnittet som gör rapporten värd att ta ut: medlaren behöver veta vad samma arbetsgivarorganisation redan har gjort upp om.",
      noOtherAgreements: "Arbetsgivarorganisationen har inga andra gällande avtal registrerade.",
    },

    expiry: {
      title: (year: number) => `Utlöpningstidpunkter ${year}`,
      intro:
        "Gällande avtal fördelade efter den månad de löper ut. Till skillnad från Avtalsrörelserapporten, som delar året efter avtalsstatus, delar den här rapporten året efter vem som tecknar avtalet.",
      onlyCurrent:
        "Endast gällande avtal ingår i rapporten (Bilaga 3 §7.11). Ett avtal som ännu inte är tecknat är kvarstående och räknas inte här.",
      month: "Månad",
      agreements: "Avtal",
      employees: "Anställda",
      allSectors: "Samtliga sektorer",
      confederation: "Svenskt Näringsliv",
      byGroup: "Svenskt Näringsliv per arbetsgivargrupp",
      byGroupNote: "Störst först, räknat i anställda. Månadsordningen inom varje grupp följer rapportens egen sortering.",
      sectionTotal: (agreements: string, employees: string) =>
        `${agreements} avtal · ${employees} anställda`,
      emptySection: "Inga avtal löper ut under året i den här delen.",
      derivedNote:
        "Tabellerna och diagrammen härleds ur avtalsregistret vid uttaget. Alla tre delarna delar skala, så en liten del inte ser ut som en stor. Ett avtal utan uppgift om antal anställda visas med ¤, som i Medlingsinstitutets egna rapporter.",
    },
    bargainingRound: {
      title: (year: number) => `Avtalsrörelsen ${year}`,
      intro:
        "Avtal och anställda fördelade efter avtalens utlöpningstidpunkt, månad för månad. Färgerna är avtalsstatus enligt FR-012.",
      month: "Månad",
      sum: "Summa",
      agreements: "Avtal",
      employees: "Anställda",
      byAgreement: "Antal avtal",
      byAgreementIntro:
        "Avtal som är kvarstående, nytecknade och nytecknade efter medling, fördelade efter utlöpningstidpunkt.",
      byEmployee: "Antal anställda",
      byEmployeeIntro:
        "Anställda som omfattas av avtal som är kvarstående, nytecknade och nytecknade efter medling.",
      derivedNote:
        "Tabellerna härleds ur avtalsregistret vid uttaget, inte ur lagrade summor. Ett avtal utan uppgift om antal anställda räknas i avtalstabellen men inte i anställdatabellen – samma hål som Medlingsinstitutets egen rapport visar med ¤.",
    },
    constructions: {
      selectionHeading: "Urvalskriterier",
      employerOrg: "Arbetsgivarorg",
      employeeOrg: "Arbetstagarorg",
      sector: "Sektor",
      centralOrg: "Centralorg",
      cooperationGroup: "Samverkansgrp",
      employerGroup: "Arbetsgivargrp",
      industryCode: "Branschkod",
      printedAt: (when: string) => `Utskriftsdatum ${when}`,
      figureAll: "Figur 1 – Lönebildning: antal (andel) avtal och anställda, samtliga avtal",
      figureSelection: "Figur 2 – Lönebildning: antal (andel) avtal och anställda, urvalets avtal",
      bandLocal: "Lokal lönebildning",
      agreementCount: (n: string, p: string) => `${n} avtal (${p} %)`,
      employeeCount: (n: string, p: string) => `${n} anställda (${p} %)`,
      tableAll: "Samtliga avtal",
      tableSelection: "Urvalets avtal",
      constructionColumn: "Avtalskonstruktion",
      privat: "Privat",
      privatPercent: "Privat %",
      offentlig: "Offentlig",
      offentligPercent: "Offentlig %",
      alla: "Alla sektorer",
      allaPercent: "Alla sektorer %",
      arbetare: "Arbetare",
      tjansteman: "Tjänstemän",
      total: "Totalt",
      legendHeading: "Avtalskonstruktion",
      sourceNote:
        "Siffrorna är Medlingsinstitutets egna, hämtade ur rapportexemplet i Bilaga F till kravspecifikationen. De räknar anställda i hela avtalsregistret och härleds därför inte ur mockupens avtal.",
      heading: "Avtalskonstruktioner",
      intro:
        "Prioriterad befintlig rapport. Fördelning av de sju MI-definierade avtalskonstruktionerna.",
      generate: "Generera rapporten",
      table: { construction: "Konstruktion", agreements: "Antal avtal", share: "Andel" },
    },
    scheduled: {
      heading: "Schemalagda uttag",
      addHeading: "Nytt schemalagt uttag",
      paused: "Pausat",
      pause: "Pausa",
      resume: "Återuppta",
      addedNote: (report: string) => `${report} skickas nu enligt schemat.`,
      pausedNote: (report: string) => `${report} är pausat och skickas inte förrän det återupptas.`,
      resumedNote: (report: string) => `${report} skickas igen enligt schemat.`,
      pauseNote:
        "Ett uttag pausas, det tas inte bort. Ett uttag som har körts har skickat e-post, och de utskicken finns i händelseloggen – samma skäl som gör att en användare inaktiveras i stället för att raderas.",
      form: {
        report: "Rapport",
        schedule: "Schema",
        scheduleHint: "T.ex. Kvartalsvis, första vardagen",
        recipients: "Mottagare",
        incomplete: "Schema och mottagare måste fyllas i.",
      },
      intro:
        "Återkommande rapportuttag skickas som e-post med rapporten bifogad och en länk in i MIIS. Varje utskick loggas i händelseloggen.",
      table: {
        report: "Rapport",
        schedule: "Schema",
        recipients: "Mottagare",
        lastRun: "Senast kört",
        status: "Status",
      },
      active: "Aktivt",
      add: "Nytt schemalagt uttag",
      logNote: "Skickad e-post loggas i händelseloggen med tidpunkt, mottagare och bilaga.",
      items: [
        {
          report: "Konjunkturlönerapporten",
          schedule: "Kvartalsvis, första vardagen",
          recipients: "Statistikenheten",
          lastRun: "2027-05-31",
          active: true,
        },
        {
          report: "Avtalsrörelserapporten",
          schedule: "Månadsvis under avtalsrörelse",
          recipients: "Ledningsgruppen",
          lastRun: "2027-05-03",
          active: true,
        },
        {
          report: "Avtalskonstruktioner",
          schedule: "Årsvis, 15 januari",
          recipients: "Analysenheten",
          lastRun: "2027-01-15",
          active: false,
        },
      ],
    },
  },

  dokument: {
    title: "Dokument",
    subtitle: "Protokoll, avtal, GD-beslut, medlarrapporter och partsträffsdokumentation",
    upload: "Ladda upp dokument",
    empty: "Inga dokument uppladdade i denna datamängd.",
    table: {
      fileName: "Fil",
      type: "Typ",
      uploaded: "Uppladdat",
      linkedTo: "Kopplat till",
      confidential: "Sekretess",
    },
    types: {
      protocol: "Avtalsprotokoll",
      agreement: "Avtal",
      "dg-decision": "GD-beslut",
      "mediator-report": "Medlarrapport",
      "party-meeting": "Partsträffsdokument",
      other: "Övrigt dokument",
    },
    ocrNote:
      "Inskannade dokument tolkas med OCR och genomsöks i fritextsökningen tillsammans med urvalen.",
    confidentialNote:
      "Sekretessmarkering sätts på avtalet och slår igenom på dess bifogade dokument. Markerade dokument lämnas inte ut till medlare eller allmänhet.",
  },

  allmanheten: {
    title: "Avtalsinformation för allmänheten",
    subtitle:
      "Publik vy hos Medlingsinstitutet. Åtkomst sker från en särskild klientdator i MI:s lokaler, utan inloggning.",
    publicMarker: "Publik vy",
    backToReport: "Tillbaka till rapporten",
    backToAgreement: "avtalet",
    fromReport:
      "Urvalet kommer från rapporten Avtal – Allmänheten. Det går att ändra här, och listan smalnar av på riktigt.",
    publicExplain:
      "Detta är samma system i en begränsad, läsbar version. Ingen registrering, ingen redigering och ingen sekretessmarkerad avtalsinformation.",
    selection: {
      title: "Sök avtal",
      lead:
        "Skriv ett ord — ett avtalsområde, ett förbund eller en arbetsgivarorganisation — eller välj i listorna nedan. Träffarna uppdateras medan du skriver.",
      text: "Sök",
      textPlaceholder: "T.ex. Apotek, Unionen eller Spårtrafik",
      textHint: "Söker i avtalets namn, avtalsområde och båda parterna",
      narrow: "Eller välj i listorna",
      industryCode: "Bransch",
      industryCodeHint: "Näringsgren enligt SNI, t.ex. handel eller tillverkning",
      employerOrg: "Arbetsgivarorganisation",
      /* A visitor at the kiosk does not know AGO from ATO. Naming a real
         organisation is faster than defining the word. */
      employerOrgHint: "Arbetsgivarnas förbund, t.ex. Teknikföretagen",
      employeeOrg: "Arbetstagarorganisation",
      employeeOrgHint: "Fackförbundet, t.ex. IF Metall eller Unionen",
      agreement: "Avtal",
      period: "Gällde ett visst datum",
      periodHint: "Visar avtal som gällde den dagen. Lämna tomt för alla.",
      all: "Alla",
      search: "Visa rapport",
      reset: "Börja om",
      hint: "Välj en eller flera nivåer. Lämnas ett fält tomt tas alla med.",
      builderNote:
        "Den fullständiga sökbyggaren är en intern funktion och erbjuds inte här. Fält, operator och värde med och/eller, grupperingar, valda presentationskolumner och sparade sökningar är ett expertverktyg, och besökaren har ingen inloggning, ingen introduktion och ett försök. Fritextsökningen och de tre kriterierna svarar på samma fråga i ett steg. Vill Medlingsinstitutet ändå ha sökbyggaren i den publika vyn är det samma komponent — sekretessregeln avgör redan resten (D-002).",
    },
    result: {
      title: "Avtal i urvalet",
      count: (n: number) => `${n} avtal`,
      empty: "Inget avtal matchar sökningen. Prova ett bredare urval eller börja om.",
      all: "Samtliga avtal som Medlingsinstitutet har registrerat. Sök eller avgränsa ovan för att smalna av.",
      narrowed: "Avtal som matchar sökningen ovan. Sekretessmarkerade avtal är med i listan; det som utelämnas är deras uppgifter.",
      table: {
        status: "Status",
        agreement: "Avtal",
        employerOrg: "Arbetsgivarorganisation",
        employeeOrg: "Arbetstagarorganisation",
        validity: "Löptid",
      },
      download: "Ladda ner urvalet (PDF)",
      downloadNote:
        "Utskriften innehåller protokoll och avtalsutskrifter utan sekretessmarkerad avtalsinformation.",
    },
    detail: {
      subtitle:
        "Avtalet som det lämnas ut till allmänheten. Sekretessmarkerad information ingår inte.",
      heading: "Uppgifter om avtalet",
      name: "Avtal",
      area: "Avtalsområde",
      type: "Avtalstyp",
      employerOrg: "Arbetsgivarorganisation",
      employeeOrg: "Arbetstagarorganisation",
      industryCode: "Bransch (SNI)",
      signedDate: "Teckningsdatum",
      validity: "Löptid",
      period: "Löptid",
      periods: "Löptider per avtalsrörelse",
      periodsIntro:
        "En löptid per avtalsrörelse, senast tecknade först. Löneuppgifter ingår inte i det som lämnas ut till allmänheten.",
      signedOn: (date: string) => `Tecknat ${date}`,
      noPeriods: "Ingen löptid registrerad på avtalet.",
      lifecycle: "Uppsägning och prolongering",
      expires: "Löper ut utan förnyelse",
      earlyTermination: "Förtida uppsägning",
      noLifecycle: "Inget registrerat om utlöpande eller förtida uppsägning.",
      documents: "Länkade handlingar",
      document: "Handling",
      documentsIntro: "Protokoll och avtalstryck som är kopplade till avtalet.",
      noDocuments: "Inga handlingar är kopplade till avtalet.",
      documentsNote:
        "Filerna hämtas ur dokumentarkivet i det levererade systemet. I mockupen visas filnamn och datum – en knapp som laddade ned en tom eller påhittad PDF vore sämre än att säga var filen kommer ifrån.",
      print: "Skriv ut",
      download: "Ladda ned uppgifterna",
      exportNote:
        "Utskriften får Medlingsinstitutets brevhuvud och ett utskriftsdatum och kan sparas som PDF i webbläsaren. Nedladdningen skapar en CSV-fil ur uppgifterna på skärmen och fungerar utan serverdrift (FR-013).",
    },

    help: {
      title: "Om uppgifterna",
      items: [
        "Uppgifterna kommer ur Medlingsinstitutets avtalsregister och uppdateras löpande.",
        "Sekretessmarkerade avtal syns i listan och räknas med i statistiken, men deras detaljuppgifter visas inte.",
        "Frågor om innehållet besvaras av Medlingsinstitutets registrator.",
      ],
    },
  },

  placeholder: {
    aboutTitle: "Om vyn i demon",
    aboutBody:
      "Vyn ingår i menystrukturen som speglar Medlingsinstitutets funktionella moduler. I demoversionen är startsidan, registreringen av avtalsprotokoll, medlingsärendet, sökbyggaren, rapportvyn och den publika vyn fullt utritade. Övriga vyer visar sitt kravinnehåll och detaljeras i nästa skissomgång.",
  },

  avtal: {
    title: "Avtal",
    epic: "Avtalsregistrering och -hantering",
    subtitle: "Avtal, avtalsområden, löneavtal och allmänna villkor",
    checklist: {
      progress: (done: number, total: number) => `Registrerat: ${done} av ${total}`,
      done: "registrerat",
      remaining: "återstår",
      item: {
        wageAgreement: "Löneavtal för avtalsrörelsen",
        validity: "Avtalets löptid",
        scope: "Avtalets omfattning",
        protocol: "Protokoll och avtalstryck",
        signedDate: "Teckningsdatum",
      },
    },
    register: {
      heading: "Avtalsregister",
      intro:
        "Ett avtal per part och avtalsområde. Färgmarkeringen visar hur avtalet kom till – nytecknat, tecknat efter medling eller kvarstående.",
      howToRegister:
        "Två vägar in, beroende på vad som kommit. Registrera avtalsprotokoll när ett undertecknat protokoll gäller ett avtal som redan finns här – AI-stödet läser protokollet och föreslår uppgifterna. Registrera nytt kollektivavtal när avtalet saknar tidigare motsvarighet i registret; då finns ingenting att matcha mot, och avtalet läggs upp för hand.",
      areaNote:
        "Avtalsområdet är den övergripande enheten i MI:s modell (FA-001); avtalen under det registreras per partskombination.",
    },
    table: {
      name: "Avtal",
      parties: "Parter",
      validity: "Löptid",
      status: "Status",
      registration: "Registrering",
      wageRows: "Löneavtal",
    },
    filters: {
      area: "Avtalsområde",
      registration: "Registreringsstatus",
      status: "Avtalsstatus",
      all: "Alla",
      noMatch: "Inget avtal matchar de valda filtren.",
    },
    newAgreement: {
      title: "Registrera nytt kollektivavtal",
      subtitle: "Ett avtal utan tidigare motsvarighet i MIIS – registreras manuellt",
      heading: "Avtalet",
      manualLabel: "Registreras manuellt",
      manualNote:
        "Ett avtal utan tidigare motsvarighet i systemet registreras alltid för hand. AI-stödet läser ett inkommet protokoll mot ett avtal som redan finns – för ett förstagångsavtal finns ingenting att matcha mot, och därmed ingenting att föreslå.",
      name: "Avtalsnamn",
      namePlaceholder: "T.ex. Bemanningsavtalet",
      area: "Avtalsområde",
      areaHint: (examples: string) => `Befintliga områden i registret: ${examples} …`,
      employerOrg: "Arbetsgivarorganisation",
      employeeOrg: "Arbetstagarorganisation",
      type: "Avtalstyp",
      sector: "Sektor",
      signedDate: "Teckningsdatum",
      validFrom: "Löptid från",
      validTo: "Löptid till",
      publishing: "Sekretess och rapporturval",
      publishingIntro:
        "Vad avtalet ingår i när det är registrerat. Publicering till gränssnittet för allmänheten är en egen handling och görs på avtalet när registreringen är klar.",
      confidential: "Sekretessmarkering",
      confidentialHint:
        "Detaljerna utelämnas för medlare och allmänhet. Avtalet listas och räknas ändå.",
      reportWebsite: "MI:s webbplats",
      reportShortTermWage: "Konjunkturlönerapporten",
      reportMinimumWage: "Lägstlöner",
      reportEurofound: "Eurofound",
      save: "Spara avtalet",
      requiredReason: "Avtalsnamn, avtalsområde och båda parterna måste vara ifyllda.",
      incompleteNote:
        "Avtalet sparas som ofullständigt och opublicerat. Ett nytt avtal utan löneavtal under sig är ingen färdig post, och registreringen får en påminnelse (FA-021).",
      savedHeading: "Avtalet är registrerat",
      savedNote: (name: string) =>
        `${name} är registrerat som ofullständigt. Registreringen skrivs till ändringsloggen med tidpunkt och användare.`,
      nextSteps:
        "Så här långt har registreringen kommit. Den behöver markeras som klar innan avtalet kan publiceras.",
      toAgreement: "Öppna avtalet",
      toRegister: "Till avtalsregistret",
      another: "Registrera ytterligare ett avtal",
    },

    detail: {
      tabs: {
        label: "Avtalets delar",
        record: "Avtalet",
        pay: "Löneavtal",
        open: "Frågor och grupper",
      },
      identity: "Avtalet",
      area: "Avtalsområde",
      alternativeName: "Alternativt avtalsnamn",
      type: "Avtalstyp",
      employerOrg: "Avtalspart AGO",
      employeeOrg: "Avtalspart ATO",
      signedDate: "Teckningsdatum",
      validity: "Löptid",
      registration: "Registreringsstatus",
      scopeHeading: "Avtalets omfattning",
      scopeIntro:
        "Fyra mått, inte ett. Anställda är huvuden, årsarbetare är heltider, fackmedlemmar visar hur stor del av området avtalet faktiskt talar för och medellönen är underlaget för kostnadsberäkningen.",
      employeesLabel: "Anställda",
      annualWorkers: "Årsarbetare",
      unionMembers: "Fackmedlemmar",
      unionDensity: "Organisationsgrad (%)",
      averageWage: "Medellön (kr/mån)",
      updatedSuffix: (date: string) => `Uppdaterad ${date}`,
      notRegistered: "Ej registrerat",
      derivedNote:
        "Organisationsgraden räknas fram ur fackmedlemmar och anställda och lagras inte – ett tredje sparat tal är ett tredje tal som kan bli inaktuellt.",
      basicFacts: "Basfakta",
      basicFactsIntro:
        "Registrerade förhållanden om avtalet som helhet. Varje ja/nej har en kommentar, eftersom flaggan är det en rapport kan räkna och kommentaren är varför handläggaren satte den.",
      hangingAgreement: "Hängavtal",
      organisationalChange: "Organisatorisk avtalsförändring",
      terminated: "Avtalet upphört",
      negotiationOrderRef: "Förhandlingsordningsavtal Dnr",
      noBasicFacts: "Inga särskilda förhållanden registrerade om avtalet.",
      terminatedNote:
        "Upphört är inte detsamma som utlöpt. Ett utlöpt avtal tillämpas tills det ersätts – ett upphört avtal tillämpas inte alls och räknas därför inte i Utlöpningstidpunkter.",
      reportSelection: "Rapporturval",
      reportEurofound: "Eurofound",
      reportMinimumWage: "Lägstlöner",
      reportWebsite: "MI:s webbplats",
      reportShortTermWage: "Konjunkturlönerapporten",
      noReportSelection: "Avtalet ingår inte i något rapporturval.",
      specialQuestions: "Särskilda frågor",
      specialQuestionsIntro:
        "Frågor som avtalstexten själv svarar på, numrerade i tre fasta platser. Till skillnad från en arbetsgrupp finns det ingen som ska återkomma – frågan är reglerad.",
      questionNumber: (n: number) => `Särskild fråga ${n}`,
      questionYear: (year: string) => `Tecknat ${year}`,
      questionText: "Avtalstext",
      questionComment: "Kommentar",
      questionEquality: "Jämställdhetsfråga",
      noSpecialQuestions: "Inga särskilda frågor registrerade på avtalet.",
      limited: "Informationsbegränsning",
      limitedRegisteredNote:
        "Avsnitten utelämnas ur gränssnitten för medlare och allmänhet. Begränsningen gäller avsnittet – avtalet i övrigt är öppet och är inte detsamma som sekretessmarkerat.",
      limitedNote:
        "Uppgifterna är informationsbegränsade för den här rollen enligt registreringen på avtalet. Begränsningen gäller avsnittet, inte hela avtalet, och är inte samma sak som en sekretessmarkering.",
      workingGroups: "Arbetsgrupper och frågeområden",
      workingGroupsIntro:
        "Frågor som parterna sköt till en partsgemensam arbetsgrupp i stället för att lösa i avtalet. Ett avtal med öppna arbetsgrupper är inte färdigförhandlat.",
      groupName: "Arbetsgrupp",
      subjectAreas: "Frågeområden",
      reportsBy: "Redovisar senast",
      noWorkingGroups: "Inga arbetsgrupper registrerade på avtalet.",
      eventLog: "Händelselogg för avtalet",
      eventLogIntro:
        "Övergripande händelser kopplade till avtalet – tecknat, uppsagt, medling inledd. Loggen skrivs av systemet och kan inte redigeras.",
      eventTime: "Tidpunkt",
      eventType: "Händelse",
      eventDetail: "Avser",
      noEvents: "Inga händelser registrerade på avtalet ännu.",
      edit: "Redigera",
      identityIntro:
        "Rätta uppgifter direkt i posten. Ändringen sparas med tidpunkt och användare i ändringsloggen.",
      agreementName: "Avtalsnamn",
      nameRequired: "Avtalet måste ha ett namn.",
      /* Registered elsewhere, and the row says where — a field that is grey
         with no reason reads as a field the system forgot to finish. */
      typeDerived: "Följer av vilka löneavtal och allmänna villkor som är registrerade",
      partiesElsewhere: "Ändras i partsregistret, så att avtalshistoriken följer med",
      scopeEditNote:
        "Organisationsgrad räknas ur fackmedlemmar och anställda och kan inte skrivas in.",
      editSaved: (date: string) =>
        `Ändringen sparad ${date}. Den skrivs till ändringsloggen med tidpunkt och användare.`,
      publication: "Publicering",
      publishedLabel: "Publicerat",
      publishedNote: (date: string, by: string) =>
        `Publicerat ${date} av ${by}. Avtalet är tillgängligt i gränssnittet för allmänheten.`,
      notPublished:
        "Avtalet är registrerat men inte publicerat. Det syns i registret och inte i gränssnittet för allmänheten.",
      publish: "Publicera avtalet",
      publishBlocked:
        "Publicering kräver att registreringen är markerad som klar och att avtalet är tecknat.",
      viewPublic: "Visa som allmänheten ser det",
      publicationNote:
        "Publicering är en handling med datum och person, inte en följd av att posten är komplett. Medlingsinstitutet avgör när ett avtal lämnas ut – ett halvregistrerat avtal på den publika datorn vore myndigheten som publicerar ett utkast.",
      markComplete: "Markera registreringen som klar",
      reopenRegistration: "Ångra klarmarkeringen",
      completionGaps: (what: string) => `Registreringen saknar ${what}.`,
      gapLabel: {
        wageAgreement: "löneavtal",
        validity: "löptid",
        scope: "uppgift om omfattning",
        protocol: "kopplat protokoll",
        signedDate: "teckningsdatum",
      },
      completionNote:
        "Klarmarkeringen är en handling, inte en följd av att fälten är ifyllda. Ett kvarstående avtal som inte omförhandlats i år är en komplett registrering utan löneavtal under sig, så vad som saknas visas och avgör inte – handläggaren gör det. Publicering kräver därefter också att avtalet är tecknat.",
      statusHeading: "Status och löptid",
      wageEdit: {
      edit: "Redigera",
      editingNow: "Ändras",
      alreadyOpen: "Öppen i formuläret ovanför",
      heading: (period: string) => `Ändra löneavtalet för ${period}`,
      scopeLabel: "Löneutrymme (%)",
      costLabel: "Kostnadsram (%)",
      savedNote: (period: string) =>
        `Löneavtalet för ${period} är ändrat. Ändringen skrivs till ändringsloggen med tidpunkt och användare.`,
      periodElsewhere:
        "Löptiden ändras på avtalet, inte här – en avtalsrörelse kan inte gälla längre än avtalet den tillhör.",
      logNote:
        "En avtalsrörelse är avtalets version. FA-002 ger varje omförhandling ett eget löneavtal med egen konstruktion, eget löneutrymme och egen kostnadsram, så jämförelsen mot förra rörelsen är tabellen – och en versionshistorik som ingen kan rätta är ett utskrivet papper.",
    },
    wageAgreements: "Löneavtal per avtalsrörelse",
      wageIntro:
        "En rad per avtalsrörelse och period. Konstruktionen är en av MI:s sju och ordnas efter förhandlingsnivå.",
      construction: "Avtalskonstruktion",
      scope: "Löneutrymme",
      costFrame: "Kostnadsram",
      guarantee: "Individgaranti",
      revision: "Lönerevision",
      period: "Period",
      minimumWages: "Lägstalöner per yrkesgrupp",
      minimumWagesIntro: "Grupperade per yrkesgrupp, med det datum beloppet senast reviderades.",
      occupationalGroup: "Yrkesgrupp",
      amount: "Belopp",
      revisionDate: "Revisionsdatum",
      noWageAgreements:
        "Inget löneavtal registrerat. Ett löneavtal uppstår när protokollet registreras.",
      flags: "Märkning",
      equality: "Jämställdhetsflagga",
      benchmark: "Industrimärke (märkessättande avtal)",
      lifecycle: "Avtalets livslängd",
      expires: "Löper ut utan förnyelse",
      earlyTermination: "Förtida uppsägning",
      noLifecycle: "Inget registrerat om utlöpande eller förtida uppsägning.",
      mediation: "Kopplat till medling",
      confidential: "Sekretessmarkerat",
      notFound: "Avtalet finns inte i den valda datamängden.",
    },
  },
  parter: {
    title: "Parter",
    subtitle:
      "Register över arbetsgivar- och arbetstagarorganisationer med historik och samverkansorgan",
    epic: "Partshantering",
    features: [
      "Registrering av part med typ AGO eller ATO.",
      "Historik vid namnbyte och organisationsförändring hos part.",
      "Samverkansorgan: huvudorganisation respektive samverkan, med förhandlande organ Ja eller Nej.",
      "Koppling mellan part, samverkansorgan och avtal.",
      "Sökning efter parter med vissa egenskaper.",
      "Kontaktpersoner med namn, titel, telefon och e-post för både AGO och ATO.",
    ],
    table: {
      name: "Part",
      type: "Typ",
      sector: "Sektor",
      group: "Arbetsgivargrupp",
      formerNames: "Tidigare namn",
    },
    register: {
      heading: "Partsregister",
      intro:
        "Arbetsgivarorganisationer kopplas till sektor och arbetsgivargrupp; de inom Svenskt Näringsliv även till branschkod. Arbetstagarorganisationer bär historik för namnbyten och organisatoriska förändringar.",
      sectorNote:
        "Sektor, arbetsgivargrupp och branschkod är egenskaper hos arbetsgivarorganisationer. En arbetstagarorganisation har dem inte, och fältet visar därför Saknas i stället för ett tomrum.",
    },
    filters: {
      type: "Typ av part",
      sector: "Sektor",
      sectorHint: "Gäller arbetsgivarorganisationer",
      group: "Arbetsgivargrupp",
      all: "Alla",
      noMatch: "Ingen part matchar de valda filtren.",
    },
    bodies: {
      heading: "Samverkansorgan",
      intro:
        "Samverkansorgan kopplas till de förbund som ingår och till en tidsperiod. Om organet förhandlar är avgörande för medlingshanteringen.",
      name: "Samverkansorgan",
      type: "Typ",
      negotiating: "Förhandlande organ",
      members: "Medlemmar",
      period: "Tidsperiod",
    },
    detail: {
      identity: "Uppgifter om parten",
      industryCode: "Branschkod",
      industryCodeHint: "Gäller organisationer inom Svenskt Näringsliv",
      sectorEmployeeHint: "Sektor registreras på arbetsgivarsidan",
      contacts: "Kontaktpersoner",
      contactAdd: "Lägg till kontaktperson",
      contactName: "Namn",
      contactTitle: "Titel",
      contactPhone: "Telefon",
      contactEmail: "E-post",
      contactSave: "Spara kontaktpersonen",
      contactRemove: "Ta bort",
      contactNameRequired: "Kontaktpersonen måste ha ett namn.",
      contactAdded: (name: string) =>
        `${name} är tillagd som kontaktperson. Ändringen skrivs till ändringsloggen med tidpunkt och användare.`,
      contactRemoved: (name: string) => `${name} är borttagen som kontaktperson.`,
      noContacts: "Inga kontaktpersoner registrerade.",
      contactNote:
        "Kontaktpersoner registreras för både AGO och ATO och följer parten, inte det enskilda avtalet.",
      status: "Status",
      active: "Aktiv",
      inactive: "Avregistrerad",
      logNote: "Ändringar registreras i ändringsloggen med tidpunkt och användare.",
    },
    newParty: {
      action: "Ny part",
      title: "Registrera part",
      subtitle: "Ny arbetsgivar- eller arbetstagarorganisation i partsregistret",
      identity: "Uppgifter om parten",
      type: "Typ av part",
      typeHint: "Avgör vilka egenskaper som registreras",
      name: "Partens namn",
      namePlaceholder: "T.ex. Sveriges Lärare",
      nameRequired: "Parten måste ha ett namn.",
      validFrom: "Namnet gäller från",
      validFromHint: "Datum då namnet börjar gälla",
      validFromNote:
        "Namnet läggs in i namnhistoriken med det här datumet, så att ett framtida namnbyte kan avgränsas korrekt (FP-004).",
      sector: "Sektor",
      group: "Arbetsgivargrupp",
      industryCode: "Branschkod",
      industryCodePlaceholder: "T.ex. 25–30 Metallvaru- och maskinindustri",
      choose: "Välj",
      scopeNote:
        "Sektor, arbetsgivargrupp och branschkod registreras bara på arbetsgivarorganisationer, och branschkod bara inom Svenskt Näringsliv. Fälten visas därför när de är tillämpliga i stället för att stå gråade – en arbetstagarorganisation har ingen sektor alls.",
      merger: "Organisationsförändring",
      mergerIntro:
        "Bildas parten genom att andra organisationer går samman anges vilka den ersätter. Kopplingen gör att statistik och avtalshistorik kan följas över sammanslagningen.",
      predecessors: "Ersätter följande organisationer",
      noPredecessors: "Ingen organisation vald – parten registreras som ny.",
      predecessorCount: (n: number) =>
        n === 1 ? "1 organisation ersätts" : `${n} organisationer ersätts`,
      mergerNote:
        "En sammanslagning registreras som en ny part med koppling till sina föregångare, inte som ett namnbyte. Föregångarna ligger kvar i registret eftersom äldre avtal fortfarande hänvisar till dem.",
      save: "Spara parten",
      openRegister: "Öppna partsregistret",
      registerAnother: "Registrera ytterligare en part",
      saveAction: "Registrera parten",
      saveHint: "Kontaktpersoner läggs till efter registreringen",
      savedNote: (name: string, predecessors: number) =>
        predecessors === 0
          ? `${name} är registrerad i partsregistret.`
          : `${name} är registrerad och ersätter ${predecessors} organisationer, som ligger kvar för äldre avtal.`,
      logNote:
        "Registreringen förs in i ändringsloggen med tidpunkt och användare, liksom kopplingen till eventuella föregångare.",
      contactsLater: "Kontaktpersoner registreras på partens sida när parten är sparad.",
    },
    nameChange: {
      nameRequired: "Skriv det nya namnet först.",
      heading: "Namnbyte och organisationsförändring",
      intro:
        "Ett namnbyte registreras på ett ställe med giltighetsdatum. Namnet slår igenom på samtliga gällande avtal, men aldrig på historiska avtal – de visar det namn parten hade när avtalet tecknades.",
      historyHeading: "Namnhistorik",
      currentName: "Gällande",
      newName: "Nytt namn",
      newNamePlaceholder: "T.ex. Sveriges Lärare",
      validFrom: "Gäller från",
      apply: "Registrera namnbyte",
      appliedNote: (name: string, current: number, historical: number) =>
        `Namnbytet är registrerat. ${name} slår igenom på ${current} gällande avtal och lämnar ${historical} historiska avtal orörda.`,
      currentHeading: (n: number) => `Gällande avtal (${n})`,
      historicalHeading: (n: number) => `Historiska avtal (${n})`,
      noAgreements: "Inga avtal kopplade till parten i denna datamängd.",
      showsAs: "Visar parten som",
      currentExplain: "Följer partens gällande namn.",
      historicalExplain: "Behåller namnet som gällde när avtalet tecknades.",
      derivedNote:
        "Namnet lagras aldrig i avtalet. Registreringen lägger till en post i namnhistoriken, och varje vy frågar vilket namn parten hade vid den tidpunkt som gäller för just den vyn. Därför kan ett historiskt avtal aldrig skrivas om av ett senare namnbyte.",
    },
  },
  forhandlingar: {
    title: "Förhandlingar",
    epic: "Förhandlings- och medlingshantering",
    subtitle: "Avtalsrörelse och övrig förhandling",
    register: {
      heading: "Förhandlingsregister",
      intro:
        "En förhandling är antingen en avtalsrörelse, som hör till ett avtal, eller en övrig förhandling, som kan stå för sig själv med direkta kopplingar till parterna.",
      standaloneNote:
        "En fristående förhandling har inget avtal – den är kopplad direkt till parterna. Tom avtalskolumn är alltså en uppgift, inte en lucka.",
    },
    table: {
      id: "Diarienummer",
      type: "Typ",
      agreement: "Avtal",
      parties: "Parter",
      status: "Status",
      closed: "Avslutad",
    },
    status: {
      ongoing: "Pågående",
      "closed-with-agreement": "Avslutad med avtal",
      "closed-without-agreement": "Avslutad utan avtal",
    },
    filters: {
      type: "Typ",
      status: "Status",
      all: "Alla",
      clear: "Rensa filter",
    },
    standalone: "Fristående",
    linkNote:
      "Förhandlingen kopplas till avtalet när protokollet registreras – steg 5 i Registrera avtalsprotokoll.",
  },
  partstraffar: {
      termRequired: "Skriv ett sökord först.",
      noteRequired: "Skriv en anteckning först.",
      demandRequired: "Skriv ett avtalskrav först.",
    editableNote:
      "Uppgifterna kan kompletteras både före och efter mötet – US-08 kräver det uttryckligen. Ingen fas låses; i stället registrerar ändringsloggen vem som ändrade vad och när (FF-004, FH-001).",
    title: "Partsträffar",
    subtitle: "Möten med en part i taget inför avtalsrörelsen – underlag för MI:s bedömning av konfliktrisk",
    epic: "Partsträffar inför avtalsrörelsen",
    features: [
      "Registrering av partsträffsinformation inför, under och efter mötet.",
      "Samordnade avtalskrav med flagga och koppling till förbunden bakom kravet.",
      "Partsträffsdokument skapas utifrån dokumentmall.",
      "Yrkanden från träffen läggs till i bevakningsordstabellen.",
    ],
    table: {
      date: "Datum",
      party: "Part",
      area: "Avtalsområde",
      state: "Status",
      demands: "Yrkanden",
    },
    register: {
      heading: "Partsträffar",
      intro:
        "Medlingsinstitutet träffar en part i taget för att stämma av förhandlingsläget, identifiera konfliktrisker och bedöma behovet av medling.",
      create: "Ny partsträff",
      onePartyNote:
        "Parterna möts aldrig varandra vid en partsträff, och en partsträff är inte en förhandling (Bilaga 1 §4.2). Det är förutsättningen för att parten ska kunna tala öppet.",
    },
    current: {
      heading: (party: string, date: string) => `${party} · ${date}`,
    },
    newMeeting: {
      title: "Ny partsträff",
      subtitle: "Registrera en partsträff inför avtalsrörelsen – inget är ifyllt ännu",
    },
    notRegistered: "Ej registrerat",
    watchwordTermLabel: "Bevakningsord att lägga till",
    watchwordConfirm: "Spara bevakningsord",
    watchwordOrigin: "Partsträff",
    phaseLabel: "Skede i partsträffen",
    phase: { before: "Inför", during: "Under mötet", after: "Efter" },
    before: {
      heading: "Inför träffen",
      party: "Part",
      partyHint: "En part i taget – aldrig båda samtidigt",
      date: "Datum",
      purpose: "Syfte",
      participants: "Deltagare",
      agenda: "Dagordning",
      agendaEmpty: "Ingen dagordning registrerad ännu.",
      agendaAdd: "Ny punkt på dagordningen",
      participantsHint: "Namn åtskilda med komma",
      save: "Spara inför träffen",
      saved: "Registreringen sparad. Ändringen skrivs till ändringsloggen med tidpunkt och användare.",
      location: "Plats",
      createDocument: "Skapa partsträffsdokument från mall",
      documentCreated: "Dokument skapat",
      templateLogNote:
        "Dokumentet kopplas till partsträffen och registreras i ändringsloggen med tidpunkt och användare (FH-001).",
      sourceMeeting: "Ur partsträffens registrering",
      templateNote:
        "Mallen förifylls med uppgifter ur MIIS – part, avtalsområde, datum och deltagare – så att handläggaren bara kompletterar det som är specifikt för träffen.",
    },
    during: {
      heading: "Under mötet",
      intro:
        "Anteckningar och yrkanden registreras direkt under mötet. Varje anteckning tidsstämplas när den skrivs.",
      noteLabel: "Ny anteckning",
      notePlaceholder: "Vad sades?",
      addNote: "Lägg till",
      empty: "Inga anteckningar ännu. Skriv den första när mötet börjar.",
      noteCount: (n: number) => (n === 1 ? "1 anteckning" : `${n} anteckningar`),
      traceNote:
        "Anteckningar kan kompletteras både före och efter mötet. Ändringsloggen registrerar vad som ändrats, av vem och när.",
    },
    demands: {
      heading: "Avtalskrav",
      intro:
        "Krav som förs fram vid träffen registreras med flagga för samordnat krav eller eget förbundskrav.",
      empty: "Inga krav registrerade för den här träffen ännu.",
      add: "Registrera krav",
      topicLabel: "Vad avser kravet?",
      topicPlaceholder: "T.ex. arbetstidsförkortning 0,2 %",
      kindLabel: "Typ av krav",
      backingLabel: "Förbund som står bakom kravet",
      backingCount: (n: number) => (n === 1 ? "1 förbund valt" : `${n} förbund valda`),
      save: "Spara kravet",
      cancel: "Avbryt",
      watchwordCount: (n: number, total: number) =>
        `${n} av ${total} krav finns i bevakningsordstabellen`,
    },
    backedBy: "Står bakom kravet:",
    demandDocuments: "Dokument:",
    isWatchword: "Bevakningsord",
    watchwordExplain: "Markeras automatiskt i inkommande protokoll",
    promoteToWatchword: "Lägg till som bevakningsord",
    after: {
      heading: "Efter träffen",
      summary: "Sammanfattning",
      assessment: "Bedömning av medlingsbehov",
      assessmentHint: "MI:s egen bedömning, inte partens",
      notHeld: "Träffen är ännu inte genomförd. Sammanfattning registreras efteråt.",
      documents: "Dokumentation",
      print: "Skriv ut partsträffsinformation",
      upload: "Ladda upp dokumentation",
      logNote:
        "Utskrift och uppladdad dokumentation kopplas till partsträffen. Händelsen registreras i ändringsloggen.",
    },
  },
  medlare: {
    title: "Medlare",
    epic: "Medlarregistret",
    subtitle: "Medlare, uppdrag och statistik",
    register: {
      heading: "Medlarregistret",
      intro:
        "Medlare som Medlingsinstitutet kan förordna. Statistiken räknas ur uppdragshistoriken och lagras inte separat, så den kan inte säga emot de uppdrag den räknar.",
      privacyNote:
        "Medlarens personuppgifter omfattas av MI:s gallringsrutiner (D-004). Kontaktuppgifterna visas för medlingsadministratören, inte för allmänheten.",
    },
    table: {
      name: "Medlare",
      types: "Medlingstyp",
      assignments: "Uppdrag",
      firstChair: "Som ettan",
      secondChair: "Som tvåan",
      latest: "Senaste år",
      areas: "Avtalsområden",
      contact: "Kontakt",
      status: "Status",
    },
    active: "Aktiv",
    inactive: "Inaktiv",
    edit: {
      action: "Åtgärd",
      open: "Ändra",
      heading: (name: string) => `Ändra uppgifter för ${name}`,
      editingNow: "Ändras",
      alreadyOpen: "Öppen i formuläret ovanför",
      nameRequired: "Medlaren måste ha ett namn.",
      deactivate: "Inaktivera",
      activate: "Aktivera",
      savedNote: (name: string, date: string) =>
        `Uppgifterna för ${name} är sparade ${date}. Ändringen skrivs till ändringsloggen med tidpunkt och användare.`,
      deactivatedNote: (name: string) =>
        `${name} är inaktiverad och föreslås inte längre vid förordnande. Tidigare uppdrag räknas fortfarande i statistiken.`,
      activatedNote: (name: string) => `${name} är aktiv igen och kan förordnas.`,
      derivedNote:
        "Uppdrag, ettan, tvåan och senaste år räknas ur uppdragshistoriken och går inte att skriva in. En medlare tas aldrig bort, bara inaktiveras – statistiken per medlare skulle annars försvinna med personen.",
    },
    filters: {
      type: "Medlingstyp",
      status: "Status",
      all: "Alla",
      clear: "Rensa filter",
    },
    add: {
      heading: "Lägg till medlare",
      intro:
        "Registret är underlaget när Medlingsinstitutet utser medlare. En ny medlare läggs in med kontaktuppgifter och de medlingstyper hen tar uppdrag inom.",
      open: "Lägg till medlare",
      newBadge: "Ny",
      name: "Namn",
      namePlaceholder: "T.ex. Gerald Lindberg",
      phone: "Telefon",
      email: "E-post",
      types: "Tar uppdrag inom",
      noTypes: "Ingen medlingstyp vald – välj minst en.",
      typeCount: (n: number) => (n === 1 ? "1 medlingstyp vald" : `${n} medlingstyper valda`),
      typeRequired: "Namn och minst en medlingstyp krävs.",
      save: "Spara medlaren",
      savedNote: (name: string) =>
        `${name} finns nu i medlarregistret och kan utses till medlingsärenden.`,
      addAnother: "Lägg till en medlare till",
      historyNote:
        "Uppdragshistoriken fylls inte i här. Den härleds ur de medlingsärenden medlaren utses till, så att statistiken per medlare (år, avtalsområde, ettan eller tvåan) aldrig kan säga något annat än ärendena själva – vilket är hela poängen med FF-009:s statistik.",
      logNote:
        "Kontaktuppgifter omfattas av Medlingsinstitutets gallringsrutiner (D-004). Registreringen loggas med tidpunkt och användare (FH-001).",
    },
    notify: {
      heading: "Notifiering",
      body:
        "När ett medlingsbeslut klarmarkeras skickas en notifierings-epost med länk till medlaradministratören, och händelsen läggs i ändringsloggen.",
    },
  },
  market: {
    title: "Märket",
    epic: "Registrering av Märket",
    subtitle: "Industrins kostnadsnorm som referens i avtals- och medlarvyer",
    current: {
      heading: "Märket i kraft",
      intro:
        "Märket registreras som en periodiserad inställning och visas som referens där den behövs – på startsidan, i medlarvyn och i rapporterna. MI sätter inte märket; det läses ur industrins avtal.",
      costFrame: "Kostnadsram",
      periodisation: "Periodisering",
      period: "Period",
      months: "Antal månader",
      supplementary: "Tilläggsöverenskommelser",
      registered: "Registrerat",
      none: "Inget märke registrerat för perioden.",
    },
    admin: {
      newHeading: "Registrera Märket för en ny period",
      newIntro:
        "Märket registreras per avtalsrörelse. Tidigare perioder ligger kvar – avtal som tecknats under dem jämförs mot den kostnadsram som gällde då.",
      open: "Registrera ny period",
      save: "Registrera perioden",
      registered: (period: string) =>
        `Märket för ${period} är registrerat och gäller nu i de vyer där det visas.`,
      incomplete: "Period, giltighetstid och kostnadsram måste fyllas i.",
      costFrameInput: "Kostnadsram (%)",
      periodHint: "Så som perioden skrivs i MI:s egna underlag",
      periodPlaceholder: "T.ex. 2027–2029",
      validFrom: "Gäller från",
      validTo: "Gäller till",
      periodisationHint: "Fritext – hur kostnadsramen fördelas över perioden",
      periodisationPlaceholder: "T.ex. 3,2 % / 3,2 %",
      supplementaryHint: "Fritext, flera separeras med ·",
      note: "En ny period släcker larmet för de datum den täcker: larmet finns för att ett avtalsprotokoll på Industriavtalet inte ska registreras för en period utan märkesdefinition.",
    },
    history: {
      heading: "Registrerade perioder",
      intro: "En rad per avtalsrörelse. Perioderna får inte överlappa.",
      period: "Period",
      validity: "Giltighet",
      costFrame: "Kostnadsram",
      periodisation: "Periodisering",
      months: "Månader",
      registered: "Registrerat",
    },
    sources: {
      heading: "Märkessättande avtal",
      intro:
        "Avtalen som är märkta som märkessättande. Kostnadsramen i märket ska stämma med dem.",
      name: "Avtal",
      parties: "Parter",
      period: "Period",
      costFrame: "Kostnadsram",
      empty: "Inget avtal är flaggat som märkessättande i den valda datamängden.",
    },
    alarm: {
      label: "Larm",
      covered:
        "Alla registrerade avtalsperioder täcks av ett märke. Registreras ett protokoll för Industriavtalet utan märkesdefinition för perioden larmar systemet här.",
      missing: (period: string) =>
        `Ingen märkesdefinition för ${period}. Ett protokoll för Industriavtalet kan inte tolkas mot märket förrän det är registrerat.`,
    },
  },
  administration: {
    tabsLabel: "Delar av administrationen",
    tabs: {
      settings: "Inställningar",
      changeLog: "Ändringslogg",
      eventLog: "Händelselogg",
      watchwords: "Bevakningsord",
    },
    settings: {
      heading: "Systeminställningar",
      intro:
        "Systemadministratören har full åtkomst till systemkonfigurationen, men inte till behörigheter. Två av inställningarna nedan går att ändra här; två gör det inte, och skälet står på raden.",
      editable: "Kan ändras",
      fixed: "Låst av krav",
      timeoutLabel: "Tidsgräns (minuter)",
      timeoutHint: (min: number, max: number) => `${min}–${max} minuter`,
      notAllowed: "Värdet är inte tillåtet",
      tooHigh: (max: number) =>
        `Högst ${max} minuters inaktivitet kan ställas in. Tidsgränsen får kortas men inte förlängas – en längre gräns försvagar kravet i stället för att konfigurera det.`,
      tooLow: (min: number) =>
        `Kortare än ${min} minuter är opraktiskt: en gräns som löper ut under en kafferast är en gräns som användarna arbetar runt.`,
      notWhole: "Ange ett helt antal minuter.",
      save: "Spara tidsgränsen",
      unchanged: "Värdet är redan sparat",
      effectNote:
        "Gäller direkt i hela systemet – varningen visas två minuter innan gränsen nås.",
      savedNote: (minutes: number) =>
        `Tidsgränsen är satt till ${minutes} minuter och gäller från och med nu. Ändringen registreras i ändringsloggen.`,
      openWatchwords: "Underhåll bevakningsorden",
      watchwordCount: (n: number) =>
        n === 1 ? "1 ord i tabellen nedan" : `${n} ord i tabellen nedan`,
      retentionValue: (months: number) => `Minst ${months} månader`,
      publicIpValue: "Medlingsinstitutets IP-adress",
      logNote:
        "Ändrade systeminställningar registreras i ändringsloggen med gammalt värde, nytt värde, tidpunkt och användare (FH-001) – på samma sätt som en ändring i ett avtal.",
    },
    title: "Administration",
    epic: "Loggar och systemkonfiguration",
    subtitle: "Stödtabeller, spårbarhet och systeminställningar",
    changeLog: {
      heading: "Ändringslogg",
      intro:
        "Vem som ändrade vad och när, med gammalt och nytt värde. Loggen skrivs av systemet och kan inte redigeras härifrån.",
      time: "Tidpunkt",
      user: "Användare",
      object: "Objekt",
      field: "Uppgift",
      from: "Från",
      to: "Till",
    },
    eventLog: {
      heading: "Händelselogg",
      intro: "Systemhändelser och utskickade e-postmeddelanden, senaste först.",
      time: "Tidpunkt",
      type: "Händelse",
      detail: "Avser",
    },
    watchwords: {
      heading: "Bevakningsord",
      intro:
        "Tabellen underhålls inför avtalsrörelsen. Orden markeras i uppladdade protokoll och styr vad AI-analysen lyfter fram.",
      term: "Ord",
      source: "Ursprung",
      action: "Åtgärd",
      predefined: "Fördefinierat",
      added: "Tillagt",
      addedHere: "Tillagt i administrationen",
      predefinedLocked:
        "Fördefinierade ord ingår i Medlingsinstitutets grundtabell och tas inte bort här.",
      remove: "Ta bort",
      add: "Lägg till ordet",
      newTerm: "Nytt bevakningsord",
      newTermHint: "Matchas oberoende av versaler i protokoll och avtal",
      newTermPlaceholder: "T.ex. arbetstidskonto",
      newTermRequired: "Skriv ett ord först.",
      addedNote: (term: string) =>
        `${term} är tillagt. Det markeras nu i uppladdade protokoll och avtal.`,
      duplicate: (term: string) => `${term} finns redan i tabellen.`,
      removedNote: (term: string) => `${term} är borttaget och markeras inte längre.`,
      note: "Ord som läggs till här eller från en partsträff gäller i den här demonstrationen bara den egna sessionen.",
    },
    gallring: {
      heading: "Gallringsregler för personuppgifter",
      intro:
        "Personuppgifter gallras efter regel, inte efter beslut i det enskilda fallet. Varje regel anger vad som gallras, vad som startar tiden och om gallringen sker automatiskt.",
      table: {
        subject: "Uppgifter",
        trigger: "Gallringstiden räknas från",
        months: "Gallringstid (månader)",
        action: "Åtgärd",
        automatic: "Automatisk",
      },
      nowAutomatic: (subject: string) => `${subject} gallras nu automatiskt.`,
      nowManual: (subject: string) => `${subject} gallras nu efter manuell åtgärd.`,
      anonymiseNote:
        "Ett inaktiverat användarkonto anonymiseras i stället för att gallras. Inloggningarna är loggade (NFL-001) och de posterna måste finnas kvar – det som försvinner är namnet bakom dem, inte händelsen.",
      logNote:
        "Loggarna är den enda posten ingen får definiera en regel för. NFL-003 undantar dem uttryckligen från systemadministratören, och raden visas ändå: en skärm som utelämnat dem hade sett komplett ut.",
    },
    retention: {
      heading: "Bevarande och åtkomst",
      body:
        "Loggarna bevaras i minst 24 månader och kan varken ändras eller raderas. MI når dem via den här vyn eller via export, utan leverantörens medverkan.",
      export: "Exportera loggar",
    },
  },
  anvandare: {
    users: {
      heading: "Användare och rolltilldelning",
      intro:
        "Behörighetsadministratören lägger upp användare och tilldelar roller. Vad en roll får göra ändras inte här – det framgår av behörighetsmatrisen under fliken Roller och behörigheter.",
      add: "Lägg till användare",
      name: "Namn",
      namePlaceholder: "T.ex. Sara Lindström",
      efos: "EFOS-identitet",
      efosHint: "Identiteten hos Försäkringskassans IdP",
      email: "E-post",
      unit: "Enhet",
      role: "Roll",
      assigned: "Roll tilldelad",
      assignedBy: (who: string) => `av ${who}`,
      lastSignIn: "Senaste inloggning",
      status: "Status",
      action: "Åtgärd",
      active: "Aktiv",
      inactive: "Inaktiv",
      deactivate: "Inaktivera",
      reactivate: "Återaktivera",
      changeRole: "Ändra roll",
      newRole: "Ny roll",
      saveRole: "Spara rollen",
      sameRoleReason: "Rollen är redan den valda.",
      lastAdminChangeReason:
        "Det här är den sista aktiva behörighetsadministratören. Tilldela rollen till någon annan först.",
      changedNote: (what: string) =>
        `Rollen ändrad: ${what}. Ändringen skrivs till ändringsloggen med tidpunkt och vem som gjorde den.`,
      revokedNote: (name: string) =>
        `Behörigheten återkallad för ${name}. Kontot finns kvar som inaktivt – inloggningarna ligger i loggen och måste gå att härleda.`,
      lastAdminReason:
        "Den sista aktiva behörighetsadministratören kan inte inaktiveras – då kan behörigheter bara återställas av leverantören.",
      reactivated: (name: string) =>
        `${name} är aktiv igen. Ändringen skrivs till ändringsloggen med tidpunkt och användare.`,
      save: "Spara användaren",
      efosPending: "EFOS-identitet inväntas",
      newBadge: "Ny",
      nameRequired: "Namn krävs.",
      savedNote: (name: string) =>
        `${name} är upplagd och har fått sin roll. Tilldelningen är registrerad i ändringsloggen med tidpunkt och användare.`,
      allRoles: "Alla roller",
      allStatuses: "Alla",
      noMatch: "Ingen användare matchar de valda filtren.",
      noPasswordNote:
        "MIIS håller inga lösenord och skapar inga konton. Autentiseringen ligger hos Försäkringskassans IdP via SAML 2.0 och EFOS-kort (NFÅ-001) – en användare här är en koppling mellan en identitet som redan finns där och en roll i MIIS.",
      retentionNote:
        "Användare inaktiveras, de tas inte bort. Inloggningar loggas (NFL-001) och sparas under gallringstiden (NFL-003), så loggen måste fortsätta att peka på en person även efter att hen slutat.",
    },
    title: "Användare",
    epic: "Behörighetsadministration",
    tabs: {
      label: "Delar av behörighetsadministrationen",
      users: "Användare",
      permissions: "Roller och behörigheter",
      signIn: "Inloggning",
    },
    subtitle: "Användare, roller och tilldelade behörigheter",
    roles: {
      heading: "Roller och behörigheter",
      intro:
        "Systemets åtta roller. Rollen avgör både vad användaren får göra och vilka menyval som visas.",
      role: "Roll",
      /* Not "Användare": the matrix also has a module column called Användare,
         twelve columns to the right, and one word meant two things in one table. */
      held: "Antal användare",
      unstaffed: "Ingen användare",
      unstaffedNote: (roles: string) =>
        `Följande roller har ingen aktiv användare: ${roles}. Delar av systemet är då inte bemannade – rollen finns men ingen kan nå den.`,
      permissions: "Behörighet",
      menu: "Menyval",
      level: { write: "Skriv", read: "Läs", none: "–" },
      matrixNote:
        "Läs betyder att rollen kan öppna vyn men inte ändra något i den. Skriv betyder registrera och redigera. Samma funktion styr menyn, åtkomsten till vyn och den här tabellen, så de kan inte säga emot varandra.",
      readOnlyNote:
        "Matrisen redigeras inte i systemet, och det är avsiktligt. NFÅ-003 definierar åtkomsten utifrån de åtta roller som Bilaga 1 §3.1 beskriver; om en administratör kunde flytta Skriv på Avtal mellan roller skulle tabellen beskriva en konfiguration i stället för Medlingsinstitutets eget dokument. Det NFÅ-005 lägger hos Medlingsinstitutet är användare och rolltilldelning – båda redigeras i panelen ovanför.",
    },
    auth: {
      heading: "Inloggning",
      body:
        "Autentisering sker med EFOS-kort mot Försäkringskassans IdP över SAML 2.0. MIIS lagrar inga lösenord.",
      logging:
        "In- och utloggningar loggas med tidpunkt och användar-id. Behörigheter administreras av MI:s egna behörighetsadministratörer, utan leverantörens medverkan.",
    },
  },

  notFound: {
    title: "Sidan finns inte",
    body: "Adressen leder inte till någon vy i MIIS. Kontrollera länken eller gå till startsidan.",
    home: "Till startsidan",
  },
  error: {
    title: "Något gick fel",
    body: "Vyn kunde inte visas. Försök igen, eller gå till startsidan.",
    retry: "Försök igen",
  },
};

export type Dictionary = typeof sv;
