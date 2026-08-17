/**
 * Volume generator, for seeing how a screen behaves with realistic amounts of
 * data — table density, scrolling, pagination.
 *
 * Deterministic on purpose: the same call always produces the same records, so
 * server and client render identically and screenshots are comparable between
 * runs. No Math.random anywhere.
 */

import type { Agreement, ReportSelection } from "@/lib/domain/agreement";
import type { AuditEvent, Reminder } from "@/lib/domain/event";
import { EMPLOYEE_ORGS, EMPLOYER_ORGS } from "./parties";

const AREAS = [
  "Handel",
  "Byggverksamhet",
  "Vård och omsorg",
  "Transport",
  "Livsmedel",
  "Teknikinstallation",
  "IT och telekom",
  "Energi",
  "Hotell och restaurang",
  "Skola och utbildning",
  "Bemanning",
  "Fastighetsservice",
  "Kultur och media",
  "Finans och försäkring",
  "Lantbruk",
];

const QUALIFIERS = ["", " – tjänstemän", " – arbetare", " – riksavtal", " – storstadsregioner"];

const REPORTS: ReportSelection = {
  eurofound: false,
  minimumWage: false,
  website: true,
  shortTermWageReport: true,
};

/** Two-digit day/month strings, so generated dates are always valid. */
function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * @param count how many agreements to produce
 * @param startIndex offset for ids, so generated records never collide with
 *        the hand-written ones (which use A-001…A-0nn)
 */
export function generateAgreements(count: number, startIndex = 100): Agreement[] {
  const out: Agreement[] = [];

  for (let i = 0; i < count; i++) {
    const employerOrg = EMPLOYER_ORGS[i % EMPLOYER_ORGS.length]!;
    const employeeOrg = EMPLOYEE_ORGS[(i * 3) % EMPLOYEE_ORGS.length]!;
    const area = AREAS[i % AREAS.length]!;
    const qualifier = QUALIFIERS[Math.floor(i / AREAS.length) % QUALIFIERS.length]!;

    // Spread signing dates across the bargaining round, and leave every fourth
    // agreement unsigned so the status colours vary.
    const month = (i % 12) + 1;
    const day = (i % 27) + 1;
    const signed = i % 4 !== 0;
    const incomplete = i % 7 === 0;
    const mediation = i % 11 === 0;

    out.push({
      id: `A-${startIndex + i}`,
      agreementArea: area,
      name: `${area}${qualifier}`,
      employerOrg,
      employeeOrg,
      agreementType: "Löneavtal + Allmänna villkor",
      registrationStatus: incomplete ? "incomplete" : "complete",
      confidential: i % 13 === 0,
      reportSelection: REPORTS,
      ...(mediation ? { mediationLinked: true } : {}),
      ...(signed
        ? {
            signedDate: `2027-${pad(month)}-${pad(day)}`,
            validFrom: `2027-${pad(month)}-01`,
            validTo: `2029-${pad(month)}-28`,
          }
        : { validTo: `2027-${pad(month)}-28` }),
      registeredAt: `2027-${pad(month)}-${pad(day)}`,
    });
  }

  return out;
}

export function generateReminders(count: number, agreements: Agreement[]): Reminder[] {
  return Array.from({ length: count }, (_, i) => {
    const agreement = agreements[i % agreements.length]!;
    return {
      id: `PM-G${i}`,
      date: `2027-${pad((i % 12) + 1)}-${pad((i % 27) + 1)}`,
      text: {
        sv: `Komplettera ${agreement.name}`,
        en: `Complete ${agreement.name}`,
      },
      agreementId: agreement.id,
    };
  });
}

export function generateEvents(count: number, agreements: Agreement[]): AuditEvent[] {
  return Array.from({ length: count }, (_, i) => {
    const agreement = agreements[i % agreements.length]!;
    const signed = i % 2 === 0;
    return {
      id: `H-G${i}`,
      timestamp: `2027-${pad((i % 12) + 1)}-${pad((i % 27) + 1)} ${pad(8 + (i % 9))}:${pad((i * 7) % 60)}`,
      type: signed ? "agreement-signed" : "mediation-started",
      detail: agreement.name,
      agreementId: agreement.id,
      color: signed ? "green" : "red",
    };
  });
}
