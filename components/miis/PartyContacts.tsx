"use client";

import { useState } from "react";

import type { Lang } from "@/lib/domain/lang";
import type { ContactPerson } from "@/lib/domain/party";
import { dictionary } from "@/lib/i18n";
import { IconClose, IconPlus } from "./icons";
import { Button, Callout, FormGrid, Panel, Rationale, TextField,
  EmptyState,
} from "./primitives";

/**
 * FP-006's contact persons — *"stödja **koppling till** kontaktpersoner"*.
 *
 * The requirement names the four fields (namn, titel, telefon, e-post) and the
 * word that matters is the verb: the register has to *support the coupling*.
 * A list that can only be read supports nothing — an organisation whose
 * negotiator changes, which happens every bargaining round, had no way into the
 * record, so FP-006 was demonstrated as far as displaying a value MI would have
 * had to enter somewhere else.
 *
 * A contact is removed rather than deactivated, and that is a deliberate
 * difference from a user (NFL-001 logged their sign-ins) and from a mediator
 * (FF-009 counts their assignments). A contact person carries no history of
 * their own — they are a way of reaching an organisation, and when it is no
 * longer the way, keeping it is keeping a wrong telephone number.
 */
export function PartyContacts({
  contacts: initial,
  lang,
}: {
  contacts: ContactPerson[];
  lang: Lang;
}) {
  const d = dictionary(lang);
  const t = d.parter.detail;

  const [contacts, setContacts] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState<string | null>(null);

  function reset() {
    setName("");
    setTitle("");
    setPhone("");
    setEmail("");
    setAdding(false);
  }

  function add() {
    const value = name.trim();
    if (!value) return;
    setContacts((list) => [
      ...list,
      { name: value, title: title.trim(), phone: phone.trim(), email: email.trim() },
    ]);
    setNote(t.contactAdded(value));
    reset();
  }

  function remove(c: ContactPerson) {
    setContacts((list) => list.filter((x) => x !== c));
    setNote(t.contactRemoved(c.name));
  }

  return (
    <Panel title={t.contacts} tags={["FP-006", "FH-001"]}>
      {note && (
        <div className="mb-4">
          <Callout tone="ok" live tags={["FP-006", "FH-001"]}>
            {note}
          </Callout>
        </div>
      )}

      {contacts.length === 0 ? (
        <EmptyState text={t.noContacts} />
      ) : (
        <ul className="space-y-3">
          {contacts.map((c) => (
            <li
              key={`${c.name}-${c.email}`}
              className="flex items-start justify-between gap-3 border-t border-border pt-3 first:border-t-0 first:pt-0"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{c.name}</p>
                <p className="text-label text-muted-foreground">{c.title}</p>
                <p className="text-label tabular-nums text-muted-foreground">
                  {c.phone} · {c.email}
                </p>
              </div>
              <Button
                size="sm"
                variant="danger"
                iconStart={<IconClose />}
                onClick={() => remove(c)}
              >
                {t.contactRemove}
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="print-hide mt-5 border-t border-border pt-4">
        {adding ? (
          <>
            <h3 className="mi-kicker mb-3 text-muted-foreground">{t.contactAdd}</h3>
            {/* The four fields FP-006 names, in its order. */}
            <FormGrid>
              <TextField
                id="pc-name"
                label={t.contactName}
                width="medium"
                required
                lang={lang}
                value={name}
                onChange={setName}
              />
              <TextField
                id="pc-title"
                label={t.contactTitle}
                width="medium"
                value={title}
                onChange={setTitle}
              />
              <TextField
                id="pc-phone"
                label={t.contactPhone}
                width="short"
                numeric
                value={phone}
                onChange={setPhone}
              />
              <TextField
                id="pc-email"
                label={t.contactEmail}
                width="medium"
                value={email}
                onChange={setEmail}
              />
            </FormGrid>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button
                onClick={add}
                disabled={name.trim().length === 0}
                disabledReason={t.contactNameRequired}
              >
                {t.contactSave}
              </Button>
              <Button variant="ghost" onClick={reset}>
                {d.common.cancel}
              </Button>
            </div>
          </>
        ) : (
          <Button variant="secondary" iconStart={<IconPlus />} onClick={() => setAdding(true)}>
            {t.contactAdd}
          </Button>
        )}
      </div>

      <Rationale>{t.contactNote}</Rationale>
    </Panel>
  );
}
