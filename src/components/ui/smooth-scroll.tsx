'use client'

import { useEffect } from "react"
import { gsapAnimationManager } from "@/lib/gsap-animation-manager"

interface SmoothScrollProps {
  children: React.ReactNode
  options?: {
    smooth?: number
    effects?: boolean
    smoothTouch?: number
  }
}

const SmoothScroll = ({ children, options = {} }: SmoothScrollProps) => {
  useEffect(() => {
    // Initialize GSAP Animation Manager with options
    gsapAnimationManager.init()

    // Cleanup
    return () => {
      gsapAnimationManager.destroy()
    }
  }, [options])

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">
        {children}
      </div>
    </div>
  )
}

export { SmoothScroll }