'use client'

import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'strong' | 'gradient' | 'glow'
  blur?: 'sm' | 'md' | 'lg' | 'xl'
  glow?: 'none' | 'primary' | 'success' | 'accent'
  animated?: boolean
  children: React.ReactNode
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', blur = 'md', glow = 'none', animated = false, children, ...props }, ref) => {
    const variants = {
      default: 'bg-card/70 dark:bg-card/50 border-border/50 dark:border-white/10',
      subtle: 'bg-card/50 dark:bg-card/30 border-border/30 dark:border-white/5',
      strong: 'bg-card/90 dark:bg-card/70 border-border dark:border-white/20',
      gradient: 'bg-gradient-to-br from-card/80 to-card/60 dark:from-card/60 dark:to-card/40 border-border/50 dark:border-white/10',
      glow: 'bg-card/60 dark:bg-card/40 border-primary/30 dark:border-primary/20'
    }

    const blurLevels = {
      sm: 'backdrop-blur-sm',
      md: 'backdrop-blur-md',
      lg: 'backdrop-blur-lg',
      xl: 'backdrop-blur-xl'
    }

    const glowEffects = {
      none: '',
      primary: 'shadow-[0_0_30px_rgba(59,130,246,0.15)] dark:shadow-[0_0_40px_rgba(59,130,246,0.2)]',
      success: 'shadow-[0_0_30px_rgba(34,197,94,0.15)] dark:shadow-[0_0_40px_rgba(34,197,94,0.2)]',
      accent: 'shadow-[0_0_30px_rgba(139,92,246,0.15)] dark:shadow-[0_0_40px_rgba(139,92,246,0.2)]'
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-xl border backdrop-saturate-150',
          variants[variant],
          blurLevels[blur],
          glowEffects[glow],
          'shadow-lg dark:shadow-2xl',
          'transition-all duration-500 ease-out',
          'hover:scale-[1.02] hover:shadow-xl dark:hover:shadow-2xl',
          'hover:border-border dark:hover:border-white/20',
          animated && 'hover:shadow-[0_0_50px_rgba(59,130,246,0.2)] dark:hover:shadow-[0_0_60px_rgba(59,130,246,0.3)]',
          className
        )}
        {...props}
      >
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />

        {/* Content - passes through full height for scroll containers */}
        <div className="relative z-10 h-full flex flex-col">
          {children}
        </div>
      </div>
    )
  }
)

GlassCard.displayName = "GlassCard"

// Web3 Card with animated border
interface Web3CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'success' | 'accent'
  animated?: boolean
  children: React.ReactNode
}

const Web3Card = forwardRef<HTMLDivElement, Web3CardProps>(
  ({ className, variant = 'default', animated = false, children, ...props }, ref) => {
    const borderColors = {
      default: 'from-border via-border/50 to-border dark:from-white/20 dark:via-white/5 dark:to-white/20',
      primary: 'from-primary via-primary/30 to-primary dark:from-primary dark:via-primary/20 dark:to-primary',
      success: 'from-success via-success/30 to-success dark:from-success dark:via-success/20 dark:to-success',
      accent: 'from-violet-500 via-violet-500/30 to-violet-500 dark:from-violet-400 dark:via-violet-400/20 dark:to-violet-400'
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative group rounded-xl p-[1px]',
          'bg-gradient-to-r',
          borderColors[variant],
          animated && 'animate-gradient-x',
          className
        )}
        {...props}
      >
        <div className="relative rounded-xl bg-card dark:bg-card/95 backdrop-blur-xl h-full overflow-hidden">
          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
    )
  }
)

Web3Card.displayName = "Web3Card"

export { GlassCard, Web3Card }
