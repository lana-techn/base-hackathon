#!/bin/bash

echo "🚀 Development Deployment Script"
echo "================================="
echo ""

# Check if user is maulana-tech
current_user=$(git config user.name)
if [ "$current_user" != "maulana-tech" ]; then
    echo "⚠️  Switching to maulana-tech user..."
    ./scripts/switch-user.sh dev
fi

echo "📋 Current setup:"
echo "   User: $(git config user.name)"
echo "   Email: $(git config user.email)"
echo "   Branch: $(git branch --show-current)"
echo ""

# Logout from any existing Vercel session
echo "🔓 Logging out from Vercel..."
vercel logout 2>/dev/null || true

echo ""
echo "🔑 Please login to Vercel with maulana-tech account..."
echo "    This will create a separate deployment for development"
echo ""

# Login to Vercel
vercel login

echo ""
echo "🚀 Deploying to development environment..."
echo "   This will create: bethna-ai-trader-dev-[random].vercel.app"
echo ""

# Deploy with different project name
vercel --prod --name bethna-ai-trader-dev

echo ""
echo "✅ Development deployment complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Set environment variables in Vercel dashboard"
echo "   2. Test the deployment"
echo "   3. Share the URL for testing"