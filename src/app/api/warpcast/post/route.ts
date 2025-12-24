import { NextRequest, NextResponse } from 'next/server'
import { postCastToWarpcast, isWarpcastConfigured } from '@/lib/warpcast'
import { GammaAgent } from '@/lib/ai-agents'

export const runtime = 'edge'

interface PostRequestBody {
    text?: string
    generateFromTrade?: {
        action: string
        symbol: string
        price: number
        pnl?: number
        pnlPercent?: number
        txHash?: string
    }
    generateFromMarket?: {
        symbol: string
        price: number
        changePercent24h: number
    }
}

export async function POST(request: NextRequest) {
    try {
        const body: PostRequestBody = await request.json()

        if (!isWarpcastConfigured()) {
            return NextResponse.json(
                {
                    error: 'Warpcast not configured. Set WARPCAST_API_KEY.',
                    success: false
                },
                { status: 500 }
            )
        }

        let textToPost = body.text

        // Generate from trade data
        if (!textToPost && body.generateFromTrade) {
            const gammaAgent = new GammaAgent()
            textToPost = await gammaAgent.generateTradePost(body.generateFromTrade)
            if (body.generateFromTrade.txHash) {
                textToPost += `\n\n🔗 https://basescan.org/tx/${body.generateFromTrade.txHash}`
            }
        }

        // Generate from market data  
        if (!textToPost && body.generateFromMarket) {
            const gammaAgent = new GammaAgent()
            textToPost = await gammaAgent.generateMarketCommentary({
                symbol: body.generateFromMarket.symbol,
                price: body.generateFromMarket.price,
                high24h: 0,
                low24h: 0,
                volume24h: 0,
                change24h: 0,
                changePercent24h: body.generateFromMarket.changePercent24h,
            })
        }

        if (!textToPost) {
            return NextResponse.json(
                { error: 'No text or generation data provided', success: false },
                { status: 400 }
            )
        }

        // Truncate to Farcaster limit
        if (textToPost.length > 320) {
            textToPost = textToPost.slice(0, 317) + '...'
        }

        const result = await postCastToWarpcast(textToPost)

        return NextResponse.json({
            success: result.success,
            data: result,
            text: textToPost
        })
    } catch (error) {
        console.error('Warpcast post error:', error)
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Unknown error',
                success: false,
            },
            { status: 500 }
        )
    }
}

export async function GET() {
    const isConfigured = isWarpcastConfigured()

    return NextResponse.json({
        status: isConfigured ? 'configured' : 'not_configured',
        message: isConfigured
            ? 'Warpcast API ready (using Developer API key)'
            : 'Set WARPCAST_API_KEY from Warpcast Developer settings',
        endpoints: {
            post: 'POST /api/warpcast/post - Post a cast to Farcaster via Warpcast',
        },
    })
}
