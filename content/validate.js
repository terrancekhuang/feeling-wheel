// The content check. Rings come from nesting: top level = core, children = middle, grandchildren = specific.
// Errors block the build. Drafts may be incomplete; reviewed entries must be complete.
import { resolveVerse, verseNotes } from "./bible.js";

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const RESERVED = new Set(["about"]);
const RINGS = ["core", "middle", "specific"];
const GROUPS = { god_sees_this: '"God sees this"', truth_to_hold: '"Truth to hold"' };
const STEPS = ["reflection", "prayer", "action"];
const KEYS = new Set(["name", "slug", "description", "reviewed", "crisis", "children", ...Object.keys(GROUPS), ...STEPS]);
const MIN = 2;
const MAX = 4;

/**
 * @param {unknown} tree parsed emotions.yaml
 * @param {Map<string,string>} bible from loadBible()
 * @returns {{ errors: string[], notes: string[], incomplete: string[], reviewed: number, complete: number, total: number }}
 */
export function validate(tree, bible) {
  const errors = [];
  const incomplete = [];
  const notes = [];
  const seen = new Map();
  let reviewed = 0;
  let complete = 0;
  let total = 0;
  if (!Array.isArray(tree) || tree.length === 0) return { errors: ["The file must be a list of core emotions."], notes, incomplete, reviewed, complete, total };

  /** @param {any} node @param {number} depth @param {string} path */
  function visit(node, depth, path) {
    const where = `${path}${node?.name ?? "(no name)"}`;
    if (!node || typeof node !== "object" || Array.isArray(node)) return errors.push(`${path}: an entry is not an emotion.`);
    total++;
    if (node.reviewed === true) reviewed++;

    for (const k of Object.keys(node)) if (!KEYS.has(k)) errors.push(`${where}: unknown field "${k}" (typo?).`);
    if (typeof node.name !== "string" || !node.name.trim()) errors.push(`${where}: missing name.`);
    if (typeof node.description !== "string" || !node.description.trim()) errors.push(`${where}: missing description.`);
    if (typeof node.reviewed !== "boolean") errors.push(`${where}: "reviewed" must be true or false.`);
    if (node.crisis !== undefined && typeof node.crisis !== "boolean") errors.push(`${where}: "crisis" must be true or false.`);
    if (typeof node.slug !== "string" || !SLUG.test(node.slug)) {
      errors.push(`${where}: slug "${node.slug}" must be lowercase words joined by hyphens.`);
    } else if (RESERVED.has(node.slug)) {
      errors.push(`${where}: slug "${node.slug}" is reserved for another page.`);
    } else if (seen.has(node.slug)) {
      errors.push(`${where}: slug "${node.slug}" is already used by ${seen.get(node.slug)}.`);
    } else {
      seen.set(node.slug, where);
    }

    // Content: whatever is present must be valid; reviewed entries must have all of it.
    const missing = [];
    const refs = new Set();
    for (const [key, label] of Object.entries(GROUPS)) {
      const list = node[key];
      if (list === undefined) { missing.push(label); continue; }
      if (!Array.isArray(list)) { errors.push(`${where}: ${label} must be a list of verses.`); continue; }
      if (list.length > MAX) errors.push(`${where}: ${label} has ${list.length} verses (max ${MAX}).`);
      if (list.length < MIN) missing.push(`${label} needs at least ${MIN} verses`);
      for (const entry of list) {
        const { verse, error } = resolveVerse(entry, bible);
        if (error) errors.push(`${where}: ${label}: ${error}`);
        else if (refs.has(verse.ref)) errors.push(`${where}: ${verse.ref} is used twice on this page.`);
        else {
          refs.add(verse.ref);
          for (const n of verseNotes(verse.ref, verse.text)) notes.push(`${where}: ${n}`);
        }
      }
    }
    for (const key of STEPS) {
      if (node[key] === undefined) missing.push(key);
      else if (typeof node[key] !== "string" || !node[key].trim()) errors.push(`${where}: ${key} must be text.`);
    }
    if (!missing.length) complete++;
    else {
      if (node.reviewed === true) errors.push(`${where}: marked reviewed but incomplete — missing ${missing.join(", ")}.`);
      else if (missing.length < 5) incomplete.push(`${where}: missing ${missing.join(", ")}`);
    }

    if (node.children !== undefined) {
      if (RINGS[depth] === "specific") errors.push(`${where}: specific emotions (third ring) can't have children.`);
      else if (!Array.isArray(node.children)) errors.push(`${where}: "children" must be a list.`);
      else node.children.forEach((c) => visit(c, depth + 1, `${where} › `));
    }
  }

  tree.forEach((n) => visit(n, 0, ""));
  return { errors, notes, incomplete, reviewed, complete, total };
}
