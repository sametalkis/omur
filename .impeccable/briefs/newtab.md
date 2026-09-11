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

Live ticking age counter (Memento Mori), editable goal cards with progress bars, personal images uploaded per goal.

## Constraints

- Manifest V3 browser extension, pure HTML/CSS/JS
- All data local (chrome.storage.local)
- Must not degrade new-tab load time
- Cross-browser: Chrome, Firefox, Edge

## Direction contract

THESIS: A single sheet of vermilion washi becoming a life through deliberate folds — every goal is a crease that brings the flat sheet closer to flight. The category default (dark grid of rounded cards with a digital clock) is refused; the page is a folding surface, not a dashboard.

OWN-WORLD: Vermilion (#D83A2E) washi paper ground with visible kozo fiber texture, fold-white (#F6F1E9) crease lines dividing goal regions, washi cream (#EDE3D1) content panels, gold dot (#D4AF37) marking the active/current step, sumi black (#1A1A1A) ink for text, ink fade (#8E8A83) for secondary labels. Quiet humanist sans (Hikari Sans / closest obtainable: Noto Sans or Source Sans 3) for body, small tracked caps for UI labels, tabular numerals in margin positions. Components built from the fold vocabulary: cards open along crease lines, progress is a sequence of fold steps (flat → preliminary base → bird base → crane), the age counter ticks inside a step-number frame.

STORY: The visitor arrives at a vermilion sheet. The ticking age counter sits in the margin like a fold-step number — time as the current fold. Below, their goals are arranged as fold panels on the sheet, each showing its name, a progress bar styled as fold-step dots (filled = completed steps, hollow = remaining), and an optional uploaded image as a small washi-textured thumbnail. The sheet's crease lines connect the goals, implying that each contributes to the whole form. Editing is intimate: tapping a goal unfolds its detail panel with a paper-opening animation.

FIRST VIEWPORT: The full vermilion washi sheet fills the viewport as ground. Top-left margin column: the age counter as a large step number (e.g. "23.604812") in sumi black with a gold dot beside it, ticking. Below the number, a single-line label in tracked caps: "YAŞINIZ" or the equivalent. The remaining viewport is divided by fold-white crease lines into goal panels — a 2-column layout of goal cards on the washi cream ground, each card carrying: step number (fold position), goal title in humanist sans, fold-step progress dots, and a small vermilion-tinted thumbnail where the user uploaded an image. One gold dot marks the goal currently in focus. The bottom margin carries a minimal action bar in sumi black: "HEDEF EKLE" (add goal) and a settings gear, both as small tracked caps. The crease lines that separate the cards extend to the viewport edges, reinforcing the single-sheet metaphor.

FORM: Orizuru crane fold sequence. Position 7 (assigned) on the grounded list. Seed key 39942e53.

FINISH: Unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
