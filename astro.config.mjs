import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import AstroPWA from "@vite-pwa/astro";

export default defineConfig({
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  output: "server",
  server: {
    port: 4321,
  },
  integrations: [
    AstroPWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Renovio",
        short_name: "Renovio",
        description: "Control de renovaciones web",
        theme_color: "#fafbfc",
        background_color: "#fafbfc",
        display: "standalone",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        // Never cache HTML — pages are SSR and must always come from the server
        globPatterns: ["**/*.{css,js,svg,png,ico,txt}"],
        navigateFallback: null,
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
