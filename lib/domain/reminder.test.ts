import { describe, expect, it } from "vitest";

import {
  clearReminder,
  decodeReminders,
  encodeReminders,
  reminderFor,
  setReminder,
  type SetReminder,
} from "./reminder";

const one: SetReminder = {
  agreementId: "A-005",
  date: "2027-09-30",
  name: "Kommunikation",
};

describe("setReminder — FA-022's marking", () => {
  it("adds a reminder to an agreement that has none", () => {
    expect(setReminder([], one)).toEqual([one]);
  });

  /*
    FA-022 marks *an agreement* at *a date*, singular on both sides. A second
    reminder on the same agreement would mean the first was wrong, not that
    there are now two — and the screen offers *Ändra* rather than *Lägg till*.
  */
  it("replaces rather than duplicates on the same agreement", () => {
    const later = { ...one, date: "2027-11-30" };
    const out = setReminder([one], later);
    expect(out).toHaveLength(1);
    expect(out[0]!.date).toBe("2027-11-30");
  });

  it("keeps reminders on other agreements", () => {
    const other: SetReminder = { agreementId: "A-006", date: "2027-10-01", name: "Spel" };
    expect(setReminder([one], other)).toHaveLength(2);
  });

  /* A date is the requirement's own *visst datum*; without one there is no
     marking to make, and an empty string would encode as a record that decodes
     back into a reminder with no date. */
  it("refuses a reminder with no date", () => {
    expect(setReminder([], { ...one, date: "" })).toEqual([]);
  });

  it("removes one by agreement", () => {
    expect(clearReminder([one], "A-005")).toEqual([]);
    expect(clearReminder([one], "A-999")).toEqual([one]);
  });

  it("finds the reminder on an agreement", () => {
    expect(reminderFor([one], "A-005")).toEqual(one);
    expect(reminderFor([one], "A-999")).toBeUndefined();
  });
});

describe("the cookie round-trip", () => {
  it("survives encoding and decoding", () => {
    const list = [one, { agreementId: "A-006", date: "2027-10-01", name: "Spel" }];
    expect(decodeReminders(encodeReminders(list))).toEqual(list);
  });

  /* A malformed cookie must degrade to "no reminders" rather than throw: this
     is read during a server render, and an exception there is a 500 on the
     start page because somebody edited a cookie. */
  it("degrades to nothing on rubbish", () => {
    expect(decodeReminders(undefined)).toEqual([]);
    expect(decodeReminders("")).toEqual([]);
    expect(decodeReminders("%%%")).toEqual([]);
    expect(decodeReminders("no-date-here")).toEqual([]);
  });

  /* The separators cannot be escaped in a cookie this small, so a name
     carrying one loses the character rather than the record. */
  it("strips separators out of a name", () => {
    const odd: SetReminder = { agreementId: "A-007", date: "2027-12-01", name: "A~B|C" };
    const back = decodeReminders(encodeReminders([odd]));
    expect(back[0]!.name).toBe("A B C");
    expect(back[0]!.agreementId).toBe("A-007");
    expect(back[0]!.date).toBe("2027-12-01");
  });
});
