'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Star, Plus, ChevronRight } from 'lucide-react'

interface WatchlistItem {
    symbol: string
    name: string
    price: number
    change: number
    changePercent: number
    isFavorite?: boolean
}

interface WatchlistPanelProps {
    className?: string
    onSelectSymbol?: (symbol: string) => void
}

const mockWatchlist: WatchlistItem[] = [
    { symbol: 'ETH', name: 'Ethereum', price: 3521.45, change: 89.23, changePercent: 2.60, isFavorite: true },
    { symbol: 'BTC', name: 'Bitcoin', price: 98245.30, change: -1234.56, changePercent: -1.24 },
    { symbol: 'SOL', name: 'Solana', price: 187.82, change: 12.45, changePercent: 7.10, isFavorite: true },
    { symbol: 'ARB', name: 'Arbitrum', price: 1.23, change: 0.08, changePercent: 6.95 },
    { symbol: 'OP', name: 'Optimism', price: 2.45, change: -0.12, changePercent: -4.67 },
    { symbol: 'LINK', name: 'Chainlink', price: 18.92, change: 0.45, changePercent: 2.44 },
]

const tabs = ['Favorites', 'Crypto', 'Trending']

export function WatchlistPanel({ className, onSelectSymbol }: WatchlistPanelProps) {
    const [activeTab, setActiveTab] = useState('Favorites')
    const [selectedSymbol, setSelectedSymbol] = useState('ETH')

    const filteredList = activeTab === 'Favorites'
        ? mockWatchlist.filter(item => item.isFavorite)
        : mockWatchlist.slice(0, 4) // Limit to 4 items for compact view

    const handleSelect = (symbol: string) => {
        setSelectedSymbol(symbol)
        onSelectSymbol?.(symbol)
    }

    return (
        <div className={cn('flex flex-col h-full overflow-hidden', className)}>
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 flex-shrink-0">
                <h3 className="text-sm font-semibold text-foreground">Watchlist</h3>
                <button className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-2 py-1.5 border-b border-border/30 flex-shrink-0">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            'px-2 py-1 text-xs font-medium rounded-lg transition-all',
                            activeTab === tab
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Table Header */}
            <div className="flex items-center justify-between px-3 py-1.5 text-[10px] text-muted-foreground border-b border-border/30 flex-shrink-0">
                <span className="flex-1">Symbol</span>
                <span className="w-20 text-right">Price</span>
                <span className="w-14 text-right">Change</span>
            </div>

            {/* Watchlist Items - scrollable */}
            <div className="flex-1 overflow-y-auto min-h-0">
                {filteredList.map((item) => (
                    <button
                        key={item.symbol}
                        onClick={() => handleSelect(item.symbol)}
                        className={cn(
                            'w-full flex items-center justify-between px-3 py-2 text-left transition-all',
                            'hover:bg-secondary/50 group',
                            selectedSymbol === item.symbol && 'bg-primary/10 border-l-2 border-primary'
                        )}
                    >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className={cn(
                                'w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold',
                                item.change >= 0 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                            )}>
                                {item.symbol.slice(0, 2)}
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-1">
                                    <span className="text-sm font-medium text-foreground truncate">{item.symbol}</span>
                                    {item.isFavorite && (
                                        <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                                    )}
                                </div>
                                <span className="text-[10px] text-muted-foreground truncate">{item.name}</span>
                            </div>
                        </div>

                        <div className="w-20 text-right">
                            <span className="text-xs font-medium text-foreground">
                                ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>

                        <div className="w-14 flex items-center justify-end gap-0.5">
                            {item.change >= 0 ? (
                                <TrendingUp className="w-2.5 h-2.5 text-success" />
                            ) : (
                                <TrendingDown className="w-2.5 h-2.5 text-destructive" />
                            )}
                            <span className={cn(
                                'text-[10px] font-medium',
                                item.change >= 0 ? 'text-success' : 'text-destructive'
                            )}>
                                {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Footer */}
            <div className="px-3 py-2 border-t border-border/50 flex-shrink-0">
                <button className="w-full flex items-center justify-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
                    View All Assets
                    <ChevronRight className="w-3 h-3" />
                </button>
            </div>
        </div>
    )
}
