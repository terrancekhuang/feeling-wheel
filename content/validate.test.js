import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { validate } from "./validate.js";

const e = (slug, extra = {}) => ({ name: slug, slug, description: "d", reviewed: false, ...extra });

test("real content file is valid", () => {
  const tree = parse(readFileSync(new URL("./emotions.yaml", import.meta.url), "utf8"));
  assert.deepEqual(validate(tree), []);
});

test("catches duplicate, bad and reserved slugs, missing fields, and a fourth ring", () => {
  const tree = [
    e("fear", { children: [e("worried", { children: [e("anxious", { children: [e("deep")] })] })] }),
    e("fear"),
    e("Bad Slug"),
    e("about"),
    { name: "x", slug: "x", reviewed: "no" },
  ];
  const errors = validate(tree).join("\n");
  assert.match(errors, /already used/);
  assert.match(errors, /lowercase words/);
  assert.match(errors, /reserved/);
  assert.match(errors, /missing description/);
  assert.match(errors, /true or false/);
  assert.match(errors, /can't have children/);
});
