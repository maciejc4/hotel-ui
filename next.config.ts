import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/hotel-ui",
  assetPrefix: "/hotel-ui",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
