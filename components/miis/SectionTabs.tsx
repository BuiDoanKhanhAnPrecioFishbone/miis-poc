"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

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
 *
 * **A link into a section opens that section.** `#konjunkturlon` is a real
 * destination — the report catalogue sends the officer there when they pick
 * Konjunkturlönerapporten — and once the screen is tabbed, an anchor inside an
 * inactive panel is a link that arrives nowhere: the page scrolls to an element
 * `display: none` has given no position. The hash is read on mount and on every
 * `hashchange`, so following the link twice works as well as following it once.
 *
 * **A tablist of one is not a choice.** Where a role sees a single section —
 * §3.1 gives Medlare and Allmänhetens dator specific reports and nothing else —
 * the strip is dropped and the section renders bare. One tab is furniture that
 * implies there is somewhere else to go.
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

  /*
    Follow a deep link into a section. `setState` inside an effect is what this
    needs: the hash is not known during render — reading `location` there would
    differ between the server's HTML and the browser's first paint — so the
    correction happens after mount, and again whenever the hash changes.
  */
  useEffect(() => {
    const open = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      const panel = document.getElementById(id)?.closest<HTMLElement>("[data-tab-panel]");
      const owner = panel?.dataset.tabId;
      if (owner) setActive(owner);
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);

  /* Scroll after the panel is visible — an element the class still hides has no
     position to scroll to, so doing this in the effect above lands nowhere. */
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    document.getElementById(id)?.scrollIntoView({ block: "start" });
  }, [active]);

  return (
    <>
      {/* One section is not a choice — see the note above. */}
      {sections.length > 1 && (
        <div data-tab-list className="print-hide mb-5">
          <Tabs
            label={label}
            value={active}
            onChange={setActive}
            tabs={sections.map((s) => ({ id: s.id, label: s.label }))}
          />
        </div>
      )}

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
          data-tab-id={section.id}
          className={section.id === active || sections.length === 1 ? "space-y-5" : "hidden"}
        >
          {section.node}
        </div>
      ))}
    </>
  );
}
