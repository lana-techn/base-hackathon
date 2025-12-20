import { NextRequest, NextResponse } from 'next/server'
import { getIndicators } from '@/lib/coingecko'

// Extract coin symbol from trading pair (e.g., "ETH/USDT" -> "ETH")
function extractCoinSymbol(pair: string): string {
  return pair.split('/')[0].toUpperCase()
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol') || 'ETH/USDT'
    
    // Extract base coin (e.g., ETH from ETH/USDT)
    const coinSymbol = extractCoinSymbol(symbol)
    
    // Fetch real data from CoinGecko
    const indicators = await getIndicators(coinSymbol)
    
    return NextResponse.json(indicators)
  } catch (error) {
    console.error('Error in indicators API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch indicators' },
      { status: 500 }
    )
  }
}