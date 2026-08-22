"use client";

import type { ReactNode } from "react";

import type { Lang } from "@/lib/domain/lang";
import { dictionary } from "@/lib/i18n";
import { IconCheck } from "./icons";
import { Button, Callout, Panel, ReqTags } from "./primitives";

/**
 * A panel of the record that can be corrected where it stands.
 *
 * FA-001 is *"registrera **och redigera** avtalsinformation"*, and the detail
 * view answered the second half with one panel of its own headed
 * *Administration*, sitting under the record and repeating three of its values
 * as inputs. Two faults followed from that, and both were reported:
 *
 * - **The same values appeared twice on the page** — once as the registered
 *   record and once as a form — so an officer correcting the agreement area
 *   read it in one place and typed it in another, forty pixels apart, with no
 *   way to tell which was authoritative until they saved.
 * - **Only what that one panel happened to contain could be edited.** The
 *   agreement's scope figures, its dates and everything below them were
 *   read-only, which made *"redigera avtalsinformation"* mean *"redigera three
 *   fields"*. FA-001 does not say that.
 *
 * So the control belongs to the section, not to a panel about sections. Each
 * editable part of the record carries its own *Redigera*, switches its own
 * fields to inputs, and saves on its own — which is also how an officer works:
 * a wage figure arrives, and correcting it should not put the agreement's name
 * into an editable box at the same time.
 *
 * This is the chrome only — the heading, the confirmation, and the control row.
 * The state and the fields belong to the caller, because a panel that owned its
 * own values could not know which of them are derived and which are typed.
 *
 * **Publishing is not here**, and that separation is the other half of the fix.
 * Editing changes what the register says; publishing decides that MI releases
 * it. Bundling them under one heading made a routine correction look like it
 * might put something on the public computer.
 */
export function EditablePanel({
  title,
  tags,
  intro,
  lang,
  editing,
  onEdit,
  onSave,
  onCancel,
  canSave = true,
  saveBlockedReason,
  savedAt,
  headingLevel,
  children,
}: {
  title: string;
  tags?: readonly string[];
  intro?: string;
  lang: Lang;
  editing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  /** False disables Save; `saveBlockedReason` then says why on the control. */
  canSave?: boolean;
  saveBlockedReason?: string;
  /** Set once a save has happened, so the panel can confirm it — FH-001. */
  savedAt?: string | null;
  headingLevel?: 2 | 3;
  /** The fields, rendered by the caller as values or as inputs. */
  children: ReactNode;
}) {
  const d = dictionary(lang);
  const t = d.avtal.detail;

  return (
    <Panel title={title} {...(tags ? { tags } : {})} {...(headingLevel ? { headingLevel } : {})}>
      {intro && <p className="mb-4 max-w-4xl text-table">{intro}</p>}

      {/*
        The change is logged, and the panel says so where the change happened.
        FH-001 records old value, new value, time and user; a confirmation that
        only said "sparat" would leave the officer to take the log on trust.
      */}
      {savedAt && !editing && (
        <div className="mb-4">
          <Callout tone="ok" live tags={["FA-001", "FH-001"]}>
            {t.editSaved(savedAt)}
          </Callout>
        </div>
      )}

      {children}

      {/*
        `print-hide` on the control row alone, not on the panel. The values are
        the document and they print; the button that changes them is a control
        and does not.
      */}
      <div className="print-hide mt-4 flex flex-wrap items-center gap-3">
        {editing ? (
          <>
            <Button
              iconStart={<IconCheck />}
              onClick={onSave}
              disabled={!canSave}
              {...(saveBlockedReason ? { disabledReason: saveBlockedReason } : {})}
            >
              {d.common.save}
            </Button>
            <Button variant="ghost" onClick={onCancel}>
              {d.common.cancel}
            </Button>
            <ReqTags ids={["FA-001", "FH-001"]} />
          </>
        ) : (
          <Button variant="secondary" onClick={onEdit}>
            {t.edit}
          </Button>
        )}
      </div>
    </Panel>
  );
}
