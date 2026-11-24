import { hierarchy, partition, type HierarchyNode, type HierarchyRectangularNode } from "d3-hierarchy";
import tree, { drafts } from "../content/emotions.yaml";

export { drafts };

export type Verse = { ref: string; text: string };

export type Emotion = {
  name: string;
  slug: string;
  description: string;
  reviewed: boolean;
  crisis?: boolean;
  children?: Emotion[];
  god_sees_this?: Verse[];
  truth_to_hold?: Verse[];
  reflection?: string;
  prayer?: string;
  action?: string;
};

export type Node = HierarchyRectangularNode<Emotion>;
export type Page = HierarchyNode<Emotion>;

const top: Emotion = { name: "", slug: "", description: "", reviewed: true, children: tree };

/** Live builds show reviewed emotions plus the path down to them; drafts mode shows everything. */
export const shows = (e: Emotion): boolean => drafts || e.reviewed || !!e.children?.some(shows);
const prune = (e: Emotion): Emotion => ({ ...e, children: e.children?.filter(shows).map(prune) });

// The wheel: x spans 0..2π, y is depth (1 = core, 2 = middle, 3 = specific).
const h = hierarchy(prune(top)).count();
export const root: Node = partition<Emotion>().size([2 * Math.PI, h.height + 1])(h);

/** Every emotion has a page (unreviewed ones say "still being prepared" in live builds). */
export const pages = new Map(hierarchy(top).descendants().slice(1).map((n) => [n.data.slug, n]));

/** CSS fill for a slice: its core family colour, lighter the further out it sits. */
export function fill(n: Node) {
  const core = n.ancestors().at(-2)!;
  const family = tree.findIndex((c) => c.slug === core.data.slug) % 7;
  return `color-mix(in oklab, var(--family-${family}) var(--mix-${n.depth}), var(--paper))`;
}
