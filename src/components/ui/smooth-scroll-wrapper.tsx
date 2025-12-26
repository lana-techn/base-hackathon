'use client'

import { useEffect, useRef } from 'react'
import { m, useScroll, useSpring, useTransform } from 'framer-motion'

interface SmoothScrollWrapperProps {
  children: React.ReactNode
  className?: string
}

export function SmoothScrollWrapper({ children, className }: SmoothScrollWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  
  // Create smooth spring animation for scroll
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    // Add smooth scrolling behavior
    const container = containerRef.current
    if (!container) return

    // Enable hardware acceleration
    container.style.willChange = 'transform'
    container.style.transform = 'translateZ(0)'

    return () => {
      if (container) {
        container.style.willChange = 'auto'
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className={`smooth-scroll ${className || ''}`}
      style={{
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {children}
    </div>
  )
}

// Parallax component for smooth parallax effects
export function ParallaxSection({ 
  children, 
  speed = 0.5,
  className 
}: {
  children: React.ReactNode
  speed?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100])

  return (
    <m.div
      ref={ref}
      style={{ y }}
      className={className}
    >
      {children}
    </m.div>
  )
}