import { NextRequest, NextResponse } from 'next/server'
import { createNeynarClient } from '@/lib/neynar'
import { GammaAgent } from '@/lib/ai-agents'

export const runtime = 'nodejs' // Neynar SDK requires Node.js runtime

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
    embeds?: { url: string }[]
    channelId?: string
}

export async function POST(request: NextRequest) {
    try {
        const body: PostRequestBody = await request.json()

        // Check for required environment variables
        if (!process.env.NEYNAR_API_KEY || !process.env.NEYNAR_SIGNER_UUID) {
            return NextResponse.json(
                {
                    error: 'Farcaster not configured. Set NEYNAR_API_KEY and NEYNAR_SIGNER_UUID.',
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

        // Truncate to Farcaster limit (320 chars)
        if (textToPost.length > 320) {
            textToPost = textToPost.slice(0, 317) + '...'
        }

        const neynarClient = createNeynarClient()
        const result = await neynarClient.postCast({
            text: textToPost,
            embeds: body.embeds,
            channelId: body.channelId,
        })

        return NextResponse.json({
            success: result.success,
            data: result,
        })
    } catch (error) {
        console.error('Farcaster post API error:', error)
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
    const isConfigured = !!(process.env.NEYNAR_API_KEY && process.env.NEYNAR_SIGNER_UUID)

    return NextResponse.json({
        status: isConfigured ? 'configured' : 'not_configured',
        message: isConfigured
            ? 'Farcaster integration ready'
            : 'Missing NEYNAR_API_KEY or NEYNAR_SIGNER_UUID',
        endpoints: {
            post: 'POST /api/farcaster/post - Post a cast to Farcaster',
        },
        features: [
            'Direct text posting',
            'AI-generated trade announcements',
            'AI-generated market commentary',
            'Transaction link embedding',
        ],
    })
}
