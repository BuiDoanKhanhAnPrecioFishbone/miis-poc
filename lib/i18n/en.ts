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
    empty: "Nothing to show.",
    none: "–",
    yes: "Yes",
    no: "No",
    close: "Close",
    approve: "Approve",
    adjust: "Adjust",
    reject: "Reject",
    save: "Save",
    search: "Search",
    exportLabel: "Export:",
    showAll: (n: number) => `Show all (${n})`,
    agreementCount: (n: number) => `${n} agreements`,
    andMoreRows: (n: number) => `… ${n} more rows`,
    reqTagAria: (id: string) => `Requirement ID ${id}`,
    sortBy: (column: string) => `Sort by ${column}`,
    sortedAscending: "Sorted ascending",
    sortedDescending: "Sorted descending",
    backTo: (page: string) => `Back to ${page}`,
    notInDemo: "Not active in the demo",
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

  session: {
    title: "Your session is about to expire",
    body: "You have been inactive for some time. For security reasons you are signed out automatically after 30 minutes of inactivity.",
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
      "Content adapted to the assigned role and its authorisation. Signed in with an EFOS card; the session ends after 30 minutes of inactivity.",
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

    uploadProtocol: "+ Upload agreement protocol",
    uploadDgDecision: "+ Upload Director-General decision",
    newSearch: "New search",

    reminders: {
      title: "My reminders",
      empty: "No reminders right now.",
      footnote: "Reminders are also sent by e-mail with a link to the agreement",
    },
    incomplete: {
      title: "Incomplete registrations",
      empty: "All registrations are complete.",
      badge: "Incomplete",
      footnote:
        "Shown in the Short-Term Wage Report view with a status column, a protocol link and which agreements have already been exported",
      action: "Open the Short-Term Wage Report",
    },
    recent: {
      title: "Recently registered agreements",
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
      title: "Reference material",
      items: [
        "Märket 2027–2029 · cost frame 6.4 %",
        "Protocols and agreement prints without confidentiality-marked information",
      ],
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
      size: (kb: string) => `${kb} kB`,
      identifiedAs: (name: string) => `Identification input from the file name: ${name}`,
      demoNote:
        "In the mockup the file name and size are those of the uploaded file, while the protocol text below is prepared sample data. A real installation OCR-interprets the uploaded file.",
    },
    document: {
      ocr: "OCR",
      watchwordHits: (n: number) => `Highlighted text = hit in the watchword table (${n} hits)`,
      sourceHint:
        "Select an AI proposal on the right and the passage it was read from is marked here in the protocol.",
      sourceActive: (field: string) => `Showing the source for: ${field}`,
      showSource: "Show the source in the protocol",
      showSourceFor: (field: string) => `Show the source for ${field} in the protocol`,
      sourceMarker: "Source",
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
      title: "Wage agreement 2027 – new row for the bargaining round",
      construction: "Agreement construction (1–7)",
      constructionHint: "Seven MI-defined constructions",
      scope: "Wage scope (%)",
      costFrame: "Cost frame (%)",
      individualGuarantee: "Individual guarantee",
      workingTime: "Working time reduction / cost",
      revision: "Subgroup: wage revision",
      revisionHint: "Linked to the wage agreement",
      minimumWage: "Subgroup: minimum wage",
      minimumWageHint: "Linked to the wage agreement",
      equalityFlag: "Gender equality flag – wording identified",
      benchmarkFlag: "Industry benchmark (norm-setting agreement)",
    },
    terms: {
      title: "General terms – its own validity period",
      ownSignedDate: "Own date signed",
      ownValidity: "Own validity period",
      note: "The validity periods of the wage agreement and the general terms need not coincide",
    },
    link: {
      title: "Link the negotiation and the protocol",
      negotiation: "Registered negotiation",
      documentLinkedTo: "Document is linked to",
      documentLinkedToValue: "Agreement + wage agreement + negotiation",
    },
    save: {
      title: "Save the registration",
      registrationStatus: "Registration status",
      colourCoding: "Colour coding in the views",
      approveAndLink: "Approve and link the protocol",
      saveIncomplete: "Save as incomplete",
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
      groupJoinAll: "AND",
      groupJoinAny: "OR",
      joinExplain:
        "Conditions inside a group are combined with the group's operator. The groups are then combined with each other. That makes (A OR B) AND C expressible – today's query builder only manages a flat list.",
      expression: "Expression:",
      addCondition: "+ Add condition",
      addGroup: "+ Add group",
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
      saveSearch: "Save search",
      savedSearchName: "Annual report 2026",
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
    results: {
      title: (hits: number, seconds: string, date: string) =>
        `Results · ${hits} hits · ${seconds} s · Snapshot as at ${date}`,
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
    heading: (number: string, type: string) => `Mediation case ${number} – ${type}`,
    uploaded: (number: string) => `${number} – uploaded, case created automatically`,
    registryNumber: "Registry number (registry system)",
    decisionDate: "Decision date",
    type: "Type",
    dgDecisionDocument: "DG decision (document)",
    linkedAgreements: (n: number) => `Linked agreements (${n})`,
    linkAgreement: "+ Link an agreement",
    linkedNote:
      "Red marking = linked to mediation. One mediation case can be linked to several agreements.",
    mediators: "Mediators (from the mediator register)",
    addMediator: "+ Add a mediator",
    noMediators:
      "No mediators appointed – the parties mediate under their own procedure per a negotiation procedure agreement.",
    previousAssignments: (n: number) => `${n} previous assignments`,
    position: (p: string) => `Position: ${p}`,
    mediatorStatsNote:
      "Statistics per mediator (year and agreement area) are shown in the mediator register",
    procedureAgreement: "Negotiation procedure agreement",
    coveredNot: "The agreement area is NOT covered by a negotiation procedure agreement.",
    covered: "The agreement area is covered by a negotiation procedure agreement.",
    miAppoints: "→ The Mediation Office appoints mediators.",
    partiesMediate: "→ The parties mediate under their own procedure. MI appoints no mediator.",
    procedureNote:
      "Where the agreement is covered by a negotiation procedure agreement the parties mediate under their own procedure and MI appoints no mediator.",
    benchmarkTitle: "Märket (reference in the mediator view)",
    benchmarkMonths: (n: number) => `${n} months`,
    benchmarkPeriod: (from: string, to: string) => `Period ${from} – ${to}`,
    documents: "Documents and actions",
    createWithNotice: "Create DG decision – with industrial action notice",
    createWithoutNotice: "Create DG decision – without notice",
    finalise: "Finalise the decision",
    finaliseNote:
      "→ A notification e-mail with a link is sent to the mediator administrator and logged",
    templateNote:
      "The document templates are pre-filled with information from MIIS and can be edited before completion",
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
    title: "Reports",
    subtitle: "Report extracts, monitoring lists and scheduled distribution",
    tabs: {
      shortTerm: "Short-Term Wage Report",
      bargainingRound: "Bargaining Round Report",
      constructions: "Agreement Constructions",
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
      reminderSet: (date: string) => `Reminder ${date}`,
      selectedCount: (selected: number, total: number) =>
        `${selected} of ${total} agreements in the extract`,
      incompleteWarning: (n: number) =>
        `${n} agreements in the extract are partially registered. They are included, and flagged in the report.`,
      export: "Print the report",
      exportFormats: "Word · Excel · PDF",
      markExported: "Mark as exported",
      markExportedNote:
        "The extract is noted per agreement, so the next extract shows what has already been delivered to the report.",
    },
    bargainingRound: {
      heading: "Avtalsrörelserapporten (Bargaining Round Report)",
      intro:
        "A prioritised existing report. The selection follows the bargaining round and the colour coding of agreement status.",
      generate: "Generate the report",
      contents: [
        "Agreements signed, by agreement area and sector",
        "Agreements signed after mediation, with the mediation case",
        "Agreements remaining at the end of the period",
      ],
    },
    constructions: {
      heading: "Agreement Constructions",
      intro:
        "A prioritised existing report. The distribution of the seven MI-defined agreement constructions.",
      generate: "Generate the report",
      table: { construction: "Construction", agreements: "Agreements", share: "Share" },
    },
    scheduled: {
      heading: "Scheduled extracts",
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
      paused: "Paused",
      add: "+ New scheduled extract",
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
    upload: "+ Upload a document",
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
    publicExplain:
      "This is the same system in a reduced, read-only version. No registration, no editing and no confidentiality-marked agreement information.",
    selection: {
      title: "Make your selection",
      employerOrg: "Employer organisation",
      employeeOrg: "Employee organisation",
      agreement: "Agreement",
      period: "Valid at",
      all: "All",
      search: "Show report",
      reset: "Start over",
      hint: "Choose one or more levels. A field left empty includes everything.",
    },
    result: {
      title: "Agreements in the selection",
      count: (n: number) => `${n} agreements`,
      empty: "No agreement matches the selection. Try a broader one.",
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
    features: [
      "Agreement area and agreement as an overarching entity with parties and agreement type.",
      "Registration of wage agreements – one new row per bargaining round and period.",
      "Registration of general terms and conditions.",
      "Separate validity periods for the wage agreement and the general terms.",
      "Registration of insurance information.",
      "Registration of other agreements, for example negotiation procedure agreements.",
      "Gender equality flag per agreement.",
      "Minimum wages grouped by occupational group, with revision dates.",
      "Registration of working groups with subject areas.",
      "Registration of agreements that expire and are not renewed.",
      "Registration of early termination.",
      "Registration of negotiation procedure agreements.",
      "Registration status Incomplete or Complete.",
      "Reminders to complete agreement information.",
    ],
  },
  parter: {
    title: "Parties",
    epic: "Party management",
    subtitle: "AGO, ATO, cooperation bodies and party history",
    features: [
      "Registration of a party of type AGO or ATO.",
      "History of name changes and organisational changes at a party.",
      "Cooperation bodies: umbrella organisation or cooperation, with negotiating body Yes or No.",
      "Links between party, cooperation body and agreement.",
      "Searching for parties with particular properties.",
      "Contact people with name, title, telephone and email for both AGO and ATO.",
    ],
  },
  forhandlingar: {
    title: "Negotiations",
    epic: "Negotiation and mediation management",
    subtitle: "Bargaining rounds and other negotiations",
    features: [
      "Registration of a negotiation of type bargaining round or other negotiation.",
      "Linking a negotiation to an agreement through the protocol upload.",
      "Standalone negotiation with direct links to the parties.",
      "Follow-up of the negotiation's status and outcome.",
    ],
  },
  partstraffar: {
    title: "Party meetings",
    epic: "Party meetings ahead of the bargaining round",
    subtitle: "Meetings between MI and an individual party ahead of the bargaining round",
    features: [
      "Registration of a party meeting before, during and after the meeting.",
      "Coordinated bargaining demands with a coordinated/own-union flag and the unions behind them.",
      "Party meeting documents created from a template pre-filled with MIIS information.",
      "Demands from the meeting can be added to the watchword table.",
    ],
  },
  medlare: {
    title: "Mediators",
    epic: "The mediator register",
    subtitle: "Mediators, assignments and statistics",
    features: [
      "Registration and administration of mediators in the mediator register.",
      "Statistics per mediator (year and agreement area) and position, Ettan or Tvåan.",
      "Notification e-mail when a mediation decision is finalised.",
      "Every change to the register is recorded in the change log.",
      "The mediator's personal data falls under MI's retention routines.",
    ],
  },
  market: {
    title: "Märket",
    epic: "Registration of Märket",
    subtitle: "The industry cost norm as a reference in the agreement and mediator views",
    features: [
      "Registration of Märket as a periodised setting with cost frame, periodisation and supplementary agreements.",
      "Alert when a new Industry Agreement protocol is registered for a period without a benchmark definition.",
      "Märket is shown as a reference on the start page and in the mediator view.",
      "Industry benchmark flag on norm-setting agreements.",
    ],
  },
  administration: {
    title: "Administration",
    epic: "Logs and system configuration",
    subtitle: "Supporting tables, traceability and system settings",
    features: [
      "Change log with who, what and when – including the old and the new value.",
      "Event log covering system events and e-mails sent.",
      "Logs are retained for at least 24 months and cannot be changed or deleted.",
      "Maintenance of the watchword table ahead of the bargaining round.",
      "MI reaches the logs through Administration or an export, without supplier involvement.",
    ],
  },
  anvandare: {
    title: "Users",
    epic: "Authorisation administration",
    subtitle: "Users, roles and assigned permissions",
    features: [
      "Authentication with an EFOS card via Försäkringskassan's IdP (SAML 2.0).",
      "Role-based access control per the eight user roles.",
      "Permissions administered by MI's own authorisation administrators without supplier involvement.",
      "Sign-ins and sign-outs are logged with time and user ID.",
    ],
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
