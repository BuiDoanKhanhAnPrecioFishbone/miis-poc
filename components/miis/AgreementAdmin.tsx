"use client";

import { useState } from "react";

import {
  mayPublish,
  type Agreement,
  type RegistrationStatus,
} from "@/lib/domain/agreement";
import type { Lang } from "@/lib/domain/lang";
import { dictionary } from "@/lib/i18n";
import { IconCheck, IconForward } from "./icons";
import {
  Button,
  Callout,
  Field,
  FormGrid,
  Panel,
  Rationale,
  ReqTags,
  TextField,
} from "./primitives";

/**
 * The two acts Bilaga 2 §3.5's Scenario 2 asks to be shown, and the prototype
 * had as a disabled button and nothing at all:
 *
 * - *"Lägger till eller uppdaterar information kopplad till avtalet."*
 * - *"Publicerar avtalet så att det blir tillgängligt för användare med åtkomst
 *   till publicerad information."*
 *
 * **Editing is in place, on the values themselves.** FA-001 is *"registrera och
 * redigera avtalsinformation"* and the detail showed only the first half, so an
 * agreement could be read and never corrected. The panel switches its fields to
 * inputs rather than opening a second screen: the officer is looking at the
 * record they are correcting, and moving to a form would make them remember
 * what it said.
 *
 * **Publishing is an act with a date and a person**, offered only on a record
 * that is complete and signed. That gate is the interesting half — MI decides
 * when an agreement is released, and a control that would let an officer put a
 * half-registered draft on the public computer is one this screen should refuse
 * and say why.
 */

/** Fixed, so a screenshot taken twice is the same image. */
const TODAY = "2027-06-14";
const ACTING_OFFICER = "Anna Andersson";

export function AgreementAdmin({
  agreement,
  lang,
}: {
  agreement: Pick<
    Agreement,
    "id" | "name" | "agreementArea" | "agreementType" | "alternativeName" | "published"
  > & { registrationStatus: RegistrationStatus; signedDate?: string };
  lang: Lang;
}) {
  const d = dictionary(lang);
  const t = d.avtal.detail;

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(agreement.name);
  const [area, setArea] = useState(agreement.agreementArea);
  const [alternative, setAlternative] = useState(agreement.alternativeName ?? "");
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const [published, setPublished] = useState(agreement.published ?? null);
  const ready = mayPublish({ ...agreement, ...(published ? { published } : {}) });

  return (
    <Panel title={t.administration} tags={["FA-001", "FR-009", "FH-001"]}>
      <p className="mb-4 max-w-4xl text-table">{t.administrationIntro}</p>

      {savedAt && (
        <div className="mb-4">
          <Callout tone="ok" live tags={["FA-001", "FH-001"]}>
            {t.editSaved(savedAt)}
          </Callout>
        </div>
      )}

      {editing ? (
        <>
          <div className="@container/form">
            <FormGrid>
              <TextField id="ag-name" label={t.agreementName} width="medium" value={name} onChange={setName} />
              <TextField id="ag-area" label={t.area} width="medium" value={area} onChange={setArea} />
              <TextField
                id="ag-alt"
                label={t.alternativeName}
                width="medium"
                value={alternative}
                onChange={setAlternative}
              />
            </FormGrid>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              iconStart={<IconCheck />}
              disabled={name.trim().length === 0}
              disabledReason={t.nameRequired}
              onClick={() => {
                setSavedAt(TODAY);
                setEditing(false);
              }}
            >
              {d.common.save}
            </Button>
            <Button variant="ghost" onClick={() => setEditing(false)}>
              {d.common.close}
            </Button>
            <ReqTags ids={["FA-001", "FH-001"]} />
          </div>
        </>
      ) : (
        <>
          <div className="@container/form">
            <FormGrid>
              <Field label={t.agreementName} value={name} width="medium" />
              <Field label={t.area} value={area} width="medium" />
              <Field
                label={t.alternativeName}
                value={alternative || d.common.none}
                width="medium"
              />
            </FormGrid>
          </div>
          <div className="mt-4">
            <Button variant="secondary" onClick={() => setEditing(true)}>
              {t.edit}
            </Button>
          </div>
        </>
      )}

      <div className="mt-6 border-t border-border pt-4">
        <h3 className="mi-kicker mb-2 text-muted-foreground">{t.publication}</h3>
        {published ? (
          <>
            <Callout tone="ok" label={t.publishedLabel} tags={["FR-009", "FR-011"]}>
              {t.publishedNote(published.date, published.by)}
            </Callout>
            <div className="mt-3">
              {/* Where it went. A publication the officer cannot go and look at
                  is a claim rather than a result. */}
              <Button
                variant="secondary"
                size="sm"
                iconEnd={<IconForward />}
                onClick={() => window.open(`/allmanheten/${agreement.id}`, "_blank")}
              >
                {t.viewPublic}
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="max-w-4xl text-table">{t.notPublished}</p>
            <div className="mt-3">
              <Button
                disabled={!ready}
                disabledReason={t.publishBlocked}
                onClick={() => setPublished({ date: TODAY, by: ACTING_OFFICER })}
              >
                {t.publish}
              </Button>
            </div>
          </>
        )}
        <Rationale>{t.publicationNote}</Rationale>
      </div>
    </Panel>
  );
}
