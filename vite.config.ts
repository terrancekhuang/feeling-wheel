import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { parse } from "yaml";
import { loadBible } from "./content/bible.js";
import { validate } from "./content/validate.js";
import { publish } from "./content/publish.js";

// Turns content/emotions.yaml into a JS module: runs the content check (errors stop the build),
// fills in BSB verse text, and applies the review gate.
// Drafts show in `pnpm dev`; builds are live-only. Override with DRAFTS=1 or DRAFTS=0.
function content(): Plugin {
  let drafts = false;
  let bible: Map<string, string>;
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
      const data = publish(tree, bible, drafts);
      return { code: `export default ${JSON.stringify(data)};\nexport const drafts = ${drafts};`, map: null };
    },
  };
}

export default defineConfig({
  plugins: [content(), react(), tailwindcss()],
});
