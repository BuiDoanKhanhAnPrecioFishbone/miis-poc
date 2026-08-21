import type { Lang } from "@/lib/domain/lang";
import type { ExpiryReport, ExpirySection } from "@/lib/domain/report";
import { amount, decimal } from "@/lib/format";
import { dictionary } from "@/lib/i18n";
import { Panel, Rationale } from "./primitives";

/**
 * Avtal – Utlöpningstidpunkter, after Bilaga 3 §7.11.
 *
 * MI's seventh report, and the one Bilaga F does not contain — we would not
 * have known it existed without the user manual. Its shape comes from the
 * manual's own sort order: a chart by month, then *Samtliga sektorer*, *Svenskt
 * Näringsliv*, and *Svenskt Näringsliv per arbetsgivargrupp*.
 *
 * **It is not Avtalsrörelserapporten with different words.** Rapport 3 splits
 * the year by FR-012 status — what has been settled. This one splits it by who
 * signs, which is the question an analyst preparing for a round actually asks:
 * how much of Svenskt Näringsliv falls due in April, and in which employer
 * groups. One criterion, *Årtal*, and only agreements in force.
 *
 * The bars are CSS. Three sections of twelve months needs a width and a
 * background; shipping a chart library to draw them would be the only external
 * dependency on the screen.
 */

const SHORT_MONTHS: Record<Lang, string[]> = {
  sv: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

const MONTHS: Record<Lang, string[]> = {
  sv: [
    "Januari", "Februari", "Mars", "April", "Maj", "Juni",
    "Juli", "Augusti", "September", "Oktober", "November", "December",
  ],
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
};

function Section({
  section,
  heading,
  lang,
  peak,
}: {
  section: ExpirySection;
  heading: string;
  lang: Lang;
  /** The largest month across every section, so the three charts share a scale. */
  peak: number;
}) {
  const t = dictionary(lang).rapporter.expiry;

  return (
    <div className="min-w-0">
      <h3 className="font-display text-section font-semibold">{heading}</h3>
      <p className="mt-1 text-label text-muted-foreground">
        {t.sectionTotal(
          amount(section.totalAgreements, lang),
          amount(section.totalEmployees, lang),
        )}
      </p>

      {section.totalAgreements === 0 ? (
        <p className="mt-3 text-table text-muted-foreground">{t.emptySection}</p>
      ) : (
        <>
          {/*
            One scale across all three sections, so "Svenskt Näringsliv is most
            of April" is legible from the bar heights rather than only from the
            numbers. Charts that each normalise to their own peak make a small
            section look like a large one.
          */}
          <div aria-hidden className="mt-4 flex items-end gap-1.5">
            {section.months.map((row, i) => (
              <div key={row.month} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                <div className="flex h-24 w-full flex-col justify-end border-b border-border">
                  {row.agreements > 0 && (
                    <div
                      className="bg-primary"
                      style={{ height: `${Math.max(3, (row.agreements / peak) * 100)}%` }}
                    />
                  )}
                </div>
                <span className="text-meta text-muted-foreground">{SHORT_MONTHS[lang][i]}</span>
              </div>
            ))}
          </div>

          <table className="mt-4 w-full text-label">
            <caption className="sr-only">{heading}</caption>
            <thead>
              <tr className="text-left text-muted-foreground">
                <th scope="col" className="border-b border-border py-2 pr-3 font-semibold">
                  {t.month}
                </th>
                <th scope="col" className="border-b border-border py-2 pr-3 text-right font-semibold">
                  {t.agreements}
                </th>
                <th scope="col" className="border-b border-border py-2 text-right font-semibold">
                  {t.employees}
                </th>
              </tr>
            </thead>
            <tbody>
              {section.months
                /* Months nothing falls due in are dropped from the table and kept
                   in the chart: twelve rows of zeros is noise in a list and shape
                   in a bar chart. */
                .filter((row) => row.agreements > 0)
                .map((row) => (
                  <tr key={row.month} className="border-b border-border/60">
                    <th scope="row" className="py-1.5 pr-3 text-left font-normal">
                      {MONTHS[lang][row.month - 1]}
                    </th>
                    <td className="py-1.5 pr-3 text-right tabular-nums">
                      {amount(row.agreements, lang)}
                    </td>
                    <td className="py-1.5 text-right tabular-nums">
                      {row.employees > 0 ? amount(row.employees, lang) : "¤"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export function ExpiryReportView({ report, lang }: { report: ExpiryReport; lang: Lang }) {
  const t = dictionary(lang).rapporter.expiry;

  const peak = Math.max(
    1,
    ...report.all.months.map((m) => m.agreements),
    ...report.confederation.months.map((m) => m.agreements),
    ...report.byEmployerGroup.flatMap((g) => g.months.map((m) => m.agreements)),
  );

  return (
    <Panel title={t.title(report.year)} tags={["FR-005", "FA-015"]}>
      <p className="mb-2 max-w-4xl text-table">{t.intro}</p>
      <p className="mb-6 max-w-4xl text-label text-muted-foreground">{t.onlyCurrent}</p>

      <div className="grid grid-cols-1 gap-8 @5xl:grid-cols-2">
        <Section section={report.all} heading={t.allSectors} lang={lang} peak={peak} />
        <Section
          section={report.confederation}
          heading={t.confederation}
          lang={lang}
          peak={peak}
        />
      </div>

      {report.byEmployerGroup.length > 0 && (
        <div className="mt-8 border-t border-border pt-6">
          <h3 className="font-display text-section font-semibold">{t.byGroup}</h3>
          <p className="mt-1 max-w-4xl text-label text-muted-foreground">{t.byGroupNote}</p>
          <div className="mt-5 grid grid-cols-1 gap-8 @5xl:grid-cols-2">
            {report.byEmployerGroup.map((group) => (
              <Section
                key={group.group}
                section={group}
                heading={group.group ?? ""}
                lang={lang}
                peak={peak}
              />
            ))}
          </div>
        </div>
      )}

      <Rationale>{t.derivedNote}</Rationale>
    </Panel>
  );
}
