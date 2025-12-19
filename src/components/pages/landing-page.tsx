'use client'

import { useEffect } from "react"
import { SmoothScroll } from "@/components/ui/smooth-scroll"
import { Web3Nav } from "@/components/navigation/web3-nav"
import { HeroSection } from "@/components/sections/hero-section"
import { AIAgentsSection } from "@/components/sections/ai-agents-section"
import { HowItWorksSection } from "@/components/sections/how-it-works-section"
import { LiveStatsSection } from "@/components/sections/live-stats-section"
import { useAgentAlpha } from "@/hooks/useAgentAlpha"

const LandingPage = () => {
  const { isConnected, error } = useAgentAlpha({
    symbol: 'ETH/USDT',
    interval: '1h',
    autoRefresh: false
  })

  // Determine agent status based on connection
  const agentStatus = error ? 'error' : isConnected ? 'online' : 'offline'

  useEffect(() => {
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth'
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background">
        
        {/* Navigation */}
        <Web3Nav 
          networkStatus="connected"
          agentStatus={agentStatus}
        />

        {/* Hero Section */}
        <HeroSection 
          title="BethNa AI Trader"
          subtitle={[
            "Autonomous Trading",
            "AI-Powered Signals", 
            "Options Mastery",
            "Base Network"
          ]}
          description="Experience the future of cryptocurrency trading with our autonomous swarm agent system. Advanced AI algorithms analyze markets, execute options trades, and manage risk across Base L2 network."
          primaryCTA={{
            text: "Launch Dashboard",
            href: "/dashboard"
          }}
          secondaryCTA={{
            text: "View Documentation", 
            href: "/docs"
          }}
          showStats={true}
        />

        {/* AI Agents Section */}
        <AIAgentsSection />

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Live Stats Section */}
        <LiveStatsSection />

        {/* Footer */}
        <footer className="py-12 px-4 bg-card border-t border-border">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              
              {/* Brand */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-lg" />
                  <span className="font-bold text-foreground text-xl">BethNa</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Autonomous AI trading system for cryptocurrency options on Base L2 network.
                </p>
              </div>

              {/* Product */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Product</h4>
                <div className="space-y-2">
                  <a href="/dashboard" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">
                    Trading Dashboard
                  </a>
                  <a href="/agents" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">
                    AI Agents
                  </a>
                  <a href="/analytics" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">
                    Analytics
                  </a>
                </div>
              </div>

              {/* Resources */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Resources</h4>
                <div className="space-y-2">
                  <a href="/docs" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">
                    Documentation
                  </a>
                  <a href="/api" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">
                    API Reference
                  </a>
                  <a href="/support" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">
                    Support
                  </a>
                </div>
              </div>

              {/* Social */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Community</h4>
                <div className="space-y-2">
                  <a href="https://twitter.com" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">
                    Twitter/X
                  </a>
                  <a href="https://warpcast.com" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">
                    Farcaster
                  </a>
                  <a href="https://github.com" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">
                    GitHub
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
              <p className="text-muted-foreground text-sm">
                © 2025 BethNa AI Trader. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="/privacy" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-lg">
              <p className="text-amber-800 dark:text-amber-200 text-sm text-center">
                <strong>Disclaimer:</strong> This is an autonomous swarm agent system that operates across multiple blockchain networks. 
                Users should understand the risks involved in automated trading. Use at your own risk.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  )
}

export { LandingPage }