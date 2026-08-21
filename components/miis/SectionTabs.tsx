"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import type { Lang } from "@/lib/domain/lang";
import { Tabs } from "./Select";

/**
 * A screen whose sections are separate jobs, shown one at a time.
 *
 * Stacking is right when the parts are one subject read in order — an
 * agreement's identity, then its scope, then its wage agreements. It is wrong
 * when they are separate jobs that happen to belong to the same role, which is
 * what Administration is: settings to change, a change log to search, an event
 * log to read, a watchword table to maintain. An administrator who came to do
 * one of the four had to scroll past the other three, and the page was long
 * enough that the fourth was invisible.
 *
 * **The sections are server-rendered and handed in as nodes.** Only the choice
 * of which is visible happens in the browser, so the tables, their sort values
 * and every authorisation decision stay on the server — the same arrangement
 * the report screen uses for its report bodies.
 *
 * **Every section prints.** A tab is a view state and paper has no view state,
 * so the inactive panels stay in the document and the print stylesheet unhides
 * them; the tab strip itself is dropped. A printed Administration that showed
 * only the tab the officer happened to be on would be a screenshot of a
 * decision, not a record.
 */
export function SectionTabs({
  label,
  lang,
  sections,
}: {
  label: string;
  lang: Lang;
  sections: { id: string; label: string; node: ReactNode }[];
}) {
  void lang;
  const [active, setActive] = useState(sections[0]?.id ?? "");

  return (
    <>
      <div data-tab-list className="print-hide mb-5">
        <Tabs
          label={label}
          value={active}
          onChange={setActive}
          tabs={sections.map((s) => ({ id: s.id, label: s.label }))}
        />
      </div>

      {sections.map((section) => (
        /*
          A class, not the `hidden` attribute. Chrome's user-agent stylesheet
          declares `[hidden] { display: none !important }`, so author CSS cannot
          reach it — and the print rule that has to bring every section back is
          author CSS. `display: none` removes the panel from the accessibility
          tree either way, which is the part that matters on screen.
        */
        <div
          key={section.id}
          data-tab-panel
          className={section.id === active ? "space-y-5" : "hidden"}
        >
          {section.node}
        </div>
      ))}
    </>
  );
}
