import { NextRequest, NextResponse } from 'next/server'
import { agentChat, AlphaAgent, GammaAgent, AGENT_PROMPTS, AIMarketData } from '@/lib/ai-agents'
import type { ChatMessage } from '@/lib/openrouter'

export const runtime = 'edge'

interface ChatRequestBody {
    message: string
    agent?: 'ALPHA' | 'BETA' | 'GAMMA'
    history?: ChatMessage[]
    action?: 'analyze' | 'post' | 'chat'
    marketData?: AIMarketData
}

export async function POST(request: NextRequest) {
    try {
        const body: ChatRequestBody = await request.json()
        const { message, agent = 'ALPHA', history = [], action = 'chat', marketData } = body

        // Check for API key
        if (!process.env.OPENROUTER_API_KEY) {
            return NextResponse.json(
                { error: 'OpenRouter API key not configured' },
                { status: 500 }
            )
        }

        let response: any

        switch (action) {
            case 'analyze':
                if (!marketData) {
                    return NextResponse.json(
                        { error: 'Market data required for analysis' },
                        { status: 400 }
                    )
                }
                const alphaAgent = new AlphaAgent()
                response = await alphaAgent.analyzeMarket(marketData)
                break

            case 'post':
                const gammaAgent = new GammaAgent()
                if (marketData) {
                    response = { post: await gammaAgent.generateMarketCommentary(marketData) }
                } else {
                    response = {
                        post: await gammaAgent.generateTradePost({
                            action: 'trade',
                            symbol: 'ETH',
                            price: 0,
                        })
                    }
                }
                break

            case 'chat':
            default:
                const chatResponse = await agentChat(agent, message, history)
                response = {
                    message: chatResponse,
                    agent,
                    timestamp: Date.now()
                }
                break
        }

        return NextResponse.json({
            success: true,
            data: response,
        })
    } catch (error) {
        console.error('AI Chat API error:', error)
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                success: false
            },
            { status: 500 }
        )
    }
}

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        model: 'kwaipilot/kat-coder-pro:free',
        agents: Object.keys(AGENT_PROMPTS),
        endpoints: {
            chat: 'POST /api/ai/chat - Send a message to an AI agent',
            analyze: 'POST /api/ai/chat with action=analyze - Analyze market data',
            post: 'POST /api/ai/chat with action=post - Generate social media post',
        }
    })
}
