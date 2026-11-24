// Turns the checked content file into what the app ships: verse references become BSB text,
// and in live builds unreviewed entries lose their content (pages say "still being prepared").
import { resolveVerse } from "./bible.js";

const CONTENT = ["god_sees_this", "truth_to_hold", "reflection", "prayer", "action"];

/** @param {any[]} tree validated emotions.yaml @param {Map<string,string>} bible @param {boolean} drafts */
export function publish(tree, bible, drafts) {
  const one = (e) => {
    const out = { ...e, children: e.children?.map(one) };
    if (!drafts && !e.reviewed) for (const k of CONTENT) delete out[k];
    for (const k of ["god_sees_this", "truth_to_hold"]) if (out[k]) out[k] = out[k].map((v) => resolveVerse(v, bible).verse);
    return out;
  };
  return tree.map(one);
}
