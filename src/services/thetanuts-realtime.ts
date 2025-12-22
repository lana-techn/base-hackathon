import { API_ENDPOINTS } from '@/utils/constants'

export interface ThetanutsOption {
  id: string
  asset: 'ETH' | 'BTC'
  strike: number
  expiry: string
  type: 'CALL' | 'PUT'
  premium: number
  iv: number // Implied Volatility
  delta: number
  gamma: number
  theta: number
  vega: number
  volume: number
  openInterest: number
  lastPrice: number
  bid: number
  ask: number
  timestamp: number
}

export interface ThetanutsOptionsChain {
  asset: string
  spot: number
  calls: ThetanutsOption[]
  puts: ThetanutsOption[]
  timestamp: number
}

export interface ThetanutsWebSocketMessage {
  type: 'options_update' | 'price_update' | 'trade_update'
  data: any
  timestamp: number
}

export class ThetanutsRealtimeService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private subscribers = new Map<string, Set<(data: any) => void>>()

  constructor(private apiKey?: string) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Use Thetanuts WebSocket endpoint
        const wsUrl = `wss://api.thetanuts.finance/ws${this.apiKey ? `?key=${this.apiKey}` : ''}`
        this.ws = new WebSocket(wsUrl)

        this.ws.onopen = () => {
          console.log('✅ Thetanuts WebSocket connected')
          this.reconnectAttempts = 0
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message: ThetanutsWebSocketMessage = JSON.parse(event.data)
            this.handleMessage(message)
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error)
          }
        }

        this.ws.onclose = (event) => {
          console.log('Thetanuts WebSocket closed:', event.code, event.reason)
          this.handleReconnect()
        }

        this.ws.onerror = (error) => {
          console.error('Thetanuts WebSocket error:', error)
          reject(error)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  private handleMessage(message: ThetanutsWebSocketMessage) {
    const subscribers = this.subscribers.get(message.type)
    if (subscribers) {
      subscribers.forEach(callback => callback(message.data))
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
      
      console.log(`Reconnecting to Thetanuts WebSocket in ${delay}ms (attempt ${this.reconnectAttempts})`)
      
      setTimeout(() => {
        this.connect().catch(console.error)
      }, delay)
    } else {
      console.error('Max reconnection attempts reached for Thetanuts WebSocket')
    }
  }

  subscribe(eventType: string, callback: (data: any) => void) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set())
    }
    this.subscribers.get(eventType)!.add(callback)

    // Send subscription message to WebSocket
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        action: 'subscribe',
        channel: eventType
      }))
    }

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(eventType)
      if (subscribers) {
        subscribers.delete(callback)
        if (subscribers.size === 0) {
          this.subscribers.delete(eventType)
          // Send unsubscribe message
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
              action: 'unsubscribe',
              channel: eventType
            }))
          }
        }
      }
    }
  }

  subscribeToOptionsChain(asset: 'ETH' | 'BTC', callback: (chain: ThetanutsOptionsChain) => void) {
    return this.subscribe(`options_chain_${asset}`, callback)
  }

  subscribeToTrades(asset: 'ETH' | 'BTC', callback: (trade: any) => void) {
    return this.subscribe(`trades_${asset}`, callback)
  }

  subscribeToSpotPrice(asset: 'ETH' | 'BTC', callback: (price: number) => void) {
    return this.subscribe(`spot_${asset}`, callback)
  }

  async getOptionsChain(asset: 'ETH' | 'BTC'): Promise<ThetanutsOptionsChain> {
    try {
      const response = await fetch(`${API_ENDPOINTS.THETANUTS_BASE}/options/${asset}`, {
        headers: this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {}
      })

      if (!response.ok) {
        throw new Error(`Thetanuts API error: ${response.statusText}`)
      }

      const data = await response.json()
      return this.parseOptionsChain(data)
    } catch (error) {
      console.error('Failed to fetch options chain:', error)
      // Return mock data for development
      return this.getMockOptionsChain(asset)
    }
  }

  private parseOptionsChain(data: any): ThetanutsOptionsChain {
    return {
      asset: data.asset,
      spot: data.spot_price,
      calls: data.calls.map(this.parseOption),
      puts: data.puts.map(this.parseOption),
      timestamp: Date.now()
    }
  }

  private parseOption(option: any): ThetanutsOption {
    return {
      id: option.id,
      asset: option.asset,
      strike: option.strike,
      expiry: option.expiry,
      type: option.type,
      premium: option.premium,
      iv: option.implied_volatility,
      delta: option.greeks.delta,
      gamma: option.greeks.gamma,
      theta: option.greeks.theta,
      vega: option.greeks.vega,
      volume: option.volume,
      openInterest: option.open_interest,
      lastPrice: option.last_price,
      bid: option.bid,
      ask: option.ask,
      timestamp: Date.now()
    }
  }

  private getMockOptionsChain(asset: 'ETH' | 'BTC'): ThetanutsOptionsChain {
    const spot = asset === 'ETH' ? 3200 : 65000
    const strikes = this.generateStrikes(spot)
    
    return {
      asset,
      spot,
      calls: strikes.map(strike => this.generateMockOption(asset, strike, 'CALL', spot)),
      puts: strikes.map(strike => this.generateMockOption(asset, strike, 'PUT', spot)),
      timestamp: Date.now()
    }
  }

  private generateStrikes(spot: number): number[] {
    const strikes = []
    const step = spot > 10000 ? 1000 : 100
    
    for (let i = -5; i <= 5; i++) {
      strikes.push(spot + (i * step))
    }
    
    return strikes
  }

  private generateMockOption(
    asset: 'ETH' | 'BTC', 
    strike: number, 
    type: 'CALL' | 'PUT', 
    spot: number
  ): ThetanutsOption {
    const isITM = type === 'CALL' ? spot > strike : spot < strike
    const premium = Math.max(10, Math.random() * 200)
    
    return {
      id: `${asset}-${strike}-${type}-${Date.now()}`,
      asset,
      strike,
      expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week
      type,
      premium,
      iv: 0.3 + Math.random() * 0.4, // 30-70% IV
      delta: type === 'CALL' ? (isITM ? 0.6 : 0.3) : (isITM ? -0.6 : -0.3),
      gamma: 0.01 + Math.random() * 0.02,
      theta: -0.5 - Math.random() * 1.5,
      vega: 0.1 + Math.random() * 0.3,
      volume: Math.floor(Math.random() * 1000),
      openInterest: Math.floor(Math.random() * 5000),
      lastPrice: premium,
      bid: premium * 0.98,
      ask: premium * 1.02,
      timestamp: Date.now()
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.subscribers.clear()
  }
}

// Singleton instance
export const thetanutsService = new ThetanutsRealtimeService(
  process.env.NEXT_PUBLIC_THETANUTS_API_KEY
)