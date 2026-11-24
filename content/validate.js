// Checks the shape of the emotion tree. Returns a list of human-readable problems (empty = OK).
// Rings come from nesting: top level = core, children = middle, grandchildren = specific.

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const RESERVED = new Set(["about"]);
const RINGS = ["core", "middle", "specific"];

/** @param {unknown} tree */
export function validate(tree) {
  const errors = [];
  const seen = new Map();
  if (!Array.isArray(tree) || tree.length === 0) return ["The file must be a list of core emotions."];

  /** @param {any} node @param {number} depth @param {string} path */
  function visit(node, depth, path) {
    const where = `${path}${node?.name ?? "(no name)"}`;
    const ring = RINGS[depth];
    if (!node || typeof node !== "object") return errors.push(`${path}: an entry is not an emotion.`);
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
    if (node.children !== undefined) {
      if (ring === "specific") errors.push(`${where}: specific emotions (third ring) can't have children.`);
      else if (!Array.isArray(node.children)) errors.push(`${where}: "children" must be a list.`);
      else node.children.forEach((c) => visit(c, depth + 1, `${where} › `));
    }
  }

  tree.forEach((n) => visit(n, 0, ""));
  return errors;
}
