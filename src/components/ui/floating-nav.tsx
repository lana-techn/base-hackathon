'use client'

import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { GlassCard } from "./glass-card"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavItem {
  name: string
  href: string
  icon?: React.ReactNode
}

interface FloatingNavProps {
  navItems: NavItem[]
  className?: string
}

const FloatingNav = ({ navItems, className }: FloatingNavProps) => {
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setVisible(true)
      } else {
        setVisible(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: -100 }}
        animate={{ 
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0 
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          "fixed top-4 inset-x-0 mx-auto z-50 max-w-fit",
          className
        )}
      >
        <GlassCard variant="strong" blur="lg" className="px-6 py-3">
          <div className="flex items-center justify-center space-x-6">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200",
                  "hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground"
                )}
              >
                {item.icon && (
                  <span className="text-sm">
                    {item.icon}
                  </span>
                )}
                <span className="text-sm font-medium">
                  {item.name}
                </span>
                {pathname === item.href && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/20 rounded-lg border border-primary/30"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  )
}

export { FloatingNav }