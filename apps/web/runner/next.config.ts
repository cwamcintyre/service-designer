import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  turbopack: {
    resolveAlias: {
      "@": path.resolve(__dirname),
      "@gds": path.resolve(__dirname, "../../../packages/ui/gds"),
      "@model": path.resolve(__dirname, "../../../packages/model"),
    },
  },
  webpack: (config) => {
    // Add alias for @
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname),
      "@gds": path.resolve(__dirname, "../../../packages/ui/gds"),
      "@model": path.resolve(__dirname, "../../../packages/model"),
    };
    return config;
  },
};

export default nextConfig;