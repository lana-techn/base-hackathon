/**
 * Agent Alpha API Client
 * Connects to the Python FastAPI service for market analysis
 */

const AGENT_ALPHA_BASE_URL = process.env.NEXT_PUBLIC_AGENT_ALPHA_URL || 'http://localhost:8000';

// ============ Types ============

export interface CandlestickData {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface IndicatorsData {
    rsi: number;
    bollinger_upper: number;
    bollinger_middle: number;
    bollinger_lower: number;
    current_price: number;
    price_position: 'UPPER' | 'MIDDLE' | 'LOWER';
}

export interface AnalysisResponse {
    signal: 'BUY_CALL' | 'BUY_PUT' | 'HOLD' | 'CLOSE_POSITION';
    confidence: number;
    win_rate: number;
    reasoning: string;
    indicators: IndicatorsData;
    timestamp: string;
}

export interface CandlesResponse {
    symbol: string;
    interval: string;
    candles: CandlestickData[];
    count: number;
}

export interface HealthResponse {
    status: string;
    timestamp: string;
    version: string;
}

// ============ API Client ============

class AgentAlphaClient {
    private baseUrl: string;

    constructor(baseUrl: string = AGENT_ALPHA_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    /**
     * Check if Agent Alpha service is healthy
     */
    async checkHealth(): Promise<HealthResponse> {
        const response = await fetch(`${this.baseUrl}/health`);
        if (!response.ok) {
            throw new Error('Agent Alpha service is not responding');
        }
        return response.json();
    }

    /**
     * Fetch historical candlestick data
     */
    async getCandles(
        symbol: string = 'ETH/USDT',
        interval: string = '1h',
        limit: number = 100
    ): Promise<CandlesResponse> {
        const params = new URLSearchParams({
            symbol,
            interval,
            limit: limit.toString(),
        });

        const response = await fetch(`${this.baseUrl}/candles?${params}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch candles: ${response.statusText}`);
        }
        return response.json();
    }

    /**
     * Get current technical indicators
     */
    async getIndicators(
        symbol: string = 'ETH/USDT',
        interval: string = '1h'
    ): Promise<IndicatorsData> {
        const params = new URLSearchParams({ symbol, interval });

        const response = await fetch(`${this.baseUrl}/indicators?${params}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch indicators: ${response.statusText}`);
        }
        return response.json();
    }

    /**
     * Run full market analysis and get trading signal
     */
    async analyzeMarket(
        symbol: string = 'ETH/USDT',
        interval: string = '1h'
    ): Promise<AnalysisResponse> {
        const params = new URLSearchParams({ symbol, interval });

        const response = await fetch(`${this.baseUrl}/analyze?${params}`);
        if (!response.ok) {
            throw new Error(`Failed to analyze market: ${response.statusText}`);
        }
        return response.json();
    }

    /**
     * Get quick trading signal
     */
    async getSignal(symbol: string = 'ETH/USDT'): Promise<{
        signal: string;
        confidence: number;
        timestamp: string;
    }> {
        const params = new URLSearchParams({ symbol });

        const response = await fetch(`${this.baseUrl}/signal?${params}`);
        if (!response.ok) {
            throw new Error(`Failed to get signal: ${response.statusText}`);
        }
        return response.json();
    }
}

// Export singleton instance
export const agentAlpha = new AgentAlphaClient();

// Export class for custom instances
export { AgentAlphaClient };
