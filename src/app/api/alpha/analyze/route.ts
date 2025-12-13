import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// Agent Alpha Python service URL
const AGENT_ALPHA_URL = process.env.AGENT_ALPHA_URL || 'http://localhost:8000'

interface AnalysisResponse {
    signal: string
    confidence: number
    win_rate: number
    reasoning: string
    indicators: {
        rsi: number
        bollinger_upper: number
        bollinger_middle: number
        bollinger_lower: number
        current_price: number
        price_position: string
    }
    timestamp: string
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol') || 'ETH/USDT'
    const interval = searchParams.get('interval') || '1h'

    try {
        const response = await fetch(
            `${AGENT_ALPHA_URL}/analyze?symbol=${encodeURIComponent(symbol)}&interval=${interval}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                // Cache for 5 minutes
                next: { revalidate: 300 },
            }
        )

        if (!response.ok) {
            const error = await response.json().catch(() => ({}))
            return NextResponse.json(
                {
                    error: error.detail || 'Failed to fetch analysis from Agent Alpha',
                    success: false
                },
                { status: response.status }
            )
        }

        const data: AnalysisResponse = await response.json()

        return NextResponse.json({
            success: true,
            data: {
                signal: data.signal,
                confidence: data.confidence,
                winRate: data.win_rate,
                reasoning: data.reasoning,
                indicators: {
                    rsi: data.indicators.rsi,
                    bollingerBands: {
                        upper: data.indicators.bollinger_upper,
                        middle: data.indicators.bollinger_middle,
                        lower: data.indicators.bollinger_lower,
                    },
                    currentPrice: data.indicators.current_price,
                    pricePosition: data.indicators.price_position,
                },
                timestamp: data.timestamp,
            },
        })
    } catch (error) {
        console.error('Agent Alpha proxy error:', error)

        // Check if Agent Alpha service is running
        const isConnectionError = error instanceof TypeError && error.message.includes('fetch')

        return NextResponse.json(
            {
                error: isConnectionError
                    ? 'Agent Alpha service is not running. Start it with: cd agent-alpha && uv run uvicorn main:app --port 8000'
                    : error instanceof Error ? error.message : 'Unknown error',
                success: false,
            },
            { status: 503 }
        )
    }
}
