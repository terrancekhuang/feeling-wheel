import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Wheel from "./Wheel";
import { bySlug } from "./content";
import { usePath, linkTo } from "./router";

const APP = "Feeling Wheel"; // working name

function App() {
  const path = usePath();
  const slug = decodeURIComponent(path.slice(1).replace(/\/$/, ""));
  const node = slug ? bySlug.get(slug) : undefined;

  useEffect(() => {
    document.title = node ? `${node.data.name} · ${APP}` : slug ? `Not found · ${APP}` : APP;
  }, [node, slug]);

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="px-4 pt-4 sm:px-6">
        <a href="/" onClick={linkTo("/")} className="font-serif text-sm tracking-wide text-ink-soft hover:text-ink">
          {APP}
        </a>
      </header>
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-10">
        {!slug ? <Home /> : node ? <EmotionPlaceholder slug={slug} /> : <NotFound />}
      </main>
    </div>
  );
}

function Home() {
  return (
    <>
      <h1 className="font-serif text-3xl sm:text-4xl text-center mt-6 mb-6 sm:mb-8">What are you feeling?</h1>
      <Wheel initial={(history.state as { focus?: string } | null)?.focus ?? undefined} />
      <p className="mt-6 text-center text-sm text-ink-soft max-w-sm mx-auto">Not sure? Tap the closest one; you can go deeper.</p>
    </>
  );
}

// Milestone 1 placeholder: real emotion pages (verses, prayer, next step) arrive in milestone 2.
function EmotionPlaceholder({ slug }: { slug: string }) {
  const node = bySlug.get(slug)!;
  const trail = node.ancestors().reverse().slice(1);
  // Back to the wheel, zoomed to this emotion if it has children, else to its parent.
  const back = node.children ? node : node.parent!;
  const backState = { focus: back.depth ? back.data.slug : null };
  return (
    <article className="mt-8 max-w-prose mx-auto">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
        {trail.map((n, i) => (
          <span key={n.data.slug}>
            {i > 0 && <span aria-hidden> › </span>}
            {n === node ? <span aria-current="page">{n.data.name}</span> : <a href={`/${n.data.slug}`} onClick={linkTo(`/${n.data.slug}`)} className="hover:text-ink underline-offset-2 hover:underline">{n.data.name}</a>}
          </span>
        ))}
      </nav>
      <h1 className="font-serif text-4xl mt-3">{node.data.name}</h1>
      <p className="mt-2 text-lg text-ink-soft">{node.data.description}</p>
      <div className="mt-8 rounded-lg border border-line bg-paper-2 p-5 text-ink-soft">
        Verses, a prayer and a next step for this feeling are coming soon.
      </div>
      <a href="/" onClick={linkTo("/", backState)} className="inline-block mt-8 rounded-full bg-accent text-accent-ink text-sm font-medium px-4 py-2 hover:opacity-90">
        ‹ Back to the wheel
      </a>
    </article>
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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
