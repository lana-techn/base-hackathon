'use client'

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/lib/utils"

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ParallaxScrollProps {
  children: React.ReactNode
  speed?: number
  direction?: 'up' | 'down'
  className?: string
  trigger?: string
}

const ParallaxScroll = ({
  children,
  speed = 0.5,
  direction = 'up',
  className,
  trigger
}: ParallaxScrollProps) => {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const multiplier = direction === 'up' ? -1 : 1
    const yPercent = speed * 100 * multiplier

    const scrollTrigger = ScrollTrigger.create({
      trigger: trigger || element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        gsap.set(element, {
          yPercent: yPercent * self.progress
        })
      }
    })

    return () => {
      scrollTrigger.kill()
    }
  }, [speed, direction, trigger])

  return (
    <div
      ref={elementRef}
      className={cn("parallax-element will-change-transform", className)}
      data-speed={speed}
    >
      {children}
    </div>
  )
}

interface ParallaxContainerProps {
  children: React.ReactNode
  className?: string
}

const ParallaxContainer = ({ children, className }: ParallaxContainerProps) => {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}
    </div>
  )
}

interface ParallaxSectionProps {
  children: React.ReactNode
  className?: string
  backgroundSpeed?: number
  contentSpeed?: number
}

const ParallaxSection = ({ 
  children, 
  className, 
  backgroundSpeed = 0.5,
  contentSpeed = 0.2 
}: ParallaxSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const background = backgroundRef.current
    const content = contentRef.current
    
    if (!section) return

    const scrollTriggers: ScrollTrigger[] = []

    // Background parallax
    if (background) {
      const bgTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          gsap.set(background, {
            yPercent: -backgroundSpeed * 100 * self.progress
          })
        }
      })
      scrollTriggers.push(bgTrigger)
    }

    // Content parallax
    if (content) {
      const contentTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          gsap.set(content, {
            yPercent: contentSpeed * 100 * self.progress
          })
        }
      })
      scrollTriggers.push(contentTrigger)
    }

    return () => {
      scrollTriggers.forEach(trigger => trigger.kill())
    }
  }, [backgroundSpeed, contentSpeed])

  return (
    <div ref={sectionRef} className={cn("relative", className)}>
      <div ref={backgroundRef} className="absolute inset-0 will-change-transform">
        {/* Background content goes here */}
      </div>
      <div ref={contentRef} className="relative z-10 will-change-transform">
        {children}
      </div>
    </div>
  )
}

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  animation?: 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale'
  delay?: number
  duration?: number
  trigger?: string
}

const ScrollReveal = ({
  children,
  className,
  animation = 'fade',
  delay = 0,
  duration = 0.8,
  trigger
}: ScrollRevealProps) => {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const animations = {
      fade: { opacity: 0 },
      slideUp: { y: 50, opacity: 0 },
      slideDown: { y: -50, opacity: 0 },
      slideLeft: { x: 50, opacity: 0 },
      slideRight: { x: -50, opacity: 0 },
      scale: { scale: 0.8, opacity: 0 }
    }

    const fromVars = animations[animation]
    const toVars = { 
      ...Object.keys(fromVars).reduce((acc, key) => {
        acc[key] = key === 'opacity' ? 1 : 0
        return acc
      }, {} as any),
      duration,
      delay,
      ease: 'power3.out'
    }

    // Set initial state
    gsap.set(element, fromVars)

    const scrollTrigger = ScrollTrigger.create({
      trigger: trigger || element,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
      onEnter: () => {
        gsap.to(element, toVars)
      }
    })

    return () => {
      scrollTrigger.kill()
    }
  }, [animation, delay, duration, trigger])

  return (
    <div ref={elementRef} className={cn("will-change-transform", className)}>
      {children}
    </div>
  )
}

interface StickyScrollProps {
  children: React.ReactNode
  className?: string
  offset?: number
}

const StickyScroll = ({ children, className, offset = 0 }: StickyScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const sticky = stickyRef.current
    
    if (!container || !sticky) return

    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: `top+=${offset} top`,
      end: 'bottom bottom',
      pin: sticky,
      pinSpacing: false
    })

    return () => {
      scrollTrigger.kill()
    }
  }, [offset])

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div ref={stickyRef} className="will-change-transform">
        {children}
      </div>
    </div>
  )
}

export { 
  ParallaxScroll, 
  ParallaxContainer, 
  ParallaxSection,
  ScrollReveal,
  StickyScroll
}