import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "public",
  publicDir: false,
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
    outDir: "../dist",
    emptyOutDir: true,
  },
});
