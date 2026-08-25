/**
 * FS-001 – the role-adapted start page — THE SEAM.
 *
 * "The information shall be adapted to the different roles in the system; for
 * example, a mediation administrator shall see ongoing mediations."
 *
 * The role decides the panels; the language decides the words. Both are
 * resolved here so the screen stays one rendering path with no branching in it.
 */

import { partiesShort } from "@/lib/domain/agreement";
import { START_PAGE_ROWS } from "@/lib/domain/dashboard";
import type { Dashboard, DashboardPanel, LogLine } from "@/lib/domain/dashboard";
import { eventText } from "@/lib/domain/event";
import { DEFAULT_LANG, t, type Lang } from "@/lib/domain/lang";
import { caseNumber, MEDIATION_TYPE_LABEL } from "@/lib/domain/mediation";
import { NAV_HREF } from "@/lib/domain/nav";
import { accessLevel, roleInfo, type Role } from "@/lib/domain/role";
import { dictionary } from "@/lib/i18n";
import { countAgreements, listIncompleteAgreements, listRecentAgreements } from "./agreements";
import { SESSION_TIMEOUT } from "@/lib/domain/settings";
import { getCurrentBenchmark } from "./benchmark";
import { listEvents, listReminders, reminderCount } from "./events";
import { listMediationCases, listMediators, listOngoingMediationCases } from "./mediation";

export async function getDashboard(
  role: Role,
  lang: Lang = DEFAULT_LANG,
  /* NFÅ-002's configured limit, so the start page states the limit that is
     actually in force rather than a number typed into the dictionary. */
  sessionTimeoutMinutes = SESSION_TIMEOUT.defaultMinutes,
): Promise<Dashboard> {
  const i18n = dictionary(lang);
  const d = i18n;
  const s = i18n.start;
  const info = roleInfo(role, lang);

  /*
    The Märket banner carries a link to /market, so it belongs only to a role
    that may open it. The mediator's §3.1 permission is "Specifika rapporter"
    and its nav is Start and Rapporter — the banner was handing that role a
    button whose only outcome is the authorisation notice, which is the same
    failure as a <Button> with no onClick.
  */
  const benchmark = accessLevel(info, "market") === "none" ? undefined : await getCurrentBenchmark();

  const base = {
    role: info,
    heading: s.heading(info.label),
    subheading: s.subheading(sessionTimeoutMinutes),
    ...(benchmark ? { benchmark } : {}),
  };

  /** The two log panels share a shape; only their source differs. */
  async function eventPanel(): Promise<DashboardPanel> {
    const events = await listEvents(START_PAGE_ROWS);
    return {
      kind: "log",
      title: s.events.title,
      reqTags: ["FH-002"],
      items: events.map<LogLine>((e) => ({
        id: e.id,
        when: e.timestamp,
        text: eventText(e, lang),
        /* Not every event names an agreement; those that do become a link. */
        ...(e.agreementId ? { agreementId: e.agreementId } : {}),
      })),
      emptyText: s.events.empty,
      note: s.events.footnote,
    };
  }

  switch (role) {
    case "agreement-admin": {
      const [reminders, total, incomplete, recent, events, agreementCount] = await Promise.all([
        listReminders(START_PAGE_ROWS),
        reminderCount(),
        listIncompleteAgreements(),
        listRecentAgreements(lang, START_PAGE_ROWS),
        eventPanel(),
        countAgreements(),
      ]);

      const panels: DashboardPanel[] = [
        {
          kind: "log",
          title: s.reminders.title,
          reqTags: ["FA-022"],
          items: reminders.map<LogLine>((r) => ({
            id: r.id,
            when: r.date,
            text: t(r.text, lang),
          })),
          lead: s.reminders.lead,
          emphasis: "action",
          total,
          emptyText: s.reminders.empty,
          rationale: s.reminders.footnote,
          /*
            A destination, not a refusal. This action rendered as a `disabled`
            button reading "Ej aktiv i demon" because it carried no `href` —
            the last of that phrase in the product. FA-022's reminders are set
            and cleared on Konjunkturlönerapporten's watch list, so that is
            where "show all" goes; the deep link opens the tab that owns it.
          */
          ...(total > 0
            ? { action: { text: i18n.common.showAll(total), href: "/rapporter#konjunkturlon" } }
            : {}),
        },
        {
          kind: "list",
          title: s.incomplete.title,
          lead: s.incomplete.lead,
          emphasis: "action",
          total: incomplete.length,
          reqTags: ["FA-021"],
          // Registrations still awaiting information come first — those are the
          // ones an agreement administrator has to chase (US-04).
          items: incomplete
            .slice()
            .sort((a, b) => Number(Boolean(a.signedDate)) - Number(Boolean(b.signedDate)))
            .slice(0, START_PAGE_ROWS)
            .map((a) => ({
              text: `${a.name} – ${partiesShort(a)}`,
              badge: s.incomplete.badge,
            })),
          emptyText: s.incomplete.empty,
          rationale: s.incomplete.footnote,
          action: {
            text: s.incomplete.action,
            href: NAV_HREF.rapporter,
            reqTag: "FR-008",
          },
        },
        {
          kind: "agreement-table",
          title: s.recent.title,
          lead: s.recent.lead,
          emphasis: "reference",
          total: agreementCount,
          reqTags: ["FR-012"],
          rows: recent,
          emptyText: s.recent.empty,
        },
        events,
      ];

      return {
        ...base,
        primaryAction: { text: s.uploadProtocol, href: "/registrera" },
        /* US-03 — a merger or a rename is the other thing this role does. */
        secondaryActions: [{ text: d.parter.newParty.action, href: "/parter/ny" }],
        panels,
      };
    }

    case "mediation-admin": {
      const [ongoing, events] = await Promise.all([listOngoingMediationCases(), eventPanel()]);

      const panels: DashboardPanel[] = [
        {
          kind: "list",
          title: s.ongoingMediations.title,
          reqTags: ["FF-006", "FS-001"],
          items: ongoing.map((c) => ({
            text: `${caseNumber(c.id)} · ${c.name} · ${MEDIATION_TYPE_LABEL[lang][c.type]}`,
            badge: s.ongoingMediations.badge,
          })),
          emptyText: s.ongoingMediations.empty,
          rationale: s.ongoingMediations.footnote,
          action: { text: s.ongoingMediations.action, href: NAV_HREF.medling },
        },
        {
          kind: "list",
          title: s.dgDecisions.title,
          reqTags: ["FSD-001", "FE-001"],
          items: ongoing.map((c) => ({
            text: `${c.dgDecision.number} · ${c.name}`,
            badge: s.dgDecisions.badge,
          })),
          emptyText: s.dgDecisions.empty,
          note: s.dgDecisions.footnote,
        },
        {
          kind: "list",
          title: s.partyMeetings.title,
          reqTags: ["FF-004"],
          items: s.partyMeetings.items.map((text) => ({ text })),
          emptyText: s.partyMeetings.empty,
          rationale: s.partyMeetings.footnote,
          action: { text: s.partyMeetings.action, href: NAV_HREF.partstraffar },
        },
        events,
      ];

      return {
        ...base,
        primaryAction: { text: s.uploadDgDecision, href: NAV_HREF.medling },
        /* US-08 — party meetings are booked ahead of every round. */
        secondaryActions: [{ text: d.partstraffar.register.create, href: "/partstraffar/ny" }],
        panels,
      };
    }

    case "mediator-admin": {
      const [mediators, cases] = await Promise.all([listMediators(), listMediationCases()]);

      const panels: DashboardPanel[] = [
        {
          kind: "list",
          title: s.mediatorRegister.title,
          reqTags: ["FF-009"],
          items: mediators.map((m) => ({
            text: `${m.name} · ${m.types.map((type) => MEDIATION_TYPE_LABEL[lang][type]).join(", ")} · ${s.mediatorRegister.assignments(m.history.length)}`,
            badge: m.active ? s.mediatorRegister.active : s.mediatorRegister.inactive,
          })),
          emptyText: s.mediatorRegister.empty,
          rationale: s.mediatorRegister.footnote,
          action: { text: s.mediatorRegister.action, href: NAV_HREF.medlare },
        },
        {
          kind: "list",
          title: s.casesNeedingMediators.title,
          reqTags: ["FE-001", "FF-009"],
          items: cases.map((c) => ({
            text: `${caseNumber(c.id)} · ${c.name}`,
            badge:
              c.mediators.length > 0
                ? s.casesNeedingMediators.assigned
                : s.casesNeedingMediators.missing,
          })),
          emptyText: s.casesNeedingMediators.empty,
          note: s.casesNeedingMediators.footnote,
        },
      ];

      return { ...base, panels };
    }

    case "statistics-user": {
      const panels: DashboardPanel[] = [
        {
          kind: "list",
          title: s.savedSearches.title,
          reqTags: ["FR-002"],
          items: s.savedSearches.items.map((text) => ({ text })),
          rationale: s.savedSearches.footnote,
          action: { text: s.savedSearches.action, href: NAV_HREF.sok },
        },
        {
          kind: "list",
          title: s.snapshots.title,
          reqTags: ["FH-003", "FR-004", "FR-013"],
          items: s.snapshots.items.map((text, i) => ({
            text,
            ...(i === 0 ? { badge: s.snapshots.latest } : {}),
          })),
          rationale: s.snapshots.footnote,
        },
      ];

      return {
        ...base,
        primaryAction: { text: s.newSearch, href: NAV_HREF.sok },
        /* US-17 — the standard reports are this role's other daily errand. */
        secondaryActions: [{ text: d.rapporter.title, href: NAV_HREF.rapporter }],
        panels,
      };
    }

    case "system-admin": {
      const panels: DashboardPanel[] = [
        {
          kind: "list",
          title: s.logs.title,
          reqTags: ["NFL-001", "NFL-002", "NFL-004"],
          items: s.logs.items.map((text) => ({ text })),
          rationale: s.logs.footnote,
          action: { text: s.logs.action, href: NAV_HREF.administration },
        },
        {
          kind: "list",
          title: s.watchwords.title,
          reqTags: ["FAI-004"],
          items: s.watchwords.items.map((text) => ({ text, badge: s.watchwords.active })),
          rationale: s.watchwords.footnote,
        },
      ];

      return { ...base, panels };
    }

    case "permission-admin": {
      const panels: DashboardPanel[] = [
        {
          kind: "list",
          title: s.users.title,
          reqTags: ["NFÅ-005", "NFÅ-003"],
          items: s.users.items.map((text) => ({ text, badge: s.users.active })),
          rationale: s.users.footnote,
          action: { text: s.users.action, href: NAV_HREF.anvandare },
        },
        {
          kind: "list",
          title: s.userTasks.title,
          reqTags: ["NFÅ-005"],
          items: [{ text: s.userTasks.item, badge: s.userTasks.badge }],
          rationale: s.userTasks.footnote,
        },
      ];

      return { ...base, panels };
    }

    case "public": {
      // The public computer has its own entrance at /allmanheten. This branch
      // only exists so the role switcher never lands on an empty screen.
      const panels: DashboardPanel[] = [
        {
          kind: "list",
          title: i18n.allmanheten.result.title,
          reqTags: ["FR-011", "NFÅ-006"],
          items: [{ text: i18n.allmanheten.publicExplain }],
          note: i18n.allmanheten.subtitle,
          action: { text: i18n.allmanheten.title, href: "/allmanheten" },
        },
      ];

      return {
        ...base,
        heading: i18n.allmanheten.title,
        subheading: i18n.allmanheten.subtitle,
        panels,
      };
    }

    case "mediator": {
      const panels: DashboardPanel[] = [
        {
          kind: "list",
          title: s.mediatorAssignments.title,
          reqTags: ["FF-006", "NFÅ-007"],
          items: [{ text: s.mediatorAssignments.item, badge: s.mediatorAssignments.badge }],
          emptyText: s.mediatorAssignments.empty,
          rationale: s.mediatorAssignments.footnote,
        },
        {
          kind: "list",
          title: s.mediatorMaterial.title,
          reqTags: ["FM-003", "FR-011"],
          items: s.mediatorMaterial.items.map((text) => ({ text })),
          /* The three are the role's whole system, so the panel that names
             them is where the way in belongs — otherwise the only route is the
             menu, and the start page lists work it cannot open. */
          rationale: s.mediatorMaterial.footnote,
          action: { text: s.mediatorMaterial.action, href: "/rapporter" },
        },
      ];

      return { ...base, panels };
    }
  }
}
