'use client'

import { useEffect, useRef } from "react"
import Lenis from "lenis"

interface SmoothScrollProps {
  children: React.ReactNode
  options?: {
    duration?: number
    easing?: (t: number) => number
    direction?: 'vertical' | 'horizontal'
    gestureDirection?: 'vertical' | 'horizontal' | 'both'
    smooth?: boolean
    mouseMultiplier?: number
    smoothTouch?: boolean
    touchMultiplier?: number
  }
}

const SmoothScroll = ({ children, options = {} }: SmoothScrollProps) => {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Initialize Lenis
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      ...options
    })

    // Animation frame loop
    function raf(time: number) {
      lenisRef.current?.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Cleanup
    return () => {
      lenisRef.current?.destroy()
    }
  }, [options])

  return <>{children}</>
}

export { SmoothScroll }