import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    // Inline CSS ke HTML agar tidak ada stylesheet yang memblokir render
    inlineCss: true,
  },
};

export default nextConfig;
