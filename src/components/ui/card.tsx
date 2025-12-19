import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'glass' | 'gradient' | 'glow'
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-card border-border shadow-sm',
    glass: 'bg-card/70 dark:bg-card/50 backdrop-blur-xl border-border/50 dark:border-white/10 shadow-lg',
    gradient: 'bg-gradient-to-br from-card to-card/80 dark:from-card/80 dark:to-card/60 border-border/50 dark:border-white/10 shadow-lg',
    glow: 'bg-card/80 dark:bg-card/60 backdrop-blur-xl border-primary/20 shadow-[0_0_30px_rgba(59,130,246,0.1)] dark:shadow-[0_0_40px_rgba(59,130,246,0.15)]'
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border text-card-foreground",
        "transition-all duration-300 ease-out",
        "hover:shadow-lg dark:hover:shadow-xl",
        variants[variant],
        className
      )}
      {...props}
    />
  )
})

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

Card.displayName = "Card"
CardHeader.displayName = "CardHeader"
CardTitle.displayName = "CardTitle"
CardDescription.displayName = "CardDescription"
CardContent.displayName = "CardContent"
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
