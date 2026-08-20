"use client";

import { useState } from "react";

import type { Lang } from "@/lib/domain/lang";
import { MEDIATION_TYPE_LABEL, type MediationType } from "@/lib/domain/mediation";
import { dictionary } from "@/lib/i18n";
import { IconCheck, IconPlus } from "./icons";
import { Button, Callout, Chip, FormGrid, Panel, Rationale, ReqTags, TextField } from "./primitives";

/**
 * Adding a mediator to the register — FF-009.
 *
 * The requirement is *"ett register över medlare"* with statistics per mediator,
 * and MIIS had the register and the statistics and no way to put anyone in it.
 * That is the same failure as a filter that does not filter: an evaluator asked
 * "so how does a new mediator get here" and the answer was a table.
 *
 * Three things shape the form and none of them is a layout preference.
 *
 * **Contact details are the point of the register.** D-004 puts them under MI's
 * retention routines, and FE-001 sends the appointment notification to a real
 * address; a mediator with no telephone number is a row that cannot be used for
 * the thing the register exists for.
 *
 * **Mediation type is a multiple choice, not one.** MI's own decisions appoint
 * the same people to *särskild medling* and to standing assignments, so the
 * types are chips rather than a dropdown — Gunilla Runnquist appears in Bilaga E
 * under two of them.
 *
 * **There is no history field.** A mediator's assignments come from the cases
 * they are appointed to, and `mediatorStats` derives the year, the agreement
 * area and the ettan/tvåan position from those. Typing a history in by hand
 * would let the register disagree with the mediation cases it summarises, which
 * is exactly the drift FF-009's statistics exist to prevent.
 */
export function NewMediator({ lang }: { lang: Lang }) {
  const d = dictionary(lang);
  const t = d.medlare.add;

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [types, setTypes] = useState<MediationType[]>(["special"]);
  const [saved, setSaved] = useState<string | null>(null);

  /* MI's two, from the mediation model — there is no third. */
  const ALL_TYPES: MediationType[] = ["special", "standing"];

  function reset() {
    setName("");
    setEmail("");
    setPhone("");
    setTypes(["special"]);
    setSaved(null);
  }

  if (saved) {
    return (
      <Panel title={t.heading} tags={["FF-009", "D-004", "FH-001"]}>
        <Callout tone="ok" live>
          {t.savedNote(saved)}
        </Callout>
        <div className="mt-4">
          <Button
            variant="secondary"
            onClick={() => {
              reset();
              setOpen(true);
            }}
            iconStart={<IconPlus />}
          >
            {t.addAnother}
          </Button>
        </div>
        <Rationale>{t.logNote}</Rationale>
      </Panel>
    );
  }

  return (
    <Panel title={t.heading} tags={["FF-009", "D-004"]}>
      <p className="max-w-4xl text-table">{t.intro}</p>

      {!open ? (
        <div className="mt-4">
          <Button variant="secondary" onClick={() => setOpen(true)} iconStart={<IconPlus />}>
            {t.open}
          </Button>
        </div>
      ) : (
        <div className="mt-4 space-y-5">
          <FormGrid>
            <TextField
              id="me-name"
              label={t.name}
              width="medium"
              value={name}
              onChange={setName}
              placeholder={t.namePlaceholder}
            />
            <TextField
              id="me-phone"
              label={t.phone}
              width="short"
              value={phone}
              onChange={setPhone}
              placeholder="070-000 00 00"
            />
            <TextField
              id="me-email"
              label={t.email}
              width="medium"
              value={email}
              onChange={setEmail}
              placeholder="fornamn.efternamn@example.se"
            />
          </FormGrid>

          <fieldset>
            <legend className="mb-2 text-label font-bold">{t.types}</legend>
            <div className="flex flex-wrap gap-2">
              {ALL_TYPES.map((type) => (
                <Chip
                  key={type}
                  pressed={types.includes(type)}
                  onToggle={() =>
                    setTypes((list) =>
                      list.includes(type) ? list.filter((x) => x !== type) : [...list, type],
                    )
                  }
                >
                  {MEDIATION_TYPE_LABEL[lang][type]}
                </Chip>
              ))}
            </div>
            <p aria-live="polite" className="mt-2 text-label text-muted-foreground">
              {types.length === 0 ? t.noTypes : t.typeCount(types.length)}
            </p>
          </fieldset>

          <Rationale>{t.historyNote}</Rationale>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setSaved(name.trim())}
              disabled={name.trim().length === 0 || types.length === 0}
              disabledReason={t.typeRequired}
              iconStart={<IconCheck />}
            >
              {t.save}
            </Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              {d.common.close}
            </Button>
            <ReqTags ids={["FF-009", "FH-001"]} />
          </div>
          {types.length === 0 && (
            <p className="text-label text-muted-foreground">{t.typeRequired}</p>
          )}
        </div>
      )}
      {/* Kept out of the flow above: it is why the form has no history field. */}
      <Rationale>{t.logNote}</Rationale>
    </Panel>
  );
}
