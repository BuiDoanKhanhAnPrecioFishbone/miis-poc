# Flow images — the main flow of every scenario

*Generated from `lib/domain/walkthrough.ts` by `npm run flows -- --lang=en`. Do not write in this file — change the step in the walkthrough, re-run, and both the images and the text follow. It is the same flow the guided walkthrough at **miis-poc.vercel.app/genomgang** takes, and the same build an evaluator clicks through.*

6 scenarios, 22 steps. The first three are the roles being assessed and come first; the last three are here as evidence that the system is complete, not as part of the assessed response.

**The demo strip is removed from the images.** The role switcher and the language choice are review aids and are not part of MIIS, so they do not belong in a document that says *this is what the system looks like*. The role is named in the text at each step instead.

---

## Register, update and publish a collective agreement

**Assessed scenario** · Role: Agreement administrator · 7 steps

### Task and goal

A collective agreement has to get into the register, be kept current, and finally be released. It arrives two ways: as a wholly new agreement with no previous counterpart, which is always registered manually (§4.1), or as a signed agreement protocol — normally a scanned PDF — about an agreement the system already holds. After that the details have to be correctable, every bargaining round adds its own row, and the agreement is published once the registration is complete. The goal is a correct, complete and traceable record: everything downstream reads what the officer types, from the Short-Term Wage Report to Medlingsinstitutet's annual report and the public computer.

### Workflow

#### 1. Register a new collective agreement

*Role: Agreement administrator · `/avtal/ny`*

An agreement with no previous counterpart in MIIS. This is the one registration the AI support is not allowed to do: §4.1 says wholly new agreements are always registered manually, and the reason is on the screen — the AI reads a protocol against an agreement the system already holds, and for a first-time agreement there is nothing to match against. It is saved as incomplete and unpublished, and the screen lists what remains. Create **Stål- och metallindustrin tjänstemän**, between Industriarbetsgivarna and Unionen: the protocol in the next step is between exactly those two parties, and no agreement in the register is — A-001 is the same industry with IF Metall. The next step therefore matches the protocol to the record created here, which is the point of §4.1’s order: a first-time agreement has nothing to match against until it exists.

![Register a new collective agreement](../screenshots/flow-en/agreement-admin-01-register-a-new-collective-agreement.png)

<small>Requirements: FA-001, FA-005, FAI-002</small>

#### 2. Register the agreement protocol [AI support]

*Role: Agreement administrator · `/registrera`*

Upload the protocol and walk Medlingsinstitutet's own five steps (§4.4). The matched agreement is a list rather than an assertion: every candidate says what it was read from — the heading's agreement name, both parties, or the file name — and the agreement created in step 1 is among them. OCR, watchwords and matching run automatically; the AI proposals are source-linked — select one and the passage it was read from is highlighted. One proposal is deliberately wrong, so the rejected path is shown rather than merely asserted.

![Register the agreement protocol](../screenshots/flow-en/agreement-admin-02-register-the-agreement-protocol.png)

<small>Requirements: FAI-001, FAI-002, FAI-003, FAI-004, FA-021</small>

#### 3. The agreement register

*Role: Agreement administrator · `/avtal`*

Where the registration lands. The filters genuinely narrow the table, and FR-012's colour coding carries a shape and a word as well.

![The agreement register](../screenshots/flow-en/agreement-admin-03-the-agreement-register.png)

<small>Requirements: FA-005, FA-006, FR-012</small>

#### 4. Add or update information

*Role: Agreement administrator · `/avtal/A-001`*

FA-001 is to register *and edit* agreement information. Every section that can be corrected carries its own Edit — the identity and the agreement's scope, the four measures Medlingsinstitutet actually revises between rounds. The change happens on the values themselves rather than on a second screen, and is written to the change log with the time and the user. Two fields are deliberately locked and say why on their own row: the agreement type follows from which wage agreements exist, and the parties are changed in the party register so that the agreement history follows. Union density is calculated while the two figures above it are typed — it follows, it is not entered.

![Add or update information](../screenshots/flow-en/agreement-admin-04-add-or-update-information.png)

<small>Requirements: FA-001, FA-014, FH-001</small>

#### 5. Versions and changes to the agreement

*Role: Agreement administrator · `/avtal/A-001#loneavtal`*

An agreement has no version list but a row per bargaining round: FA-002 gives every renegotiation its own wage agreement with its own construction, scope and cost frame, so the comparison against the last round *is* the table. The row can be corrected: construction, wage scope, cost frame and individual guarantee are changed per bargaining round, from a form that names the period it applies to. The validity period is changed on the agreement instead — a round cannot run longer than the agreement it belongs to. What changed *within* a period is in the event log, with the old and the new value (FH-001).

![Versions and changes to the agreement](../screenshots/flow-en/agreement-admin-05-versions-and-changes-to-the-agreement.png)

<small>Requirements: FA-002, FH-001, FH-002</small>

#### 6. Publish the agreement

*Role: Agreement administrator · `/avtal/A-001`*

Publication is an act with a date and a person, not a consequence of the record being complete — the authority decides when an agreement is released. It sits in the right-hand column beside the status it changes, not inside editing: correcting a detail and releasing the agreement are two different things. The control is offered only on a registration marked complete whose agreement is signed; on a half-registered one it is refused and says why. The same agreement as the four steps above: the protocol was read against it, the details were corrected in it, and it is the one now being released. Afterwards the agreement can be opened as the public sees it.

![Publish the agreement](../screenshots/flow-en/agreement-admin-06-publish-the-agreement.png)

<small>Requirements: FR-009, FR-011, FH-001</small>

#### 7. Report extract [AI support]

*Role: Agreement administrator · `/rapporter`*

The need can be described in a sentence at the top: the proposal names the report and fills the selection screen, with the words it was read from, and runs nothing — a report the role may not run is refused with the reason rather than quietly dropped. Appendix F opens by stating that for every report a selection screen and a result are shown. Choose the report, fill in the selection — the criteria differ per report — and generate. The criteria are printed at the head of the result.

![Report extract](../screenshots/flow-en/agreement-admin-07-report-extract.png)

<small>Requirements: FR-005, FR-006, FR-007, FR-008, FAI-002</small>

### Usability, efficiency and accessibility

The protocol stays beside the form while the officer scrolls, so a check is a glance rather than a scroll up and back. A field's width says what belongs in it, the unit lives in the label and the value stays a bare number. Five steps — Medlingsinstitutet's own, with none invented. An incomplete registration is savable and generates a reminder, so a protocol with a gap does not block the queue. WCAG 2.1 AA is verified automatically on every change: 0 violations, no horizontal scroll between 375 and 1920 pixels, and FR-012's status is always carried by colour, shape and word together.

---

## Users, roles, permissions and the system's administration

**Assessed scenario** · Role: System administrator · 6 steps

### Task and goal

The system administrator answers for the system rather than for the case work in it: who has access, as what, and what the system has done. The goal is that Medlingsinstitutet can add a new colleague, grant, change and revoke access, and answer for a questioned figure in a published report — all without contacting the supplier. The scenario spans two roles, deliberately: Appendix 1 §3.1 gives the system administrator full access including system configuration but explicitly not permissions, and places users and role assignment with the authorisation administrator. The split is separation of duties — whoever configures the system is not whoever grants access to it — and the walkthrough switches role where §3.1 requires it rather than widening a permission the authority wrote a parenthesis to limit.

### Workflow

#### 1. Overview of users, roles and permissions

*Role: Authorisation administrator · `/administration/anvandare`*

Who has access, as what, since when and granted by whom. Under the register is the permission matrix showing what each role may do in each module — read, not edited, because NFÅ-003 defines access by §3.1's eight roles and a matrix an administrator could rearrange would describe a configuration rather than the authority's own document.

![Overview of users, roles and permissions](../screenshots/flow-en/system-admin-01-overview-of-users-roles-and-permissions.png)

<small>Requirements: NFÅ-005, NFÅ-003, FH-001</small>

#### 2. Create a new user

*Role: Authorisation administrator · `/administration/anvandare`*

Name, EFOS identity, e-mail and role. No password field and no account creation: NFÅ-001 puts authentication in Försäkringskassan's IdP over SAML with an EFOS card, so a user in MIIS is a link to an identity that already exists — drawing an account form would claim we had built an identity provider.

![Create a new user](../screenshots/flow-en/system-admin-02-create-a-new-user.png)

<small>Requirements: NFÅ-005, NFÅ-001</small>

#### 3. Assign role and permission

*Role: Authorisation administrator · `/administration/anvandare`*

The role is the permission: §3.1 gives each role a verb, and it is the role that decides what the person sees and may do. The assignment is stamped with the date and who made it, which is the FH-001 half of NFÅ-005.

![Assign role and permission](../screenshots/flow-en/system-admin-03-assign-role-and-permission.png)

<small>Requirements: NFÅ-005, NFÅ-003</small>

#### 4. Change or revoke a permission

*Role: Authorisation administrator · `/administration/anvandare`*

Change the role in the row, or revoke access. Both are written to the change log. Try the last authorisation administrator: both the move and the deactivation are refused, and the control says why on itself — that is the lock-out NFÅ-005 exists to prevent. No user is deleted, because the sign-ins in the log have to stay resolvable.

![Change or revoke a permission](../screenshots/flow-en/system-admin-04-change-or-revoke-a-permission.png)

<small>Requirements: NFÅ-005, FH-001, NFL-001</small>

#### 5. System settings [AI support]

*Role: System administrator · `/administration`*

Four settings, and two of them deliberately cannot be changed: NFL-003 names the system administrator in its prohibition, and NFÅ-006's IP restriction sits in the operating environment. The session limit is genuinely configurable — set it to ten minutes and the start page says ten.

![System settings](../screenshots/flow-en/system-admin-05-system-settings.png)

<small>Requirements: NFÅ-002, NFL-003, NFÅ-006, FAI-004</small>

#### 6. Change log and event log [AI support]

*Role: System administrator · `/administration`*

The other administration that lets the authority answer for the system itself. FH-001 requires the old and the new value — the difference between a log that records that something changed and one that can reconstruct what it was, and what makes FAI-002's guarantee checkable after the fact. The print is NFL-004's export function, and it runs. Under the Watchwords tab, FAI-004's table is maintained: §4.1 calls it predefined *and* adaptable, so the administrator adds their own terms and removes them again. Medlingsinstitutet's own four cannot be removed, and the row says why.

![Change log and event log](../screenshots/flow-en/system-admin-06-change-log-and-event-log.png)

<small>Requirements: FH-001, FH-002, NFL-003, NFL-004, FAI-004</small>

### Usability, efficiency and accessibility

The authorisation register answers the role's four questions in the order they are asked — who has access, as what, since when and granted by whom, and are they still here. The role change happens in the row, so the officer has the person, the current role and who assigned it in front of them while changing it. A refused action says why on itself: the last authorisation administrator can neither be moved nor deactivated, because that is the lock-out only the supplier could repair. Nothing is deleted — the sign-ins are in the log and have to stay resolvable (NFL-001). Long tables pin their header row and scroll inside their own named region, reachable by keyboard, and a setting that is refused says which way it is wrong and what the limit is.

---

## Produce agreement information from the public computer

**Assessed scenario** · Role: Public computer · 5 steps

### Task and goal

A visitor comes to Medlingsinstitutet's premises — a journalist checking a claim, a student, an employee wanting to know which agreement applies. The goal is to learn which agreement covers an area, how long it runs and whether it has been renegotiated, and to take the answer away. The visitor has no sign-in, no introduction and one attempt.

### Workflow

#### 1. The public entrance

*Role: Public computer · `/allmanheten`*

No sign-in page, and that is deliberate: NFÅ-001 puts authentication with Försäkringskassan's IdP for staff, and NFÅ-006 restricts public access to Medlingsinstitutet's own IP address — the machine in the room is the credential.

![The public entrance](../screenshots/flow-en/public-01-the-public-entrance.png)

<small>Requirements: NFÅ-006, FR-011</small>

#### 2. Search for an agreement by industry or agreement area

*Role: Public computer · `/allmanheten`*

Type a word and the list narrows as you type. Under the free text comes industry first — a visitor thinks in industries long before they think in employer organisations — then Medlingsinstitutet's own three criteria from Appendix F's Report 1 and a date for what applied at a given point.

![Search for an agreement by industry or agreement area](../screenshots/flow-en/public-02-search-for-an-agreement-by-industry-or-a.png)

<small>Requirements: FR-001, FR-003, FR-011</small>

#### 3. Narrow the result

*Role: Public computer · `/allmanheten`*

Every chosen criterion becomes a chip that can be removed one at a time, and the table genuinely narrows. Confidentiality-marked agreements stay in the list and are counted — what is withheld is their detail, and it is withheld in the markup rather than in the stylesheet. Only published agreements are here: a half-registered agreement on the public computer would be the authority publishing a draft.

![Narrow the result](../screenshots/flow-en/public-03-narrow-the-result.png)

<small>Requirements: FR-003, FR-011, D-002</small>

#### 4. Read the agreement

*Role: Public computer · `/allmanheten/A-013`*

Appendix F's Report 1 in full: parties, agreement area, industry, validity periods per bargaining round, termination and prolongation, and the linked documents. No wage figures — the cost frame and the wage scope are the authority's working material, and this is the release.

![Read the agreement](../screenshots/flow-en/public-04-read-the-agreement.png)

<small>Requirements: FR-011, D-002, FA-002</small>

#### 5. Open and download

*Role: Public computer · `/allmanheten/A-013`*

Two exports, and both of them run. The printout carries Medlingsinstitutet's letterhead and a print date and can be saved as PDF in the browser; the download writes a real CSV file from the details on screen, with no server behind it (FR-013). The visitor's task ends with the answer going home with them, and a dashed button would have ended the scored scenario on a control that does nothing.

![Open and download](../screenshots/flow-en/public-05-open-and-download.png)

<small>Requirements: FR-011, FR-013</small>

### Usability, efficiency and accessibility

One screen, one search field, one result. No menu, no sign-in, no internal vocabulary and nothing editable. The visitor never has to choose from a list before they can begin — they type, and what they typed appears as a removable filter above the result so it is always clear what the list is a list of. This is the role where accessibility matters most: the view is verified from 375 to 1920 pixels with no horizontal scroll, 0 axe violations, and every status carried by colour, shape and word.

---

## Mediation cases and party meetings

**Supporting scenario** · Role: Mediation administrator · 2 steps

### Task and goal

The mediation administrator creates a mediation case from a Director-General decision and holds party meetings ahead of the bargaining round. The party-meeting view is the most distinctive screen in the system: it is used live, during the meeting.

### Workflow

#### 1. The mediation case [AI support]

*Role: Mediation administrator · `/medling/M-2027-12`*

Created from the Director-General decision, with §4.1's decision support and the document template with and without notice. The case is four tabs, because it is four different jobs: **Ärendet** is what the Director-General decided and which agreements it covers, **Medlare** is the appointment, **Handlingar** is the decision and its sign-off, and **Utfall** is what the mediation produced. What each job is done against — the procedure agreement, the decision support and Märket — stays in the right-hand column whichever tab is open. The mediator list offers only active mediators who take this mediation type. The outcome is the basis for Medlingsinstitutet's statistics on industrial action — lost working days and affected employees appear only when there was industrial action, because a zero in that column is a measurement rather than an absence. The decision's number and date cannot be changed: they come from a decision, not from the register.

![The mediation case](../screenshots/flow-en/mediation-admin-01-the-mediation-case.png)

<small>Requirements: FF-006, FF-007, FF-008, FF-009, FF-010, FSD-001</small>

#### 2. The party meeting [AI support]

*Role: Mediation administrator · `/partstraffar/PT-2027-05`*

Before, during and after the meeting. A demand can be promoted to the watchword table, and then starts marking text in protocols that arrive months later.

![The party meeting](../screenshots/flow-en/mediation-admin-02-the-party-meeting.png)

<small>Requirements: FF-004, FF-005, FAI-004, FSD-002</small>

### Usability, efficiency and accessibility

Three phases, and the middle one is an input surface rather than a summary — notes are time-stamped as they are typed, and a demand becomes a record the moment it is heard.

---

## Composite search and extract

**Supporting scenario** · Role: Statistics user · 1 steps

### Task and goal

The statistics user builds a composite query over the agreement information and extracts the result. The role is read-only: §3.1 gives it read and data extract, and the authorisation matrix says the same.

### Workflow

#### 1. The search builder [AI support]

*Role: Statistics user · `/sok`*

Above the builder the search can be described in a sentence. The proposal shows which register and which conditions the machine read out, with the words each condition was read from, and nothing is set until the officer approves it — what could not be interpreted is shown too. FR-002’s choice of information type is a choice of which register is searched: four tabs with their own rows, their own criteria and their own columns. A condition is field, operator and value; groups join with OCH and the conditions inside a group with OCH or ELLER, which is the shape W3D3 cannot express. There is no search button — the result narrows as the selection changes. The snapshot date appears only where the rows have periods. Every hit opens its own record, the presentation columns are removed from both the table and the printout, and a saved search loads: what is saved is the selection, never the hits.

![The search builder](../screenshots/flow-en/statistics-user-01-the-search-builder.png)

<small>Requirements: FR-002, FR-003, FR-004, FAI-002</small>

### Usability, efficiency and accessibility

The conditions are written out as a readable sentence, so a query with groupings can be checked without reading the form backwards.

---

## The mediator register

**Supporting scenario** · Role: Mediator administrator · 1 steps

### Task and goal

The mediator administrator maintains the register of mediators and uses the statistics per mediator — year, agreement area and first or second chair — as the basis when a mediator is to be appointed.

### Workflow

#### 1. The mediator register

*Role: Mediator administrator · `/medlare`*

The register can be maintained, not only read: contact details and mediation types are changed on the row, a new mediator is added from the register’s own header — the same form that corrects an existing one, because they are the same fields, and a mediator who has stopped is deactivated rather than deleted — FF-009's statistics per mediator would otherwise leave with the person. Assignments, first chair, second chair and latest year are calculated from the assignment history and cannot be typed in.

![The mediator register](../screenshots/flow-en/mediator-admin-01-the-mediator-register.png)

<small>Requirements: FF-009, FE-001, D-004</small>

### Usability, efficiency and accessibility

The statistics are derived from the assignments rather than stored, so the register can never say anything other than the mediation cases it summarises.

---
