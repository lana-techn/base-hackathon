'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  animate?: boolean
}

export function Skeleton({ className, animate = true }: SkeletonProps) {
  const Component = animate ? motion.div : 'div'
  
  return (
    <Component
      className={cn(
        "bg-muted/50 rounded-md",
        animate && "animate-pulse",
        className
      )}
      {...(animate && {
        animate: {
          opacity: [0.5, 1, 0.5],
        },
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      })}
    />
  )
}

export function HeroSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background pt-20">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left space-y-6">
            <Skeleton className="h-4 w-32 mx-auto lg:mx-0" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-6 w-3/4 mx-auto lg:mx-0" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center">
            <Skeleton className="w-[400px] h-[400px] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}