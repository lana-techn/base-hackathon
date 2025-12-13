/**
 * Neynar Farcaster Client for BethNa AI Trader
 * Handles posting to Farcaster via Neynar API
 */

import { NeynarAPIClient, Configuration } from '@neynar/nodejs-sdk'

export interface FarcasterPostOptions {
    text: string
    embeds?: { url: string }[]
    replyTo?: string // Hash of cast to reply to
    channelId?: string // Channel to post in
}

export interface FarcasterCastResponse {
    success: boolean
    hash?: string
    author?: {
        fid: number
        username: string
        displayName: string
    }
    text?: string
    timestamp?: string
    error?: string
}

/**
 * Neynar Farcaster Client Class
 */
export class NeynarClient {
    private client: NeynarAPIClient
    private signerUuid: string

    constructor(apiKey: string, signerUuid: string) {
        const config = new Configuration({
            apiKey,
        })
        this.client = new NeynarAPIClient(config)
        this.signerUuid = signerUuid
    }

    /**
     * Post a cast to Farcaster
     */
    async postCast(options: FarcasterPostOptions): Promise<FarcasterCastResponse> {
        try {
            const response = await this.client.publishCast({
                signerUuid: this.signerUuid,
                text: options.text,
                embeds: options.embeds,
                parent: options.replyTo,
                channelId: options.channelId,
            })

            const cast = response.cast as any // SDK types may vary

            return {
                success: true,
                hash: cast.hash,
                author: {
                    fid: cast.author?.fid || 0,
                    username: cast.author?.username || 'unknown',
                    displayName: cast.author?.display_name || cast.author?.username || 'unknown',
                },
                text: cast.text,
                timestamp: cast.timestamp || new Date().toISOString(),
            }
        } catch (error) {
            console.error('Farcaster post error:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            }
        }
    }

    /**
     * Get user information by FID
     */
    async getUser(fid: number) {
        try {
            const response = await this.client.fetchBulkUsers({ fids: [fid] })
            return response.users[0] || null
        } catch (error) {
            console.error('Error fetching user:', error)
            return null
        }
    }

    /**
     * Get cast by hash
     */
    async getCast(hash: string) {
        try {
            const response = await this.client.lookupCastByHashOrUrl({
                identifier: hash,
                type: 'hash',
            })
            return response.cast
        } catch (error) {
            console.error('Error fetching cast:', error)
            return null
        }
    }
}

/**
 * Create Neynar client instance
 */
export function createNeynarClient(): NeynarClient {
    const apiKey = process.env.NEYNAR_API_KEY
    const signerUuid = process.env.NEYNAR_SIGNER_UUID

    if (!apiKey) {
        throw new Error('NEYNAR_API_KEY is required. Get one at https://neynar.com')
    }

    if (!signerUuid) {
        throw new Error('NEYNAR_SIGNER_UUID is required. Create a signer in Neynar dashboard.')
    }

    return new NeynarClient(apiKey, signerUuid)
}

/**
 * Singleton instance for server-side usage
 */
let clientInstance: NeynarClient | null = null

export function getNeynarClient(): NeynarClient {
    if (!clientInstance) {
        clientInstance = createNeynarClient()
    }
    return clientInstance
}
