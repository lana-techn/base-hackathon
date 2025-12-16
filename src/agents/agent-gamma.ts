/**
 * Agent Gamma - Social Engagement Engine
 * Monitors blockchain events and posts to Farcaster/Twitter
 */

import { type Hash, type Address, parseAbiItem, type Log } from 'viem'
import { createBasePublicClient } from '@/lib/blockchain'
import { NeynarClient, createNeynarClient, type FarcasterCastResponse } from '@/lib/neynar'
import { OpenRouterClient, createOpenRouterClient } from '@/lib/openrouter'
import { sentientTraderABI, getContractConfig } from '@/config/contracts'
import { type AgentMessage, type TradeEvent } from '@/types'

// ============ Types ============

export interface AgentGammaConfig {
    isTestnet: boolean
    enableFarcaster: boolean
    enableTwitter: boolean
    contentStyle: 'PROFESSIONAL' | 'CASUAL' | 'AGGRESSIVE'
    cooldownMs: number // Minimum time between posts
}

export interface SocialPost {
    platform: 'FARCASTER' | 'TWITTER'
    content: string
    txHash?: string
    success: boolean
    postId?: string
    timestamp: number
}

export interface TradeEventData {
    trader: Address
    optionToken: Address
    amountIn: bigint
    amountOut: bigint
    action: string
    txHash: Hash
    blockNumber: bigint
}

// ============ Constants ============

const DEFAULT_CONFIG: AgentGammaConfig = {
    isTestnet: true,
    enableFarcaster: true,
    enableTwitter: false, // Twitter API requires more setup
    contentStyle: 'CASUAL',
    cooldownMs: 60000 // 1 minute cooldown between posts
}

const CONTENT_TEMPLATES = {
    PROFESSIONAL: {
        open_call: 'Executed long call position on ETH. Entry: ${amount} USDC. Market analysis indicates bullish setup. 📈',
        open_put: 'Executed long put position on ETH. Entry: ${amount} USDC. Market analysis indicates bearish setup. 📉',
        close: 'Closed position with ${pnl}% PnL. Total ${action}. Transaction: ${txLink}',
    },
    CASUAL: {
        open_call: 'just aped into an ETH call 📈 ${amount} USDC in. lets see how this plays out! 🎰',
        open_put: 'bearish vibes rn 📉 got me a put on ETH for ${amount} USDC. lfg',
        close: 'closed my position! ${pnl}% ${pnlEmoji} not bad for a robot trader 🤖 tx: ${txLink}',
    },
    AGGRESSIVE: {
        open_call: '🚀 BULLISH AF! Just loaded up on ETH calls with ${amount} USDC. NGMI if you\'re not long rn! 💪',
        open_put: '📉 Shorting this market into the ground! ${amount} USDC on ETH puts. Bears eating good! 🐻',
        close: '${pnl}% PnL SECURED! 💰 ${pnlEmoji} This is what AI trading looks like! tx: ${txLink}',
    }
}

// ============ Agent Gamma Class ============

export class AgentGamma {
    private config: AgentGammaConfig
    private neynarClient: NeynarClient | null = null
    private aiClient: OpenRouterClient | null = null
    private lastPostTime: number = 0
    private messageLog: AgentMessage[] = []
    private postHistory: SocialPost[] = []

    constructor(config: Partial<AgentGammaConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config }
        this.initializeClients()
    }

    private initializeClients(): void {
        try {
            if (this.config.enableFarcaster) {
                this.neynarClient = createNeynarClient()
                this.log('INFO', 'Farcaster client initialized')
            }
        } catch (error) {
            this.log('ERROR', `Farcaster init failed: ${(error as Error).message}`)
        }

        try {
            this.aiClient = createOpenRouterClient()
            this.log('INFO', 'AI content generator initialized')
        } catch (error) {
            this.log('ERROR', `AI client init failed: ${(error as Error).message}`)
        }
    }

    // ============ Event Monitoring ============

    /**
     * Start watching for TradeExecuted events
     */
    async watchTradeEvents(onEvent: (event: TradeEventData) => void): Promise<() => void> {
        const publicClient = createBasePublicClient(this.config.isTestnet)
        const chainId = this.config.isTestnet ? 84532 : 8453
        const contractConfig = getContractConfig(chainId)

        this.log('INFO', `Watching TradeExecuted events on ${this.config.isTestnet ? 'Base Sepolia' : 'Base Mainnet'}`)

        const unwatch = publicClient.watchContractEvent({
            address: contractConfig.sentientTrader,
            abi: sentientTraderABI,
            eventName: 'TradeExecuted',
            onLogs: (logs) => {
                for (const log of logs) {
                    const eventData = this.parseTradeEvent(log)
                    if (eventData) {
                        this.log('INFO', `Trade detected: ${eventData.action}`)
                        onEvent(eventData)
                    }
                }
            }
        })

        return unwatch
    }

    /**
     * Parse TradeExecuted log
     */
    private parseTradeEvent(log: Log): TradeEventData | null {
        try {
            // Extract event args from log
            const args = (log as any).args
            if (!args) return null

            return {
                trader: args.trader,
                optionToken: args.optionToken,
                amountIn: args.amountIn,
                amountOut: args.amountOut,
                action: args.action || 'UNKNOWN',
                txHash: log.transactionHash!,
                blockNumber: log.blockNumber!
            }
        } catch (error) {
            this.log('ERROR', `Failed to parse event: ${(error as Error).message}`)
            return null
        }
    }

    // ============ Content Generation ============

    /**
     * Generate social content for a trade event
     */
    async generateContent(event: TradeEventData): Promise<string> {
        const template = this.getTemplate(event.action)
        const txLink = this.getTxLink(event.txHash)
        const amount = (Number(event.amountIn) / 1e6).toFixed(2) // USDC has 6 decimals

        // Calculate PnL if closing position
        const pnl = event.action === 'CLOSE_POSITION'
            ? ((Number(event.amountOut) - Number(event.amountIn)) / Number(event.amountIn) * 100).toFixed(1)
            : '0'
        const pnlEmoji = Number(pnl) >= 0 ? '🟢' : '🔴'

        // Replace placeholders
        let content = template
            .replace('${amount}', amount)
            .replace('${txLink}', txLink)
            .replace('${pnl}', pnl)
            .replace('${pnlEmoji}', pnlEmoji)
            .replace('${action}', event.action)

        // Optionally enhance with AI
        if (this.aiClient && Math.random() < 0.3) { // 30% chance for AI enhancement
            try {
                content = await this.enhanceWithAI(content, event)
            } catch {
                // Keep original if AI fails
            }
        }

        return content
    }

    private getTemplate(action: string): string {
        const templates = CONTENT_TEMPLATES[this.config.contentStyle]

        if (action === 'OPEN_LONG_CALL') return templates.open_call
        if (action === 'OPEN_LONG_PUT') return templates.open_put
        return templates.close
    }

    private getTxLink(txHash: Hash): string {
        const baseUrl = this.config.isTestnet
            ? 'https://sepolia.basescan.org/tx/'
            : 'https://basescan.org/tx/'
        return `${baseUrl}${txHash}`
    }

    /**
     * Enhance content with AI
     */
    private async enhanceWithAI(baseContent: string, event: TradeEventData): Promise<string> {
        if (!this.aiClient) return baseContent

        const prompt = `Rewrite this crypto trading update in a ${this.config.contentStyle.toLowerCase()} tone. 
Keep it under 280 characters. Keep the emoji and vibe. Don't change the facts:

"${baseContent}"

Just output the rewritten text, nothing else.`

        const enhanced = await this.aiClient.ask(prompt)
        return enhanced.length > 0 && enhanced.length < 300 ? enhanced : baseContent
    }

    // ============ Social Posting ============

    /**
     * Post to Farcaster
     */
    async postToFarcaster(content: string, txHash?: Hash): Promise<SocialPost> {
        const post: SocialPost = {
            platform: 'FARCASTER',
            content,
            txHash,
            success: false,
            timestamp: Date.now()
        }

        if (!this.neynarClient) {
            this.log('ERROR', 'Farcaster client not initialized')
            return post
        }

        // Check cooldown
        if (Date.now() - this.lastPostTime < this.config.cooldownMs) {
            this.log('INFO', 'Post skipped - cooldown active')
            return post
        }

        try {
            const embeds = txHash ? [{ url: this.getTxLink(txHash) }] : undefined
            const response = await this.neynarClient.postCast({ text: content, embeds })

            if (response.success) {
                post.success = true
                post.postId = response.hash
                this.lastPostTime = Date.now()
                this.log('SOCIAL', `Posted to Farcaster: ${response.hash}`)
            } else {
                this.log('ERROR', `Farcaster post failed: ${response.error}`)
            }
        } catch (error) {
            this.log('ERROR', `Farcaster error: ${(error as Error).message}`)
        }

        this.postHistory.push(post)
        return post
    }

    /**
     * Handle trade event - generate content and post
     */
    async handleTradeEvent(event: TradeEventData): Promise<SocialPost | null> {
        try {
            const content = await this.generateContent(event)
            this.log('SOCIAL', `Generated content: ${content}`)

            if (this.config.enableFarcaster) {
                return await this.postToFarcaster(content, event.txHash)
            }

            return null
        } catch (error) {
            this.log('ERROR', `Failed to handle trade event: ${(error as Error).message}`)
            return null
        }
    }

    // ============ Data Access ============

    /**
     * Get message log
     */
    getMessageLog(): AgentMessage[] {
        return [...this.messageLog]
    }

    /**
     * Get recent messages
     */
    getRecentMessages(count: number = 20): AgentMessage[] {
        return this.messageLog.slice(-count)
    }

    /**
     * Get post history
     */
    getPostHistory(): SocialPost[] {
        return [...this.postHistory]
    }

    // ============ Helper Methods ============

    private log(type: AgentMessage['type'], content: string): void {
        const message: AgentMessage = {
            agent: 'GAMMA',
            message: content,
            timestamp: Date.now(),
            type
        }
        this.messageLog.push(message)
        console.log(`[Agent Gamma] ${type}: ${content}`)
    }

    updateConfig(newConfig: Partial<AgentGammaConfig>): void {
        this.config = { ...this.config, ...newConfig }
        this.initializeClients()
    }

    getConfig(): AgentGammaConfig {
        return { ...this.config }
    }
}

// Export singleton instance
export const agentGamma = new AgentGamma()
