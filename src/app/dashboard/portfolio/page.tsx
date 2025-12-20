'use client'

import { GlassCard } from '@/components/ui/glass-card'
import { Badge } from '@/components/ui/badge'
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    Clock
} from 'lucide-react'

const holdings = [
    { symbol: 'ETH', name: 'Ethereum', amount: 2.5, value: 8803.63, change: 2.34, allocation: 70.7 },
    { symbol: 'BTC', name: 'Bitcoin', amount: 0.025, value: 2456.13, change: -1.24, allocation: 19.7 },
    { symbol: 'SOL', name: 'Solana', amount: 5.2, value: 976.67, change: 5.12, allocation: 7.8 },
    { symbol: 'LINK', name: 'Chainlink', amount: 12, value: 227.04, change: 1.89, allocation: 1.8 },
]

const recentTrades = [
    { type: 'buy', symbol: 'ETH', amount: 0.5, price: 3521.45, time: '2 hours ago' },
    { type: 'sell', symbol: 'BTC', amount: 0.01, price: 98000, time: '5 hours ago' },
    { type: 'buy', symbol: 'SOL', amount: 2, price: 185.32, time: '1 day ago' },
]

export default function PortfolioPage() {
    const totalValue = holdings.reduce((acc, h) => acc + h.value, 0)
    const totalChange = 2.12 // Calculated value

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Portfolio</h1>
                <p className="text-muted-foreground mt-1">Track your holdings and performance</p>
            </div>

            {/* Portfolio Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassCard className="p-5 md:col-span-2">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
                            <p className="text-3xl font-bold text-foreground mt-1">
                                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                {totalChange >= 0 ? (
                                    <Badge className="bg-success/20 text-success border-success/30 gap-1">
                                        <TrendingUp className="w-3 h-3" />
                                        +{totalChange}% today
                                    </Badge>
                                ) : (
                                    <Badge className="bg-destructive/20 text-destructive border-destructive/30 gap-1">
                                        <TrendingDown className="w-3 h-3" />
                                        {totalChange}% today
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <PieChart className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-foreground">Allocation</h3>
                    </div>
                    <div className="space-y-2">
                        {holdings.slice(0, 3).map((holding) => (
                            <div key={holding.symbol} className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{holding.symbol}</span>
                                <span className="font-medium text-foreground">{holding.allocation}%</span>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>

            {/* Holdings */}
            <GlassCard className="p-5">
                <h3 className="text-lg font-semibold text-foreground mb-4">Holdings</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-sm text-muted-foreground border-b border-border/50">
                                <th className="pb-3 font-medium">Asset</th>
                                <th className="pb-3 font-medium">Amount</th>
                                <th className="pb-3 font-medium">Value</th>
                                <th className="pb-3 font-medium">24h Change</th>
                                <th className="pb-3 font-medium">Allocation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {holdings.map((holding) => (
                                <tr key={holding.symbol} className="border-b border-border/30 last:border-0">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                                {holding.symbol.slice(0, 2)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">{holding.symbol}</p>
                                                <p className="text-xs text-muted-foreground">{holding.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-foreground">{holding.amount}</td>
                                    <td className="py-4 font-medium text-foreground">
                                        ${holding.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-4">
                                        <span className={holding.change >= 0 ? 'text-success' : 'text-destructive'}>
                                            {holding.change >= 0 ? '+' : ''}{holding.change}%
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full"
                                                    style={{ width: `${holding.allocation}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-muted-foreground">{holding.allocation}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            {/* Recent Trades */}
            <GlassCard className="p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Recent Trades</h3>
                </div>
                <div className="space-y-3">
                    {recentTrades.map((trade, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${trade.type === 'buy' ? 'bg-success/20' : 'bg-destructive/20'
                                    }`}>
                                    {trade.type === 'buy' ? (
                                        <ArrowUpRight className="w-4 h-4 text-success" />
                                    ) : (
                                        <ArrowDownRight className="w-4 h-4 text-destructive" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">
                                        {trade.type === 'buy' ? 'Bought' : 'Sold'} {trade.amount} {trade.symbol}
                                    </p>
                                    <p className="text-xs text-muted-foreground">@ ${trade.price.toLocaleString()}</p>
                                </div>
                            </div>
                            <span className="text-sm text-muted-foreground">{trade.time}</span>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    )
}
