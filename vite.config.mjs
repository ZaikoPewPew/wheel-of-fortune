import { copyFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function spaFallback() {
  return {
    name: "spa-fallback",
    closeBundle() {
      const index = path.resolve(__dirname, "dist/index.html");
      const fallback = path.resolve(__dirname, "dist/404.html");
      if (existsSync(index)) copyFileSync(index, fallback);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), spaFallback()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: process.env.GITHUB_ACTIONS ? "/wheel-of-fortune/" : "/",
});
