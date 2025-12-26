'use client'

import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion'

interface AnimationProviderProps {
  children: React.ReactNode
}

export function AnimationProvider({ children }: AnimationProviderProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig
        transition={{
          type: "tween",
          ease: [0.25, 0.46, 0.45, 0.94], // Custom smooth easing
          duration: 0.4
        }}
        reducedMotion="user"
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  )
}