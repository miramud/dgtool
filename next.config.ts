import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://dgtool-dev.rightclick-academy.com/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
