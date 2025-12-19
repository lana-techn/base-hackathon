'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, X } from "lucide-react"

interface Position {
    id: string
    optionToken: string
    optionType: 'CALL' | 'PUT'
    strike: number
    entryPrice: number
    currentPrice: number
    quantity: number
    pnl: number
    pnlPercentage: number
    status: 'OPEN' | 'CLOSED'
    openedAt: number
}

interface ActivePositionsPanelProps {
    positions: Position[]
    onClosePosition?: (positionId: string) => void
    isLoading?: boolean
}

export function ActivePositionsPanel({
    positions,
    onClosePosition,
    isLoading = false
}: ActivePositionsPanelProps) {
    const openPositions = positions.filter(p => p.status === 'OPEN')

    // Calculate totals
    const totalPnL = openPositions.reduce((sum, p) => sum + p.pnl, 0)
    const totalValue = openPositions.reduce((sum, p) => sum + (p.currentPrice * p.quantity), 0)

    const formatPnL = (pnl: number, percentage: number) => {
        const sign = pnl >= 0 ? '+' : ''
        return `${sign}$${Math.abs(pnl).toFixed(2)} (${sign}${percentage.toFixed(1)}%)`
    }

    const getPnLColor = (pnl: number) => {
        if (pnl > 0) return 'text-success'
        if (pnl < 0) return 'text-error'
        return 'text-muted-foreground'
    }

    return (
        <Card className="min-h-[300px]">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                    <span>Active Positions</span>
                    {openPositions.length > 0 && (
                        <Badge variant="outline" className={getPnLColor(totalPnL)}>
                            {formatPnL(totalPnL, totalValue > 0 ? (totalPnL / totalValue) * 100 : 0)}
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                    </div>
                ) : openPositions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <p className="text-sm">No active positions</p>
                        <p className="text-xs mt-1">Signals with 60%+ confidence will enable trading</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {openPositions.map((position) => (
                            <div
                                key={position.id}
                                className="p-3 rounded-lg bg-background/50 border border-border/50 hover:border-border transition-colors"
                            >
                                {/* Position Header */}
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        {position.optionType === 'CALL' ? (
                                            <TrendingUp className="h-4 w-4 text-success" />
                                        ) : (
                                            <TrendingDown className="h-4 w-4 text-error" />
                                        )}
                                        <span className="font-medium">
                                            ETH ${position.strike} {position.optionType}
                                        </span>
                                    </div>
                                    {onClosePosition && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 hover:bg-red-500/20"
                                            onClick={() => onClosePosition(position.id)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>

                                {/* Position Details */}
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div>
                                        <span className="text-muted-foreground">Entry</span>
                                        <div className="font-mono">${position.entryPrice.toFixed(2)}</div>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Mark</span>
                                        <div className="font-mono">${position.currentPrice.toFixed(2)}</div>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">PnL</span>
                                        <div className={`font-mono font-bold ${getPnLColor(position.pnl)}`}>
                                            {position.pnlPercentage >= 0 ? '+' : ''}{position.pnlPercentage.toFixed(1)}%
                                        </div>
                                    </div>
                                </div>

                                {/* Quantity */}
                                <div className="mt-2 text-xs text-muted-foreground">
                                    Qty: {position.quantity.toFixed(4)} | Value: ${(position.currentPrice * position.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}

                        {/* Summary Footer */}
                        {openPositions.length > 1 && (
                            <div className="pt-2 border-t border-border/50 flex justify-between text-sm">
                                <span className="text-muted-foreground">{openPositions.length} positions</span>
                                <span className={`font-bold ${getPnLColor(totalPnL)}`}>
                                    Total: {formatPnL(totalPnL, totalValue > 0 ? (totalPnL / totalValue) * 100 : 0)}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
