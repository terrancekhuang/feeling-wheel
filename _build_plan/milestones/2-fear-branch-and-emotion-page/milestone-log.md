# Milestone 2 — Fear Branch + Emotion Page: log

## What's new in the app

- **Every emotion has a real page:** a breadcrumb (Fear › Worried › Anxious), the name and description, then **God sees this**, **Truth to hold** and **A next step** (Reflect, Pray, Do). Core and middle emotions also offer "Can you name it more closely?" chips.
- **All 21 Fear emotions are fully drafted.** That's 87 verse slots, every one checked against its actual BSB wording, plus a question, prayer and action for each.
- **Verse cards** show the exact BSB text and reference, with a **Copy** button that copies `“text” — Psalm 42:5 (BSB)` and briefly shows "Copied".
- **The crisis banner** appears on every crisis-flagged emotion, above everything else, and can't be dismissed. It offers Call 988, Text 988, a link to findahelpline.com, and the line "If you're in immediate danger, call your local emergency number." It shows even when the page's content is still being prepared.
- **Review gate:** `pnpm dev` shows everything, with a "DRAFT · not reviewed" badge on unreviewed pages. A real build (`pnpm build`) shows only reviewed emotions plus the path down to them. Unreviewed links say "This page is still being prepared." With nothing reviewed yet, the home page says the first feelings are being prepared.
- **Content check:** `pnpm check` prints problems that block publishing, "worth a second look" notes, "Reviewed: X of Y" and "Fully drafted: X of Y". The same check runs inside every build, so a failing check stops the build.

## What was built

- `content/bsb.txt`: the full Berean Standard Bible (public domain, 4.3 MB), downloaded from bereanbible.com. `.gitattributes` keeps it out of diffs.
- `content/bible.js`:
  - `loadBible()`.
  - `resolveVerse()`: turns a reference, a range of up to 4 verses, or `{ref, excerpt}` into exact text. Excerpts must be word-for-word, ignoring straight vs curly quotes.
  - `verseNotes()`: flags Psalm titles and "Selah".
  - A lone unmatched opening or closing quote mark is dropped from displayed text.
- `content/validate.js`: the full content check. It covers shape, unknown or typo'd fields, verse validity, max 4 verses per group, duplicate verses on a page, and completeness for reviewed entries.
- `content/publish.js`: fills in verse text and strips content from unreviewed entries in live builds.
- `content/check.js`: the `pnpm check` report.
- `vite.config.ts`: the plugin runs the check, then publishes. Drafts mode is on for `serve` and off for `build`. Override with `DRAFTS=1` or `DRAFTS=0`.
- `src/content.ts`: the `shows()` gate, the wheel's partition built from the gated tree, and `pages` (every slug, including hidden ones, so the "still being prepared" page works).
- `src/EmotionPage.tsx`: the page, verse cards with copy, the steps and the crisis banner. Icons are small inline SVGs, with no icon library.
- Tests (`pnpm test`, 5): the real file passes, resolution and excerpts, quote tidying, title notes, shape errors, draft vs reviewed rules, and publish stripping.

## Decisions not pre-specified in the PRD

- **References only in the content file** (the author's choice). The BSB file is committed (also the author's choice).
- **Field names:** `god_sees_this`, `truth_to_hold`, `reflection`, `prayer`, `action`. Prose uses `>-` blocks so apostrophes and quotes need no escaping.
- **Ranges:** limited to the same chapter and at most 4 verses, to keep cards short.
- **Psalm titles:** in the BSB, a psalm's title is part of verse 1 (e.g. Psalm 62:1 begins "For the choirmaster…"). Fear entries use excerpts for these, and `pnpm check` notes any new ones.
- **Copy format:** when a verse already contains a quotation, the copied text isn't wrapped in extra quotes, to avoid doubled marks like `““…””`.
- **The crisis banner shows even on "still being prepared" pages.** Safety beats the gate.
- **Live builds keep unreviewed names and descriptions** (for the "still being prepared" page), but not their verses or prose.
- **"Back to the wheel"** zooms to the emotion itself if the wheel can show its children, otherwise to its parent.
- **No breadcrumb on core pages**, since it would only repeat the heading.
- **The banner offers both Call 988 and Text 988** as separate buttons.

## For milestone 3

- Real links need a fallback so `/anxious` serves `index.html` on Cloudflare Pages. A refresh on a deep link currently works only because the Vite dev and preview servers fall back automatically.
- Link previews need per-emotion `<title>` and description in the served HTML. Today they're set client-side only (`document.title`). Emotion data is available at build time in the Vite plugin.
- Publish must go through `pnpm build`, which already fails on content errors.
- Testing tip: `DRAFTS=0 pnpm dev` shows exactly what live will show.

## Deviations from the PRD

- None in scope. The Fear content is an AI draft, and nothing is marked reviewed. Only the author does that.
