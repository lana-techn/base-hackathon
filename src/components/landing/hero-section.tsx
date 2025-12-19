'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'

// Animated orb/globe component for Orbit style
function OrbitGlobe({ className }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Main glowing orb */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orbit-500/40 via-orbit-600/30 to-transparent blur-2xl animate-orbit-pulse" />
      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-orbit-400/30 via-primary/20 to-transparent blur-xl" />

      {/* Orbit rings */}
      <div className="absolute inset-0 rounded-full border border-orbit-500/20 animate-orbit-rotate" />
      <div className="absolute inset-[-10%] rounded-full border border-orbit-400/10 animate-orbit-rotate" style={{ animationDuration: '30s' }} />
      <div className="absolute inset-[-20%] rounded-full border border-orbit-500/5 animate-orbit-rotate" style={{ animationDuration: '40s', animationDirection: 'reverse' }} />

      {/* Core sphere */}
      <div className="absolute inset-[15%] rounded-full bg-gradient-to-br from-orbit-500 via-primary to-orbit-600 opacity-80 blur-sm" />
      <div className="absolute inset-[20%] rounded-full bg-gradient-to-br from-orbit-400 via-orbit-500 to-orbit-600 shadow-2xl">
        {/* Reflection */}
        <div className="absolute top-2 left-1/4 w-1/3 h-1/4 rounded-full bg-white/30 blur-md" />
      </div>

      {/* Floating particles around globe */}
      <div className="absolute top-[10%] right-[15%] w-2 h-2 rounded-full bg-orbit-400 animate-float" />
      <div className="absolute bottom-[20%] left-[10%] w-1.5 h-1.5 rounded-full bg-orbit-500 animate-float-slow" />
      <div className="absolute top-[40%] right-[5%] w-1 h-1 rounded-full bg-white/60 animate-pulse" />
    </div>
  )
}

// Grid background with space feel
function SpaceBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Space gradient */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-gradient-to-b from-orbit-600/5 via-transparent to-orbit-500/5 dark:from-orbit-600/10 dark:via-transparent dark:to-orbit-500/10" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Radial glow */}
      <div className="parallax-slow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-orbit-500/5 dark:bg-orbit-500/10 rounded-full blur-3xl" />

      {/* Top decorative blur */}
      <div className="parallax-fast absolute -top-40 -right-40 w-80 h-80 bg-orbit-500/20 dark:bg-orbit-500/30 rounded-full blur-3xl" />
      <div className="parallax-slow absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl" />
    </div>
  )
}

// Animated stats counter
function AnimatedNumber({ value, suffix = '' }: { value: number, suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return <span>{count.toLocaleString()}{suffix}</span>
}

// Stats separator dot
function StatSeparator() {
  return (
    <div className="hidden md:flex items-center justify-center">
      <div className="w-1.5 h-1.5 rounded-full bg-orbit-500/50" />
    </div>
  )
}

// Individual stat item
function StatItem({ value, label, prefix = '' }: { value: string | number, label: string, prefix?: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl md:text-3xl font-bold text-foreground">
        {prefix}{typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
      </div>
      <div className="text-xs md:text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  )
}

// Floating particles
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
    }> = []

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1
      })
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        // Orbit purple color
        ctx.fillStyle = `rgba(139, 92, 246, ${p.opacity})`
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
}

export function HeroSection() {
  const router = useRouter()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background pt-20">
      {/* Background effects */}
      <SpaceBackground />
      <Particles />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left side - Text content */}
          <div
            className="text-center lg:text-left"
            style={{
              transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`
            }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orbit-500/10 dark:bg-orbit-500/20 border border-orbit-500/20 dark:border-orbit-500/30 mb-8 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orbit-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orbit-500"></span>
              </span>
              <span className="text-sm font-medium text-orbit-500">Live on Base L2</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              <span className="text-foreground">The world's most</span>
              <span className="block mt-2 bg-gradient-to-r from-orbit-500 via-primary to-orbit-400 bg-clip-text text-transparent">
                trusted AI trader
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Autonomous AI options trading system built on{' '}
              <span className="text-foreground font-medium">Base L2</span>.
              Three specialized AI agents working in{' '}
              <span className="text-orbit-500 font-medium">perfect coordination</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button
                size="lg"
                onClick={() => router.push('/dashboard')}
                className="group relative overflow-hidden bg-primary hover:bg-[#C1FF72] text-primary-foreground hover:text-black px-8 py-6 text-lg rounded-xl shadow-lg shadow-primary/25 hover:shadow-[0_0_20px_rgba(193,255,114,0.6)] transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get started
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Whitepaper
                </span>
              </Button>
            </div>
          </div>

          {/* Right side - Globe visual */}
          <div
            className="relative hidden lg:flex items-center justify-center"
            style={{
              transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
            }}
          >
            <OrbitGlobe className="w-[400px] h-[400px] xl:w-[500px] xl:h-[500px]" />
          </div>
        </div>

        {/* Stats bar - Orbit style inline */}
        <div className="mt-16 lg:mt-24">
          {/* Label */}
          <p className="text-sm text-muted-foreground text-center mb-8">
            Global community of developers and traders dedicated to making the world a safer place with blockchain technology.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16 items-center py-8 px-6 rounded-2xl bg-card/30 dark:bg-card/20 backdrop-blur-sm border border-border/50 dark:border-white/10">
            <StatItem value="2.5+" label="mil users" />
            <StatSeparator />
            <StatItem value="800+" label="developers" />
            <StatSeparator />
            <StatItem value="150+" label="countries" />
            <StatSeparator />
            <StatItem value="$400+" label="mil revenue" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-muted-foreground/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}
