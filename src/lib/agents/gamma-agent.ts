/**
 * Agent Gamma - Social Engagement Agent
 * Monitors trades and posts to Twitter/Farcaster
 */

import { OpenRouterClient, createOpenRouterClient } from '../openrouter'
import { ParsedOption } from '@/types/thetanuts'

// ============ Types ============

export interface TradeEventData {
    action: 'OPEN' | 'CLOSE'
    optionType: 'CALL' | 'PUT'
    ticker: string
    asset: 'ETH' | 'BTC'
    strike: number
    premium: number
    txHash: string
    pnl?: number
    pnlPercent?: number
}

export interface SocialPost {
    platform: 'twitter' | 'farcaster' | 'both'
    content: string
    txLink?: string
    hashtags: string[]
}

// ============ System Prompt ============

const GAMMA_SYSTEM_PROMPT = `You are GAMMA, the social media specialist for BethNa AI Trader.

Your personality:
- Confident but not arrogant
- Data-driven and precise
- Uses crypto slang naturally (alpha, degen, WAGMI, etc.)
- Celebrates wins, learns from losses
- Always professional

Your posts should:
- Be under 280 characters for Twitter
- Include relevant stats (P&L, strike, delta)
- Use 1-2 emojis max
- Include tx hash as proof
- Use hashtags: #BethNa #Options #Thetanuts

Format: Casual but informative, like a successful trader sharing updates.`

// ============ Gamma Agent Class ============

export class GammaAgent {
    private client: OpenRouterClient

    constructor(client?: OpenRouterClient) {
        this.client = client || createOpenRouterClient()
    }

    /**
     * Generate post for opening a trade
     */
    async generateOpenTradePost(data: TradeEventData): Promise<SocialPost> {
        const prompt = `Generate a Twitter post about opening this trade:

${data.optionType} option on ${data.asset}
Ticker: ${data.ticker}
Strike: $${data.strike}
Premium paid: $${data.premium.toFixed(2)}
Transaction: ${data.txHash.slice(0, 10)}...

Make it confident but not bragging. Include key stats. Under 280 chars.`

        const content = await this.client.ask(prompt, GAMMA_SYSTEM_PROMPT)

        return {
            platform: 'both',
            content: this.cleanContent(content),
            txLink: `https://basescan.org/tx/${data.txHash}`,
            hashtags: ['#BethNa', '#Thetanuts', `#${data.asset}`],
        }
    }

    /**
     * Generate post for closing a trade
     */
    async generateCloseTradePost(data: TradeEventData): Promise<SocialPost> {
        const isProfit = (data.pnl ?? 0) > 0
        const pnlEmoji = isProfit ? '🟢' : '🔴'

        const prompt = `Generate a Twitter post about closing this trade:

${data.optionType} option on ${data.asset}
Ticker: ${data.ticker}
P&L: ${isProfit ? '+' : ''}$${data.pnl?.toFixed(2)} (${data.pnlPercent?.toFixed(1)}%)
Transaction: ${data.txHash.slice(0, 10)}...

${isProfit ? 'Celebrate the win!' : 'Acknowledge the loss professionally.'} Under 280 chars.`

        const content = await this.client.ask(prompt, GAMMA_SYSTEM_PROMPT)

        return {
            platform: 'both',
            content: `${pnlEmoji} ${this.cleanContent(content)}`,
            txLink: `https://basescan.org/tx/${data.txHash}`,
            hashtags: ['#BethNa', '#Thetanuts', isProfit ? '#WAGMI' : '#LearnAndAdapt'],
        }
    }

    /**
     * Generate market commentary post
     */
    async generateMarketPost(
        asset: 'ETH' | 'BTC',
        price: number,
        changePercent: number,
        sentiment: 'bullish' | 'bearish' | 'neutral'
    ): Promise<SocialPost> {
        const prompt = `Generate a brief market commentary for Twitter:

${asset} currently at $${price.toFixed(2)}
24h change: ${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%
Market sentiment: ${sentiment}

Be insightful but brief. Under 200 chars. Include your view on options positioning.`

        const content = await this.client.ask(prompt, GAMMA_SYSTEM_PROMPT)

        return {
            platform: 'both',
            content: this.cleanContent(content),
            hashtags: ['#BethNa', `#${asset}`, '#CryptoOptions'],
        }
    }

    /**
     * Generate daily summary post
     */
    async generateDailySummary(stats: {
        totalTrades: number
        winRate: number
        totalPnL: number
        bestTrade?: string
    }): Promise<SocialPost> {
        const prompt = `Generate a daily trading summary for Twitter:

Total trades: ${stats.totalTrades}
Win rate: ${stats.winRate.toFixed(1)}%
Total P&L: ${stats.totalPnL > 0 ? '+' : ''}$${stats.totalPnL.toFixed(2)}
${stats.bestTrade ? `Best trade: ${stats.bestTrade}` : ''}

Make it look professional like a hedge fund report. Under 280 chars.`

        const content = await this.client.ask(prompt, GAMMA_SYSTEM_PROMPT)

        return {
            platform: 'both',
            content: this.cleanContent(content),
            hashtags: ['#BethNa', '#DailyRecap', '#AITrading'],
        }
    }

    /**
     * Format post for War Room display
     */
    formatForWarRoom(post: SocialPost): string {
        return `[GAMMA] 📣 Draft post:
"${post.content}"
${post.txLink ? `🔗 ${post.txLink}` : ''}
Tags: ${post.hashtags.join(' ')}`
    }

    /**
     * Clean AI-generated content
     */
    private cleanContent(content: string): string {
        // Remove quotes if present
        let cleaned = content.replace(/^["']|["']$/g, '')

        // Ensure under 280 chars
        if (cleaned.length > 280) {
            cleaned = cleaned.slice(0, 277) + '...'
        }

        return cleaned.trim()
    }

    /**
     * Post to Twitter (placeholder - needs API integration)
     */
    async postToTwitter(post: SocialPost): Promise<boolean> {
        console.log('[GAMMA] Would post to Twitter:', post.content)
        // TODO: Implement Twitter API v2 integration
        return true
    }

    /**
     * Post to Farcaster (uses Direct Hub - set FARCASTER_FID and FARCASTER_PRIVATE_KEY)
     */
    async postToFarcaster(post: SocialPost): Promise<boolean> {
        console.log('[GAMMA] Would post to Farcaster:', post.content)
        // TODO: Implement Direct Hub posting via /api/farcaster-hub/post
        return true
    }
}

// Export singleton instance
export const gammaAgent = new GammaAgent()
