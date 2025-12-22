import { Position } from '@/types'

/**
 * Format position data for display
 * Format: "ETH $3200 Call | Entry: $12.5 | Mark: $14.2 | PnL: +13.6%"
 */
export function formatPosition(position: Position): string {
  const symbol = 'ETH' // For now, hardcoded to ETH
  const strike = `$${position.strike.toLocaleString()}`
  const optionType = position.optionType.charAt(0) + position.optionType.slice(1).toLowerCase()
  const entry = `$${position.entryPrice.toFixed(2)}`
  const mark = `$${position.currentPrice.toFixed(2)}`
  const pnlSign = position.pnlPercentage >= 0 ? '+' : ''
  const pnl = `${pnlSign}${position.pnlPercentage.toFixed(1)}%`
  
  return `${symbol} ${strike} ${optionType} | Entry: ${entry} | Mark: ${mark} | PnL: ${pnl}`
}

/**
 * Format currency values
 */
export function formatCurrency(value: number, decimals: number = 2): string {
  return `$${value.toLocaleString(undefined, { 
    minimumFractionDigits: decimals, 
    maximumFractionDigits: decimals 
  })}`
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}%`
}

/**
 * Format timestamp to readable date
 */
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString()
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatLargeNumber(value: number): string {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(1)}B`
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)}K`
  }
  return value.toFixed(2)
}

/**
 * Truncate address for display
 */
export function truncateAddress(address: string, startLength: number = 6, endLength: number = 4): string {
  if (address.length <= startLength + endLength) {
    return address
  }
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

/**
 * Get color class based on PnL
 */
export function getPnLColor(pnl: number): string {
  if (pnl > 0) return 'text-green-500'
  if (pnl < 0) return 'text-red-500'
  return 'text-gray-500'
}

/**
 * Format relative time (e.g., "2m ago", "1h ago")
 */
export function formatRelativeTime(date: Date | string | number): string {
  const now = new Date()
  const target = new Date(date)
  const diffMs = now.getTime() - target.getTime()
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return target.toLocaleDateString()
}

/**
 * Format time for display (HH:MM:SS)
 */
export function formatTimeOnly(date: Date | string | number): string {
  const d = new Date(date)
  return d.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}
