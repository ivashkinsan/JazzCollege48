import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { resolve } from "path";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(
      process.env.npm_package_version,
    ),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        maximumFileSizeToCacheInBytes: 3145728, // 3 MB
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/data"),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "api-cache",
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        name: "Музыкальное искусство эстрады",
        short_name: "МИЭ",
        description: "Сайт эстрадного отделения Липецкого колледжа искусств",
        theme_color: "#D4AF37",
        background_color: "#0a0a0a",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "Logo/jazzcollege48_icon_192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "Logo/jazzcollege48_icon_512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "Logo/jazzcollege48_icon_512x512_no_background.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
    ViteImageOptimizer({
      jpg: {
        quality: 75,
      },
      jpeg: {
        quality: 75,
      },
      png: {
        quality: 75,
      },
    }),
  ],
  resolve: {
    alias: {
      "@nestjs/testing": path.resolve(
        __dirname,
        "node_modules/@nestjs/testing",
      ),
    },
    extensions: [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"],
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
      scopeBehaviour: "local",
      generateScopedName: "[name]__[local]--[hash:base64:5]",
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        admin: resolve(__dirname, "admin.html"),
      },
    },
  },
});
