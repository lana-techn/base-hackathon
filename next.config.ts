import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Basic configuration for stable operation
  reactStrictMode: true,

  // Skip type checking during build (do separately)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Enable experimental features that are stable
  experimental: {
    optimizePackageImports: ['@coinbase/onchainkit', 'lucide-react'],
  },

  // Turbopack config (Next.js 16 default bundler)
  // Empty config to silence the Turbopack vs webpack conflict warning
  turbopack: {},

  // Webpack configuration to handle WalletConnect/pino/MetaMask dependencies
  webpack: (config, { isServer }) => {
    // Fallbacks for optional dependencies that cause warnings
    config.resolve.fallback = {
      ...config.resolve.fallback,
      // thread-stream test utilities
      'tap': false,
      'tape': false,
      'why-is-node-running': false,
      // pino optional dependencies
      'pino-pretty': false,
      // MetaMask SDK React Native dependencies (not needed for web)
      '@react-native-async-storage/async-storage': false,
      'react-native': false,
    };

    // Ignore test files from thread-stream package
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /node_modules[\\/]thread-stream[\\/]test[\\/]/,
      use: 'null-loader',
    });

    // Suppress specific warnings
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      // Ignore pino-pretty and async-storage warnings
      /Can't resolve 'pino-pretty'/,
      /Can't resolve '@react-native-async-storage/,
      /Can't resolve 'react-native'/,
    ];

    return config;
  },

  // Headers for CORS and security
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },

  // Ensure proper handling of API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      // Proxy Thetanuts API to avoid CORS
      {
        source: '/api/thetanuts/:path*',
        destination: 'https://round-snowflake-9c31.devops-118.workers.dev/:path*',
      },
    ]
  },

  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
};

export default nextConfig;
