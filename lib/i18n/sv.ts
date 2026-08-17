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
    empty: "Inget att visa.",
    none: "–",
    yes: "Ja",
    no: "Nej",
    close: "Stäng",
    approve: "Godkänn",
    adjust: "Justera",
    reject: "Avvisa",
    save: "Spara",
    search: "Sök",
    exportLabel: "Exportera:",
    showAll: (n: number) => `Visa alla (${n})`,
    agreementCount: (n: number) => `${n} avtal`,
    andMoreRows: (n: number) => `… ytterligare ${n} rader`,
    reqTagAria: (id: string) => `Krav-ID ${id}`,
    sortBy: (column: string) => `Sortera på ${column}`,
    sortedAscending: "Sorterat stigande",
    sortedDescending: "Sorterat fallande",
    backTo: (page: string) => `Tillbaka till ${page}`,
    notInDemo: "Ej aktiv i demon",
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

  session: {
    title: "Din session håller på att gå ut",
    body: "Du har varit inaktiv en längre stund. Av säkerhetsskäl loggas du ut automatiskt vid 30 minuters inaktivitet.",
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
      "Rollanpassat innehåll enligt tilldelad roll och behörighet. Inloggad via EFOS-kort, sessionen avslutas efter 30 minuters inaktivitet.",
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

    uploadProtocol: "+ Ladda upp avtalsprotokoll",
    uploadDgDecision: "+ Ladda upp GD-beslut",
    newSearch: "Ny sökning",

    reminders: {
      title: "Mina påminnelser",
      empty: "Inga påminnelser just nu.",
      footnote: "Påminnelser skickas även som e-post med länk till avtalet",
    },
    incomplete: {
      title: "Ofullständiga registreringar",
      empty: "Alla registreringar är kompletta.",
      badge: "Ofullständig",
      footnote:
        "Visas i Konjunkturlönerapportens vy med statuskolumn, protokollslänk och vilka avtal som redan exporterats",
      action: "Öppna Konjunkturlönerapporten",
    },
    recent: {
      title: "Senast registrerade avtal",
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
      title: "Underlag",
      items: [
        "Märket 2027–2029 · kostnadsram 6,4 %",
        "Protokoll och avtalsutskrifter utan sekretessmarkerad information",
      ],
    },
  },

  registrera: {
    title: "Registrera avtalsprotokoll",
    subtitle: "Inkommet protokoll tolkas med AI-stöd och granskas av handläggare innan sparande",
    steps: [
      "1. Ladda upp",
      "2. AI-analys",
      "3. Avtal (matchat)",
      "4. Löneavtal / Allmänna villkor",
      "5. Koppla protokoll",
    ],
    document: {
      fileName: "Avtalsprotokoll_Kommunikation_2027.pdf",
      ocr: "OCR",
      watchwordHits: (n: number) => `Markerad text = träff i bevakningsordstabellen (${n} träffar)`,
      sourceHint:
        "Välj ett AI-förslag till höger så markeras stycket det lästes ur här i protokollet.",
      sourceActive: (field: string) => `Visar källa för: ${field}`,
      showSource: "Visa källa i protokollet",
      showSourceFor: (field: string) => `Visa källan till ${field} i protokollet`,
      sourceMarker: "Källa",
      lines: {
        heading: "ÖVERENSKOMMELSE",
        parties: "mellan Almega Tjänsteförbunden och Seko – Service- och kommunikationsfacket",
        period: "avtalsperioden 2027-06-01 – 2029-05-31",
        prolonged:
          "Parterna är överens om att avtalet om allmänna anställningsvillkor prolongeras med ändringar…",
        workingTime: "arbetstidsförkortning om 0,2 %",
        wageAppendix: "Löneavtal, Bilaga B. Lönerevision per den",
        revision: "1 juni 2027, 3,2 %",
        terminationLead: "Part äger rätt att senast den 30 november 2028",
        termination: "säga upp avtalet till upphörande…",
        minimumWage: "Lägstalön för yrkesvana höjs till 25 480 kr per månad",
        negotiation: "Förhandlingen avslutades 2027-05-28 och protokollet justerades samma dag",
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
      title: "Löneavtal 2027 – ny rad för avtalsrörelsen",
      construction: "Avtalskonstruktion (1–7)",
      constructionHint: "Sju MI-definierade konstruktioner",
      scope: "Löneutrymme (%)",
      costFrame: "Kostnadsram (%)",
      individualGuarantee: "Individgaranti",
      workingTime: "Arb.tidsförk. / kostnad",
      revision: "Undergrupp: Lönerevision",
      revisionHint: "Kopplad till löneavtalet",
      minimumWage: "Undergrupp: Lägstalön",
      minimumWageHint: "Kopplad till löneavtalet",
      equalityFlag: "Jämställdhetsflagga – skrivning identifierad",
      benchmarkFlag: "Industrimärke (märkessättande avtal)",
    },
    terms: {
      title: "Allmänna villkor – egen giltighetsperiod",
      ownSignedDate: "Eget teckningsdatum",
      ownValidity: "Egen giltighetsperiod",
      note: "Löptiderna för löneavtal och allmänna villkor behöver inte följas åt",
    },
    link: {
      title: "Koppla förhandling och protokoll",
      negotiation: "Registrerad förhandling",
      documentLinkedTo: "Dokument kopplas till",
      documentLinkedToValue: "Avtal + löneavtal + förhandling",
    },
    save: {
      title: "Spara registrering",
      registrationStatus: "Registreringsstatus",
      colourCoding: "Färgkodning i vyerna",
      approveAndLink: "Godkänn och koppla protokoll",
      saveIncomplete: "Spara som ofullständig",
      incompleteNote: "Ofullständig registrering följs upp med påminnelse",
      confidentialityLabel: "Sekretessmarkera avtalet",
      confidentialityHint:
        "Sätts av avtalsadministratören, gäller främst bifogade dokument och döljer detaljer för medlare och allmänhet",
      auditNote:
        "Vid sparande registrerar ändringsloggen vad som ändrats, av vem och när, och händelsen ”avtal tecknat” läggs i händelseloggen. Tecknas avtalet efter medling färgkodas det rött i stället för grönt.",
    },
  },

  sok: {
    title: "Sök",
    subtitle: "Sammansatt sökning över flera handlingstyper, med bokslut och export",
    criteria: {
      title: "Urvalskriterier",
      infoTypeLabel: "Informationstyp",
      groupLabel: (n: number) => `Grupp ${n}`,
      groupJoinAll: "OCH",
      groupJoinAny: "ELLER",
      joinExplain:
        "Villkor inom en grupp kombineras med gruppens operator. Grupperna kombineras med varandra. Det gör (A ELLER B) OCH C uttryckbart – dagens sökbyggare klarar bara en platt lista.",
      expression: "Uttryck:",
      addCondition: "+ Lägg till villkor",
      addGroup: "+ Lägg till grupp",
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
      saveSearch: "Spara sökning",
      savedSearchName: "Årsrapport 2026",
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
    results: {
      title: (hits: number, seconds: string, date: string) =>
        `Resultat · ${hits} träffar · ${seconds} s · Bokslut per ${date}`,
      responseNote: (seconds: string) =>
        `Svarstid ${seconds} s. Kravet är svar inom 3 sekunder för standardsökningar.`,
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
    heading: (number: string, type: string) => `Medlingsärende ${number} – ${type}`,
    uploaded: (number: string) => `${number} – uppladdat, ärende skapat automatiskt`,
    registryNumber: "Diarienummer (diariesystemet)",
    decisionDate: "Beslutsdatum",
    type: "Typ",
    dgDecisionDocument: "GD-beslut (dokument)",
    linkedAgreements: (n: number) => `Kopplade avtal (${n})`,
    linkAgreement: "+ Koppla avtal",
    linkedNote:
      "Röd markering = koppling till medling. Ett medlingsärende kan kopplas till flera avtal.",
    mediators: "Medlare (ur medlarregistret)",
    addMediator: "+ Lägg till medlare",
    noMediators:
      "Inga medlare tillsatta – parterna medlar i egen regi enligt förhandlingsordningsavtal.",
    previousAssignments: (n: number) => `${n} tidigare uppdrag`,
    position: (p: string) => `Position: ${p}`,
    mediatorStatsNote: "Statistik per medlare (år och avtalsområde) visas i medlarregistret",
    procedureAgreement: "Förhandlingsordningsavtal",
    coveredNot: "Avtalsområdet täcks INTE av förhandlingsordningsavtal.",
    covered: "Avtalsområdet täcks av förhandlingsordningsavtal.",
    miAppoints: "→ Medlingsinstitutet tillsätter medlare.",
    partiesMediate: "→ Parterna medlar i egen regi. MI tillsätter ingen medlare.",
    procedureNote:
      "Omfattas avtalet av förhandlingsordningsavtal medlar parterna i egen regi och MI tillsätter ingen medlare.",
    benchmarkTitle: "Märket (referens i medlarvyn)",
    benchmarkMonths: (n: number) => `${n} månader`,
    benchmarkPeriod: (from: string, to: string) => `Perioden ${from} – ${to}`,
    documents: "Dokument och åtgärder",
    createWithNotice: "Skapa GD-beslut – med varsel",
    createWithoutNotice: "Skapa GD-beslut – utan varsel",
    finalise: "Klarmarkera beslut",
    finaliseNote: "→ Notifierings-epost med länk skickas till medlaradministratör och loggas",
    templateNote:
      "Dokumentmallarna förifylls med information från MIIS och kan redigeras före färdigställande",
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
    title: "Rapporter",
    subtitle: "Rapportuttag, bevakningslistor och schemalagda utskick",
    tabs: {
      shortTerm: "Konjunkturlönerapporten",
      bargainingRound: "Avtalsrörelserapporten",
      constructions: "Avtalskonstruktioner",
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
      selectedCount: (selected: number, total: number) =>
        `${selected} av ${total} avtal med i uttaget`,
      incompleteWarning: (n: number) =>
        `${n} avtal i uttaget är delvis registrerade. De tas med, och markeras i rapporten.`,
      export: "Skriv ut rapporten",
      exportFormats: "Word · Excel · PDF",
      markExported: "Markera som exporterat",
      markExportedNote:
        "Uttaget noteras per avtal, så nästa uttag visar vad som redan levererats till rapporten.",
    },
    bargainingRound: {
      heading: "Avtalsrörelserapporten",
      intro:
        "Prioriterad befintlig rapport. Urvalet följer avtalsrörelsen och färgkodningen av avtalsstatus.",
      generate: "Generera rapporten",
      contents: [
        "Tecknade avtal per avtalsområde och sektor",
        "Avtal tecknade efter medling, med medlingsärende",
        "Kvarstående avtal vid periodens slut",
      ],
    },
    constructions: {
      heading: "Avtalskonstruktioner",
      intro:
        "Prioriterad befintlig rapport. Fördelning av de sju MI-definierade avtalskonstruktionerna.",
      generate: "Generera rapporten",
      table: { construction: "Konstruktion", agreements: "Antal avtal", share: "Andel" },
    },
    scheduled: {
      heading: "Schemalagda uttag",
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
      paused: "Pausat",
      add: "+ Nytt schemalagt uttag",
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
    upload: "+ Ladda upp dokument",
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
    publicExplain:
      "Detta är samma system i en begränsad, läsbar version. Ingen registrering, ingen redigering och ingen sekretessmarkerad avtalsinformation.",
    selection: {
      title: "Gör ditt urval",
      employerOrg: "Arbetsgivarorganisation",
      employeeOrg: "Arbetstagarorganisation",
      agreement: "Avtal",
      period: "Giltigt vid tidpunkt",
      all: "Alla",
      search: "Visa rapport",
      reset: "Börja om",
      hint: "Välj en eller flera nivåer. Lämnas ett fält tomt tas alla med.",
    },
    result: {
      title: "Avtal i urvalet",
      count: (n: number) => `${n} avtal`,
      empty: "Inget avtal matchar urvalet. Prova ett bredare urval.",
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
    features: [
      "Avtalsområde och avtal som övergripande enhet med parter och avtalstyp.",
      "Registrering av löneavtal – en ny rad per avtalsrörelse och period.",
      "Registrering av allmänna villkor.",
      "Separata löptider för löneavtal respektive allmänna villkor.",
      "Jämställdhetsflagga på löneavtal.",
      "Registrering av förhandlingsordningsavtal.",
      "Registreringsstatus Ofullständig eller Klar.",
      "Påminnelser för komplettering av avtalsuppgifter.",
    ],
  },
  parter: {
    title: "Parter",
    epic: "Partshantering",
    subtitle: "AGO, ATO, samverkansorgan och partshistorik",
    features: [
      "Registrering av part med typ AGO eller ATO.",
      "Historik vid namnbyte och organisationsförändring hos part.",
      "Samverkansorgan: huvudorganisation respektive samverkan, med förhandlande organ Ja eller Nej.",
      "Koppling mellan part, samverkansorgan och avtal.",
    ],
  },
  forhandlingar: {
    title: "Förhandlingar",
    epic: "Förhandlings- och medlingshantering",
    subtitle: "Avtalsrörelse och övrig förhandling",
    features: [
      "Registrering av förhandling av typen avtalsrörelse eller övrig förhandling.",
      "Koppling av förhandling till avtal via protokollsuppladdning.",
      "Fristående förhandling med direkta kopplingar till parter.",
      "Uppföljning av förhandlingens status och utfall.",
    ],
  },
  partstraffar: {
    title: "Partsträffar",
    epic: "Partsträffar inför avtalsrörelsen",
    subtitle: "Möten mellan MI och enskild part inför avtalsrörelsen",
    features: [
      "Registrering av partsträff före, under och efter mötet.",
      "Samordnade avtalskrav med flagga för samordnat eller eget förbund och kopplade fackförbund.",
      "Partsträffsdokument skapas från mall förifylld med MIIS-information.",
      "Krav från mötet kan läggas till i bevakningsordstabellen.",
    ],
  },
  medlare: {
    title: "Medlare",
    epic: "Medlarregistret",
    subtitle: "Medlare, uppdrag och statistik",
    features: [
      "Registrering och administration av medlare i medlarregistret.",
      "Statistik per medlare (år och avtalsområde) samt position ettan eller tvåan.",
      "Notifierings-epost när ett medlingsbeslut klarmarkerats.",
      "Alla ändringar i registret loggas i ändringsloggen.",
      "Medlarens personuppgifter omfattas av MI:s gallringsrutiner.",
    ],
  },
  market: {
    title: "Märket",
    epic: "Registrering av Märket",
    subtitle: "Industrins kostnadsnorm som referens i avtals- och medlarvyer",
    features: [
      "Registrering av Märket som periodiserad inställning med kostnadsram, periodisering och tilläggsöverenskommelser.",
      "Larm när nytt avtalsprotokoll för Industriavtalet registreras för period utan märkesdefinition.",
      "Märket visas som referens på startsidan och i medlarvyn.",
      "Industrimärke-flagga på märkessättande avtal.",
    ],
  },
  administration: {
    title: "Administration",
    epic: "Loggar och systemkonfiguration",
    subtitle: "Stödtabeller, spårbarhet och systeminställningar",
    features: [
      "Ändringslogg med vem, vad och när – inklusive gammalt och nytt värde.",
      "Händelselogg över systemhändelser och utskickade e-postmeddelanden.",
      "Loggar bevaras i minst 24 månader och kan inte ändras eller raderas.",
      "Underhåll av bevakningsordstabellen inför avtalsrörelsen.",
      "MI når loggarna via administrationsvyn eller export, utan leverantörens medverkan.",
    ],
  },
  anvandare: {
    title: "Användare",
    epic: "Behörighetsadministration",
    subtitle: "Användare, roller och tilldelade behörigheter",
    features: [
      "Autentisering med EFOS-kort via Försäkringskassans IdP (SAML 2.0).",
      "Rollbaserad behörighetsstyrning enligt de åtta användarrollerna.",
      "Behörigheter administreras av MI:s egna behörighetsadministratörer utan leverantörens medverkan.",
      "In- och utloggningar loggas med tidpunkt och användar-id.",
    ],
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
