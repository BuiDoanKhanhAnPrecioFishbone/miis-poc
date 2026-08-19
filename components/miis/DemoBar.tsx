"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import {
  COOKIE_MAX_AGE_SECONDS,
  DATASET_COOKIE,
  LANG_COOKIE,
  REQTAGS_COOKIE,
  ROLE_COOKIE,
} from "@/lib/cookies";
import { datasetOptions, type DatasetName } from "@/lib/domain/dataset";
import { LANGS, type Lang } from "@/lib/domain/lang";
import { roleOptions, type Role } from "@/lib/domain/role";
import { dictionary } from "@/lib/i18n";
import { SelectChevron } from "./Select";
import { Button } from "./primitives";

/**
 * Reviewer controls — deliberately outside the product chrome.
 *
 * Nothing in the requirement specification asks for a role switcher, a data-set
 * switcher, a language switcher or requirement IDs on screen. Inside the header
 * an evaluator can reasonably read them as proposed functionality; in a plainly
 * labelled strip above the header they read as a courtesy to the reader. That
 * distinction is worth a few pixels, because the award criterion includes
 * demonstrated understanding of the assignment's conditions.
 *
 * Role: FS-001 requires the start page to adapt to the user's role, and the
 * award criterion is "role-based user scenarios and user interface" — so the
 * adaptation has to be demonstrable, not asserted. Real authentication is
 * SAML 2.0 via Försäkringskassan's EFOS IdP (NFÅ-001); this writes the same kind
 * of session cookie, so week 2 replaces where the role comes from without
 * touching a single screen.
 */

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}

const controlClass =
  "demo-select min-h-11 min-w-0 rounded-sm border-2 border-demo-border bg-card px-3 py-1.5 text-label font-semibold text-foreground";

const labelClass = "shrink-0 text-meta font-bold uppercase tracking-wide text-demo-foreground";

export function DemoBar({
  role,
  dataset,
  lang,
  reqTags,
  onShowSessionWarning,
}: {
  role: Role;
  dataset: DatasetName;
  lang: Lang;
  reqTags: boolean;
  /**
   * Omitted on the public computer view: NFÅ-006 says that entrance has no
   * login, so it has no session to time out. A button that does nothing is
   * worse than an absent one.
   */
  onShowSessionWarning?: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const t = dictionary(lang).demo;

  function change(cookie: string, value: string) {
    setCookie(cookie, value);
    startTransition(() => router.refresh());
  }

  return (
    <div className="border-b-2 border-dashed border-demo-border bg-demo text-demo-foreground">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-2 sm:px-8">
        {/*
          The strip has to stay unmistakably not-MIIS (CLAUDE.md), which is what
          the dashed border, the demo ground and these two sentences do. They no
          longer take a full-width row each: the label and the explanation are
          one block on the left, and the controls sit beside them rather than
          under them, which is where most of the old height went.
        */}
        <p className="basis-full text-meta leading-snug">
          <span className="font-bold uppercase tracking-wide">{t.title}</span>
          <span aria-hidden className="mx-2">·</span>
          {t.explain}
        </p>

        <div className="flex items-center gap-2">
          <label htmlFor="demo-role" className={labelClass}>
            {t.role}
          </label>
          <span className="relative flex">
            <select
              id="demo-role"
              value={role}
              disabled={pending}
              onChange={(e) => change(ROLE_COOKIE, e.target.value)}
              className={controlClass}
            >
              {roleOptions(lang).map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
            <SelectChevron />
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="demo-dataset" className={labelClass}>
            {t.dataset}
          </label>
          <span className="relative flex">
            <select
              id="demo-dataset"
              value={dataset}
              disabled={pending}
              onChange={(e) => change(DATASET_COOKIE, e.target.value)}
              className={controlClass}
            >
              {datasetOptions(lang).map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
            <SelectChevron />
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="demo-lang" className={labelClass}>
            {t.language}
          </label>
          <span className="relative flex">
            <select
              id="demo-lang"
              value={lang}
              disabled={pending}
              onChange={(e) => change(LANG_COOKIE, e.target.value)}
              className={controlClass}
            >
              {LANGS.map((l) => (
                <option key={l.id} value={l.id} lang={l.htmlLang}>
                  {l.label}
                </option>
              ))}
            </select>
            <SelectChevron />
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="demo-reqtags" className={labelClass}>
            {t.reqTags}
          </label>
          <span className="relative flex">
            <select
              id="demo-reqtags"
              value={reqTags ? "on" : "off"}
              disabled={pending}
              onChange={(e) => change(REQTAGS_COOKIE, e.target.value)}
              className={controlClass}
            >
              <option value="off">{t.reqTagsOff}</option>
              <option value="on">{t.reqTagsOn}</option>
            </select>
            <SelectChevron />
          </span>
        </div>

        {onShowSessionWarning && (
          <Button variant="secondary" size="sm" onClick={onShowSessionWarning}>
            {t.sessionWarning}
          </Button>
        )}
      </div>
    </div>
  );
}
