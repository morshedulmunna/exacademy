import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
    // Enable local image optimization
    unoptimized: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // No rewrite needed; files are emitted under public/uploads
};

export default nextConfig;
