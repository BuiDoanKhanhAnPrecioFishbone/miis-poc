"use client";

import type { Lang } from "@/lib/domain/lang";
import type { MediatorRelease, MediatorReleaseDocument } from "@/lib/domain/report";
import { dictionary } from "@/lib/i18n";
import { IconDocument } from "./icons";
import { Callout, Panel } from "./primitives";

/**
 * *Avtal – Medlare* — Bilaga F Rapport 5, specified in Bilaga 3 §7.4.
 *
 * This report used to be `{ kind: "screen", href: "/avtal" }`, which was wrong
 * for the one role it exists for: §3.1 gives Medlare *"Specifika rapporter"*
 * and a menu of Start and Rapporter, so the picker was offering a report whose
 * only outcome was the authorisation notice. A report a role may run has to
 * produce something that role may read.
 *
 * Four sections, in §7.4's own order — *Protokoll*, *Avtal*,
 * *Medlingshandlingar*, *Övriga avtal som arbetsgivaren tecknar* — each sorted
 * by file name, as the manual specifies. The last one is the section that makes
 * the report worth running: a mediator walking into a dispute needs to know what
 * else that employer organisation has already settled, and at what.
 *
 * *"Sekretess- och GDPR-markerad information visas ej"* heads MI's own page.
 * Applied in the domain, so a marked agreement produces **no release at all**
 * rather than a release with blanks in it.
 */

function DocumentList({
  documents,
  emptyText,
}: {
  documents: MediatorReleaseDocument[];
  emptyText: string;
}) {
  if (documents.length === 0) {
    return <p className="text-table text-muted-foreground">{emptyText}</p>;
  }
  return (
    <ul className="space-y-2">
      {documents.map((d) => (
        <li key={d.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-table">
          <span className="flex items-center gap-2">
            <IconDocument aria-hidden />
            {d.fileName}
          </span>
          <span className="text-label tabular-nums text-muted-foreground">{d.uploadedDate}</span>
        </li>
      ))}
    </ul>
  );
}

export function MediatorReleaseView({
  release,
  lang,
  notReleasable,
}: {
  release: MediatorRelease | null;
  lang: Lang;
  /** Why nothing was produced — no agreement chosen, or one that may not be released. */
  notReleasable: string;
}) {
  const d = dictionary(lang);
  const t = d.rapporter.mediatorRelease;

  if (!release) {
    return (
      <Panel title={t.title} tags={["FR-011", "D-002"]}>
        <Callout tone="attention" label={t.notReleasableLabel}>
          {notReleasable}
        </Callout>
      </Panel>
    );
  }

  const period =
    release.validFrom && release.validTo
      ? `${release.validFrom} – ${release.validTo}`
      : (release.validTo ?? d.common.none);

  return (
    <Panel title={t.title} tags={["FR-011", "D-002", "FM-003"]}>
      {/* MI's own page opens with this sentence, so this one does too. */}
      <p className="mb-4 max-w-4xl text-label text-muted-foreground">{t.confidentialityNote}</p>

      <h3 className="font-display text-section font-semibold">{release.name}</h3>
      <dl className="mt-3 grid grid-cols-1 gap-x-8 gap-y-3 @xl:grid-cols-2">
        {[
          [t.employerOrg, release.employerOrg],
          [t.employeeOrg, release.employeeOrg],
          [t.signedDate, release.signedDate ?? d.common.none],
          [t.period, period],
        ].map(([label, value]) => (
          <div key={label} className="border-b border-border pb-2">
            <dt className="text-label font-bold">{label}</dt>
            <dd className="mt-0.5 text-table tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>

      {/* FA-015 and FA-016 — what a mediator most needs to know about a period. */}
      {(release.expiresWithoutRenewal || release.earlyTermination) && (
        <div className="mt-4 space-y-2">
          {release.expiresWithoutRenewal && (
            <Callout tone="attention" tags={["FA-015"]}>
              {t.expires}
            </Callout>
          )}
          {release.earlyTermination && (
            <Callout tone="attention" tags={["FA-016"]}>
              {t.earlyTermination}: {release.earlyTermination.date} ·{" "}
              {release.earlyTermination.party}
            </Callout>
          )}
        </div>
      )}

      <div className="mt-6 space-y-6">
        <section>
          <h3 className="font-display text-section font-semibold">{t.protocols}</h3>
          <div className="mt-2">
            <DocumentList documents={release.protocols} emptyText={t.noDocuments} />
          </div>
        </section>

        <section>
          <h3 className="font-display text-section font-semibold">{t.agreementFiles}</h3>
          <div className="mt-2">
            <DocumentList documents={release.agreementFiles} emptyText={t.noDocuments} />
          </div>
        </section>

        <section>
          <h3 className="font-display text-section font-semibold">{t.mediationFiles}</h3>
          <div className="mt-2">
            <DocumentList documents={release.mediationFiles} emptyText={t.noDocuments} />
          </div>
        </section>

        <section>
          <h3 className="font-display text-section font-semibold">{t.otherAgreements}</h3>
          <p className="mt-1 max-w-4xl text-label text-muted-foreground">{t.otherAgreementsNote}</p>
          {release.otherAgreements.length === 0 ? (
            <p className="mt-2 text-table text-muted-foreground">{t.noOtherAgreements}</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {release.otherAgreements.map((a) => (
                <li key={a.id} className="border-b border-border pb-2 text-table">
                  <span className="font-semibold">{a.employeeOrg}</span> · {a.name}
                  <span className="ml-2 tabular-nums text-muted-foreground">{a.validity}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Panel>
  );
}
