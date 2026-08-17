# Setting up a new laptop

Everything needed to work on this project the way it is being worked on now. About 20
minutes, most of it downloads.

Commands are PowerShell (Windows). On macOS use the same commands minus the PowerShell-
specific lines, which are marked.

## The short version

Install Node.js 22+, Git and Claude Code from their sites first, then:

```powershell
# project
git clone <repository-url> miis_poc
cd miis_poc
npm install

# Claude Code plugins
claude plugin install playwright@claude-plugins-official     # required for /flow-test
claude plugin install context7@claude-plugins-official       # recommended

# check
claude plugin list
npm run build
npm run dev                                                  # http://localhost:8080
```

Optional design skills are copied folders, not a command — see §4. Everything else
(project rules, the four slash commands, permissions) comes with the clone.

Details, verification and troubleshooting below.

---

## 1. Prerequisites

Install these first, in this order:

| Tool | Minimum | Where |
|---|---|---|
| **Node.js** | 22 LTS | https://nodejs.org — pick the LTS installer |
| **Git** | any recent | https://git-scm.com/downloads |
| **Claude Code** | 2.1+ | https://claude.com/claude-code |

Reference versions on the machine this project was built on:

```
node    v24.13.1
npm     11.8.0
git     2.53.0
claude  2.1.229
```

Verify all four are on PATH:

```powershell
node -v; npm -v; git --version; claude --version
```

If any command is not found, close and reopen the terminal — installers update PATH but
existing terminals don't pick it up.

---

## 2. Get the project

```powershell
cd C:\D                       # or wherever you keep projects
git clone <repository-url> miis_poc
cd miis_poc
npm install
npm run dev                   # http://localhost:8080
```

No repository URL yet? Copy the whole `miis_poc` folder across **except** `node_modules`
and `.next`, then run `npm install` in the copy.

Confirm it works before going further: open http://localhost:8080, click through the
left-hand menu, and use the role switcher in the top-right corner.

---

## 3. Claude Code plugins

One plugin is required. Run these from any directory.

### Required — Playwright

`/flow-test` does not work without it. That is the command that walks a scenario in a
real browser and screenshots each step.

```powershell
claude plugin install playwright@claude-plugins-official
```

If the marketplace isn't configured yet, add it first and re-run the install:

```powershell
claude plugin marketplace add anthropics/claude-plugins-official
```

The first `/flow-test` run downloads a browser — that takes a minute and only happens
once.

### Recommended — Context7

Fetches current documentation for Next.js, Tailwind and React instead of relying on the
model's training data. Cheap insurance against outdated answers.

```powershell
claude plugin install context7@claude-plugins-official
```

### Optional — Figma

Only if she works in Figma. It is installed but **disabled** on the current machine.

```powershell
claude plugin install figma@claude-plugins-official
```

### Verify

```powershell
claude plugin list
```

Expect `playwright@claude-plugins-official` with status `✔ enabled`.

---

## 4. Design skills (optional but recommended)

Two skills that improve design work. They are plain folders under `~/.claude/skills/`,
not marketplace plugins, so the reliable way to install them is to copy the folders.

| Skill | What it does |
|---|---|
| `ui-ux-pro-max` | Design intelligence — styles, palettes, font pairings, layout and accessibility guidance across React/Next/Tailwind/shadcn |
| `web-design-guidelines` | Reviews UI code against the Web Interface Guidelines. Pairs well with `/audit`. |

**Copy from the current machine** (run on the machine that already has them, pointing at
a shared folder or USB drive):

```powershell
$dest = "D:\claude-skills-bundle"          # change to your transfer location
New-Item -ItemType Directory -Force $dest | Out-Null
Copy-Item "$env:USERPROFILE\.claude\skills\ui-ux-pro-max" $dest -Recurse -Force
Copy-Item "$env:USERPROFILE\.claude\skills\web-design-guidelines" $dest -Recurse -Force
```

**Then on the new laptop:**

```powershell
$src = "D:\claude-skills-bundle"           # same location
New-Item -ItemType Directory -Force "$env:USERPROFILE\.claude\skills" | Out-Null
Copy-Item "$src\ui-ux-pro-max" "$env:USERPROFILE\.claude\skills\" -Recurse -Force
Copy-Item "$src\web-design-guidelines" "$env:USERPROFILE\.claude\skills\" -Recurse -Force
```

macOS: same, with `~/.claude/skills/` and `cp -R`.

Skills in that folder load automatically on the next Claude Code session — there is no
install step. To find others, run `/plugin` inside Claude Code and browse the
marketplaces, or ask Claude Code to use the `find-skills` skill.

**Skip GitNexus for now.** At this codebase size, reading files directly costs less than
indexing. Worth revisiting when the project grows.

---

## 5. What you do *not* install

These come with the repository. Cloning is the whole installation:

| Comes with the repo | What it is |
|---|---|
| `CLAUDE.md` | The project rules. Claude Code loads it automatically every session. |
| `.claude/commands/spec.md` | `/spec US-08` — research a scenario in the requirement spec |
| `.claude/commands/screen.md` | `/screen partstraffar` — design and build a screen end to end |
| `.claude/commands/flow-test.md` | `/flow-test US-01` — walk a flow in a browser, screenshot each step |
| `.claude/commands/audit.md` | `/audit` — audit WCAG, tokens, Swedish copy, architecture |
| `.claude/settings.json` | Permission allowlist, so routine commands don't prompt |

**Claude Design needs no installation either.** It is claude.ai/design in a browser, on
her own Claude login. Setup steps are in
[`05-claude-design-setup.md`](05-claude-design-setup.md).

---

## 6. Check it all works

Run these in order. Each should succeed before moving on.

```powershell
cd C:\D\miis_poc
npm run build          # production build incl. TypeScript — must pass
npm run lint           # architecture + Next.js rules — must pass
npm run dev            # then open http://localhost:8080
```

Then start Claude Code in the project folder:

```powershell
claude
```

and try each command:

| Try | Expect |
|---|---|
| `/spec US-08` | A structured summary of the party-meeting scenario, its fields and Feature IDs |
| `/audit` | An audit of the current screens, no crash |
| `/flow-test US-01` | A browser opens and screenshots land in `screenshots/` — **this is the one that proves Playwright installed correctly** |

If `/flow-test` fails, Playwright is missing or its browser hasn't downloaded. Re-run
step 3 and try again.

Health check for the whole installation:

```powershell
claude doctor
```

---

## 7. Common problems

| Symptom | Fix |
|---|---|
| `claude` / `node` not found | Reopen the terminal. Installers update PATH; open terminals keep the old one. |
| Port 8080 already in use | Something else is on it. Stop that, or change the port in `package.json` (`next dev -p 8080`). |
| `/flow-test` does nothing | Playwright plugin missing — see step 3. `claude plugin list` to confirm. |
| Slash commands missing | Claude Code must be started **from the project folder** — `.claude/commands/` is project-scoped. |
| Skills not appearing | They load at session start. Restart Claude Code after copying them in. |
| Build fails after pulling | `npm install` again — dependencies may have changed. |
| Swedish characters look wrong in the terminal | Cosmetic only; the files are UTF-8. Check the browser, not the terminal. |

---

## 8. First session

```
Read docs/00-START-HERE.md and docs/03-screen-backlog.md, then tell me the three
highest-value things to work on first and why.
```

That is a real question with a real answer, and it doubles as a check that Claude Code
can read the project.
