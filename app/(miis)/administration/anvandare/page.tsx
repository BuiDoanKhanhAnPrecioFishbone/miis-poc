import type { Metadata } from "next";

import { AppShell } from "@/components/miis/AppShell";
import { DataTable, type Column, type Row } from "@/components/miis/DataTable";
import { Badge, Callout, PageHeading, Panel, Rationale } from "@/components/miis/primitives";
import type { NavId } from "@/lib/domain/nav";
import { accessLevel, ROLES } from "@/lib/domain/role";
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

  /*
    The matrix, screen by screen, rather than a sentence per role.

    §3.1 gives each role a verb — "read, write, edit", "read, data extract",
    "specific reports" — and a prose column cannot be checked against a screen.
    A column per module can: every cell is `accessLevel` for that role and that
    menu item, the same function the shell asks before it renders anything.
  */
  const MODULES: NavId[] = [
    "avtal",
    "parter",
    "forhandlingar",
    "medling",
    "partstraffar",
    "medlare",
    "dokument",
    "rapporter",
    "sok",
    "market",
    "administration",
    "anvandare",
  ];

  const columns: Column[] = [
    { key: "role", header: t.roles.role, sortable: true },
    { key: "person", header: t.roles.person, sortable: true },
    ...MODULES.map((m) => ({ key: m, header: i18n.nav[m] })),
  ];

  const LEVEL_TONE = { write: "ok", read: "neutral", none: "neutral" } as const;

  const rows: Row[] = ROLES.map((r) => ({
    key: r.id,
    cells: [
      <span key="r" className="font-semibold">
        {r.label[lang]}
      </span>,
      r.person,
      ...MODULES.map((m) => {
        const level = accessLevel(r, m);
        /* An em dash for "none": an empty cell reads as data we did not have. */
        return level === "none" ? (
          <span key={m} className="text-muted-foreground">
            {i18n.common.none}
          </span>
        ) : (
          <Badge key={m} tone={LEVEL_TONE[level]}>
            {t.roles.level[level]}
          </Badge>
        );
      }),
    ],
    sort: [r.label[lang], r.person, ...MODULES.map((m) => accessLevel(r, m))],
  }));

  return (
    <AppShell role={session.role} requires="anvandare" dataset={session.dataset} lang={lang} reqTags={session.reqTags}>
      <PageHeading
        title={t.title}
        subtitle={t.subtitle}
        tags={["NFÅ-001", "NFÅ-003", "NFÅ-005"]}
      />

      <Panel title={t.roles.heading} tags={["NFÅ-003", "NFÅ-005"]}>
        <p className="mb-4 max-w-4xl text-table">{t.roles.intro}</p>
        <p className="mb-4 max-w-4xl text-label text-muted-foreground">{t.roles.matrixNote}</p>
        <DataTable
          columns={columns}
          rows={rows}
          lang={lang}
          caption={t.roles.heading}
          minWidth="96rem"
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
