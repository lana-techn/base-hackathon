'use client'

/**
 * useThetanuts Hook
 * React hook for fetching and managing Thetanuts options data
 */

import { useState, useEffect, useCallback } from 'react'
import {
    OptionsChain,
    ParsedOption,
    UseThetanutsReturn,
} from '@/types/thetanuts'
import {
    getOptionsChain,
    filterByExpiry,
    getBestOptions as getBestOptionsUtil,
} from '@/lib/thetanuts-api'

interface UseThetanutsOptions {
    asset?: 'ETH' | 'BTC'
    refreshInterval?: number // in milliseconds
    autoRefresh?: boolean
}

export function useThetanuts({
    asset = 'ETH',
    refreshInterval = 30000, // 30 seconds default
    autoRefresh = true,
}: UseThetanutsOptions = {}): UseThetanutsReturn {
    const [optionsChain, setOptionsChain] = useState<OptionsChain | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

    const fetchData = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const data = await getOptionsChain(asset)
            setOptionsChain(data)
            setLastUpdated(new Date())
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch options data'
            setError(errorMessage)
            console.error('Thetanuts API error:', err)
        } finally {
            setIsLoading(false)
        }
    }, [asset])

    const refresh = useCallback(() => {
        fetchData()
    }, [fetchData])

    // Get options filtered by expiry
    const getOptionsByExpiry = useCallback(
        (expiry: Date): { calls: ParsedOption[]; puts: ParsedOption[] } => {
            if (!optionsChain) {
                return { calls: [], puts: [] }
            }

            return {
                calls: filterByExpiry(optionsChain.calls, expiry),
                puts: filterByExpiry(optionsChain.puts, expiry),
            }
        },
        [optionsChain]
    )

    // Get best options based on scoring
    const getBestOptions = useCallback(
        (type: 'CALL' | 'PUT', count: number = 3): ParsedOption[] => {
            if (!optionsChain) return []

            const options = type === 'CALL' ? optionsChain.calls : optionsChain.puts
            return getBestOptionsUtil(options, type, count)
        },
        [optionsChain]
    )

    // Initial fetch
    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Auto refresh
    useEffect(() => {
        if (!autoRefresh || refreshInterval <= 0) return

        const intervalId = setInterval(fetchData, refreshInterval)
        return () => clearInterval(intervalId)
    }, [autoRefresh, refreshInterval, fetchData])

    return {
        optionsChain,
        isLoading,
        error,
        lastUpdated,
        refresh,
        getOptionsByExpiry,
        getBestOptions,
    }
}

// ============ Additional Utility Hooks ============

/**
 * Hook for getting just the current market prices
 */
export function useThetanutsPrice(asset: 'ETH' | 'BTC' = 'ETH') {
    const { optionsChain, isLoading, error } = useThetanuts({
        asset,
        refreshInterval: 10000 // More frequent for price
    })

    return {
        price: optionsChain?.currentPrice ?? null,
        isLoading,
        error,
    }
}

/**
 * Hook for getting AI-recommended options
 */
export function useThetanutsRecommendations(
    signal: 'BUY_CALL' | 'BUY_PUT' | 'HOLD',
    asset: 'ETH' | 'BTC' = 'ETH'
) {
    const { optionsChain, isLoading, error, getBestOptions } = useThetanuts({ asset })

    const recommendations = signal === 'HOLD'
        ? []
        : getBestOptions(signal === 'BUY_CALL' ? 'CALL' : 'PUT', 3)

    return {
        recommendations,
        currentPrice: optionsChain?.currentPrice ?? null,
        isLoading,
        error,
    }
}
