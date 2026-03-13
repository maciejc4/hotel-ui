import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/hotel-ui/admin",
  assetPrefix: "/hotel-ui/admin",
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@hotel-ui/shared"],
};

export default nextConfig;
