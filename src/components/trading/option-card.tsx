'use client'

/**
 * Option Card Component
 * Displays a single option with Greeks, premium, and selection
 */

import { useState } from 'react'
import { TrendingUp, TrendingDown, Clock, Zap } from 'lucide-react'
import { ParsedOption } from '@/types/thetanuts'
import { cn } from '@/lib/utils'

interface OptionCardProps {
    option: ParsedOption
    isSelected?: boolean
    onSelect?: (option: ParsedOption) => void
    compact?: boolean
}

export function OptionCard({
    option,
    isSelected = false,
    onSelect,
    compact = false
}: OptionCardProps) {
    const [isHovered, setIsHovered] = useState(false)

    const isCall = option.isCall
    const colorClass = isCall ? 'text-success' : 'text-destructive'
    const bgColorClass = isCall ? 'bg-success/10 border-success/30' : 'bg-destructive/10 border-destructive/30'
    const selectedClass = isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''

    return (
        <div
            className={cn(
                'relative rounded-xl border p-3 cursor-pointer transition-all duration-200',
                'hover:shadow-lg hover:scale-[1.02]',
                bgColorClass,
                selectedClass,
                compact ? 'p-2' : 'p-3'
            )}
            onClick={() => onSelect?.(option)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Type indicator */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    {isCall ? (
                        <TrendingUp className={cn('w-4 h-4', colorClass)} />
                    ) : (
                        <TrendingDown className={cn('w-4 h-4', colorClass)} />
                    )}
                    <span className={cn('font-semibold text-sm', colorClass)}>
                        {isCall ? 'CALL' : 'PUT'}
                    </span>
                </div>
                <span className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full font-medium',
                    option.moneyness === 'ITM' ? 'bg-success/20 text-success' :
                        option.moneyness === 'ATM' ? 'bg-primary/20 text-primary' :
                            'bg-muted text-muted-foreground'
                )}>
                    {option.moneyness}
                </span>
            </div>

            {/* Strike & Premium */}
            <div className="space-y-1">
                <div className="flex items-baseline justify-between">
                    <span className="text-xs text-muted-foreground">Strike</span>
                    <span className="font-bold text-foreground">${option.strike.toLocaleString()}</span>
                </div>
                <div className="flex items-baseline justify-between">
                    <span className="text-xs text-muted-foreground">Premium</span>
                    <span className="font-mono text-sm text-foreground">${option.premiumUSD.toFixed(2)}</span>
                </div>
            </div>

            {/* Expiry */}
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{option.daysToExpiry}d</span>
            </div>

            {/* Greeks tooltip on hover */}
            {isHovered && !compact && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 bg-popover border border-border rounded-lg p-2 shadow-xl min-w-[140px]">
                    <div className="text-[10px] space-y-1">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Delta</span>
                            <span className="font-mono">{option.greeks.delta.toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Gamma</span>
                            <span className="font-mono">{option.greeks.gamma.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Theta</span>
                            <span className="font-mono">{option.greeks.theta.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Vega</span>
                            <span className="font-mono">{option.greeks.vega.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between border-t border-border pt-1 mt-1">
                            <span className="text-muted-foreground">IV</span>
                            <span className="font-mono font-medium">{(option.greeks.iv * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-popover" />
                </div>
            )}

            {/* Selected indicator */}
            {isSelected && (
                <div className="absolute -top-1 -right-1">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Zap className="w-3 h-3 text-primary-foreground" />
                    </div>
                </div>
            )}
        </div>
    )
}

// ============ Mini Option Card for compact views ============

export function MiniOptionCard({ option, onSelect }: OptionCardProps) {
    const isCall = option.isCall
    const colorClass = isCall ? 'text-success' : 'text-destructive'

    return (
        <button
            onClick={() => onSelect?.(option)}
            className={cn(
                'flex items-center gap-2 px-2 py-1 rounded-lg border transition-colors',
                'hover:bg-secondary/50',
                isCall ? 'border-success/30' : 'border-destructive/30'
            )}
        >
            {isCall ? (
                <TrendingUp className={cn('w-3 h-3', colorClass)} />
            ) : (
                <TrendingDown className={cn('w-3 h-3', colorClass)} />
            )}
            <span className="text-xs font-medium">${option.strike}</span>
            <span className="text-[10px] text-muted-foreground">${option.premiumUSD.toFixed(2)}</span>
        </button>
    )
}
