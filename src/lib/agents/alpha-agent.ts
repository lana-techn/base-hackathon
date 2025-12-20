/**
 * Enhanced Agent Alpha
 * Market Analysis Agent with Thetanuts Options Integration
 */

import { OpenRouterClient, createOpenRouterClient } from '../openrouter'
import { TradingSignal } from '@/types'
import { ParsedOption, OptionRecommendation } from '@/types/thetanuts'
import { getOptionsChain, getBestOptions, formatOptionDisplay } from '../thetanuts-api'

// ============ Types ============

export interface AIMarketData {
    symbol: string
    price: number
    high24h: number
    low24h: number
    volume24h: number
    change24h: number
    changePercent24h: number
}

export interface AlphaAnalysis {
    signal: TradingSignal['signal']
    confidence: number
    winRate: number
    reasoning: string
    timestamp: number
}

export interface AlphaOptionRecommendation extends OptionRecommendation {
    agentReasoning: string
}

// ============ Enhanced System Prompt ============

const ALPHA_SYSTEM_PROMPT = `You are ALPHA, an expert AI market analyst for BethNa AI Trader.

Your role is to analyze cryptocurrency market data and provide trading signals.
You specialize in:
- Technical analysis (RSI, Bollinger Bands, Moving Averages, MACD)
- Price action patterns
- Volume analysis
- Market sentiment

You now have access to Thetanuts V4 options data including:
- Available strikes and premiums
- Greeks (Delta, Gamma, Theta, Vega)
- Implied Volatility (IV)

When recommending BUY_CALL or BUY_PUT:
1. Select optimal strike based on risk/reward
2. Consider IV levels (high IV = expensive options)
3. Use Delta to gauge probability of profit
4. Prefer near-expiry for momentum plays, longer expiry for swing trades

Always provide your analysis in a structured format with:
1. Current market conditions
2. Key technical indicators
3. Your trading recommendation (BUY_CALL, BUY_PUT, HOLD, or CLOSE_POSITION)
4. Confidence level (0-100)
5. Brief reasoning

Be concise and data-driven in your responses.`

// ============ Alpha Agent Class ============

export class EnhancedAlphaAgent {
    private client: OpenRouterClient

    constructor(client?: OpenRouterClient) {
        this.client = client || createOpenRouterClient()
    }

    /**
     * Analyze market data and generate trading signal
     */
    async analyzeMarket(marketData: AIMarketData): Promise<AlphaAnalysis> {
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
  "signal": "HOLD",
  "confidence": 50,
  "winRate": 65,
  "reasoning": "..."
}`

        const response = await this.client.ask(prompt, ALPHA_SYSTEM_PROMPT)

        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0])
                return {
                    signal: this.validateSignal(parsed.signal),
                    confidence: Math.min(100, Math.max(0, parseInt(parsed.confidence) || 50)),
                    winRate: Math.min(100, Math.max(0, parseInt(parsed.winRate) || 65)),
                    reasoning: parsed.reasoning || 'No reasoning provided',
                    timestamp: Date.now(),
                }
            }
        } catch (e) {
            console.error('Failed to parse AI response:', e)
        }

        return {
            signal: 'HOLD',
            confidence: 50,
            winRate: 65,
            reasoning: 'Unable to parse structured response',
            timestamp: Date.now(),
        }
    }

    /**
     * Recommend best option based on signal and Thetanuts data
     */
    async recommendOption(
        signal: 'BUY_CALL' | 'BUY_PUT',
        asset: 'ETH' | 'BTC' = 'ETH'
    ): Promise<AlphaOptionRecommendation | null> {
        try {
            // Get options chain from Thetanuts
            const optionsChain = await getOptionsChain(asset)

            if (!optionsChain) {
                return null
            }

            // Get best options based on scoring algorithm
            const options = signal === 'BUY_CALL' ? optionsChain.calls : optionsChain.puts
            const bestOptions = getBestOptions(options, signal === 'BUY_CALL' ? 'CALL' : 'PUT', 3)

            if (bestOptions.length === 0) {
                return null
            }

            // Pick the top option
            const topOption = bestOptions[0]

            // Generate AI reasoning for why this option was selected
            const aiReasoning = await this.generateOptionReasoning(
                topOption,
                optionsChain.currentPrice,
                signal
            )

            // Calculate risk level based on delta and IV
            const riskLevel = this.calculateRiskLevel(topOption)

            return {
                option: topOption,
                score: this.calculateScore(topOption),
                reasoning: aiReasoning,
                riskLevel,
                agentReasoning: `Selected ${topOption.ticker} with ${(topOption.greeks.iv * 100).toFixed(1)}% IV and ${Math.abs(topOption.greeks.delta).toFixed(2)} delta. ${topOption.daysToExpiry} days to expiry.`,
            }
        } catch (error) {
            console.error('Failed to recommend option:', error)
            return null
        }
    }

    /**
     * Generate AI reasoning for option selection
     */
    private async generateOptionReasoning(
        option: ParsedOption,
        currentPrice: number,
        signal: 'BUY_CALL' | 'BUY_PUT'
    ): Promise<string> {
        const prompt = `You recommended a ${signal.replace('BUY_', '')} option:

Option: ${option.ticker}
Strike: $${option.strike}
Premium: $${option.premiumUSD.toFixed(2)}
Current ${option.asset} Price: $${currentPrice.toFixed(2)}
Days to Expiry: ${option.daysToExpiry}

Greeks:
- Delta: ${option.greeks.delta.toFixed(3)}
- IV: ${(option.greeks.iv * 100).toFixed(1)}%
- Theta: ${option.greeks.theta.toFixed(4)}
- Vega: ${option.greeks.vega.toFixed(4)}

Moneyness: ${option.moneyness}

In 2-3 sentences, explain why this is a good option for the current market conditions.`

        try {
            return await this.client.ask(prompt, ALPHA_SYSTEM_PROMPT)
        } catch {
            return `${option.moneyness} ${signal === 'BUY_CALL' ? 'call' : 'put'} with ${(option.greeks.iv * 100).toFixed(1)}% implied volatility.`
        }
    }

    /**
     * Calculate score for an option
     */
    private calculateScore(option: ParsedOption): number {
        let score = 0

        // ATM preference
        if (option.moneyness === 'ATM') score += 30
        else if (option.moneyness === 'ITM') score += 10

        // Reasonable IV
        if (option.greeks.iv >= 0.3 && option.greeks.iv <= 0.6) score += 20

        // Good delta range
        const absDelta = Math.abs(option.greeks.delta)
        if (absDelta >= 0.3 && absDelta <= 0.5) score += 25
        else if (absDelta >= 0.2 && absDelta <= 0.6) score += 15

        // Near-term expiry bonus
        if (option.daysToExpiry <= 7) score += 10
        else if (option.daysToExpiry <= 14) score += 5

        return score
    }

    /**
     * Calculate risk level
     */
    private calculateRiskLevel(option: ParsedOption): 'LOW' | 'MEDIUM' | 'HIGH' {
        const absDelta = Math.abs(option.greeks.delta)
        const iv = option.greeks.iv

        // High IV or low delta = higher risk
        if (iv > 0.7 || absDelta < 0.2) return 'HIGH'
        if (iv > 0.5 || absDelta < 0.35) return 'MEDIUM'
        return 'LOW'
    }

    /**
     * Validate signal type
     */
    private validateSignal(signal: string): TradingSignal['signal'] {
        const validSignals: TradingSignal['signal'][] = ['BUY_CALL', 'BUY_PUT', 'HOLD', 'CLOSE_POSITION']
        if (validSignals.includes(signal as TradingSignal['signal'])) {
            return signal as TradingSignal['signal']
        }
        return 'HOLD'
    }

    /**
     * Get formatted option recommendation for display
     */
    async getFormattedRecommendation(
        signal: 'BUY_CALL' | 'BUY_PUT',
        asset: 'ETH' | 'BTC' = 'ETH'
    ): Promise<string> {
        const recommendation = await this.recommendOption(signal, asset)

        if (!recommendation) {
            return 'No suitable options available'
        }

        return `📊 ${formatOptionDisplay(recommendation.option)}
Risk: ${recommendation.riskLevel}
${recommendation.agentReasoning}`
    }
}

// Export singleton instance
export const enhancedAlphaAgent = new EnhancedAlphaAgent()
