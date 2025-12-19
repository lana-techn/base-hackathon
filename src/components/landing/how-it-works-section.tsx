'use client'

import { GlassCard } from "@/components/ui/glass-card"
import { useEffect, useRef, useState } from "react"

const steps = [
  {
    number: '01',
    title: 'Connect Wallet',
    description: 'Connect your Web3 wallet to access the trading terminal. We support MetaMask, WalletConnect, and more.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    number: '02',
    title: 'Fund Your Account',
    description: 'Deposit USDC or ETH to your trading account. Funds are secured by smart contracts on Base L2.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    number: '03',
    title: 'Configure Strategy',
    description: 'Set your risk parameters, position sizes, and trading preferences. Our AI adapts to your settings.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    number: '04',
    title: 'Start Trading',
    description: 'Activate the AI agents and watch them analyze markets, execute trades, and grow your portfolio.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
]

function StepCard({ step, index }: { step: typeof steps[0], index: number }) {
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
  
  return (
    <div
      ref={cardRef}
      className={`relative transform transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* Connector line */}
      {index < steps.length - 1 && (
        <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
      )}
      
      <GlassCard 
        variant="gradient" 
        blur="lg" 
        className="group p-6 h-full hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] dark:hover:shadow-[0_0_50px_rgba(59,130,246,0.15)] transition-all duration-500"
      >
        {/* Step number */}
        <div className="text-5xl font-bold text-primary/20 dark:text-primary/30 mb-4 group-hover:text-primary/30 dark:group-hover:text-primary/40 transition-colors">
          {step.number}
        </div>
        
        {/* Icon */}
        <div className="inline-flex p-3 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
          {step.icon}
        </div>
        
        {/* Content */}
        <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
        <p className="text-muted-foreground leading-relaxed">{step.description}</p>
      </GlassCard>
    </div>
  )
}

export function HowItWorksSection() {
  return (
    <section className="py-24 px-6 bg-muted/30 dark:bg-muted/10 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 mb-6">
            <span className="text-sm font-medium text-primary">Getting Started</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started with BethNa AI Trader in four simple steps.
          </p>
        </div>
        
        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
