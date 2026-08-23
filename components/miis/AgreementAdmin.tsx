"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import {
  mayPublish,
  unionDensityPercent,
  type Agreement,
  type RegistrationStatus,
} from "@/lib/domain/agreement";
import type { Lang } from "@/lib/domain/lang";
import { amount, decimal } from "@/lib/format";
import { dictionary } from "@/lib/i18n";
import { markPublished } from "@/lib/session-store";
import { IconForward } from "./icons";
import { EditablePanel } from "./EditablePanel";
import {
  Badge,
  Button,
  Callout,
  Field,
  FormGrid,
  LinkButton,
  Panel,
  Rationale,
  TextField,
} from "./primitives";

/**
 * The two acts Bilaga 2 §3.5's Scenario 2 asks to be shown:
 *
 * - *"Lägger till eller uppdaterar information kopplad till avtalet."*
 * - *"Publicerar avtalet så att det blir tillgängligt för användare med åtkomst
 *   till publicerad information."*
 *
 * They used to share a panel headed *Redigera och publicera*, sitting under the
 * record and repeating three of its values as inputs. That was wrong twice
 * over, and both were reported:
 *
 * - **Editing is not a section of the agreement.** A panel *about* correcting
 *   the record, placed beside the record, put the same three values on the page
 *   twice — read them here, type them there. The control belongs to the section
 *   that holds the values, so each section carries its own; `EditablePanel` is
 *   the shared chrome and the note on it is the longer argument.
 * - **FA-001 says *redigera avtalsinformation*, not three fields.** Whatever
 *   that one panel happened to contain was editable and nothing else was, so
 *   the agreement's scope figures — the four MI actually revises between rounds
 *   — could be read and never corrected.
 *
 * - **And publishing is not editing.** Correcting a wage figure and releasing
 *   the agreement to the public computer are different acts with different
 *   consequences, and one heading over both made a routine correction look like
 *   it might do the second. Publication now sits in the sidebar beside the
 *   status it changes.
 */

/** A registered figure, or MI's own mark for one that was never entered. */
function figure(value: number | undefined, lang: Lang, fallback: string): string {
  return value === undefined ? fallback : amount(value, lang);
}

/** Fixed, so a screenshot taken twice is the same image. */
const TODAY = "2027-06-14";
const ACTING_OFFICER = "Anna Andersson";

type IdentityFields = Pick<
  Agreement,
  "name" | "agreementArea" | "agreementType" | "alternativeName" | "signedDate"
> & { employerOrg: { name: string }; employeeOrg: { name: string } };

/**
 * The agreement's identity — FA-001 and FA-005, corrected where it is read.
 *
 * Two of the six values are deliberately not editable here, and each says why
 * on its own row. The agreement **type** follows from which wage agreements and
 * general-terms agreements exist under it, so typing it would let the label
 * disagree with the record beneath. The **parties** are a relation into the
 * party register, and FA-006's name-change history is what makes an
 * organisation's agreements followable across a merger — retyping a party name
 * here would break that quietly. A greyed field with no reason reads as
 * something the system forgot to finish; a greyed field with a reason is the
 * design being explained.
 */
export function AgreementIdentity({
  agreement,
  lang,
}: {
  agreement: IdentityFields;
  lang: Lang;
}) {
  const d = dictionary(lang);
  const t = d.avtal.detail;

  const [editing, setEditing] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [name, setName] = useState(agreement.name);
  const [area, setArea] = useState(agreement.agreementArea);
  const [alternative, setAlternative] = useState(agreement.alternativeName ?? "");
  const [signed, setSigned] = useState(agreement.signedDate ?? "");

  function cancel() {
    setName(agreement.name);
    setArea(agreement.agreementArea);
    setAlternative(agreement.alternativeName ?? "");
    setSigned(agreement.signedDate ?? "");
    setEditing(false);
  }

  return (
    <EditablePanel
      title={t.identity}
      tags={["FA-001", "FA-005"]}
      intro={editing ? t.identityIntro : undefined}
      lang={lang}
      editing={editing}
      savedAt={savedAt}
      canSave={name.trim().length > 0}
      saveBlockedReason={t.nameRequired}
      onEdit={() => setEditing(true)}
      onCancel={cancel}
      onSave={() => {
        setSavedAt(TODAY);
        setEditing(false);
      }}
    >
      <div className="@container/form">
        <FormGrid>
          {editing ? (
            <>
              <TextField
                id="ag-name"
                label={t.agreementName}
                width="medium"
                required
                lang={lang}
                value={name}
                onChange={setName}
              />
              <TextField
                id="ag-area"
                label={t.area}
                width="medium"
                value={area}
                onChange={setArea}
              />
              <TextField
                id="ag-alt"
                label={t.alternativeName}
                width="medium"
                value={alternative}
                onChange={setAlternative}
              />
              <TextField
                id="ag-signed"
                label={t.signedDate}
                type="date"
                width="short"
                numeric
                value={signed}
                onChange={setSigned}
              />
              {/*
                Read-only in edit mode too, with the reason on the row — and at
                the same widths as the fields beside them. A read-only value
                left full-width beside a medium input is the ragged row
                `FormGrid` exists to prevent; the reader takes the width
                difference for a meaning difference.
              */}
              <Field
                label={t.type}
                value={agreement.agreementType}
                width="medium"
                hint={t.typeDerived}
              />
              <Field
                label={t.employerOrg}
                value={agreement.employerOrg.name}
                width="medium"
                hint={t.partiesElsewhere}
              />
              <Field
                label={t.employeeOrg}
                value={agreement.employeeOrg.name}
                width="medium"
                hint={t.partiesElsewhere}
              />
            </>
          ) : (
            <>
              <Field label={t.agreementName} value={name} width="medium" />
              <Field label={t.area} value={area} width="medium" />
              <Field
                label={t.alternativeName}
                value={alternative || d.common.none}
                width="medium"
              />
              <Field label={t.signedDate} value={signed || d.common.none} width="short" />
              <Field label={t.type} value={agreement.agreementType} />
              <Field label={t.employerOrg} value={agreement.employerOrg.name} />
              <Field label={t.employeeOrg} value={agreement.employeeOrg.name} />
            </>
          )}
        </FormGrid>
      </div>
    </EditablePanel>
  );
}

/**
 * The scope figures — the four MI revises between rounds, now editable.
 *
 * *Organisationsgrad* is not one of them and never becomes an input: it is
 * fackmedlemmar over anställda, and a third stored number that could disagree
 * with the two it is derived from would be a claim about the labour market
 * nobody made. It recomputes as the officer types, which is the demonstration —
 * the reader can see that it follows rather than being entered.
 */
export function AgreementScope({
  agreement,
  lang,
}: {
  agreement: Pick<
    Agreement,
    | "employees"
    | "annualWorkers"
    | "unionMembers"
    | "averageWageSek"
    | "employeesUpdated"
    | "averageWageUpdated"
  >;
  lang: Lang;
}) {
  const d = dictionary(lang);
  const t = d.avtal.detail;

  const [editing, setEditing] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const asText = (n: number | undefined) => (n === undefined ? "" : String(n));
  const [employees, setEmployees] = useState(asText(agreement.employees));
  const [annual, setAnnual] = useState(asText(agreement.annualWorkers));
  const [members, setMembers] = useState(asText(agreement.unionMembers));
  const [wage, setWage] = useState(asText(agreement.averageWageSek));

  const num = (v: string) => {
    const n = Number(v.replace(/\s/g, "").replace(",", "."));
    return v.trim() === "" || Number.isNaN(n) ? undefined : n;
  };
  const density = unionDensityPercent({
    ...(num(employees) !== undefined ? { employees: num(employees)! } : {}),
    ...(num(members) !== undefined ? { unionMembers: num(members)! } : {}),
  } as Pick<Agreement, "employees" | "unionMembers">);

  function cancel() {
    setEmployees(asText(agreement.employees));
    setAnnual(asText(agreement.annualWorkers));
    setMembers(asText(agreement.unionMembers));
    setWage(asText(agreement.averageWageSek));
    setEditing(false);
  }

  const shown = (v: string) => figure(num(v), lang, t.notRegistered);

  return (
    <EditablePanel
      title={t.scopeHeading}
      tags={["FA-001", "FR-008"]}
      intro={t.scopeIntro}
      lang={lang}
      editing={editing}
      savedAt={savedAt}
      onEdit={() => setEditing(true)}
      onCancel={cancel}
      onSave={() => {
        setSavedAt(TODAY);
        setEditing(false);
      }}
    >
      <div className="@container/form">
        <FormGrid>
          {editing ? (
            <>
              <TextField
                id="sc-employees"
                label={t.employeesLabel}
                width="short"
                numeric
                value={employees}
                onChange={setEmployees}
              />
              <TextField
                id="sc-annual"
                label={t.annualWorkers}
                width="short"
                numeric
                value={annual}
                onChange={setAnnual}
              />
              <TextField
                id="sc-members"
                label={t.unionMembers}
                width="short"
                numeric
                value={members}
                onChange={setMembers}
              />
              {/* Derived, and it moves while the two above it are typed. */}
              <Field
                label={t.unionDensity}
                value={density === undefined ? t.notRegistered : decimal(density, lang)}
                width="short"
                hint={t.scopeEditNote}
              />
              <TextField
                id="sc-wage"
                label={t.averageWage}
                width="short"
                numeric
                value={wage}
                onChange={setWage}
              />
            </>
          ) : (
            <>
              <Field
                label={t.employeesLabel}
                value={shown(employees)}
                width="short"
                {...(agreement.employeesUpdated
                  ? { hint: t.updatedSuffix(agreement.employeesUpdated) }
                  : {})}
              />
              <Field label={t.annualWorkers} value={shown(annual)} width="short" />
              <Field label={t.unionMembers} value={shown(members)} width="short" />
              <Field
                label={t.unionDensity}
                value={density === undefined ? t.notRegistered : decimal(density, lang)}
                width="short"
              />
              <Field
                label={t.averageWage}
                value={shown(wage)}
                width="short"
                {...(agreement.averageWageUpdated
                  ? { hint: t.updatedSuffix(agreement.averageWageUpdated) }
                  : {})}
              />
            </>
          )}
        </FormGrid>
      </div>
      <Rationale>{t.derivedNote}</Rationale>
    </EditablePanel>
  );
}

/**
 * Publication — an act with a date and a person, beside the status it changes.
 *
 * It sat under the edit form, which put the control that releases an agreement
 * to the public computer inside a panel about correcting typos. Here it is next
 * to FR-012's status and the validity period, which is what a reader is already
 * looking at when the question *is this out yet?* occurs to them.
 *
 * The gate is the interesting half. `mayPublish` refuses a record that is not
 * complete and signed, and the control says so rather than being silently
 * absent — MI decides when an agreement is released, and an interface that
 * would let an officer put a half-registered draft in front of the public is
 * one this screen should refuse out loud.
 */
export function AgreementPublication({
  agreement,
  lang,
}: {
  agreement: Pick<Agreement, "id" | "published"> & {
    registrationStatus: RegistrationStatus;
    signedDate?: string;
  };
  lang: Lang;
}) {
  const t = dictionary(lang).avtal.detail;
  const [published, setPublished] = useState(agreement.published ?? null);
  /*
    Publication was the only consequential act on the screen that said nothing
    when it succeeded — every edit, every role change, every appointment emits a
    live confirmation. This is the act that puts MI's information in front of
    the public, so it is the last one that should be silent about having
    happened.
  */
  const [justPublished, setJustPublished] = useState(false);
  const router = useRouter();
  const ready = mayPublish({ ...agreement, ...(published ? { published } : {}) });

  return (
    <Panel title={t.publication} tags={["FR-009", "FR-011"]} headingLevel={2}>
      {/*
        A badge and a sentence, not a `Callout`.

        The sidebar is 320px and a callout spends a third of it on an icon, a
        rule and a label — the publication note came out eight words tall, one
        or two words per line. A `Callout` is for feedback about something that
        just happened; this is a state the record has been in since April, and
        it reads better as the state word plus the facts under it.
      */}
      {justPublished && (
        <div className="print-hide mb-3">
          <Callout tone="ok" live tags={["FR-009", "FR-011"]}>
            {t.publishedConfirm}
          </Callout>
        </div>
      )}

      {published ? (
        <>
          <div className="space-y-2">
            <Badge tone="ok">{t.publishedLabel}</Badge>
            <p className="text-table">{t.publishedNote(published.date, published.by)}</p>
          </div>
          <div className="print-hide mt-3">
            {/* Where it went. A publication the officer cannot go and look at
                is a claim rather than a result. */}
            {/*
              A `LinkButton`, not a `Button` with `window.open`. It navigates,
              so it is an `<a>`: it shows its destination on hover, it can be
              opened in a new tab deliberately rather than always, and a
              middle-click behaves. The house rule has said so since the seven
              screens that hand-rolled it were fixed; this one was missed.
            */}
            <LinkButton
              href={`/allmanheten/${agreement.id}`}
              variant="secondary"
              size="sm"
              iconEnd={<IconForward />}
            >
              {t.viewPublic}
            </LinkButton>
          </div>
        </>
      ) : (
        <>
          <p className="text-table">{t.notPublished}</p>
          <div className="print-hide mt-3">
            <Button
              disabled={!ready}
              disabledReason={t.publishBlocked}
              onClick={() => {
                /*
                  Bilaga 2 §3.5, bullet nine, whose own wording is *"publicerar
                  avtalet **så att det blir tillgängligt för användare med
                  åtkomst till publicerad information**"*. The visibility is the
                  bullet. This used to set component state only, so an officer
                  published an agreement, switched to Allmänhetens dator, and it
                  was not there — the one screen the act exists to change.
                */
                markPublished(agreement.id);
                setPublished({ date: TODAY, by: ACTING_OFFICER });
                setJustPublished(true);
                startTransition(() => router.refresh());
              }}
            >
              {t.publish}
            </Button>
          </div>
        </>
      )}
      <Rationale>{t.publicationNote}</Rationale>
    </Panel>
  );
}
