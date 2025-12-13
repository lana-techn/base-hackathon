/**
 * React hook for AI agent interactions
 */

'use client'

import { useState, useCallback } from 'react'

type AgentType = 'ALPHA' | 'BETA' | 'GAMMA'

interface ChatMessage {
    role: 'system' | 'user' | 'assistant'
    content: string
}

interface MarketData {
    symbol: string
    price: number
    high24h: number
    low24h: number
    volume24h: number
    change24h: number
    changePercent24h: number
}

interface AnalysisResult {
    analysis: string
    signal: 'BUY_CALL' | 'BUY_PUT' | 'HOLD' | 'CLOSE_POSITION'
    confidence: number
    reasoning: string
}

interface UseAIAgentReturn {
    isLoading: boolean
    error: string | null
    chat: (message: string, agent?: AgentType) => Promise<string>
    analyzeMarket: (marketData: MarketData) => Promise<AnalysisResult | null>
    generatePost: (marketData?: MarketData) => Promise<string>
    clearError: () => void
}

export function useAIAgent(): UseAIAgentReturn {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const chat = useCallback(async (message: string, agent: AgentType = 'ALPHA'): Promise<string> => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    agent,
                    action: 'chat',
                }),
            })

            const data = await response.json()

            if (!data.success) {
                throw new Error(data.error || 'Failed to get AI response')
            }

            return data.data.message
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error'
            setError(errorMessage)
            return ''
        } finally {
            setIsLoading(false)
        }
    }, [])

    const analyzeMarket = useCallback(async (marketData: MarketData): Promise<AnalysisResult | null> => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: '',
                    action: 'analyze',
                    marketData,
                }),
            })

            const data = await response.json()

            if (!data.success) {
                throw new Error(data.error || 'Failed to analyze market')
            }

            return data.data as AnalysisResult
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error'
            setError(errorMessage)
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    const generatePost = useCallback(async (marketData?: MarketData): Promise<string> => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: '',
                    action: 'post',
                    marketData,
                }),
            })

            const data = await response.json()

            if (!data.success) {
                throw new Error(data.error || 'Failed to generate post')
            }

            return data.data.post
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error'
            setError(errorMessage)
            return ''
        } finally {
            setIsLoading(false)
        }
    }, [])

    const clearError = useCallback(() => {
        setError(null)
    }, [])

    return {
        isLoading,
        error,
        chat,
        analyzeMarket,
        generatePost,
        clearError,
    }
}
