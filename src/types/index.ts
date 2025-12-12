import { Address } from 'viem'

// Core Trading Types
export interface TradingSignal {
  signal: 'BUY_CALL' | 'BUY_PUT' | 'CLOSE_POSITION' | 'HOLD'
  confidence: number // 0-100
  winRate: number // Historical win rate percentage
  reasoning: string
  timestamp: number
  metadata: {
    rsi: number
    bollingerPosition: 'UPPER' | 'LOWER' | 'MIDDLE'
    priceLevel: number
  }
}

export interface Position {
  id: string
  optionToken: Address
  optionType: 'CALL' | 'PUT'
  strike: number
  expiry: number
  entryPrice: number
  currentPrice: number
  quantity: number
  pnl: number
  pnlPercentage: number
  status: 'OPEN' | 'CLOSED'
  openedAt: number
  closedAt?: number
}

export interface TradeEvent {
  txHash: string
  blockNumber: number
  timestamp: number
  action: 'OPEN_LONG_CALL' | 'OPEN_LONG_PUT' | 'CLOSE_POSITION'
  optionToken: Address
  amountIn: bigint
  amountOut: bigint
  gasUsed: bigint
  success: boolean
}

export interface AgentMessage {
  agent: 'ALPHA' | 'BETA' | 'GAMMA'
  message: string
  timestamp: number
  type: 'INFO' | 'SIGNAL' | 'EXECUTION' | 'SOCIAL' | 'ERROR'
  metadata?: Record<string, any>
}

// Market Data Types
export interface MarketData {
  symbol: string
  price: number
  timestamp: number
  volume: number
  high24h: number
  low24h: number
  change24h: number
  changePercent24h: number
}

export interface CandlestickData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface TechnicalIndicators {
  rsi: number
  bollingerBands: {
    upper: number
    middle: number
    lower: number
  }
  timestamp: number
}

// Contract Types
export interface ContractConfig {
  sentientTrader: Address
  thetanutsRouter: Address
  chainId: number
}

// API Response Types
export interface BinanceKlineResponse {
  symbol: string
  data: Array<[
    number, // Open time
    string, // Open price
    string, // High price
    string, // Low price
    string, // Close price
    string, // Volume
    number, // Close time
    string, // Quote asset volume
    number, // Number of trades
    string, // Taker buy base asset volume
    string, // Taker buy quote asset volume
    string  // Ignore
  ]>
}

export interface ThetanutsOptionData {
  optionToken: Address
  strike: number
  expiry: number
  optionType: 'CALL' | 'PUT'
  price: number
  impliedVolatility: number
  delta: number
  gamma: number
  theta: number
  vega: number
}

// Social Media Types
export interface SocialPost {
  platform: 'TWITTER' | 'FARCASTER'
  content: string
  txHash?: string
  mediaUrls?: string[]
  timestamp: number
}

// Configuration Types
export interface AgentConfig {
  alpha: {
    analysisInterval: number // milliseconds
    dataRetentionHours: number
    confidenceThreshold: number
  }
  beta: {
    maxPositionSize: number
    stopLossPercentage: number
    takeProfitPercentage: number
    slippageTolerance: number
  }
  gamma: {
    postingEnabled: boolean
    platforms: Array<'TWITTER' | 'FARCASTER'>
    contentStyle: 'PROFESSIONAL' | 'CASUAL' | 'AGGRESSIVE'
  }
}

// Error Types
export interface SystemError {
  code: string
  message: string
  agent?: 'ALPHA' | 'BETA' | 'GAMMA'
  timestamp: number
  context?: Record<string, any>
}

// Utility Types
export type SignalType = TradingSignal['signal']
export type AgentType = AgentMessage['agent']
export type MessageType = AgentMessage['type']
export type PositionStatus = Position['status']
export type OptionType = Position['optionType']