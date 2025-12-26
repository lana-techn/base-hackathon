import * as React from "react"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient' | 'glow'
  hover?: 'none' | 'lift' | 'scale' | 'glow' | 'tilt'
  animated?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = 'lift', animated = true, ...props }, ref) => {
    const cardRef = useRef<HTMLDivElement>(null)

    const variants = {
      default: 'bg-card border-border shadow-sm',
      glass: 'bg-card/70 dark:bg-card/50 backdrop-blur-xl border-border/50 dark:border-white/10 shadow-lg glass-card',
      gradient: 'bg-gradient-to-br from-card to-card/80 dark:from-card/80 dark:to-card/60 border-border/50 dark:border-white/10 shadow-lg',
      glow: 'bg-card/80 dark:bg-card/60 backdrop-blur-xl border-primary/20 shadow-[0_0_30px_rgba(59,130,246,0.1)] dark:shadow-[0_0_40px_rgba(59,130,246,0.15)]'
    }

    // GSAP hover animations
    useEffect(() => {
      const card = cardRef.current
      if (!card || !animated || hover === 'none') return

      let hoverTl: GSAPTimeline | null = null

      const handleMouseEnter = (e: MouseEvent) => {
        if (hoverTl) hoverTl.kill()
        
        hoverTl = gsap.timeline()

        switch (hover) {
          case 'lift':
            hoverTl.to(card, {
              y: -8,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              duration: 0.3,
              ease: 'power2.out'
            })
            break
          
          case 'scale':
            hoverTl.to(card, {
              scale: 1.02,
              duration: 0.3,
              ease: 'power2.out'
            })
            break
          
          case 'glow':
            hoverTl.to(card, {
              y: -4,
              boxShadow: '0 15px 35px rgba(193, 255, 114, 0.15)',
              borderColor: 'rgba(193, 255, 114, 0.3)',
              duration: 0.3,
              ease: 'power2.out'
            })
            break
          
          case 'tilt':
            const rect = card.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2
            const mouseX = e.clientX - centerX
            const mouseY = e.clientY - centerY
            
            hoverTl.to(card, {
              rotationX: mouseY * -0.02,
              rotationY: mouseX * 0.02,
              y: -4,
              transformPerspective: 1000,
              duration: 0.3,
              ease: 'power2.out'
            })
            break
        }
      }

      const handleMouseLeave = () => {
        if (hoverTl) hoverTl.kill()
        
        hoverTl = gsap.timeline()
        hoverTl.to(card, {
          y: 0,
          scale: 1,
          rotationX: 0,
          rotationY: 0,
          boxShadow: 'none',
          borderColor: 'transparent',
          duration: 0.3,
          ease: 'power2.out'
        })
      }

      const handleMouseMove = (e: MouseEvent) => {
        if (hover === 'tilt') {
          const rect = card.getBoundingClientRect()
          const centerX = rect.left + rect.width / 2
          const centerY = rect.top + rect.height / 2
          const mouseX = e.clientX - centerX
          const mouseY = e.clientY - centerY
          
          gsap.to(card, {
            rotationX: mouseY * -0.02,
            rotationY: mouseX * 0.02,
            duration: 0.1,
            ease: 'power2.out'
          })
        }
      }

      card.addEventListener('mouseenter', handleMouseEnter)
      card.addEventListener('mouseleave', handleMouseLeave)
      card.addEventListener('mousemove', handleMouseMove)

      return () => {
        card.removeEventListener('mouseenter', handleMouseEnter)
        card.removeEventListener('mouseleave', handleMouseLeave)
        card.removeEventListener('mousemove', handleMouseMove)
        if (hoverTl) hoverTl.kill()
      }
    }, [hover, animated])

    return (
      <div
        ref={(node: HTMLDivElement) => {
          cardRef.current = node
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        className={cn(
          "rounded-xl border text-card-foreground",
          "transition-all duration-300 ease-out",
          animated && hover !== 'none' && "card-animated",
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))

// Specialized card variants
const GlassCard = React.forwardRef<HTMLDivElement, Omit<CardProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Card
      ref={ref}
      variant="glass"
      hover="glow"
      className={cn("backdrop-blur-xl", className)}
      {...props}
    />
  )
)

const GlowCard = React.forwardRef<HTMLDivElement, Omit<CardProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Card
      ref={ref}
      variant="glow"
      hover="lift"
      className={className}
      {...props}
    />
  )
)

const TiltCard = React.forwardRef<HTMLDivElement, Omit<CardProps, 'hover'>>(
  ({ className, ...props }, ref) => (
    <Card
      ref={ref}
      hover="tilt"
      className={cn("transform-gpu", className)}
      {...props}
    />
  )
)

Card.displayName = "Card"
CardHeader.displayName = "CardHeader"
CardTitle.displayName = "CardTitle"
CardDescription.displayName = "CardDescription"
CardContent.displayName = "CardContent"
CardFooter.displayName = "CardFooter"
GlassCard.displayName = "GlassCard"
GlowCard.displayName = "GlowCard"
TiltCard.displayName = "TiltCard"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  GlassCard,
  GlowCard,
  TiltCard
}
