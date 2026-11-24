# Milestone 3 — Share, Offline & Soft Launch: log

## What's new in the app

- **Every emotion's link works on its own.** `site/anxious` opens straight to the Anxious page, on a first visit, a refresh, or from a shared message.
- **Tidy link previews.** Pasting `/anxious` into a chat app shows "Anxious · Feeling Wheel" and "A restless dread about what might happen."
- **Share button** under each emotion's description. On phones it opens the share sheet. On desktop it copies the link and shows "Link copied".
- **Installable.** Add to Home Screen (phone) or the browser's install button (desktop). It opens full screen with a small wheel icon on a cream splash.
- **Works offline after the first visit.** The wheel, every page, every verse and the About page all work in airplane mode. A new version downloads quietly in the background and shows up on the next open, with no note.
- **About page**, linked from a small footer on every page. It covers why the app exists, how to use it in 3 steps, "a devotional aid, not counselling or medical care" with 988 and findahelpline.com, BSB attribution, the hand-review promise and the contact email.
- **One-command publish:** `pnpm release` builds (stopping if the content check fails) and uploads to Cloudflare Pages.

## What was built

- `public/manifest.webmanifest`, `public/icon.svg`, `public/icon-{180,192,512}.png`. The icon is a 7-wedge, two-ring wheel in the family colours, drawn inside the maskable safe zone so one PNG serves as both "any" and "maskable". The PNGs were rendered from the SVG with `rsvg-convert`.
- `index.html`: Open Graph and Twitter tags, the manifest, the icons and apple-touch-icon.
- `sw.js` (repo root, a template): cache-first for every file, and every navigation gets the cached app shell (`/`). Install precaches, `skipWaiting` and `clients.claim` run, and old caches are deleted on activate.
- `vite.config.ts`: `writeBundle` (build only) writes:
  - `dist/<slug>.html` for every emotion, plus `dist/about.html`. Each is `index.html` with that page's title, description and og tags.
  - `dist/sw.js` with the precache list (`/`, bundle assets, everything in `public/`) and a version hash.
- `content/publish.js`: `withMeta()` and `sentence()`, with a test in `content/validate.test.js`.
- `src/About.tsx`, plus the `/about` route and footer in `src/main.tsx`. `APP` moved to `src/content.ts`.
- `src/EmotionPage.tsx`: `ShareButton`.
- `src/main.tsx`: registers the SW in production only, so dev is never cached.
- `package.json`: `pnpm release` = `pnpm build && pnpm dlx wrangler@4 pages deploy dist --project-name feeling-wheel --branch main`.

## Decisions not pre-specified in the PRD

- **Hand-written service worker (~25 lines) instead of vite-plugin-pwa or Workbox.** There's one JS and one CSS file, and the content is bundled into the JS, so a precache list is all that's needed.
- **Clean URLs come from real files.** Cloudflare Pages serves `/anxious` from `anxious.html`. With no top-level `404.html`, Pages treats the site as a SPA and serves `index.html` for unknown paths, so no `_redirects` is needed. Vite preview does the same.
- **Previews are generated for every page, including unreviewed ones.** Live builds already ship unreviewed names and descriptions for the "still being prepared" page (milestone 2 decision).
- **The shell is cached under `/`, not `/index.html`,** because Pages redirects `/index.html` → `/`, and a redirected response can't answer a navigation.
- **Cache matching uses `ignoreVary`.** The preview server (and possibly Pages) sends `Vary: Origin`, and the module script's CORS request didn't match the precached copy. Offline loads failed until this was fixed.
- **Share:** the share sheet is used only on touch devices (`pointer: coarse`). Desktop always copies, as the PRD describes.
- **No "Updated" note** (author's choice).
- **wrangler runs through `pnpm dlx`,** not as a devDependency, to keep `node_modules` small. It's named `release` because `pnpm deploy` is a built-in pnpm command.
- **Contact email:** terrancehuang@proton.me (author's choice), in `CONTACT` in `src/About.tsx`.

## For milestone 4

- No app changes are expected. Content edits flow through `pnpm release`, and installed apps pick them up on the second open after a deploy.
- To test what live will show: `pnpm build && pnpm preview`. `DRAFTS=1 pnpm build` makes a drafts build for checking offline behaviour with real content.
- Renaming a slug breaks links people have already shared. Pages has no redirects yet. Add `public/_redirects` (`/old /new 301`) if that happens.

## Deviations from the PRD

- None. As of this log nothing is marked reviewed, so the live site shows "The first feelings are being prepared" until the author reviews Fear entries and re-runs `pnpm release`.
