import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { IconBack } from "@/components/miis/icons";
import { PrintHeader } from "@/components/miis/Print";
import { PublicAgreementActions } from "@/components/miis/PublicAgreementActions";
import { PublicShell } from "@/components/miis/PublicShell";
import { Callout, Field, FormGrid, PageHeading, Panel, Rationale,
  EmptyState,
} from "@/components/miis/primitives";
import { getPublicAgreement } from "@/lib/data/public";
import { accessLevel } from "@/lib/domain/role";
import { getSession } from "@/lib/session";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const [{ id }, { i18n, lang }] = await Promise.all([params, getSession()]);
  const agreement = await getPublicAgreement(id, lang);
  const title = agreement ? agreement.title : i18n.allmanheten.title;
  return { title: `${i18n.common.appName} – ${title}` };
}

/**
 * One agreement, as it is released to the public — Bilaga F's Rapport 1.
 *
 * Bilaga 2 §3.5's Scenario 3 has four bullets, and two of them had no screen:
 * *"tar del av information om avtalet"* and *"öppnar och laddar ned avtal"*.
 * The register listed agreements and the rows were not links, so the scenario
 * stopped at the search.
 *
 * It is outside the `(miis)` route group and uses `PublicShell`, like the
 * register it is reached from: NFÅ-006 puts this role on a whitelisted machine
 * in MI's own premises with no sign-in, so there is no menu and no session.
 *
 * **What is on it is Rapport 1's own list** — parties, agreement area, the
 * validity periods, termination and prolongation, and the linked protocols —
 * and nothing else. No wage figures, no cost frame, no working groups: those are
 * MI's working record, and this is the release.
 *
 * A confidentiality-marked agreement never reaches here. `getPublicAgreement`
 * returns null for one, so the page 404s rather than rendering a shell with
 * the values missing (D-002, FR-011).
 */
export default async function PublicAgreementPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ id }, session, query] = await Promise.all([params, getSession(), searchParams]);
  const { i18n, lang } = session;
  /* An officer who followed *Avtal – Allmänheten* here needs the way back; the
     public view has no menu, which is deliberate and is why this is a prop. */
  const fromReport = query["fran"] === "rapport";
  /*
    Where the visitor came from, and whether they may go back there. The public
    computer answers `none` to both and keeps the plain return to the register.
  */
  const fromAgreement =
    query["fran"] === "avtal" && accessLevel(session.role, "avtal") !== "none";
  const agreement = await getPublicAgreement(id, lang);
  if (!agreement) notFound();

  const t = i18n.allmanheten.detail;

  return (
    <PublicShell
      walkthrough={session.walkthrough}
      lang={lang}
      dataset={session.dataset}
      role={session.role.id}
      reqTags={session.reqTags}
      {...(fromReport && accessLevel(session.role, "rapporter") !== "none"
        ? { back: { href: "/rapporter", label: i18n.allmanheten.backToReport } }
        : {})}
    >
      <PrintHeader lang={lang} />
      <PageHeading
        title={agreement.title}
        subtitle={t.subtitle}
        tags={["FR-011", "D-002", "NFÅ-006"]}
        back={
          /*
            One control, pointing where the reader actually came from. It was
            hard-coded to the public register, so an officer arriving from their
            own agreement was offered a way back to a screen they had never
            been on.
          */
          <Link
            href={fromAgreement ? `/avtal/${id}` : "/allmanheten"}
            className="inline-flex min-h-11 items-center gap-1 text-label font-semibold text-primary underline underline-offset-2"
          >
            <IconBack />{" "}
            {fromAgreement
              ? i18n.common.backTo(i18n.allmanheten.backToAgreement)
              : i18n.common.backTo(i18n.allmanheten.title)}
          </Link>
        }
        action={<PublicAgreementActions agreement={agreement} lang={lang} />}
      />

      <div className="space-y-5">
        <Panel title={t.heading} tags={["FR-011"]}>
          <div className="@container/form">
            <FormGrid>
              <Field label={t.name} value={agreement.name} width="full" />
              <Field label={t.area} value={agreement.agreementArea} width="medium" />
              <Field label={t.type} value={agreement.agreementType} width="medium" />
              <Field label={t.employerOrg} value={agreement.employerOrg} width="medium" />
              <Field label={t.employeeOrg} value={agreement.employeeOrg} width="medium" />
              <Field
                label={t.industryCode}
                value={agreement.industryCode ?? i18n.common.none}
                width="medium"
              />
              <Field
                label={t.signedDate}
                value={agreement.signedDate ?? i18n.common.none}
                width="short"
              />
              <Field label={t.validity} value={agreement.validity} width="medium" />
            </FormGrid>
          </div>
        </Panel>

        {/* *Löptider för löneavtal* — one row per bargaining round, newest first. */}
        <Panel title={t.periods} tags={["FA-002", "FA-003"]}>
          <p className="mb-3 max-w-4xl text-table">{t.periodsIntro}</p>
          {agreement.periods.length === 0 ? (
            <EmptyState text={t.noPeriods} />
          ) : (
            <ul className="divide-y divide-border">
              {agreement.periods.map((p) => (
                <li key={p.label} className="flex flex-wrap gap-x-6 gap-y-1 py-2.5 text-table">
                  <span className="font-semibold">{p.label}</span>
                  <span className="tabular-nums">
                    <span className="whitespace-nowrap">{p.validFrom}</span> –{" "}
                    <span className="whitespace-nowrap">{p.validTo}</span>
                  </span>
                  {p.signedDate && (
                    <span className="tabular-nums text-muted-foreground">
                      {t.signedOn(p.signedDate)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* Uppsägning och prolongering — Rapport 1 names both. */}
        <Panel title={t.lifecycle} tags={["FA-015", "FA-016"]}>
          {agreement.expiresWithoutRenewal || agreement.earlyTermination ? (
            <div className="space-y-3">
              {agreement.expiresWithoutRenewal && (
                <Callout tone="attention" tags={["FA-015"]}>
                  {t.expires}
                </Callout>
              )}
              {agreement.earlyTermination && (
                <Callout tone="attention" tags={["FA-016"]}>
                  {t.earlyTermination}: {agreement.earlyTermination.date} ·{" "}
                  {agreement.earlyTermination.party}
                </Callout>
              )}
            </div>
          ) : (
            <EmptyState text={t.noLifecycle} />
          )}
        </Panel>

        <Panel title={t.documents} tags={["FR-011", "FD-001"]}>
          <p className="mb-3 max-w-4xl text-table">{t.documentsIntro}</p>
          {agreement.documents.length === 0 ? (
            <EmptyState text={t.noDocuments} />
          ) : (
            <ul className="divide-y divide-border">
              {agreement.documents.map((doc) => (
                <li key={doc.id} className="flex flex-wrap gap-x-4 gap-y-1 py-2.5 text-table">
                  <span className="min-w-0 break-all font-semibold">{doc.fileName}</span>
                  <span className="tabular-nums text-muted-foreground">{doc.uploadedDate}</span>
                </li>
              ))}
            </ul>
          )}
          <Rationale>{t.documentsNote}</Rationale>
        </Panel>
      </div>
    </PublicShell>
  );
}
