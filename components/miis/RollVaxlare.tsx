"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { ROLLER, type Roll } from "@/lib/domain/roll";

/**
 * Demo role switcher.
 *
 * FS-001 requires the start page to adapt to the user's role, and the award
 * criterion is "role-based user scenarios and user interface" — so the
 * adaptation has to be demonstrable, not asserted.
 *
 * It writes the same kind of session cookie a real login would, so week 2 can
 * replace where the role comes from without touching a single screen. Real
 * authentication is SAML 2.0 via Försäkringskassan's EFOS IdP (NFÅ-001).
 */
export function RollVaxlare({ aktiv }: { aktiv: Roll }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function byt(roll: string) {
    document.cookie = `miis_roll=${roll}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="rollvaxlare" className="text-xs font-bold uppercase tracking-wide opacity-80">
        Demo: roll
      </label>
      <select
        id="rollvaxlare"
        value={aktiv}
        disabled={pending}
        onChange={(e) => byt(e.target.value)}
        className="min-h-11 rounded-sm border-2 border-primary-foreground/40 bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"
      >
        {ROLLER.map((r) => (
          <option key={r.id} value={r.id} className="bg-card text-foreground">
            {r.etikett}
          </option>
        ))}
      </select>
    </div>
  );
}
