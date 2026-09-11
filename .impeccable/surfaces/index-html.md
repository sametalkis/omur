---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# New Tab — Surface Brief

## Scope

Browser new-tab override: the screen every tab open delivers.

## Visitor Mode

Operate — the visitor checks goals and feels time passing.

## Audience & Job

A person who sets personal goals and wants every new-tab moment to confront them with their ambitions and their mortality. Quick glance (seconds), occasional longer editing sessions.

## Action

Review goals, update progress, feel the urgency of passing time.

## Content

Monumental live ticking monospace age counter (Memento Mori) with 60Hz micro-ticker progression bar, editable brutalist goal cards with block/ASCII progress bars, personal goal image uploads, persistent add goal action and full empty-state recovery.

## Constraints

- Manifest V3 browser extension, pure HTML/CSS/JS
- All data local (chrome.storage.local / localStorage fallback)
- Must not degrade new-tab load time (<50ms render)
- Cross-browser: Chrome, Brave, Edge

## Direction contract

THESIS: High-contrast E-Ink brutalist terminal where time is an uncompromising physical countdown. Refuses rounded decorative SaaS dashboard cards and fake gradients; embraces Swiss typographic grid, monospace telemetry, and continuous microsecond ticker progression.

OWN-WORLD: Stark ink black (#0A0A0A) on warm tactile E-ink paper white (#F4F4F0), crisp 1.5px architectural rules, monospace telemetry digits, solid black interactive blocks with inverted text on hover/active. Components built from brutalist grid: modular boxes, ASCII/solid block progress bars ([██████░░░░] 60%), permanent block CTA buttons, microsecond sweep ticker bar.

STORY: Opening a new tab immediately confronts the user with their exact age in towering monospace figures. Directly below, an unbroken horizontal ticker bar sweeps and pulses continuously in real time, dramatizing the unstoppable flow of seconds. Below, personal goals are organized in a clean 3-column brutalist matrix with visible progress and imagery. Clicking the counter opens instant birthdate editing; adding goals is always reachable via a permanent block action even if all goals are cleared.

FIRST VIEWPORT: Full-width monospace age counter (e.g. 24.1849206) dominating the top horizon. Immediately underneath: a live continuous horizontal micro-ticker rule with pulsating tick segments representing second and year progression. Below: a 3-column architectural grid of goal cards, each framed with crisp ink borders, category tag, goal title, percentage block bar, and optional framed image. Centered or anchored below: permanent "+ HEDEF EKLE" button and status bar with quick settings.

FORM: Minimalist Monolith / E-Ink Brutalist Terminal. Seed key 2eccd94e.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
