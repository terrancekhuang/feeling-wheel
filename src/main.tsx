import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Wheel from "./Wheel";
import EmotionPage from "./EmotionPage";
import About from "./About";
import { APP, pages, root } from "./content";
import { usePath, linkTo } from "./router";


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
      <footer className="px-4 pb-6 text-center text-sm text-ink-soft">
        <a href="/about" onClick={linkTo("/about")} className="hover:text-ink underline-offset-2 hover:underline">About</a>
      </footer>
    </div>
  );
}

function Home() {
  return (
    <>
      <h1 className="font-serif text-3xl sm:text-4xl text-center mt-6 mb-6 sm:mb-8">What are you feeling?</h1>
      {root.children ? (
        <>
          <Wheel initial={(history.state as { focus?: string } | null)?.focus ?? undefined} />
          <p className="mt-6 text-center text-sm text-ink-soft max-w-sm mx-auto">Not sure? Tap the closest one; you can go deeper.</p>
        </>
      ) : (
        <p className="mt-10 text-center font-serif text-lg text-ink-soft">The first feelings are being prepared. Please check back soon.</p>
      )}
    </>
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
