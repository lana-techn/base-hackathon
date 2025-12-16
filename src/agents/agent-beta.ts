/**
 * Agent Beta - Trade Execution Engine
 * Interprets Agent Alpha signals and executes trades via SentientTrader contract
 */

import {
    type Address,
    type Hash,
    encodeFunctionData,
    parseUnits
} from 'viem'
import { agentAlpha, type AnalysisResponse } from './agent-alpha'
import {
    createBasePublicClient,
    createBaseWalletClient,
    executeTransaction,
    checkBalance,
    type TransactionResult
} from '@/lib/blockchain'
import {
    PositionManager,
    positionManager,
    type PositionConfig
} from '@/lib/position-manager'
import { sentientTraderABI, getContractConfig } from '@/config/contracts'
import {
    type TradingSignal,
    type TradeEvent,
    type AgentMessage,
    type Position
} from '@/types'

// ============ Types ============

export interface AgentBetaConfig {
    isTestnet: boolean
    privateKey?: `0x${string}`
    confidenceThreshold: number // Minimum confidence to execute trade
    autoExecute: boolean // Whether to auto-execute based on signals
    positionConfig: Partial<PositionConfig>
}

export interface TradeExecutionResult {
    success: boolean
    transaction?: TransactionResult
    position?: Position
    error?: string
    message: AgentMessage
}

// ============ Default Configuration ============

const DEFAULT_CONFIG: AgentBetaConfig = {
    isTestnet: true,
    confidenceThreshold: 60,
    autoExecute: false,
    positionConfig: {
        takeProfitPercentage: 10,
        stopLossPercentage: 5
    }
}

// ============ Agent Beta Class ============

export class AgentBeta {
    private config: AgentBetaConfig
    private positionManager: PositionManager
    private messageLog: AgentMessage[] = []

    constructor(config: Partial<AgentBetaConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config }
        this.positionManager = new PositionManager(this.config.positionConfig)
    }

    // ============ Signal Interpretation ============

    /**
     * Get and interpret signal from Agent Alpha
     */
    async getSignal(symbol: string = 'ETH/USDT'): Promise<AnalysisResponse> {
        const analysis = await agentAlpha.analyzeMarket(symbol)

        this.log('SIGNAL', `Received signal: ${analysis.signal} (${analysis.confidence}% confidence)`)

        return analysis
    }

    /**
     * Check if signal meets execution criteria
     */
    shouldExecuteSignal(signal: AnalysisResponse): boolean {
        // Must have actionable signal
        if (signal.signal === 'HOLD') {
            this.log('INFO', 'Signal is HOLD - no action needed')
            return false
        }

        // Must meet confidence threshold
        if (signal.confidence < this.config.confidenceThreshold) {
            this.log('INFO', `Confidence ${signal.confidence}% below threshold ${this.config.confidenceThreshold}%`)
            return false
        }

        return true
    }

    // ============ Trade Execution ============

    /**
     * Execute a trade based on signal
     */
    async executeTrade(
        signal: AnalysisResponse,
        optionToken: Address,
        amount: bigint
    ): Promise<TradeExecutionResult> {
        if (!this.config.privateKey) {
            return this.createErrorResult('Private key not configured')
        }

        try {
            this.log('EXECUTION', `Preparing ${signal.signal} trade for ${amount} USDC`)

            // Create clients
            const publicClient = createBasePublicClient(this.config.isTestnet)
            const walletClient = createBaseWalletClient(this.config.privateKey, this.config.isTestnet)

            // Get contract config
            const chainId = this.config.isTestnet ? 84532 : 8453
            const contractConfig = getContractConfig(chainId)

            // Check liquidity
            const liquidityInfo = await this.positionManager.checkLiquidity(optionToken, amount)
            if (!liquidityInfo.sufficient) {
                return this.createErrorResult('Insufficient liquidity')
            }

            // Calculate minimum amount out with slippage
            const minAmountOut = this.positionManager.calculateMinAmountOut(amount)

            // Encode function data based on signal
            let functionData: `0x${string}`
            let action: TradeEvent['action']

            if (signal.signal === 'BUY_CALL') {
                functionData = encodeFunctionData({
                    abi: sentientTraderABI,
                    functionName: 'openLongCall',
                    args: [amount, optionToken]
                })
                action = 'OPEN_LONG_CALL'
            } else if (signal.signal === 'BUY_PUT') {
                functionData = encodeFunctionData({
                    abi: sentientTraderABI,
                    functionName: 'openLongPut',
                    args: [amount, optionToken]
                })
                action = 'OPEN_LONG_PUT'
            } else if (signal.signal === 'CLOSE_POSITION') {
                functionData = encodeFunctionData({
                    abi: sentientTraderABI,
                    functionName: 'closePosition',
                    args: [optionToken, amount]
                })
                action = 'CLOSE_POSITION'
            } else {
                return this.createErrorResult('Invalid signal for trade execution')
            }

            // Check wallet balance for gas
            const account = walletClient.account
            if (!account) {
                return this.createErrorResult('No wallet account available')
            }

            const hasBalance = await checkBalance(publicClient, account.address, parseUnits('0.001', 18))
            if (!hasBalance) {
                return this.createErrorResult('Insufficient ETH for gas')
            }

            // Execute transaction
            this.log('EXECUTION', `Executing transaction on ${this.config.isTestnet ? 'Base Sepolia' : 'Base Mainnet'}`)

            const txResult = await executeTransaction(
                publicClient,
                walletClient,
                contractConfig.sentientTrader,
                functionData
            )

            if (!txResult.success) {
                return this.createErrorResult('Transaction failed', txResult)
            }

            // Record trade event
            const tradeEvent: TradeEvent = {
                txHash: txResult.hash,
                blockNumber: Number(txResult.receipt.blockNumber),
                timestamp: Date.now(),
                action,
                optionToken,
                amountIn: amount,
                amountOut: 0n, // Would parse from logs in production
                gasUsed: txResult.gasUsed,
                success: true
            }

            // Add position if opening
            let position: Position | undefined
            if (action !== 'CLOSE_POSITION') {
                position = this.positionManager.addPosition(
                    tradeEvent,
                    action === 'OPEN_LONG_CALL' ? 'CALL' : 'PUT'
                )
            }

            this.log('EXECUTION', `Trade executed successfully: ${txResult.hash}`)

            return {
                success: true,
                transaction: txResult,
                position,
                message: this.createMessage('EXECUTION', `Trade executed: ${action}`)
            }

        } catch (error) {
            const errorMessage = (error as Error).message
            this.log('ERROR', `Trade execution failed: ${errorMessage}`)
            return this.createErrorResult(errorMessage)
        }
    }

    /**
     * Close a position by ID
     */
    async closePosition(positionId: string): Promise<TradeExecutionResult> {
        const position = this.positionManager.getPosition(positionId)
        if (!position) {
            return this.createErrorResult('Position not found')
        }

        if (position.status === 'CLOSED') {
            return this.createErrorResult('Position already closed')
        }

        // Create close signal
        const closeSignal: AnalysisResponse = {
            signal: 'CLOSE_POSITION',
            confidence: 100,
            win_rate: 0,
            reasoning: 'Manual close request',
            indicators: {
                rsi: 0,
                bollinger_upper: 0,
                bollinger_middle: 0,
                bollinger_lower: 0,
                current_price: position.currentPrice,
                price_position: 'MIDDLE'
            },
            timestamp: new Date().toISOString()
        }

        return this.executeTrade(
            closeSignal,
            position.optionToken,
            BigInt(Math.floor(position.quantity * 1e18))
        )
    }

    // ============ Auto-Trading ============

    /**
     * Run automated trading cycle
     */
    async runTradingCycle(
        symbol: string = 'ETH/USDT',
        optionToken: Address
    ): Promise<TradeExecutionResult | null> {
        // Get signal from Alpha
        const signal = await this.getSignal(symbol)

        // Check if should execute
        if (!this.shouldExecuteSignal(signal)) {
            return null
        }

        // Calculate position size
        // In production, would get available capital from contract
        const availableCapital = parseUnits('1000', 6) // 1000 USDC for now
        const tradingSignal: TradingSignal = {
            signal: signal.signal,
            confidence: signal.confidence,
            winRate: signal.win_rate,
            reasoning: signal.reasoning,
            timestamp: Date.now(),
            metadata: {
                rsi: signal.indicators.rsi,
                bollingerPosition: signal.indicators.price_position,
                priceLevel: signal.indicators.current_price
            }
        }
        const positionSize = this.positionManager.calculatePositionSize(tradingSignal, availableCapital)

        // Execute trade
        return this.executeTrade(signal, optionToken, positionSize)
    }

    /**
     * Monitor and auto-close positions
     */
    async monitorPositions(): Promise<TradeExecutionResult[]> {
        const results: TradeExecutionResult[] = []
        const positionsToClose = this.positionManager.getPositionsToClose()

        for (const { position, reason } of positionsToClose) {
            this.log('INFO', `Auto-closing position ${position.id} due to ${reason}`)
            const result = await this.closePosition(position.id)
            results.push(result)
        }

        return results
    }

    // ============ Position & Data Access ============

    /**
     * Get all open positions
     */
    getOpenPositions(): Position[] {
        return this.positionManager.getOpenPositions()
    }

    /**
     * Get PnL summary
     */
    getPnLSummary() {
        return this.positionManager.getPnLSummary()
    }

    /**
     * Get message log
     */
    getMessageLog(): AgentMessage[] {
        return [...this.messageLog]
    }

    /**
     * Get recent messages
     */
    getRecentMessages(count: number = 20): AgentMessage[] {
        return this.messageLog.slice(-count)
    }

    // ============ Helper Methods ============

    private log(type: AgentMessage['type'], content: string): void {
        const message = this.createMessage(type, content)
        this.messageLog.push(message)
        console.log(`[Agent Beta] ${type}: ${content}`)
    }

    private createMessage(type: AgentMessage['type'], content: string): AgentMessage {
        return {
            agent: 'BETA',
            message: content,
            timestamp: Date.now(),
            type
        }
    }

    private createErrorResult(error: string, transaction?: TransactionResult): TradeExecutionResult {
        return {
            success: false,
            error,
            transaction,
            message: this.createMessage('ERROR', error)
        }
    }

    // ============ Configuration ============

    updateConfig(newConfig: Partial<AgentBetaConfig>): void {
        this.config = { ...this.config, ...newConfig }
        if (newConfig.positionConfig) {
            this.positionManager.updateConfig(newConfig.positionConfig)
        }
    }

    getConfig(): AgentBetaConfig {
        return { ...this.config }
    }
}

// Export singleton instance
export const agentBeta = new AgentBeta()

// Export class for custom instances
export { AgentBeta as AgentBetaClass }
