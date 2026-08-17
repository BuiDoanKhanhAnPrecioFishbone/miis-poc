/**
 * Data access for mediation — THE SEAM.
 *
 * The linked-agreement list is derived from the case's agreementIds, so a case
 * and its display never drift apart.
 */

import { agreementTitle, validityLabel, type Agreement } from "@/lib/domain/agreement";
import { agreementStatus, type StatusInfo } from "@/lib/domain/status";
import type { AuditEvent } from "@/lib/domain/event";
import { DEFAULT_LANG, type Lang } from "@/lib/domain/lang";
import type { MediationCase, Mediator } from "@/lib/domain/mediation";
import { getDataset } from "@/lib/mock";
import { activeDataset } from "@/lib/session";

export interface LinkedAgreement {
  id: string;
  /** "Spårtrafik – Tågföretagen/Seko" */
  name: string;
  /** "Kvarstående, utlöper 2027-04-30" */
  validity: string;
  /**
   * FR-012, derived from the agreement rather than assumed from the case.
   * A case being open does not make its agreements *signed* — an unsigned one
   * linked to mediation is "kvarstående, kopplat till medling", still red. The
   * view used to hardcode "tecknat efter medling", which labelled the same
   * agreement differently here than in every agreement table.
   */
  status: StatusInfo;
}

export interface MediationCaseDetail {
  mediationCase: MediationCase;
  linkedAgreements: LinkedAgreement[];
  events: AuditEvent[];
}

export async function listMediationCases(): Promise<MediationCase[]> {
  return getDataset(await activeDataset()).mediationCases;
}

export async function listOngoingMediationCases(): Promise<MediationCase[]> {
  return (await listMediationCases()).filter((c) => c.ongoing);
}

export async function getMediationCase(
  id: string,
  lang: Lang = DEFAULT_LANG,
): Promise<MediationCaseDetail | null> {
  const data = getDataset(await activeDataset());
  const mediationCase = data.mediationCases.find((c) => c.id === id);
  if (!mediationCase) return null;

  const byId = new Map<string, Agreement>(data.agreements.map((a) => [a.id, a]));

  return {
    mediationCase,
    linkedAgreements: mediationCase.agreementIds.flatMap((agreementId) => {
      const agreement = byId.get(agreementId);
      // Integrity is asserted at build time, so this cannot be missing —
      // flatMap keeps the type honest without a non-null assertion.
      return agreement
        ? [
            {
              id: agreement.id,
              name: agreementTitle(agreement),
              validity: validityLabel(agreement, lang),
              status: agreementStatus(agreement, lang),
            },
          ]
        : [];
    }),
    events: data.mediationEvents.filter((e) =>
      mediationCase.agreementIds.includes(e.agreementId ?? ""),
    ),
  };
}

export async function listMediators(): Promise<Mediator[]> {
  return getDataset(await activeDataset()).mediators;
}

export async function getMediator(id: string): Promise<Mediator | null> {
  return (await listMediators()).find((m) => m.id === id) ?? null;
}
