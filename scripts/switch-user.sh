#!/bin/bash

# Git User Switcher for BethNa AI Trader

case "$1" in
  "dev"|"maulana")
    echo "🔧 Switching to maulana-tech (Developer)"
    git config user.name "maulana-tech"
    git config user.email "firdaussyah03@gmail.com"
    echo "✅ Switched to: $(git config user.name) <$(git config user.email)>"
    echo "📝 Use this for: Feature development, bug fixes, testing"
    ;;
  "prod"|"lana")
    echo "🚀 Switching to lana-techn (Maintainer)"
    git config user.name "lana-techn"
    git config user.email "developerlana0@gmail.com"
    echo "✅ Switched to: $(git config user.name) <$(git config user.email)>"
    echo "📝 Use this for: Production merges, releases, Vercel deployments"
    ;;
  "status"|"check")
    echo "📊 Current Git User:"
    echo "   Name: $(git config user.name)"
    echo "   Email: $(git config user.email)"
    echo "   Branch: $(git branch --show-current)"
    ;;
  *)
    echo "🌿 Git User Switcher - BethNa AI Trader"
    echo "========================================="
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  dev, maulana    Switch to maulana-tech (Developer)"
    echo "  prod, lana      Switch to lana-techn (Maintainer)"
    echo "  status, check   Show current user and branch"
    echo ""
    echo "Examples:"
    echo "  $0 dev          # Switch to development user"
    echo "  $0 prod         # Switch to production user"
    echo "  $0 status       # Check current user"
    echo ""
    echo "Current user: $(git config user.name) <$(git config user.email)>"
    echo "Current branch: $(git branch --show-current)"
    ;;
esac