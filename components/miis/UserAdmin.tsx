"use client";

import { useState } from "react";

import type { Lang } from "@/lib/domain/lang";
import { t as text } from "@/lib/domain/lang";
import { ROLES, type Role } from "@/lib/domain/role";
import { mayDeactivate, type SystemUser } from "@/lib/domain/user";
import { dictionary } from "@/lib/i18n";
import { DataTable, matchesFacets, type Column, type Row } from "./DataTable";
import { IconCheck, IconPlus } from "./icons";
import {
  Badge,
  Button,
  Callout,
  FilterChips,
  FormGrid,
  Panel,
  Rationale,
  ReqTags,
  TextField,
} from "./primitives";
import { Select } from "./Select";

/**
 * Users and role assignment — NFÅ-005.
 *
 * The requirement names the two things MI must be able to do without us:
 * *"upplägg och redigering av användare och rolltilldelning"*. So this screen
 * is a list of people with the role each one holds, and a form that puts a new
 * person in it — not a permission editor. The permission *matrix* is below and
 * stays read-only, because NFÅ-003 defines access by the eight roles §3.1
 * writes down; an administrator who could move "write on Avtal" between roles
 * would leave the matrix describing a configuration rather than describing MI's
 * own document.
 *
 * The shape follows what an authorisation register in a government system
 * actually needs to answer, in this order: **who has access**, **as what**,
 * **since when and granted by whom**, and **are they still here**. Each of those
 * is a column. What it deliberately does not have is a password field, a
 * "create account" action or a group hierarchy: NFÅ-001 puts authentication in
 * Försäkringskassan's IdP over SAML with an EFOS card, so a user in MIIS is a
 * *link* to an identity that already exists, and drawing an account-creation
 * form would claim we built an identity provider.
 *
 * **Deactivate, never delete.** NFL-001 logs sign-ins and NFL-003 keeps them for
 * a retention period, so a departed colleague has to go on being resolvable from
 * the log. `mayDeactivate` also refuses to let the last authorisation
 * administrator remove themselves, which is the one lock-out that would need the
 * supplier to repair — exactly what NFÅ-005 exists to prevent.
 */
export function UserAdmin({ users, lang }: { users: SystemUser[]; lang: Lang }) {
  const d = dictionary(lang);
  const t = d.anvandare.users;

  const [roleFilter, setRoleFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [efos, setEfos] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("agreement-admin");
  const [saved, setSaved] = useState<string | null>(null);

  const roleLabel = (id: Role) => ROLES.find((r) => r.id === id)?.label[lang] ?? id;

  const columns: Column[] = [
    { key: "name", header: t.name, sortable: true },
    { key: "unit", header: t.unit, sortable: true },
    { key: "role", header: t.role, sortable: true },
    { key: "assigned", header: t.assigned, sortable: true },
    { key: "lastSignIn", header: t.lastSignIn, sortable: true },
    { key: "status", header: t.status, sortable: true },
    { key: "action", header: t.action },
  ];

  const rows: Row[] = users.map((u) => ({
    key: u.id,
    cells: [
      <span key="n" className="min-w-0">
        <span className="block font-semibold">{u.name}</span>
        {/*
          The EFOS identity under the name rather than in its own column: it is
          how the row is matched to Försäkringskassan's IdP, which an
          administrator needs to see and never needs to sort by.
        */}
        <span className="block text-label text-muted-foreground">{u.efosIdentity}</span>
      </span>,
      text(u.unit, lang),
      roleLabel(u.role),
      <span key="a" className="whitespace-nowrap tabular-nums">
        {u.roleAssigned.date}
        <span className="block text-label text-muted-foreground">
          {t.assignedBy(u.roleAssigned.by)}
        </span>
      </span>,
      <span key="l" className="whitespace-nowrap tabular-nums">
        {u.lastSignIn ?? d.common.none}
      </span>,
      <Badge key="s" tone={u.active ? "ok" : "neutral"}>
        {u.active ? t.active : t.inactive}
      </Badge>,
      /*
        The action, per row and per rule. A control that is refused says why on
        itself rather than failing when pressed — the last authorisation
        administrator is the case, and it is the one an evaluator will try.
      */
      u.active ? (
        <Button
          key="d"
          size="sm"
          variant="secondary"
          disabled={!mayDeactivate(u, users)}
          disabledReason={t.lastAdminReason}
        >
          {t.deactivate}
        </Button>
      ) : (
        <Button key="d" size="sm" variant="secondary" disabled disabledReason={t.reactivateReason}>
          {t.reactivate}
        </Button>
      ),
    ],
    sort: [
      u.name,
      text(u.unit, lang),
      roleLabel(u.role),
      u.roleAssigned.date,
      u.lastSignIn ?? "",
      u.active ? "0" : "1",
      "",
    ],
    facets: { role: u.role, active: u.active ? "yes" : "no" },
  }));

  const visible = rows.filter((r) => matchesFacets(r, { role: roleFilter, active: activeFilter }));

  const active: { key: string; label: string; clear: () => void }[] = [];
  if (roleFilter) {
    active.push({
      key: "role",
      label: `${t.role}: ${roleLabel(roleFilter as Role)}`,
      clear: () => setRoleFilter(""),
    });
  }
  if (activeFilter) {
    active.push({
      key: "active",
      label: `${t.status}: ${activeFilter === "yes" ? t.active : t.inactive}`,
      clear: () => setActiveFilter(""),
    });
  }

  return (
    <Panel
      title={t.heading}
      tags={["NFÅ-005", "NFÅ-001", "FH-001"]}
      action={
        !adding && (
          <Button variant="secondary" onClick={() => setAdding(true)} iconStart={<IconPlus />}>
            {t.add}
          </Button>
        )
      }
    >
      <p className="mb-4 max-w-4xl text-table">{t.intro}</p>

      {saved && (
        <div className="mb-4">
          <Callout tone="ok" live tags={["NFÅ-005", "FH-001"]}>
            {t.savedNote(saved)}
          </Callout>
        </div>
      )}

      {adding && (
        <div className="mb-5 rounded-md border-2 border-border p-4">
          <h3 className="mi-kicker mb-3 text-muted-foreground">{t.add}</h3>
          <FormGrid>
            <TextField
              id="ua-name"
              label={t.name}
              width="medium"
              value={name}
              onChange={setName}
              placeholder={t.namePlaceholder}
            />
            <TextField
              id="ua-efos"
              label={t.efos}
              width="medium"
              value={efos}
              onChange={setEfos}
              placeholder="SE-EFOS-000000-0000"
              hint={t.efosHint}
            />
            <TextField
              id="ua-email"
              label={t.email}
              width="medium"
              value={email}
              onChange={setEmail}
              placeholder="fornamn.efternamn@mi.se"
            />
            <Select
              id="ua-role"
              width="medium"
              label={t.role}
              value={role}
              onChange={(v) => setRole(v as Role)}
              options={ROLES.map((r) => ({ id: r.id, label: r.label[lang] }))}
            />
          </FormGrid>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              onClick={() => {
                setSaved(name.trim());
                setAdding(false);
                setName("");
                setEfos("");
                setEmail("");
              }}
              disabled={name.trim().length === 0}
              disabledReason={t.nameRequired}
              iconStart={<IconCheck />}
            >
              {t.save}
            </Button>
            <Button variant="ghost" onClick={() => setAdding(false)}>
              {d.common.close}
            </Button>
            <ReqTags ids={["NFÅ-005", "FH-001"]} />
          </div>
          <Rationale>{t.noPasswordNote}</Rationale>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2 @3xl:grid-cols-3">
        <Select
          id="ua-filter-role"
          label={t.role}
          value={roleFilter}
          onChange={setRoleFilter}
          options={[
            { id: "", label: t.allRoles },
            ...ROLES.map((r) => ({ id: r.id, label: r.label[lang] })),
          ]}
        />
        <Select
          id="ua-filter-active"
          label={t.status}
          value={activeFilter}
          onChange={setActiveFilter}
          options={[
            { id: "", label: t.allStatuses },
            { id: "yes", label: t.active },
            { id: "no", label: t.inactive },
          ]}
        />
      </div>

      <FilterChips
        active={active}
        lang={lang}
        onClearAll={() => {
          setRoleFilter("");
          setActiveFilter("");
        }}
      />

      <div className="mt-4">
        <DataTable
          columns={columns}
          rows={visible}
          lang={lang}
          caption={t.heading}
          minWidth="66rem"
          empty={t.noMatch}
        />
      </div>

      <Rationale>{t.retentionNote}</Rationale>
    </Panel>
  );
}
