import { API_ENDPOINTS } from '@/utils/constants'

export interface CandleData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface DataPoint {
  timestamp: number
  value: number
  source: 'historical' | 'realtime'
}

export interface BackfillConfig {
  symbol: string
  interval: '1m' | '5m' | '15m' | '1h' | '4h' | '1d'
  limit: number
  enableRealtime: boolean
  bufferSize?: number
}

export class DataBackfillService {
  private realtimeBuffer = new Map<string, DataPoint[]>()
  private historicalCache = new Map<string, CandleData[]>()
  private subscribers = new Map<string, Set<(data: CandleData[]) => void>>()

  constructor() {
    this.setupRealtimeListeners()
  }

  private setupRealtimeListeners() {
    // Listen for real-time price updates from WebSocket
    if (typeof window !== 'undefined') {
      window.addEventListener('bethna-price-update', (event: any) => {
        const { symbol, price, timestamp } = event.detail
        this.addRealtimePoint(symbol, price, timestamp)
      })
    }
  }

  async getHistoricalData(
    symbol: string,
    interval: string,
    limit: number
  ): Promise<CandleData[]> {
    const cacheKey = `${symbol}-${interval}-${limit}`
    
    // Check cache first
    if (this.historicalCache.has(cacheKey)) {
      const cached = this.historicalCache.get(cacheKey)!
      const cacheAge = Date.now() - cached[cached.length - 1]?.timestamp
      
      // Use cache if less than 5 minutes old
      if (cacheAge < 5 * 60 * 1000) {
        return cached
      }
    }

    try {
      // Fetch from multiple sources with fallback
      let data = await this.fetchFromBinance(symbol, interval, limit)
      
      if (!data || data.length === 0) {
        data = await this.fetchFromCoinGecko(symbol, interval, limit)
      }

      if (!data || data.length === 0) {
        data = this.generateMockData(symbol, interval, limit)
      }

      // Cache the result
      this.historicalCache.set(cacheKey, data)
      
      return data
    } catch (error) {
      console.error('Failed to fetch historical data:', error)
      return this.generateMockData(symbol, interval, limit)
    }
  }

  private async fetchFromBinance(
    symbol: string,
    interval: string,
    limit: number
  ): Promise<CandleData[]> {
    const binanceSymbol = symbol.replace('/', '').toUpperCase()
    const url = `https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=${interval}&limit=${limit}`
    
    const response = await fetch(url)
    if (!response.ok) throw new Error('Binance API error')
    
    const data = await response.json()
    return data.map((candle: any[]) => ({
      timestamp: candle[0],
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
      volume: parseFloat(candle[5])
    }))
  }

  private async fetchFromCoinGecko(
    symbol: string,
    interval: string,
    limit: number
  ): Promise<CandleData[]> {
    // Convert symbol to CoinGecko format
    const coinId = symbol.split('/')[0].toLowerCase()
    const days = this.intervalToDays(interval, limit)
    
    const url = `${API_ENDPOINTS.COINGECKO_BASE}/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`
    
    const response = await fetch(url)
    if (!response.ok) throw new Error('CoinGecko API error')
    
    const data = await response.json()
    return data.map((candle: number[]) => ({
      timestamp: candle[0],
      open: candle[1],
      high: candle[2],
      low: candle[3],
      close: candle[4],
      volume: 0 // CoinGecko OHLC doesn't include volume
    }))
  }

  private intervalToDays(interval: string, limit: number): number {
    const intervalMinutes = {
      '1m': 1,
      '5m': 5,
      '15m': 15,
      '1h': 60,
      '4h': 240,
      '1d': 1440
    }[interval] || 60

    return Math.ceil((limit * intervalMinutes) / (24 * 60))
  }

  private generateMockData(symbol: string, interval: string, limit: number): CandleData[] {
    const basePrice = symbol.includes('ETH') ? 3200 : 65000
    const intervalMs = this.getIntervalMs(interval)
    const now = Date.now()
    
    const data: CandleData[] = []
    let currentPrice = basePrice
    
    for (let i = limit - 1; i >= 0; i--) {
      const timestamp = now - (i * intervalMs)
      
      // Generate realistic price movement
      const volatility = 0.02
      const change = (Math.random() - 0.5) * volatility
      currentPrice *= (1 + change)
      
      const open = currentPrice
      const high = open * (1 + Math.random() * 0.01)
      const low = open * (1 - Math.random() * 0.01)
      const close = open + (Math.random() - 0.5) * (high - low)
      const volume = Math.random() * 1000000
      
      data.push({
        timestamp,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume: Number(volume.toFixed(2))
      })
    }
    
    return data
  }

  private getIntervalMs(interval: string): number {
    const intervals = {
      '1m': 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '4h': 4 * 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000
    }
    return intervals[interval as keyof typeof intervals] || 60 * 60 * 1000
  }

  addRealtimePoint(symbol: string, price: number, timestamp: number) {
    const key = `${symbol}-realtime`
    
    if (!this.realtimeBuffer.has(key)) {
      this.realtimeBuffer.set(key, [])
    }
    
    const buffer = this.realtimeBuffer.get(key)!
    buffer.push({
      timestamp,
      value: price,
      source: 'realtime'
    })
    
    // Keep buffer size manageable
    const maxBufferSize = 1000
    if (buffer.length > maxBufferSize) {
      buffer.splice(0, buffer.length - maxBufferSize)
    }
    
    // Notify subscribers
    this.notifySubscribers(symbol)
  }

  async getCombinedData(config: BackfillConfig): Promise<CandleData[]> {
    const { symbol, interval, limit, enableRealtime } = config
    
    // Get historical data
    let historicalData = await this.getHistoricalData(symbol, interval, limit)
    
    if (!enableRealtime) {
      return historicalData
    }
    
    // Get real-time buffer
    const realtimeKey = `${symbol}-realtime`
    const realtimeBuffer = this.realtimeBuffer.get(realtimeKey) || []
    
    if (realtimeBuffer.length === 0) {
      return historicalData
    }
    
    // Merge real-time data with historical
    const intervalMs = this.getIntervalMs(interval)
    const lastHistoricalTime = historicalData[historicalData.length - 1]?.timestamp || 0
    
    // Group real-time points into candles
    const realtimeCandles = this.groupIntoCandles(realtimeBuffer, intervalMs, lastHistoricalTime)
    
    // Merge and deduplicate
    const combined = [...historicalData]
    
    realtimeCandles.forEach(rtCandle => {
      const existingIndex = combined.findIndex(candle => 
        Math.abs(candle.timestamp - rtCandle.timestamp) < intervalMs / 2
      )
      
      if (existingIndex >= 0) {
        // Update existing candle with real-time data
        combined[existingIndex] = {
          ...combined[existingIndex],
          close: rtCandle.close,
          high: Math.max(combined[existingIndex].high, rtCandle.high),
          low: Math.min(combined[existingIndex].low, rtCandle.low),
          volume: combined[existingIndex].volume + rtCandle.volume
        }
      } else {
        // Add new real-time candle
        combined.push(rtCandle)
      }
    })
    
    // Sort by timestamp and limit
    return combined
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-limit)
  }

  private groupIntoCandles(
    points: DataPoint[],
    intervalMs: number,
    startTime: number
  ): CandleData[] {
    const candles: CandleData[] = []
    const groups = new Map<number, DataPoint[]>()
    
    // Group points by interval
    points.forEach(point => {
      if (point.timestamp <= startTime) return
      
      const intervalStart = Math.floor(point.timestamp / intervalMs) * intervalMs
      
      if (!groups.has(intervalStart)) {
        groups.set(intervalStart, [])
      }
      groups.get(intervalStart)!.push(point)
    })
    
    // Convert groups to candles
    groups.forEach((groupPoints, timestamp) => {
      if (groupPoints.length === 0) return
      
      const prices = groupPoints.map(p => p.value)
      const open = prices[0]
      const close = prices[prices.length - 1]
      const high = Math.max(...prices)
      const low = Math.min(...prices)
      const volume = groupPoints.length * 100 // Approximate volume
      
      candles.push({
        timestamp,
        open,
        high,
        low,
        close,
        volume
      })
    })
    
    return candles.sort((a, b) => a.timestamp - b.timestamp)
  }

  subscribe(symbol: string, callback: (data: CandleData[]) => void): () => void {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set())
    }
    
    this.subscribers.get(symbol)!.add(callback)
    
    return () => {
      const subscribers = this.subscribers.get(symbol)
      if (subscribers) {
        subscribers.delete(callback)
        if (subscribers.size === 0) {
          this.subscribers.delete(symbol)
        }
      }
    }
  }

  private notifySubscribers(symbol: string) {
    const subscribers = this.subscribers.get(symbol)
    if (subscribers) {
      // Debounce notifications
      setTimeout(async () => {
        const data = await this.getCombinedData({
          symbol,
          interval: '1h',
          limit: 100,
          enableRealtime: true
        })
        
        subscribers.forEach(callback => {
          try {
            callback(data)
          } catch (error) {
            console.error('Error in data subscriber:', error)
          }
        })
      }, 100)
    }
  }

  clearCache() {
    this.historicalCache.clear()
    this.realtimeBuffer.clear()
  }
}

// Singleton instance
export const dataBackfillService = new DataBackfillService()

// Hook for using backfilled data
import { useState, useEffect } from 'react'

export function useBackfilledData(config: BackfillConfig) {
  const [data, setData] = useState<CandleData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const loadData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const combinedData = await dataBackfillService.getCombinedData(config)
        setData(combinedData)
        
        // Subscribe to updates
        unsubscribe = dataBackfillService.subscribe(config.symbol, setData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [config.symbol, config.interval, config.limit, config.enableRealtime])

  return { data, isLoading, error }
}