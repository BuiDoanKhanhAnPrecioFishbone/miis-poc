/**
 * What a visitor at Medlingsinstitutet's public computer can look for — FR-001,
 * FR-003, FR-011 and US-14.
 *
 * The public view had a selection that selected nothing: three dropdowns with no
 * state behind them, two disabled buttons, and a table that showed every
 * agreement whatever was chosen. On the one role the scored criterion names,
 * the primary control was a picture of a control.
 *
 * **Free text is the primary way in, and the three criteria are the precise
 * one.** A visitor's question is almost always a word — an agreement area, a
 * union, an employer — and Bilaga 3 §4.1 records that MI's current public
 * interface offers free-text search alongside the report. The three dropdowns
 * are MI's own criteria for *Avtal – Allmänheten* (Bilaga F, Rapport 1) and stay
 * for the visitor who knows exactly which agreement they want.
 *
 * **`validAt` is FA-020 applied to the public view.** *"Visa avtalet som det
 * gällde vid ett angivet datum"* is a real question for a visitor checking what
 * applied in a past year, and it is a filter on the period rather than a
 * different version of the record — the prototype holds one version per
 * agreement, and this narrows to the agreements whose period covers the date.
 *
 * **Nothing here decides what may be *shown*.** Confidentiality is
 * `maySeeConfidential` in `role.ts` and is applied where the value is rendered:
 * a marked agreement is still found, still listed and still counted (D-002), and
 * what is withheld is its detail. Filtering it out of the result would be a
 * different and wrong answer — it would tell the visitor the agreement does not
 * exist.
 *
 * Pure domain — no React, no data access, no I/O.
 */

export interface PublicSearchCriteria {
  /** FR-003. Matched case-insensitively against name, area and both parties. */
  text?: string;
  /** Bilaga F, Rapport 1 — the three criteria MI's own selection screen offers. */
  employerOrgId?: string;
  employeeOrgId?: string;
  agreementId?: string;
  /**
   * Bransch — and MI names it **first** in Bilaga 2 §3.5's Scenario 3:
   * *"söker fram ett kollektivavtal utifrån exempelvis bransch, avtalsområde
   * eller annan relevant sökparameter."*
   *
   * It is the employer organisation's SNI code (FP-001), so it lives on the
   * party and is joined onto the searchable record rather than stored on the
   * agreement. A visitor thinks in industries — *telecom*, *steel* — long before
   * they think in employer organisations, which is why MI put it first and why
   * offering only AGO/ATO/avtal made the precise criteria useless to anyone who
   * did not already know the answer.
   */
  industryCode?: string;
  /** FA-020 — narrow to agreements whose period covers this date. */
  validAt?: string;
}

/** The fields of an agreement a public search may read. */
export interface PublicSearchable {
  id: string;
  name: string;
  agreementArea: string;
  employerOrg: { id: string; name: string };
  employeeOrg: { id: string; name: string };
  /** The employer organisation's SNI code, joined on in `lib/data/`. */
  industryCode?: string;
  validFrom?: string;
  validTo?: string;
}

/**
 * Whether an agreement's period covers a date.
 *
 * An open end counts as covering — an agreement registered without a `validTo`
 * is one MI has not been told has ended, which is not the same as one that has.
 * An agreement with no period at all is *kvarstående*: it has not been renewed,
 * and excluding it would hide exactly the case a visitor asking "what applies
 * now" most needs to see.
 */
export function coversDate(a: Pick<PublicSearchable, "validFrom" | "validTo">, date: string): boolean {
  if (!a.validFrom && !a.validTo) return true;
  if (a.validFrom && date < a.validFrom) return false;
  if (a.validTo && date > a.validTo) return false;
  return true;
}

/**
 * Free text against the four things a visitor knows an agreement by.
 *
 * Deliberately not a match on every field: searching the whole record would let
 * a query hit a value the visitor cannot see on the row, which is confusing at
 * best and, on a confidentiality-marked agreement, a way of confirming a
 * withheld value by guessing it.
 */
export function matchesText(a: PublicSearchable, query: string): boolean {
  const q = query.trim().toLocaleLowerCase("sv");
  if (!q) return true;
  return [
    a.name,
    a.agreementArea,
    a.employerOrg.name,
    a.employeeOrg.name,
    /* The industry code reads "61 Telekommunikation", so free text finds an
       industry by its word as well as by the dropdown. */
    a.industryCode ?? "",
  ].some((field) => field.toLocaleLowerCase("sv").includes(q));
}

export function publicSearch<T extends PublicSearchable>(
  agreements: readonly T[],
  criteria: PublicSearchCriteria,
): T[] {
  return agreements.filter((a) => {
    if (criteria.employerOrgId && a.employerOrg.id !== criteria.employerOrgId) return false;
    if (criteria.employeeOrgId && a.employeeOrg.id !== criteria.employeeOrgId) return false;
    if (criteria.agreementId && a.id !== criteria.agreementId) return false;
    if (criteria.industryCode && a.industryCode !== criteria.industryCode) return false;
    if (criteria.validAt && !coversDate(a, criteria.validAt)) return false;
    if (criteria.text && !matchesText(a, criteria.text)) return false;
    return true;
  });
}

/** Whether anything was narrowed — what the result heading and the chips read from. */
export function hasCriteria(criteria: PublicSearchCriteria): boolean {
  return Boolean(
    criteria.text?.trim() ||
      criteria.employerOrgId ||
      criteria.employeeOrgId ||
      criteria.agreementId ||
      criteria.industryCode ||
      criteria.validAt,
  );
}
