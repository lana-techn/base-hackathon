import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { m } from "framer-motion"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium btn-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md shadow-destructive/20 hover:shadow-lg hover:shadow-destructive/30",
        outline: "border border-border/50 dark:border-white/10 bg-card/50 dark:bg-card/30 backdrop-blur-sm hover:bg-card/80 dark:hover:bg-card/50 hover:border-border dark:hover:border-white/20",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        
        // Enhanced BethNa variants
        glass: "glass text-foreground hover:glass-strong hover:border-bethna-primary/30",
        glow: "bg-primary text-primary-foreground hover:bg-primary/90 glow-primary hover:glow-primary-strong",
        gradient: "bg-gradient-to-r from-bethna-primary to-bethna-primary-dark text-primary-foreground hover:from-bethna-primary-hover hover:to-bethna-primary shadow-lg shadow-bethna-primary/20 hover:shadow-xl hover:shadow-bethna-primary/30",
        minimal: "text-foreground hover:bg-muted/50 border border-transparent hover:border-border/50",
        bethna: "bg-bethna-primary text-primary-foreground hover:bg-bethna-primary-hover glow-bethna hover:glow-bethna shadow-lg shadow-bethna-primary/25",
      },
      size: {
        xs: "h-7 px-2 text-xs rounded-lg",
        sm: "h-9 rounded-lg px-3 text-xs",
        default: "h-10 px-4 py-2",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    loadingText,
    icon,
    iconPosition = "left",
    children,
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading

    const buttonContent = (
      <>
        {loading && (
          <Loader2 className="size-4 animate-spin" />
        )}
        {!loading && icon && iconPosition === "left" && icon}
        {loading ? loadingText || "Loading..." : children}
        {!loading && icon && iconPosition === "right" && icon}
      </>
    )

    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {buttonContent}
        </Slot>
      )
    }

    // Separate motion props from HTML button props
    const {
      // Remove any motion-specific props that might conflict
      ...buttonProps
    } = props

    return (
      <m.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        whileHover={{ 
          scale: isDisabled ? 1 : 1.02,
          y: isDisabled ? 0 : -1,
          transition: { duration: 0.2, ease: "easeOut" }
        }}
        whileTap={{ 
          scale: isDisabled ? 1 : 0.98,
          transition: { duration: 0.1 }
        }}
        {...(buttonProps as any)}
      >
        {buttonContent}
      </m.button>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }