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
    // Enable local image optimization
    unoptimized: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Serve static files from uploads directory
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/src/public/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
