'use client'

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ParallaxScrollProps {
  children: React.ReactNode
  speed?: number
  direction?: 'up' | 'down'
  className?: string
}

const ParallaxScroll = ({
  children,
  speed = 0.5,
  direction = 'up',
  className,
}: ParallaxScrollProps) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return

      const rect = elementRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height)

      const multiplier = direction === 'up' ? -1 : 1
      const movement = scrollProgress * speed * 100 * multiplier

      setOffset(movement)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed, direction])

  return (
    <div
      ref={elementRef}
      className={cn("will-change-transform", className)}
      style={{ transform: `translate3d(0, ${offset}px, 0)` }}
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