import { TradingSignal, Position, TradeEvent, AgentMessage, CoinGeckoOHLCResponse, CoinGeckoPriceResponse, ThetanutsOptionData, MarketData, CandlestickData } from '@/types'
import { Address, isAddress } from 'viem'

/**
 * Validate trading signal data
 */
export function validateTradingSignal(signal: any): signal is TradingSignal {
  return (
    typeof signal === 'object' &&
    signal !== null &&
    ['BUY_CALL', 'BUY_PUT', 'CLOSE_POSITION', 'HOLD'].includes(signal.signal) &&
    typeof signal.confidence === 'number' &&
    signal.confidence >= 0 &&
    signal.confidence <= 100 &&
    typeof signal.winRate === 'number' &&
    signal.winRate >= 0 &&
    signal.winRate <= 100 &&
    typeof signal.reasoning === 'string' &&
    typeof signal.timestamp === 'number' &&
    typeof signal.metadata === 'object' &&
    typeof signal.metadata.rsi === 'number' &&
    ['UPPER', 'LOWER', 'MIDDLE'].includes(signal.metadata.bollingerPosition) &&
    typeof signal.metadata.priceLevel === 'number'
  )
}

/**
 * Validate position data
 */
export function validatePosition(position: any): position is Position {
  return (
    typeof position === 'object' &&
    position !== null &&
    typeof position.id === 'string' &&
    isAddress(position.optionToken) &&
    ['CALL', 'PUT'].includes(position.optionType) &&
    typeof position.strike === 'number' &&
    typeof position.expiry === 'number' &&
    typeof position.entryPrice === 'number' &&
    typeof position.currentPrice === 'number' &&
    typeof position.quantity === 'number' &&
    typeof position.pnl === 'number' &&
    typeof position.pnlPercentage === 'number' &&
    ['OPEN', 'CLOSED'].includes(position.status) &&
    typeof position.openedAt === 'number'
  )
}

/**
 * Validate trade event data
 */
export function validateTradeEvent(event: any): event is TradeEvent {
  return (
    typeof event === 'object' &&
    event !== null &&
    typeof event.txHash === 'string' &&
    event.txHash.startsWith('0x') &&
    typeof event.blockNumber === 'number' &&
    typeof event.timestamp === 'number' &&
    ['OPEN_LONG_CALL', 'OPEN_LONG_PUT', 'CLOSE_POSITION'].includes(event.action) &&
    isAddress(event.optionToken) &&
    typeof event.amountIn === 'bigint' &&
    typeof event.amountOut === 'bigint' &&
    typeof event.gasUsed === 'bigint' &&
    typeof event.success === 'boolean'
  )
}

/**
 * Validate agent message data
 */
export function validateAgentMessage(message: any): message is AgentMessage {
  return (
    typeof message === 'object' &&
    message !== null &&
    ['ALPHA', 'BETA', 'GAMMA'].includes(message.agent) &&
    typeof message.message === 'string' &&
    typeof message.timestamp === 'number' &&
    ['INFO', 'SIGNAL', 'EXECUTION', 'SOCIAL', 'ERROR'].includes(message.type)
  )
}

/**
 * Validate Ethereum address
 */
export function validateAddress(address: string): address is Address {
  return isAddress(address)
}

/**
 * Validate API response structure
 */
export function validateApiResponse<T>(
  response: any,
  validator: (data: any) => data is T
): T | null {
  try {
    if (validator(response)) {
      return response
    }
    return null
  } catch (error) {
    console.error('API response validation error:', error)
    return null
  }
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 1000) // Limit length
}

/**
 * Validate numeric range
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string = 'value'
): boolean {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(`${fieldName} must be a valid number`)
  }
  if (value < min || value > max) {
    throw new Error(`${fieldName} must be between ${min} and ${max}`)
  }
  return true
}

/**
 * Validate timestamp
 */
export function validateTimestamp(timestamp: number): boolean {
  const now = Date.now()
  const oneYearAgo = now - (365 * 24 * 60 * 60 * 1000)
  const oneYearFromNow = now + (365 * 24 * 60 * 60 * 1000)
  
  return timestamp >= oneYearAgo && timestamp <= oneYearFromNow
}

/**
 * Schema validation for CoinGecko OHLC responses
 */
export function validateCoinGeckoOHLCResponse(response: any): response is CoinGeckoOHLCResponse[] {
  if (!Array.isArray(response)) {
    return false
  }

  return response.every((candle: any) => {
    return (
      typeof candle === 'object' &&
      candle !== null &&
      typeof candle.timestamp === 'number' &&
      typeof candle.open === 'number' &&
      typeof candle.high === 'number' &&
      typeof candle.low === 'number' &&
      typeof candle.close === 'number'
    )
  })
}

/**
 * Schema validation for CoinGecko price responses
 */
export function validateCoinGeckoPriceResponse(response: any): response is CoinGeckoPriceResponse {
  if (!response || typeof response !== 'object') {
    return false
  }

  return Object.values(response).every((coin: any) => {
    return (
      typeof coin === 'object' &&
      coin !== null &&
      typeof coin.usd === 'number'
    )
  })
}

/**
 * Schema validation for Thetanuts option data
 */
export function validateThetanutsOptionData(data: any): data is ThetanutsOptionData {
  return (
    typeof data === 'object' &&
    data !== null &&
    isAddress(data.optionToken) &&
    typeof data.strike === 'number' &&
    data.strike > 0 &&
    typeof data.expiry === 'number' &&
    data.expiry > Date.now() &&
    ['CALL', 'PUT'].includes(data.optionType) &&
    typeof data.price === 'number' &&
    data.price >= 0 &&
    typeof data.impliedVolatility === 'number' &&
    data.impliedVolatility >= 0 &&
    typeof data.delta === 'number' &&
    typeof data.gamma === 'number' &&
    typeof data.theta === 'number' &&
    typeof data.vega === 'number'
  )
}

/**
 * Schema validation for market data
 */
export function validateMarketData(data: any): data is MarketData {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.symbol === 'string' &&
    data.symbol.length > 0 &&
    typeof data.price === 'number' &&
    data.price > 0 &&
    typeof data.timestamp === 'number' &&
    validateTimestamp(data.timestamp) &&
    typeof data.volume === 'number' &&
    data.volume >= 0 &&
    typeof data.high24h === 'number' &&
    data.high24h > 0 &&
    typeof data.low24h === 'number' &&
    data.low24h > 0 &&
    typeof data.change24h === 'number' &&
    typeof data.changePercent24h === 'number'
  )
}

/**
 * Schema validation for candlestick data
 */
export function validateCandlestickData(data: any): data is CandlestickData {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.timestamp === 'number' &&
    validateTimestamp(data.timestamp) &&
    typeof data.open === 'number' &&
    data.open > 0 &&
    typeof data.high === 'number' &&
    data.high > 0 &&
    typeof data.low === 'number' &&
    data.low > 0 &&
    typeof data.close === 'number' &&
    data.close > 0 &&
    typeof data.volume === 'number' &&
    data.volume >= 0 &&
    data.high >= data.low &&
    data.high >= data.open &&
    data.high >= data.close &&
    data.low <= data.open &&
    data.low <= data.close
  )
}

/**
 * Enhanced input sanitization for user data and agent communications
 */
export function sanitizeUserInput(input: string): string {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string')
  }

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/[\x00-\x1f\x7f-\x9f]/g, '') // Remove control characters
    .slice(0, 1000) // Limit length
}

/**
 * Sanitize agent message content
 */
export function sanitizeAgentMessage(message: string): string {
  if (typeof message !== 'string') {
    throw new Error('Message must be a string')
  }

  return message
    .trim()
    .replace(/[\x00-\x1f\x7f-\x9f]/g, '') // Remove control characters
    .slice(0, 5000) // Allow longer messages for agents
}

/**
 * Validate and sanitize JSON input
 */
export function validateAndSanitizeJson<T>(
  jsonString: string,
  validator: (data: any) => data is T
): T | null {
  try {
    // Basic sanitization of JSON string
    const sanitizedJson = jsonString
      .trim()
      .replace(/[\x00-\x1f\x7f-\x9f]/g, '') // Remove control characters
    
    const parsed = JSON.parse(sanitizedJson)
    
    if (validator(parsed)) {
      return parsed
    }
    
    console.warn('JSON validation failed:', parsed)
    return null
  } catch (error) {
    console.error('JSON parsing error:', error)
    return null
  }
}

/**
 * Validate external API response with rate limiting awareness
 */
export function validateExternalApiResponse<T>(
  response: any,
  validator: (data: any) => data is T,
  apiName: string
): { data: T | null; error?: string } {
  try {
    // Check for common API error patterns
    if (response && typeof response === 'object') {
      // Check for rate limiting
      if (response.code === 429 || response.message?.includes('rate limit')) {
        return { data: null, error: `Rate limit exceeded for ${apiName}` }
      }
      
      // Check for API errors
      if (response.error || response.code < 0) {
        return { data: null, error: `API error from ${apiName}: ${response.error || response.msg}` }
      }
    }

    if (validator(response)) {
      return { data: response }
    }
    
    return { data: null, error: `Invalid response format from ${apiName}` }
  } catch (error) {
    return { data: null, error: `Validation error for ${apiName}: ${error}` }
  }
}

/**
 * Validate array of data with individual validation
 */
export function validateDataArray<T>(
  dataArray: any[],
  validator: (item: any) => item is T,
  maxLength: number = 1000
): T[] {
  if (!Array.isArray(dataArray)) {
    throw new Error('Input must be an array')
  }
  
  if (dataArray.length > maxLength) {
    throw new Error(`Array length exceeds maximum of ${maxLength}`)
  }
  
  const validItems: T[] = []
  const errors: string[] = []
  
  dataArray.forEach((item, index) => {
    try {
      if (validator(item)) {
        validItems.push(item)
      } else {
        errors.push(`Invalid item at index ${index}`)
      }
    } catch (error) {
      errors.push(`Error validating item at index ${index}: ${error}`)
    }
  })
  
  if (errors.length > 0) {
    console.warn('Data validation warnings:', errors)
  }
  
  return validItems
}

/**
 * Validate configuration objects
 */
export function validateConfiguration(config: any): boolean {
  if (!config || typeof config !== 'object') {
    return false
  }
  
  // Validate required configuration sections exist
  const requiredSections = ['alpha', 'beta', 'gamma']
  return requiredSections.every(section => 
    config[section] && typeof config[section] === 'object'
  )
}

/**
 * Validate blockchain transaction hash
 */
export function validateTransactionHash(txHash: string): boolean {
  return typeof txHash === 'string' && 
         txHash.startsWith('0x') && 
         txHash.length === 66 &&
         /^0x[a-fA-F0-9]{64}$/.test(txHash)
}

/**
 * Validate price data for reasonableness
 */
export function validatePriceData(price: number, symbol: string = 'unknown'): boolean {
  if (typeof price !== 'number' || isNaN(price) || !isFinite(price)) {
    console.warn(`Invalid price for ${symbol}: ${price}`)
    return false
  }
  
  if (price <= 0) {
    console.warn(`Non-positive price for ${symbol}: ${price}`)
    return false
  }
  
  // Basic sanity checks for crypto prices (adjust as needed)
  if (price > 1000000) {
    console.warn(`Suspiciously high price for ${symbol}: ${price}`)
    return false
  }
  
  return true
}