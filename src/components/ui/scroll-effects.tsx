'use client'

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/lib/utils"

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ScrollProgressProps {
  children: React.ReactNode
  className?: string
  showProgress?: boolean
}

const ScrollProgress = ({ children, className, showProgress = true }: ScrollProgressProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const progress = progressRef.current
    
    if (!container || !progress || !showProgress) return

    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        gsap.set(progress, {
          scaleX: self.progress
        })
      }
    })

    return () => {
      scrollTrigger.kill()
    }
  }, [showProgress])

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {showProgress && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 z-50">
          <div
            ref={progressRef}
            className="h-full bg-primary origin-left scale-x-0"
          />
        </div>
      )}
      {children}
    </div>
  )
}

interface ScrollSnapProps {
  children: React.ReactNode
  className?: string
  snapType?: 'y mandatory' | 'x mandatory' | 'both mandatory'
}

const ScrollSnap = ({ children, className, snapType = 'y mandatory' }: ScrollSnapProps) => {
  return (
    <div 
      className={cn("scroll-smooth", className)}
      style={{ scrollSnapType: snapType }}
    >
      {children}
    </div>
  )
}

interface ScrollSnapItemProps {
  children: React.ReactNode
  className?: string
  snapAlign?: 'start' | 'center' | 'end'
}

const ScrollSnapItem = ({ children, className, snapAlign = 'start' }: ScrollSnapItemProps) => {
  return (
    <div 
      className={cn("min-h-screen", className)}
      style={{ scrollSnapAlign: snapAlign }}
    >
      {children}
    </div>
  )
}

interface InfiniteScrollProps {
  children: React.ReactNode
  className?: string
  speed?: number
  direction?: 'left' | 'right'
}

const InfiniteScroll = ({ 
  children, 
  className, 
  speed = 50,
  direction = 'left' 
}: InfiniteScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const items = container.children
    if (items.length === 0) return

    // Clone items for seamless loop
    Array.from(items).forEach(item => {
      const clone = item.cloneNode(true) as HTMLElement
      container.appendChild(clone)
    })

    const totalWidth = container.scrollWidth / 2
    const multiplier = direction === 'left' ? -1 : 1

    const tl = gsap.timeline({ repeat: -1 })
    tl.to(container, {
      x: totalWidth * multiplier,
      duration: speed,
      ease: 'none'
    })

    return () => {
      tl.kill()
    }
  }, [speed, direction])

  return (
    <div className={cn("overflow-hidden", className)}>
      <div ref={containerRef} className="flex will-change-transform">
        {children}
      </div>
    </div>
  )
}

interface ScrollMorphProps {
  children: React.ReactNode
  className?: string
  morphSteps?: number[]
}

const ScrollMorph = ({ children, className, morphSteps = [0, 0.5, 1] }: ScrollMorphProps) => {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const scrollTrigger = ScrollTrigger.create({
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress
        
        // Morph based on scroll progress
        if (progress < morphSteps[1]) {
          const localProgress = progress / morphSteps[1]
          gsap.set(element, {
            borderRadius: `${20 + localProgress * 30}px`,
            scale: 1 + localProgress * 0.1
          })
        } else {
          const localProgress = (progress - morphSteps[1]) / (morphSteps[2] - morphSteps[1])
          gsap.set(element, {
            borderRadius: `${50 - localProgress * 30}px`,
            scale: 1.1 - localProgress * 0.1
          })
        }
      }
    })

    return () => {
      scrollTrigger.kill()
    }
  }, [morphSteps])

  return (
    <div ref={elementRef} className={cn("will-change-transform", className)}>
      {children}
    </div>
  )
}

interface ScrollCounterProps {
  from: number
  to: number
  className?: string
  duration?: number
  formatter?: (value: number) => string
}

const ScrollCounter = ({ 
  from, 
  to, 
  className, 
  duration = 2,
  formatter = (value) => Math.round(value).toString()
}: ScrollCounterProps) => {
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const counter = counterRef.current
    if (!counter) return

    const obj = { value: from }

    const scrollTrigger = ScrollTrigger.create({
      trigger: counter,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(obj, {
          value: to,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            counter.textContent = formatter(obj.value)
          }
        })
      }
    })

    return () => {
      scrollTrigger.kill()
    }
  }, [from, to, duration, formatter])

  return (
    <span ref={counterRef} className={className}>
      {formatter(from)}
    </span>
  )
}

interface ScrollTextRevealProps {
  text: string
  className?: string
  stagger?: number
}

const ScrollTextReveal = ({ text, className, stagger = 0.05 }: ScrollTextRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const chars = text.split('').map((char, index) => {
      const span = document.createElement('span')
      span.textContent = char === ' ' ? '\u00A0' : char
      span.style.display = 'inline-block'
      span.style.opacity = '0'
      span.style.transform = 'translateY(50px)'
      return span
    })

    container.innerHTML = ''
    chars.forEach(char => container.appendChild(char))

    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(chars, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger,
          ease: 'power3.out'
        })
      }
    })

    return () => {
      scrollTrigger.kill()
    }
  }, [text, stagger])

  return (
    <div ref={containerRef} className={cn("will-change-transform", className)} />
  )
}

interface ScrollImageRevealProps {
  src: string
  alt: string
  className?: string
  revealDirection?: 'left' | 'right' | 'top' | 'bottom'
}

const ScrollImageReveal = ({ 
  src, 
  alt, 
  className, 
  revealDirection = 'bottom' 
}: ScrollImageRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const maskRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const image = imageRef.current
    const mask = maskRef.current
    
    if (!container || !image || !mask) return

    const directions = {
      left: { x: '-100%' },
      right: { x: '100%' },
      top: { y: '-100%' },
      bottom: { y: '100%' }
    }

    gsap.set(mask, directions[revealDirection])

    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(mask, {
          x: 0,
          y: 0,
          duration: 1.2,
          ease: 'power3.out'
        })
      }
    })

    return () => {
      scrollTrigger.kill()
    }
  }, [revealDirection])

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      <img ref={imageRef} src={src} alt={alt} className="w-full h-full object-cover" />
      <div 
        ref={maskRef}
        className="absolute inset-0 bg-white dark:bg-gray-900 will-change-transform"
      />
    </div>
  )
}

export {
  ScrollProgress,
  ScrollSnap,
  ScrollSnapItem,
  InfiniteScroll,
  ScrollMorph,
  ScrollCounter,
  ScrollTextReveal,
  ScrollImageReveal
}