#!/bin/bash

echo "🚀 Starting BethNa AI Trader - Fast Development Mode"
echo "=================================================="

# Set environment variables for faster development
export NEXT_TELEMETRY_DISABLED=1
export DISABLE_ESLINT_PLUGIN=true
export FAST_REFRESH=true

# Clear Next.js cache for fresh start
echo "🧹 Clearing Next.js cache..."
rm -rf .next

# Start development server with optimizations
echo "🔥 Starting optimized development server..."
pnpm dev --turbo --port 3000

echo "✅ Development server ready at http://localhost:3000"