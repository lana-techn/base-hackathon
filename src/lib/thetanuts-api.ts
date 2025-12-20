/**
 * Thetanuts Finance V4 API Service
 * Fetches and parses options data from Thetanuts Pricing API
 */

import {
    ThetanutsAPIResponse,
    ThetanutsSignedOrder,
    ParsedOption,
    OptionsChain,
} from '@/types/thetanuts'

// ============ Constants ============

const THETANUTS_API_URL = 'https://round-snowflake-9c31.devops-118.workers.dev'
const BASE_CHAIN_ID = 8453

// ============ Helper Functions ============

/**
 * Parse ticker to extract asset, strike, expiry, and type
 * Example: "ETH-21DEC25-3000-C" → { asset: "ETH", expiry: Date, strike: 3000, isCall: true }
 */
function parseTicker(ticker: string): {
    asset: string
    expiry: Date | null
    strike: number
    isCall: boolean
} | null {
    if (!ticker) return null

    const parts = ticker.split('-')
    if (parts.length < 4) return null

    const asset = parts[0]
    const expiryStr = parts[1]
    const strike = parseInt(parts[2], 10)
    const isCall = parts[3] === 'C'

    // Parse expiry date (e.g., "21DEC25")
    let expiry: Date | null = null
    try {
        const day = parseInt(expiryStr.slice(0, 2), 10)
        const monthStr = expiryStr.slice(2, 5)
        const year = 2000 + parseInt(expiryStr.slice(5), 10)

        const months: Record<string, number> = {
            JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
            JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
        }

        if (months[monthStr] !== undefined) {
            expiry = new Date(year, months[monthStr], day)
        }
    } catch {
        expiry = null
    }

    return { asset, expiry, strike, isCall }
}

/**
 * Calculate days to expiry
 */
function calculateDaysToExpiry(expiryTimestamp: number): number {
    const now = Date.now()
    const diff = expiryTimestamp * 1000 - now
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

/**
 * Determine moneyness (ITM/ATM/OTM)
 */
function calculateMoneyness(
    strike: number,
    currentPrice: number,
    isCall: boolean
): 'ITM' | 'ATM' | 'OTM' {
    const priceDiff = Math.abs(strike - currentPrice)
    const threshold = currentPrice * 0.02 // 2% threshold for ATM

    if (priceDiff <= threshold) return 'ATM'

    if (isCall) {
        return strike < currentPrice ? 'ITM' : 'OTM'
    } else {
        return strike > currentPrice ? 'ITM' : 'OTM'
    }
}

/**
 * Convert raw order to parsed option
 */
function parseOrder(
    signedOrder: ThetanutsSignedOrder,
    currentPrice: number
): ParsedOption | null {
    const { order, greeks, signature, nonce, chainId, optionBookAddress } = signedOrder

    // Skip orders without ticker (exotic options)
    if (!order.ticker) return null

    const parsed = parseTicker(order.ticker)
    if (!parsed || !parsed.expiry) return null

    // Convert price from raw (assuming 6 decimals for USDC)
    const premiumUSD = parseInt(order.price, 10) / 1e6

    // Calculate strike from raw (assuming 8 decimals)
    const strike = order.strikes[0] / 1e8

    const daysToExpiry = calculateDaysToExpiry(order.expiry)
    const moneyness = calculateMoneyness(strike, currentPrice, order.isCall)

    return {
        ticker: order.ticker,
        asset: parsed.asset as 'ETH' | 'BTC' | 'SOL' | 'BNB',
        isCall: order.isCall,
        strike,
        expiry: parsed.expiry,
        expiryTimestamp: order.expiry,
        premiumUSD,
        premiumRaw: order.price,
        greeks,
        maker: order.maker,
        chainId,
        optionBookAddress,
        signature,
        nonce,
        daysToExpiry,
        moneyness,
    }
}

// ============ Main API Functions ============

/**
 * Fetch raw options data from Thetanuts API
 */
export async function fetchThetanutsOptions(
    asset: 'ETH' | 'BTC' = 'ETH'
): Promise<ThetanutsAPIResponse> {
    const url = `${THETANUTS_API_URL}/?asset=${asset}&chainId=${BASE_CHAIN_ID}`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
        next: { revalidate: 30 }, // Cache for 30 seconds
    })

    if (!response.ok) {
        throw new Error(`Thetanuts API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
}

/**
 * Get parsed options chain for an asset
 */
export async function getOptionsChain(
    asset: 'ETH' | 'BTC' = 'ETH'
): Promise<OptionsChain> {
    const data = await fetchThetanutsOptions(asset)

    const currentPrice = data.data.market_data[asset] || 0
    const parsedOptions: ParsedOption[] = []
    const expirySet = new Set<number>()

    for (const signedOrder of data.data.orders) {
        const parsed = parseOrder(signedOrder, currentPrice)
        if (parsed && parsed.asset === asset) {
            parsedOptions.push(parsed)
            expirySet.add(parsed.expiryTimestamp)
        }
    }

    // Sort by strike price
    const calls = parsedOptions
        .filter(o => o.isCall)
        .sort((a, b) => a.strike - b.strike)

    const puts = parsedOptions
        .filter(o => !o.isCall)
        .sort((a, b) => a.strike - b.strike)

    // Get unique expiries sorted
    const expiries = Array.from(expirySet)
        .sort((a, b) => a - b)
        .map(ts => new Date(ts * 1000))

    return {
        asset,
        currentPrice,
        calls,
        puts,
        expiries,
        lastUpdated: new Date(),
    }
}

/**
 * Get options filtered by expiry date
 */
export function filterByExpiry(
    options: ParsedOption[],
    targetExpiry: Date
): ParsedOption[] {
    const targetTimestamp = Math.floor(targetExpiry.getTime() / 1000)

    return options.filter(o => {
        // Allow 1 day tolerance
        const diff = Math.abs(o.expiryTimestamp - targetTimestamp)
        return diff < 86400 // 24 hours in seconds
    })
}

/**
 * Get best options based on Greeks and premium
 * For calls: higher delta = higher probability of profit
 * For puts: lower (more negative) delta = higher probability of profit
 */
export function getBestOptions(
    options: ParsedOption[],
    type: 'CALL' | 'PUT',
    count: number = 3
): ParsedOption[] {
    const filtered = options.filter(o => o.isCall === (type === 'CALL'))

    // Score based on: ATM preference, reasonable IV, good delta
    const scored = filtered.map(o => {
        let score = 0

        // ATM options get higher score
        if (o.moneyness === 'ATM') score += 30
        else if (o.moneyness === 'ITM') score += 10

        // Reasonable IV (30-60%) gets bonus
        if (o.greeks.iv >= 0.3 && o.greeks.iv <= 0.6) score += 20

        // Delta scoring (prefer 0.3-0.5 range for calls)
        const absDelta = Math.abs(o.greeks.delta)
        if (absDelta >= 0.3 && absDelta <= 0.5) score += 25
        else if (absDelta >= 0.2 && absDelta <= 0.6) score += 15

        // Near-term expiry bonus (< 7 days)
        if (o.daysToExpiry <= 7) score += 10
        else if (o.daysToExpiry <= 14) score += 5

        return { option: o, score }
    })

    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, count)
        .map(s => s.option)
}

/**
 * Format option for display
 */
export function formatOptionDisplay(option: ParsedOption): string {
    return `${option.ticker} | $${option.premiumUSD.toFixed(2)} | Δ${option.greeks.delta.toFixed(2)} | IV ${(option.greeks.iv * 100).toFixed(1)}%`
}

/**
 * Get market snapshot
 */
export async function getMarketSnapshot(): Promise<{
    eth: number
    btc: number
    timestamp: Date
}> {
    const data = await fetchThetanutsOptions('ETH')

    return {
        eth: data.data.market_data.ETH || 0,
        btc: data.data.market_data.BTC || 0,
        timestamp: new Date(data.metadata.current_time),
    }
}
