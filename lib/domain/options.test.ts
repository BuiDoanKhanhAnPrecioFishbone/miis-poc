import { describe, expect, it } from "vitest";

import {
  INFO_TYPES,
  SEARCH_FIELDS_BY_TYPE,
  defaultValueFor,
  fieldsForInfoType,
  searchField,
  type InfoTypeId,
} from "./options";

const TYPES = INFO_TYPES.map((t) => t.id as InfoTypeId);

/**
 * FR-002's *val av informationstyp*.
 *
 * The tab strip set a state variable nothing read: four tabs, one population,
 * one column set, no difference between them. Choosing an information type is
 * choosing **which register is searched**, so each type has to bring criteria
 * of its own — and a shared field list would be the same dead control one level
 * down, offering Avtalskonstruktion to a search over the party register.
 */
describe("fieldsForInfoType — FR-002", () => {
  it("covers every information type the tab strip offers", () => {
    expect(TYPES).toHaveLength(4);
    for (const type of TYPES) {
      expect(SEARCH_FIELDS_BY_TYPE[type]).toBeDefined();
    }
  });

  it("gives every type at least one criterion, so no tab opens on nothing", () => {
    for (const type of TYPES) {
      expect(fieldsForInfoType(type).length).toBeGreaterThan(0);
    }
  });

  /*
    No field is shared. `sector` exists under two ids on purpose — an
    agreement's sector comes from the agreement, a party's from FP-001's own
    link — because a criterion that survived the switch would keep its word and
    change its subject.
  */
  it("shares no field id between two information types", () => {
    const seen = new Map<string, InfoTypeId>();
    for (const type of TYPES) {
      for (const field of fieldsForInfoType(type)) {
        expect(seen.get(field.id)).toBeUndefined();
        seen.set(field.id, type);
      }
    }
  });

  it("resolves every field id back to its own definition", () => {
    for (const type of TYPES) {
      for (const field of fieldsForInfoType(type)) {
        expect(searchField(field.id).id).toBe(field.id);
      }
    }
  });

  /* Every field has to be able to open with a value the row can be compared
     against, or the first condition on a fresh tab matches nothing. */
  it("gives every field an operator and an opening value", () => {
    for (const type of TYPES) {
      for (const field of fieldsForInfoType(type)) {
        expect(field.operators.length).toBeGreaterThan(0);
        expect(defaultValueFor(field)).not.toBe("");
      }
    }
  });

  /* The bokslut is a property of a period, and only agreements have one. */
  it("puts the point-in-time criterion only where the rows have periods", () => {
    const withValidAt = TYPES.filter((t) =>
      fieldsForInfoType(t).some((f) => f.id === "validAt"),
    );
    expect(withValidAt).toEqual(["agreements"]);
  });
});
