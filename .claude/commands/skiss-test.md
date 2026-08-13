---
description: Walk a MIIS scenario in a real browser, screenshot every step, report where the flow breaks
argument-hint: "US-01 | US-07 | US-11"
---

Walk the MIIS user scenario **$ARGUMENTS** through the running mockup as if you were the
role who performs it, and report what a customer would notice in a live demo.

## Setup

Make sure the dev server is up (`npm run dev`, http://localhost:8080). Read the scenario
in `docs/requirements/requirements-v2.5-EN.txt` first so you know the steps the spec
prescribes and the role who performs them.

## Walk it

Start where the role would actually start — the start page — and click through the whole
main flow in the browser. At each step: screenshot into `screenshots/`, note which
requirement step it corresponds to, and note anything a user would stumble on.

Then try the alternative and exception flows the spec lists for this scenario.

## Report

**Step-by-step** — what the flow currently looks like, with the screenshots.

**Breaks** — ranked by how bad they'd look in front of the customer:
- dead ends: a step with no way forward or back
- steps the spec requires that have nowhere to happen in the UI
- states that were never designed (empty, error, loading, AI-proposal-rejected)
- controls that look interactive but do nothing (acceptable in a mockup, but they must
  not be on the demo path)
- navigation that loses the user's context

**Accessibility on this path** — keyboard reachability, focus visibility, whether any
status is communicated by colour alone.

**The demo line** — if this scenario is shown in the 15-minute oral presentation, which
screens in which order, and the one sentence to say on each.

Do not fix anything yet. Report first; I'll decide what's worth the time.
