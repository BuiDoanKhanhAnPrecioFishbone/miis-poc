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
import type { Dashboard, DashboardPanel, LogLine } from "@/lib/domain/dashboard";
import { eventText } from "@/lib/domain/event";
import { DEFAULT_LANG, t, type Lang } from "@/lib/domain/lang";
import { caseNumber, MEDIATION_TYPE_LABEL } from "@/lib/domain/mediation";
import { NAV_HREF } from "@/lib/domain/nav";
import { roleInfo, type Role } from "@/lib/domain/role";
import { dictionary } from "@/lib/i18n";
import { listIncompleteAgreements, listRecentAgreements } from "./agreements";
import { getCurrentBenchmark } from "./benchmark";
import { listEvents, listReminders, reminderCount } from "./events";
import { listMediationCases, listMediators, listOngoingMediationCases } from "./mediation";

export async function getDashboard(role: Role, lang: Lang = DEFAULT_LANG): Promise<Dashboard> {
  const i18n = dictionary(lang);
  const s = i18n.start;
  const info = roleInfo(role, lang);
  const benchmark = await getCurrentBenchmark();

  const base = {
    role: info,
    heading: s.heading(info.label),
    subheading: s.subheading,
    ...(benchmark ? { benchmark } : {}),
  };

  /** The two log panels share a shape; only their source differs. */
  async function eventPanel(): Promise<DashboardPanel> {
    const events = await listEvents(2);
    return {
      kind: "log",
      title: s.events.title,
      reqTags: ["FH-002"],
      items: events.map<LogLine>((e) => ({
        id: e.id,
        when: e.timestamp,
        text: eventText(e, lang),
      })),
      emptyText: s.events.empty,
      note: s.events.footnote,
    };
  }

  switch (role) {
    case "agreement-admin": {
      const [reminders, total, incomplete, recent, events] = await Promise.all([
        listReminders(),
        reminderCount(),
        listIncompleteAgreements(),
        listRecentAgreements(lang),
        eventPanel(),
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
          emptyText: s.reminders.empty,
          rationale: s.reminders.footnote,
          ...(total > 0 ? { action: { text: i18n.common.showAll(total) } } : {}),
        },
        {
          kind: "list",
          title: s.incomplete.title,
          reqTags: ["FA-021"],
          // Registrations still awaiting information come first — those are the
          // ones an agreement administrator has to chase (US-04).
          items: incomplete
            .slice()
            .sort((a, b) => Number(Boolean(a.signedDate)) - Number(Boolean(b.signedDate)))
            .slice(0, 3)
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
          reqTags: ["FR-012"],
          rows: recent,
          emptyText: s.recent.empty,
        },
        events,
      ];

      return {
        ...base,
        primaryAction: { text: s.uploadProtocol, href: "/registrera" },
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

      return { ...base, primaryAction: { text: s.newSearch, href: NAV_HREF.sok }, panels };
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
        },
      ];

      return { ...base, panels };
    }
  }
}
