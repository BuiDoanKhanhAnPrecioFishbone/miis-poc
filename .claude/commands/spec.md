---
description: Pull everything the requirement spec says about a scenario or feature ID, and what it implies for the interface
argument-hint: "US-08 | FA-007 | partsträffar"
allowed-tools: Read, Grep, Glob
---

Research what the MIIS requirement specification says about: **$ARGUMENTS**

Sources, in this order:

1. `docs/requirements/requirements-v2.5-EN.txt` — the full spec. Search it for the
   scenario ID, the feature IDs it verifies, and any chapter-4 concept it references.
2. `docs/sketches/` — if a sketch covers this area, read it.
3. `app/(miis)/` — what, if anything, exists in the mockup today, and
   `lib/domain/` — which of these concepts are already modelled as types.

Then report, concisely:

**Role and goal** — who does this and what they are trying to achieve.

**Main flow** — the numbered steps from the spec, in the spec's own order.

**Alternative and exception flows** — including the ones people forget: missing
information, an AI proposal being wrong, an access attempt being denied.

**Fields the spec names explicitly** — list every one. The spec is unusually specific
(e.g. mediation outcome requires type of mediation, industrial action, type of
industrial action, lost working days, number of affected employees). Missing a named
field is a scoring loss.

**Feature IDs to display** — the IDs this screen must carry as `<ReqTag />`.

**Domain concepts in play** — pull the relevant definitions from chapter 4 (avtal,
avtalskonstruktion, avtalsområde, förhandling, förhandlingsordningsavtal, medling, part,
partsträffar, rapporturval, samverkansorgan, Märket).

**Interface implications** — 3–6 bullets: what this actually demands of the screen.
Include the states that must exist (empty, incomplete, error, AI-rejected) and anything
the spec implies about time-awareness or history.

**Swedish terminology** — the correct Swedish label for each concept, since the spec
text you are reading is an English translation and the UI must be Swedish.

Do not write any code. This is research.
