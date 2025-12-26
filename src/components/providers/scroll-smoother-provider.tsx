'use client'

import { useEffect } from 'react'
import { gsapAnimationManager } from '@/lib/gsap-animation-manager'

interface SmoothScrollProviderProps {
    children: React.ReactNode
}

export function ScrollSmootherProvider({ children }: SmoothScrollProviderProps) {
    useEffect(() => {
        // Initialize GSAP Animation Manager
        gsapAnimationManager.init()

        // Cleanup on unmount
        return () => {
            gsapAnimationManager.destroy()
        }
    }, [])

    return (
        <div id="smooth-wrapper">
            <div id="smooth-content">
                {children}
            </div>
        </div>
    )
}
