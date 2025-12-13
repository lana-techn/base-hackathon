/**
 * OpenRouter AI Client for BethNa AI Trader
 * Uses kwaipilot/kat-coder-pro:free model
 */

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant'
    content: string
}

export interface ChatCompletionResponse {
    id: string
    choices: {
        message: ChatMessage
        finish_reason: string
        index: number
    }[]
    model: string
    usage?: {
        prompt_tokens: number
        completion_tokens: number
        total_tokens: number
    }
}

export interface OpenRouterConfig {
    apiKey: string
    model?: string
    siteUrl?: string
    siteName?: string
}

// Default free model
export const DEFAULT_MODEL = 'kwaipilot/kat-coder-pro:free'

// OpenRouter API base URL
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

/**
 * OpenRouter AI Client Class
 */
export class OpenRouterClient {
    private apiKey: string
    private model: string
    private siteUrl: string
    private siteName: string

    constructor(config: OpenRouterConfig) {
        this.apiKey = config.apiKey
        this.model = config.model || DEFAULT_MODEL
        this.siteUrl = config.siteUrl || 'https://bethna-ai-trader.app'
        this.siteName = config.siteName || 'BethNa AI Trader'
    }

    /**
     * Send a chat completion request to OpenRouter
     */
    async chat(messages: ChatMessage[], options?: {
        temperature?: number
        maxTokens?: number
        topP?: number
    }): Promise<ChatCompletionResponse> {
        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': this.siteUrl,
                'X-Title': this.siteName,
            },
            body: JSON.stringify({
                model: this.model,
                messages,
                temperature: options?.temperature ?? 0.7,
                max_tokens: options?.maxTokens ?? 2048,
                top_p: options?.topP ?? 1,
            }),
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({}))
            throw new Error(
                `OpenRouter API error: ${response.status} - ${error.error?.message || response.statusText}`
            )
        }

        return response.json()
    }

    /**
     * Simple wrapper for single message chat
     */
    async ask(prompt: string, systemPrompt?: string): Promise<string> {
        const messages: ChatMessage[] = []

        if (systemPrompt) {
            messages.push({ role: 'system', content: systemPrompt })
        }

        messages.push({ role: 'user', content: prompt })

        const response = await this.chat(messages)
        return response.choices[0]?.message?.content || ''
    }
}

/**
 * Create an OpenRouter client instance
 */
export function createOpenRouterClient(apiKey?: string): OpenRouterClient {
    const key = apiKey || process.env.OPENROUTER_API_KEY

    if (!key) {
        throw new Error('OpenRouter API key is required. Set OPENROUTER_API_KEY environment variable.')
    }

    return new OpenRouterClient({ apiKey: key })
}

/**
 * Singleton instance for server-side usage
 */
let clientInstance: OpenRouterClient | null = null

export function getOpenRouterClient(): OpenRouterClient {
    if (!clientInstance) {
        clientInstance = createOpenRouterClient()
    }
    return clientInstance
}
