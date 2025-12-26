'use client'

import { GlassCard } from "@/components/ui/glass-card"
import { useEffect, useRef, useState } from "react"
import { 
  FadeInUp, 
  StaggerContainer, 
  StaggerItem, 
  HoverScale,
  HoverGlow 
} from "@/components/ui/smooth-animations"

const agents = [
  {
    name: 'Agent Alpha',
    role: 'Quantitative Analyst',
    description: 'Advanced technical analysis with RSI, MACD, Bollinger Bands, and custom ML indicators.',
    color: 'primary',
    size: 'large',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    features: ['Technical Indicators', 'Backtesting', 'Signal Generation', 'Risk Assessment'],
    visual: (
      <div className="relative h-32 mt-4">
        {/* Chart visual */}
        <svg className="w-full h-full opacity-60" viewBox="0 0 200 80">
          <path d="M0,60 Q30,40 60,50 T120,30 T180,40 T200,20" fill="none" stroke="url(#alphaGrad)" strokeWidth="2" />
          <circle cx="60" cy="50" r="4" fill="#7c3aed" />
          <circle cx="120" cy="30" r="3" fill="#a855f7" />
          <circle cx="180" cy="40" r="5" fill="#7c3aed" />
          <defs>
            <linearGradient id="alphaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    )
  },
  {
    name: 'Agent Beta',
    role: 'Trade Executor',
    description: 'On-chain execution via smart contracts on Base L2 with MEV protection.',
    color: 'success',
    size: 'medium',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    features: ['Smart Contracts', 'MEV Protection', 'Gas Optimization', 'Position Mgmt'],
    visual: (
      <div className="relative h-20 mt-4 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 flex items-center justify-center animate-pulse">
          <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
    )
  },
  {
    name: 'Agent Gamma',
    role: 'Social Coordinator',
    description: 'Real-time reporting and community engagement via Farcaster.',
    color: 'accent',
    size: 'medium',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    features: ['Farcaster', 'Performance Reports', 'Community', 'Transparency'],
    visual: (
      <div className="relative h-20 mt-4 flex items-center justify-center">
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-full bg-orbit-500/20 animate-float" style={{ animationDelay: '0s' }} />
          <div className="w-6 h-6 rounded-full bg-orbit-400/30 animate-float" style={{ animationDelay: '0.3s' }} />
          <div className="w-10 h-10 rounded-full bg-orbit-500/20 animate-float" style={{ animationDelay: '0.6s' }} />
        </div>
      </div>
    )
  },
  {
    name: 'AI Swarm Network',
    role: 'Autonomous Coordination',
    description: 'All three agents work in perfect harmony, sharing insights and coordinating trades for optimal results.',
    color: 'accent',
    size: 'wide',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    features: [],
    visual: (
      <div className="relative h-24 mt-4">
        <svg className="w-full h-full" viewBox="0 0 400 80">
          {/* Connection lines */}
          <path d="M50,40 Q150,20 200,40 T350,40" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
          <path d="M50,40 Q150,60 200,40 T350,40" fill="none" stroke="#7c3aed" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />

          {/* Nodes */}
          <circle cx="50" cy="40" r="8" fill="#7c3aed" opacity="0.8" />
          <circle cx="200" cy="40" r="10" fill="#a855f7" />
          <circle cx="350" cy="40" r="8" fill="#7c3aed" opacity="0.8" />

          {/* Orbiting dots */}
          <circle cx="120" cy="30" r="3" fill="#a855f7" opacity="0.6" />
          <circle cx="280" cy="50" r="3" fill="#a855f7" opacity="0.6" />
        </svg>
      </div>
    )
  }
]

function AgentBentoCard({ agent, index }: { agent: typeof agents[0], index: number }) {
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
    },
    success: {
      text: 'text-emerald-500',
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      border: 'border-emerald-500/20 dark:border-emerald-500/30',
    },
    accent: {
      text: 'text-orbit-500',
      bg: 'bg-orbit-500/10 dark:bg-orbit-500/20',
      border: 'border-orbit-500/20 dark:border-orbit-500/30',
    }
  }

  const colors = colorClasses[agent.color as keyof typeof colorClasses]

  // Grid size classes
  const sizeClasses = {
    large: 'md:col-span-1 md:row-span-2',
    wide: 'md:col-span-2 md:row-span-1',
    medium: 'md:col-span-1 md:row-span-1',
  }

  return (
    <div
      ref={cardRef}
      className={`relative group ${sizeClasses[agent.size as keyof typeof sizeClasses]} transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
    >
      {/* Glass card */}
      <div className="h-full p-6 rounded-2xl bg-card/60 dark:bg-card/40 backdrop-blur-xl border border-[#C1FF72]/40 dark:border-[#C1FF72]/30 hover:border-[#C1FF72]/70 transition-all duration-500 overflow-hidden shadow-[0_0_1px_#C1FF72,0_0_4px_#C1FF72,0_0_8px_rgba(193,255,114,0.4)] hover:shadow-[0_0_2px_#C1FF72,0_0_8px_#C1FF72,0_0_15px_rgba(193,255,114,0.5)] dark:shadow-[0_0_1px_#C1FF72,0_0_6px_#C1FF72,0_0_12px_rgba(193,255,114,0.3)] dark:hover:shadow-[0_0_2px_#C1FF72,0_0_10px_#C1FF72,0_0_20px_rgba(193,255,114,0.4)]">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orbit-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Decorative dots */}
        <div className="absolute top-4 right-4 w-1 h-1 rounded-full bg-white/30" />
        <div className="absolute top-8 right-8 w-0.5 h-0.5 rounded-full bg-white/20" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Icon */}
          <div className={`inline-flex p-3 rounded-xl ${colors.bg} ${colors.border} border w-fit mb-4`}>
            <span className={colors.text}>{agent.icon}</span>
          </div>

          {/* Header */}
          <h3 className={`text-xl font-bold ${colors.text} mb-1`}>{agent.name}</h3>
          <p className="text-xs text-muted-foreground font-medium mb-2">{agent.role}</p>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {agent.description}
          </p>

          {/* Features tags */}
          {agent.features.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {agent.features.map((feature, i) => (
                <span
                  key={i}
                  className={`px-2 py-1 text-xs rounded-md ${colors.bg} ${colors.text}`}
                >
                  {feature}
                </span>
              ))}
            </div>
          )}

          {/* Visual element */}
          <div className="mt-auto">
            {agent.visual}
          </div>

          {/* Status indicator */}
          <div className="mt-4 pt-4 border-t border-border/50 dark:border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Status</span>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors.bg} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${colors.text.replace('text-', 'bg-')}`}></span>
                </span>
                <span className={`text-xs font-medium ${colors.text}`}>Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-muted/30 dark:bg-muted/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-orbit-500/5 dark:bg-orbit-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orbit-500/10 dark:bg-orbit-500/20 border border-orbit-500/20 dark:border-orbit-500/30 mb-6">
            <span className="text-sm font-medium text-orbit-500">Powered by AI</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Meet the AI Agents
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Three specialized AI agents working together to analyze markets, execute trades, and keep you informed.
          </p>
        </div>

        {/* Bento Grid for agents */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 md:gap-5">
          {agents.map((agent, index) => (
            <AgentBentoCard key={agent.name} agent={agent} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
