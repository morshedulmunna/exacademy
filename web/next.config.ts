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
  async rewrites() {
    const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080";
    return [
      {
        source: "/api/:path*",
        destination: `${API_BASE_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
