import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Basic configuration for stable operation
  reactStrictMode: true,
  
  // Enable experimental features that are stable
  experimental: {
    optimizePackageImports: ['@coinbase/onchainkit', 'lucide-react'],
  },
  
  // Ensure proper handling of API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
};

export default nextConfig;
