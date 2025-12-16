#!/bin/bash

echo "🔧 Setting up Vercel Environment Variables"
echo "=========================================="

# Required environment variables
echo "Setting required environment variables..."

vercel env add NEXT_PUBLIC_BASE_RPC_URL production <<< "https://mainnet.base.org"
vercel env add NEXT_PUBLIC_BASE_TESTNET_RPC_URL production <<< "https://sepolia.base.org"

echo ""
echo "✅ Basic environment variables set!"
echo ""
echo "🔑 IMPORTANT: You still need to set:"
echo "   NEXT_PUBLIC_ONCHAINKIT_API_KEY"
echo ""
echo "Get your OnchainKit API key from:"
echo "   https://portal.cdp.coinbase.com/"
echo ""
echo "Then run:"
echo "   vercel env add NEXT_PUBLIC_ONCHAINKIT_API_KEY production"
echo ""
echo "After setting the API key, redeploy with:"
echo "   vercel --prod"