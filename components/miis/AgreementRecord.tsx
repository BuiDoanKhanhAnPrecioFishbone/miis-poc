import type { Lang } from "@/lib/domain/lang";
import {
  orderedQuestions,
  unionDensityPercent,
  type Agreement,
  type SpecialQuestions,
} from "@/lib/domain/agreement";
import { amount, decimal } from "@/lib/format";
import { dictionary } from "@/lib/i18n";
import { Badge, Callout, Field, FormGrid, Panel, Rationale,
  EmptyState,
} from "./primitives";

/**
 * The rest of MI's own agreement record — Bilaga 3 §3.3 and §3.11.
 *
 * Avropsförfrågan §18.3 is explicit that the current system is **not** a design
 * template, so none of this copies a W3D3 screen. What it takes from the manual
 * is the *shape of the information MI keeps*, which is migration source
 * material and exactly what §18.3 says the manual is for:
 *
 * - **Four scope figures, not one.** We held `Anställda` and MI holds four.
 *   Heads, full-time equivalents, union members and the average wage answer
 *   different questions, and a cost frame applies to the second number rather
 *   than the first — 9 400 employees in home services is 6 100 årsarbetare.
 * - **A flag is always paired with a comment.** MI's Basfakta does this six
 *   times. The flag is what a report can count; the comment is why an officer
 *   set it, and `Nej` with a comment is a real state — "checked, and it is not
 *   one" is different from nobody having looked.
 * - **Särskilda frågor are three numbered slots**, not a list. We had folded
 *   them into `WorkingGroup.subjectAreas`, which was a reading of FA-014 rather
 *   than of MI's form. A working group is a body with a reporting date; a
 *   särskild fråga is a question the agreement text answers. An agreement
 *   routinely has one and not the other.
 *
 * Server-side, no hooks — everything here is registered data being read.
 */

/** A registered figure, or MI's own mark for one that was never entered. */
function figure(value: number | undefined, lang: Lang, fallback: string): string {
  return value === undefined ? fallback : amount(value, lang);
}

/** One of MI's yes/no-plus-comment rows. Absent is absent — no row is drawn. */
function FlagRow({
  label,
  flag,
  lang,
}: {
  label: string;
  flag: { value: boolean; comment?: string } | undefined;
  lang: Lang;
}) {
  if (!flag) return null;
  const d = dictionary(lang);
  return (
    <li className="border-t border-border pt-3 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-label font-bold">{label}</span>
        <Badge tone={flag.value ? "attention" : "neutral"}>
          {flag.value ? d.common.yes : d.common.no}
        </Badge>
      </div>
      {flag.comment && <p className="mt-1 max-w-4xl text-table">{flag.comment}</p>}
    </li>
  );
}

export function AgreementBasicFactsPanel({
  agreement,
  lang,
}: {
  agreement: Agreement;
  lang: Lang;
}) {
  const t = dictionary(lang).avtal.detail;
  const flags = [
    agreement.hangingAgreement,
    agreement.organisationalChange,
    agreement.terminated,
  ].filter(Boolean);
  /*
    The sections MI has restricted, named for the officer who set them.

    Registering a restriction and never showing it back is how a restriction
    becomes invisible to the person responsible for it — they cannot see what
    they marked, and cannot see that it is still marked a round later. The
    withholding itself happens in the markup of the section (`LimitedSectionPanel`)
    for a role that may not read it; this is the other half of the same fact.
  */
  const limited = [
    agreement.informationLimits?.workingGroups ? t.workingGroups : null,
    agreement.informationLimits?.minimumWages ? t.minimumWages : null,
  ].filter((v): v is string => v !== null);

  const anything =
    flags.length > 0 || Boolean(agreement.negotiationOrderRef) || limited.length > 0;

  return (
    <Panel title={t.basicFacts} tags={["FA-001", "FA-017"]}>
      {/* The sentence explains the yes/no-plus-comment pairing, so it belongs
          above rows that show one — not above a lone diarienummer. */}
      {flags.length > 0 && <p className="mb-4 max-w-4xl text-table">{t.basicFactsIntro}</p>}

      {!anything ? (
        <EmptyState text={t.noBasicFacts} />
      ) : (
        <>
          <ul className="space-y-3">
            <FlagRow label={t.hangingAgreement} flag={agreement.hangingAgreement} lang={lang} />
            <FlagRow
              label={t.organisationalChange}
              flag={agreement.organisationalChange}
              lang={lang}
            />
            <FlagRow label={t.terminated} flag={agreement.terminated} lang={lang} />
          </ul>
          {agreement.negotiationOrderRef && (
            <div className={flags.length > 0 ? "mt-4 border-t border-border pt-3" : ""}>
              <Field
                label={t.negotiationOrderRef}
                value={agreement.negotiationOrderRef}
                width="medium"
              />
            </div>
          )}
          {limited.length > 0 && (
            <div className="mt-4 border-t border-border pt-3">
              <Field label={t.limited} value={limited.join(" · ")} width="full" />
              <Rationale>{t.limitedRegisteredNote}</Rationale>
            </div>
          )}
          {agreement.terminated?.value && <Rationale>{t.terminatedNote}</Rationale>}
        </>
      )}
    </Panel>
  );
}

/**
 * *Rapporturval* (§3.3) — which reports this agreement flows into.
 *
 * It was registered on every agreement and shown nowhere, so an officer could
 * not see why one agreement reaches the Konjunkturlönerapport and the next does
 * not. Read-only here: the selection is set during registration.
 */
export function ReportSelectionPanel({ agreement, lang }: { agreement: Agreement; lang: Lang }) {
  const t = dictionary(lang).avtal.detail;
  const s = agreement.reportSelection;
  const chosen = [
    s.eurofound ? t.reportEurofound : null,
    s.minimumWage ? t.reportMinimumWage : null,
    s.website ? t.reportWebsite : null,
    s.shortTermWageReport ? t.reportShortTermWage : null,
  ].filter((v): v is string => v !== null);

  return (
    <Panel title={t.reportSelection} tags={["FR-005", "FR-008", "FR-009", "FR-010"]}>
      {chosen.length === 0 ? (
        <EmptyState text={t.noReportSelection} />
      ) : (
        <ul className="space-y-2 text-table">
          {chosen.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

export function SpecialQuestionsPanel({ sets, lang }: { sets: SpecialQuestions[]; lang: Lang }) {
  const t = dictionary(lang).avtal.detail;

  return (
    <Panel title={t.specialQuestions} tags={["FA-011", "FA-014"]}>
      <p className="mb-4 max-w-4xl text-table">{t.specialQuestionsIntro}</p>

      {sets.length === 0 ? (
        <EmptyState text={t.noSpecialQuestions} />
      ) : (
        <div className="space-y-6">
          {sets.map((set) => (
            <section key={`${set.agreementId}-${set.year}`}>
              {/*
                The year, and nothing else. A set-level jämställdhet badge sat
                directly above *Särskild fråga 1* and read as belonging to it —
                FA-011's flag is per question here, and every question that
                carries it shows it on its own row.
              */}
              <p className="mi-kicker text-muted-foreground">{t.questionYear(set.year)}</p>

              <ul className="mt-3 space-y-4">
                {orderedQuestions(set).map((q) => (
                  <li
                    key={q.number}
                    className="border-t border-border pt-3 first:border-t-0 first:pt-0"
                  >
                    {/*
                      The slot number is part of the name, not a list marker.
                      MI's reports refer to "Särskild fråga 3", so a question
                      filed in slot 3 with slot 2 empty stays 3.
                    */}
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-label font-bold">{t.questionNumber(q.number)}</span>
                      {q.genderEquality && <Badge tone="attention">{t.questionEquality}</Badge>}
                    </div>
                    <p className="mt-1 text-table font-semibold">{q.question}</p>
                    {q.agreementText && (
                      <p className="mt-2 max-w-4xl text-table">
                        <span className="text-label font-bold">{t.questionText}: </span>
                        {q.agreementText}
                      </p>
                    )}
                    {q.comment && (
                      <p className="mt-1 max-w-4xl text-label text-muted-foreground">
                        <span className="font-bold">{t.questionComment}: </span>
                        {q.comment}
                      </p>
                    )}
                  </li>
                ))}
              </ul>

              {set.comment && (
                <p className="mt-3 max-w-4xl text-label text-muted-foreground">{set.comment}</p>
              )}
            </section>
          ))}
        </div>
      )}
    </Panel>
  );
}

/**
 * What stands in for a section the reader may not have.
 *
 * FR-011 and D-002 are enforced in the markup, so the restricted content is
 * never rendered and then hidden — a value hidden by CSS is still in the
 * document, and a requirement about what may leave the building cannot be met
 * by not painting it. The panel still appears, because the reader has to know
 * that something exists and was withheld rather than that nothing was
 * registered.
 */
export function LimitedSectionPanel({
  title,
  lang,
  tags,
}: {
  title: string;
  lang: Lang;
  tags?: readonly string[];
}) {
  const t = dictionary(lang).avtal.detail;
  return (
    <Panel title={title} tags={tags}>
      <Callout tone="attention" label={t.limited} tags={["FR-011", "D-002"]}>
        {t.limitedNote}
      </Callout>
    </Panel>
  );
}
