// @ts-check
import { defineConfig } from "astro/config";

// Static output → Cloudflare Pages serves `dist/` as plain files.
// SITE_URL can be overridden at build time (e.g. for the *.pages.dev preview).
export default defineConfig({
  site: process.env.SITE_URL || "https://skaltaipei.org.tw",
  output: "static",
  trailingSlash: "never",
  build: {
    format: "file",
    inlineStylesheets: "auto",
  },
  image: {
    // Feed photos come from the scraper as large JPEGs; Astro resizes them at build.
    responsiveStyles: false,
  },
});
