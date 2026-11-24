# Milestone 1 — Taxonomy + Wheel: log

## What's new in the app

- A home screen asks **"What are you feeling?"** and shows a colourful emotion wheel in the warm paper style (cream page, deep ink, serif headings, muted earthy colours). It has a matching warm-charcoal dark mode that follows the phone setting.
- **7 core emotions**: Fear, Sadness, Anger, Shame, Loneliness, Weariness and Doubt. Each branches into **36 middle** and **102 specific** emotions, all with a one-line description. Every entry is an AI draft marked *not reviewed*.
- Tap a slice to **zoom into it**. The centre shows that emotion's name, a **Read verses** button, and a back link to zoom out. Tapping the centre also zooms out.
- Tapping a specific (outermost) emotion opens its page. For now that page shows the name, description, a breadcrumb and a "coming soon" note.
- **Back to the wheel** returns you to the spot you came from. Browser Back works too.
- The wheel works with a **keyboard** (Tab to a slice, Enter to open it) and announces each zoom to screen readers.
- If the content file has a mistake (a duplicate link, a missing description, a fourth ring), the app **refuses to build** and says exactly what's wrong and where.

## What was built

- `content/emotions.yaml`: the emotion tree, the one file the author edits. Its header comment explains the format.
- `content/validate.js`: the shape check (unique and valid slugs, required fields, true/false flags, max 3 rings, reserved slugs such as `about`). It runs inside the build and in `pnpm test`.
- `content/validate.test.js`: checks that the real content file is valid and that each class of error is caught.
- `vite.config.ts`: Vite + React + Tailwind v4, plus a small plugin that turns `.yaml` into a JS module after validating it.
- `src/content.ts`: builds the d3 partition (the invisible root holds the core ring), a `bySlug` lookup, and `fill()` (family colour mixed with paper by ring).
- `src/Wheel.tsx`: the zoomable sunburst. The standard D3 pattern is rendered in React, and animation interpolates each slice's angle, ring and opacity. Labels pick the largest size and orientation (along the arc or radial, one or two lines) that fits, and hide otherwise.
- `src/router.ts`: a tiny pushState router (`usePath`, `navigate`, `linkTo`).
- `src/main.tsx`: the app shell, home page, placeholder emotion page and not-found page.
- `src/index.css`: design tokens (`--paper`, `--ink`, `--accent`, `--family-0..6`, `--mix-1..3`) with light and dark values.

Commands: `pnpm dev`, `pnpm build`, `pnpm test`, `pnpm preview`.

## Decisions not pre-specified in the PRD

- **Seven core emotions.** The author added Doubt as a 7th core during planning.
- **Ring and parent come from nesting** in the YAML instead of being written as fields on each entry. This makes them impossible to get out of sync. The PRD data model still holds conceptually.
- **Suggested crisis flags** (for the author to check): Hopeless, Despairing, Not wanting to live, Empty, Worthless, Ready to give up.
- **System fonts, no web fonts.** Scripture and headings use Iowan Old Style, then Palatino, then Noto Serif, then Georgia. The UI uses system-ui. This needs no downloads and is already offline-friendly for milestone 3.
- **Slice size** is proportional to how many specific emotions sit beneath it, as in the standard sunburst.
- **Labels that don't fit are hidden**, mostly on phones in the outer ring. Each one appears after one more zoom. The full name is always available to screen readers and as a hover tooltip.
- **The zoom level is saved in browser history.** Back, refresh, and "Back to the wheel" all restore it. "Back to the wheel" zooms to the emotion itself if it has children, otherwise to its parent.
- **The root centre** shows "Tap a feeling", because the PRD didn't say what the centre shows before any zoom.
- **Hand-rolled router** of about 15 lines instead of a routing library, since the routes are flat (`/`, `/:slug`, and `/about` later).

## For milestone 2

- `bySlug.get(slug)` gives a d3 node. Use `node.ancestors()` for the breadcrumb, `node.children` for the "Go deeper" chips, and `node.data` for the content.
- Add the new fields (verses, reflection, prayer, action) to the `Emotion` type in `src/content.ts` and to `content/validate.js`. The validator is the natural home for the full content check.
- Replace `EmotionPlaceholder` in `src/main.tsx` with the real page. **The placeholder has no crisis banner yet.** Nothing is deployed until milestone 3, but the banner must land in milestone 2.
- The review gate can filter the tree in `src/content.ts` before the partition is built. Draft preview can be an env flag (for example `pnpm dev` shows drafts and `build` doesn't).

## Deviations from the PRD

- 102 specific emotions, slightly above the ~80–100 target. Easy to trim during review.
- The visual style is built in code rather than as a mockup. The author approves or adjusts it from the running app before milestone 2.
