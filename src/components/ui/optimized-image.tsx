'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

export function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  placeholder = 'empty',
  blurDataURL
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    const handleLoad = () => setIsLoaded(true)
    const handleError = () => setIsError(true)

    if (img.complete) {
      setIsLoaded(true)
    } else {
      img.addEventListener('load', handleLoad)
      img.addEventListener('error', handleError)
    }

    return () => {
      img.removeEventListener('load', handleLoad)
      img.removeEventListener('error', handleError)
    }
  }, [])

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Placeholder */}
      {!isLoaded && !isError && (
        <div 
          className="absolute inset-0 bg-muted/50 animate-pulse"
          style={{ 
            backgroundImage: placeholder === 'blur' && blurDataURL ? `url(${blurDataURL})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(10px)'
          }}
        />
      )}

      {/* Main Image */}
      <motion.img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />

      {/* Error State */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <div className="text-muted-foreground text-sm">Failed to load image</div>
        </div>
      )}
    </div>
  )
}