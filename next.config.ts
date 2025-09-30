import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://dgtool-5c31a88273ef.herokuapp.com/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
