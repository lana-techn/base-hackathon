/**
 * CoinGecko API Service
 * Free API - No API key required for basic endpoints
 * Rate limit: 10-30 calls/minute (free tier)
 */

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3'

// Coin ID mapping (CoinGecko uses slug IDs)
const COIN_IDS: Record<string, string> = {
  'ETH': 'ethereum',
  'BTC': 'bitcoin',
  'SOL': 'solana',
  'MATIC': 'matic-network',
  'AVAX': 'avalanche-2',
  'LINK': 'chainlink',
  'UNI': 'uniswap',
  'AAVE': 'aave',
  'ARB': 'arbitrum',
  'OP': 'optimism',
}

export interface CoinGeckoPrice {
  usd: number
  usd_24h_change: number
  usd_24h_vol: number
  usd_market_cap: number
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

export interface CoinGeckoOHLC {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
}

/**
 * Get current price for multiple coins
 */
export async function getPrices(symbols: string[]): Promise<Record<string, CoinGeckoPrice>> {
  const ids = symbols.map(s => COIN_IDS[s.toUpperCase()] || s.toLowerCase()).join(',')
  
  const response = await fetch(
    `${COINGECKO_BASE}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`,
    { next: { revalidate: 30 } } // Cache for 30 seconds
  )
  
  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`)
  }
  
  const data = await response.json()
  
  // Transform to use symbols as keys
  const result: Record<string, CoinGeckoPrice> = {}
  for (const symbol of symbols) {
    const id = COIN_IDS[symbol.toUpperCase()] || symbol.toLowerCase()
    if (data[id]) {
      result[symbol.toUpperCase()] = {
        usd: data[id].usd,
        usd_24h_change: data[id].usd_24h_change,
        usd_24h_vol: data[id].usd_24h_vol,
        usd_market_cap: data[id].usd_market_cap,
      }
    }
  }
  
  return result
}

/**
 * Get market data for a specific coin
 */
export async function getMarketData(symbol: string): Promise<CoinGeckoMarketData | null> {
  const id = COIN_IDS[symbol.toUpperCase()] || symbol.toLowerCase()
  
  const response = await fetch(
    `${COINGECKO_BASE}/coins/markets?vs_currency=usd&ids=${id}&order=market_cap_desc&per_page=1&page=1&sparkline=false`,
    { next: { revalidate: 60 } }
  )
  
  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`)
  }
  
  const data = await response.json()
  return data[0] || null
}

/**
 * Get OHLC data for candlestick charts
 * Days: 1, 7, 14, 30, 90, 180, 365, max
 */
export async function getOHLC(symbol: string, days: number = 7): Promise<CoinGeckoOHLC[]> {
  const id = COIN_IDS[symbol.toUpperCase()] || symbol.toLowerCase()
  
  const response = await fetch(
    `${COINGECKO_BASE}/coins/${id}/ohlc?vs_currency=usd&days=${days}`,
    { next: { revalidate: 300 } } // Cache for 5 minutes
  )
  
  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`)
  }
  
  const data = await response.json()
  
  // CoinGecko returns [timestamp, open, high, low, close]
  return data.map((candle: number[]) => ({
    timestamp: candle[0],
    open: candle[1],
    high: candle[2],
    low: candle[3],
    close: candle[4],
  }))
}

/**
 * Get historical price data
 */
export async function getHistoricalPrices(symbol: string, days: number = 30): Promise<{ timestamp: number; price: number }[]> {
  const id = COIN_IDS[symbol.toUpperCase()] || symbol.toLowerCase()
  
  const response = await fetch(
    `${COINGECKO_BASE}/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
    { next: { revalidate: 300 } }
  )
  
  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`)
  }
  
  const data = await response.json()
  
  return data.prices.map((point: number[]) => ({
    timestamp: point[0],
    price: point[1],
  }))
}

/**
 * Calculate RSI from price history
 */
export function calculateRSI(prices: number[], periods: number = 14): number {
  if (prices.length < periods + 1) {
    return 50 // Default neutral RSI
  }
  
  const changes: number[] = []
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1])
  }
  
  const gains: number[] = []
  const losses: number[] = []
  
  for (const change of changes) {
    if (change > 0) {
      gains.push(change)
      losses.push(0)
    } else {
      gains.push(0)
      losses.push(Math.abs(change))
    }
  }
  
  // Calculate average gain and loss
  let avgGain = gains.slice(0, periods).reduce((a, b) => a + b, 0) / periods
  let avgLoss = losses.slice(0, periods).reduce((a, b) => a + b, 0) / periods
  
  // Smoothed calculation
  for (let i = periods; i < gains.length; i++) {
    avgGain = (avgGain * (periods - 1) + gains[i]) / periods
    avgLoss = (avgLoss * (periods - 1) + losses[i]) / periods
  }
  
  if (avgLoss === 0) return 100
  
  const rs = avgGain / avgLoss
  return 100 - (100 / (1 + rs))
}

/**
 * Calculate Bollinger Bands
 */
export function calculateBollingerBands(prices: number[], periods: number = 20, stdDev: number = 2): {
  upper: number
  middle: number
  lower: number
} {
  if (prices.length < periods) {
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length
    return { upper: avg * 1.02, middle: avg, lower: avg * 0.98 }
  }
  
  const recentPrices = prices.slice(-periods)
  const sma = recentPrices.reduce((a, b) => a + b, 0) / periods
  
  const squaredDiffs = recentPrices.map(p => Math.pow(p - sma, 2))
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / periods
  const std = Math.sqrt(variance)
  
  return {
    upper: sma + (stdDev * std),
    middle: sma,
    lower: sma - (stdDev * std),
  }
}

/**
 * Get full indicators for a symbol
 */
export async function getIndicators(symbol: string): Promise<{
  rsi: number
  bollinger_upper: number
  bollinger_middle: number
  bollinger_lower: number
  current_price: number
  price_change_24h: number
  price_position: 'UPPER' | 'MIDDLE' | 'LOWER'
}> {
  // Get historical prices for indicator calculation
  const history = await getHistoricalPrices(symbol, 30)
  const prices = history.map(h => h.price)
  
  const currentPrice = prices[prices.length - 1]
  const rsi = calculateRSI(prices)
  const bollinger = calculateBollingerBands(prices)
  
  // Get 24h change
  const marketData = await getMarketData(symbol)
  const priceChange24h = marketData?.price_change_percentage_24h || 0
  
  // Determine price position
  let pricePosition: 'UPPER' | 'MIDDLE' | 'LOWER'
  if (currentPrice >= bollinger.upper) {
    pricePosition = 'UPPER'
  } else if (currentPrice <= bollinger.lower) {
    pricePosition = 'LOWER'
  } else {
    pricePosition = 'MIDDLE'
  }
  
  return {
    rsi: Math.round(rsi * 100) / 100,
    bollinger_upper: Math.round(bollinger.upper * 100) / 100,
    bollinger_middle: Math.round(bollinger.middle * 100) / 100,
    bollinger_lower: Math.round(bollinger.lower * 100) / 100,
    current_price: Math.round(currentPrice * 100) / 100,
    price_change_24h: Math.round(priceChange24h * 100) / 100,
    price_position: pricePosition,
  }
}
