import { hierarchy, partition, type HierarchyRectangularNode } from "d3-hierarchy";
import tree from "../content/emotions.yaml";

export type Emotion = {
  name: string;
  slug: string;
  description: string;
  reviewed: boolean;
  crisis?: boolean;
  children?: Emotion[];
};

export type Node = HierarchyRectangularNode<Emotion>;

// Invisible root holds the core ring. x spans 0..2π, y is depth (1 = core, 2 = middle, 3 = specific).
const h = hierarchy<Emotion>({ name: "", slug: "", description: "", reviewed: true, children: tree }).count();
export const root: Node = partition<Emotion>().size([2 * Math.PI, h.height + 1])(h);

export const bySlug = new Map(root.descendants().slice(1).map((n) => [n.data.slug, n]));

/** CSS fill for a slice: its core family colour, lighter the further out it sits. */
export function fill(n: Node) {
  const core = n.ancestors().at(-2)!;
  const family = root.children!.indexOf(core) % 7;
  return `color-mix(in oklab, var(--family-${family}) var(--mix-${n.depth}), var(--paper))`;
}
