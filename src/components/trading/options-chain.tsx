'use client'

/**
 * Options Chain Component
 * Displays available options with expiry tabs and Call/Put columns
 */

import { useState } from 'react'
import { RefreshCw, TrendingUp, TrendingDown, Calendar, Activity, Zap } from 'lucide-react'
import { useThetanuts } from '@/hooks/useThetanuts'
import { OptionCard } from './option-card'
import { ParsedOption } from '@/types/thetanuts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GlassCard } from '@/components/ui/glass-card'
import { cn } from '@/lib/utils'

interface OptionsChainProps {
    asset?: 'ETH' | 'BTC'
    onSelectOption?: (option: ParsedOption) => void
    className?: string
}

export function OptionsChain({
    asset = 'ETH',
    onSelectOption,
    className
}: OptionsChainProps) {
    const {
        optionsChain,
        isLoading,
        error,
        lastUpdated,
        refresh,
        getBestOptions
    } = useThetanuts({ asset, autoRefresh: true })

    const [selectedExpiry, setSelectedExpiry] = useState<Date | null>(null)
    const [selectedOption, setSelectedOption] = useState<ParsedOption | null>(null)
    const [viewMode, setViewMode] = useState<'all' | 'calls' | 'puts'>('all')

    // Set default expiry to first available
    if (!selectedExpiry && optionsChain?.expiries.length) {
        setSelectedExpiry(optionsChain.expiries[0])
    }

    // Filter options by selected expiry
    const filteredCalls = optionsChain?.calls.filter(o => {
        if (!selectedExpiry) return true
        return Math.abs(o.expiryTimestamp - Math.floor(selectedExpiry.getTime() / 1000)) < 86400
    }) ?? []

    const filteredPuts = optionsChain?.puts.filter(o => {
        if (!selectedExpiry) return true
        return Math.abs(o.expiryTimestamp - Math.floor(selectedExpiry.getTime() / 1000)) < 86400
    }) ?? []

    // Get AI recommendations
    const bestCalls = getBestOptions('CALL', 2)
    const bestPuts = getBestOptions('PUT', 2)

    const handleSelectOption = (option: ParsedOption) => {
        setSelectedOption(option)
        onSelectOption?.(option)
    }

    const formatExpiry = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
    }

    if (error) {
        return (
            <GlassCard className={cn('p-6', className)}>
                <div className="text-center text-destructive">
                    <p>Failed to load options data</p>
                    <p className="text-sm text-muted-foreground mt-1">{error}</p>
                    <Button variant="outline" size="sm" onClick={refresh} className="mt-4">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry
                    </Button>
                </div>
            </GlassCard>
        )
    }

    return (
        <GlassCard className={cn('flex flex-col h-full', className)}>
            {/* Header */}
            <div className="p-4 border-b border-border/50">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">{asset} Options</h2>
                            {optionsChain && (
                                <p className="text-sm text-muted-foreground">
                                    ${optionsChain.currentPrice.toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {lastUpdated && (
                            <span className="text-[10px] text-muted-foreground">
                                Updated {lastUpdated.toLocaleTimeString()}
                            </span>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={refresh}
                            disabled={isLoading}
                        >
                            <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
                        </Button>
                    </div>
                </div>

                {/* Expiry Tabs */}
                <div className="flex gap-1 overflow-x-auto pb-1">
                    {optionsChain?.expiries.slice(0, 5).map((expiry) => (
                        <button
                            key={expiry.getTime()}
                            onClick={() => setSelectedExpiry(expiry)}
                            className={cn(
                                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                                selectedExpiry?.getTime() === expiry.getTime()
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-secondary'
                            )}
                        >
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {formatExpiry(expiry)}
                        </button>
                    ))}
                </div>
            </div>

            {/* AI Recommendations */}
            {(bestCalls.length > 0 || bestPuts.length > 0) && (
                <div className="px-4 py-3 border-b border-border/50 bg-primary/5">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-xs font-semibold text-foreground">AI Recommended</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {bestCalls.slice(0, 1).map(o => (
                            <Badge
                                key={o.ticker}
                                variant="outline"
                                className="bg-success/10 border-success/30 cursor-pointer hover:bg-success/20"
                                onClick={() => handleSelectOption(o)}
                            >
                                <TrendingUp className="w-3 h-3 mr-1 text-success" />
                                ${o.strike} Call · ${o.premiumUSD.toFixed(2)}
                            </Badge>
                        ))}
                        {bestPuts.slice(0, 1).map(o => (
                            <Badge
                                key={o.ticker}
                                variant="outline"
                                className="bg-destructive/10 border-destructive/30 cursor-pointer hover:bg-destructive/20"
                                onClick={() => handleSelectOption(o)}
                            >
                                <TrendingDown className="w-3 h-3 mr-1 text-destructive" />
                                ${o.strike} Put · ${o.premiumUSD.toFixed(2)}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* View Mode Toggle */}
            <div className="px-4 py-2 border-b border-border/50">
                <div className="flex gap-1">
                    {(['all', 'calls', 'puts'] as const).map(mode => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={cn(
                                'px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors',
                                viewMode === mode
                                    ? 'bg-secondary text-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
            </div>

            {/* Options Grid */}
            <div className="flex-1 overflow-y-auto min-h-0 p-4 scrollbar-thin">
                {isLoading && !optionsChain ? (
                    <div className="flex items-center justify-center h-32">
                        <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className={cn(
                        'grid gap-3',
                        viewMode === 'all' ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'
                    )}>
                        {/* Calls Column */}
                        {(viewMode === 'all' || viewMode === 'calls') && (
                            <div className="space-y-2">
                                <h3 className="text-xs font-semibold text-success flex items-center gap-1 sticky top-0 bg-card/95 py-1">
                                    <TrendingUp className="w-3 h-3" />
                                    CALLS ({filteredCalls.length})
                                </h3>
                                {filteredCalls.slice(0, 6).map(option => (
                                    <OptionCard
                                        key={option.ticker}
                                        option={option}
                                        isSelected={selectedOption?.ticker === option.ticker}
                                        onSelect={handleSelectOption}
                                        compact
                                    />
                                ))}
                            </div>
                        )}

                        {/* Puts Column */}
                        {(viewMode === 'all' || viewMode === 'puts') && (
                            <div className="space-y-2">
                                <h3 className="text-xs font-semibold text-destructive flex items-center gap-1 sticky top-0 bg-card/95 py-1">
                                    <TrendingDown className="w-3 h-3" />
                                    PUTS ({filteredPuts.length})
                                </h3>
                                {filteredPuts.slice(0, 6).map(option => (
                                    <OptionCard
                                        key={option.ticker}
                                        option={option}
                                        isSelected={selectedOption?.ticker === option.ticker}
                                        onSelect={handleSelectOption}
                                        compact
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Selected Option Footer */}
            {selectedOption && (
                <div className="p-3 border-t border-border/50 bg-secondary/30">
                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <span className="font-medium">{selectedOption.ticker}</span>
                            <span className="text-muted-foreground ml-2">
                                Δ {selectedOption.greeks.delta.toFixed(2)} · IV {(selectedOption.greeks.iv * 100).toFixed(1)}%
                            </span>
                        </div>
                        <Button size="sm" className="gap-2">
                            <Zap className="w-3 h-3" />
                            Trade ${selectedOption.premiumUSD.toFixed(2)}
                        </Button>
                    </div>
                </div>
            )}
        </GlassCard>
    )
}
