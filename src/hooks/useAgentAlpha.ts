import { useState, useEffect, useCallback } from 'react'

interface TechnicalIndicators {
  rsi: number
  bollinger_upper: number
  bollinger_middle: number
  bollinger_lower: number
  current_price: number
  price_position: 'UPPER' | 'MIDDLE' | 'LOWER'
}

interface Analysis {
  signal: 'BUY_CALL' | 'BUY_PUT' | 'CLOSE_POSITION' | 'HOLD'
  confidence: number
  win_rate: number
  reasoning: string
  timestamp: number
}

interface UseAgentAlphaProps {
  symbol: string
  interval: string
  refreshInterval?: number
  autoRefresh?: boolean
}

interface UseAgentAlphaReturn {
  analysis: Analysis | null
  indicators: TechnicalIndicators | null
  isLoading: boolean
  isConnected: boolean
  error: string | null
  lastUpdate: Date | null
  refresh: () => void
}

// Mock Agent Alpha Client (will be replaced with real implementation)
class AgentAlphaClient {
  private baseUrl = 'http://localhost:8000'

  async getAnalysis(symbol: string, interval: string): Promise<Analysis> {
    try {
      const params = new URLSearchParams({ symbol, interval })
      const response = await fetch(`${this.baseUrl}/analyze?${params}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch analysis: ${response.statusText}`)
      }
      return response.json()
    } catch (error) {
      // Return mock data when service is not available
      return {
        signal: 'HOLD',
        confidence: 0,
        win_rate: 0,
        reasoning: 'Agent Alpha service not available - using mock data',
        timestamp: Date.now()
      }
    }
  }

  async getCandles(symbol: string, interval: string, limit: number = 100): Promise<TechnicalIndicators> {
    try {
      const params = new URLSearchParams({ 
        symbol, 
        interval, 
        limit: limit.toString() 
      })
      const response = await fetch(`${this.baseUrl}/candles?${params}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch candles: ${response.statusText}`)
      }
      return response.json()
    } catch (error) {
      // Return mock data when service is not available
      const mockPrice = 3200 + Math.random() * 200 - 100 // ETH price around $3200
      return {
        rsi: 45 + Math.random() * 20, // RSI between 45-65
        bollinger_upper: mockPrice + 150,
        bollinger_middle: mockPrice,
        bollinger_lower: mockPrice - 150,
        current_price: mockPrice,
        price_position: 'MIDDLE'
      }
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })
      return response.ok
    } catch (error) {
      return false
    }
  }
}

const agentAlpha = new AgentAlphaClient()

export function useAgentAlpha({
  symbol,
  interval,
  refreshInterval = 60000,
  autoRefresh = false
}: UseAgentAlphaProps): UseAgentAlphaReturn {
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [indicators, setIndicators] = useState<TechnicalIndicators | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const checkConnection = useCallback(async () => {
    const connected = await agentAlpha.checkHealth()
    setIsConnected(connected)
    return connected
  }, [])

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Check connection first
      await checkConnection()

      // Fetch both analysis and indicators
      const [analysisData, indicatorsData] = await Promise.all([
        agentAlpha.getAnalysis(symbol, interval),
        agentAlpha.getCandles(symbol, interval, 100)
      ])

      setAnalysis(analysisData)
      setIndicators(indicatorsData)
      setLastUpdate(new Date())
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Failed to fetch Agent Alpha data:', err)
    } finally {
      setIsLoading(false)
    }
  }, [symbol, interval, checkConnection])

  const refresh = useCallback(() => {
    fetchData()
  }, [fetchData])

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

  // Connection check interval
  useEffect(() => {
    const connectionCheckInterval = setInterval(checkConnection, 30000) // Check every 30 seconds
    return () => clearInterval(connectionCheckInterval)
  }, [checkConnection])

  return {
    analysis,
    indicators,
    isLoading,
    isConnected,
    error,
    lastUpdate,
    refresh
  }
}

// Utility functions for styling
export function getSignalColor(signal: string): string {
  switch (signal) {
    case 'BUY_CALL':
      return 'text-green-400'
    case 'BUY_PUT':
      return 'text-red-400'
    case 'CLOSE_POSITION':
      return 'text-yellow-400'
    default:
      return 'text-gray-400'
  }
}

export function getSignalBgColor(signal: string): string {
  switch (signal) {
    case 'BUY_CALL':
      return 'border-green-500/50 bg-green-500/10'
    case 'BUY_PUT':
      return 'border-red-500/50 bg-red-500/10'
    case 'CLOSE_POSITION':
      return 'border-yellow-500/50 bg-yellow-500/10'
    default:
      return 'border-gray-500/50 bg-gray-500/10'
  }
}

export function getRSIColor(rsi: number): string {
  if (rsi < 30) return 'text-green-400' // Oversold - potential buy
  if (rsi > 70) return 'text-red-400'   // Overbought - potential sell
  return 'text-yellow-400'              // Neutral
}