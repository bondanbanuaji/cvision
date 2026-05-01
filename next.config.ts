import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Next.js from bundling Node.js-only packages through webpack/turbopack.
  // pdf-parse reads test fixtures at import time when bundled — this forces it to
  // run natively on the server, bypassing the bundler entirely.
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
