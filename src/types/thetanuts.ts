/**
 * Thetanuts Finance V4 Types
 * TypeScript interfaces for the Thetanuts Pricing API
 */

// ============ API Response Types ============

export interface ThetanutsGreeks {
    delta: number
    gamma: number
    theta: number
    vega: number
    iv: number // Implied Volatility
}

export interface ThetanutsOrder {
    ticker: string
    maker: string
    orderExpiryTimestamp: number
    collateral: string
    isCall: boolean
    priceFeed: string
    implementation: string
    isLong: boolean
    maxCollateralUsable: string
    strikes: number[]
    expiry: number
    price: string
    extraOptionData: string
    // Optional fields for special order types
    numContracts?: number
    type?: 'binaries' | string
    name?: string
}

export interface ThetanutsSignedOrder {
    order: ThetanutsOrder
    signature: string
    chainId: number
    optionBookAddress: string
    nonce: string
    greeks: ThetanutsGreeks
}

export interface ThetanutsMarketData {
    ETH: number
    BTC: number
    SOL?: number
    BNB?: number
}

export interface ThetanutsMarketWeather {
    curVol: number
    forecast: number[]
}

export interface ThetanutsAPIResponse {
    data: {
        timestamp: string
        orders: ThetanutsSignedOrder[]
        market_data: ThetanutsMarketData
        market_weather: Record<string, ThetanutsMarketWeather>
    }
    metadata: {
        last_updated: number
        current_time: number
    }
}

// ============ Parsed/Formatted Types ============

export interface ParsedOption {
    ticker: string
    asset: 'ETH' | 'BTC' | 'SOL' | 'BNB'
    isCall: boolean
    strike: number
    expiry: Date
    expiryTimestamp: number
    premiumUSD: number
    premiumRaw: string
    greeks: ThetanutsGreeks
    maker: string
    chainId: number
    optionBookAddress: string
    signature: string
    nonce: string
    // Computed fields
    daysToExpiry: number
    moneyness: 'ITM' | 'ATM' | 'OTM'
}

export interface OptionsChain {
    asset: 'ETH' | 'BTC' | 'SOL' | 'BNB'
    currentPrice: number
    calls: ParsedOption[]
    puts: ParsedOption[]
    expiries: Date[]
    lastUpdated: Date
}

export interface OptionRecommendation {
    option: ParsedOption
    score: number
    reasoning: string
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
}

// ============ Hook Return Types ============

export interface UseThetanutsReturn {
    optionsChain: OptionsChain | null
    isLoading: boolean
    error: string | null
    lastUpdated: Date | null
    refresh: () => void
    getOptionsByExpiry: (expiry: Date) => { calls: ParsedOption[]; puts: ParsedOption[] }
    getBestOptions: (type: 'CALL' | 'PUT', count?: number) => ParsedOption[]
}
