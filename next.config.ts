import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
    rules: {
      // Buang polyfill untuk fitur yang sudah ada di browser modern.
      "polyfill-module.js": {
        loaders: ["./config/empty-loader.cjs"],
        as: "*.js",
      },
    },
  },
  experimental: {
    // Inline CSS ke HTML agar tidak ada stylesheet yang memblokir render
    inlineCss: true,
  },
};

export default nextConfig;
