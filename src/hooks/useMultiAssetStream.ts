import { useState, useEffect, useCallback, useRef } from 'react'
import { wsManager, WebSocketConnection } from '@/services/websocket-manager'

export interface AssetPrice {
  symbol: string
  price: number
  change24h: number
  changePercent24h: number
  volume24h: number
  high24h: number
  low24h: number
  timestamp: number
}

export interface MultiAssetStreamConfig {
  symbols: string[]
  exchange?: 'binance' | 'coinbase' | 'kraken'
  updateInterval?: number
  autoReconnect?: boolean
}

export interface UseMultiAssetStreamReturn {
  prices: Record<string, AssetPrice>
  isConnected: boolean
  connectionStatus: Record<string, boolean>
  error: string | null
  subscribe: (symbol: string) => void
  unsubscribe: (symbol: string) => void
  reconnect: () => void
}

export function useMultiAssetStream({
  symbols = [],
  exchange = 'binance'
}: MultiAssetStreamConfig): UseMultiAssetStreamReturn {
  const [prices, setPrices] = useState<Record<string, AssetPrice>>({})
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)
  
  const connectionsRef = useRef<Map<string, WebSocketConnection>>(new Map())
  const subscribedSymbolsRef = useRef<Set<string>>(new Set())

  const getWebSocketUrl = useCallback((exchange: string, symbol: string): string => {
    switch (exchange) {
      case 'binance':
        return `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`
      case 'coinbase':
        return `wss://ws-feed.exchange.coinbase.com`
      case 'kraken':
        return `wss://ws.kraken.com`
      default:
        return `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`
    }
  }, [])

  const parseMessage = useCallback((symbol: string, data: Record<string, unknown>, exchange: string): AssetPrice | null => {
    try {
      switch (exchange) {
        case 'binance':
          return {
            symbol: (data.s as string) || symbol,
            price: parseFloat((data.c as string) || '0'),
            change24h: parseFloat((data.P as string) || '0'),
            changePercent24h: parseFloat((data.P as string) || '0'),
            volume24h: parseFloat((data.v as string) || '0'),
            high24h: parseFloat((data.h as string) || '0'),
            low24h: parseFloat((data.l as string) || '0'),
            timestamp: parseInt((data.E as string) || Date.now().toString())
          }
        case 'coinbase':
          if (data.type === 'ticker') {
            const price = parseFloat((data.price as string) || '0')
            const open24h = parseFloat((data.open_24h as string) || '0')
            return {
              symbol: (data.product_id as string) || symbol,
              price,
              change24h: open24h - price,
              changePercent24h: open24h > 0 ? ((price - open24h) / open24h) * 100 : 0,
              volume24h: parseFloat((data.volume_24h as string) || '0'),
              high24h: parseFloat((data.high_24h as string) || '0'),
              low24h: parseFloat((data.low_24h as string) || '0'),
              timestamp: new Date((data.time as string) || Date.now()).getTime()
            }
          }
          return null
        default:
          return null
      }
    } catch (error) {
      console.error('Failed to parse price message:', error)
      return null
    }
  }, [])

  const subscribe = useCallback((symbol: string) => {
    if (subscribedSymbolsRef.current.has(symbol)) {
      return // Already subscribed
    }

    const connectionId = `${exchange}-${symbol}`
    const wsUrl = getWebSocketUrl(exchange, symbol)

    try {
      const connection = wsManager.createConnection(connectionId, {
        url: wsUrl,
        reconnectDelay: 1000,
        maxReconnectAttempts: 5,
        heartbeatInterval: 30000
      })

      // Handle price updates
      connection.subscribe('message', (data) => {
        const priceData = parseMessage(symbol, data, exchange)
        if (priceData) {
          setPrices(prev => ({
            ...prev,
            [symbol]: priceData
          }))
        }
      })

      // Handle connection status
      connection.onStatusChange((status) => {
        setConnectionStatus(prev => ({
          ...prev,
          [symbol]: status === 'connected'
        }))

        if (status === 'error') {
          setError(`Connection error for ${symbol}`)
        } else if (status === 'connected') {
          setError(null)
        }
      })

      // Connect and store reference
      connection.connect().then(() => {
        connectionsRef.current.set(symbol, connection)
        subscribedSymbolsRef.current.add(symbol)

        // Send subscription message for exchanges that require it
        if (exchange === 'coinbase') {
          connection.send({
            type: 'subscribe',
            product_ids: [symbol],
            channels: ['ticker']
          })
        }
      }).catch(error => {
        console.error(`Failed to connect to ${symbol}:`, error)
        setError(`Failed to connect to ${symbol}: ${error.message}`)
      })

    } catch (error) {
      console.error(`Failed to create connection for ${symbol}:`, error)
      setError(`Failed to create connection for ${symbol}`)
    }
  }, [exchange, getWebSocketUrl, parseMessage])

  const unsubscribe = useCallback((symbol: string) => {
    const connection = connectionsRef.current.get(symbol)
    if (connection) {
      connection.disconnect()
      connectionsRef.current.delete(symbol)
      subscribedSymbolsRef.current.delete(symbol)
      wsManager.removeConnection(`${exchange}-${symbol}`)

      // Remove from prices and status
      setPrices(prev => {
        const newPrices = { ...prev }
        delete newPrices[symbol]
        return newPrices
      })

      setConnectionStatus(prev => {
        const newStatus = { ...prev }
        delete newStatus[symbol]
        return newStatus
      })
    }
  }, [exchange])

  const reconnect = useCallback(() => {
    // Reconnect all subscribed symbols
    const symbolsToReconnect = Array.from(subscribedSymbolsRef.current)
    
    // Disconnect all first
    symbolsToReconnect.forEach(symbol => {
      const connection = connectionsRef.current.get(symbol)
      if (connection) {
        connection.disconnect()
      }
    })

    // Clear references
    connectionsRef.current.clear()
    subscribedSymbolsRef.current.clear()

    // Reconnect after a short delay
    setTimeout(() => {
      symbolsToReconnect.forEach(symbol => subscribe(symbol))
    }, 1000)
  }, [subscribe])

  // Subscribe to initial symbols
  useEffect(() => {
    symbols.forEach(symbol => subscribe(symbol))

    return () => {
      // Cleanup on unmount
      Array.from(subscribedSymbolsRef.current).forEach(symbol => unsubscribe(symbol))
    }
  }, [symbols, subscribe, unsubscribe])

  // Update overall connection status
  const updateConnectionStatus = useCallback(() => {
    const connectedCount = Object.values(connectionStatus).filter(Boolean).length
    const totalCount = Object.keys(connectionStatus).length
    setIsConnected(totalCount > 0 && connectedCount === totalCount)
  }, [connectionStatus])

  useEffect(() => {
    updateConnectionStatus()
  }, [updateConnectionStatus])

  return {
    prices,
    isConnected,
    connectionStatus,
    error,
    subscribe,
    unsubscribe,
    reconnect
  }
}

// Utility hook for specific asset pairs
export function useAssetPair(baseAsset: string, quoteAsset: string = 'USDT') {
  const symbol = `${baseAsset}${quoteAsset}`
  const { prices, isConnected, error } = useMultiAssetStream({
    symbols: [symbol]
  })

  return {
    price: prices[symbol]?.price || 0,
    priceData: prices[symbol],
    isConnected,
    error
  }
}

// Hook for watchlist streaming
export function useWatchlistStream(watchlist: string[]) {
  const {
    prices,
    isConnected,
    connectionStatus,
    error,
    subscribe,
    unsubscribe
  } = useMultiAssetStream({
    symbols: watchlist,
    exchange: 'binance'
  })

  const addToWatchlist = useCallback((symbol: string) => {
    subscribe(symbol)
  }, [subscribe])

  const removeFromWatchlist = useCallback((symbol: string) => {
    unsubscribe(symbol)
  }, [unsubscribe])

  return {
    prices,
    isConnected,
    connectionStatus,
    error,
    addToWatchlist,
    removeFromWatchlist
  }
}