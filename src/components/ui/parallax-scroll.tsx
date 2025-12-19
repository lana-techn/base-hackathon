'use client'

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/lib/utils"

// Register GSAP plugin
if (typeof window !== "undefined") {
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
    if (!elementRef.current) return

    const element = elementRef.current
    const multiplier = direction === 'up' ? -1 : 1
    const yMovement = speed * 100 * multiplier

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        {
          y: 0,
        },
        {
          y: yMovement,
          ease: "none",
          scrollTrigger: {
            trigger: trigger || element,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      )
    }, element)

    return () => ctx.revert()
  }, [speed, direction, trigger])

  return (
    <div
      ref={elementRef}
      className={cn("will-change-transform", className)}
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

export { ParallaxScroll, ParallaxContainer }