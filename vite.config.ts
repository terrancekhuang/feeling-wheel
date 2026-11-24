import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { parse } from "yaml";
import { validate } from "./content/validate.js";

// Turns content/*.yaml into a JS module, refusing to build if the content is malformed.
function content(): Plugin {
  return {
    name: "content-yaml",
    transform(src, id) {
      if (!id.endsWith(".yaml")) return;
      const data = parse(src);
      const errors = validate(data);
      if (errors.length) this.error(`Content problems in ${id}:\n  - ${errors.join("\n  - ")}`);
      return { code: `export default ${JSON.stringify(data)};`, map: null };
    },
  };
}

export default defineConfig({
  plugins: [content(), react(), tailwindcss()],
});
