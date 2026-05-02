import type { NextConfig } from "next";
import os from "os";

// Function to get all local IPv4 addresses
const getLocalIPs = () => {
  const interfaces = os.networkInterfaces();
  const ips: string[] = ["localhost", "127.0.0.1"];
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]!) {
      // family: 4 is IPv4 in older node versions, 'IPv4' in newer
      if ((iface.family === "IPv4" || (iface.family as any) === 4) && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
};

const nextConfig: any = {
  // Prevent Next.js from bundling Node.js-only packages through webpack/turbopack.
  serverExternalPackages: ["pdf-parse"],
  // Move to root level (no port) as suggested by Next.js 16 logs
  allowedDevOrigins: getLocalIPs(),
};

export default nextConfig;
