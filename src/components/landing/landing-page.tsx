'use client'

import { HeroSection } from './hero-section'
import { FeaturesSection } from './features-section'
import { HowItWorksSection } from './how-it-works-section'
import { AIAgentsSection } from './ai-agents-section'
import { LiveStatsSection } from './live-stats-section'
import { FAQSection } from './faq-section'
import { GetStartedSection } from './get-started-section'
import { Footer } from './footer'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { SmoothScrollWrapper, ParallaxSection } from '@/components/ui/smooth-scroll-wrapper'
import { HoverScale } from '@/components/ui/smooth-animations'
import Link from 'next/link'

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between px-6 py-3 rounded-2xl bg-card/50 dark:bg-card/30 backdrop-blur-xl border border-border/50 dark:border-white/10 shadow-lg">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orbit-500 to-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold text-foreground">BethNa AI</span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <HoverScale scale={1.05}>
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-[#C1FF72] hover:text-black transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-[0_0_15px_rgba(193,255,114,0.5)]"
              >
                Launch App
              </Link>
            </HoverScale>
          </div>
        </div>
      </div>
    </nav>
  )
}

export function LandingPage() {
  return (
    <SmoothScrollWrapper className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Hero with parallax elements */}
      <ParallaxSection speed={0.2}>
        <HeroSection />
      </ParallaxSection>

      {/* Features with slower parallax */}
      <div id="features">
        <ParallaxSection speed={0.1}>
          <FeaturesSection />
        </ParallaxSection>
      </div>

      {/* How It Works */}
      <div id="how-it-works">
        <HowItWorksSection />
      </div>

      {/* AI Agents with subtle parallax */}
      <ParallaxSection speed={0.05}>
        <AIAgentsSection />
      </ParallaxSection>

      {/* Live Stats */}
      <LiveStatsSection />

      {/* FAQ */}
      <div id="faq">
        <FAQSection />
      </div>

      {/* Get Started with reverse parallax */}
      <ParallaxSection speed={-0.05}>
        <GetStartedSection />
      </ParallaxSection>

      <Footer />
    </SmoothScrollWrapper>
  )
}
