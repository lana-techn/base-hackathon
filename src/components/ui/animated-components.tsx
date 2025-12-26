'use client'

import { useEffect, useRef, forwardRef } from 'react'
import { gsapAnimationManager, AnimationType } from '@/lib/gsap-animation-manager'
import { cn } from '@/lib/utils'

interface AnimatedElementProps {
  children: React.ReactNode
  animation?: AnimationType
  delay?: number
  duration?: number
  className?: string
  trigger?: 'load' | 'scroll'
  triggerStart?: string
}

/**
 * Generic animated wrapper component
 */
export const AnimatedElement = forwardRef<HTMLDivElement, AnimatedElementProps>(
  ({ 
    children, 
    animation = 'fade', 
    delay = 0, 
    duration = 0.6,
    className,
    trigger = 'scroll',
    triggerStart = 'top 80%'
  }, ref) => {
    const elementRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const element = elementRef.current
      if (!element) return

      if (trigger === 'load') {
        // Animate immediately on mount
        gsapAnimationManager.animateIn(element, animation, { delay, duration })
      } else {
        // Add scroll animation class for ScrollTrigger
        element.classList.add('animate-on-scroll')
      }
    }, [animation, delay, duration, trigger])

    return (
      <div 
        ref={ref || elementRef} 
        className={cn('animated-element', className)}
      >
        {children}
      </div>
    )
  }
)

AnimatedElement.displayName = 'AnimatedElement'

/**
 * Animated container for stagger animations
 */
interface AnimatedContainerProps {
  children: React.ReactNode
  stagger?: number
  animation?: AnimationType
  className?: string
  childSelector?: string
}

export const AnimatedContainer = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ 
    children, 
    stagger = 0.1, 
    animation = 'slide',
    className,
    childSelector = '.stagger-item'
  }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const container = containerRef.current
      if (!container) return

      // Add stagger animation on scroll
      const { ScrollTrigger } = require('gsap/ScrollTrigger')
      
      ScrollTrigger.create({
        trigger: container,
        start: 'top 80%',
        onEnter: () => {
          const elements = container.querySelectorAll(childSelector)
          if (elements.length > 0) {
            gsapAnimationManager.animateInStagger(
              Array.from(elements) as HTMLElement[], 
              animation, 
              stagger
            )
          }
        }
      })
    }, [stagger, animation, childSelector])

    return (
      <div 
        ref={ref || containerRef} 
        className={cn('animated-container', className)}
      >
        {children}
      </div>
    )
  }
)

AnimatedContainer.displayName = 'AnimatedContainer'

/**
 * Fade in animation component
 */
export const FadeIn = ({ children, delay = 0, className }: {
  children: React.ReactNode
  delay?: number
  className?: string
}) => (
  <AnimatedElement 
    animation="fade" 
    delay={delay} 
    className={className}
  >
    {children}
  </AnimatedElement>
)

/**
 * Slide up animation component
 */
export const SlideUp = ({ children, delay = 0, className }: {
  children: React.ReactNode
  delay?: number
  className?: string
}) => (
  <AnimatedElement 
    animation="slide" 
    delay={delay} 
    className={className}
  >
    {children}
  </AnimatedElement>
)

/**
 * Scale in animation component
 */
export const ScaleIn = ({ children, delay = 0, className }: {
  children: React.ReactNode
  delay?: number
  className?: string
}) => (
  <AnimatedElement 
    animation="scale" 
    delay={delay} 
    className={className}
  >
    {children}
  </AnimatedElement>
)

/**
 * Stagger container for lists and grids
 */
export const StaggerContainer = ({ children, className }: {
  children: React.ReactNode
  className?: string
}) => (
  <AnimatedContainer className={className}>
    {children}
  </AnimatedContainer>
)

/**
 * Individual stagger item
 */
export const StaggerItem = ({ children, className }: {
  children: React.ReactNode
  className?: string
}) => (
  <div className={cn('stagger-item', className)}>
    {children}
  </div>
)

/**
 * Hero section with complex entrance animation
 */
export const AnimatedHero = ({ children, className }: {
  children: React.ReactNode
  className?: string
}) => {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    // Add hero-section class for ScrollTrigger
    hero.classList.add('hero-section')
    
    // Ensure hero is visible
    hero.style.opacity = '1'
    hero.style.visibility = 'visible'
  }, [])

  return (
    <div ref={heroRef} className={cn('animated-hero', className)} style={{ opacity: 1, visibility: 'visible' }}>
      {children}
    </div>
  )
}

/**
 * Chat interface with entrance animations
 */
export const AnimatedChatInterface = ({ children, className }: {
  children: React.ReactNode
  className?: string
}) => {
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const chat = chatRef.current
    if (!chat) return

    // Add chat-container class for ScrollTrigger
    chat.classList.add('chat-container')
  }, [])

  return (
    <div ref={chatRef} className={cn('animated-chat', className)}>
      {children}
    </div>
  )
}

/**
 * Bento grid with stagger animations
 */
export const AnimatedBentoGrid = ({ children, className }: {
  children: React.ReactNode
  className?: string
}) => {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    // Add bento-grid class for ScrollTrigger
    grid.classList.add('bento-grid')
  }, [])

  return (
    <div ref={gridRef} className={cn('animated-bento-grid', className)}>
      {children}
    </div>
  )
}

/**
 * Bento grid item
 */
export const AnimatedBentoItem = ({ children, className }: {
  children: React.ReactNode
  className?: string
}) => (
  <div className={cn('bento-item', className)}>
    {children}
  </div>
)

/**
 * Parallax element wrapper
 */
export const ParallaxElement = ({ 
  children, 
  speed = -0.5, 
  className 
}: {
  children: React.ReactNode
  speed?: number
  className?: string
}) => (
  <div 
    className={cn('parallax-element', className)}
    data-speed={speed}
  >
    {children}
  </div>
)

/**
 * Hover animated card
 */
export const HoverCard = ({ children, className }: {
  children: React.ReactNode
  className?: string
}) => (
  <div className={cn('card-animated', className)}>
    {children}
  </div>
)

/**
 * Hover animated button
 */
export const HoverButton = ({ children, className, ...props }: {
  children: React.ReactNode
  className?: string
  [key: string]: any
}) => (
  <button className={cn('btn-animated', className)} {...props}>
    {children}
  </button>
)

/**
 * Click animated element
 */
export const ClickAnimated = ({ children, className, ...props }: {
  children: React.ReactNode
  className?: string
  [key: string]: any
}) => (
  <div className={cn('click-animated', className)} {...props}>
    {children}
  </div>
)

export default {
  AnimatedElement,
  AnimatedContainer,
  FadeIn,
  SlideUp,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
  AnimatedHero,
  AnimatedChatInterface,
  AnimatedBentoGrid,
  AnimatedBentoItem,
  ParallaxElement,
  HoverCard,
  HoverButton,
  ClickAnimated
}