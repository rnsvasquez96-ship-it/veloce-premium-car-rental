import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  outputFileTracingRoot: process.cwd(),
  images: {
    qualities: [75, 85, 88],
  },
};

export default nextConfig;
