/**
 * Twitter API Client for BethNa AI Trader
 * Uses twitter-api-v2 library for proper OAuth 1.0a authentication
 */

import { TwitterApi } from 'twitter-api-v2'

interface TweetResult {
    success: boolean
    tweetId?: string
    tweetUrl?: string
    error?: string
}

/**
 * Create Twitter client from environment variables
 */
export function createTwitterClient(): TwitterApi {
    const apiKey = process.env.TWITTER_API_KEY
    const apiSecret = process.env.TWITTER_API_SECRET
    const accessToken = process.env.TWITTER_ACCESS_TOKEN
    const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET

    if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
        throw new Error('Twitter API credentials not configured. Set TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET')
    }

    return new TwitterApi({
        appKey: apiKey,
        appSecret: apiSecret,
        accessToken: accessToken,
        accessSecret: accessTokenSecret,
    })
}

/**
 * Post a tweet
 */
export async function postTweet(text: string): Promise<TweetResult> {
    try {
        const client = createTwitterClient()
        const result = await client.v2.tweet(text)

        return {
            success: true,
            tweetId: result.data.id,
            tweetUrl: `https://twitter.com/i/status/${result.data.id}`
        }
    } catch (error) {
        console.error('[Twitter] Post error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error posting tweet'
        }
    }
}

/**
 * Check if Twitter is configured
 */
export function isTwitterConfigured(): boolean {
    return !!(
        process.env.TWITTER_API_KEY &&
        process.env.TWITTER_API_SECRET &&
        process.env.TWITTER_ACCESS_TOKEN &&
        process.env.TWITTER_ACCESS_TOKEN_SECRET
    )
}
