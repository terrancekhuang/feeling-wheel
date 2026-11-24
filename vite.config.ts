import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { parse } from "yaml";
import { loadBible } from "./content/bible.js";
import { validate } from "./content/validate.js";
import { publish, sentence, withMeta } from "./content/publish.js";
import type { Emotion } from "./src/content";

// Turns content/emotions.yaml into a JS module: runs the content check (errors stop the build),
// fills in BSB verse text, and applies the review gate.
// On build it also writes one HTML file per page (/anxious → anxious.html) carrying that page's
// title and description for link previews, and dist/sw.js with the list of files to cache offline.
// Drafts show in `pnpm dev`; builds are live-only. Override with DRAFTS=1 or DRAFTS=0.
function content(): Plugin {
  let drafts = false;
  let bible: Map<string, string>;
  let data: Emotion[] = [];
  return {
    name: "content-yaml",
    configResolved(c) {
      drafts = process.env.DRAFTS ? process.env.DRAFTS === "1" : c.command === "serve";
    },
    transform(src, id) {
      if (!id.endsWith(".yaml")) return;
      bible ??= loadBible();
      const tree = parse(src);
      const { errors } = validate(tree, bible);
      if (errors.length) this.error(`Content check failed (run \`pnpm check\`):\n  - ${errors.join("\n  - ")}`);
      data = publish(tree, bible, drafts);
      return { code: `export default ${JSON.stringify(data)};\nexport const drafts = ${drafts};`, map: null };
    },
    writeBundle({ dir = "dist" }, bundle) {
      const html = readFileSync(join(dir, "index.html"), "utf8");
      const app = html.match(/<title>(.*?)<\/title>/)![1];
      const page = (file: string, title: string, desc: string) =>
        writeFileSync(join(dir, file), withMeta(html, `${title} · ${app}`, desc));
      page("about.html", "About", `Why ${app} exists and how to use it.`);
      const walk = (e: Emotion): void => {
        page(`${e.slug}.html`, e.name, sentence(e.description));
        e.children?.forEach(walk);
      };
      data.forEach(walk);

      const files = ["/", ...Object.keys(bundle).filter((f) => f !== "index.html"), ...readdirSync("public").filter((f) => !f.startsWith("_"))].map((f) => (f.startsWith("/") ? f : `/${f}`));
      const version = createHash("sha256").update(html + files.join()).digest("hex").slice(0, 12);
      const sw = readFileSync("sw.js", "utf8").replace("__VERSION__", version).replace("__FILES__", JSON.stringify(files));
      writeFileSync(join(dir, "sw.js"), sw);
    },
  };
}

export default defineConfig({
  plugins: [content(), react(), tailwindcss()],
});
