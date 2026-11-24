import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Wheel from "./Wheel";
import EmotionPage from "./EmotionPage";
import About from "./About";
import { APP, pages, root, shows, type Page } from "./content";
import { usePath, linkTo, navigate } from "./router";


function App() {
  const { path, n } = usePath();
  const slug = decodeURIComponent(path.slice(1).replace(/\/$/, ""));
  const about = slug === "about";
  const node = slug ? pages.get(slug) : undefined;

  useEffect(() => {
    document.title = about ? `About · ${APP}` : node ? `${node.data.name} · ${APP}` : slug ? `Not found · ${APP}` : APP;
  }, [about, node, slug]);

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="px-4 pt-4 sm:px-6">
        <a href="/" onClick={linkTo("/")} className="font-serif text-sm tracking-wide text-ink-soft hover:text-ink">
          {APP}
        </a>
      </header>
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-10">
        {!slug ? <Home key={n} /> : about ? <About /> : node ? <EmotionPage key={slug} slug={slug} /> : <NotFound />}
      </main>
      {!about && (
        <footer className="px-4 pb-6 text-center text-sm text-ink-soft">
          <a href="/about" onClick={linkTo("/about")} className="hover:text-ink underline-offset-2 hover:underline">About</a>
        </footer>
      )}
    </div>
  );
}

function Home() {
  return (
    <>
      <h1 className="font-serif text-3xl sm:text-4xl text-center mt-6">What are you feeling?</h1>
      <p className="mt-2 mb-6 sm:mb-8 text-center text-ink-soft">See what God's Word has to say about it.</p>
      {root.children ? (
        <>
          <Wheel initial={(history.state as { focus?: string } | null)?.focus ?? undefined} />
          <p className="mt-6 text-center text-sm text-ink-soft max-w-sm mx-auto">Not sure? Tap the closest one; you can go deeper.</p>
          <Search />
        </>
      ) : (
        <p className="mt-10 text-center font-serif text-lg text-ink-soft">The first feelings are being prepared. Please check back soon.</p>
      )}
    </>
  );
}

const searchable = [...pages.values()].filter((n) => shows(n.data));

/** Every query word must start a word in the name, search words ("also") or description. Ranked: name starts with the query, then name/search-word matches, then description-only. */
function search(q: string) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const has = (text: string, w: string) => text.toLowerCase().split(/[^a-z']+/).some((t) => t.startsWith(w));
  const named = (n: Page) => words.every((w) => has(n.data.name, w) || has(n.data.also?.join(" ") ?? "", w));
  const rank = (n: Page) => (n.data.name.toLowerCase().startsWith(q.trim().toLowerCase()) ? 2 : named(n) ? 1 : 0);
  return searchable
    .filter((n) => words.every((w) => has(n.data.name, w) || has(n.data.also?.join(" ") ?? "", w) || has(n.data.description, w)))
    .sort((a, b) => rank(b) - rank(a))
    .slice(0, 8);
}

function Search() {
  const [q, setQ] = useState("");
  const results = search(q);
  return (
    <form
      role="search"
      className="mt-8 max-w-sm mx-auto"
      onSubmit={(e) => {
        e.preventDefault();
        if (results[0]) navigate(`/${results[0].data.slug}`);
      }}
    >
      <label htmlFor="search" className="block text-center text-sm text-ink-soft">Or type what you're feeling</label>
      <input
        id="search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="e.g. tired, alone, afraid"
        autoComplete="off"
        className="mt-2 w-full rounded-full border border-line bg-paper-2 px-4 py-2 text-base placeholder:text-ink-soft/70 focus-visible:outline-2 focus-visible:outline-ink"
      />
      {q.trim() && (
        <ul className="mt-2 divide-y divide-line rounded-2xl border border-line bg-paper-2" aria-live="polite">
          {results.length ? (
            results.map((n) => (
              <li key={n.data.slug}>
                <a href={`/${n.data.slug}`} onClick={linkTo(`/${n.data.slug}`)} className="block px-4 py-2.5 hover:bg-paper focus-visible:outline-2 focus-visible:outline-ink">
                  <span className="font-medium">{n.data.name}</span>
                  <span className="block text-sm text-ink-soft">{n.data.description}</span>
                </a>
              </li>
            ))
          ) : (
            <li className="px-4 py-2.5 text-sm text-ink-soft">No match. Try another word, or tap the closest feeling on the wheel.</li>
          )}
        </ul>
      )}
    </form>
  );
}

function NotFound() {
  return (
    <div className="mt-16 text-center">
      <h1 className="font-serif text-3xl">We couldn't find that feeling</h1>
      <a href="/" onClick={linkTo("/")} className="inline-block mt-6 text-accent underline underline-offset-2">Go to the wheel</a>
    </div>
  );
}

// Offline support (live builds only; `pnpm build` writes sw.js).
if (import.meta.env.PROD && "serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
