import { NextRequest, NextResponse } from 'next/server'

// Mock data generator for Vercel deployment
function generateMockIndicators(symbol: string = 'ETH/USDT') {
  const basePrices: Record<string, number> = {
    'ETH/USDT': 3200,
    'BTC/USDT': 65000,
    'SOL/USDT': 180,
    'MATIC/USDT': 0.85
  }
  
  const basePrice = basePrices[symbol] || 3200
  const variation = basePrice * 0.05 // 5% variation
  
  const currentPrice = basePrice + (Math.random() - 0.5) * variation
  const rsi = 30 + Math.random() * 40 // RSI between 30-70
  
  const bbMiddle = currentPrice * (0.98 + Math.random() * 0.04)
  const bbUpper = bbMiddle * 1.02
  const bbLower = bbMiddle * 0.98
  
  let pricePosition: 'UPPER' | 'MIDDLE' | 'LOWER'
  if (currentPrice >= bbUpper) {
    pricePosition = 'UPPER'
  } else if (currentPrice <= bbLower) {
    pricePosition = 'LOWER'
  } else {
    pricePosition = 'MIDDLE'
  }
  
  return {
    rsi: Math.round(rsi * 100) / 100,
    bollinger_upper: Math.round(bbUpper * 100) / 100,
    bollinger_middle: Math.round(bbMiddle * 100) / 100,
    bollinger_lower: Math.round(bbLower * 100) / 100,
    current_price: Math.round(currentPrice * 100) / 100,
    price_position: pricePosition
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol') || 'ETH/USDT'
    const interval = searchParams.get('interval') || '1h'
    
    // In production, this would fetch from Binance API
    // For now, return mock data
    const indicators = generateMockIndicators(symbol)
    
    return NextResponse.json(indicators)
  } catch (error) {
    console.error('Error in indicators API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch indicators' },
      { status: 500 }
    )
  }
}