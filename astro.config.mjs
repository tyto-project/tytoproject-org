// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Served from GitHub Pages under the custom domain tytoproject.org (see public/CNAME),
// so this deploys at the domain root and needs no `base` path.
//
// `site` is consumed by @astrojs/sitemap to build absolute URLs. public/robots.txt
// ends with `Sitemap: https://tytoproject.org/sitemap-index.xml`, so the sitemap output
// paths are contractual: do not remove the integration or change its filenames.
export default defineConfig({
  site: "https://tytoproject.org",
  output: "static",
  integrations: [sitemap()],
});
