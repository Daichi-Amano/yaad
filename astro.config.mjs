import { defineConfig } from "astro/config";

import preact from "@astrojs/preact";

import tailwindcss from "@tailwindcss/vite";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.PUBLIC_SITE_URL || "https://yaad.inc",
  output: "server",
  adapter: vercel(),
  integrations: [preact()],

  vite: {
    plugins: [tailwindcss()],
  },
});
