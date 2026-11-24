// The Berean Standard Bible (public domain), as one "Book C:V<TAB>text" line per verse.
import { readFileSync } from "node:fs";

/** @returns {Map<string, string>} "Psalm 42:5" -> verse text */
export function loadBible(file = new URL("./bsb.txt", import.meta.url)) {
  const bible = new Map();
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const tab = line.indexOf("\t");
    if (tab > 0 && /\d+:\d+$/.test(line.slice(0, tab))) bible.set(line.slice(0, tab), line.slice(tab + 1).trim());
  }
  return bible;
}

const REF = /^(.+?) (\d+):(\d+)(?:\s*[-–]\s*(\d+))?$/;
const MAX_VERSES = 4;
// Straight and curly quotes count as the same when matching an excerpt.
const plain = (s) => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
const count = (s, c) => s.split(c).length - 1;
// A verse can end a quotation that opened in an earlier verse (or open one that closes later); drop that lone mark.
function tidyQuotes(t) {
  if (count(t, "”") > count(t, "“") && t.endsWith("”")) t = t.slice(0, -1);
  if (count(t, "“") > count(t, "”") && t.startsWith("“")) t = t.slice(1);
  return t;
}
const TITLE = /^(For the choirmaster|A Psalm|A psalm|A song|A Song|A Maskil|A Miktam|A prayer|A Prayer|Of David|Of Asaph|Of Solomon|Of the sons|A Shiggaion)/;

/** Things worth a second look in a resolved verse (not errors). */
export function verseNotes(ref, text) {
  const notes = [];
  if (/^Psalm \d+:1\b/.test(ref) && TITLE.test(text)) notes.push(`${ref} starts with the psalm's title — add an excerpt to quote just the verse.`);
  if (/\bSelah\b/.test(text)) notes.push(`${ref} contains "Selah" — consider a shorter range or an excerpt.`);
  return notes;
}

/**
 * Turns a content-file entry ("Psalm 42:5", "Mark 14:33-34", or {ref, excerpt}) into {ref, text}.
 * @returns {{ verse?: { ref: string, text: string }, error?: string }}
 */
export function resolveVerse(entry, bible) {
  const { ref, excerpt } = typeof entry === "string" ? { ref: entry } : entry ?? {};
  if (typeof ref !== "string") return { error: `a verse needs a reference like "Psalm 42:5".` };
  const m = REF.exec(ref.trim());
  if (!m) return { error: `"${ref}" isn't a reference like "Psalm 42:5" or "Mark 14:33-34".` };
  const [, book, ch, from, to = from] = m;
  if (+to < +from) return { error: `"${ref}": the range runs backwards.` };
  if (+to - +from + 1 > MAX_VERSES) return { error: `"${ref}": keep ranges to ${MAX_VERSES} verses or fewer.` };
  const texts = [];
  for (let v = +from; v <= +to; v++) {
    const text = bible.get(`${book} ${ch}:${v}`);
    if (!text) return { error: `"${ref}": ${book} ${ch}:${v} isn't in the BSB (check the book name and numbers; Psalms is "Psalm").` };
    texts.push(text);
  }
  const full = texts.join(" ");
  const display = from === to ? `${book} ${ch}:${from}` : `${book} ${ch}:${from}–${to}`;
  if (excerpt === undefined) return { verse: { ref: display, text: tidyQuotes(full) } };
  if (typeof excerpt !== "string" || !excerpt.trim()) return { error: `"${ref}": excerpt is empty.` };
  const at = plain(full).indexOf(plain(excerpt.trim()));
  if (at < 0) return { error: `"${ref}": excerpt "${excerpt.trim()}" isn't word-for-word in the BSB text of that verse.` };
  return { verse: { ref: display, text: tidyQuotes(full.slice(at, at + excerpt.trim().length)) } };
}
