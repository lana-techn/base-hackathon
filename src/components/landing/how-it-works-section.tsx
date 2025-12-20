'use client'

import { useEffect, useRef, useState } from "react"

const steps = [
  {
    number: '01',
    title: 'Fast, easy, reliable',
    description: 'Connect your Web3 wallet to access the trading terminal. We support MetaMask, WalletConnect, and more.',
    size: 'large', // spans 2 rows
    visual: 'swap',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    number: '02',
    title: 'Competitive real-time prices',
    description: 'Choose the best quote from top providers like CoinGecko, Coinbase, and DEXs.',
    size: 'wide', // spans 2 columns
    visual: 'chart',
  },
  {
    number: '03',
    title: 'Thousands of tokens on multiple networks',
    description: 'Buy crypto directly on popular networks including Base, Ethereum, and more.',
    size: 'medium',
    visual: 'globe',
  },
  {
    number: '04',
    title: 'World-class 24/7 support',
    description: 'Get speedy around-the-clock help from our team of (AI!) trading experts.',
    size: 'medium',
    visual: 'network',
  }
]

// Decorative swap visual
function SwapVisual() {
  return (
    <div className="relative flex items-center justify-center py-8">
      {/* Swap circle */}
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-orbit-500/20 border border-orbit-500/30 flex items-center justify-center">
          <svg className="w-6 h-6 text-orbit-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </div>

        {/* Left token */}
        <div className="absolute -left-16 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            ETH
          </div>
          <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-muted/50">Sell</span>
        </div>

        {/* Right token */}
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-muted/50">Buy</span>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            USDT
          </div>
        </div>
      </div>
    </div>
  )
}

// Chart visual with price comparison
function ChartVisual() {
  return (
    <div className="relative h-32 mt-4">
      {/* Price indicators */}
      <div className="absolute top-0 right-0 flex flex-col gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/50 border border-border/50">
          <span className="text-xs font-medium text-foreground">stripe</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-500">BEST RATE</span>
          <span className="text-sm font-medium text-foreground">$225.1 USDC</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30 border border-border/30">
          <span className="text-xs font-medium text-muted-foreground">Transak</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">PREVIOUSLY USED</span>
          <span className="text-sm font-medium text-muted-foreground">$255.2 USDC</span>
        </div>
      </div>

      {/* Animated lines */}
      <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 400 100">
        <path
          d="M0,80 Q50,70 100,60 T200,50 T300,30 T400,20"
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <path
          d="M0,90 Q80,75 150,65 T300,45 T400,35"
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="1"
          strokeDasharray="2 2"
          opacity="0.5"
        />
        {/* Dots */}
        <circle cx="100" cy="60" r="3" fill="#a855f7" />
        <circle cx="200" cy="50" r="2" fill="#a855f7" opacity="0.6" />
        <circle cx="300" cy="30" r="4" fill="#a855f7" />
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

// Globe visual with network nodes
function GlobeVisual() {
  return (
    <div className="relative w-24 h-24 mx-auto my-4">
      {/* Orbit rings */}
      <div className="absolute inset-0 rounded-full border border-orbit-500/20 animate-orbit-rotate" />
      <div className="absolute inset-[-10%] rounded-full border border-orbit-400/10 animate-orbit-rotate" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />

      {/* Core */}
      <div className="absolute inset-[20%] rounded-full bg-gradient-to-br from-orbit-500/40 to-orbit-600/20 blur-sm" />
      <div className="absolute inset-[25%] rounded-full bg-gradient-to-br from-orbit-400 to-orbit-500 shadow-lg" />

      {/* Nodes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-3 h-3 rounded-full bg-orbit-400 shadow-lg animate-pulse" />
      <div className="absolute bottom-2 right-0 w-2 h-2 rounded-full bg-orbit-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
    </div>
  )
}

// Network visual with dotted connections
function NetworkVisual() {
  return (
    <div className="relative w-full h-32">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100">
        {/* Orbit circles */}
        <ellipse cx="140" cy="50" rx="40" ry="35" fill="none" stroke="#a855f7" strokeWidth="1" opacity="0.3" />
        <ellipse cx="140" cy="50" rx="55" ry="45" fill="none" stroke="#a855f7" strokeWidth="0.5" opacity="0.2" strokeDasharray="4 4" />

        {/* Connection dots */}
        <circle cx="100" cy="50" r="4" fill="#7c3aed" />
        <circle cx="180" cy="30" r="3" fill="#a855f7" />
        <circle cx="170" cy="70" r="3" fill="#a855f7" />

        {/* Dotted lines */}
        <line x1="100" y1="50" x2="180" y2="30" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
        <line x1="100" y1="50" x2="170" y2="70" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
      </svg>
    </div>
  )
}

function BentoCard({ step, index }: { step: typeof steps[0], index: number }) {
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

  // Grid classes based on size
  const sizeClasses = {
    large: 'md:col-span-1 md:row-span-2',
    wide: 'md:col-span-2 md:row-span-1',
    medium: 'md:col-span-1 md:row-span-1',
  }

  // Get the visual component
  const getVisual = () => {
    switch (step.visual) {
      case 'swap': return <SwapVisual />
      case 'chart': return <ChartVisual />
      case 'globe': return <GlobeVisual />
      case 'network': return <NetworkVisual />
      default: return null
    }
  }

  return (
    <div
      ref={cardRef}
      className={`relative group ${sizeClasses[step.size as keyof typeof sizeClasses]} transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
    >
      {/* Glass card with dark theme */}
      <div className="h-full p-6 rounded-2xl bg-card/60 dark:bg-card/40 backdrop-blur-xl border border-[#C1FF72]/40 dark:border-[#C1FF72]/30 hover:border-[#C1FF72]/70 transition-all duration-500 overflow-hidden shadow-[0_0_1px_#C1FF72,0_0_4px_#C1FF72,0_0_8px_rgba(193,255,114,0.4)] hover:shadow-[0_0_2px_#C1FF72,0_0_8px_#C1FF72,0_0_15px_rgba(193,255,114,0.5)] dark:shadow-[0_0_1px_#C1FF72,0_0_6px_#C1FF72,0_0_12px_rgba(193,255,114,0.3)] dark:hover:shadow-[0_0_2px_#C1FF72,0_0_10px_#C1FF72,0_0_20px_rgba(193,255,114,0.4)]">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orbit-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Star/dot decorations */}
        <div className="absolute top-4 right-4 w-1 h-1 rounded-full bg-white/30" />
        <div className="absolute top-8 right-8 w-0.5 h-0.5 rounded-full bg-white/20" />
        <div className="absolute bottom-10 left-10 w-1 h-1 rounded-full bg-orbit-400/30" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">{step.title}</h3>
          <p className="text-sm text-muted-foreground mb-4 flex-grow">{step.description}</p>

          {/* Visual element */}
          <div className="mt-auto">
            {getVisual()}
          </div>

          {/* Read More button for large cards */}
          {step.size === 'large' && (
            <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 dark:bg-white/10 border border-border/50 dark:border-white/20 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Read More
              <span className="flex gap-0.5">
                <span className="w-1 h-1 rounded-full bg-current" />
                <span className="w-1 h-1 rounded-full bg-current" />
                <span className="w-1 h-1 rounded-full bg-current" />
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function HowItWorksSection() {
  return (
    <section className="py-24 px-6 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orbit-500/5 dark:bg-orbit-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Buy and sell crypto with the<br />most secure wallet
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced encryption and multi-signature security protect your assets. Your keys, your crypto.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 md:gap-5">
          {steps.map((step, index) => (
            <BentoCard key={step.number} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
