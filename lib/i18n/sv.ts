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
      `${screen} ingår inte i behörigheten för rollen ${role}. Byt roll i demoläget för att se vyn. I MIIS styrs detta av behörighetsadministratören (NFÅ-003).`,
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
      title: "Löneavtal 2027 – ny rad för avtalsrörelsen",
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
      title: "Allmänna villkor – egen giltighetsperiod",
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
      agreementStatus: "Avtalets status (FR-012)",
      statusKey: "Så visas statusen i avtalslistor och rapporter:",
      approveAndLink: "Godkänn och koppla protokoll",
      approveFirst: "Godkänn AI-förslagen först — inget kan kopplas innan de är granskade.",
      registered: "Protokollet är registrerat och kopplat",
      registeredWhere:
        "Avtalet ligger nu i avtalsregistret med status Nytecknat utan medling och syns i Avtal, i Sök och i rapporterna. Ändringsloggen har registrerat vem som godkände och när.",
      registeredNext: "Öppna avtalet i avtalsregistret",
      registeredNote:
        "Avtalet, löneavtalet och förhandlingen är kopplade till protokollet. Ändringsloggen har registrerat vem som godkände och när.",
      reopen: "Ändra registreringen",
      saveIncomplete: "Spara som ofullständig",
      savedIncomplete: "Sparat som ofullständigt",
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
    createWithNotice: "Skapa GD-beslut – med varsel",
    createWithoutNotice: "Skapa GD-beslut – utan varsel",
    finalise: "Klarmarkera beslut",
    finaliseNote: "Notifierings-epost med länk skickas till medlaradministratör och loggas",
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
    register: {
      heading: "Avtalsregister",
      intro:
        "Ett avtal per part och avtalsområde. Färgmarkeringen visar hur avtalet kom till – nytecknat, tecknat efter medling eller kvarstående.",
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
      clear: "Rensa filter",
    },
    detail: {
      identity: "Avtalet",
      area: "Avtalsområde",
      alternativeName: "Alternativt avtalsnamn",
      type: "Avtalstyp",
      employerOrg: "Avtalspart AGO",
      employeeOrg: "Avtalspart ATO",
      signedDate: "Teckningsdatum",
      validity: "Löptid",
      registration: "Registreringsstatus",
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
      edit: "Redigera avtalet",
      statusHeading: "Status och löptid",
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
      minimumWagesIntro: "Grupperade per yrkesgrupp med revisionsdatum (FA-013).",
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
      none: "Inga filter valda",
      count: (n: number) => (n === 1 ? "1 filter" : `${n} filter`),
      remove: (label: string) => `Ta bort filtret ${label}`,
      clearAll: "Rensa alla",
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
      validFrom: "Namnet gäller från",
      validFromHint: "Namnet läggs in i namnhistoriken med detta datum, så att ett framtida namnbyte kan avgränsas korrekt.",
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
        "En fristående förhandling har inget avtal – FF-003 kopplar den direkt till parterna. Tom kolumn är alltså en uppgift, inte en lucka.",
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
      createDocument: "Skapa partsträffsdokument från mall",
      documentCreated: "Dokument skapat",
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
    filters: {
      type: "Medlingstyp",
      status: "Status",
      all: "Alla",
      clear: "Rensa filter",
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
        "Avtalen med industrimärke-flaggan (FA-012). Kostnadsramen i märket ska stämma med dem.",
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
      predefined: "Fördefinierat",
      added: "Tillagt i sessionen",
      note: "Ord som lagts till från en partsträff gäller i den här demonstrationen bara den egna sessionen.",
    },
    retention: {
      heading: "Bevarande och åtkomst",
      body:
        "Loggarna bevaras i minst 24 månader och kan varken ändras eller raderas. MI når dem via den här vyn eller via export, utan leverantörens medverkan.",
      export: "Exportera loggar",
    },
  },
  anvandare: {
    title: "Användare",
    epic: "Behörighetsadministration",
    subtitle: "Användare, roller och tilldelade behörigheter",
    roles: {
      heading: "Roller och behörigheter",
      intro:
        "De åtta rollerna i Bilaga 1 §3.1. Rollen avgör både vad användaren får göra och vilka menyval som visas – rollväxlaren i demoläget byter roll för att göra just det synligt.",
      role: "Roll",
      person: "Exempelanvändare",
      permissions: "Behörighet",
      menu: "Menyval",
      level: { write: "Skriv", read: "Läs", none: "–" },
      matrixNote:
        "Läs betyder att rollen kan öppna vyn men inte ändra något i den. Skriv betyder registrera och redigera. Samma funktion styr menyn, åtkomsten till vyn och den här tabellen, så de kan inte säga emot varandra.",
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
