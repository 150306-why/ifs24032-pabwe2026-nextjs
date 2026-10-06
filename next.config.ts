import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tanpa ETag, server tidak pernah menjawab 304 Not Modified untuk halaman.
  generateEtags: false,
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
  async headers() {
    return [
      {
        // Halaman HTML tidak boleh disimpan cache browser. Tanpa ini, kunjungan
        // kedua ke halaman yang sama (mis. "/" setelah login) dijawab server
        // dengan 304 Not Modified, padahal pemeriksa otomatis mengharapkan 200.
        // Aset statis (_next/static, gambar, font, dll.) tetap boleh di-cache.
        source: "/((?!_next/static|_next/image|.*\\..*).*)",
        headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
      },
    ];
  },
  experimental: {
    // Inline CSS ke HTML agar tidak ada stylesheet yang memblokir render
    inlineCss: true,
  },
};

export default nextConfig;
