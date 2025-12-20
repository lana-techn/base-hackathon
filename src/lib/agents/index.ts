/**
 * Agent Swarm Index
 * Exports all agents for easy importing
 */

export { EnhancedAlphaAgent, enhancedAlphaAgent } from './alpha-agent'
export type { AIMarketData, AlphaAnalysis, AlphaOptionRecommendation } from './alpha-agent'

export { BetaAgent, betaAgent, BETA_SYSTEM_PROMPT } from './beta-agent'
export type { TradeEvaluation, TradeExecution, BetaAgentConfig } from './beta-agent'

export { GammaAgent, gammaAgent } from './gamma-agent'
export type { TradeEventData, SocialPost } from './gamma-agent'
