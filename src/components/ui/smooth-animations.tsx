'use client'

import { m, useInView, useAnimation, Variants, useScroll, useTransform, useMotionValue } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useOptimizedAnimations } from '@/hooks/usePerformanceOptimization'

// Optimized animation variants
const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    transition: { duration: 0.3 }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for smoothness
    }
  }
}

const fadeIn: Variants = {
  hidden: { 
    opacity: 0,
    transition: { duration: 0.2 }
  },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.4,
      ease: "easeOut"
    }
  }
}

const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.2 }
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.4,
      ease: [0.34, 1.56, 0.64, 1] // Bouncy easing
    }
  }
}

const slideInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -30,
    transition: { duration: 0.3 }
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

const staggerItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    transition: { duration: 0.2 }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4,
      ease: "easeOut"
    }
  }
}

// Optimized components with performance improvements
interface AnimatedElementProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  variants?: Variants
  once?: boolean
}

export const FadeInUp = ({ 
  children, 
  className, 
  delay = 0, 
  duration = 0.5,
  once = true 
}: AnimatedElementProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: "-100px" })
  const { animationDuration, animationEase, shouldReduceAnimations } = useOptimizedAnimations()

  return (
    <m.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ 
        delay: shouldReduceAnimations ? 0 : delay, 
        duration: shouldReduceAnimations ? 0.1 : (duration || animationDuration),
        ease: animationEase
      }}
      className={className}
      style={{ willChange: shouldReduceAnimations ? 'auto' : 'transform, opacity' }}
    >
      {children}
    </m.div>
  )
}

export const FadeIn = ({ 
  children, 
  className, 
  delay = 0, 
  duration = 0.4,
  once = true 
}: AnimatedElementProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: "-50px" })
  const { animationDuration, animationEase, shouldReduceAnimations } = useOptimizedAnimations()

  return (
    <m.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeIn}
      transition={{ 
        delay: shouldReduceAnimations ? 0 : delay, 
        duration: shouldReduceAnimations ? 0.1 : (duration || animationDuration),
        ease: animationEase
      }}
      className={className}
      style={{ willChange: shouldReduceAnimations ? 'auto' : 'opacity' }}
    >
      {children}
    </m.div>
  )
}

export const ScaleIn = ({ 
  children, 
  className, 
  delay = 0, 
  duration = 0.4,
  once = true 
}: AnimatedElementProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: "-100px" })

  return (
    <m.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={scaleIn}
      transition={{ delay, duration }}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </m.div>
  )
}

export const SlideInLeft = ({ 
  children, 
  className, 
  delay = 0, 
  duration = 0.5,
  once = true 
}: AnimatedElementProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: "-100px" })

  return (
    <m.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={slideInLeft}
      transition={{ delay, duration }}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </m.div>
  )
}

// Stagger animation container
export const StaggerContainer = ({ 
  children, 
  className,
  once = true 
}: {
  children: React.ReactNode
  className?: string
  once?: boolean
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: "-100px" })

  return (
    <m.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </m.div>
  )
}

export const StaggerItem = ({ 
  children, 
  className 
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <m.div
      variants={staggerItem}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </m.div>
  )
}

// Interactive hover animations
export const HoverScale = ({ 
  children, 
  className,
  scale = 1.02,
  duration = 0.2
}: {
  children: React.ReactNode
  className?: string
  scale?: number
  duration?: number
}) => {
  const { shouldReduceAnimations, animationDuration } = useOptimizedAnimations()

  if (shouldReduceAnimations) {
    return <div className={className}>{children}</div>
  }

  return (
    <m.div
      whileHover={{ 
        scale,
        transition: { duration: animationDuration, ease: "easeOut" }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      className={className}
      style={{ willChange: 'transform' }}
    >
      {children}
    </m.div>
  )
}

export const HoverGlow = ({ 
  children, 
  className,
  glowColor = "rgba(193, 255, 114, 0.3)"
}: {
  children: React.ReactNode
  className?: string
  glowColor?: string
}) => {
  return (
    <m.div
      whileHover={{
        boxShadow: `0 0 20px ${glowColor}, 0 0 40px ${glowColor}`,
        transition: { duration: 0.3 }
      }}
      className={className}
      style={{ willChange: 'box-shadow' }}
    >
      {children}
    </m.div>
  )
}

// Parallax effect with Framer Motion
export const ParallaxElement = ({ 
  children, 
  className,
  speed = 0.5
}: {
  children: React.ReactNode
  className?: string
  speed?: number
}) => {
  const ref = useRef(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, 1000 * speed])

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

// Smooth counter animation
export const AnimatedCounter = ({ 
  value, 
  duration = 2,
  className,
  prefix = '',
  suffix = ''
}: {
  value: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const displayValue = useTransform(rounded, (latest) => 
    `${prefix}${latest.toLocaleString()}${suffix}`
  )

  useEffect(() => {
    if (isInView) {
      count.set(value)
    }
  }, [isInView, value, count])

  return (
    <m.span
      ref={ref}
      className={className}
    >
      <m.span>{displayValue}</m.span>
    </m.span>
  )
}