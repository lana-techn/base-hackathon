'use client'

import { motion } from "framer-motion"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"
import { FloatingElement, HoverScale, SlideIn } from "@/components/ui/micro-interactions"
import { GlassCard } from "@/components/ui/glass-card"
import { ParallaxScroll, ParallaxContainer } from "@/components/ui/parallax-scroll"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"

interface HeroSectionProps {
  title?: string
  subtitle?: string[]
  description?: string
  primaryCTA?: {
    text: string
    href: string
  }
  secondaryCTA?: {
    text: string
    href: string
  }
  showStats?: boolean
}

const HeroSection = ({
  title = "BethNa AI Trader",
  subtitle = [
    "Autonomous Trading",
    "AI-Powered Signals", 
    "Options Mastery",
    "Base Network"
  ],
  description = "Experience the future of cryptocurrency trading with our autonomous swarm agent system. Advanced AI algorithms analyze markets, execute options trades, and manage risk across Base L2 network.",
  primaryCTA = {
    text: "Launch Dashboard",
    href: "/dashboard"
  },
  secondaryCTA = {
    text: "View Documentation",
    href: "/docs"
  },
  showStats = true
}: HeroSectionProps) => {
  return (
    <ParallaxContainer className="min-h-screen relative overflow-hidden bg-background">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingElement intensity={15} className="absolute top-20 left-10">
          <div className="w-32 h-32 bg-primary/10 rounded-full blur-xl" />
        </FloatingElement>
        <FloatingElement intensity={20} className="absolute top-40 right-20">
          <div className="w-24 h-24 bg-primary/5 rounded-full blur-xl" />
        </FloatingElement>
        <FloatingElement intensity={12} className="absolute bottom-40 left-1/4">
          <div className="w-40 h-40 bg-info/10 rounded-full blur-xl" />
        </FloatingElement>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Title */}
          <SlideIn direction="up" delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-primary">
                {title}
              </span>
            </h1>
          </SlideIn>

          {/* Typewriter Subtitle */}
          <SlideIn direction="up" delay={0.4}>
            <div className="text-2xl md:text-4xl font-semibold text-foreground mb-8 h-16 flex items-center justify-center">
              <TypewriterEffect
                words={subtitle}
                className="text-primary"
                typeSpeed={80}
                deleteSpeed={40}
                delayBetweenWords={2000}
              />
            </div>
          </SlideIn>

          {/* Description */}
          <SlideIn direction="up" delay={0.6}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              {description}
            </p>
          </SlideIn>

          {/* CTA Buttons */}
          <SlideIn direction="up" delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <HoverScale scale={1.05}>
                <Link href={primaryCTA.href}>
                  <Button size="lg" className="px-8 py-4 text-lg font-semibold rounded-xl">
                    {primaryCTA.text}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </HoverScale>
              
              <HoverScale scale={1.02}>
                <Link href={secondaryCTA.href}>
                  <Button variant="outline" size="lg" className="px-8 py-4 text-lg rounded-xl">
                    {secondaryCTA.text}
                  </Button>
                </Link>
              </HoverScale>
            </div>
          </SlideIn>

          {/* Stats Cards */}
          {showStats && (
            <SlideIn direction="up" delay={1.0}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <ParallaxScroll speed={0.2}>
                  <GlassCard className="p-6 text-center">
                    <div className="flex items-center justify-center mb-3">
                      <Bot className="h-8 w-8 text-info" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-2">4</div>
                    <div className="text-muted-foreground text-sm">AI Agents</div>
                  </GlassCard>
                </ParallaxScroll>

                <ParallaxScroll speed={0.3}>
                  <GlassCard className="p-6 text-center">
                    <div className="flex items-center justify-center mb-3">
                      <TrendingUp className="h-8 w-8 text-success" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-2">24/7</div>
                    <div className="text-muted-foreground text-sm">Market Analysis</div>
                  </GlassCard>
                </ParallaxScroll>

                <ParallaxScroll speed={0.4}>
                  <GlassCard className="p-6 text-center">
                    <div className="flex items-center justify-center mb-3">
                      <Zap className="h-8 w-8 text-warning" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-2">Base L2</div>
                    <div className="text-muted-foreground text-sm">Network</div>
                  </GlassCard>
                </ParallaxScroll>
              </div>
            </SlideIn>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-border rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground rounded-full mt-2" />
        </div>
      </motion.div>
    </ParallaxContainer>
  )
}

export { HeroSection }