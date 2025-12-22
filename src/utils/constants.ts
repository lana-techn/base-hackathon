import { AgentConfig } from '@/types'

// Network Configuration
export const SUPPORTED_CHAINS = {
  BASE_MAINNET: 8453,
  BASE_SEPOLIA: 84532,
} as const

// Trading Constants
export const TRADING_CONSTANTS = {
  MIN_CONFIDENCE_THRESHOLD: 70, // Minimum confidence to execute trades
  MAX_POSITION_SIZE: 1000, // Maximum position size in USDC
  DEFAULT_SLIPPAGE: 0.005, // 0.5% slippage tolerance
  DEFAULT_STOP_LOSS: 0.2, // 20% stop loss
  DEFAULT_TAKE_PROFIT: 0.5, // 50% take profit
  RSI_OVERSOLD: 30,
  RSI_OVERBOUGHT: 70,
  BOLLINGER_PERIODS: 20,
  BOLLINGER_STD_DEV: 2,
  RSI_PERIODS: 14,
} as const

// Time Constants
export const TIME_CONSTANTS = {
  HOUR_MS: 60 * 60 * 1000,
  DAY_MS: 24 * 60 * 60 * 1000,
  WEEK_MS: 7 * 24 * 60 * 60 * 1000,
  ANALYSIS_INTERVAL: 60 * 60 * 1000, // 1 hour
  DATA_RETENTION_HOURS: 720, // 30 days
  WEBSOCKET_RECONNECT_DELAY: 5000,
  PRICE_UPDATE_INTERVAL: 1000, // 1 second for real-time prices
  ALERT_CHECK_INTERVAL: 5000, // 5 seconds for alert checking
  HEARTBEAT_INTERVAL: 30000, // 30 seconds for WebSocket heartbeat
} as const

// API Endpoints
export const API_ENDPOINTS = {
  COINGECKO_BASE: 'https://api.coingecko.com/api/v3',
  THETANUTS_BASE: 'https://api.thetanuts.finance/v1',
  TWITTER_BASE: 'https://api.twitter.com/2',
  FARCASTER_BASE: 'https://api.farcaster.xyz/v2',
  BINANCE_WS: 'wss://stream.binance.com:9443/ws',
  BINANCE_API: 'https://api.binance.com/api/v3',
  COINBASE_WS: 'wss://ws-feed.exchange.coinbase.com',
  KRAKEN_WS: 'wss://ws.kraken.com',
} as const

// Default Agent Configuration
export const DEFAULT_AGENT_CONFIG: AgentConfig = {
  alpha: {
    analysisInterval: TIME_CONSTANTS.ANALYSIS_INTERVAL,
    dataRetentionHours: TIME_CONSTANTS.DATA_RETENTION_HOURS,
    confidenceThreshold: TRADING_CONSTANTS.MIN_CONFIDENCE_THRESHOLD,
  },
  beta: {
    maxPositionSize: TRADING_CONSTANTS.MAX_POSITION_SIZE,
    stopLossPercentage: TRADING_CONSTANTS.DEFAULT_STOP_LOSS,
    takeProfitPercentage: TRADING_CONSTANTS.DEFAULT_TAKE_PROFIT,
    slippageTolerance: TRADING_CONSTANTS.DEFAULT_SLIPPAGE,
  },
  gamma: {
    postingEnabled: true,
    platforms: ['TWITTER', 'FARCASTER'],
    contentStyle: 'PROFESSIONAL',
  },
}

// Error Codes
export const ERROR_CODES = {
  INVALID_SIGNAL: 'INVALID_SIGNAL',
  INSUFFICIENT_LIQUIDITY: 'INSUFFICIENT_LIQUIDITY',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  API_ERROR: 'API_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  CONTRACT_ERROR: 'CONTRACT_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
} as const

// UI Constants
export const UI_CONSTANTS = {
  CHART_HEIGHT: 400,
  POSITIONS_PANEL_HEIGHT: 300,
  WAR_ROOM_HEIGHT: 200,
  REFRESH_INTERVAL: 5000, // 5 seconds
  ANIMATION_DURATION: 300,
} as const

// Social Media Constants
export const SOCIAL_CONSTANTS = {
  TWITTER_MAX_LENGTH: 280,
  FARCASTER_MAX_LENGTH: 320,
  POST_COOLDOWN: 60000, // 1 minute between posts
  MAX_RETRIES: 3,
} as const

// Token Addresses (Base Mainnet)
export const TOKEN_ADDRESSES = {
  USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  WETH: '0x4200000000000000000000000000000000000006',
} as const

// WebSocket Configuration
export const WEBSOCKET_CONFIG = {
  MAX_RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY: 1000,
  CONNECTION_TIMEOUT: 10000,
  HEARTBEAT_INTERVAL: 30000,
  MAX_BUFFER_SIZE: 1000,
  PRICE_STREAM_SYMBOLS: ['ETHUSDT', 'BTCUSDT', 'SOLUSDT', 'MATICUSDT'],
} as const

// Alert Configuration
export const ALERT_CONFIG = {
  MAX_PRICE_ALERTS: 50,
  MAX_SIGNAL_ALERTS: 100,
  MAX_NOTIFICATIONS: 200,
  NOTIFICATION_TIMEOUT: 5000,
  HIGH_CONFIDENCE_THRESHOLD: 80,
  MEDIUM_CONFIDENCE_THRESHOLD: 70,
} as const

// Gas Configuration
export const GAS_CONFIG = {
  DEFAULT_GAS_LIMIT: 500000n,
  PRIORITY_FEE: 1000000000n, // 1 gwei
  MAX_FEE_PER_GAS: 20000000000n, // 20 gwei
} as const