'use client'

import { useEffect, useState } from 'react'

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

export function usePerformanceMode() {
  const [isLowPerformance, setIsLowPerformance] = useState(false)

  useEffect(() => {
    // Check for performance indicators
    const connection = (navigator as any).connection
    const memory = (performance as any).memory
    
    let performanceScore = 0
    
    // Check network connection
    if (connection) {
      if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
        performanceScore += 2
      } else if (connection.effectiveType === '3g') {
        performanceScore += 1
      }
    }
    
    // Check memory (if available)
    if (memory) {
      const memoryRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit
      if (memoryRatio > 0.8) {
        performanceScore += 2
      } else if (memoryRatio > 0.6) {
        performanceScore += 1
      }
    }
    
    // Check device capabilities
    const isLowEndDevice = navigator.hardwareConcurrency <= 2
    if (isLowEndDevice) {
      performanceScore += 1
    }
    
    setIsLowPerformance(performanceScore >= 2)
  }, [])

  return isLowPerformance
}

export function useOptimizedAnimations() {
  const prefersReducedMotion = useReducedMotion()
  const isLowPerformance = usePerformanceMode()
  
  const shouldReduceAnimations = prefersReducedMotion || isLowPerformance
  
  return {
    shouldReduceAnimations,
    animationDuration: shouldReduceAnimations ? 0.1 : 0.4,
    animationEase: shouldReduceAnimations ? "linear" as const : [0.25, 0.46, 0.45, 0.94] as const,
    enableParallax: !shouldReduceAnimations,
    enableComplexAnimations: !shouldReduceAnimations
  }
}