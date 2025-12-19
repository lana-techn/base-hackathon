'use client'

import { GlassCard, Web3Card } from "@/components/ui/glass-card"
import { useEffect, useRef, useState } from "react"

const agents = [
  {
    name: 'Agent Alpha',
    role: 'Quantitative Analyst',
    description: 'Advanced technical analysis with RSI, MACD, Bollinger Bands, and custom ML indicators for precise market predictions.',
    color: 'primary',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    features: ['Technical Indicators', 'Backtesting Engine', 'Signal Generation', 'Risk Assessment']
  },
  {
    name: 'Agent Beta',
    role: 'Trade Executor',
    description: 'On-chain trade execution via smart contracts on Base L2 with MEV protection and optimal gas management.',
    color: 'success',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    features: ['Smart Contracts', 'MEV Protection', 'Gas Optimization', 'Position Management']
  },
  {
    name: 'Agent Gamma',
    role: 'Social Coordinator',
    description: 'Real-time performance reporting and community engagement through Farcaster with transparent trade logs.',
    color: 'accent',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    features: ['Farcaster Integration', 'Performance Reports', 'Community Updates', 'Trade Transparency']
  }
]

function AgentCard({ agent, index }: { agent: typeof agents[0], index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 150)
        }
      },
      { threshold: 0.1 }
    )
    
    if (cardRef.current) {
      observer.observe(cardRef.current)
    }
    
    return () => observer.disconnect()
  }, [index])
  
  const colorClasses = {
    primary: {
      text: 'text-primary',
      bg: 'bg-primary/10 dark:bg-primary/20',
      border: 'border-primary/20 dark:border-primary/30',
      glow: 'group-hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] dark:group-hover:shadow-[0_0_50px_rgba(59,130,246,0.2)]'
    },
    success: {
      text: 'text-emerald-500',
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      border: 'border-emerald-500/20 dark:border-emerald-500/30',
      glow: 'group-hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] dark:group-hover:shadow-[0_0_50px_rgba(16,185,129,0.2)]'
    },
    accent: {
      text: 'text-violet-500',
      bg: 'bg-violet-500/10 dark:bg-violet-500/20',
      border: 'border-violet-500/20 dark:border-violet-500/30',
      glow: 'group-hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] dark:group-hover:shadow-[0_0_50px_rgba(139,92,246,0.2)]'
    }
  }
  
  const colors = colorClasses[agent.color as keyof typeof colorClasses]
  
  return (
    <div
      ref={cardRef}
      className={`transform transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <GlassCard 
        variant="gradient" 
        blur="lg"
        className={`group h-full p-6 md:p-8 ${colors.glow} transition-all duration-500`}
      >
        {/* Icon */}
        <div className={`inline-flex p-3 rounded-xl ${colors.bg} ${colors.border} border mb-6`}>
          <span className={colors.text}>{agent.icon}</span>
        </div>
        
        {/* Header */}
        <div className="mb-4">
          <h3 className={`text-2xl font-bold ${colors.text} mb-1`}>{agent.name}</h3>
          <p className="text-sm text-muted-foreground font-medium">{agent.role}</p>
        </div>
        
        {/* Description */}
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {agent.description}
        </p>
        
        {/* Features */}
        <div className="space-y-2">
          {agent.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <svg className={`w-4 h-4 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-foreground/80">{feature}</span>
            </div>
          ))}
        </div>
        
        {/* Status indicator */}
        <div className="mt-6 pt-6 border-t border-border/50 dark:border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors.bg} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${colors.text.replace('text-', 'bg-')}`}></span>
              </span>
              <span className={`text-sm font-medium ${colors.text}`}>Active</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

export function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 mb-6">
            <span className="text-sm font-medium text-primary">Powered by AI</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Meet the AI Agents
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three specialized AI agents working together to analyze markets, execute trades, and keep you informed.
          </p>
        </div>
        
        {/* Agent cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {agents.map((agent, index) => (
            <AgentCard key={agent.name} agent={agent} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
