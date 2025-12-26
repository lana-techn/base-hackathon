'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { gsapAnimationManager } from '@/lib/gsap-animation-manager'

interface GSAPContextType {
  isInitialized: boolean
  animationManager: typeof gsapAnimationManager
}

const GSAPContext = createContext<GSAPContextType | null>(null)

interface GSAPProviderProps {
  children: React.ReactNode
}

export function GSAPProvider({ children }: GSAPProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Wait for DOM to be ready before initializing GSAP
    const initializeGSAP = () => {
      // Check if document is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          gsapAnimationManager.init()
          setIsInitialized(true)
        })
      } else {
        // DOM is already ready
        gsapAnimationManager.init()
        setIsInitialized(true)
      }
    }

    initializeGSAP()

    // Cleanup on unmount
    return () => {
      gsapAnimationManager.destroy()
    }
  }, [])

  const contextValue: GSAPContextType = {
    isInitialized,
    animationManager: gsapAnimationManager
  }

  return (
    <GSAPContext.Provider value={contextValue}>
      {children}
    </GSAPContext.Provider>
  )
}

export function useGSAP() {
  const context = useContext(GSAPContext)
  if (!context) {
    throw new Error('useGSAP must be used within a GSAPProvider')
  }
  return context
}

export default GSAPProvider