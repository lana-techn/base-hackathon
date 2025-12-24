/**
 * Warpcast API Client for Direct Posting
 * Uses Warpcast Developer API key directly
 */

interface WarpcastCastResult {
    success: boolean
    hash?: string
    error?: string
}

/**
 * Post a cast directly to Warpcast
 */
export async function postCastToWarpcast(text: string): Promise<WarpcastCastResult> {
    const apiKey = process.env.WARPCAST_API_KEY

    if (!apiKey) {
        return {
            success: false,
            error: 'WARPCAST_API_KEY is required'
        }
    }

    try {
        const response = await fetch('https://api.warpcast.com/v2/casts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                text
            }),
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({}))
            return {
                success: false,
                error: error.message || error.error || `Warpcast API error: ${response.status}`
            }
        }

        const result = await response.json()
        return {
            success: true,
            hash: result.result?.cast?.hash || result.hash
        }
    } catch (error) {
        console.error('[Warpcast] Post error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

/**
 * Check if Warpcast API is configured
 */
export function isWarpcastConfigured(): boolean {
    return !!process.env.WARPCAST_API_KEY
}
