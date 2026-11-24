import { useState } from "react";
import { drafts, pages, shows, type Page, type Verse } from "./content";
import { linkTo } from "./router";

export default function EmotionPage({ slug }: { slug: string }) {
  const node = pages.get(slug)!;
  const e = node.data;
  const trail = node.ancestors().reverse().slice(1);
  const deeper = (node.children ?? []).filter((c) => shows(c.data));
  // Back to the wheel, zoomed to this emotion if the wheel can show its children, else to its parent.
  const back: Page = deeper.length ? node : node.parent!;
  const backState = { focus: back.depth ? back.data.slug : null };
  const ready = drafts || e.reviewed;
  const backLink = (
    <a href="/" onClick={linkTo("/", backState)} className="inline-block rounded-full bg-accent text-accent-ink text-sm font-medium px-4 py-2 hover:opacity-90">
      ‹ Back to the wheel
    </a>
  );

  return (
    <article className="mt-6 max-w-prose mx-auto">
      {backLink}
      <nav aria-label="Breadcrumb" className="mt-4 text-sm text-ink-soft" hidden={trail.length < 2}>
        {trail.map((n, i) => (
          <span key={n.data.slug}>
            {i > 0 && <span aria-hidden> › </span>}
            {n === node ? (
              <span aria-current="page">{n.data.name}</span>
            ) : (
              <a href={`/${n.data.slug}`} onClick={linkTo(`/${n.data.slug}`)} className="hover:text-ink underline-offset-2 hover:underline">
                {n.data.name}
              </a>
            )}
          </span>
        ))}
      </nav>

      <header className="mt-3">
        {drafts && !e.reviewed && (
          <p className="inline-block mb-2 rounded border border-dashed border-ink-soft px-2 py-0.5 text-xs font-semibold tracking-widest text-ink-soft">DRAFT · not reviewed</p>
        )}
        <h1 className="font-serif text-4xl sm:text-5xl leading-tight">{e.name}</h1>
        <p className="mt-2 text-lg text-ink-soft">{e.description}</p>
        <ShareButton name={e.name} />
      </header>

      {e.crisis && <CrisisBanner />}

      {!ready ? (
        <p className="mt-8 rounded-lg border border-line bg-paper-2 p-5 text-ink-soft">
          This page is still being prepared. Please check back soon.
        </p>
      ) : (
        <>
          <Section title="God sees this" intro="You are not the first to feel this. Scripture holds people who felt it too.">
            <Verses list={e.god_sees_this} />
          </Section>
          <Section title="Truth to hold">
            <Verses list={e.truth_to_hold} />
          </Section>
          <Section title="A next step">
            <div className="space-y-6">
              <Step label="Reflect" text={e.reflection} />
              <Step label="Pray" text={e.prayer} serif />
              <Step label="Do" text={e.action} />
            </div>
          </Section>
        </>
      )}

      {deeper.length > 0 && (
        <section className="mt-12" aria-labelledby="deeper">
          <h2 id="deeper" className="text-sm font-semibold text-ink-soft">Can you name it more closely?</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {deeper.map((c) => (
              <li key={c.data.slug}>
                <a
                  href={`/${c.data.slug}`}
                  onClick={linkTo(`/${c.data.slug}`)}
                  className="inline-block rounded-full border border-line bg-paper-2 px-3.5 py-1.5 text-sm hover:border-ink-soft"
                >
                  {c.data.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-10">{backLink}</div>
    </article>
  );
}

function Section({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl">{title}</h2>
      {intro && <p className="mt-1 text-sm text-ink-soft">{intro}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

const NotYet = () => <p className="text-sm italic text-ink-soft">Not written yet.</p>;

function Verses({ list }: { list?: Verse[] }) {
  if (!list?.length) return <NotYet />;
  return (
    <div className="space-y-4">
      {list.map((v) => (
        <VerseCard key={v.ref} verse={v} />
      ))}
    </div>
  );
}

function VerseCard({ verse }: { verse: Verse }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  async function copy() {
    try {
      // Don't wrap in quotes when the verse already contains a quotation (avoids “ “nested” ”).
      const text = /[“”]/.test(verse.text) ? verse.text : `“${verse.text}”`;
      await navigator.clipboard.writeText(`${text} — ${verse.ref} (BSB)`);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 2000);
  }
  return (
    <figure className="rounded-xl bg-paper-2 px-5 pt-5 pb-3">
      <blockquote className="font-serif text-lg leading-relaxed">{verse.text}</blockquote>
      <figcaption className="mt-2 flex items-center justify-between gap-3 text-sm text-ink-soft">
        <cite className="not-italic font-medium">{verse.ref}</cite>
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy ${verse.ref}`}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 -mr-2 hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-ink"
        >
          {state === "copied" ? <Icon d={CHECK} /> : <Icon d={COPY} />}
          <span aria-live="polite">{state === "copied" ? "Copied" : state === "failed" ? "Couldn't copy" : "Copy"}</span>
        </button>
      </figcaption>
    </figure>
  );
}

/** Phones get the share sheet; desktops copy the link. */
function ShareButton({ name }: { name: string }) {
  const [copied, setCopied] = useState<boolean | null>(null);
  async function share() {
    const url = location.href;
    if (navigator.share && matchMedia("(pointer: coarse)").matches) {
      await navigator.share({ title: name, url }).catch(() => {}); // cancelled: nothing to do
      return;
    }
    setCopied(await navigator.clipboard.writeText(url).then(() => true, () => false));
    setTimeout(() => setCopied(null), 2000);
  }
  return (
    <button
      type="button"
      onClick={share}
      className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-sm text-ink-soft hover:border-ink-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-ink"
    >
      <Icon d={copied ? CHECK : SHARE} />
      <span aria-live="polite">{copied ? "Link copied" : copied === false ? "Couldn't copy" : "Share"}</span>
    </button>
  );
}

function Step({ label, text, serif }: { label: string; text?: string; serif?: boolean }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-soft">{label}</h3>
      {text ? <p className={`mt-1.5 leading-relaxed ${serif ? "font-serif text-lg" : "text-base"}`}>{text}</p> : <NotYet />}
    </div>
  );
}

function CrisisBanner() {
  return (
    <aside
      aria-labelledby="crisis-title"
      className="mt-6 rounded-xl border p-5"
      style={{ background: "color-mix(in oklab, var(--accent) 9%, var(--paper))", borderColor: "color-mix(in oklab, var(--accent) 35%, var(--paper))" }}
    >
      <h2 id="crisis-title" className="font-serif text-xl">You don't have to carry this alone.</h2>
      <p className="mt-2 leading-relaxed">If you're thinking about ending your life or feel unsafe, please reach out now.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a href="tel:988" className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-ink font-medium px-4 py-2 hover:opacity-90">
          <Icon d={PHONE} /> Call 988
        </a>
        <a href="sms:988" className="inline-flex items-center gap-2 rounded-full border border-accent text-accent font-medium px-4 py-2 hover:bg-paper">
          <Icon d={TEXT} /> Text 988
        </a>
      </div>
      <p className="mt-3 text-sm text-ink-soft">988 Suicide &amp; Crisis Lifeline (US): free, confidential, any time.</p>
      <p className="mt-3 text-sm">
        <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2">
          Outside the US? Find a helpline
        </a>
      </p>
      <p className="mt-3 text-sm font-medium">If you're in immediate danger, call your local emergency number.</p>
    </aside>
  );
}

const COPY = "M8 8h11v11H8zM5 15H4V4h11v1";
const SHARE = "M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13";
const CHECK = "M5 12l5 5L20 7";
const PHONE = "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z";
const TEXT = "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z";

function Icon({ d }: { d: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}
