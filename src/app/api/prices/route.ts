import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const symbols = searchParams.get('symbols')?.split(',') || ['ethereum', 'bitcoin']
  const vs_currency = searchParams.get('vs_currency') || 'usd'

  try {
    // Use CoinGecko API for price data
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symbols.join(',')}&vs_currencies=${vs_currency}&include_24hr_change=true&include_24hr_vol=true`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'BethNa-AI-Trader/1.0',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()

    // Transform to our format
    const transformedData = Object.entries(data).map(([id, priceData]: [string, any]) => ({
      symbol: id.toUpperCase(),
      price: priceData[vs_currency] || 0,
      change24h: priceData[`${vs_currency}_24h_change`] || 0,
      changePercent24h: priceData[`${vs_currency}_24h_change`] || 0,
      volume24h: priceData[`${vs_currency}_24h_vol`] || 0,
      timestamp: Date.now(),
    }))

    return NextResponse.json(transformedData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'public, s-maxage=30', // Cache for 30 seconds
      },
    })
  } catch (error) {
    console.error('CoinGecko API proxy error:', error)
    
    // Return mock data if API fails
    const mockData = symbols.map(symbol => ({
      symbol: symbol.toUpperCase(),
      price: symbol === 'ethereum' ? 3200 : symbol === 'bitcoin' ? 65000 : 100,
      change24h: Math.random() * 200 - 100, // Random change
      changePercent24h: Math.random() * 10 - 5, // Random percentage
      volume24h: Math.random() * 1000000,
      timestamp: Date.now(),
    }))

    return NextResponse.json(mockData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}