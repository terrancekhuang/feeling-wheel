// `pnpm check`: the content report. Exits non-zero if anything would block publishing.
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { loadBible } from "./bible.js";
import { validate } from "./validate.js";

const tree = parse(readFileSync(new URL("./emotions.yaml", import.meta.url), "utf8"));
const { errors, notes, incomplete, reviewed, complete, total } = validate(tree, loadBible());

console.log("\nContent check\n");
if (errors.length) {
  console.log(`✗ ${errors.length} problem(s) — these block publishing:`);
  for (const e of errors) console.log(`  - ${e}`);
} else {
  console.log("✓ No problems.");
}
if (notes.length) {
  console.log(`\nWorth a second look (not blocking):`);
  for (const n of notes) console.log(`  - ${n}`);
}
console.log(`\nReviewed: ${reviewed} of ${total} emotions`);
console.log(`Fully drafted: ${complete} of ${total}`);
if (incomplete.length) {
  console.log(`\nStarted but incomplete (fine for drafts):`);
  for (const i of incomplete) console.log(`  - ${i}`);
}
console.log();
process.exit(errors.length ? 1 : 0);
