import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "build",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allows all hostnames
        port: "", // Allows all ports
        pathname: "**", // Allows all paths
      },
      {
        protocol: "https",
        hostname: "cdn.hashnode.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
