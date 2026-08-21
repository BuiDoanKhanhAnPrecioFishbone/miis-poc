import { describe, expect, it } from "vitest";

import { REQUIREMENTS } from "./requirements";
import {
  checkSessionTimeout,
  LOG_RETENTION_MIN_MONTHS,
  SESSION_TIMEOUT,
  sessionTimeoutMinutes,
  SYSTEM_SETTINGS,
  warnAtMinutes,
} from "./settings";

describe("the system settings catalogue", () => {
  it("cites only requirement IDs that exist", () => {
    for (const setting of SYSTEM_SETTINGS) {
      for (const id of setting.requirements) {
        expect(REQUIREMENTS[id], `${setting.id} cites ${id}`).toBeDefined();
      }
    }
  });

  /*
    The point of the panel: two of the four are deliberately not editable, and a
    setting that says so has to say why. A fixed setting with no reason is
    indistinguishable from one nobody got round to building.
  */
  it("gives every fixed setting a stated reason", () => {
    for (const setting of SYSTEM_SETTINGS) {
      if (!setting.editable) expect(setting.fixedReason, setting.id).toBeDefined();
    }
  });

  it("keeps log retention out of this role's hands — NFL-003 names them", () => {
    const retention = SYSTEM_SETTINGS.find((s) => s.id === "log-retention");
    expect(retention?.editable).toBe(false);
    expect(retention?.requirements).toContain("NFL-003");
  });

  it("keeps the two US-13 names editable", () => {
    expect(SYSTEM_SETTINGS.find((s) => s.id === "session-timeout")?.editable).toBe(true);
    expect(SYSTEM_SETTINGS.find((s) => s.id === "watchwords")?.editable).toBe(true);
  });

  it("holds NFL-003's own number", () => {
    expect(LOG_RETENTION_MIN_MONTHS).toBe(24);
  });
});

/**
 * NFÅ-002 — *"en konfigurerbar tidsgräns (default max 30 minuter inaktivitet)"*.
 * A ceiling rather than a floor: MI may shorten the limit, and raising it above
 * thirty minutes would weaken the requirement rather than configure it.
 */
describe("checkSessionTimeout — NFÅ-002", () => {
  it("accepts MI's own default", () => {
    expect(checkSessionTimeout(SESSION_TIMEOUT.defaultMinutes)).toBeNull();
  });

  it("accepts a shorter limit", () => {
    expect(checkSessionTimeout(15)).toBeNull();
    expect(checkSessionTimeout(SESSION_TIMEOUT.minMinutes)).toBeNull();
  });

  it("refuses a limit longer than thirty minutes", () => {
    expect(checkSessionTimeout(31)?.kind).toBe("too-high");
    expect(checkSessionTimeout(60)?.kind).toBe("too-high");
  });

  it("refuses a limit shorter than the floor", () => {
    expect(checkSessionTimeout(4)?.kind).toBe("too-low");
    expect(checkSessionTimeout(0)?.kind).toBe("too-low");
  });

  it("refuses anything that is not a whole number of minutes", () => {
    expect(checkSessionTimeout(Number.NaN)?.kind).toBe("not-a-number");
    expect(checkSessionTimeout(12.5)?.kind).toBe("not-a-number");
  });
});

describe("sessionTimeoutMinutes", () => {
  it("reads a stored value", () => {
    expect(sessionTimeoutMinutes("10")).toBe(10);
  });

  /* A cookie is user input. Anything unusable falls back to MI's default rather
     than to zero, which would end every session immediately. */
  it("falls back to MI's default rather than to zero", () => {
    expect(sessionTimeoutMinutes(undefined)).toBe(30);
    expect(sessionTimeoutMinutes("")).toBe(30);
    expect(sessionTimeoutMinutes("nonsense")).toBe(30);
    expect(sessionTimeoutMinutes("0")).toBe(30);
    expect(sessionTimeoutMinutes("999")).toBe(30);
  });
});

describe("warnAtMinutes", () => {
  it("warns two minutes before the limit", () => {
    expect(warnAtMinutes(30)).toBe(28);
    expect(warnAtMinutes(10)).toBe(8);
  });

  /* At the five-minute floor the arithmetic still has to leave a positive
     delay — a warning scheduled at zero fires before the page has rendered. */
  it("never schedules the warning at zero", () => {
    expect(warnAtMinutes(5)).toBe(3);
    expect(warnAtMinutes(2)).toBe(1);
    expect(warnAtMinutes(1)).toBe(1);
  });
});
