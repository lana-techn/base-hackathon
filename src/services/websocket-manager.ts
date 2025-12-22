import { TIME_CONSTANTS } from '@/utils/constants'

export interface WebSocketConfig {
  url: string
  protocols?: string[]
  reconnectDelay?: number
  maxReconnectAttempts?: number
  heartbeatInterval?: number
  connectionTimeout?: number
}

export interface WebSocketMessage {
  type: string
  data: any
  timestamp: number
}

export type WebSocketEventHandler = (data: any) => void
export type WebSocketStatusHandler = (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void

export class WebSocketConnection {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private reconnectTimer: NodeJS.Timeout | null = null
  private heartbeatTimer: NodeJS.Timeout | null = null
  private connectionTimer: NodeJS.Timeout | null = null
  private subscribers = new Map<string, Set<WebSocketEventHandler>>()
  private statusHandlers = new Set<WebSocketStatusHandler>()
  private isManuallyDisconnected = false

  constructor(private config: WebSocketConfig) {
    this.config = {
      reconnectDelay: TIME_CONSTANTS.WEBSOCKET_RECONNECT_DELAY,
      maxReconnectAttempts: 5,
      heartbeatInterval: 30000, // 30 seconds
      connectionTimeout: 10000, // 10 seconds
      ...config
    }
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        resolve()
        return
      }

      this.isManuallyDisconnected = false
      this.notifyStatus('connecting')

      // For demo purposes, simulate connection for certain URLs
      if (this.config.url.includes('demo') || this.config.url.includes('coingecko')) {
        setTimeout(() => {
          console.log(`✅ Mock WebSocket connected: ${this.config.url}`)
          this.reconnectAttempts = 0
          this.notifyStatus('connected')
          this.startMockDataStream()
          resolve()
        }, 1000)
        return
      }

      try {
        this.ws = new WebSocket(this.config.url, this.config.protocols)

        // Connection timeout
        this.connectionTimer = setTimeout(() => {
          if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
            this.ws.close()
            reject(new Error('Connection timeout'))
          }
        }, this.config.connectionTimeout)

        this.ws.onopen = () => {
          if (this.connectionTimer) {
            clearTimeout(this.connectionTimer)
            this.connectionTimer = null
          }

          console.log(`✅ WebSocket connected: ${this.config.url}`)
          this.reconnectAttempts = 0
          this.notifyStatus('connected')
          this.startHeartbeat()
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data)
            this.handleMessage(message)
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error, event.data)
          }
        }

        this.ws.onclose = (event) => {
          if (this.connectionTimer) {
            clearTimeout(this.connectionTimer)
            this.connectionTimer = null
          }

          this.stopHeartbeat()
          this.notifyStatus('disconnected')

          if (!this.isManuallyDisconnected) {
            console.log(`WebSocket closed: ${this.config.url} (${event.code}: ${event.reason})`)
            this.handleReconnect()
          }
        }

        this.ws.onerror = (error) => {
          console.error(`WebSocket error: ${this.config.url}`, error)
          this.notifyStatus('error')
          
          if (this.ws?.readyState === WebSocket.CONNECTING) {
            reject(error)
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  private startMockDataStream() {
    // Simulate real-time price updates for demo
    const symbols = ['ETH-USD', 'BTC-USD', 'SOL-USD']
    
    const interval = setInterval(() => {
      if (this.isManuallyDisconnected) {
        clearInterval(interval)
        return
      }

      symbols.forEach(symbol => {
        const basePrice = symbol === 'ETH-USD' ? 3200 : symbol === 'BTC-USD' ? 65000 : 100
        const mockMessage: WebSocketMessage = {
          type: 'ticker',
          data: {
            product_id: symbol,
            price: (basePrice + (Math.random() - 0.5) * basePrice * 0.02).toFixed(2),
            open_24h: (basePrice * 0.98).toFixed(2),
            volume_24h: (Math.random() * 1000000).toFixed(2),
            high_24h: (basePrice * 1.05).toFixed(2),
            low_24h: (basePrice * 0.95).toFixed(2),
            time: new Date().toISOString()
          },
          timestamp: Date.now()
        }
        this.handleMessage(mockMessage)
      })
    }, 2000) // Update every 2 seconds
  }

  private handleMessage(message: WebSocketMessage) {
    const subscribers = this.subscribers.get(message.type)
    if (subscribers) {
      subscribers.forEach(handler => {
        try {
          handler(message.data)
        } catch (error) {
          console.error('Error in WebSocket message handler:', error)
        }
      })
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts!) {
      console.error(`Max reconnection attempts reached for ${this.config.url}`)
      return
    }

    this.reconnectAttempts++
    const delay = this.config.reconnectDelay! * Math.pow(2, this.reconnectAttempts - 1)
    
    console.log(`Reconnecting to ${this.config.url} in ${delay}ms (attempt ${this.reconnectAttempts})`)
    
    this.reconnectTimer = setTimeout(() => {
      this.connect().catch(error => {
        console.error('Reconnection failed:', error)
      })
    }, delay)
  }

  private startHeartbeat() {
    if (this.config.heartbeatInterval && this.config.heartbeatInterval > 0) {
      this.heartbeatTimer = setInterval(() => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.send({ type: 'ping', timestamp: Date.now() })
        }
      }, this.config.heartbeatInterval)
    }
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  private notifyStatus(status: 'connecting' | 'connected' | 'disconnected' | 'error') {
    this.statusHandlers.forEach(handler => {
      try {
        handler(status)
      } catch (error) {
        console.error('Error in status handler:', error)
      }
    })
  }

  subscribe(eventType: string, handler: WebSocketEventHandler): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set())
    }
    this.subscribers.get(eventType)!.add(handler)

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(eventType)
      if (subscribers) {
        subscribers.delete(handler)
        if (subscribers.size === 0) {
          this.subscribers.delete(eventType)
        }
      }
    }
  }

  onStatusChange(handler: WebSocketStatusHandler): () => void {
    this.statusHandlers.add(handler)
    return () => this.statusHandlers.delete(handler)
  }

  send(data: any): boolean {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(data))
        return true
      } catch (error) {
        console.error('Failed to send WebSocket message:', error)
        return false
      }
    }
    return false
  }

  disconnect() {
    this.isManuallyDisconnected = true
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.connectionTimer) {
      clearTimeout(this.connectionTimer)
      this.connectionTimer = null
    }

    this.stopHeartbeat()

    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect')
      this.ws = null
    }

    this.subscribers.clear()
    this.statusHandlers.clear()
  }

  get readyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

export class WebSocketManager {
  private connections = new Map<string, WebSocketConnection>()

  createConnection(id: string, config: WebSocketConfig): WebSocketConnection {
    if (this.connections.has(id)) {
      throw new Error(`WebSocket connection with id '${id}' already exists`)
    }

    const connection = new WebSocketConnection(config)
    this.connections.set(id, connection)
    return connection
  }

  getConnection(id: string): WebSocketConnection | undefined {
    return this.connections.get(id)
  }

  async connectAll(): Promise<void> {
    const promises = Array.from(this.connections.values()).map(conn => 
      conn.connect().catch(error => {
        console.error('Failed to connect WebSocket:', error)
        return error
      })
    )
    
    await Promise.allSettled(promises)
  }

  disconnectAll() {
    this.connections.forEach(connection => connection.disconnect())
    this.connections.clear()
  }

  removeConnection(id: string) {
    const connection = this.connections.get(id)
    if (connection) {
      connection.disconnect()
      this.connections.delete(id)
    }
  }

  getConnectionStatus(): Record<string, boolean> {
    const status: Record<string, boolean> = {}
    this.connections.forEach((connection, id) => {
      status[id] = connection.isConnected
    })
    return status
  }
}

// Singleton instance
export const wsManager = new WebSocketManager()