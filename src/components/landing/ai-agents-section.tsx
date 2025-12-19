'use client'

import { GlassCard } from "@/components/ui/glass-card"
import { useEffect, useRef, useState } from "react"

const workflow = [
  {
    step: 1,
    title: 'Market Analysis',
    agent: 'Agent Alpha',
    description: 'Continuously monitors market data, calculates technical indicators, and identifies trading opportunities.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    )
  },
  {
    step: 2,
    title: 'Signal Generation',
    agent: 'Agent Alpha',
    description: 'Generates buy/sell signals based on multi-indicator confluence and risk parameters.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    step: 3,
    title: 'Trade Execution',
    agent: 'Agent Beta',
    description: 'Executes trades on-chain via smart contracts with MEV protection and optimal gas.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    step: 4,
    title: 'Position Management',
    agent: 'Agent Beta',
    description: 'Monitors open positions, manages stop-losses, and handles position sizing.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    )
  },
  {
    step: 5,
    title: 'Performance Reporting',
    agent: 'Agent Gamma',
    description: 'Posts real-time updates to Farcaster with trade details and performance metrics.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  }
]

function WorkflowStep({ item, index, isActive }: { item: typeof workflow[0], index: number, isActive: boolean }) {
  const agentColors = {
    'Agent Alpha': 'text-primary bg-primary/10 border-primary/20',
    'Agent Beta': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    'Agent Gamma': 'text-violet-500 bg-violet-500/10 border-violet-500/20'
  }
  
  return (
    <div className={`relative transition-all duration-500 ${isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-50'}`}>
      <GlassCard variant="gradient" blur="lg" className="p-6">
        {/* Step number */}
        <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg">
          {item.step}
        </div>
        
        {/* Icon */}
        <div className={`inline-flex p-2 rounded-lg ${agentColors[item.agent as keyof typeof agentColors]} border mb-4`}>
          {item.icon}
        </div>
        
        {/* Content */}
        <h3 className="text-lg font-semibold text-foreground mb-1">{item.title}</h3>
        <p className="text-xs font-medium text-muted-foreground mb-2">{item.agent}</p>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </GlassCard>
      
      {/* Connector line */}
      {index < workflow.length - 1 && (
        <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-border to-transparent dark:from-white/20" />
      )}
    </div>
  )
}

export function AIAgentsSection() {
  const [activeStep, setActiveStep] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % workflow.length)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <section ref={sectionRef} className="py-24 px-6 bg-muted/30 dark:bg-muted/10 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 dark:bg-violet-500/20 border border-violet-500/20 dark:border-violet-500/30 mb-6">
            <span className="text-sm font-medium text-violet-500">Automated Workflow</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A seamless pipeline from market analysis to trade execution and reporting.
          </p>
        </div>
        
        {/* Workflow visualization */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4">
          {workflow.map((item, index) => (
            <WorkflowStep 
              key={item.step} 
              item={item} 
              index={index}
              isActive={index === activeStep}
            />
          ))}
        </div>
        
        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {workflow.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeStep 
                  ? 'w-8 bg-primary' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
