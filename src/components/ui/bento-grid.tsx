'use client'

import { cn } from "@/lib/utils"
import { GlassCard } from "./glass-card"
import { 
  StaggerContainer, 
  StaggerItem, 
  HoverScale,
  FadeInUp 
} from "./smooth-animations"

interface BentoGridProps {
  children: React.ReactNode
  className?: string
  columns?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  responsive?: boolean
  autoFit?: boolean
  animated?: boolean
}

interface BentoGridItemProps {
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
  header?: React.ReactNode
  icon?: React.ReactNode
  colSpan?: number
  rowSpan?: number
  priority?: 'low' | 'medium' | 'high'
  animated?: boolean
  variant?: 'default' | 'subtle' | 'strong' | 'glow' | 'accent'
  interactive?: boolean
}

const BentoGrid = ({ 
  children, 
  className,
  columns = 3,
  gap = 'md',
  responsive = true,
  autoFit = false,
  animated = true
}: BentoGridProps) => {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
    12: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-12'
  }

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }

  const autoFitClass = autoFit ? 'grid-cols-[repeat(auto-fit,minmax(280px,1fr))]' : ''

  const GridComponent = animated ? StaggerContainer : 'div'

  return (
    <GridComponent
      className={cn(
        "grid w-full max-w-7xl mx-auto",
        autoFit ? autoFitClass : (responsive ? columnClasses[columns] : `grid-cols-${columns}`),
        gapClasses[gap],
        "auto-rows-min bento-grid", // Allows items to size naturally
        className
      )}
    >
      {children}
    </GridComponent>
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
  priority = 'medium',
  animated = true,
  variant = 'default',
  interactive = false,
}: BentoGridItemProps) => {
  // Enhanced responsive column spanning
  const getColSpanClass = (span: number) => {
    if (span === 1) return 'col-span-1'
    if (span === 2) return 'col-span-1 md:col-span-2'
    if (span === 3) return 'col-span-1 md:col-span-2 lg:col-span-3'
    if (span === 4) return 'col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4'
    return `col-span-${Math.min(span, 12)}`
  }

  const getRowSpanClass = (span: number) => {
    if (span === 1) return 'row-span-1'
    if (span === 2) return 'row-span-1 md:row-span-2'
    if (span === 3) return 'row-span-1 md:row-span-2 lg:row-span-3'
    return `row-span-${Math.min(span, 6)}`
  }

  const ItemComponent = animated ? StaggerItem : 'div'

  return (
    <ItemComponent
      className={cn(
        getColSpanClass(colSpan),
        getRowSpanClass(rowSpan),
        "min-h-[200px] bento-item", // Minimum height for consistency
        className
      )}
    >
      <GlassCard 
        variant={variant}
        animated={animated}
        className={cn(
          "p-6 h-full group",
          "transition-all duration-300 ease-out",
          interactive && [
            "cursor-pointer",
            "card-animated"
          ]
        )}
      >
        {/* Header section */}
        {header && (
          <div className="mb-4 animate-on-scroll">
            {header}
          </div>
        )}
        
        {/* Content container */}
        <div className="flex flex-col h-full">
          {/* Title and icon section */}
          {(title || icon) && (
            <div className="flex items-center gap-3 mb-3 animate-on-scroll">
              {icon && (
                <div className="text-primary group-hover:text-primary/80 transition-colors duration-200 flex-shrink-0">
                  {icon}
                </div>
              )}
              {title && (
                <h3 className="text-lg font-semibold text-foreground group-hover:text-foreground/90 transition-colors duration-200 line-clamp-2">
                  {title}
                </h3>
              )}
            </div>
          )}
          
          {/* Description */}
          {description && (
            <p className="text-muted-foreground text-sm mb-4 group-hover:text-muted-foreground/90 transition-colors duration-200 line-clamp-3 animate-on-scroll">
              {description}
            </p>
          )}
          
          {/* Main content area */}
          <div className="flex-1 flex flex-col animate-on-scroll">
            {children}
          </div>
        </div>

        {/* Interactive indicator */}
        {interactive && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          </div>
        )}
      </GlassCard>
    </ItemComponent>
  )
}

// Specialized Bento Grid variants for common layouts
const BentoGridHero = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <BentoGrid 
    columns={4} 
    gap="lg" 
    className={cn("grid-rows-[300px_200px_200px] lg:grid-rows-[400px_250px]", className)}
  >
    {children}
  </BentoGrid>
)

const BentoGridDashboard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <BentoGrid 
    columns={6} 
    gap="md" 
    autoFit={true}
    className={cn("min-h-screen", className)}
  >
    {children}
  </BentoGrid>
)

const BentoGridFeatures = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <BentoGrid 
    columns={3} 
    gap="lg" 
    className={cn("grid-rows-[repeat(auto-fit,minmax(250px,1fr))]", className)}
  >
    {children}
  </BentoGrid>
)

export { 
  BentoGrid, 
  BentoGridItem, 
  BentoGridHero, 
  BentoGridDashboard, 
  BentoGridFeatures 
}