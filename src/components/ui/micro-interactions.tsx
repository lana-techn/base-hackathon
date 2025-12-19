'use client'

import { motion, MotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface HoverScaleProps extends MotionProps {
  children: React.ReactNode
  scale?: number
  className?: string
}

const HoverScale = ({ 
  children, 
  scale = 1.05, 
  className,
  ...motionProps 
}: HoverScaleProps) => {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: scale * 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn("cursor-pointer", className)}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}

interface FloatingElementProps extends MotionProps {
  children: React.ReactNode
  intensity?: number
  className?: string
}

const FloatingElement = ({ 
  children, 
  intensity = 10,
  className,
  ...motionProps 
}: FloatingElementProps) => {
  return (
    <motion.div
      animate={{
        y: [-intensity, intensity, -intensity],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}

interface PulseGlowProps extends MotionProps {
  children: React.ReactNode
  color?: string
  className?: string
}

const PulseGlow = ({ 
  children, 
  color = "cyan",
  className,
  ...motionProps 
}: PulseGlowProps) => {
  const glowColors = {
    cyan: "shadow-cyan-500/50",
    purple: "shadow-purple-500/50",
    green: "shadow-green-500/50",
    red: "shadow-red-500/50",
    yellow: "shadow-yellow-500/50"
  }

  return (
    <motion.div
      animate={{
        boxShadow: [
          `0 0 0px ${glowColors[color as keyof typeof glowColors]}`,
          `0 0 20px ${glowColors[color as keyof typeof glowColors]}`,
          `0 0 0px ${glowColors[color as keyof typeof glowColors]}`
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={cn("rounded-lg", className)}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}

interface SlideInProps extends MotionProps {
  children: React.ReactNode
  direction?: 'left' | 'right' | 'up' | 'down'
  delay?: number
  className?: string
}

const SlideIn = ({ 
  children, 
  direction = 'up',
  delay = 0,
  className,
  ...motionProps 
}: SlideInProps) => {
  const directions = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    up: { x: 0, y: 50 },
    down: { x: 0, y: -50 }
  }

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directions[direction]
      }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: "easeOut"
      }}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}

interface StaggerContainerProps {
  children: React.ReactNode
  staggerDelay?: number
  className?: string
}

const StaggerContainer = ({ 
  children, 
  staggerDelay = 0.1,
  className 
}: StaggerContainerProps) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const StaggerItem = ({ 
  children, 
  className,
  ...motionProps 
}: MotionProps & { children: React.ReactNode; className?: string }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.5 }}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}

export { 
  HoverScale, 
  FloatingElement, 
  PulseGlow, 
  SlideIn, 
  StaggerContainer, 
  StaggerItem 
}