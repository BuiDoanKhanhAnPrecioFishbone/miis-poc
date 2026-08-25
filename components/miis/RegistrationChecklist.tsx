import {
  registrationChecklist,
  registrationProgress,
  type RegistrationGap,
  type RegistrationInput,
} from "@/lib/domain/agreement";
import type { Lang } from "@/lib/domain/lang";
import { dictionary } from "@/lib/i18n";
import { IconCheck, IconOpen } from "./icons";

/**
 * How far a registration has got — every line, with whether the record has it.
 *
 * `/avtal/ny` printed five fixed sentences after saving, and the detail view
 * named only what was absent. Neither could say *done*, so the officer's own
 * question — how much of this is finished — had no answer on any screen. This
 * is one derivation rendered in both places, and what is ticked is ticked
 * because the register says so.
 *
 * **The state is a mark, a word and a position, never a colour.** A tick alone
 * fails greyscale and a projector, and the whole checklist would then be five
 * grey lines. `IconCheck` is `aria-hidden` and the word beside it carries the
 * meaning, which is the same arrangement every other state in the system uses.
 *
 * Server-side by design: it is handed a record and computes nothing that needs
 * a browser.
 */
export function RegistrationChecklist({
  record,
  lang,
  compact,
}: {
  record: RegistrationInput;
  lang: Lang;
  /**
   * The sidebar version: labels only, no per-line state word.
   *
   * The agreement view's right column is 320px, and five lines each carrying a
   * label plus *Registrerat* wrapped to three lines apiece. The mark and the
   * muted text carry the state there, and the count above says the rest.
   */
  compact?: boolean;
}) {
  const t = dictionary(lang).avtal.checklist;
  const items = registrationChecklist(record);
  const { done, total } = registrationProgress(record);

  return (
    <div>
      <p className={compact ? "text-label font-semibold" : "text-table font-semibold"}>
        {t.progress(done, total)}
      </p>
      <ul className={compact ? "mt-2 space-y-1" : "mt-2 space-y-1.5"}>
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-2">
            {/*
              A fixed-width slot for the mark, so the labels line up whether or
              not a line is ticked. A ragged left edge on a five-line list reads
              as five unrelated sentences rather than as one checklist.
            */}
            <span aria-hidden className="mt-0.5 inline-flex w-4 shrink-0 justify-center">
              {item.done ? (
                <IconCheck />
              ) : (
                <IconOpen size="sm" className="text-muted-foreground" />
              )}
            </span>
            <span
              className={[
                compact ? "text-label" : "text-table",
                item.done ? "text-muted-foreground" : "text-foreground",
              ].join(" ")}
            >
              {t.item[item.id as RegistrationGap]}
              {!compact && (
                <span className="text-label text-muted-foreground">
                  {" · "}
                  {item.done ? t.done : t.remaining}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
