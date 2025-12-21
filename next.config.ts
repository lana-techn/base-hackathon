import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Basic configuration for stable operation
  reactStrictMode: true,

  // Enable experimental features that are stable
  experimental: {
    optimizePackageImports: ['@coinbase/onchainkit', 'lucide-react'],
  },

  // Turbopack config (Next.js 16 default bundler)
  // Empty config to silence the Turbopack vs webpack conflict warning
  turbopack: {},

  // Webpack configuration to handle WalletConnect/pino dependencies
  webpack: (config, { isServer }) => {
    // Fix for thread-stream test files that try to import test utilities
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'tap': false,
      'tape': false,
      'why-is-node-running': false,
    };

    // Ignore test files from thread-stream package
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /node_modules[\\/]thread-stream[\\/]test[\\/]/,
      use: 'null-loader',
    });

    return config;
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
