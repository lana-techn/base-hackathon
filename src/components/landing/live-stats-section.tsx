'use client'

import { GlassCard } from "@/components/ui/glass-card"
import { useEffect, useState, useRef } from "react"

const stats = [
  { 
    label: 'Total Volume', 
    value: 2547832, 
    prefix: '$',
    change: '+12.5%',
    positive: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  { 
    label: 'Trades Today', 
    value: 47, 
    change: '+8',
    positive: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
  { 
    label: 'Win Rate', 
    value: 73.2, 
    suffix: '%',
    change: '+2.1%',
    positive: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    )
  },
  { 
    label: 'Avg Return', 
    value: 18.7, 
    suffix: '%',
    change: '+3.2%',
    positive: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  }
]

const recentTrades = [
  { pair: 'ETH/USDC', type: 'LONG', entry: 3245.50, current: 3312.80, pnl: '+2.07%', time: '2m ago' },
  { pair: 'BTC/USDC', type: 'SHORT', entry: 67890.00, current: 67450.00, pnl: '+0.65%', time: '15m ago' },
  { pair: 'ARB/USDC', type: 'LONG', entry: 1.12, current: 1.18, pnl: '+5.36%', time: '1h ago' },
  { pair: 'OP/USDC', type: 'LONG', entry: 2.45, current: 2.52, pnl: '+2.86%', time: '2h ago' },
]

function AnimatedValue({ value, prefix = '', suffix = '' }: { value: number, prefix?: string, suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const duration = 2000
          const steps = 60
          const increment = value / steps
          let current = 0
          
          const timer = setInterval(() => {
            current += increment
            if (current >= value) {
              setDisplayValue(value)
              clearInterval(timer)
            } else {
              setDisplayValue(current)
            }
          }, duration / steps)
        }
      },
      { threshold: 0.1 }
    )
    
    if (ref.current) {
      observer.observe(ref.current)
    }
    
    return () => observer.disconnect()
  }, [value, hasAnimated])
  
  const formatted = displayValue >= 1000000 
    ? `${(displayValue / 1000000).toFixed(2)}M`
    : displayValue >= 1000 
      ? `${(displayValue / 1000).toFixed(1)}K`
      : displayValue % 1 === 0 
        ? displayValue.toLocaleString()
        : displayValue.toFixed(1)
  
  return <span ref={ref}>{prefix}{formatted}{suffix}</span>
}

function StatCard({ stat, index }: { stat: typeof stats[0], index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 100)
        }
      },
      { threshold: 0.1 }
    )
    
    if (cardRef.current) {
      observer.observe(cardRef.current)
    }
    
    return () => observer.disconnect()
  }, [index])
  
  return (
    <div
      ref={cardRef}
      className={`transform transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <GlassCard variant="gradient" blur="lg" className="p-6 h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary">
            {stat.icon}
          </div>
          <span className={`text-sm font-medium ${stat.positive ? 'text-emerald-500' : 'text-red-500'}`}>
            {stat.change}
          </span>
        </div>
        
        <div className="text-3xl font-bold text-foreground mb-1">
          <AnimatedValue value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
        </div>
        <div className="text-sm text-muted-foreground">{stat.label}</div>
      </GlassCard>
    </div>
  )
}

export function LiveStatsSection() {
  return (
    <section className="py-24 px-6 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 dark:border-emerald-500/30 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-medium text-emerald-500">Live Data</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Real-Time Performance
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track our AI agents&apos; performance with live statistics and recent trades.
          </p>
        </div>
        
        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
        
        {/* Recent trades */}
        <GlassCard variant="gradient" blur="lg" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Recent Trades</h3>
            <span className="text-sm text-muted-foreground">Last 24h</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-muted-foreground border-b border-border/50 dark:border-white/10">
                  <th className="pb-3 font-medium">Pair</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Entry</th>
                  <th className="pb-3 font-medium">Current</th>
                  <th className="pb-3 font-medium">P&L</th>
                  <th className="pb-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentTrades.map((trade, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-border/30 dark:border-white/5 last:border-0 hover:bg-muted/30 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 font-medium text-foreground">{trade.pair}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        trade.type === 'LONG' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        {trade.type}
                      </span>
                    </td>
                    <td className="py-4 text-muted-foreground">${trade.entry.toLocaleString()}</td>
                    <td className="py-4 text-foreground">${trade.current.toLocaleString()}</td>
                    <td className="py-4 text-emerald-500 font-medium">{trade.pnl}</td>
                    <td className="py-4 text-muted-foreground text-sm">{trade.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </section>
  )
}
