/**
 * useAgentGamma Hook
 * React hook for Agent Gamma social engagement integration
 */

'use client'

import { useState, useCallback, useEffect } from 'react'
import { agentGamma, type SocialPost, type TradeEventData } from '@/agents/agent-gamma'
import { type AgentMessage } from '@/types'

// ============ Types ============

interface UseAgentGammaState {
    isWatching: boolean
    lastPost: SocialPost | null
    postHistory: SocialPost[]
    messages: AgentMessage[]
    error: string | null
}

interface UseAgentGammaActions {
    startWatching: () => void
    stopWatching: () => void
    manualPost: (content: string) => Promise<SocialPost | null>
    refreshMessages: () => void
    clearError: () => void
}

// ============ Hook ============

export function useAgentGamma(): UseAgentGammaState & UseAgentGammaActions {
    const [state, setState] = useState<UseAgentGammaState>({
        isWatching: false,
        lastPost: null,
        postHistory: [],
        messages: [],
        error: null
    })

    const [unwatch, setUnwatch] = useState<(() => void) | null>(null)

    // Refresh messages periodically
    useEffect(() => {
        const refresh = () => {
            const messages = agentGamma.getRecentMessages(50)
            const postHistory = agentGamma.getPostHistory()
            setState(prev => ({ ...prev, messages, postHistory }))
        }

        refresh()
        const interval = setInterval(refresh, 5000)
        return () => clearInterval(interval)
    }, [])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (unwatch) {
                unwatch()
            }
        }
    }, [unwatch])

    /**
     * Start watching for trade events
     */
    const startWatching = useCallback(async () => {
        if (state.isWatching) return

        try {
            const stopFn = await agentGamma.watchTradeEvents(async (event: TradeEventData) => {
                // Handle the trade event - post to social
                const post = await agentGamma.handleTradeEvent(event)
                if (post) {
                    setState(prev => ({
                        ...prev,
                        lastPost: post,
                        postHistory: [...prev.postHistory, post],
                        messages: agentGamma.getRecentMessages(50)
                    }))
                }
            })

            setUnwatch(() => stopFn)
            setState(prev => ({ ...prev, isWatching: true, error: null }))
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: `Failed to start watching: ${(error as Error).message}`
            }))
        }
    }, [state.isWatching])

    /**
     * Stop watching for trade events
     */
    const stopWatching = useCallback(() => {
        if (unwatch) {
            unwatch()
            setUnwatch(null)
        }
        setState(prev => ({ ...prev, isWatching: false }))
    }, [unwatch])

    /**
     * Manually post to social media
     */
    const manualPost = useCallback(async (content: string): Promise<SocialPost | null> => {
        try {
            const post = await agentGamma.postToFarcaster(content)
            setState(prev => ({
                ...prev,
                lastPost: post,
                postHistory: [...prev.postHistory, post],
                messages: agentGamma.getRecentMessages(50)
            }))
            return post
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: `Post failed: ${(error as Error).message}`
            }))
            return null
        }
    }, [])

    /**
     * Refresh messages
     */
    const refreshMessages = useCallback(() => {
        const messages = agentGamma.getRecentMessages(50)
        const postHistory = agentGamma.getPostHistory()
        setState(prev => ({ ...prev, messages, postHistory }))
    }, [])

    /**
     * Clear error
     */
    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }))
    }, [])

    return {
        ...state,
        startWatching,
        stopWatching,
        manualPost,
        refreshMessages,
        clearError
    }
}
