import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allows all hostnames
        port: "", // Allows all ports
        pathname: "**", // Allows all paths
      },
    ],
  },
};

export default nextConfig;
