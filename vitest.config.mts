import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "./src"),
    },
  },
  test: {
    // Vitest membatalkan worker yang belum siap dalam 60 dtk (tidak dapat
    // diubah). Dengan pool "threads" setiap file tes menyalakan worker + jsdom
    // baru; pada Windows yang lambat (antivirus/disk) beberapa file kena
    // "Timeout waiting for worker to respond" sehingga coverage turun.
    // "vmThreads" memakai ulang worker (jsdom dibuat sekali per worker) tetapi
    // tetap mengisolasi tiap file lewat VM context.
    pool: "vmThreads",
    maxWorkers: 2,
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: ["src/**/*.{js,jsx,ts,tsx}"],
      exclude: [
        "node_modules/**",
        "src/app/**",
        "src/components/Providers.tsx",
        "src/setupTests.ts",
        "src/lib/config.ts",
        "src/types/**",
        "src/hooks/redux.ts",
        "src/server.ts",
        "scripts/**",
        "vitest.config.mts",
        "next.config.ts",
        "postcss.config.mjs",
        "eslint.config.mjs",
        ".next/**",
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
