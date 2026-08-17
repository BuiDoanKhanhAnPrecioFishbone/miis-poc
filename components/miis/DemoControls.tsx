"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { ROLES, type Role } from "@/lib/domain/role";
import { DATASET_INFO, type DatasetName } from "@/lib/domain/dataset";

/**
 * Demo-only header controls.
 *
 * Role: FS-001 requires the start page to adapt to the user's role, and the
 * award criterion is "role-based user scenarios and user interface" — so the
 * adaptation has to be demonstrable, not asserted. Real authentication is
 * SAML 2.0 via Försäkringskassan's EFOS IdP (NFÅ-001); this writes the same
 * kind of session cookie, so week 2 replaces where the role comes from without
 * touching a single screen.
 *
 * Dataset: lets a screen be shown empty, normal and under load without editing
 * the mock data and losing the other two states. Disappears when a real
 * database arrives.
 */

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
}

const selectClass =
  "min-h-11 rounded-sm border-2 border-primary-foreground/40 bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground";

export function DemoControls({
  role,
  dataset,
}: {
  role: Role;
  dataset: DatasetName;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function change(cookie: string, value: string) {
    setCookie(cookie, value);
    startTransition(() => router.refresh());
  }

  return (
    <div className="flex items-end gap-3">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="demo-role"
          className="text-[0.65rem] font-bold uppercase tracking-wide opacity-80"
        >
          Demo: roll
        </label>
        <select
          id="demo-role"
          value={role}
          disabled={pending}
          onChange={(e) => change("miis_role", e.target.value)}
          className={selectClass}
        >
          {ROLES.map((r) => (
            <option key={r.id} value={r.id} className="bg-card text-foreground">
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="demo-dataset"
          className="text-[0.65rem] font-bold uppercase tracking-wide opacity-80"
        >
          Demo: läge
        </label>
        <select
          id="demo-dataset"
          value={dataset}
          disabled={pending}
          onChange={(e) => change("miis_dataset", e.target.value)}
          className={selectClass}
        >
          {DATASET_INFO.map((d) => (
            <option key={d.id} value={d.id} className="bg-card text-foreground">
              {d.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
