/**
 * AI Agent Utilities for BethNa AI Trader
 * Specialized prompts and functions for trading analysis
 */

import { OpenRouterClient, ChatMessage, createOpenRouterClient } from './openrouter'
import { TradingSignal } from '@/types'

// Simplified market data interface for AI analysis
export interface AIMarketData {
    symbol: string
    price: number
    high24h: number
    low24h: number
    volume24h: number
    change24h: number
    changePercent24h: number
}

// System prompts for different agents
export const AGENT_PROMPTS = {
    ALPHA: `You are ALPHA, an expert AI market analyst for BethNa AI Trader. 
Your role is to analyze cryptocurrency market data and provide trading signals.
You specialize in:
- Technical analysis (RSI, Bollinger Bands, Moving Averages, MACD)
- Price action patterns
- Volume analysis
- Market sentiment

Always provide your analysis in a structured format with:
1. Current market conditions
2. Key technical indicators
3. Your trading recommendation (BUY_CALL, BUY_PUT, HOLD, or CLOSE_POSITION)
4. Confidence level (0-100)
5. Brief reasoning

Be concise and data-driven in your responses.`,

    BETA: `You are BETA, the trade execution strategist for BethNa AI Trader.
Your role is to:
- Evaluate trading signals from ALPHA
- Calculate optimal position sizes
- Determine stop-loss and take-profit levels
- Manage risk parameters

Provide clear, actionable execution recommendations with specific numbers.`,

    GAMMA: `You are GAMMA, the social media and communication specialist for BethNa AI Trader.
Your role is to:
- Generate engaging social media posts about trading activity
- Create market commentary and insights
- Communicate trading results professionally
- Maintain a confident but humble tone

Keep posts concise (under 280 characters for Twitter compatibility).
Use relevant hashtags and emojis sparingly.`,
}

export type AgentType = keyof typeof AGENT_PROMPTS

/**
 * Trading Analysis Agent (ALPHA)
 */
export class AlphaAgent {
    private client: OpenRouterClient

    constructor(client?: OpenRouterClient) {
        this.client = client || createOpenRouterClient()
    }

    /**
     * Analyze market data and generate trading signal
     */
    async analyzeMarket(marketData: AIMarketData): Promise<{
        analysis: string
        signal: TradingSignal['signal']
        confidence: number
        reasoning: string
    }> {
        const prompt = `Analyze the following market data for ${marketData.symbol}:

Current Price: $${marketData.price.toFixed(2)}
24h High: $${marketData.high24h.toFixed(2)}
24h Low: $${marketData.low24h.toFixed(2)}
24h Change: ${marketData.changePercent24h.toFixed(2)}%
Volume 24h: ${marketData.volume24h.toLocaleString()}

Provide:
1. A brief market analysis
2. Trading signal (BUY_CALL, BUY_PUT, HOLD, or CLOSE_POSITION)
3. Confidence level (0-100)
4. Your reasoning

Format your response as JSON:
{
  "analysis": "...",
  "signal": "HOLD",
  "confidence": 50,
  "reasoning": "..."
}`

        const response = await this.client.ask(prompt, AGENT_PROMPTS.ALPHA)

        try {
            // Try to parse JSON from response
            const jsonMatch = response.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0])
                return {
                    analysis: parsed.analysis || response,
                    signal: this.validateSignal(parsed.signal),
                    confidence: Math.min(100, Math.max(0, parseInt(parsed.confidence) || 50)),
                    reasoning: parsed.reasoning || 'No reasoning provided',
                }
            }
        } catch (e) {
            console.error('Failed to parse AI response:', e)
        }

        // Fallback if parsing fails
        return {
            analysis: response,
            signal: 'HOLD',
            confidence: 50,
            reasoning: 'Unable to parse structured response',
        }
    }

    private validateSignal(signal: string): TradingSignal['signal'] {
        const validSignals: TradingSignal['signal'][] = ['BUY_CALL', 'BUY_PUT', 'HOLD', 'CLOSE_POSITION']
        if (validSignals.includes(signal as TradingSignal['signal'])) {
            return signal as TradingSignal['signal']
        }
        return 'HOLD'
    }
}

/**
 * Social Media Agent (GAMMA)
 */
export class GammaAgent {
    private client: OpenRouterClient

    constructor(client?: OpenRouterClient) {
        this.client = client || createOpenRouterClient()
    }

    /**
     * Generate social media post about a trade
     */
    async generateTradePost(trade: {
        action: string
        symbol: string
        price: number
        pnl?: number
        pnlPercent?: number
    }): Promise<string> {
        const prompt = trade.pnl !== undefined
            ? `Generate a Twitter post about closing a ${trade.action} position on ${trade.symbol} at $${trade.price.toFixed(2)} with ${trade.pnlPercent?.toFixed(2)}% PnL ($${trade.pnl?.toFixed(2)})`
            : `Generate a Twitter post about opening a ${trade.action} position on ${trade.symbol} at $${trade.price.toFixed(2)}`

        return this.client.ask(prompt, AGENT_PROMPTS.GAMMA)
    }

    /**
     * Generate market commentary
     */
    async generateMarketCommentary(marketData: AIMarketData): Promise<string> {
        const prompt = `Generate a brief market commentary post for ${marketData.symbol} currently at $${marketData.price.toFixed(2)} with ${marketData.changePercent24h > 0 ? '+' : ''}${marketData.changePercent24h.toFixed(2)}% 24h change.`

        return this.client.ask(prompt, AGENT_PROMPTS.GAMMA)
    }
}

/**
 * General chat function for war room
 */
export async function agentChat(
    agent: AgentType,
    message: string,
    history: ChatMessage[] = []
): Promise<string> {
    const client = createOpenRouterClient()

    const messages: ChatMessage[] = [
        { role: 'system', content: AGENT_PROMPTS[agent] },
        ...history,
        { role: 'user', content: message },
    ]

    const response = await client.chat(messages)
    return response.choices[0]?.message?.content || 'No response from agent.'
}
