import type { Metadata } from "next";

import { AppShell } from "@/components/miis/AppShell";
import { DataTable, type Column, type Row } from "@/components/miis/DataTable";
import { Callout, PageHeading, Panel, Rationale } from "@/components/miis/primitives";
import { ROLES } from "@/lib/domain/role";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const { i18n } = await getSession();
  const title = `${i18n.common.appName} – ${i18n.anvandare.title}`;
  const description = i18n.anvandare.subtitle;
  return { title, description, openGraph: { title, description } };
}

/**
 * User and authorisation administration — NFÅ-001, NFÅ-003, NFÅ-005, NFL-001.
 *
 * The table is generated from `ROLES`, the same definition the navigation is
 * filtered by. That is the point rather than a convenience: the claim this
 * screen makes is "the role decides what you see", and generating the menu
 * column from the very array the shell reads means the claim cannot quietly
 * stop being true. Change a role's `nav` and both the menu and this page move
 * together.
 *
 * Sign-in itself is described, not demonstrated. NFÅ-001 puts authentication in
 * Försäkringskassan's IdP over SAML 2.0, and a mockup that drew a login form
 * would be claiming to have built the one thing it certainly has not.
 */
export default async function AnvandarePage() {
  const session = await getSession();
  const { i18n, lang } = session;
  const t = i18n.anvandare;

  const columns: Column[] = [
    { key: "role", header: t.roles.role, sortable: true },
    { key: "person", header: t.roles.person, sortable: true },
    { key: "permissions", header: t.roles.permissions },
    { key: "menu", header: t.roles.menu },
  ];

  const rows: Row[] = ROLES.map((r) => {
    const menu = r.nav.map((id) => i18n.nav[id]).join(", ");
    return {
      key: r.id,
      cells: [
        <span key="r" className="font-semibold">
          {r.label[lang]}
        </span>,
        r.person,
        r.permissions[lang],
        <span key="m" className="text-muted-foreground">
          {menu}
        </span>,
      ],
      sort: [r.label[lang], r.person, r.permissions[lang], menu],
    };
  });

  return (
    <AppShell role={session.role} dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      <PageHeading
        title={t.title}
        subtitle={t.subtitle}
        tags={["NFÅ-001", "NFÅ-003", "NFÅ-005"]}
      />

      <Panel title={t.roles.heading} tags={["NFÅ-003", "NFÅ-005"]}>
        <p className="mb-4 max-w-4xl text-table">{t.roles.intro}</p>
        <DataTable
          columns={columns}
          rows={rows}
          lang={lang}
          caption={t.roles.heading}
          minWidth="72rem"
        />
      </Panel>

      <div className="mt-5">
        <Panel title={t.auth.heading} tags={["NFÅ-001", "NFL-001"]}>
          <Callout tone="ok" label={t.auth.heading}>
            {t.auth.body}
          </Callout>
          <p className="mt-3 max-w-4xl text-table">{t.auth.logging}</p>
          <Rationale>{t.roles.intro}</Rationale>
        </Panel>
      </div>
    </AppShell>
  );
}
