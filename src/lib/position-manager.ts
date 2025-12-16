/**
 * Position Manager for Agent Beta
 * Tracks open positions, calculates PnL, and monitors take-profit/stop-loss
 */

import { Address } from 'viem'
import { Position, TradeEvent, TradingSignal } from '@/types'

// ============ Types ============

export interface PositionConfig {
    takeProfitPercentage: number // e.g., 10 for 10%
    stopLossPercentage: number   // e.g., 5 for 5%
    maxPositionSize: bigint      // Maximum USDC per position
    slippageTolerance: number    // e.g., 1 for 1%
}

export interface LiquidityInfo {
    available: bigint
    sufficient: boolean
    minimumRequired: bigint
}

export interface PnLSummary {
    totalPnL: number
    totalPnLPercentage: number
    realizedPnL: number
    unrealizedPnL: number
    winCount: number
    lossCount: number
    winRate: number
}

// ============ Default Configuration ============

const DEFAULT_CONFIG: PositionConfig = {
    takeProfitPercentage: 10,
    stopLossPercentage: 5,
    maxPositionSize: BigInt(10000 * 1e6), // 10,000 USDC
    slippageTolerance: 1
}

// ============ Position Manager Class ============

export class PositionManager {
    private positions: Map<string, Position> = new Map()
    private config: PositionConfig
    private tradeHistory: TradeEvent[] = []

    constructor(config: Partial<PositionConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config }
    }

    // ============ Position Tracking ============

    /**
     * Record a new position from a trade event
     */
    addPosition(tradeEvent: TradeEvent, optionType: 'CALL' | 'PUT'): Position {
        const position: Position = {
            id: `${tradeEvent.txHash}-${Date.now()}`,
            optionToken: tradeEvent.optionToken,
            optionType,
            strike: 0, // Will be set from Thetanuts API
            expiry: 0,
            entryPrice: Number(tradeEvent.amountIn) / 1e6, // Assuming USDC (6 decimals)
            currentPrice: Number(tradeEvent.amountOut) / 1e18, // Assuming 18 decimals for option token
            quantity: Number(tradeEvent.amountOut) / 1e18,
            pnl: 0,
            pnlPercentage: 0,
            status: 'OPEN',
            openedAt: tradeEvent.timestamp
        }

        this.positions.set(position.id, position)
        this.tradeHistory.push(tradeEvent)

        return position
    }

    /**
     * Close a position
     */
    closePosition(positionId: string, closePrice: number, tradeEvent: TradeEvent): Position | null {
        const position = this.positions.get(positionId)
        if (!position) return null

        position.currentPrice = closePrice
        position.pnl = (closePrice - position.entryPrice) * position.quantity
        position.pnlPercentage = ((closePrice - position.entryPrice) / position.entryPrice) * 100
        position.status = 'CLOSED'
        position.closedAt = tradeEvent.timestamp

        this.tradeHistory.push(tradeEvent)

        return position
    }

    /**
     * Update position with current market price
     */
    updatePositionPrice(positionId: string, currentPrice: number): Position | null {
        const position = this.positions.get(positionId)
        if (!position || position.status === 'CLOSED') return null

        position.currentPrice = currentPrice
        position.pnl = (currentPrice - position.entryPrice) * position.quantity
        position.pnlPercentage = ((currentPrice - position.entryPrice) / position.entryPrice) * 100

        return position
    }

    /**
     * Get all open positions
     */
    getOpenPositions(): Position[] {
        return Array.from(this.positions.values()).filter(p => p.status === 'OPEN')
    }

    /**
     * Get position by ID
     */
    getPosition(positionId: string): Position | undefined {
        return this.positions.get(positionId)
    }

    /**
     * Get all positions (including closed)
     */
    getAllPositions(): Position[] {
        return Array.from(this.positions.values())
    }

    // ============ Take Profit / Stop Loss ============

    /**
     * Check if position should be closed due to take-profit
     */
    shouldTakeProfit(position: Position): boolean {
        if (position.status !== 'OPEN') return false
        return position.pnlPercentage >= this.config.takeProfitPercentage
    }

    /**
     * Check if position should be closed due to stop-loss
     */
    shouldStopLoss(position: Position): boolean {
        if (position.status !== 'OPEN') return false
        return position.pnlPercentage <= -this.config.stopLossPercentage
    }

    /**
     * Get positions that need automatic closing
     */
    getPositionsToClose(): { position: Position; reason: 'TAKE_PROFIT' | 'STOP_LOSS' }[] {
        const result: { position: Position; reason: 'TAKE_PROFIT' | 'STOP_LOSS' }[] = []

        for (const position of this.getOpenPositions()) {
            if (this.shouldTakeProfit(position)) {
                result.push({ position, reason: 'TAKE_PROFIT' })
            } else if (this.shouldStopLoss(position)) {
                result.push({ position, reason: 'STOP_LOSS' })
            }
        }

        return result
    }

    // ============ Position Sizing ============

    /**
     * Calculate position size based on signal confidence and available capital
     */
    calculatePositionSize(
        signal: TradingSignal,
        availableCapital: bigint
    ): bigint {
        // Higher confidence = larger position (up to max)
        const confidenceMultiplier = signal.confidence / 100
        const baseSize = (availableCapital * BigInt(Math.floor(confidenceMultiplier * 50))) / 100n

        // Cap at max position size
        return baseSize > this.config.maxPositionSize
            ? this.config.maxPositionSize
            : baseSize
    }

    /**
     * Calculate minimum amount out with slippage
     */
    calculateMinAmountOut(expectedAmount: bigint): bigint {
        const slippageFactor = 100 - this.config.slippageTolerance
        return (expectedAmount * BigInt(slippageFactor)) / 100n
    }

    // ============ PnL Calculations ============

    /**
     * Get overall PnL summary
     */
    getPnLSummary(): PnLSummary {
        const positions = this.getAllPositions()

        let realizedPnL = 0
        let unrealizedPnL = 0
        let winCount = 0
        let lossCount = 0

        for (const position of positions) {
            if (position.status === 'CLOSED') {
                realizedPnL += position.pnl
                if (position.pnl > 0) winCount++
                else if (position.pnl < 0) lossCount++
            } else {
                unrealizedPnL += position.pnl
            }
        }

        const totalPnL = realizedPnL + unrealizedPnL
        const totalTrades = winCount + lossCount
        const winRate = totalTrades > 0 ? (winCount / totalTrades) * 100 : 0

        // Calculate percentage based on total invested
        const totalInvested = positions.reduce((sum, p) => sum + p.entryPrice * p.quantity, 0)
        const totalPnLPercentage = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0

        return {
            totalPnL,
            totalPnLPercentage,
            realizedPnL,
            unrealizedPnL,
            winCount,
            lossCount,
            winRate
        }
    }

    // ============ Liquidity Checking ============

    /**
     * Check if there's sufficient liquidity for a trade
     * This is a placeholder - actual implementation would query Thetanuts API
     */
    async checkLiquidity(
        optionToken: Address,
        amount: bigint
    ): Promise<LiquidityInfo> {
        // Placeholder - in production, query Thetanuts API
        // For now, assume liquidity is available
        const minimumRequired = amount
        const available = amount * 10n // Assume 10x liquidity available

        return {
            available,
            sufficient: available >= minimumRequired,
            minimumRequired
        }
    }

    // ============ Trade History ============

    /**
     * Get trade history
     */
    getTradeHistory(): TradeEvent[] {
        return [...this.tradeHistory]
    }

    /**
     * Get recent trades
     */
    getRecentTrades(count: number = 10): TradeEvent[] {
        return this.tradeHistory.slice(-count)
    }

    // ============ Configuration ============

    /**
     * Update configuration
     */
    updateConfig(newConfig: Partial<PositionConfig>): void {
        this.config = { ...this.config, ...newConfig }
    }

    /**
     * Get current configuration
     */
    getConfig(): PositionConfig {
        return { ...this.config }
    }
}

// Export singleton instance
export const positionManager = new PositionManager()
