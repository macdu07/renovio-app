import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import AstroPWA from "@vite-pwa/astro";

export default defineConfig({
  adapter: node({
    mode: "standalone",
  }),
  output: "server",
  security: {
    checkOrigin: false,
  },
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
        theme_color: "#111214",
        background_color: "#111214",
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
        navigateFallback: null,
        // Never cache HTML — pages are SSR and must always come from the server
        globPatterns: ["**/*.{css,js,svg,png,ico,txt}"],
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
