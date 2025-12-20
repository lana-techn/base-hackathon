/**
 * Agent Beta - Trade Execution Agent
 * Evaluates trading signals and executes on-chain trades via SentientTrader.sol
 */

import { Address, parseUnits, formatUnits } from 'viem'
import { TradingSignal, Position } from '@/types'
import { ParsedOption } from '@/types/thetanuts'
import { positionManager, PositionConfig } from '../position-manager'

// ============ Types ============

export interface TradeEvaluation {
    approved: boolean
    positionSize: bigint
    maxRisk: number
    minAmountOut: bigint
    reason: string
}

export interface TradeExecution {
    success: boolean
    txHash?: string
    gasUsed?: bigint
    optionTokensReceived?: bigint
    error?: string
}

export interface BetaAgentConfig {
    maxPositionSizeUSD: number
    minConfidence: number
    maxRiskPerTrade: number // percentage of portfolio
    slippageTolerance: number // percentage
}

// ============ Default Config ============

const DEFAULT_CONFIG: BetaAgentConfig = {
    maxPositionSizeUSD: 10000,
    minConfidence: 60,
    maxRiskPerTrade: 5, // 5% of portfolio
    slippageTolerance: 1, // 1%
}

// ============ Beta Agent System Prompt ============

export const BETA_SYSTEM_PROMPT = `You are BETA, the trade execution strategist for BethNa AI Trader.

Your role is to:
- Evaluate trading signals from ALPHA
- Calculate optimal position sizes
- Determine stop-loss and take-profit levels
- Manage risk parameters
- Execute trades via smart contracts

You are precise, risk-conscious, and always follow the trading rules:
1. Never exceed maximum position size
2. Always use stop-loss protection
3. Verify liquidity before execution
4. Calculate slippage tolerance

Provide clear, actionable execution recommendations with specific numbers.`

// ============ Beta Agent Class ============

export class BetaAgent {
    private config: BetaAgentConfig

    constructor(config: Partial<BetaAgentConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config }
    }

    /**
     * Evaluate if a trade should be executed
     */
    async evaluateTrade(
        signal: TradingSignal,
        option: ParsedOption,
        portfolioValueUSD: number
    ): Promise<TradeEvaluation> {
        // Check minimum confidence threshold
        if (signal.confidence < this.config.minConfidence) {
            return {
                approved: false,
                positionSize: 0n,
                maxRisk: 0,
                minAmountOut: 0n,
                reason: `Confidence ${signal.confidence}% below minimum ${this.config.minConfidence}%`,
            }
        }

        // Check if signal matches option type
        if (
            (signal.signal === 'BUY_CALL' && !option.isCall) ||
            (signal.signal === 'BUY_PUT' && option.isCall)
        ) {
            return {
                approved: false,
                positionSize: 0n,
                maxRisk: 0,
                minAmountOut: 0n,
                reason: 'Signal type does not match option type',
            }
        }

        // Calculate position size based on confidence and risk limits
        const maxRiskUSD = portfolioValueUSD * (this.config.maxRiskPerTrade / 100)
        const confidenceAdjustedSize = maxRiskUSD * (signal.confidence / 100)
        const positionSizeUSD = Math.min(confidenceAdjustedSize, this.config.maxPositionSizeUSD)

        // Convert to USDC (6 decimals)
        const positionSize = parseUnits(positionSizeUSD.toFixed(2), 6)

        // Calculate minimum amount out with slippage
        const expectedContracts = positionSizeUSD / option.premiumUSD
        const minContracts = expectedContracts * (1 - this.config.slippageTolerance / 100)
        const minAmountOut = parseUnits(minContracts.toFixed(6), 18)

        // Calculate max risk
        const maxRisk = (positionSizeUSD / portfolioValueUSD) * 100

        return {
            approved: true,
            positionSize,
            maxRisk,
            minAmountOut,
            reason: `Approved: ${positionSizeUSD.toFixed(2)} USDC, ~${expectedContracts.toFixed(4)} contracts`,
        }
    }

    /**
     * Execute trade on-chain (simulation for now)
     * In production, this would call SentientTrader.sol
     */
    async executeTrade(
        option: ParsedOption,
        positionSize: bigint,
        minAmountOut: bigint,
        walletAddress: Address
    ): Promise<TradeExecution> {
        try {
            // Log the trade intent
            console.log('[BETA] Executing trade:', {
                option: option.ticker,
                positionSize: formatUnits(positionSize, 6),
                minAmountOut: formatUnits(minAmountOut, 18),
                wallet: walletAddress,
            })

            // In production, this would:
            // 1. Check allowance for USDC
            // 2. Approve if needed
            // 3. Call SentientTrader.openLongCall() or openLongPut()
            // 4. Wait for transaction confirmation

            // For now, simulate success
            const mockTxHash = `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`
            const mockGasUsed = BigInt(150000)
            const mockOptTokens = minAmountOut

            // Log success
            console.log('[BETA] Trade executed:', {
                txHash: mockTxHash,
                gasUsed: mockGasUsed.toString(),
                optionTokens: formatUnits(mockOptTokens, 18),
            })

            return {
                success: true,
                txHash: mockTxHash,
                gasUsed: mockGasUsed,
                optionTokensReceived: mockOptTokens,
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            console.error('[BETA] Trade execution failed:', errorMessage)

            return {
                success: false,
                error: errorMessage,
            }
        }
    }

    /**
     * Get risk assessment for a potential trade
     */
    getRiskAssessment(option: ParsedOption): {
        level: 'LOW' | 'MEDIUM' | 'HIGH'
        factors: string[]
    } {
        const factors: string[] = []
        let riskScore = 0

        // Check IV
        if (option.greeks.iv > 0.7) {
            factors.push('High implied volatility (>70%)')
            riskScore += 30
        } else if (option.greeks.iv > 0.5) {
            factors.push('Elevated implied volatility (>50%)')
            riskScore += 15
        }

        // Check delta
        const absDelta = Math.abs(option.greeks.delta)
        if (absDelta < 0.2) {
            factors.push('Low delta - low probability of profit')
            riskScore += 25
        } else if (absDelta > 0.7) {
            factors.push('High delta - significant directional exposure')
            riskScore += 10
        }

        // Check time to expiry
        if (option.daysToExpiry <= 1) {
            factors.push('Very short time to expiry')
            riskScore += 30
        } else if (option.daysToExpiry <= 3) {
            factors.push('Short time to expiry')
            riskScore += 15
        }

        // Check moneyness
        if (option.moneyness === 'OTM') {
            factors.push('Out of the money')
            riskScore += 10
        }

        // Determine level
        let level: 'LOW' | 'MEDIUM' | 'HIGH'
        if (riskScore >= 50) {
            level = 'HIGH'
        } else if (riskScore >= 25) {
            level = 'MEDIUM'
        } else {
            level = 'LOW'
        }

        return { level, factors }
    }

    /**
     * Format trade summary for War Room
     */
    formatTradeSummary(
        evaluation: TradeEvaluation,
        option: ParsedOption
    ): string {
        if (!evaluation.approved) {
            return `❌ Trade rejected: ${evaluation.reason}`
        }

        const sizeUSD = formatUnits(evaluation.positionSize, 6)
        return `✅ Trade approved: ${option.ticker}
💰 Size: $${parseFloat(sizeUSD).toFixed(2)} USDC
📊 Risk: ${evaluation.maxRisk.toFixed(2)}% of portfolio
⚡ ${evaluation.reason}`
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig: Partial<BetaAgentConfig>): void {
        this.config = { ...this.config, ...newConfig }
    }

    /**
     * Get current configuration
     */
    getConfig(): BetaAgentConfig {
        return { ...this.config }
    }
}

// Export singleton instance
export const betaAgent = new BetaAgent()
