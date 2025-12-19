'use client'

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TypewriterEffectProps {
  words: string[]
  className?: string
  typeSpeed?: number
  deleteSpeed?: number
  delayBetweenWords?: number
  loop?: boolean
  cursor?: boolean
  cursorClassName?: string
}

const TypewriterEffect = ({
  words,
  className,
  typeSpeed = 100,
  deleteSpeed = 50,
  delayBetweenWords = 2000,
  loop = true,
  cursor = true,
  cursorClassName
}: TypewriterEffectProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const currentWord = words[currentWordIndex]
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.slice(0, currentText.length + 1))
        } else {
          // Word complete, wait then start deleting
          setTimeout(() => setIsDeleting(true), delayBetweenWords)
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1))
        } else {
          // Deletion complete, move to next word
          setIsDeleting(false)
          if (loop || currentWordIndex < words.length - 1) {
            setCurrentWordIndex((prev) => (prev + 1) % words.length)
          }
        }
      }
    }, isDeleting ? deleteSpeed : typeSpeed)

    return () => clearTimeout(timeout)
  }, [currentText, currentWordIndex, isDeleting, words, typeSpeed, deleteSpeed, delayBetweenWords, loop])

  // Cursor blinking effect
  useEffect(() => {
    if (!cursor) return
    
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)

    return () => clearInterval(cursorInterval)
  }, [cursor])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("font-mono", className)}
    >
      <span>{currentText}</span>
      {cursor && (
        <span 
          className={cn(
            "inline-block w-0.5 h-[1em] bg-current ml-1 transition-opacity duration-100",
            showCursor ? "opacity-100" : "opacity-0",
            cursorClassName
          )}
        />
      )}
    </motion.div>
  )
}

export { TypewriterEffect }