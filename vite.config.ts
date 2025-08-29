import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  build: {
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  server: {
    hmr: {
      overlay: false
    }
  },
  plugins: [react(), cloudflare()],
  assetsInclude: ['**/*.webm', '**/*.mp4'],
});
