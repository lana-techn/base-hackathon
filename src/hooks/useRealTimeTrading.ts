import { useState, useEffect, useCallback } from 'react'
import { useMultiAssetStream } from './useMultiAssetStream'
import { usePositionTracking } from './usePositionTracking'
import { useRealTimeAlerts } from './useRealTimeAlerts'
import { useBackfilledData } from '../services/data-backfill'
import { thetanutsService } from '../services/thetanuts-realtime'
import { wsManager } from '../services/websocket-manager'
import { WEBSOCKET_CONFIG, ALERT_CONFIG } from '@/utils/constants'

export interface RealTimeTradingConfig {
  symbols: string[]
  enablePositionTracking: boolean
  enableAlerts: boolean
  enableOptionsData: boolean
  enableMultiAssetStream: boolean
}

export interface UseRealTimeTradingReturn {
  // Price data
  prices: Record<string, any>
  priceConnections: Record<string, boolean>

  // Position tracking
  positions: any[]
  positionsLoading: boolean

  // Alerts
  alerts: any[]
  notifications: any[]
  unreadCount: number

  // Options data
  optionsChain: any

  // Connection status
  isConnected: boolean
  connectionHealth: Record<string, boolean>

  // Controls
  addSymbol: (symbol: string) => void
  removeSymbol: (symbol: string) => void
  reconnectAll: () => void

  // Alert controls
  addPriceAlert: (alert: any) => void
  markAlertAsRead: (id: string) => void
}

export function useRealTimeTrading(
  config: RealTimeTradingConfig
): UseRealTimeTradingReturn {
  const [isInitialized, setIsInitialized] = useState(false)
  const [connectionHealth, setConnectionHealth] = useState<Record<string, boolean>>({})

  // Multi-asset price streaming
  const {
    prices,
    isConnected: pricesConnected,
    connectionStatus: priceConnections,
    subscribe: subscribePrice,
    unsubscribe: unsubscribePrice,
    reconnect: reconnectPrices
  } = useMultiAssetStream({
    symbols: config.enableMultiAssetStream ? config.symbols : [],
    exchange: 'coinbase',
    autoReconnect: true
  })

  // Position tracking
  const {
    positions,
    isLoading: positionsLoading,
    error: positionsError,
    refreshPositions
  } = usePositionTracking()

  // Real-time alerts
  const {
    priceAlerts: alerts,
    notifications,
    unreadCount,
    addPriceAlert,
    markAlertAsRead,
    markAllAsRead,
    clearNotifications
  } = useRealTimeAlerts()

  // Options data
  const [optionsChain, setOptionsChain] = useState<any>(null)

  // Initialize services
  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Initialize Thetanuts service if options enabled
        if (config.enableOptionsData) {
          await thetanutsService.connect()

          // Subscribe to ETH options chain
          thetanutsService.subscribeToOptionsChain('ETH', (chain) => {
            setOptionsChain(chain)
          })
        }

        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize real-time services:', error)
      }
    }

    initializeServices()

    return () => {
      // Cleanup on unmount
      thetanutsService.disconnect()
      wsManager.disconnectAll()
    }
  }, [config.enableOptionsData])

  // Monitor connection health
  useEffect(() => {
    const checkHealth = () => {
      const health: Record<string, boolean> = {
        prices: pricesConnected,
        positions: !positionsError,
        thetanuts: thetanutsService ? true : false, // Simplified check
        websockets: Object.values(priceConnections).some(Boolean)
      }

      setConnectionHealth(health)
    }

    const healthInterval = setInterval(checkHealth, 5000)
    checkHealth() // Initial check

    return () => clearInterval(healthInterval)
  }, [pricesConnected, positionsError, priceConnections])

  // Price alert integration
  useEffect(() => {
    if (!config.enableAlerts) return

    Object.entries(prices).forEach(([symbol, priceData]) => {
      if (priceData?.price && typeof window !== 'undefined') {
        // Trigger price alert checks
        const event = new CustomEvent('bethna-price-update', {
          detail: {
            symbol,
            price: priceData.price,
            timestamp: Date.now()
          }
        })
        window.dispatchEvent(event)
      }
    })
  }, [prices, config.enableAlerts])

  // Control functions
  const addSymbol = useCallback((symbol: string) => {
    if (config.enableMultiAssetStream) {
      subscribePrice(symbol)
    }
  }, [subscribePrice, config.enableMultiAssetStream])

  const removeSymbol = useCallback((symbol: string) => {
    if (config.enableMultiAssetStream) {
      unsubscribePrice(symbol)
    }
  }, [unsubscribePrice, config.enableMultiAssetStream])

  const reconnectAll = useCallback(() => {
    // Reconnect price streams
    if (config.enableMultiAssetStream) {
      reconnectPrices()
    }

    // Reconnect Thetanuts
    if (config.enableOptionsData) {
      thetanutsService.disconnect()
      setTimeout(() => {
        thetanutsService.connect().catch(console.error)
      }, 1000)
    }

    // Refresh positions
    if (config.enablePositionTracking) {
      refreshPositions()
    }
  }, [
    config.enableMultiAssetStream,
    config.enableOptionsData,
    config.enablePositionTracking,
    reconnectPrices,
    refreshPositions
  ])

  // Overall connection status
  const isConnected = Object.values(connectionHealth).some(Boolean)

  return {
    // Price data
    prices,
    priceConnections,

    // Position tracking
    positions: config.enablePositionTracking ? positions : [],
    positionsLoading: config.enablePositionTracking ? positionsLoading : false,

    // Alerts
    alerts: config.enableAlerts ? alerts : [],
    notifications: config.enableAlerts ? notifications : [],
    unreadCount: config.enableAlerts ? unreadCount : 0,

    // Options data
    optionsChain: config.enableOptionsData ? optionsChain : null,

    // Connection status
    isConnected,
    connectionHealth,

    // Controls
    addSymbol,
    removeSymbol,
    reconnectAll,

    // Alert controls
    addPriceAlert: config.enableAlerts ? addPriceAlert : () => { },
    markAlertAsRead: config.enableAlerts ? markAlertAsRead : () => { }
  }
}

// Preset configurations for different use cases
export const TRADING_CONFIGS = {
  FULL_FEATURED: {
    symbols: ['ETHUSDT', 'BTCUSDT', 'SOLUSDT'] as string[],
    enablePositionTracking: true,
    enableAlerts: true,
    enableOptionsData: true,
    enableMultiAssetStream: true
  },

  PRICE_ONLY: {
    symbols: ['ETHUSDT', 'BTCUSDT'] as string[],
    enablePositionTracking: false,
    enableAlerts: false,
    enableOptionsData: false,
    enableMultiAssetStream: true
  },

  ALERTS_FOCUSED: {
    symbols: ['ETHUSDT'] as string[],
    enablePositionTracking: false,
    enableAlerts: true,
    enableOptionsData: false,
    enableMultiAssetStream: true
  },

  OPTIONS_TRADER: {
    symbols: ['ETHUSDT', 'BTCUSDT'] as string[],
    enablePositionTracking: true,
    enableAlerts: true,
    enableOptionsData: true,
    enableMultiAssetStream: true
  }
} as const

// Convenience hooks for specific use cases
export function useFullRealTimeTrading() {
  return useRealTimeTrading(TRADING_CONFIGS.FULL_FEATURED)
}

export function usePriceStreamOnly(symbols: string[]) {
  return useRealTimeTrading({
    ...TRADING_CONFIGS.PRICE_ONLY,
    symbols
  })
}

export function useOptionsTrading() {
  return useRealTimeTrading(TRADING_CONFIGS.OPTIONS_TRADER)
}