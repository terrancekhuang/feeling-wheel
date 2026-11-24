import { APP } from "./content";

const CONTACT = "terrancehuang@proton.me";

export default function About() {
  return (
    <article className="mt-6 max-w-prose mx-auto leading-relaxed">
      <h1 className="font-serif text-4xl sm:text-5xl leading-tight">About</h1>

      <Section title="Why this exists">
        <p>
          Throughout the Bible, God's people name exactly what they feel: afraid, forgotten, worn out, angry. {APP} helps you do
          the same, then opens Scripture that sits with you in that feeling first, offers truth to hold, and ends with a gentle
          next step. It's free, it works offline, and it saves nothing about you.
        </p>
      </Section>

      <Section title="How to use it">
        <ol className="list-decimal pl-5 space-y-1.5">
          <li>Tap the feeling on the wheel that's closest to yours, or type it in the search box below the wheel.</li>
          <li>Go deeper until it names what you feel, or tap <em>Read verses</em> at any ring.</li>
          <li>Read slowly, pray, and take the next step. Share the page with someone who needs it.</li>
        </ol>
      </Section>

      <Section title="Not a substitute for help">
        <p>
          This is a devotional aid, not counselling or medical care. If you're struggling, please talk to someone you trust, a
          pastor, or a professional.
        </p>
        <p className="mt-3">
          If you're thinking about ending your life or feel unsafe, call or text{" "}
          <a href="tel:988" className="text-accent underline underline-offset-2">988</a> (Suicide &amp; Crisis Lifeline, US),
          or{" "}
          <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2">
            find a helpline
          </a>{" "}
          outside the US. If you're in immediate danger, call your local emergency number.
        </p>
      </Section>

      <Section title="Scripture and care">
        <p>
          Scripture quotations are from the{" "}
          <a href="https://berean.bible" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2">
            Berean Standard Bible (BSB)
          </a>
          , which is in the public domain. Every entry is read and reviewed by hand before it appears here.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions, corrections or a verse that helped you:{" "}
          <a href={`mailto:${CONTACT}`} className="text-accent underline underline-offset-2">{CONTACT}</a>
        </p>
      </Section>

    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-serif text-2xl">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
