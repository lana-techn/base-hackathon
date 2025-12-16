/**
 * useAgentBeta Hook
 * React hook for Agent Beta trade execution integration
 */

'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { type Address } from 'viem'
import { agentBeta, type TradeExecutionResult, type AgentBetaConfig } from '@/agents/agent-beta'
import { agentAlpha, type AnalysisResponse } from '@/agents/agent-alpha'
import { type Position, type AgentMessage } from '@/types'
import { type PnLSummary } from '@/lib/position-manager'

// ============ Types ============

interface UseAgentBetaState {
    isLoading: boolean
    error: string | null
    lastSignal: AnalysisResponse | null
    lastTradeResult: TradeExecutionResult | null
    positions: Position[]
    pnlSummary: PnLSummary | null
    messages: AgentMessage[]
}

interface UseAgentBetaActions {
    fetchSignal: (symbol?: string) => Promise<AnalysisResponse | null>
    executeTrade: (optionToken: Address, amount: bigint) => Promise<TradeExecutionResult | null>
    closePosition: (positionId: string) => Promise<TradeExecutionResult | null>
    runTradingCycle: (optionToken: Address, symbol?: string) => Promise<TradeExecutionResult | null>
    refreshPositions: () => void
    clearError: () => void
}

// ============ Hook ============

export function useAgentBeta(): UseAgentBetaState & UseAgentBetaActions {
    const { address, isConnected } = useAccount()
    const chainId = useChainId()

    const [state, setState] = useState<UseAgentBetaState>({
        isLoading: false,
        error: null,
        lastSignal: null,
        lastTradeResult: null,
        positions: [],
        pnlSummary: null,
        messages: []
    })

    // Update agent config based on chain
    useEffect(() => {
        const isTestnet = chainId === 84532
        agentBeta.updateConfig({ isTestnet })
    }, [chainId])

    // Refresh positions periodically
    useEffect(() => {
        const refreshPositions = () => {
            const positions = agentBeta.getOpenPositions()
            const pnlSummary = agentBeta.getPnLSummary()
            const messages = agentBeta.getRecentMessages(50)

            setState(prev => ({ ...prev, positions, pnlSummary, messages }))
        }

        refreshPositions()
        const interval = setInterval(refreshPositions, 5000) // Refresh every 5s

        return () => clearInterval(interval)
    }, [])

    /**
     * Fetch signal from Agent Alpha
     */
    const fetchSignal = useCallback(async (symbol: string = 'ETH/USDT') => {
        setState(prev => ({ ...prev, isLoading: true, error: null }))

        try {
            const signal = await agentBeta.getSignal(symbol)
            setState(prev => ({
                ...prev,
                isLoading: false,
                lastSignal: signal,
                messages: agentBeta.getRecentMessages(50)
            }))
            return signal
        } catch (error) {
            const errorMessage = (error as Error).message
            setState(prev => ({ ...prev, isLoading: false, error: errorMessage }))
            return null
        }
    }, [])

    /**
     * Execute a trade
     */
    const executeTrade = useCallback(async (
        optionToken: Address,
        amount: bigint
    ) => {
        if (!isConnected) {
            setState(prev => ({ ...prev, error: 'Wallet not connected' }))
            return null
        }

        if (!state.lastSignal) {
            setState(prev => ({ ...prev, error: 'No signal available. Fetch signal first.' }))
            return null
        }

        setState(prev => ({ ...prev, isLoading: true, error: null }))

        try {
            const result = await agentBeta.executeTrade(state.lastSignal, optionToken, amount)

            setState(prev => ({
                ...prev,
                isLoading: false,
                lastTradeResult: result,
                positions: agentBeta.getOpenPositions(),
                pnlSummary: agentBeta.getPnLSummary(),
                messages: agentBeta.getRecentMessages(50),
                error: result.success ? null : result.error || null
            }))

            return result
        } catch (error) {
            const errorMessage = (error as Error).message
            setState(prev => ({ ...prev, isLoading: false, error: errorMessage }))
            return null
        }
    }, [isConnected, state.lastSignal])

    /**
     * Close a position
     */
    const closePosition = useCallback(async (positionId: string) => {
        if (!isConnected) {
            setState(prev => ({ ...prev, error: 'Wallet not connected' }))
            return null
        }

        setState(prev => ({ ...prev, isLoading: true, error: null }))

        try {
            const result = await agentBeta.closePosition(positionId)

            setState(prev => ({
                ...prev,
                isLoading: false,
                lastTradeResult: result,
                positions: agentBeta.getOpenPositions(),
                pnlSummary: agentBeta.getPnLSummary(),
                messages: agentBeta.getRecentMessages(50),
                error: result.success ? null : result.error || null
            }))

            return result
        } catch (error) {
            const errorMessage = (error as Error).message
            setState(prev => ({ ...prev, isLoading: false, error: errorMessage }))
            return null
        }
    }, [isConnected])

    /**
     * Run a complete trading cycle
     */
    const runTradingCycle = useCallback(async (
        optionToken: Address,
        symbol: string = 'ETH/USDT'
    ) => {
        if (!isConnected) {
            setState(prev => ({ ...prev, error: 'Wallet not connected' }))
            return null
        }

        setState(prev => ({ ...prev, isLoading: true, error: null }))

        try {
            const result = await agentBeta.runTradingCycle(symbol, optionToken)

            setState(prev => ({
                ...prev,
                isLoading: false,
                lastTradeResult: result,
                positions: agentBeta.getOpenPositions(),
                pnlSummary: agentBeta.getPnLSummary(),
                messages: agentBeta.getRecentMessages(50)
            }))

            return result
        } catch (error) {
            const errorMessage = (error as Error).message
            setState(prev => ({ ...prev, isLoading: false, error: errorMessage }))
            return null
        }
    }, [isConnected])

    /**
     * Refresh positions manually
     */
    const refreshPositions = useCallback(() => {
        const positions = agentBeta.getOpenPositions()
        const pnlSummary = agentBeta.getPnLSummary()
        const messages = agentBeta.getRecentMessages(50)

        setState(prev => ({ ...prev, positions, pnlSummary, messages }))
    }, [])

    /**
     * Clear error
     */
    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }))
    }, [])

    return {
        ...state,
        fetchSignal,
        executeTrade,
        closePosition,
        runTradingCycle,
        refreshPositions,
        clearError
    }
}
