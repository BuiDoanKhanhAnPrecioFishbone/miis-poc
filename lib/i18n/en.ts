/**
 * English — a complete second translation of the interface.
 *
 * It exists so the internal team and non-Swedish reviewers can read the mockup.
 * It is not a product feature: the delivered system is Swedish, every screenshot
 * in the tender is Swedish, and the switch lives in the demo bar.
 *
 * Typed as `Dictionary`, so a missing or misspelt key fails `npm run build`.
 * Keep the key order identical to `sv.ts` — it is how the two stay reviewable
 * side by side.
 *
 * Swedish domain terms with no English equivalent are kept and glossed rather
 * than translated: Märket, Ettan and Tvåan, bokslut, avtalsrörelse.
 */

import type { Dictionary } from "./sv";

export const en: Dictionary = {
  common: {
    appName: "MIIS",
    appSubtitle: "The Swedish National Mediation Office information system",
    skipToContent: "Skip to content",
    mainMenu: "Main menu",
    loggedInVia: "miis.mi.se · Signed in with EFOS",
    benchmarkTerm: "Märket (industry benchmark)",
    aiProposal: "AI proposal",
    aiMark: "AI",
    aiNotice:
      "Machine-generated material. Nothing is registered until a case officer has approved it.",
    aiRegionLabel: "AI proposal – reviewed by a case officer",
    empty: "Nothing to show.",
    none: "–",
    yes: "Yes",
    no: "No",
    close: "Close",
    approve: "Approve",
    adjust: "Adjust",
    reject: "Reject",
    save: "Save",
    cancel: "Cancel",
    required: "Required",
    action: "Action",
    requiredLegend: "Fields marked Required must be filled in.",
    add: "Add",
    choose: "Choose",
    search: "Search",
    exportLabel: "Export:",
    showingOf: (shown: number, total: number) => `Showing ${shown} of ${total}`,
    showAll: (n: number) => `Show all (${n})`,
    agreementCount: (n: number) => `${n} agreements`,
    andMoreRows: (n: number) => `… ${n} more rows`,
    reqTagAria: (id: string) => `Requirement ID ${id}`,
    sortBy: (column: string) => `Sort by ${column}`,
    sortedAscending: "Sorted ascending",
    sortedDescending: "Sorted descending",
    backTo: (page: string) => `Back to ${page}`,
    notAuthorised: "Not authorised",
    notAuthorisedFor: (screen: string, role: string) =>
      `${screen} is not part of the permissions for the role ${role}. Switch role in demo mode to see the view. In MIIS this is governed by the authorisation administrator (NFÅ-003).`,
    uploadNeedsStore:
      "File upload needs the document store and is part of Steg 1. The protocol upload in the registration flow is the one that runs without it.",
    exportNeedsServer:
      "File export runs on the server and is part of Steg 1. The print below is the export that runs without one.",
    notInDemo: "Not active in the demo",
    filtersNone: "No filters selected",
    filtersCount: (n: number) => (n === 1 ? "1 filter" : `${n} filters`),
    filterRemove: (label: string) => `Remove the filter ${label}`,
    filtersClearAll: "Clear all",
    requirementUnknown: "No requirement text is registered for this ID.",
  },

  demo: {
    title: "Demo mode – display settings, not part of the system",
    explain:
      "The role switcher, the language choice and the requirement IDs are aids for reviewing. None of them is proposed MIIS functionality.",
    role: "Role",
    dataset: "Data set",
    language: "Language",
    reqTags: "Requirement IDs",
    reqTagsOn: "Shown",
    reqTagsOff: "Hidden",
    sessionWarning: "Show session warning",
  },

  nav: {
    start: "Start",
    avtal: "Agreements",
    parter: "Parties",
    forhandlingar: "Negotiations",
    medling: "Mediation",
    partstraffar: "Party meetings",
    medlare: "Mediators",
    dokument: "Documents",
    sokRapporter: "Search & Reports",
    rapporter: "Reports",
    sok: "Search",
    market: "Märket",
    administration: "Administration",
    anvandare: "Users",
  },

  print: {
    action: "Print",
    printedAt: "Printed",
    withheld: "Information withheld – confidentiality-marked agreement",
  },

  ai: {
    launcher: "AI support",
    launcherWaiting: (n: number) =>
      n === 1
        ? "AI support – 1 proposal awaiting review"
        : `AI support – ${n} proposals awaiting review`,
    title: "The AI assistant",
    subtitle: "Integrated AI support for the registration work (Appendix 1 §4.1)",
    here: "The AI support on this page",
    hereLead:
      "The AI support is a fixed set of functions, each placed where the work is done. This says which of them apply to this page and where the others work. Functions outside your authorisation are not listed.",
    hereActive: "Works here",
    hereActiveLead:
      "The button takes you to the part of the page where the function runs. What it produces are proposals you approve or reject — nothing is saved on the way.",
    hereNone:
      "The AI support does not work on this page. That is deliberate: it belongs where the work is done, not everywhere.",
    hereElsewhere: "Works instead in",
    hereRationale:
      "§4.1 describes the AI support as integrated and names four functions, each placed where the work is done. This view says where they are and where they are not — a boundary an interface never states is a boundary the buyer has to take on trust.",
    tabAbout: "About",
    where: "Where",
    goThere: "Review the proposals",
    tabsLabel: "Parts of the AI support",
    tabAsk: "Ask",
    /* Verbs, because each tab is something the officer does. */
    tabTasks: "This page",
    tabQueue: "Review",
    chat: {
      label: "Your question",
      placeholder: "E.g. Which agreements expire within 90 days?",
      ask: "Ask",
      empty: "Type a question first.",
      notAuthorised: "Not authorised",
      seeAllIn: (screen: string) => `See all in ${screen}`,
      clear: "Clear the conversation",
      notStored: "The conversation is not stored.",
      suggestions: (n: number) => `Quick questions (${n})`,
      asked: "Asked",
      openingLead:
        "Ask a question about the agreements, the mediation cases or Märket (industry benchmark). The answer is fetched from the register and shows the records it counted - you can open each record straight from here.",
      feedback: {
        prompt: "Was the question understood correctly?",
        good: "Yes",
        bad: "No",
        report: "Report",
        thanks: "Thank you - the feedback is carried in the event log.",
        reported:
          "Reported. The question and the query that was run are carried in the event log for system management to follow up.",
      },
      refused: (screen: string) =>
        `${screen} is not part of your authorisation, so the question is not answered here. Access follows your role and is administered by the authorisation administrator.`,
      none: (what: string) => `No ${what} at the moment.`,
      found: (n: number, what: string) => `${n} ${what}:`,
      unmatched:
        "I cannot answer that. I answer by fetching records from the register rather than by composing anything — this is what I can fetch:",
      capabilities: "This is what I can fetch from the register:",
      what: {
        expiring: {
          one: "agreement expires within 90 days",
          many: "agreements expire within 90 days",
        },
        incomplete: { one: "incomplete registration", many: "incomplete registrations" },
        unpublished: {
          one: "agreement is complete but unpublished",
          many: "agreements are complete but unpublished",
        },
        mediations: { one: "ongoing mediation case", many: "ongoing mediation cases" },
        benchmark: { one: "registered benchmark", many: "registered benchmarks" },
        agreements: { one: "agreement matches", many: "agreements match" },
        capabilities: { one: "question", many: "questions" },
      },
      boundedNote:
        "The assistant runs a query against the register and shows the records. It composes no answers about collective agreements, because such an answer would be a new statement about the labour market with no record behind it. Authorisation applies to typed questions too — a role that may not read a register is not answered about it.",
    },
    goWhereItWorks: (where: string) => `Go to ${where}`,
    queue: "Awaiting your review",
    queueLead:
      "None of this is saved. The list is what the AI support has interpreted and no case officer has approved yet.",
    queueWhat:
      "The number is how many proposals the AI support has produced that nobody has approved yet. The list is shared by everyone who may register in the registers concerned - it is not personal - and it empties as the proposals are approved or rejected.",
    queueEmpty: "Nothing is awaiting review right now.",
    queueCount: (n: number) => (n === 1 ? "1 to review" : `${n} to review`),
    functions: "What the AI support does",
    boundaries: "What it does not do",
    boundariesLead:
      "The limits are stated in §4.1 and are part of what is being procured – a case officer who cannot see where the machine stops cannot review it.",
    traceability: "Traceability",
    traceabilityBody:
      "Both the AI's proposal and the officer's change are recorded in the change log with old value, new value, time and user (FH-001).",
    traceabilityAction: "Open the change log",
    readOnly:
      "Your role reads the AI proposals but does not approve them. Approval belongs to the role that may register in each register (NFÅ-003).",
  },
  documentTemplate: {
    open: "Open the document template",
    openNote:
      "The template opens with information from MIIS already filled in. Nothing is created until the case officer has reviewed it and pressed Create document.",
    variant: "Variant",
    prefilled: "Pre-filled from MIIS",
    body: "Document text",
    bodyNote: "The text comes from the template and can be changed before the document is created.",
    editedNote: "The text has been changed by the case officer. The change follows into the document and into the change log.",
    create: "Create document",
    created: "Document created",
    createdNote: "The document is created and linked to the case.",
    reopen: "Open the template again",
    fileNote: (name: string) => `The file will be named ${name}`,
  },


  walkthrough: {
    title: "Guided walkthrough",
    subtitle:
      "Role-based user scenarios and user interfaces, in the order the award criterion judges them. Every step switches role and opens the screen.",
    marker: "Reviewer material – not part of the system",
    markerBody:
      "This page is a reading aid for Medlingsinstitutet's evaluators and for the oral presentation. It is not in the menu, and nothing on it is proposed MIIS functionality.",
    scoredHeading: "The three roles the criterion names",
    scoredLead:
      "Appendix 1 §3.1 defines eight roles and the prototype has all eight — NFÅ-003 is a requirement about the system. The assessment is made on three, and they come first.",
    supportingHeading: "The other roles",
    supportingLead:
      "Not assessed, and built anyway: a bid that shows only the minimum is not the bid that receives very high added value. They are here as evidence that the system is complete, not as the opening.",
    taskAndGoal: "Task and goal",
    workflow: "Workflow",
    usability: "Usability, efficiency and accessibility",
    step: (n: number) => `Step ${n}`,
    contents: "Scenarios",
    contentsNote: (total: number, scored: number, steps: number) =>
      `${total} scenarios, ${scored} of them scored, ${steps} steps in all. One scenario is shown at a time.`,
    stepCount: (n: number) => `${n} steps`,
    scoredMark: "Scored",
    startScenario: "Start the scenario",
    startScenarioNote:
      "The role is switched and the screen opens. The way on to the next step is then in the demo strip, on every screen.",
    openStep: (n: number) => `Open step ${n}`,
    openStepAs: (n: number, role: string) => `Open step ${n} as ${role}`,
    showSupporting: (n: number) => `Show other roles (${n})`,
    hideSupporting: "Hide other roles",
    roleNote: (role: string) =>
      `Current role: ${role}. The role is changed by the buttons above and by the role switcher in the demo bar.`,
    toStart: "To the start page",
    demoLink: "Guided walkthrough",
    backToGuide: "Overview",
    position: (scenario: string, n: number, total: number) =>
      `${scenario} · step ${n} of ${total}`,
    next: (label: string) => `Next: ${label}`,
    nextAs: (label: string, role: string) => `Next: ${label} (as ${role})`,
    lastStep: "Last step in the scenario",
    previous: (label: string) => `Back: ${label}`,
    endWalkthrough: "End the walkthrough",
  },  session: {
    title: "Your session is about to expire",
    body: (minutes: number) =>
      `You have been inactive for some time. For security reasons you are signed out automatically after ${minutes} minutes of inactivity.`,
    remaining: (mm: string) => `Time remaining: ${mm}`,
    remainingAria: (minutes: number, seconds: number) =>
      `The session ends in ${minutes} minutes and ${seconds} seconds.`,
    unsaved: "Unsaved information in an ongoing registration is lost when you are signed out.",
    continueWorking: "Continue working",
    logout: "Sign out",
  },

  confidentiality: {
    marked: "Confidentiality-marked",
    markedAgreement: "Confidentiality-marked agreement",
    maskedValue: "Information not shown",
    reasonPublic: "Confidentiality-marked information is not shown in public views",
    reasonMediator: "Confidentiality-marked information is not shown to mediators",
    reasonUnauthorised:
      "You are not authorised to see confidentiality-marked agreement information",
    inStatistics: "The agreement is still included in statistics and totals",
    setBy:
      "The confidentiality mark is set by the agreement administrator and applies primarily to attached documents",
  },

  start: {
    heading: (role: string) => `Start page – ${role}`,
    subheading:
      (minutes: number) =>
        `Content adapted to the assigned role and its authorisation. Signed in with an EFOS card; the session ends after ${minutes} minutes of inactivity.`,
    benchmarkOverMonths: (n: number) => `over ${n} months`,
    benchmarkKicker: "Reference in agreement and mediator views",
    benchmarkLine: (period: string) => `Märket ${period}:`,
    benchmarkCostFrame: (v: string) => `Cost frame ${v}`,
    benchmarkPeriodisation: (v: string) => `Periodisation ${v}`,
    benchmarkSupplementary: (v: string) => `Supplementary agreement: ${v}`,
    benchmarkValidity: (from: string, to: string, registered: string) =>
      `Valid from ${from} to ${to} · Registered ${registered}`,

    table: {
      status: "Status",
      agreement: "Agreement",
      signed: "Signed",
      validity: "Validity",
      registrationStatus: "Reg. status",
    },

    uploadProtocol: "Upload agreement protocol",
    uploadDgDecision: "Upload Director-General decision",
    newSearch: "New search",

    reminders: {
      title: "My reminders",
      lead:
        "Dates when an agreement needs reviewing, soonest first. The reminder is also sent by e-mail with a link to the agreement.",
      empty: "No reminders right now.",
      footnote: "Reminders are also sent by e-mail with a link to the agreement",
    },
    incomplete: {
      title: "Incomplete registrations",
      lead:
        "Agreements saved with the status Incomplete, waiting to be finished. The same selection appears in the Short-Term Wage Report with a status column and a link to the protocol — that is where the completion is done.",
      empty: "All registrations are complete.",
      badge: "Incomplete",
      footnote:
        "Shown in the Short-Term Wage Report view with a status column, a protocol link and which agreements have already been exported",
      action: "Open the Short-Term Wage Report",
    },
    recent: {
      title: "Recently registered agreements",
      lead:
        "The most recently registered agreements, newest first — the officer's own work list, and a quick check that yesterday's registrations landed correctly.",
      empty: "No agreements registered yet.",
    },
    events: {
      title: "Latest events",
      empty: "No events logged yet.",
      footnote: "From the event log – the full log is under Administration",
    },
    ongoingMediations: {
      title: "Ongoing mediations",
      empty: "No ongoing mediations.",
      badge: "Ongoing",
      footnote:
        "Mediation cases are created automatically when a Director-General decision is uploaded",
      action: "Open mediation cases",
    },
    dgDecisions: {
      title: "Decisions to finalise",
      empty: "No decisions awaiting finalisation.",
      badge: "Not finalised",
      footnote:
        "On finalisation a notification e-mail with a link is sent to the mediator administrator and the send is logged",
    },
    partyMeetings: {
      title: "Upcoming party meetings",
      empty: "No party meetings scheduled.",
      footnote: "Interactive view for entering information during the meeting itself",
      action: "Open party meetings",
      items: [
        "2027-06-04 · Almega Tjänsteförbunden – ahead of the bargaining round",
        "2027-06-11 · IF Metall – coordinated bargaining demands",
      ],
    },
    mediatorRegister: {
      title: "Mediator register",
      empty: "No mediators registered yet.",
      assignments: (n: number) => `${n} assignments`,
      active: "Active",
      inactive: "Inactive",
      footnote:
        "Statistics per mediator (year and agreement area) are shown as decision support before appointment",
      action: "Open the mediator register",
    },
    casesNeedingMediators: {
      title: "Cases awaiting a mediator",
      empty: "No cases to complete.",
      assigned: "Mediators appointed",
      missing: "No mediator",
      footnote: "Notification arrives by e-mail when a mediation decision is finalised",
    },
    savedSearches: {
      title: "Saved searches",
      footnote: "Composite searches across several document types – without helper variables",
      action: "Open the query builder",
      items: [
        "Annual report 2026",
        "Eurofound selection",
        "Agreements without figures, private sector",
      ],
    },
    snapshots: {
      title: "Snapshots and extracts",
      footnote:
        "A snapshot (bokslut) reconstructs the data as it stood on a given date. Standard searches respond within 3 seconds",
      latest: "Latest",
      items: [
        "Snapshot as at 2026-12-31 · 143 hits",
        "Export to Excel · 2026-12-31",
        "Export to CSV/JSON · 2026-11-30",
      ],
    },
    logs: {
      title: "Logs",
      footnote:
        "Logs are retained for at least 24 months and cannot be changed or deleted – not even by the system administrator",
      action: "Open Administration",
      items: [
        "Change log · 1,284 entries in the last 30 days",
        "Event log · 96 entries in the last 30 days",
        "Sign-ins · 412 entries in the last 30 days",
      ],
    },
    watchwords: {
      title: "Watchwords",
      footnote: "The table is updated ahead of the coming bargaining round",
      active: "Active",
      items: ["arbetstidsförkortning", "deltidspension", "jämställdhetspott"],
    },
    users: {
      title: "Users and roles",
      footnote:
        "Permissions are administered by MI's own authorisation administrators without supplier involvement",
      action: "Open user administration",
      active: "Active",
      items: [
        "Anna Andersson · Agreement administrator",
        "Per Persson · Mediation administrator",
        "Karin Karlsson · Statistics user",
      ],
    },
    userTasks: {
      title: "To handle",
      badge: "Action",
      item: "A new colleague exists in Enterprise IAM/SSID – no role assigned",
      footnote: "Users authenticate with an EFOS card via Försäkringskassan's IdP (SAML 2.0)",
    },
    mediatorAssignments: {
      title: "My mediation assignments",
      empty: "No active assignments.",
      badge: "Ongoing",
      item: "M-2027/12 · Rail traffic – Tågföretagen / Seko · Ettan (lead)",
      footnote:
        "External access via Bank-ID through Försäkringskassan's identification solution (option, stage 2)",
    },
    mediatorMaterial: {
      title: "Reports I have access to",
      items: [
        "Agreement – Mediators · the agreement's periods, termination and linked documents",
        "Agreement – Bargaining round · agreements and employees by expiry",
        "Agreement – Expiry dates · agreements in force by month and employer group",
      ],
      footnote:
        "Appendix 1 §3.1 gives the Mediator role the permission Specific reports, and Appendix 3 §5.1 names the three. Confidentiality-marked information is excluded from all of them (NFÅ-004, FR-011).",
      action: "Open the reports",
    },
  },

  registrera: {
    title: "Register an agreement protocol",
    subtitle:
      "An incoming protocol is read with AI support and reviewed by a case officer before anything is saved",
    stepsLabel: "Registration steps",
    stepState: { done: "Done", current: "In progress", upcoming: "Remaining" },
    steps: [
      "1. Upload",
      "2. AI analysis",
      "3. Agreement (matched)",
      "4. Wage agreement / General terms",
      "5. Link the protocol",
    ],
    upload: {
      title: "Upload an agreement protocol",
      intro:
        "The protocol reaches MI as a scanned document or a PDF and is uploaded by the case officer.",
      dropHint: "Drag the protocol here, or choose it from your computer.",
      dropActive: "Drop the file to start the interpretation",
      choose: "Choose a file",
      accepts: "PDF, TIFF, PNG or JPG",
      fileNameNote:
        "If the agreement name is not stated in the protocol, the file name is used as identification input.",
      rejected: (name: string) =>
        `${name} is in a format that cannot be OCR-interpreted. Upload a PDF, TIFF, PNG or JPG.`,
      pipelineTitle: "This happens automatically once the file is uploaded",
      stages: {
        receive: "Receiving the document and linking it to the agreement",
        ocr: "OCR-interpreting scanned text",
        watchwords: "Searching for watchwords from the watchword table",
        match: "Matching the content against existing agreements",
      },
      progress: (done: number, total: number) => `${done} of ${total} steps done`,
      ready: (name: string) => `${name} has been read and interpreted.`,
      replace: "Replace the protocol",
      replaceWarning: (n: number) =>
        n === 1
          ? "Replacing the protocol clears the form, including 1 value you have adjusted."
          : n === 0
            ? "Replacing the protocol clears the form and the approval."
            : `Replacing the protocol clears the form, including ${n} values you have adjusted.`,
      replaceConfirm: "Yes, replace the protocol",
      replaceCancel: "Keep the protocol",
      size: (kb: string) => `${kb} kB`,
      identifiedAs: (name: string) => `Identification input from the file name: ${name}`,
      demoNote:
        "In the mockup the file name and size are those of the uploaded file, while the protocol text below is prepared sample data. A real installation OCR-interprets the uploaded file.",
    },
    document: {
      ocr: "OCR",
      viewLabel: "Protocol view",
      viewText: "Text",
      viewOriginal: "Original",
      originalAlt: "Scanned page 1 of the agreement protocol between Föreningen Industriarbetsgivarna and Unionen",
      openFullSize: "Open the page at full size",
      originalNote: "The page is the Mediation Office's own example from Bilaga D of the requirement specification. The signatures are redacted in the original.",
      watchwordHits: (n: number) => `Highlighted text = hit in the watchword table (${n} hits)`,
      sourceHint:
        "Choose the AI mark beside a field on the right and the passage it was read from is marked here in the protocol.",
      sourceActive: (field: string) => `Showing the source for: ${field}`,
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
        title: "Search the protocol for a provision",
        optional: "Optional step",
        purpose:
          "Use it when the protocol carries wording that belongs in no field of its own — gender equality, working-time reduction, part-time pensions. Approved hits land under Särskilda frågor (special questions) on the agreement, with the protocol's own wording as the agreement text.",
        intro:
          "Type what you are looking for and the AI support searches the protocol and proposes the hits for registration. Nothing is saved until you approve it, and every proposal points back to the passage it was read from.",
        label: "Search term",
        placeholder: "E.g. jämställdhet",
        search: "Search the protocol",
        tooShort: "Type at least two characters.",
        suggested: "Common searches:",
        results: (term: string) => `Hits for “${term}”`,
        noHits: (term: string) =>
          `No provision about “${term}” was found in the protocol. Try another word — the search covers the protocol's text, not the whole register.`,
        equality: "Gender equality question",
        wouldRegister: (question: string) =>
          `Registered as a special question: ${question}. The passage becomes the agreement text, unedited.`,
        showSource: "Show in the protocol",
        registered: "Approved. The provision is registered as a special question on the agreement.",
        registeredWhere: "It is found under Särskilda frågor once the agreement is saved.",
        rejected: "Rejected. Nothing was registered.",
        boundedNote:
          "This is the free-text search §4.1 asks for, bounded the way the requirement bounds it: one term, one protocol, and a proposal of a known shape. A box that accepts any instruction has no defined output and therefore nothing to review — and FAI-002 is a guarantee about review.",
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
      title: "AI analysis 1 – identifying the agreement",
      area: "Agreement area",
      matched: "Agreement (existing in MIIS)",
      alternativeName: "Alternative agreement name",
      agreementType: "Agreement type",
      employerOrg: "Employer party (AGO)",
      employeeOrg: "Employee party (ATO)",
      validation:
        "Validation and logical checks: no deviations. Where the protocol does not state the agreement name, the file name or the parties' shared agreement is used instead.",
    },
    analysis2: {
      title: "AI analysis 2 – validity and termination",
      signedDate: "Date signed",
      validity: "Validity period",
      termination: "Right of termination",
      nothingAutomatic:
        "Nothing is saved automatically – incorrect AI proposals are corrected freely before approval",
    },
    review: {
      heading: "Matched agreement – the AI proposal needs your approval",
      aiFilled: "AI proposal",
      adjusted: "Adjusted",
      sourceButton: (field: string) => `AI proposal – show the source for ${field} in the protocol`,
      aiLegend:
        "Fields marked AI were pre-filled by the AI analysis. Choose the AI mark beside a field and the passage it was read from is marked in the protocol on the left.",
      lockedByApproval: "Locked by the approval – reopen the registration to change it",
      approvedLockNote:
        "The fields are locked by the approval. They can be read and copied but not changed — choose Reopen for changes if something needs correcting.",
      aiProposed: (value: string) => `AI proposed: ${value}`,
      reset: "Restore the AI proposal",
      resetFor: (field: string) => `Restore the AI proposal for ${field}`,
      nothingSaved: "Nothing is saved without manual approval",
      approve: "Approve the AI proposals",
      approved: "The AI proposals are approved",
      reopen: "Change",
      adjustedCount: (n: number) =>
        n === 1
          ? "1 field was adjusted by the case officer"
          : `${n} fields were adjusted by the case officer`,
      noneAdjusted: "No field has changed since the AI analysis",
      emptyBlocks: (n: number) =>
        n === 1
          ? "1 required field is empty. The registration can be saved as incomplete and completed later."
          : `${n} required fields are empty. The registration can be saved as incomplete and completed later.`,
      changeLogNote:
        "Both the AI proposal and the officer's change are recorded in the change log with time and user.",
    },
    wage: {
      title: "Wage agreement 2027",
      intro:
        "The 2027 bargaining round gives the agreement a new row. The previous wage agreement stays unchanged in the agreement view.",
      construction: "Agreement construction (1–7)",
      constructionHint: "Seven MI-defined constructions",
      scope: "Wage scope (%)",
      costFrame: "Cost frame (%)",
      individualGuarantee: "Individual guarantee",
      workingTimeFlag: "Working time reduction",
      workingTimeCost: "Cost of working time reduction (%)",
      revisionDate: "Wage revision, date",
      revisionPercent: "Wage revision (%)",
      revisionHint: "Linked to the wage agreement",
      minimumWage: "Minimum wage (SEK/month)",
      minimumWageDate: "Minimum wage applies from",
      minimumWageHint: "Linked to the wage agreement",
      equalityFlag: "Gender equality flag – wording identified",
      benchmarkFlag: "Industry benchmark (norm-setting agreement)",
    },
    terms: {
      title: "General terms",
      intro:
        "Registered only where the terms run to a different period than the wage agreement. Leave the fields empty where the periods follow each other.",
      ownSignedDate: "Own date signed",
      ownValidFrom: "Own validity from",
      ownValidTo: "Own validity to",
      ownValidity: "Own validity period",
      note: "The validity periods of the wage agreement and the general terms need not coincide",
    },
    link: {
      title: "Link the negotiation and the protocol",
      negotiation: "Registered negotiation",
      linkedAgreement: "Agreement",
      linkedWage: "Wage agreement",
      linkedNegotiation: "Negotiation",
      documentLinkedToHint:
        "Follows from what the registration creates — a protocol establishing only general terms produces no wage agreement to link to.",
      documentLinkedTo: "Document is linked to",
      documentLinkedToValue: "Agreement + wage agreement + negotiation",
    },
    save: {
      title: "Save the registration",
      registrationStatus: "Registration status",
      statusFromAction:
        "Set by the choice below: Approve and link gives the status Complete, Save as incomplete gives the status Incomplete.",
      agreementStatus: "Agreement status",
      statusKey: "How the status appears in agreement lists and reports:",
      approveAndLink: "Approve and link the protocol",
      approveFirst: "Approve the AI proposals first — nothing can be linked before they are reviewed.",
      registered: "The protocol is registered and linked",
      registeredWhere:
        "The agreement is now in the agreement register with the status Newly signed, no mediation, and appears under Agreements, in Search and in the reports. The change log has recorded who approved it and when.",
      registeredNext: "Open the agreement",
      registeredNote:
        "The agreement, the wage agreement and the negotiation are linked to the protocol. The change log has recorded who approved it and when.",
      reopen: "Change the registration",
      saveIncomplete: "Save as incomplete",
      savedIncomplete: "Saved as incomplete",
      savedIncompleteNote:
        "The registration keeps the status Incomplete and a reminder is sent until the details are completed. The agreement appears in the register, marked Incomplete.",
      incompleteNote: "An incomplete registration is followed up with a reminder",
      confidentialityLabel: "Confidentiality-mark the agreement",
      confidentialityHint:
        "Set by the agreement administrator, applies primarily to attached documents and hides details from mediators and the public",
      auditNote:
        "On save, the change log records what changed, by whom and when, and the event “agreement signed” is added to the event log. An agreement signed after mediation is colour-coded red rather than green.",
    },
  },

  sok: {
    title: "Search",
    subtitle: "Composite search across several document types, with snapshots and export",
    criteria: {
      title: "Selection criteria",
      infoTypeLabel: "Information type",
      groupLabel: (n: number) => `Group ${n}`,
      groupJoinLabel: (n: number) => `Operator for group ${n}`,
      groupJoinAll: "AND",
      groupJoinAny: "OR",
      joinExplain:
        "Conditions inside a group are combined with the group's operator. The groups are then combined with each other. That makes (A OR B) AND C expressible – today's query builder only manages a flat list.",
      expression: "Expression:",
      addCondition: "Add condition",
      addGroup: "Add group",
      removeCondition: (label: string) => `Remove the condition ${label}`,
      removeGroup: (n: number) => `Remove group ${n}`,
      fieldAria: (group: number, row: number) => `Field, condition ${row} in group ${group}`,
      operatorAria: (group: number, row: number) => `Operator, condition ${row} in group ${group}`,
      valueAria: (group: number, row: number) => `Value, condition ${row} in group ${group}`,
      freeText: "Free text in uploaded documents and selections",
      freeTextValue: "arbetstidsförkortning",
      documentTypes: "Document types in the search",
      documentTypesSelected: (n: number, total: number) =>
        `${n} of ${total} document types selected – today's query builder manages at most two at once`,
      documentTypesNote:
        "Full support without the technical helper variables today's query builder requires",
      snapshot: "Snapshot – reconstruct data as at",
    },
    columns: {
      title: "Presentation columns",
      intro: "Untick a column to leave it out of the result and the printout.",
      identityLocked: "Carries the record's name and the link that opens it",
      nothingToSave: "No selection to save — add at least one condition.",
      saveNameLabel: "Name of the search",
      saveNameHint: "e.g. Figureless agreements, private sector",
      nameRequired: "Give the search a name first.",
      saveSearch: "Save search",
      savedSearchName: "Annual report 2026",
      savedSearchBlocked:
        "A saved search belongs to a user, and a user is a link to an identity in Försäkringskassan's IdP that this prototype has no store behind.",
      savedSearchNote:
        "A saved search is reused later and then returns updated figures – the selection is saved, not the result.",
      items: [
        "Agreement",
        "Parties (AGO/ATO)",
        "Agreement construction",
        "Wage scope %",
        "Employees",
        "Industry code",
      ],
    },
    chips: {
      heading: "Active selection",
      remove: (label: string) => `Remove the selection ${label}`,
      clearAll: "Clear the selection",
      empty: "No selection made – the search covers all agreements.",
    },
    saved: {
      title: "Saved searches",
      note: "Loads the selection, not a stored result — the register answers with what holds today.",
      conditions: (n: number) => (n === 1 ? "1 condition" : `${n} conditions`),
    },
    results: {
      title: (hits: number, seconds: string, date?: string) =>
        `Results · ${hits} ${hits === 1 ? "hit" : "hits"} · ${seconds} s${date ? ` · Snapshot as at ${date}` : ""}`,
      liveNote: "The result below narrows as the selection changes.",
      empty: "No record matches the selection. Remove a condition or change an operator.",
      mediationCase: "Case",
      mediationType: "Mediation type",
      mediators: "Mediators",
      negotiation: "Negotiation",
      negotiationType: "Type",
      party: "Party",
      partyType: "Party type",
      sector: "Sector",
      linkedAgreements: "Linked agreements",
      centralOrganisation: "Confederation",
      negotiationStatus: {
        ongoing: "Ongoing",
        "closed-with-agreement": "Closed with agreement",
        "closed-without-agreement": "Closed without agreement",
      },
      responseNote: (seconds: string) =>
        `Response time ${seconds} s. The requirement is a response within 3 seconds for standard searches.`,
      status: "Status",
      agreement: "Agreement",
      parties: "Parties",
      construction: "Construction",
      scope: "Wage scope %",
      open: "Open",
      openAt: (date: string) => `Show as at ${date}`,
      pointInTimeNote:
        "An individual agreement opens with the wage agreements and general terms that were valid at that point in time",
      stage2Note:
        "Stage 2: the agreement area with its associated agreements at the chosen point in time as well",
      exportNote: "Composite searches across several document types – without helper variables",
      savedSearches: "Saved searches:",
    },
  },

  medling: {
    title: "Mediation",
    subtitle:
      "Mediation cases from Director-General decisions, with linked agreements and appointed mediators",
    empty: "No mediation cases registered in this data set.",
    table: {
      caseNumber: "Case",
      name: "Agreement area",
      type: "Type",
      dgDecision: "DG decision",
      agreements: "Linked agreements",
      mediators: "Mediators",
      status: "Status",
    },
    noMediators: "None appointed",
    open: "Open the case",
  },

  mediationCase: {
      tabs: {
        label: "Parts of the mediation case",
        case: "The case",
        mediators: "Mediators",
        documents: "Documents",
        outcome: "Outcome",
      },
    heading: (number: string, type: string) => `Mediation case ${number} – ${type}`,
    uploaded: (number: string) => `${number} – uploaded, case created automatically`,
    registryNumber: "Registry number (registry system)",
    decisionDate: "Decision date",
    type: "Type",
    dgDecisionDocument: "DG decision (document)",
    linkedAgreements: (n: number) => `Linked agreements (${n})`,
    linkAgreement: "Link an agreement",
    linkedNote:
      "Red marking = linked to mediation. One mediation case can be linked to several agreements.",
    mediators: "Mediators (from the mediator register)",
    addMediator: "Add a mediator",
    noMediators:
      "No mediators appointed – the parties mediate under their own procedure per a negotiation procedure agreement.",
    previousAssignments: (n: number) => `${n} previous assignments`,
    position: (p: string) => `Position: ${p}`,
    mediatorStatsNote:
      "Statistics per mediator (year and agreement area) are shown in the mediator register",
    procedureAgreement: "Negotiation procedure agreement",
    coveredNot: "The agreement area is NOT covered by a negotiation procedure agreement.",
    covered: "The agreement area is covered by a negotiation procedure agreement.",
    miAppoints: "The Mediation Office appoints mediators.",
    partiesMediate: "The parties mediate under their own procedure. MI appoints no mediator.",
    procedureNote:
      "Where the agreement is covered by a negotiation procedure agreement the parties mediate under their own procedure and MI appoints no mediator.",
    benchmarkTitle: "Märket (reference in the mediator view)",
    benchmarkMonths: (n: number) => `${n} months`,
    benchmarkPeriod: (from: string, to: string) => `Period ${from} – ${to}`,
    documents: "Documents and actions",
    createDecision: "Create a Director-General mediation decision",
    withNotice: "With industrial action notice",
    withoutNotice: "Without notice",
    decisionNumber: "Decision number",
    sourceCase: "From the mediation case",
    sourceRegister: "From the mediator register",
    decisionHeading: (nr: string) => `Director-General's decision no. ${nr}`,
    decider: "Decided by",
    presenter: "Presented by",
    matter: "Matter",
    mediation: "Mediation",
    bodyWithNotice: (area: string, mediators: string) =>
      `Following a request from the parties concerned, and in view of a notice of industrial action, Medlingsinstitutet orders mediation in the dispute between the parties over a new collective agreement (${area}).\n\nAppointed as mediators: ${mediators}.`,
    bodyWithoutNotice: (area: string, mediators: string) =>
      `With the consent of the parties concerned, Medlingsinstitutet orders mediation in the dispute between the parties over a new collective agreement (${area}).\n\nAppointed as mediators: ${mediators}.`,
    decisionLogNote:
      "The decision is linked to the mediation case and recorded in the change log with time and user. Appendix E holds Medlingsinstitutet's own examples of both variants.",
    finalise: "Finalise the decision",
    finaliseNote:
      "A notification e-mail with a link is sent to the mediator administrator and logged",
    templateNote:
      "The document templates are pre-filled with information from MIIS and can be edited before completion",
    admin: {
      remove: "Remove",
      mediatorLabel: "Mediator from the register",
      mediatorPlaceholder: "Choose a mediator",
      positionLabel: "Position",
      appoint: "Appoint the mediator",
      pickMediator: "Choose a mediator first.",
      noCandidates:
        "Every active mediator who takes this mediation type is already appointed to the case.",
      mediatorAdded: (name: string, position: string) =>
        `${name} is appointed as ${position.toLowerCase()}. The appointment counts in the mediator's statistics.`,
      mediatorRemoved: (name: string) => `${name} is no longer appointed to the case.`,
      mediatorNote:
        "Only active mediators who take this mediation type are listed. The first-chair or second-chair position is what counts in the statistics per mediator.",
      noAgreements: "No agreement is linked to the case yet.",
      agreementLabel: "Agreement from the register",
      agreementPlaceholder: "Choose an agreement",
      link: "Link the agreement",
      pickAgreement: "Choose an agreement first.",
      noAgreementCandidates: "Every agreement in the dataset is already linked to the case.",
      agreementAdded: (name: string) => `${name} is linked to the mediation case.`,
      agreementRemoved: (name: string) => `${name} is no longer linked to the case.`,
      noOutcome:
        "No outcome registered. The outcome is registered when the mediation has ended and is the basis for Medlingsinstitutet's statistics on industrial action.",
      actionTypePlaceholder: "e.g. strike, blockade, lockout",
      finalisedLabel: "Decision finalised",
      finalisedNote: (date: string, by: string) =>
        `Finalised ${date} by ${by}. A notification e-mail with a link to the case has been sent to the mediator administrator, and the dispatch is in the event log.`,
      reopenDecision: "Undo the finalisation",
    },
    outcome: "Mediation outcome",
    outcomeType: "Type of mediation",
    industrialAction: "Industrial action",
    industrialActionType: "Type of industrial action",
    lostWorkingDays: "Lost working days",
    affectedEmployees: "Employees affected",
    outcomeNote:
      "If mediation closes without an agreement the negotiation is marked closed with a status. If an agreement is signed after mediation it is colour-coded red and linked through the protocol registration.",
    registerStanding: "Register standing mediation (simplified form)",
    eventLog: "Event log for the affected agreements",
    eventLogNote: "The agreements are colour-coded red in the views as linked to mediation",
  },

  decisionSupport: {
    title: "Decision support ahead of mediation",
    subtitle: "Material from MIIS – the system makes no decision",
    open: "Open decision support",
    closeAria: "Close decision support",
    otherParties: "Other parties in the agreement area",
    previousMediations: "Previous mediations",
    contagionRisk: "Contagion risk",
    scopeNote:
      "The decision support compiles information that already exists in MIIS. It never proposes a mediator, an action or an outcome – the judgement is the mediation administrator's.",
    reviewNote: "Always check against the source documents before deciding.",
  },

  rapporter: {
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
      emptyPopulation: "No agreement is included in this extract.",
    },
    population: {
      pension: "Pension agreements and other agreements",
      pensionNote:
        "Agreements with a registered agreement type. The selection criteria above narrow the population.",
      website: "Publication material for mi.se",
      eurofound: "Eurofound and minimum-wage reporting",
      selectionNote:
        "The selection is governed by the agreement's own report selection rather than by the party criteria — MI decides per agreement what goes out where.",
    },
    title: "Reports",
    subtitle: "Report extracts, monitoring lists and scheduled distribution",
    tabs: {
      label: "Parts of the reports page",
      run: "Report extract",
      shortTerm: "Short-Term Wage Report",
      scheduled: "Scheduled extracts",
    },
    shortTerm: {
      heading: "Konjunkturlönerapporten (Short-Term Wage Report)",
      intro:
        "Monitored agreements ahead of the next extract. The report is printed from this view, and an agreement can be included even when its registration is not yet complete – the protocol is linked either way.",
      period: "Extract period",
      lastExport: "Last extract",
      table: {
        select: "In the extract",
        agreement: "Agreement",
        parties: "Parties",
        registration: "Registration status",
        protocol: "Protocol",
        exported: "Previously exported",
        reminder: "Reminder",
      },
      registered: "Registered",
      partiallyRegistered: "Partially registered",
    notRegistered: "Not registered",
      openProtocol: "Open protocol",
      protocolMissing: "No protocol",
      protocolIncompleteNote:
        "The protocol is linked for partially registered agreements too – the case officer can read the source without completing the registration first.",
      exportedYes: (date: string) => `Yes · ${date}`,
      exportedNo: "No",
      setReminder: "Set a reminder",
      reminderChange: "Change",
      reminderRemove: "Remove",
      reminderHeading: (name: string) => `Reminder for ${name}`,
      reminderIntro:
        "The date the agreement is to be looked at again. The reminder is counted on the start page and sent by e-mail to the agreement administrator on that day.",
      reminderDate: "Remind on",
      reminderSave: "Save the reminder",
      reminderDateRequired: "Choose a date first.",
      reminderSavedNote: (name: string, date: string) =>
        `A reminder is set on ${name} for ${date}. It appears on the start page and is sent by e-mail that day.`,
      reminderRemovedNote: (name: string) => `The reminder on ${name} has been removed.`,
      reminderSet: (date: string) => `Reminder ${date}`,
      selectedCount: (selected: number, total: number) =>
        `${selected} of ${total} agreements in the extract`,
      incompleteWarning: (n: number) =>
        `${n} agreements in the extract are partially registered. They are included, and flagged in the report.`,
      export: "Print the report",
      exportFormats: "Word · Excel · PDF",
      markExported: "Mark as exported",
      markExportedNothing: "No agreement is selected for the extract.",
      markExportedDone: (n: number, date: string) =>
        `${n} agreements marked as exported on ${date}.`,
      markExportedNote:
        "The extract is noted per agreement, so the next extract shows what has already been delivered to the report.",
    },
    runner: {
      heading: "Report extract",
      intro:
        "Choose the report, fill in the selection and generate. The criteria differ between reports and follow Medlingsinstitutet's own selection screens; criteria left empty are printed as All.",
      pick: "Choose report",
      all: "All",
      format: "Format",
      needsServer: "needs a server",
      formatNote: "Only PDF runs in the mockup — the other formats need a server.",
      generate: "Generate report",
      selectionHeading: "Selection criteria",
      stage2: "Stage 2",
      stage2Reason: "The report is marked as Stage 2 in Medlingsinstitutet's own requirement table.",
      bilagaF: (n: number) => `Appendix F, report ${n}`,
      noSelectionLabel: "No selection screen",
      noSelection:
        "The Short-Term Wage Report is written out from the view of monitored agreements — the list is the selection. It is the only one of the reports that works that way, and that follows from the requirement text (FR-008).",
      onScreen:
        "The report is a printout of a view MIIS already has. Open the view and print it there, so the printout follows the same confidentiality rules as the screen.",
      openView: "Open the view",
      onScreenOne: (name: string) =>
        `The selection identifies one agreement: ${name}. The button opens that agreement, not the list.`,
      openAgreement: (name: string) => `Open ${name}`,
      onScreenMany: (n: number) =>
        `The selection matches ${n} agreements, and this report is printed one agreement at a time. Narrow the selection above until one remains, or open the view and choose there.`,
      onScreenNone:
        "No agreement matches the selection. Widen it above, or open the view and search there.",
      notBuilt: "The report's content is not built in the mockup.",
      chooseAgreement: "Choose an agreement in the selection above. The report releases one agreement at a time.",
      notReleasable:
        "The agreement is not released to mediators. Either it is confidentiality-marked, or it has not been signed and is therefore not in force (Bilaga 3 §7.4: only valid agreements are shown).",
      transcribedLabel: "Medlingsinstitutet's own figures",
      transcribed:
        "Agreement constructions counts employees across the whole Swedish labour market — 3,797,764 people in Medlingsinstitutet's own printout. The figures below are therefore Medlingsinstitutet's published ones, with the selection they were taken under (Employer org: Almega Tjänsteförbunden), and are not changed by the selection above. The bargaining round counts the register's own agreements and follows the selection in full.",
      rationale:
        "Appendix F opens by stating that for every report a selection screen and a result are shown. The selection is therefore part of the report rather than a step before it — which is why the criteria are printed at the head of the result.",
    },
    mediatorRelease: {
      title: "Agreement – Mediators",
      confidentialityNote:
        "Confidentiality- and GDPR-marked information is not shown (Bilaga 3 §7.4). A marked agreement is not released at all — it is not shown with blank fields.",
      notReleasableLabel: "Nothing released",
      employerOrg: "Employer organisation",
      employeeOrg: "Employee organisation",
      signedDate: "Signed",
      period: "Validity period",
      expires: "Expires without renewal",
      earlyTermination: "Early termination",
      protocols: "Protocols",
      agreementFiles: "Agreements",
      mediationFiles: "Mediation documents",
      noDocuments: "No documents to release in this section.",
      otherAgreements: "Other agreements the employer organisation signs",
      otherAgreementsNote:
        "Sorted by employee organisation and agreement name. This is the section that makes the report worth running: a mediator needs to know what the same employer organisation has already settled.",
      noOtherAgreements: "The employer organisation has no other agreements in force on record.",
    },

    expiry: {
      title: (year: number) => `Expiry dates ${year}`,
      intro:
        "Agreements in force distributed by the month they expire. Unlike the Bargaining Round Report, which splits the year by agreement status, this report splits the year by who signs the agreement.",
      onlyCurrent:
        "Only agreements in force are included (Appendix 3 §7.11). An agreement not yet signed is remaining, and is not counted here.",
      month: "Month",
      agreements: "Agreements",
      employees: "Employees",
      allSectors: "All sectors",
      confederation: "Svenskt Näringsliv",
      byGroup: "Svenskt Näringsliv by employer group",
      byGroupNote: "Largest first, counted in employees. The month order within each group follows the report's own sorting.",
      sectionTotal: (agreements: string, employees: string) =>
        `${agreements} agreements · ${employees} employees`,
      emptySection: "No agreements expire during the year in this part.",
      derivedNote:
        "The tables and charts are derived from the agreement register at the moment of extraction. All three parts share a scale, so a small part does not look like a large one. An agreement with no employee figure is shown as ¤, as in Medlingsinstitutet's own reports.",
    },
    bargainingRound: {
      title: (year: number) => `The ${year} bargaining round`,
      intro:
        "Agreements and employees distributed by the month the agreement expires. The colours are agreement status under FR-012.",
      month: "Month",
      sum: "Total",
      agreements: "Agreements",
      employees: "Employees",
      byAgreement: "Number of agreements",
      byAgreementIntro:
        "Agreements that are remaining, newly signed and signed after mediation, distributed by expiry.",
      byEmployee: "Number of employees",
      byEmployeeIntro:
        "Employees covered by agreements that are remaining, newly signed and signed after mediation.",
      derivedNote:
        "The tables are derived from the agreement register at the moment of extraction, not from stored totals. An agreement with no employee figure is counted in the agreement table and not in the employee one — the same hole Medlingsinstitutet's own report shows as ¤.",
    },
    constructions: {
      selectionHeading: "Selection criteria",
      employerOrg: "Employer org",
      employeeOrg: "Employee org",
      sector: "Sector",
      centralOrg: "Central org",
      cooperationGroup: "Cooperation grp",
      employerGroup: "Employer grp",
      industryCode: "Industry code",
      printedAt: (when: string) => `Printed ${when}`,
      figureAll: "Figure 1 – Wage formation: number (share) of agreements and employees, all agreements",
      figureSelection:
        "Figure 2 – Wage formation: number (share) of agreements and employees, the selection",
      bandLocal: "Local wage formation",
      agreementCount: (n: string, p: string) => `${n} agreements (${p} %)`,
      employeeCount: (n: string, p: string) => `${n} employees (${p} %)`,
      tableAll: "All agreements",
      tableSelection: "The selection",
      constructionColumn: "Agreement construction",
      privat: "Private",
      privatPercent: "Private %",
      offentlig: "Public",
      offentligPercent: "Public %",
      alla: "All sectors",
      allaPercent: "All sectors %",
      arbetare: "Arbetare (blue collar)",
      tjansteman: "Tjänstemän (white collar)",
      total: "Total",
      legendHeading: "Agreement construction",
      sourceNote:
        "The figures are the Mediation Office's own, taken from the report example in Bilaga F of the requirement specification. They count employees across the whole agreement register and are therefore not derived from the mockup's agreements.",
      heading: "Agreement Constructions",
      intro:
        "A prioritised existing report. The distribution of the seven MI-defined agreement constructions.",
      generate: "Generate the report",
      table: { construction: "Construction", agreements: "Agreements", share: "Share" },
    },
    scheduled: {
      heading: "Scheduled extracts",
      addHeading: "New scheduled extract",
      paused: "Paused",
      pause: "Pause",
      resume: "Resume",
      addedNote: (report: string) => `${report} is now sent on the schedule.`,
      pausedNote: (report: string) => `${report} is paused and will not be sent until resumed.`,
      resumedNote: (report: string) => `${report} is sent on the schedule again.`,
      pauseNote:
        "An extract is paused, not deleted. One that has run has sent e-mails, and those are in the event log — the same reason a user is deactivated rather than removed.",
      form: {
        report: "Report",
        schedule: "Schedule",
        scheduleHint: "e.g. Quarterly, first working day",
        recipients: "Recipients",
        incomplete: "Schedule and recipients must be filled in.",
      },
      intro:
        "Recurring report extracts are sent as e-mail with the report attached and a link into MIIS. Every send is recorded in the event log.",
      table: {
        report: "Report",
        schedule: "Schedule",
        recipients: "Recipients",
        lastRun: "Last run",
        status: "Status",
      },
      active: "Active",
      add: "New scheduled extract",
      logNote: "Sent e-mail is recorded in the event log with time, recipients and attachment.",
      items: [
        {
          report: "Short-Term Wage Report",
          schedule: "Quarterly, first working day",
          recipients: "Statistics unit",
          lastRun: "2027-05-31",
          active: true,
        },
        {
          report: "Bargaining Round Report",
          schedule: "Monthly during the bargaining round",
          recipients: "Management team",
          lastRun: "2027-05-03",
          active: true,
        },
        {
          report: "Agreement Constructions",
          schedule: "Annually, 15 January",
          recipients: "Analysis unit",
          lastRun: "2027-01-15",
          active: false,
        },
      ],
    },
  },

  dokument: {
    title: "Documents",
    subtitle:
      "Protocols, agreements, Director-General decisions, mediator reports and party meeting documentation",
    upload: "Upload a document",
    empty: "No documents uploaded in this data set.",
    table: {
      fileName: "File",
      type: "Type",
      uploaded: "Uploaded",
      linkedTo: "Linked to",
      confidential: "Confidentiality",
    },
    types: {
      protocol: "Agreement protocol",
      agreement: "Agreement",
      "dg-decision": "DG decision",
      "mediator-report": "Mediator report",
      "party-meeting": "Party meeting document",
      other: "Other document",
    },
    ocrNote:
      "Scanned documents are read with OCR and searched by the free-text search alongside the selections.",
    confidentialNote:
      "The confidentiality mark is set on the agreement and carries through to its attached documents. Marked documents are not released to mediators or the public.",
  },

  allmanheten: {
    title: "Agreement information for the public",
    subtitle:
      "Public view at the Mediation Office. Access is from a dedicated client computer on MI's premises, without signing in.",
    publicMarker: "Public view",
    backToReport: "Back to the report",
    fromReport:
      "The selection comes from the report Agreement – The public. It can be changed here, and the list narrows for real.",
    publicExplain:
      "This is the same system in a reduced, read-only version. No registration, no editing and no confidentiality-marked agreement information.",
    selection: {
      title: "Find an agreement",
      lead:
        "Type a word — an agreement area, a union or an employer organisation — or choose from the lists below. The results update as you type.",
      text: "Search",
      textPlaceholder: "e.g. Apotek, Unionen or Spårtrafik",
      textHint: "Searches the agreement name, the agreement area and both parties",
      narrow: "Or choose from the lists",
      industryCode: "Industry",
      industryCodeHint: "Industry by SNI code, e.g. retail or manufacturing",
      employerOrg: "Employer organisation",
      /* A visitor at the kiosk does not know one from the other. Naming a real
         organisation is faster than defining the word. */
      employerOrgHint: "The employers' association, e.g. Teknikföretagen",
      employeeOrg: "Employee organisation",
      employeeOrgHint: "The trade union, e.g. IF Metall or Unionen",
      agreement: "Agreement",
      period: "Was in force on a given date",
      periodHint: "Shows agreements in force on that day. Leave empty for all.",
      all: "All",
      search: "Show report",
      reset: "Start over",
      hint: "Choose one or more levels. A field left empty includes everything.",
      builderNote:
        "The full search builder is an internal function and is not offered here. Field, operator and value with and/or, groupings, chosen presentation columns and saved searches are an expert instrument, and the visitor has no sign-in, no introduction and one attempt. Free-text search and the three criteria answer the same question in one step. Should Medlingsinstitutet want the builder in the public view anyway it is the same component — the confidentiality rule already decides the rest (D-002).",
    },
    result: {
      title: "Agreements in the selection",
      count: (n: number) => `${n} agreements`,
      empty: "No agreement matches the search. Try a broader selection, or start over.",
      all: "Every agreement Medlingsinstitutet has registered. Search or narrow above to reduce the list.",
      narrowed:
        "The agreements matching the search above. Confidentiality-marked agreements are included in the list; what is withheld is their detail.",
      table: {
        status: "Status",
        agreement: "Agreement",
        employerOrg: "Employer organisation",
        employeeOrg: "Employee organisation",
        validity: "Validity",
      },
      download: "Download the selection (PDF)",
      downloadNote:
        "The print contains protocols and agreement prints without confidentiality-marked agreement information.",
    },
    detail: {
      subtitle:
        "The agreement as released to the public. Confidentiality-marked information is not included.",
      heading: "Agreement details",
      name: "Agreement",
      area: "Agreement area",
      type: "Agreement type",
      employerOrg: "Employer organisation",
      employeeOrg: "Employee organisation",
      industryCode: "Industry (SNI)",
      signedDate: "Signed",
      validity: "Validity period",
      period: "Period",
      periods: "Validity periods per bargaining round",
      periodsIntro:
        "One period per bargaining round, most recently signed first. Wage figures are not part of what is released to the public.",
      signedOn: (date: string) => `Signed ${date}`,
      noPeriods: "No validity period registered on the agreement.",
      lifecycle: "Termination and prolongation",
      expires: "Expires without renewal",
      earlyTermination: "Early termination",
      noLifecycle: "Nothing registered about expiry or early termination.",
      documents: "Linked documents",
      document: "Document",
      documentsIntro: "Protocols and agreement prints linked to the agreement.",
      noDocuments: "No documents are linked to the agreement.",
      documentsNote:
        "The files come from the document archive in the delivered system. The mockup shows file names and dates — a button that downloaded an empty or invented PDF would be worse than saying where the file comes from.",
      print: "Print",
      download: "Download the details",
      exportNote:
        "The printout carries Medlingsinstitutet's letterhead and a print date and can be saved as PDF in the browser. The download writes a CSV file from the details on screen and works with no server behind it (FR-013).",
    },

    help: {
      title: "About the information",
      items: [
        "The information comes from the Mediation Office's agreement register and is updated continuously.",
        "Confidentiality-marked agreements appear in the list and count towards the statistics, but their details are not shown.",
        "Questions about the content are answered by the Mediation Office's registrar.",
      ],
    },
  },

  placeholder: {
    aboutTitle: "About this view in the demo",
    aboutBody:
      "The view is part of the menu structure that mirrors the Mediation Office's functional modules. In this demo the start page, the agreement protocol registration, the mediation case, the query builder, the reports view and the public view are drawn in full. The remaining views show their requirement content and will be detailed in the next round of sketches.",
  },

  avtal: {
    title: "Agreements",
    epic: "Agreement registration and management",
    subtitle: "Agreements, agreement areas, wage agreements and general terms",
    register: {
      heading: "Agreement register",
      intro:
        "One agreement per party and agreement area. The colour marking shows how the agreement came about — newly signed, signed after mediation, or remaining.",
      howToRegister:
        "Two ways in, depending on what has arrived. Register an agreement protocol when a signed protocol concerns an agreement already held here — the AI support reads the protocol and proposes the details. Register a new collective agreement when the agreement has no previous counterpart in the register; there is then nothing to match against, and it is entered by hand.",
      areaNote:
        "The agreement area is the overarching unit in MI's model (FA-001); the agreements under it are registered per party combination.",
    },
    table: {
      name: "Agreement",
      parties: "Parties",
      validity: "Validity period",
      status: "Status",
      registration: "Registration",
      wageRows: "Wage agreements",
    },
    filters: {
      area: "Agreement area",
      registration: "Registration status",
      status: "Agreement status",
      all: "All",
      noMatch: "No agreement matches the selected filters.",
    },
    newAgreement: {
      title: "Register a new collective agreement",
      subtitle: "An agreement with no previous counterpart in MIIS — registered manually",
      heading: "The agreement",
      manualLabel: "Registered manually",
      manualNote:
        "An agreement with no previous counterpart in the system is always registered by hand. The AI support reads an incoming protocol against an agreement that already exists — for a first-time agreement there is nothing to match against, and therefore nothing to propose.",
      name: "Agreement name",
      namePlaceholder: "E.g. Bemanningsavtalet",
      area: "Agreement area",
      areaHint: (examples: string) => `Existing areas in the register: ${examples} …`,
      employerOrg: "Employer organisation",
      employeeOrg: "Employee organisation",
      type: "Agreement type",
      sector: "Sector",
      signedDate: "Signed",
      validFrom: "Valid from",
      validTo: "Valid to",
      publishing: "Confidentiality and report selection",
      publishingIntro:
        "What the agreement is included in once registered. Publication to the public interface is an act of its own, performed on the agreement when the registration is complete.",
      confidential: "Confidentiality marking",
      confidentialHint:
        "The details are withheld from mediators and the public. The agreement is still listed and still counted (D-002).",
      reportWebsite: "MI's website",
      reportShortTermWage: "Short-Term Wage Report",
      reportMinimumWage: "Minimum wages",
      reportEurofound: "Eurofound",
      save: "Save the agreement",
      requiredReason: "Agreement name, agreement area and both parties must be filled in.",
      incompleteNote:
        "The agreement is saved as incomplete and unpublished. A new agreement with no wage agreement under it is not a finished record, and the registration gets a reminder (FA-021).",
      savedHeading: "The agreement is registered",
      savedNote: (name: string) =>
        `${name} is registered as incomplete. The registration is written to the change log with the time and user (FH-001).`,
      nextSteps: "This remains before the agreement can be published:",
      nextStepList: [
        "Register the wage agreement for the bargaining round — construction, wage scope and cost frame.",
        "Register the general terms with their own validity period.",
        "Fill in the agreement's scope: employees, annual workers, union members and average wage.",
        "Link the protocol and the agreement print.",
        "Mark the registration complete and publish the agreement.",
      ],
      toAgreement: "Open the agreement",
      toRegister: "To the agreement register",
      another: "Register another agreement",
    },

    detail: {
      tabs: {
        label: "Parts of the agreement",
        record: "The agreement",
        pay: "Wage agreements",
        open: "Questions and groups",
      },
      identity: "The agreement",
      area: "Agreement area",
      alternativeName: "Alternative agreement name",
      type: "Agreement type",
      employerOrg: "Employer party (AGO)",
      employeeOrg: "Employee party (ATO)",
      signedDate: "Date signed",
      validity: "Validity period",
      registration: "Registration status",
      scopeHeading: "Agreement scope",
      scopeIntro:
        "Four measures, not one. Employees are heads, annual workers are full-time equivalents, union members show how much of the area the agreement actually speaks for, and the average wage is the basis for the cost calculation.",
      employeesLabel: "Employees",
      annualWorkers: "Annual workers (FTE)",
      unionMembers: "Union members",
      unionDensity: "Union density (%)",
      averageWage: "Average wage (SEK/month)",
      updatedSuffix: (date: string) => `Updated ${date}`,
      notRegistered: "Not registered",
      derivedNote:
        "Union density is derived from union members and employees and is not stored — a third stored figure is a third figure that can go stale.",
      basicFacts: "Basic facts",
      basicFactsIntro:
        "Registered circumstances about the agreement as a whole. Every yes/no carries a comment, because the flag is what a report can count and the comment is why the case officer set it.",
      hangingAgreement: "Adopted agreement (hängavtal)",
      organisationalChange: "Organisational agreement change",
      terminated: "Agreement ceased",
      negotiationOrderRef: "Negotiation procedure agreement, ref. no.",
      noBasicFacts: "No particular circumstances registered about the agreement.",
      terminatedNote:
        "Ceased is not the same as expired. An expired agreement applies until it is replaced — a ceased one does not apply at all, and is therefore not counted in Expiry dates.",
      reportSelection: "Report selection",
      reportEurofound: "Eurofound",
      reportMinimumWage: "Minimum wages",
      reportWebsite: "MI's website",
      reportShortTermWage: "Short-Term Wage Report",
      noReportSelection: "The agreement is not included in any report selection.",
      specialQuestions: "Special questions",
      specialQuestionsIntro:
        "Questions the agreement text itself answers, numbered in three fixed slots. Unlike a working group there is nobody due to report back — the question is settled.",
      questionNumber: (n: number) => `Special question ${n}`,
      questionYear: (year: string) => `Signed ${year}`,
      questionText: "Agreement text",
      questionComment: "Comment",
      questionEquality: "Gender equality question",
      noSpecialQuestions: "No special questions registered on the agreement.",
      limited: "Information restriction",
      limitedRegisteredNote:
        "These sections are omitted from the mediator and public interfaces. The restriction applies to the section — the rest of the agreement is open, and this is not the same as a confidentiality marking.",
      limitedNote:
        "This information is restricted for this role, as registered on the agreement. The restriction applies to the section rather than the whole agreement, and is not the same thing as a confidentiality marking.",
      workingGroups: "Working groups and subject areas",
      workingGroupsIntro:
        "Questions the parties handed to a joint working group instead of settling in the agreement. An agreement with open working groups is not finished business.",
      groupName: "Working group",
      subjectAreas: "Subject areas",
      reportsBy: "Reports by",
      noWorkingGroups: "No working groups registered on the agreement.",
      eventLog: "Event log for the agreement",
      eventLogIntro:
        "High-level events linked to the agreement — signed, terminated, mediation started. The log is written by the system and cannot be edited.",
      eventTime: "Time",
      eventType: "Event",
      eventDetail: "Concerns",
      noEvents: "No events registered on the agreement yet.",
      edit: "Edit",
      identityIntro:
        "Correct details directly in the record. The change is saved to the change log with the time and the user.",
      agreementName: "Agreement name",
      nameRequired: "The agreement must have a name.",
      /* Registered elsewhere, and the row says where. */
      typeDerived: "Follows from which wage agreements and general terms are registered",
      partiesElsewhere: "Changed in the party register, so the agreement history follows",
      scopeEditNote:
        "Union density is calculated from union members and employees and cannot be typed in.",
      editSaved: (date: string) =>
        `Change saved ${date}. It is written to the change log with the time and user.`,
      publication: "Publication",
      publishedLabel: "Published",
      publishedNote: (date: string, by: string) =>
        `Published ${date} by ${by}. The agreement is available in the public interface.`,
      notPublished:
        "The agreement is registered but not published. It appears in the register and not in the public interface.",
      publish: "Publish the agreement",
      publishBlocked:
        "Publishing requires the registration to be marked complete and the agreement to be signed.",
      publishedConfirm: "The agreement is published and is now in the public view. The publication is logged with time and user.",
      viewPublic: "View as the public sees it",
      publicationNote:
        "Publication is an act with a date and a person, not a consequence of the record being complete. Medlingsinstitutet decides when an agreement is released — a half-registered agreement on the public computer would be the authority publishing a draft.",
      statusHeading: "Status and validity",
      wageEdit: {
      edit: "Edit",
      editingNow: "Being changed",
      alreadyOpen: "Open in the form above",
      heading: (period: string) => `Change the wage agreement for ${period}`,
      scopeLabel: "Wage scope (%)",
      costLabel: "Cost frame (%)",
      savedNote: (period: string) =>
        `The wage agreement for ${period} has been changed. The change is written to the change log with time and user.`,
      periodElsewhere:
        "The validity period is changed on the agreement, not here — a bargaining round cannot run longer than the agreement it belongs to.",
      logNote:
        "A bargaining round is the agreement's version. FA-002 gives every renegotiation its own wage agreement with its own construction, wage scope and cost frame, so the comparison against the last round is the table — and a version history nobody can correct is a printout.",
    },
    wageAgreements: "Wage agreements by bargaining round",
      wageIntro:
        "One row per bargaining round and period. The construction is one of MI's seven, ordered by bargaining level.",
      construction: "Agreement construction",
      scope: "Wage scope",
      costFrame: "Cost frame",
      guarantee: "Individual guarantee",
      revision: "Wage revision",
      period: "Period",
      minimumWages: "Minimum wages by occupational group",
      minimumWagesIntro: "Grouped by occupational group, with the date the amount was last revised.",
      occupationalGroup: "Occupational group",
      amount: "Amount",
      revisionDate: "Revision date",
      noWageAgreements:
        "No wage agreement registered. A wage agreement comes into being when the protocol is registered.",
      flags: "Flags",
      equality: "Gender equality flag",
      benchmark: "Industry benchmark (norm-setting agreement)",
      lifecycle: "The agreement's lifespan",
      expires: "Expires without renewal",
      earlyTermination: "Early termination",
      noLifecycle: "Nothing registered about expiry or early termination.",
      mediation: "Linked to mediation",
      confidential: "Confidentiality-marked",
      notFound: "The agreement does not exist in the selected dataset.",
    },
  },
  parter: {
    title: "Parties",
    subtitle:
      "Register of employer and employee organisations, with history and cooperation bodies",
    epic: "Party handling",
    features: [
      "Registration of a party of type AGO or ATO.",
      "History of name changes and organisational changes at a party.",
      "Cooperation bodies: umbrella organisation or cooperation, with negotiating body Yes or No.",
      "Links between party, cooperation body and agreement.",
      "Searching for parties with particular properties.",
      "Contact people with name, title, telephone and email for both AGO and ATO.",
    ],
    table: {
      name: "Party",
      type: "Type",
      sector: "Sector",
      group: "Employer group",
      formerNames: "Former names",
    },
    register: {
      heading: "Party register",
      intro:
        "Employer organisations are linked to sector and employer group; those inside Svenskt Näringsliv also to an industry code. Employee organisations carry a history of name changes and organisational changes.",
      sectorNote:
        "Sector, employer group and industry code are properties of employer organisations. An employee organisation does not have them, so the field reads None rather than showing a blank.",
    },
    filters: {
      type: "Type of party",
      sector: "Sector",
      sectorHint: "Applies to employer organisations",
      group: "Employer group",
      all: "All",
      noMatch: "No party matches the selected filters.",
    },
    bodies: {
      heading: "Cooperation bodies",
      intro:
        "A cooperation body links the unions that belong to it and a time period. Whether the body negotiates is decisive for mediation handling.",
      name: "Cooperation body",
      type: "Type",
      negotiating: "Negotiating body",
      members: "Members",
      period: "Period",
    },
    detail: {
      identity: "Party details",
      industryCode: "Industry code",
      industryCodeHint: "Applies to organisations inside Svenskt Näringsliv",
      sectorEmployeeHint: "Sector is registered on the employer side",
      contacts: "Contact people",
      contactAdd: "Add a contact person",
      contactName: "Name",
      contactTitle: "Title",
      contactPhone: "Telephone",
      contactEmail: "E-mail",
      contactSave: "Save the contact person",
      contactRemove: "Remove",
      contactNameRequired: "The contact person must have a name.",
      contactAdded: (name: string) =>
        `${name} has been added as a contact person. The change is written to the change log with the time and the user.`,
      contactRemoved: (name: string) => `${name} has been removed as a contact person.`,
      noContacts: "No contact people registered.",
      contactNote:
        "Contact people are registered for both AGO and ATO and follow the party, not the individual agreement.",
      status: "Status",
      active: "Active",
      inactive: "Deregistered",
      logNote: "Changes are recorded in the change log with time and user.",
    },
    newParty: {
      action: "New party",
      title: "Register a party",
      subtitle: "A new employer or employee organisation in the party register",
      identity: "Party details",
      type: "Type of party",
      typeHint: "Decides which properties are registered",
      name: "Name of the party",
      namePlaceholder: "e.g. Sveriges Lärare",
      validFrom: "The name applies from",
      validFromHint: "The date the name starts to apply",
      validFromNote:
        "The name goes into the name history with this date, so that a future name change can be bounded correctly (FP-004).",
      sector: "Sector",
      group: "Employer group",
      industryCode: "Industry code",
      industryCodePlaceholder: "e.g. 25–30 Metal and machinery industry",
      choose: "Choose",
      scopeNote:
        "Sector, employer group and industry code are registered only on employer organisations, and the industry code only inside Svenskt Näringsliv. The fields therefore appear when they apply rather than sitting greyed out — an employee organisation has no sector at all.",
      merger: "Organisational change",
      mergerIntro:
        "If the party is formed by other organisations merging, name the ones it replaces. The link is what lets statistics and agreement history be followed across the merger.",
      predecessors: "Replaces these organisations",
      noPredecessors: "No organisation selected – the party is registered as new.",
      predecessorCount: (n: number) =>
        n === 1 ? "1 organisation replaced" : `${n} organisations replaced`,
      mergerNote:
        "A merger is registered as a new party with links to its predecessors, not as a name change. The predecessors stay in the register because older agreements still reference them.",
      save: "Save the party",
      openRegister: "Open the party register",
      registerAnother: "Register another party",
      saveAction: "Register the party",
      saveHint: "Contact people are added after registration",
      savedNote: (name: string, predecessors: number) =>
        predecessors === 0
          ? `${name} is registered in the party register.`
          : `${name} is registered and replaces ${predecessors} organisations, which stay for older agreements.`,
      logNote:
        "The registration is recorded in the change log with time and user, as is the link to any predecessors.",
      contactsLater: "Contact people are registered on the party's own page once it is saved.",
    },
    nameChange: {
      heading: "Name change and organisational change",
      intro:
        "A name change is registered in one place with a validity date. The name propagates to every current agreement, but never to historical ones — those show the name the party had when the agreement was signed.",
      historyHeading: "Name history",
      currentName: "Current",
      newName: "New name",
      newNamePlaceholder: "e.g. Sveriges Lärare",
      validFrom: "Valid from",
      apply: "Register the name change",
      appliedNote: (name: string, current: number, historical: number) =>
        `The name change is registered. ${name} propagates to ${current} current agreements and leaves ${historical} historical agreements untouched.`,
      currentHeading: (n: number) => `Current agreements (${n})`,
      historicalHeading: (n: number) => `Historical agreements (${n})`,
      noAgreements: "No agreements linked to this party in this dataset.",
      showsAs: "Shows the party as",
      currentExplain: "Follows the party's current name.",
      historicalExplain: "Keeps the name that applied when the agreement was signed.",
      derivedNote:
        "The name is never stored on the agreement. Registering a change appends an entry to the name history, and every view asks what the party was called at the date that view is about. That is why a later name change can never rewrite a historical agreement.",
    },
  },
  forhandlingar: {
    title: "Negotiations",
    epic: "Negotiation and mediation management",
    subtitle: "Bargaining round and other negotiation",
    register: {
      heading: "Negotiation register",
      intro:
        "A negotiation is either a bargaining round, which belongs to an agreement, or another negotiation, which can stand alone with direct links to the parties.",
      standaloneNote:
        "A standalone negotiation has no agreement — it is linked directly to the parties. An empty agreement column here is therefore a fact, not a gap.",
    },
    table: {
      id: "Registry number",
      type: "Type",
      agreement: "Agreement",
      parties: "Parties",
      status: "Status",
      closed: "Closed",
    },
    status: {
      ongoing: "Ongoing",
      "closed-with-agreement": "Closed with an agreement",
      "closed-without-agreement": "Closed without an agreement",
    },
    filters: {
      type: "Type",
      status: "Status",
      all: "All",
      clear: "Clear filters",
    },
    standalone: "Standalone",
    linkNote:
      "The negotiation is linked to the agreement when the protocol is registered — step 5 of Register an agreement protocol.",
  },
  partstraffar: {
    editableNote:
      "The information can be supplemented both before and after the meeting — US-08 requires exactly that. No phase is locked; instead the change log records who changed what and when (FF-004, FH-001).",
    title: "Party meetings",
    subtitle:
      "Meetings with one party at a time ahead of the bargaining round – input for MI's assessment of conflict risk",
    epic: "Party meetings ahead of the bargaining round",
    features: [
      "Registration of party meeting information before, during and after the meeting.",
      "Coordinated bargaining demands with a flag and links to the unions behind the demand.",
      "Party meeting documents created from a document template.",
      "Demands from the meeting added to the watchword table.",
    ],
    table: {
      date: "Date",
      party: "Party",
      area: "Agreement area",
      state: "Status",
      demands: "Demands",
    },
    register: {
      heading: "Party meetings",
      intro:
        "The Mediation Office meets one party at a time to gauge the state of negotiations, identify risks of conflict and assess the need for mediation.",
      create: "New party meeting",
      onePartyNote:
        "The parties never meet each other at a party meeting, and a party meeting is not a negotiation (Bilaga 1 §4.2). That is what allows the party to speak candidly.",
    },
    current: {
      heading: (party: string, date: string) => `${party} · ${date}`,
    },
    newMeeting: {
      title: "New party meeting",
      subtitle: "Register a party meeting ahead of the bargaining round – nothing is filled in yet",
    },
    notRegistered: "Not registered",
    watchwordTermLabel: "Watchword to add",
    watchwordConfirm: "Save the watchword",
    watchwordOrigin: "Party meeting",
    phaseLabel: "Stage of the party meeting",
    phase: { before: "Before", during: "During the meeting", after: "After" },
    before: {
      heading: "Before the meeting",
      party: "Party",
      partyHint: "One party at a time – never both together",
      date: "Date",
      purpose: "Purpose",
      participants: "Participants",
      agenda: "Agenda",
      agendaEmpty: "No agenda registered yet.",
      agendaAdd: "New agenda item",
      participantsHint: "Names separated by commas",
      save: "Save preparation",
      saved: "Registration saved. The change is written to the change log with time and user.",
      location: "Location",
      createDocument: "Create a party meeting document from the template",
      templateLogNote:
        "The document is linked to the party meeting and recorded in the change log with time and user (FH-001).",
      sourceMeeting: "From the party meeting's registration",
      documentCreated: "Document created",
      templateNote:
        "The template is pre-filled from MIIS – party, agreement area, date and participants – so the case officer only adds what is specific to this meeting.",
    },
    during: {
      heading: "During the meeting",
      intro:
        "Notes and demands are entered directly during the meeting. Every note is time-stamped as it is written.",
      noteLabel: "New note",
      notePlaceholder: "What was said?",
      addNote: "Add",
      empty: "No notes yet. Write the first one when the meeting starts.",
      noteCount: (n: number) => (n === 1 ? "1 note" : `${n} notes`),
      traceNote:
        "Notes can be added both before and after the meeting. The change log records what changed, by whom and when.",
    },
    demands: {
      heading: "Bargaining demands",
      intro:
        "Demands raised at the meeting are registered with a flag for a coordinated demand or a single union's own.",
      empty: "No demands registered for this meeting yet.",
      add: "Register a demand",
      topicLabel: "What does the demand concern?",
      topicPlaceholder: "e.g. working time reduction of 0.2 %",
      kindLabel: "Type of demand",
      backingLabel: "Unions backing the demand",
      backingCount: (n: number) => (n === 1 ? "1 union selected" : `${n} unions selected`),
      save: "Save the demand",
      cancel: "Cancel",
      watchwordCount: (n: number, total: number) =>
        `${n} of ${total} demands are in the watchword table`,
    },
    backedBy: "Backed by:",
    demandDocuments: "Documents:",
    isWatchword: "Watchword",
    watchwordExplain: "Highlighted automatically in incoming protocols",
    promoteToWatchword: "Add as a watchword",
    after: {
      heading: "After the meeting",
      summary: "Summary",
      assessment: "Assessment of the need for mediation",
      assessmentHint: "MI's own assessment, not the party's",
      notHeld: "The meeting has not been held yet. A summary is registered afterwards.",
      documents: "Documentation",
      print: "Print the party meeting information",
      upload: "Upload documentation",
      logNote:
        "The printout and the uploaded documentation are linked to the party meeting. The event is recorded in the change log.",
    },
  },
  medlare: {
    title: "Mediators",
    epic: "The mediator register",
    subtitle: "Mediators, assignments and statistics",
    register: {
      heading: "The mediator register",
      intro:
        "Mediators the National Mediation Office can appoint. The statistics are counted from the assignment history rather than stored separately, so they cannot disagree with the assignments they count.",
      privacyNote:
        "A mediator's personal data falls under MI's retention routines (D-004). The contact details are shown to the mediation administrator, not to the public.",
    },
    table: {
      name: "Mediator",
      types: "Mediation type",
      assignments: "Assignments",
      firstChair: "As lead",
      secondChair: "As second",
      latest: "Latest year",
      areas: "Agreement areas",
      contact: "Contact",
      status: "Status",
    },
    active: "Active",
    inactive: "Inactive",
    edit: {
      action: "Action",
      open: "Change",
      editingNow: "Being changed",
      alreadyOpen: "Open in the form above",
      heading: (name: string) => `Change details for ${name}`,
      nameRequired: "The mediator must have a name.",
      deactivate: "Deactivate",
      activate: "Activate",
      savedNote: (name: string, date: string) =>
        `The details for ${name} were saved ${date}. The change is written to the change log with the time and the user.`,
      deactivatedNote: (name: string) =>
        `${name} is inactive and is no longer proposed when a mediator is appointed. Previous assignments still count in the statistics.`,
      activatedNote: (name: string) => `${name} is active again and can be appointed.`,
      derivedNote:
        "Assignments, first chair, second chair and latest year are calculated from the assignment history and cannot be typed in. A mediator is never deleted, only deactivated — the statistics per mediator would otherwise leave with the person.",
    },
    filters: {
      type: "Mediation type",
      status: "Status",
      all: "All",
      clear: "Clear filters",
    },
    add: {
      heading: "Add a mediator",
      intro:
        "The register is the basis when Medlingsinstitutet appoints mediators. A new mediator is entered with contact details and the mediation types they take assignments in.",
      open: "Add a mediator",
      newBadge: "New",
      name: "Name",
      namePlaceholder: "e.g. Gerald Lindberg",
      phone: "Telephone",
      email: "E-mail",
      types: "Takes assignments in",
      noTypes: "No mediation type selected – choose at least one.",
      typeCount: (n: number) => (n === 1 ? "1 mediation type selected" : `${n} mediation types selected`),
      typeRequired: "A name and at least one mediation type are required.",
      save: "Save the mediator",
      savedNote: (name: string) =>
        `${name} is now in the mediator register and can be appointed to mediation cases.`,
      addAnother: "Add another mediator",
      historyNote:
        "Assignment history is not entered here. It is derived from the mediation cases the mediator is appointed to, so the statistics per mediator (year, agreement area, first or second chair) can never say anything other than the cases themselves — which is the whole point of FF-009's statistics.",
      logNote:
        "Contact details fall under Medlingsinstitutet's retention routines (D-004). The registration is logged with time and user (FH-001).",
    },
    notify: {
      heading: "Notification",
      body:
        "When a mediation decision is marked complete, a notification email with a link is sent to the mediator administrator, and the event is added to the change log.",
    },
  },
  market: {
    title: "Märket",
    epic: "Registering Märket",
    subtitle: "The industry cost norm as a reference in agreement and mediator views",
    current: {
      heading: "Märket (industry benchmark) in force",
      intro:
        "Märket is registered as a periodised setting and shown as a reference wherever it is needed — on the start page, in the mediator view and in the reports. MI does not set it; it is read from the industry agreements.",
      costFrame: "Cost frame",
      periodisation: "Periodisation",
      period: "Period",
      months: "Number of months",
      supplementary: "Supplementary agreements",
      registered: "Registered",
      none: "No benchmark registered for the period.",
    },
    admin: {
      newHeading: "Register Märket for a new period",
      newIntro:
        "Märket (industry benchmark) is registered per bargaining round. Previous periods stay — agreements signed under them are compared against the cost frame that was in force then.",
      open: "Register a new period",
      save: "Register the period",
      registered: (period: string) =>
        `Märket for ${period} is registered and now applies in the views where it is shown.`,
      incomplete: "Period, validity and cost frame must be filled in.",
      costFrameInput: "Cost frame (%)",
      periodHint: "As the period is written in MI's own material",
      periodPlaceholder: "e.g. 2027-2029",
      validFrom: "Valid from",
      validTo: "Valid to",
      periodisationHint: "Free text - how the cost frame is spread over the period",
      periodisationPlaceholder: "e.g. 3,2 % / 3,2 %",
      supplementaryHint: "Free text; separate several with ·",
      note: "A new period clears the alarm for the dates it covers: the alarm exists so that an Industry Agreement protocol is not registered for a period with no benchmark definition.",
    },
    history: {
      heading: "Registered periods",
      intro: "One row per bargaining round. The periods must not overlap.",
      period: "Period",
      validity: "Validity",
      costFrame: "Cost frame",
      periodisation: "Periodisation",
      months: "Months",
      registered: "Registered",
    },
    sources: {
      heading: "Norm-setting agreements",
      intro:
        "The agreements marked as benchmark-setting. The cost frame in Märket has to match them.",
      name: "Agreement",
      parties: "Parties",
      period: "Period",
      costFrame: "Cost frame",
      empty: "No agreement is flagged as norm-setting in the selected dataset.",
    },
    alarm: {
      label: "Alert",
      covered:
        "Every registered agreement period is covered by a benchmark. If a protocol for the Industry Agreement is registered without a benchmark definition for the period, the system raises the alert here.",
      missing: (period: string) =>
        `No benchmark definition for ${period}. A protocol for the Industry Agreement cannot be read against Märket until one is registered.`,
    },
  },
  administration: {
    tabsLabel: "Parts of the administration",
    tabs: {
      settings: "Settings",
      changeLog: "Change log",
      eventLog: "Event log",
      watchwords: "Watchwords",
    },
    settings: {
      heading: "System settings",
      intro:
        "The system administrator has full access to the system configuration, but not to permissions. Two of the settings below can be changed here; two cannot, and the reason is on the row.",
      editable: "Can be changed",
      fixed: "Fixed by requirement",
      timeoutLabel: "Time limit (minutes)",
      timeoutHint: (min: number, max: number) => `${min}–${max} minutes`,
      notAllowed: "The value is not allowed",
      tooHigh: (max: number) =>
        `NFÅ-002 states at most ${max} minutes of inactivity. The limit may be shortened but not extended — a longer limit weakens the requirement rather than configuring it.`,
      tooLow: (min: number) =>
        `Shorter than ${min} minutes is impractical: a limit that expires during a coffee break is a limit users work around.`,
      notWhole: "Enter a whole number of minutes.",
      save: "Save the time limit",
      unchanged: "The value is already saved",
      effectNote: "Applies immediately across the system — the warning appears two minutes before the limit.",
      savedNote: (minutes: number) =>
        `The time limit is set to ${minutes} minutes and applies from now. The change is recorded in the change log.`,
      openWatchwords: "Maintain the watchwords",
      watchwordCount: (n: number) =>
        n === 1 ? "1 term in the table below" : `${n} terms in the table below`,
      retentionValue: (months: number) => `At least ${months} months`,
      publicIpValue: "Medlingsinstitutet's IP address",
      logNote:
        "Changed system settings are recorded in the change log with old value, new value, time and user (FH-001) — the same way a change to an agreement is.",
    },
    title: "Administration",
    epic: "Logs and system configuration",
    subtitle: "Support tables, traceability and system settings",
    changeLog: {
      heading: "Change log",
      intro:
        "Who changed what and when, with the old and the new value. The log is written by the system and cannot be edited from here.",
      time: "Time",
      user: "User",
      object: "Object",
      field: "Field",
      from: "From",
      to: "To",
    },
    eventLog: {
      heading: "Event log",
      intro: "System events and emails sent, most recent first.",
      time: "Time",
      type: "Event",
      detail: "Concerns",
    },
    watchwords: {
      heading: "Watchwords",
      intro:
        "The table is maintained ahead of the bargaining round. The terms are marked in uploaded protocols and govern what the AI analysis highlights.",
      term: "Term",
      source: "Origin",
      action: "Action",
      predefined: "Predefined",
      added: "Added",
      addedHere: "Added in administration",
      predefinedLocked:
        "Predefined terms belong to Medlingsinstitutet's base table and are not removed here.",
      remove: "Remove",
      add: "Add the term",
      newTerm: "New watchword",
      newTermHint: "Matched regardless of case in protocols and agreements",
      newTermPlaceholder: "e.g. arbetstidskonto",
      newTermRequired: "Type a term first.",
      addedNote: (term: string) =>
        `${term} has been added. It is now marked in uploaded protocols and agreements.`,
      duplicate: (term: string) => `${term} is already in the table.`,
      removedNote: (term: string) => `${term} has been removed and is no longer marked.`,
      note: "In this demonstration, terms added here or from a party meeting apply only to your own session.",
    },
    gallring: {
      heading: "Retention rules for personal data",
      intro:
        "Personal data is culled by rule, not by a decision in each case. Every rule states what is culled, what starts the clock and whether it happens automatically.",
      table: {
        subject: "Data",
        trigger: "Period counted from",
        months: "Retention (months)",
        action: "Action",
        automatic: "Automatic",
      },
      nowAutomatic: (subject: string) => `${subject} is now culled automatically.`,
      nowManual: (subject: string) => `${subject} is now culled after a manual step.`,
      anonymiseNote:
        "A deactivated user account is anonymised rather than erased. The sign-ins are logged (NFL-001) and those entries have to remain — what goes is the name behind them, not the event.",
      logNote:
        "The logs are the one record nobody may define a rule for. NFL-003 puts them beyond the system administrator explicitly, and the row is shown anyway: a screen that left it out would have looked complete.",
    },
    retention: {
      heading: "Retention and access",
      body:
        "The logs are kept for at least 24 months and can neither be changed nor deleted. MI reaches them through this view or through an export, without the supplier's involvement.",
      export: "Export the logs",
    },
  },
  anvandare: {
    tabs: {
      label: "Parts of permission administration",
      users: "Users",
      permissions: "Roles and permissions",
      signIn: "Sign-in",
    },
    users: {
      heading: "Users and role assignment",
      intro:
        "The authorisation administrator sets up users and assigns roles. What a role may do is not changed here — that is shown in the permission matrix under the Roles and permissions tab.",
      add: "Add a user",
      name: "Name",
      namePlaceholder: "e.g. Sara Lindström",
      efos: "EFOS identity",
      efosHint: "The identity in Försäkringskassan's IdP",
      email: "E-mail",
      unit: "Unit",
      role: "Role",
      assigned: "Role assigned",
      assignedBy: (who: string) => `by ${who}`,
      lastSignIn: "Last sign-in",
      status: "Status",
      action: "Action",
      active: "Active",
      inactive: "Inactive",
      deactivate: "Deactivate",
      reactivate: "Reactivate",
      changeRole: "Change role",
      newRole: "New role",
      saveRole: "Save the role",
      sameRoleReason: "The role is already the one selected.",
      lastAdminChangeReason:
        "This is the last active authorisation administrator. Assign the role to somebody else first.",
      changedNote: (what: string) =>
        `Role changed: ${what}. The change is written to the change log with the time and who made it (FH-001).`,
      revokedNote: (name: string) =>
        `Access revoked for ${name}. The account remains as inactive — the sign-ins are in the log and have to stay resolvable (NFL-001).`,
      lastAdminReason:
        "The last active authorisation administrator cannot be deactivated — permissions could then only be restored by the supplier, which is what NFÅ-005 exists to prevent.",
      reactivated: (name: string) =>
        `${name} is active again. The change is written to the change log with the time and the user.`,
      save: "Save the user",
      efosPending: "EFOS identity pending",
      newBadge: "New",
      nameRequired: "A name is required.",
      savedNote: (name: string) =>
        `${name} is set up and has been given their role. The assignment is recorded in the change log with time and user.`,
      allRoles: "All roles",
      allStatuses: "All",
      noMatch: "No user matches the selected filters.",
      noPasswordNote:
        "MIIS holds no passwords and creates no accounts. Authentication sits with Försäkringskassan's IdP over SAML 2.0 with an EFOS card (NFÅ-001) — a user here is a link between an identity that already exists there and a role in MIIS.",
      retentionNote:
        "Users are deactivated, not deleted. Sign-ins are logged (NFL-001) and kept for the retention period (NFL-003), so the log has to go on pointing at a person after they have left.",
    },
    title: "Users",
    epic: "Authorisation administration",
    subtitle: "Users, roles and assigned permissions",
    roles: {
      heading: "Roles and permissions",
      intro:
        "The system's eight roles. The role decides both what the user may do and which menu items appear.",
      role: "Role",
      held: "Number of users",
      unstaffed: "No user",
      unstaffedNote: (roles: string) =>
        `These roles have no active user: ${roles}. Parts of the system are then unstaffed — the role exists but nobody can reach it.`,
      permissions: "Permission",
      menu: "Menu items",
      level: { write: "Write", read: "Read", none: "–" },
      matrixNote:
        "Read means the role can open the view but change nothing in it. Write means register and edit. The same function governs the menu, access to the view and this table, so they cannot contradict each other.",
      readOnlyNote:
        "The matrix is not edited in the system, and that is deliberate. NFÅ-003 defines access by the eight roles Appendix 1 §3.1 describes; if an administrator could move Write on Agreements between roles, the table would describe a configuration rather than Medlingsinstitutet's own document. What NFÅ-005 places with Medlingsinstitutet is users and role assignment — both are edited in the panel above.",
    },
    auth: {
      heading: "Sign-in",
      body:
        "Authentication uses an EFOS card against the Swedish Social Insurance Agency's IdP over SAML 2.0. MIIS stores no passwords.",
      logging:
        "Sign-ins and sign-outs are logged with a timestamp and a user id. Permissions are administered by MI's own authorisation administrators, without the supplier's involvement.",
    },
  },

  notFound: {
    title: "Page not found",
    body: "The address does not lead to a view in MIIS. Check the link, or go to the start page.",
    home: "Go to the start page",
  },
  error: {
    title: "Something went wrong",
    body: "The view could not be shown. Try again, or go to the start page.",
    retry: "Try again",
  },
};
