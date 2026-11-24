import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { loadBible, resolveVerse, verseNotes } from "./bible.js";
import { validate } from "./validate.js";
import { publish, sentence, withMeta } from "./publish.js";

const bible = loadBible();
const e = (slug, extra = {}) => ({ name: slug, slug, description: "d", reviewed: false, ...extra });
const full = {
  god_sees_this: ["Psalm 42:5", "1 Kings 19:4"],
  truth_to_hold: ["Isaiah 41:10", { ref: "Matthew 14:31", excerpt: "Immediately Jesus reached out His hand and took hold of Peter." }],
  reflection: "q",
  prayer: "p",
  action: "a",
};

test("real content file passes the check", () => {
  const { errors } = validate(parse(readFileSync(new URL("./emotions.yaml", import.meta.url), "utf8")), bible);
  assert.deepEqual(errors, []);
});

test("verses resolve to exact BSB text; ranges, excerpts and quote styles work", () => {
  assert.match(resolveVerse("Psalm 42:5", bible).verse.text, /^Why are you downcast, O my soul\?/);
  assert.equal(resolveVerse("Mark 14:33-34", bible).verse.ref, "Mark 14:33–34");
  assert.equal(resolveVerse({ ref: "1 Kings 19:4", excerpt: `"I have had enough, LORD," he said.` }, bible).verse.text, "“I have had enough, LORD,” he said.");
  assert.equal(resolveVerse("Deuteronomy 31:8", bible).verse.text.at(-1), "."); // lone closing quote dropped
  assert.equal(verseNotes("Psalm 62:1", resolveVerse("Psalm 62:1", bible).verse.text).length, 1);
  assert.equal(verseNotes("Psalm 1:1", resolveVerse("Psalm 1:1", bible).verse.text).length, 0);
  assert.match(resolveVerse("Psalms 42:5", bible).error, /isn't in the BSB/);
  assert.match(resolveVerse("Psalm 42", bible).error, /isn't a reference/);
  assert.match(resolveVerse("Psalm 42:1-6", bible).error, /4 verses or fewer/);
  assert.match(resolveVerse({ ref: "Psalm 42:5", excerpt: "Cheer up" }, bible).error, /word-for-word/);
});

test("catches shape problems", () => {
  const tree = [
    e("fear", { children: [e("worried", { children: [e("anxious", { children: [e("deep")] })] })] }),
    e("fear"),
    e("Bad Slug"),
    e("about"),
    { name: "x", slug: "x", reviewed: "no", god_see_this: [] },
  ];
  const errors = validate(tree, bible).errors.join("\n");
  for (const re of [/already used/, /lowercase words/, /reserved/, /missing description/, /true or false/, /can't have children/, /unknown field "god_see_this"/]) assert.match(errors, re);
});

test("drafts may be incomplete; reviewed entries must be complete and valid", () => {
  const ok = validate([e("a", { ...full, reviewed: true }), e("b", { prayer: "p" }), e("c")], bible);
  assert.deepEqual(ok.errors, []);
  assert.equal(ok.reviewed, 1);
  assert.equal(ok.complete, 1);
  assert.equal(ok.incomplete.length, 1); // b started; c untouched
  const bad = validate([e("a", { reviewed: true, prayer: "p" }), e("b", { truth_to_hold: ["Psalm 1:1", "Psalm 1:1", "Psalm 1:2", "Psalm 1:3", "Psalm 1:4"] })], bible).errors.join("\n");
  assert.match(bad, /marked reviewed but incomplete/);
  assert.match(bad, /max 4/);
  assert.match(bad, /used twice/);
});

test("publish fills verse text and strips unreviewed content from live builds", () => {
  const tree = [e("a", { ...full, reviewed: true, children: [e("b", full)] })];
  const live = publish(tree, bible, false);
  assert.equal(live[0].truth_to_hold[1].text, "Immediately Jesus reached out His hand and took hold of Peter.");
  assert.equal(live[0].children[0].prayer, undefined);
  assert.equal(publish(tree, bible, true)[0].children[0].prayer, "p");
});

test("link previews: each page's HTML carries its own escaped title and description", () => {
  const html = readFileSync("index.html", "utf8");
  const out = withMeta(html, `"Lost" & alone · App`, sentence("a feeling of <nowhere>"));
  assert.match(out, /<title>&quot;Lost&quot; &amp; alone · App<\/title>/);
  assert.match(out, /property="og:title" content="&quot;Lost&quot; &amp; alone · App"/);
  assert.equal(out.match(/content="A feeling of &lt;nowhere>\."/g)?.length, 2); // description + og:description
  assert.equal(sentence("done."), "Done.");
});
