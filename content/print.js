// `pnpm print`: every emotion and its full content as one printable page (review.html), for a theology reviewer.
// Local only; not part of the build.
import { readFileSync, writeFileSync } from "node:fs";
import { parse } from "yaml";
import { loadBible } from "./bible.js";
import { publish } from "./publish.js";

const tree = publish(parse(readFileSync(new URL("./emotions.yaml", import.meta.url), "utf8")), loadBible(), true);
const esc = (s = "") => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const verses = (title, vs = []) =>
  `<h3>${title}</h3>` + vs.map((v) => `<p class="v">${esc(v.text)} <b>${esc(v.ref)}</b></p>`).join("");

let count = 0;
const entry = (e, path) => {
  count++;
  const trail = [...path, e.name];
  return `<section>
<p class="trail">${trail.map(esc).join(" › ")} · /${e.slug}${e.crisis ? ' · <span class="crisis">crisis banner</span>' : ""}${e.reviewed ? "" : " · NOT REVIEWED"}</p>
<h2>${esc(e.name)}</h2><p class="desc">${esc(e.description)}</p>
${verses("God sees this", e.god_sees_this)}${verses("Truth to hold", e.truth_to_hold)}
<h3>A next step</h3>
<p><i>Reflect:</i> ${esc(e.reflection)}</p><p><i>Pray:</i> ${esc(e.prayer)}</p><p><i>Do:</i> ${esc(e.action)}</p>
<p class="notes">Notes:</p>
</section>${(e.children ?? []).map((c) => entry(c, trail)).join("")}`;
};
const body = tree.map((e) => entry(e, [])).join("");

writeFileSync(
  "review.html",
  `<!doctype html><html lang="en"><meta charset="utf-8"><title>Feeling Wheel — content for review</title>
<style>
body{font:11pt/1.45 Georgia,serif;max-width:42rem;margin:2rem auto;padding:0 1rem;color:#222}
section{break-inside:avoid;border-top:1px solid #bbb;padding-top:.6rem;margin-top:1.2rem}
h2{margin:.1rem 0}h3{font:bold 9pt system-ui,sans-serif;text-transform:uppercase;letter-spacing:.05em;color:#666;margin:.8rem 0 .2rem}
.trail{font:9pt system-ui,sans-serif;color:#666;margin:0}.crisis{color:#b00;font-weight:bold}
.desc{font-style:italic;margin:.1rem 0}.v{margin:.25rem 0 .25rem 1rem}.v b{font:9pt system-ui,sans-serif;white-space:nowrap}
.notes{border-bottom:1px dotted #999;padding-bottom:2.5rem;color:#999;font:9pt system-ui,sans-serif}
</style>
<h1>Feeling Wheel — content for review</h1>
<p>${count} emotions, in wheel order. Scripture: Berean Standard Bible. Each page opens at feeling-wheel.terrancehuang.dev/&lt;link&gt;.</p>
${body}</html>\n`,
);
console.log(`Wrote review.html (${count} emotions). Open it in a browser and print.`);
