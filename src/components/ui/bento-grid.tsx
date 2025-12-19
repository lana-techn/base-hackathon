'use client'

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { GlassCard } from "./glass-card"

interface BentoGridProps {
  children: React.ReactNode
  className?: string
}

interface BentoGridItemProps {
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
  header?: React.ReactNode
  icon?: React.ReactNode
  colSpan?: 1 | 2 | 3
  rowSpan?: 1 | 2 | 3
}

const BentoGrid = ({ children, className }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  )
}

const BentoGridItem = ({
  children,
  className,
  title,
  description,
  header,
  icon,
  colSpan = 1,
  rowSpan = 1,
}: BentoGridItemProps) => {
  const gridSpanClasses = {
    1: 'col-span-1',
    2: 'md:col-span-2',
    3: 'lg:col-span-3'
  }

  const gridRowClasses = {
    1: 'row-span-1',
    2: 'md:row-span-2',
    3: 'lg:row-span-3'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        gridSpanClasses[colSpan],
        gridRowClasses[rowSpan],
        className
      )}
    >
      <GlassCard className="p-6 h-full group hover:scale-[1.02] transition-transform duration-300">
        {header && (
          <div className="mb-4">
            {header}
          </div>
        )}
        
        <div className="flex flex-col h-full">
          {(title || icon) && (
            <div className="flex items-center gap-3 mb-3">
              {icon && (
                <div className="text-primary group-hover:text-primary/80 transition-colors">
                  {icon}
                </div>
              )}
              {title && (
                <h3 className="text-lg font-semibold text-foreground group-hover:text-foreground/90 transition-colors">
                  {title}
                </h3>
              )}
            </div>
          )}
          
          {description && (
            <p className="text-muted-foreground text-sm mb-4 group-hover:text-muted-foreground/90 transition-colors">
              {description}
            </p>
          )}
          
          <div className="flex-1">
            {children}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

export { BentoGrid, BentoGridItem }