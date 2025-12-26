'use client'

import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'strong' | 'glow' | 'accent' | 'gradient'
  blur?: 'sm' | 'md' | 'lg' | 'xl'
  glow?: 'none' | 'primary' | 'success' | 'accent' | 'bethna'
  animated?: boolean
  hoverEffect?: 'scale' | 'glow' | 'lift' | 'none'
  children: React.ReactNode
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ 
    className, 
    variant = 'default', 
    blur = 'md', 
    glow = 'none', 
    animated = false, 
    hoverEffect = 'scale',
    children, 
    ...props 
  }, ref) => {
    const variants = {
      default: 'glass',
      subtle: 'glass-subtle',
      strong: 'glass-strong',
      glow: 'glass-glow',
      accent: 'glass-accent',
      gradient: 'glass bg-gradient-to-br from-glass-bg-accent to-glass-bg'
    }

    const blurLevels = {
      sm: 'backdrop-blur-sm',
      md: 'backdrop-blur-md',
      lg: 'backdrop-blur-lg',
      xl: 'backdrop-blur-xl'
    }

    const glowEffects = {
      none: '',
      primary: 'glow-primary',
      success: 'glow-success',
      accent: 'glow-accent',
      bethna: 'glow-bethna'
    }

    const hoverEffects = {
      scale: 'hover:scale-[1.02] transition-transform duration-300 ease-out',
      glow: 'hover:glow-primary-strong transition-all duration-300 ease-out',
      lift: 'hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-out',
      none: ''
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-xl border',
          variants[variant],
          blurLevels[blur],
          glowEffects[glow],
          'shadow-lg dark:shadow-2xl',
          'transition-all duration-300 ease-out',
          hoverEffects[hoverEffect],
          animated && 'animate-pulse-glow',
          className
        )}
        {...props}
      >
        {/* Enhanced gradient overlay for depth */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.02] via-transparent to-black/[0.02] pointer-events-none" />

        {/* Noise texture overlay for premium feel */}
        <div className="absolute inset-0 rounded-xl noise-overlay pointer-events-none" />

        {/* Content container with proper z-index */}
        <div className="relative z-10 h-full flex flex-col">
          {children}
        </div>
      </div>
    )
  }
)

GlassCard.displayName = "GlassCard"

// Enhanced Web3 Card with animated borders and shimmer effects
interface Web3CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'success' | 'accent' | 'bethna'
  animated?: boolean
  shimmer?: boolean
  borderAnimation?: 'gradient' | 'pulse' | 'rotate' | 'none'
  children: React.ReactNode
}

const Web3Card = forwardRef<HTMLDivElement, Web3CardProps>(
  ({ 
    className, 
    variant = 'default', 
    animated = false, 
    shimmer = true,
    borderAnimation = 'gradient',
    children, 
    ...props 
  }, ref) => {
    const borderColors = {
      default: 'from-border via-border/50 to-border dark:from-white/20 dark:via-white/5 dark:to-white/20',
      primary: 'from-primary via-primary/30 to-primary dark:from-primary dark:via-primary/20 dark:to-primary',
      success: 'from-green-500 via-green-500/30 to-green-500 dark:from-green-400 dark:via-green-400/20 dark:to-green-400',
      accent: 'from-violet-500 via-violet-500/30 to-violet-500 dark:from-violet-400 dark:via-violet-400/20 dark:to-violet-400',
      bethna: 'from-bethna-primary via-bethna-primary/30 to-bethna-primary dark:from-bethna-primary dark:via-bethna-primary/20 dark:to-bethna-primary'
    }

    const borderAnimations = {
      gradient: 'animate-gradient-x',
      pulse: 'animate-pulse',
      rotate: 'animate-spin',
      none: ''
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative group rounded-xl p-[1px]',
          'bg-gradient-to-r',
          borderColors[variant],
          animated && borderAnimations[borderAnimation],
          'transition-all duration-300 ease-out',
          'hover:p-[2px]', // Thicker border on hover
          className
        )}
        {...props}
      >
        <div className="relative rounded-xl glass h-full overflow-hidden">
          {/* Enhanced shimmer effect */}
          {shimmer && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 shimmer" />
            </div>
          )}

          {/* Glow effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className={cn(
              'absolute inset-0 rounded-xl',
              variant === 'bethna' && 'glow-bethna',
              variant === 'primary' && 'glow-primary',
              variant === 'success' && 'glow-success',
              variant === 'accent' && 'glow-accent'
            )} />
          </div>

          {/* Content with proper spacing */}
          <div className="relative z-10 h-full">
            {children}
          </div>
        </div>
      </div>
    )
  }
)

Web3Card.displayName = "Web3Card"

// New BethNa-specific card variant
interface BethNaCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'accent'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  interactive?: boolean
  children: React.ReactNode
}

const BethNaCard = forwardRef<HTMLDivElement, BethNaCardProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    interactive = false,
    children, 
    ...props 
  }, ref) => {
    const variants = {
      primary: 'glass-glow border-bethna-primary/30 glow-bethna',
      secondary: 'glass border-bethna-primary/15',
      accent: 'glass-accent border-bethna-primary/20'
    }

    const sizes = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10'
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-xl',
          variants[variant],
          sizes[size],
          'transition-all duration-300 ease-out',
          interactive && [
            'cursor-pointer',
            'hover:scale-[1.02]',
            'hover:glow-bethna',
            'hover:border-bethna-primary/50',
            'active:scale-[0.98]'
          ],
          className
        )}
        {...props}
      >
        {/* BethNa signature gradient overlay */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-bethna-primary/5 via-transparent to-bethna-primary/10 pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    )
  }
)

BethNaCard.displayName = "BethNaCard"

export { GlassCard, Web3Card, BethNaCard }
