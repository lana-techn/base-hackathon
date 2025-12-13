/**
 * React hook for Farcaster integration
 */

'use client'

import { useState, useCallback } from 'react'

interface TradeData {
    action: string
    symbol: string
    price: number
    pnl?: number
    pnlPercent?: number
    txHash?: string
}

interface MarketData {
    symbol: string
    price: number
    changePercent24h: number
}

interface PostResult {
    success: boolean
    hash?: string
    author?: {
        fid: number
        username: string
        displayName: string
    }
    text?: string
    error?: string
}

interface UseFarcasterReturn {
    isLoading: boolean
    error: string | null
    lastPost: PostResult | null
    postText: (text: string, channelId?: string) => Promise<PostResult>
    postTrade: (trade: TradeData, channelId?: string) => Promise<PostResult>
    postMarketUpdate: (market: MarketData, channelId?: string) => Promise<PostResult>
    clearError: () => void
}

export function useFarcaster(): UseFarcasterReturn {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [lastPost, setLastPost] = useState<PostResult | null>(null)

    const postText = useCallback(async (text: string, channelId?: string): Promise<PostResult> => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/farcaster/post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, channelId }),
            })

            const data = await response.json()

            if (!data.success) {
                throw new Error(data.error || 'Failed to post to Farcaster')
            }

            setLastPost(data.data)
            return data.data
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error'
            setError(errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setIsLoading(false)
        }
    }, [])

    const postTrade = useCallback(async (trade: TradeData, channelId?: string): Promise<PostResult> => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/farcaster/post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    generateFromTrade: trade,
                    channelId,
                }),
            })

            const data = await response.json()

            if (!data.success) {
                throw new Error(data.error || 'Failed to post trade to Farcaster')
            }

            setLastPost(data.data)
            return data.data
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error'
            setError(errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setIsLoading(false)
        }
    }, [])

    const postMarketUpdate = useCallback(async (market: MarketData, channelId?: string): Promise<PostResult> => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/farcaster/post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    generateFromMarket: market,
                    channelId,
                }),
            })

            const data = await response.json()

            if (!data.success) {
                throw new Error(data.error || 'Failed to post market update to Farcaster')
            }

            setLastPost(data.data)
            return data.data
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error'
            setError(errorMessage)
            return { success: false, error: errorMessage }
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
        lastPost,
        postText,
        postTrade,
        postMarketUpdate,
        clearError,
    }
}
