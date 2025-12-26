'use client'

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { cn } from "@/lib/utils"

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  animation?: 'none' | 'float' | 'slide' | 'glow'
}

const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ className, label, error, animation = 'float', ...props }, ref) => {
    const [hasValue, setHasValue] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const labelRef = useRef<HTMLSpanElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const input = inputRef.current
      const labelEl = labelRef.current
      const container = containerRef.current
      
      if (!input || !labelEl || !container || animation === 'none') return

      let focusTl: GSAPTimeline | null = null
      let blurTl: GSAPTimeline | null = null

      const handleFocus = () => {
        if (focusTl) focusTl.kill()
        focusTl = gsap.timeline()

        switch (animation) {
          case 'float':
            focusTl.to(labelEl, {
              y: -24,
              scale: 0.85,
              color: 'rgb(193, 255, 114)',
              duration: 0.2,
              ease: 'power2.out'
            })
            .to(container, {
              borderColor: 'rgb(193, 255, 114)',
              boxShadow: '0 0 0 2px rgba(193, 255, 114, 0.2)',
              duration: 0.2,
              ease: 'power2.out'
            }, 0)
            break

          case 'slide':
            focusTl.to(labelEl, {
              x: -8,
              y: -24,
              scale: 0.85,
              color: 'rgb(193, 255, 114)',
              duration: 0.3,
              ease: 'back.out(1.7)'
            })
            .to(container, {
              borderColor: 'rgb(193, 255, 114)',
              duration: 0.2,
              ease: 'power2.out'
            }, 0)
            break

          case 'glow':
            focusTl.to(labelEl, {
              y: -24,
              scale: 0.85,
              color: 'rgb(193, 255, 114)',
              textShadow: '0 0 8px rgba(193, 255, 114, 0.6)',
              duration: 0.2,
              ease: 'power2.out'
            })
            .to(container, {
              borderColor: 'rgb(193, 255, 114)',
              boxShadow: '0 0 20px rgba(193, 255, 114, 0.3)',
              duration: 0.2,
              ease: 'power2.out'
            }, 0)
            break
        }
      }

      const handleBlur = () => {
        if (!hasValue) {
          if (blurTl) blurTl.kill()
          blurTl = gsap.timeline()

          switch (animation) {
            case 'float':
            case 'slide':
            case 'glow':
              blurTl.to(labelEl, {
                y: 0,
                x: 0,
                scale: 1,
                color: 'rgb(156, 163, 175)',
                textShadow: 'none',
                duration: 0.2,
                ease: 'power2.out'
              })
              .to(container, {
                borderColor: 'rgb(229, 231, 235)',
                boxShadow: 'none',
                duration: 0.2,
                ease: 'power2.out'
              }, 0)
              break
          }
        } else {
          // Keep label in focused position if input has value
          gsap.to(container, {
            borderColor: 'rgb(229, 231, 235)',
            boxShadow: 'none',
            duration: 0.2,
            ease: 'power2.out'
          })
        }
      }

      const handleInput = (e: Event) => {
        const target = e.target as HTMLInputElement
        setHasValue(target.value.length > 0)
      }

      input.addEventListener('focus', handleFocus)
      input.addEventListener('blur', handleBlur)
      input.addEventListener('input', handleInput)

      // Initial state
      const timer = setTimeout(() => {
        if (input.value) {
          setHasValue(true)
          gsap.set(labelEl, {
            y: -24,
            scale: 0.85,
            color: 'rgb(156, 163, 175)'
          })
        }
      }, 0)

      return () => {
        clearTimeout(timer)
        input.removeEventListener('focus', handleFocus)
        input.removeEventListener('blur', handleBlur)
        input.removeEventListener('input', handleInput)
        if (focusTl) focusTl.kill()
        if (blurTl) blurTl.kill()
      }
    }, [animation, hasValue])

    return (
      <div className="relative">
        <div
          ref={containerRef}
          className={cn(
            "relative rounded-lg border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-600 transition-colors duration-200",
            error && "border-red-500 dark:border-red-400",
            className
          )}
        >
          <input
            ref={(node: HTMLInputElement) => {
              inputRef.current = node
              if (typeof ref === 'function') {
                ref(node)
              } else if (ref) {
                ref.current = node
              }
            }}
            className={cn(
              "w-full px-4 py-3 bg-transparent text-gray-900 dark:text-gray-100 placeholder-transparent focus:outline-none",
              label && "pt-6"
            )}
            placeholder={label || props.placeholder}
            {...props}
          />
          
          {label && (
            <span
              ref={labelRef}
              className={cn(
                "absolute left-4 top-3 text-gray-500 dark:text-gray-400 pointer-events-none transition-colors duration-200",
                "origin-left transform"
              )}
            >
              {label}
            </span>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    )
  }
)

AnimatedInput.displayName = "AnimatedInput"

// Specialized input variants
const FloatingInput = React.forwardRef<HTMLInputElement, Omit<AnimatedInputProps, 'animation'>>(
  (props, ref) => (
    <AnimatedInput ref={ref} animation="float" {...props} />
  )
)

const SlideInput = React.forwardRef<HTMLInputElement, Omit<AnimatedInputProps, 'animation'>>(
  (props, ref) => (
    <AnimatedInput ref={ref} animation="slide" {...props} />
  )
)

const GlowInput = React.forwardRef<HTMLInputElement, Omit<AnimatedInputProps, 'animation'>>(
  (props, ref) => (
    <AnimatedInput ref={ref} animation="glow" {...props} />
  )
)

FloatingInput.displayName = "FloatingInput"
SlideInput.displayName = "SlideInput"
GlowInput.displayName = "GlowInput"

export { AnimatedInput, FloatingInput, SlideInput, GlowInput }