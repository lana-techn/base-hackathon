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

// API Response Types - CoinGecko
export interface CoinGeckoOHLCResponse {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
}

export interface CoinGeckoPriceResponse {
  [coinId: string]: {
    usd: number
    usd_24h_change: number
    usd_24h_vol: number
    usd_market_cap: number
  }
}

export interface CoinGeckoMarketData {
  id: string
  symbol: string
  name: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  circulating_supply: number
  ath: number
  ath_change_percentage: number
  atl: number
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