'use client';

/**
 * React Hook for Agent Alpha Market Analysis
 * Provides real-time market data and trading signals
 */

import { useState, useEffect, useCallback } from 'react';
import {
    agentAlpha,
    AnalysisResponse,
    IndicatorsData,
    CandlestickData
} from '@/agents/agent-alpha';

interface UseAgentAlphaOptions {
    symbol?: string;
    interval?: string;
    refreshInterval?: number; // in milliseconds
    autoRefresh?: boolean;
}

interface AgentAlphaState {
    analysis: AnalysisResponse | null;
    indicators: IndicatorsData | null;
    candles: CandlestickData[];
    isLoading: boolean;
    error: string | null;
    isConnected: boolean;
    lastUpdate: Date | null;
}

interface AgentAlphaActions {
    refresh: () => Promise<void>;
    fetchCandles: (limit?: number) => Promise<void>;
}

export function useAgentAlpha(options: UseAgentAlphaOptions = {}): AgentAlphaState & AgentAlphaActions {
    const {
        symbol = 'ETH/USDT',
        interval = '1h',
        refreshInterval = 60000, // 1 minute default
        autoRefresh = true,
    } = options;

    const [state, setState] = useState<AgentAlphaState>({
        analysis: null,
        indicators: null,
        candles: [],
        isLoading: false,
        error: null,
        isConnected: false,
        lastUpdate: null,
    });

    // Fetch full analysis
    const fetchAnalysis = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const analysis = await agentAlpha.analyzeMarket(symbol, interval);
            setState(prev => ({
                ...prev,
                analysis,
                indicators: analysis.indicators,
                isLoading: false,
                isConnected: true,
                lastUpdate: new Date(),
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                isConnected: false,
                error: error instanceof Error ? error.message : 'Failed to fetch analysis',
            }));
        }
    }, [symbol, interval]);

    // Fetch candlestick data
    const fetchCandles = useCallback(async (limit: number = 100) => {
        try {
            const response = await agentAlpha.getCandles(symbol, interval, limit);
            setState(prev => ({
                ...prev,
                candles: response.candles,
            }));
        } catch (error) {
            console.error('Failed to fetch candles:', error);
        }
    }, [symbol, interval]);

    // Check connection on mount
    useEffect(() => {
        const checkConnection = async () => {
            try {
                await agentAlpha.checkHealth();
                setState(prev => ({ ...prev, isConnected: true }));
            } catch {
                setState(prev => ({ ...prev, isConnected: false }));
            }
        };

        checkConnection();
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchAnalysis();
        fetchCandles();
    }, [fetchAnalysis, fetchCandles]);

    // Auto-refresh
    useEffect(() => {
        if (!autoRefresh) return;

        const intervalId = setInterval(() => {
            fetchAnalysis();
        }, refreshInterval);

        return () => clearInterval(intervalId);
    }, [autoRefresh, refreshInterval, fetchAnalysis]);

    return {
        ...state,
        refresh: fetchAnalysis,
        fetchCandles,
    };
}

// Signal color utilities
export function getSignalColor(signal: string): string {
    switch (signal) {
        case 'BUY_CALL':
            return 'text-green-500';
        case 'BUY_PUT':
            return 'text-red-500';
        case 'HOLD':
            return 'text-yellow-500';
        case 'CLOSE_POSITION':
            return 'text-orange-500';
        default:
            return 'text-muted-foreground';
    }
}

export function getSignalBgColor(signal: string): string {
    switch (signal) {
        case 'BUY_CALL':
            return 'bg-green-500/20 border-green-500/50';
        case 'BUY_PUT':
            return 'bg-red-500/20 border-red-500/50';
        case 'HOLD':
            return 'bg-yellow-500/20 border-yellow-500/50';
        case 'CLOSE_POSITION':
            return 'bg-orange-500/20 border-orange-500/50';
        default:
            return 'bg-muted';
    }
}

export function getRSIColor(rsi: number): string {
    if (rsi < 30) return 'text-green-500';
    if (rsi > 70) return 'text-red-500';
    return 'text-yellow-500';
}
