'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

// Decorative orb component
function DecorativeOrb() {
  return (
    <div className="relative w-full h-full min-h-[300px]">
      {/* Main glowing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orbit-500/40 via-primary/30 to-orbit-400/20 blur-2xl animate-orbit-pulse" />
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-orbit-400/30 via-primary/20 to-transparent blur-xl" />
        <div className="absolute inset-[20%] rounded-full bg-gradient-to-br from-orbit-500 via-primary to-orbit-600 shadow-2xl" />
        <div className="absolute inset-[25%] rounded-full bg-gradient-to-br from-orbit-400 via-orbit-500 to-orbit-600 shadow-xl">
          <div className="absolute top-3 left-1/4 w-1/3 h-1/4 rounded-full bg-white/30 blur-md" />
        </div>
        {/* Orbit rings */}
        <div className="absolute inset-[-10%] rounded-full border border-orbit-500/20 animate-orbit-rotate" />
        <div className="absolute inset-[-25%] rounded-full border border-orbit-400/10 animate-orbit-rotate" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />
      </div>

      {/* Floating particles */}
      <div className="absolute top-[20%] right-[30%] w-3 h-3 rounded-full bg-orbit-500/60 animate-float" />
      <div className="absolute bottom-[25%] left-[25%] w-2 h-2 rounded-full bg-orbit-400/50 animate-float-slow" />
      <div className="absolute top-[60%] right-[20%] w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />

      {/* Stats badges */}
      <div className="absolute top-4 right-4 px-4 py-2 rounded-xl bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 dark:border-white/10">
        <div className="text-2xl font-bold text-foreground">50K</div>
        <div className="text-xs text-muted-foreground">Active traders</div>
      </div>
      <div className="absolute bottom-4 left-4 px-4 py-2 rounded-xl bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 dark:border-white/10">
        <div className="text-xl font-bold text-orbit-500">2.5x</div>
        <div className="text-xs text-muted-foreground">Avg returns</div>
      </div>
    </div>
  )
}

export function GetStartedSection() {
  const router = useRouter()

  return (
    <section className="py-24 px-6 bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-orbit-500/10 dark:bg-orbit-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left side - Text content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orbit-500/10 dark:bg-orbit-500/20 border border-orbit-500/20 dark:border-orbit-500/30 mb-6">
              <svg className="w-4 h-4 text-orbit-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm font-medium text-orbit-500">millennial choice</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Let&apos;s orbit the Web3
            </h2>

            {/* Description */}
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              &quot;Orbit makes it easy to buy, earn and keep crypto. It&apos;s available
              in all kinds of crypto devices, and the mobile app is easy to use and
              been getting better.&quot;
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={() => router.push('/dashboard')}
                className="group relative overflow-hidden bg-primary hover:bg-[#C1FF72] text-primary-foreground hover:text-black px-8 py-6 text-lg rounded-xl shadow-lg shadow-primary/25 hover:shadow-[0_0_20px_rgba(193,255,114,0.6)] transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get started now
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg rounded-xl border-border/50 dark:border-white/10 bg-card/50 dark:bg-card/30 backdrop-blur-sm hover:border-[#C1FF72] hover:shadow-[0_0_15px_rgba(193,255,114,0.4)] transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Learn More
                </span>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Audited</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-orbit-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Non-Custodial</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Base L2</span>
              </div>
            </div>
          </div>

          {/* Right side - Decorative orb */}
          <div className="hidden lg:block">
            <DecorativeOrb />
          </div>
        </div>
      </div>
    </section>
  )
}
