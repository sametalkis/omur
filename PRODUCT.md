# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Chrome/Chromium Manifest V3 extension (cross-browser compatible: Chrome, Firefox, Edge). Pure HTML/CSS/JS — no framework, no build step. `chrome_url_overrides: { "newtab": "index.html" }`.

## Users

Individuals who want every new browser tab to confront them with their goals instead of an empty or distracting default page. Primary user is someone who sets personal goals and wants a passive but persistent reminder of passing time and unfinished ambitions — every single time they open a tab.

## Product Purpose

Replaces the browser's default new-tab screen with two fused concepts:

1. **Memento Mori age counter** — the user enters their birth date; the page displays their age as a continuously ticking decimal (e.g. `23.604812…`), making the passage of time viscerally felt.
2. **Vision Board / Goal Tracker** — editable cards/pins for goals, each with percentage or stage-based progress bars, plus the ability to upload personal images tied to those goals.

The product exists to turn an otherwise wasted or distracting browser moment into a focused motivational touchpoint. Success means the user opens a new tab and is immediately re-centered on what matters to them.

## Positioning

A local-first, zero-server, zero-telemetry new-tab extension that combines a live age counter (Memento Mori) with a personal vision board — two concepts that reinforce each other but are typically separate apps.

## Operating Context

- Activated on every new-tab open and browser launch.
- All data stored locally (`chrome.storage.local` / browser equivalent); no accounts, no sync, no server.
- The user interacts in quick bursts (seconds per tab open) with occasional longer editing sessions to update goals, upload images, or adjust progress.

## Capabilities and Constraints

**Confirmed capabilities:**
- Continuously animated age counter from user-provided birth date
- Editable goal cards/pins with titles
- Percentage or stage-based progress bars per goal (Goal Tracker)
- Personal image upload for goals (stored locally)
- Goal archiving & unarchiving (hide completed 100% or inactive goals from the main board without losing history)
- Cross-browser support: Chrome, Firefox, Edge (Manifest V3 where supported, fallback for Firefox Manifest V2 if needed)

**Constraints:**
- Entirely local-first: zero server, zero telemetry, zero external requests
- Minimalist, non-distracting dark/utilitarian UI
- Must not degrade new-tab load time perceptibly

**Undecided:**
- Public release (Chrome Web Store / addons.mozilla.org) vs. personal use only — not yet decided
- Quotes/sayings section — not confirmed as a priority

## Brand Commitments

- Product name: **Ömür** (Turkish for "Life / Lifespan").
- Typography & Theme: High-contrast Minimalist Monolith / E-Ink Brutalist Terminal with 9-decimal precision age counter and tabular numerals.
- Progression mechanism: Automatic progress calculation through sub-tasks (alt hedefler); manual progress sliders are refused.
- Dynamic categories: Unlimited user-created categories.
- Mortality estimate: Toggleable on/off per user preference.

## Evidence on Hand

- Concept document: [Vision Board & Yaş Sayacı New Tab Eklentisi.md](file:///home/samuelvanunu/Downloads/Projeler/kernel-panic/00-Inbox/Vision%20Board%20%26%20Ya%C5%9F%20Sayac%C4%B1%20New%20Tab%20Eklentisi.md)
- No logos, brand assets, imagery, testimonials, or user research exist. Future work must not fabricate these.

## Product Principles

1. **Every tab is a mirror** — the new-tab moment belongs to the user's goals, not to noise.
2. **Time is the argument** — the ticking counter is not decoration; it is the product's emotional core.
3. **Local and private** — no server, no tracking, no account; the user's goals stay on their machine.
4. **Fast and invisible infrastructure** — the extension must never make a new tab feel slower.
5. **Minimal friction** — editing goals and tracking progress must be quick enough to happen in the flow of browsing.

## Accessibility & Inclusion

No product-specific accessibility standard established. The extension should follow basic web accessibility practices (keyboard navigable, sufficient contrast in dark theme, screen-reader-friendly goal cards).
