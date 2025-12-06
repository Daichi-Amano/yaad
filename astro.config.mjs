import { defineConfig } from "astro/config";

import preact from "@astrojs/preact";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.PUBLIC_SITE_URL || "https://yaad.inc",
  output: "server",
  integrations: [preact()],

  vite: {
    plugins: [tailwindcss()],
  },
});
