import { NextRequest, NextResponse } from 'next/server'
import { postTweet, isTwitterConfigured } from '@/lib/twitter'
import { GammaAgent } from '@/lib/ai-agents'

export const runtime = 'nodejs' // twitter-api-v2 requires Node.js runtime

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

        // Check for required environment variables
        if (!isTwitterConfigured()) {
            return NextResponse.json(
                {
                    error: 'Twitter not configured. Set TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET.',
                    success: false
                },
                { status: 500 }
            )
        }

        let textToPost = body.text

        // Generate content using AI if trade data is provided
        if (!textToPost && body.generateFromTrade) {
            const gammaAgent = new GammaAgent()
            textToPost = await gammaAgent.generateTradePost(body.generateFromTrade)

            // Add transaction link if available
            if (body.generateFromTrade.txHash) {
                textToPost += `\n\n🔗 https://basescan.org/tx/${body.generateFromTrade.txHash}`
            }
        }

        // Generate market commentary if market data is provided
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

        // Truncate to Twitter limit (280 chars)
        if (textToPost.length > 280) {
            textToPost = textToPost.slice(0, 277) + '...'
        }

        const result = await postTweet(textToPost)

        return NextResponse.json({
            success: result.success,
            data: result,
            text: textToPost
        })
    } catch (error) {
        console.error('Twitter post API error:', error)
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                success: false,
            },
            { status: 500 }
        )
    }
}

export async function GET() {
    const isConfigured = isTwitterConfigured()

    return NextResponse.json({
        status: isConfigured ? 'configured' : 'not_configured',
        message: isConfigured
            ? 'Twitter integration ready'
            : 'Missing Twitter API credentials. Set TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET',
        endpoints: {
            post: 'POST /api/twitter/post - Post a tweet',
        },
        features: [
            'Direct text posting',
            'AI-generated trade announcements',
            'AI-generated market commentary',
            'Transaction link embedding',
        ],
    })
}
