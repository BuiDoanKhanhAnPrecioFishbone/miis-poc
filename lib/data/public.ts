/**
 * What the public computer may be shown about one agreement — THE SEAM.
 *
 * Bilaga 2 §3.5, Scenario 3: *"Tar del av information om avtalet. Öppnar och
 * laddar ned avtal."* The public view was a table and nothing behind it, so two
 * of that scenario's four bullets had no screen at all.
 *
 * The content is Bilaga F's **Rapport 1, Avtal – Allmänheten**, in MI's own
 * words: *"parter, avtalsområde, löptider för löneavtal och allmänna villkor,
 * uppsägning, prolongering och länkade protokoll. Sekretessmarkerad information
 * utelämnas."*
 *
 * **A marked agreement returns null**, and that is D-002 read strictly. The row
 * stays in the register — the visitor must not be told the agreement does not
 * exist — but the detail is not assembled at all, so it cannot be rendered and
 * then hidden. FR-011 is about what may leave the building.
 */

import {
  agreementTitle,
  isPublished,
  partiesLabel,
  validityLabel,
} from "@/lib/domain/agreement";
import type { Lang } from "@/lib/domain/lang";
import { agreements } from "./agreements";
import { getDataset } from "@/lib/mock";
import { PARTY_REGISTER } from "@/lib/mock/party-register";
import { activeDataset } from "@/lib/session";

export interface PublicDocument {
  id: string;
  fileName: string;
  uploadedDate: string;
}

export interface PublicPeriod {
  /** *Löneavtal 2027–2029* — which round the period belongs to. */
  label: string;
  validFrom: string;
  validTo: string;
  signedDate?: string;
}

export interface PublicAgreement {
  id: string;
  title: string;
  name: string;
  agreementArea: string;
  agreementType: string;
  parties: string;
  employerOrg: string;
  employeeOrg: string;
  industryCode?: string;
  validity: string;
  signedDate?: string;
  /** FA-015 / FA-016 — what a visitor asking "does this still apply" needs. */
  expiresWithoutRenewal: boolean;
  earlyTermination?: { date: string; party: string };
  periods: PublicPeriod[];
  documents: PublicDocument[];
}

export async function getPublicAgreement(id: string, lang: Lang): Promise<PublicAgreement | null> {
  const [all, data] = await Promise.all([agreements(), activeDataset().then(getDataset)]);
  const a = all.find((x) => x.id === id);
  if (!a) return null;

  /*
    Published and not marked. D-002 keeps a sekretessmarkerat agreement out, and
    `isPublished` keeps out one MI has not released — a half-registered record
    reaching the public computer would be MI publishing a draft. Assembled or
    not assembled, never assembled and then withheld.
  */
  if (!isPublished(a)) return null;

  /* The industry code lives on the party (FP-001), not on the agreement. */
  const employer = PARTY_REGISTER.find((p) => p.name === a.employerOrg.name);

  return {
    id: a.id,
    title: agreementTitle(a),
    name: a.name,
    agreementArea: a.agreementArea,
    agreementType: a.agreementType,
    parties: partiesLabel(a),
    employerOrg: a.employerOrg.name,
    employeeOrg: a.employeeOrg.name,
    ...(employer?.industryCode ? { industryCode: employer.industryCode } : {}),
    validity: validityLabel(a, lang),
    ...(a.signedDate ? { signedDate: a.signedDate } : {}),
    expiresWithoutRenewal: a.expiresWithoutRenewal === true,
    ...(a.earlyTermination ? { earlyTermination: a.earlyTermination } : {}),
    /*
      *Löptider för löneavtal* — one period per bargaining round, newest first.
      The wage figures are **not** here: Rapport 1 lists periods, and a cost
      frame is not something MI publishes to a visitor at the public computer.
    */
    periods: data.wageAgreements
      .filter((w) => w.agreementId === a.id)
      .sort((x, y) => y.validFrom.localeCompare(x.validFrom))
      .map((w) => ({
        label: `${w.validFrom.slice(0, 4)}–${w.validTo.slice(0, 4)}`,
        validFrom: w.validFrom,
        validTo: w.validTo,
        ...(w.signedDate ? { signedDate: w.signedDate } : {}),
      })),
    /*
      *Länkade protokoll*. Only the protocol and the agreement print — a
      Director-General's decision and a mediator's report belong to a mediation
      case, and §5.1 releases those to mediators rather than to the public.
    */
    documents: data.documents
      .filter(
        (doc) =>
          doc.agreementId === a.id && (doc.type === "protocol" || doc.type === "agreement"),
      )
      .map((doc) => ({ id: doc.id, fileName: doc.fileName, uploadedDate: doc.uploadedDate }))
      .sort((x, y) => x.fileName.localeCompare(y.fileName, "sv")),
  };
}

/**
 * The agreements the public register lists.
 *
 * The same rule as the detail — publication is what makes a record public, and
 * `lib/data/` is where the two halves meet, so the page cannot forget one.
 */
export async function listPublicAgreements() {
  return (await agreements()).filter((a) => isPublished(a));
}
