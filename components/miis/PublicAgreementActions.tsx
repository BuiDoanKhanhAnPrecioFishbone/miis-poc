"use client";

import type { Lang } from "@/lib/domain/lang";
import type { PublicAgreement } from "@/lib/data/public";
import { dictionary } from "@/lib/i18n";
import { IconDocument, IconPrint } from "./icons";
import { Button, Rationale } from "./primitives";

/**
 * *Öppnar och laddar ned avtal* — Bilaga 2 §3.5, Scenario 3's last bullet.
 *
 * Two exports, and both of them run. That matters more here than anywhere else
 * in the prototype: this is the one role whose whole task ends in taking the
 * answer away, and a dashed button would end the scored scenario on a control
 * that does nothing.
 *
 * **Print** produces MI's own document — the `@media print` rules give it the
 * letterhead and an *Utskriftsdatum* and drop the chrome, and every browser can
 * save that as PDF. **Download** writes a real file from the record on screen,
 * client-side, so it works with no server behind it (FR-013's structured
 * export, at the scale one agreement needs).
 *
 * What is deliberately *not* offered is a download of the protocol PDF itself.
 * Those files live in a document archive the mockup does not have, and a button
 * that produced an empty or invented PDF would be worse than one that explains
 * where the file comes from. The file names and dates are listed instead, which
 * is what Bilaga F's Rapport 1 prints.
 */

/** CSV, not JSON: a visitor at a public computer opens it in Excel. */
function toCsv(agreement: PublicAgreement, labels: Record<string, string>): string {
  const rows: [string, string][] = [
    [labels.name!, agreement.name],
    [labels.area!, agreement.agreementArea],
    [labels.type!, agreement.agreementType],
    [labels.employerOrg!, agreement.employerOrg],
    [labels.employeeOrg!, agreement.employeeOrg],
    [labels.industryCode!, agreement.industryCode ?? ""],
    [labels.signedDate!, agreement.signedDate ?? ""],
    [labels.validity!, agreement.validity],
    ...agreement.periods.map(
      (p): [string, string] => [`${labels.period!} ${p.label}`, `${p.validFrom} – ${p.validTo}`],
    ),
    ...agreement.documents.map((doc): [string, string] => [labels.document!, doc.fileName]),
  ];

  /* Semicolon-separated and BOM-prefixed: Excel in a Swedish locale reads a
     comma as a decimal separator and UTF-8 as Latin-1 without both. */
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return `﻿${rows.map(([k, v]) => `${escape(k)};${escape(v)}`).join("\r\n")}\r\n`;
}

export function PublicAgreementActions({
  agreement,
  lang,
}: {
  agreement: PublicAgreement;
  lang: Lang;
}) {
  const d = dictionary(lang);
  const t = d.allmanheten.detail;

  function download() {
    const csv = toCsv(agreement, {
      name: t.name,
      area: t.area,
      type: t.type,
      employerOrg: t.employerOrg,
      employeeOrg: t.employeeOrg,
      industryCode: t.industryCode,
      signedDate: t.signedDate,
      validity: t.validity,
      period: t.period,
      document: t.document,
    });
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${agreement.id}-${agreement.name.replace(/[^\w\-åäöÅÄÖ]+/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="print-hide">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" onClick={() => window.print()} iconStart={<IconPrint />}>
          {t.print}
        </Button>
        <Button variant="secondary" onClick={download} iconStart={<IconDocument />}>
          {t.download}
        </Button>
      </div>
      <Rationale>{t.exportNote}</Rationale>
    </div>
  );
}
