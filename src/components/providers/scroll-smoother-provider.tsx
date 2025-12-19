'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

interface SmoothScrollProviderProps {
    children: React.ReactNode
}

export function ScrollSmootherProvider({ children }: SmoothScrollProviderProps) {
    const lenisRef = useRef<Lenis | null>(null)

    useEffect(() => {
        // Initialize Lenis smooth scroll
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 2,
        })

        lenisRef.current = lenis

        // Animation frame loop
        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        // Parallax effect using scroll event
        const handleScroll = () => {
            const scrollY = lenis.scroll

            // Apply parallax to elements with data-speed
            document.querySelectorAll<HTMLElement>('[data-speed]').forEach((el) => {
                const speed = parseFloat(el.dataset.speed || '1')
                const movement = scrollY * (speed - 1) * 0.1
                el.style.transform = `translate3d(0, ${movement}px, 0)`
            })

            // Apply parallax to slow elements
            document.querySelectorAll<HTMLElement>('.parallax-slow').forEach((el) => {
                const movement = scrollY * -0.03
                el.style.transform = `translate3d(0, ${movement}px, 0)`
            })

            // Apply parallax to fast elements  
            document.querySelectorAll<HTMLElement>('.parallax-fast').forEach((el) => {
                const movement = scrollY * -0.08
                el.style.transform = `translate3d(0, ${movement}px, 0)`
            })

            // Fade in sections based on viewport
            document.querySelectorAll<HTMLElement>('section').forEach((section) => {
                const rect = section.getBoundingClientRect()
                const windowHeight = window.innerHeight

                if (rect.top < windowHeight * 0.9) {
                    const progress = Math.min(1, (windowHeight * 0.9 - rect.top) / (windowHeight * 0.3))
                    section.style.opacity = String(0.85 + progress * 0.15)
                    section.style.transform = `translate3d(0, ${(1 - progress) * 20}px, 0)`
                }
            })
        }

        lenis.on('scroll', handleScroll)

        // Initial call
        handleScroll()

        return () => {
            lenis.destroy()
        }
    }, [])

    return <>{children}</>
}
