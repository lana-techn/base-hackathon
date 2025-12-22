import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const asset = searchParams.get('asset') || 'ETH'
  const chainId = searchParams.get('chainId') || '8453'

  try {
    // Proxy request to Thetanuts API
    const response = await fetch(
      `https://round-snowflake-9c31.devops-118.workers.dev/?asset=${asset}&chainId=${chainId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'BethNa-AI-Trader/1.0',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Thetanuts API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error) {
    console.error('Thetanuts API proxy error:', error)
    
    // Return mock data if API fails
    const mockData = {
      asset,
      chainId: parseInt(chainId),
      options: [
        {
          strike: asset === 'ETH' ? 3200 : 65000,
          call_price: 150,
          put_price: 120,
          expiryTimestamp: Date.now() + 7 * 24 * 60 * 60 * 1000,
          implied_volatility: 0.45,
        },
        {
          strike: asset === 'ETH' ? 3300 : 66000,
          call_price: 100,
          put_price: 180,
          expiryTimestamp: Date.now() + 7 * 24 * 60 * 60 * 1000,
          implied_volatility: 0.42,
        },
      ],
      timestamp: Date.now(),
    }

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