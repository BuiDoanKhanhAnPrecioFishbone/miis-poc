# design/ — the bridge to Claude Design

This folder holds the MIIS design system as it exists in **Claude Design**
(claude.ai/design). It is reference material, not application code.

## What lives here

Component previews and specs synced from the Claude Design project — buttons, form
fields, panels, tables, status coding, the AI-proposal pattern, alerts — each with its
states. The application's real components live in `src/components/`, and Claude Code
translates from here to there. Nothing in this folder is imported by the app.

## Syncing

In Claude Code:

```
Sync my "MIIS Design System" project from Claude Design into design/
```

It lists your design projects, shows exactly which files it will read or write, and
pulls them down. The reverse works too:

```
Push the MIIS components in src/components/miis/ up to my Claude Design project
```

The first sync asks permission to reach your claude.ai design projects.

## Source inputs

The design system is derived from the customer's identity — see `../docs/design-system/`
for `design-tokens.json`, `mi-design-system.css`, `tailwind-mi-theme.ts` and the
`MI_Design_System.pdf` specification. Those are the source of truth; anything designed
in Claude Design must stay consistent with them.

Note the caveats the design-system package itself carries: the palette is an *extended
working palette* derived from MI's visible identity and must be validated against the
customer's real brand files before production. The font is a deliberate system fallback
(Arial/Helvetica) because MI's licensed brand font could not be verified. **The logo
contains a protected Swedish state emblem and must never be redrawn or generated** —
placeholder only until MI supplies the official asset.
