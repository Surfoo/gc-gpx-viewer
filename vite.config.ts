import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "app",
  base: "/gpxviewer/",
  publicDir: path.resolve(__dirname, "static"),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname)],
    },
  },
  build: {
    outDir: "../public",
    emptyOutDir: true,
  },
});
