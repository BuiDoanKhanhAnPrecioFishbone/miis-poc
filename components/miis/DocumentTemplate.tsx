"use client";

import { useId, useState } from "react";

import type { Lang } from "@/lib/domain/lang";
import { dictionary } from "@/lib/i18n";
import { IconCheck, IconPlus } from "./icons";
import { PrintButton, PrintHeader } from "./Print";
import { Badge, Button, Callout, Field, FormGrid, Panel, Rationale, ReqTags } from "./primitives";
import { SegmentedControl } from "./Select";

/**
 * Creating a document from one of MI's templates — FSD-001 and FSD-002.
 *
 * §4.1's *Dokumentgenerering* is the sentence this is built from: the system
 * shall create documents *"utifrån en dokumentmall, där förinmatad information
 * från MIIS ska kunna redigeras"*. Both halves matter and only one of them had
 * been drawn. MIIS knew the template existed and said so on a disabled button;
 * what it never showed was the thing the requirement is actually about — that
 * MI's own information arrives in the document already filled in, and that the
 * officer can change it before the document is finished.
 *
 * So the control opens the draft rather than producing a file. The pre-filled
 * fields are listed with where each one came from, the body is editable, and
 * creating it names the file and logs who did it. That is the whole of FSD-001
 * and FSD-002 as a workflow, and it is demonstrable in a fifteen-minute
 * presentation, which a greyed-out button is not.
 *
 * **Variants are a `SegmentedControl`, not two buttons.** FSD-001 asks for a
 * GD-beslut *"en variant med varsel och en utan varsel"* — that is one document
 * with a property, not two documents. Two buttons said the opposite, and left
 * the officer with no way to see which variant they were about to produce.
 */

export interface TemplateField {
  label: string;
  value: string;
  /** Where MIIS took it from — the *förinmatad* half of the requirement. */
  source: string;
}

export interface TemplateVariant {
  id: string;
  label: string;
  /** The body as the template fills it, before the officer edits it. */
  body: string;
  /**
   * The file the variant produces.
   *
   * A string on the variant rather than a `fileName(variant)` callback,
   * because half the callers are server components and a function cannot cross
   * that boundary — the mediation case failed to render at all until this was
   * data instead of behaviour.
   */
  fileName: string;
}

export function DocumentTemplate({
  lang,
  heading,
  intro,
  fields,
  variants,
  requirements,
  logNote,
  created,
}: {
  lang: Lang;
  heading: string;
  intro: string;
  fields: TemplateField[];
  /** One variant, or the two FSD-001 asks for. */
  variants: TemplateVariant[];
  requirements: readonly string[];
  logNote: string;
  /** A document already produced for this case, if there is one. */
  created?: string;
}) {
  const d = dictionary(lang);
  const t = d.documentTemplate;
  const bodyId = useId();

  const [open, setOpen] = useState(false);
  const [variantId, setVariantId] = useState(variants[0]!.id);
  const [body, setBody] = useState(variants[0]!.body);
  const [edited, setEdited] = useState(false);
  const [saved, setSaved] = useState<string | null>(created ?? null);
  /* The variant the officer asked for while their own text was in the way. */
  const [switchingTo, setSwitchingTo] = useState<string | null>(null);

  const variant = variants.find((v) => v.id === variantId) ?? variants[0]!;

  /**
   * Switching template, with the officer's own text in the way.
   *
   * Untouched, it just switches — there is nothing to lose, and a confirmation
   * with no cost teaches the reader to dismiss confirmations.
   *
   * Edited, it asks. The old behaviour kept the text and changed only the
   * variant label, which its own comment called the lesser of two failures:
   * the officer asked for the other template and got the first one's text under
   * the second one's name, with nothing said. Asking is the third answer, and
   * the one replacing a protocol and unlinking an agreement already use.
   */
  function chooseVariant(id: string) {
    if (edited && id !== variantId) {
      setSwitchingTo(id);
      return;
    }
    setVariantId(id);
    setBody(variants.find((v) => v.id === id)?.body ?? "");
  }

  function confirmSwitch() {
    if (!switchingTo) return;
    setVariantId(switchingTo);
    setBody(variants.find((v) => v.id === switchingTo)?.body ?? "");
    setEdited(false);
    setSwitchingTo(null);
  }

  return (
    <Panel title={heading} tags={requirements}>
      <p className="print-hide max-w-4xl text-table">{intro}</p>

      {/*
        The document it produced, kept on screen.

        Saving used to `return` a receipt in place of the whole panel: the
        pre-filled values, the variant and the body all disappeared, so an
        officer who created a GD-beslut could not read the GD-beslut. That is
        the same fault the mediator register had — an act that produces
        something has to end **on that thing** — and it is worse here, because
        FSD-001 asks for a document *"utifrån en dokumentmall, där förinmatad
        information från MIIS ska kunna redigeras"*: showing which register each
        value came from is half the requirement, and the save destroyed the
        evidence.

        It is `print-document`, so printing it prints the document rather than
        the screen around it — the same rule the report result follows.
      */}
      {saved && (
        <div className="print-document mt-4">
          <PrintHeader lang={lang} title={saved} />
          <div className="print-hide">
            <Callout tone="ok" live tags={requirements}>
              {t.createdNote}
            </Callout>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Badge tone="ok">{t.created}</Badge>
              <span className="min-w-0 break-all font-semibold">{saved}</span>
            </div>
          </div>

          {/*
            The values and where they came from, still named. A document a
            reader cannot trace back to its registers is a document nobody can
            check after the fact.
          */}
          <div className="mt-4">
            <h3 className="mi-kicker mb-2 text-muted-foreground">{t.prefilled}</h3>
            <FormGrid>
              {fields.map((f) => (
                <Field key={f.label} label={f.label} value={f.value} hint={f.source} />
              ))}
            </FormGrid>
          </div>

          {/* The body as it was saved — the document itself, not a box to type
              in. `whitespace-pre-wrap` keeps the template's own line breaks,
              which are what make it read as a decision rather than a paragraph. */}
          <div className="mt-4">
            <h3 className="mi-kicker mb-2 text-muted-foreground">{t.body}</h3>
            <p className="whitespace-pre-wrap text-table leading-relaxed">{body}</p>
          </div>

          <div className="print-hide mt-4 flex flex-wrap items-center gap-3">
            <PrintButton lang={lang} />
            {/*
              *Ändra dokumentet*, not *Öppna mallen igen*. The body survives —
              pressing this returns to the same text with the cursor in it — and
              the old label described discarding it. Wrong in the one direction
              that matters: an officer who had just written a GD-beslut would
              reasonably not press a control offering to throw it away.
            */}
            <Button
              variant="secondary"
              onClick={() => {
                setSaved(null);
                setOpen(true);
              }}
            >
              {t.reopen}
            </Button>
          </div>
        </div>
      )}

      {saved ? null : !open ? (
        <div className="mt-4">
          <Button variant="secondary" onClick={() => setOpen(true)} iconStart={<IconPlus />}>
            {t.open}
          </Button>
          <Rationale>{t.openNote}</Rationale>
        </div>
      ) : (
        <div className="mt-4 space-y-5">
          {variants.length > 1 && (
            <div>
              <p className="mb-2 text-label font-bold">{t.variant}</p>
              <SegmentedControl
                label={t.variant}
                value={variantId}
                onChange={chooseVariant}
                options={variants.map((v) => ({ id: v.id, label: v.label }))}
              />
              {/* Under the control that raised it, and naming the cost. */}
              {switchingTo && (
                <div className="mt-3">
                  <Callout tone="attention" live>
                    <span className="basis-full">
                      {t.switchWarning(
                        variants.find((v) => v.id === switchingTo)?.label ?? "",
                      )}
                    </span>
                    <span className="mt-2 flex flex-wrap gap-2">
                      <Button variant="danger" size="sm" onClick={confirmSwitch}>
                        {t.switchConfirm}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSwitchingTo(null)}
                      >
                        {t.switchCancel}
                      </Button>
                    </span>
                  </Callout>
                </div>
              )}
            </div>
          )}

          {/*
            The *förinmatad* half, shown rather than implied. Each value names
            where MIIS took it from, because a document generated from a
            register is only trustworthy if the officer can see which register.
          */}
          <div>
            <h3 className="mi-kicker mb-2 text-muted-foreground">{t.prefilled}</h3>
            <FormGrid>
              {fields.map((f) => (
                <Field key={f.label} label={f.label} value={f.value} hint={f.source} />
              ))}
            </FormGrid>
          </div>

          {/*
            And the editable half. A `textarea` rather than a rich editor: the
            requirement is that the pre-filled information *can be edited*, and
            a formatting toolbar would be a claim about the delivered document
            pipeline that nothing in the specification supports.
          */}
          <div>
            <label htmlFor={bodyId} className="mb-1 block text-label font-bold">
              {t.body}
            </label>
            <textarea
              id={bodyId}
              value={body}
              rows={10}
              onChange={(e) => {
                setBody(e.target.value);
                setEdited(true);
              }}
              className="field-input min-h-48 w-full font-sans leading-relaxed"
            />
            <p className="mt-1 text-label text-muted-foreground">
              {edited ? t.editedNote : t.bodyNote}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => setSaved(variant.fileName)} iconStart={<IconCheck />}>
              {t.create}
            </Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              {d.common.close}
            </Button>
            <ReqTags ids={requirements} />
          </div>
          <p className="text-label text-muted-foreground">{t.fileNote(variant.fileName)}</p>
        </div>
      )}
      <Rationale>{logNote}</Rationale>
    </Panel>
  );
}
