/**
 * Farcaster Direct Hub Client
 * Posts directly to Farcaster Hub without Neynar (free alternative)
 * 
 * Requirements:
 * - FARCASTER_FID: Your Farcaster ID (number)
 * - FARCASTER_PRIVATE_KEY: Ed25519 private key (hex string)
 * - FARCASTER_HUB_URL: Hub URL (default: hub.farcaster.standardcrypto.vc:2283)
 */

import {
    getSSLHubRpcClient,
    makeCastAdd,
    NobleEd25519Signer,
    FarcasterNetwork,
    CastType,
} from '@farcaster/hub-nodejs'
import * as ed from '@noble/ed25519'

interface CastResult {
    success: boolean
    hash?: string
    error?: string
}

/**
 * Create Ed25519 signer from private key
 */
async function createSigner(privateKeyHex: string): Promise<NobleEd25519Signer> {
    // Remove 0x prefix if present
    const cleanKey = privateKeyHex.startsWith('0x') ? privateKeyHex.slice(2) : privateKeyHex
    const privateKeyBytes = Buffer.from(cleanKey, 'hex')
    return new NobleEd25519Signer(privateKeyBytes)
}

/**
 * Post a cast to Farcaster Hub
 */
export async function postCastToHub(text: string): Promise<CastResult> {
    try {
        // Get configuration from environment
        const fid = parseInt(process.env.FARCASTER_FID || '0')
        const privateKey = process.env.FARCASTER_PRIVATE_KEY || ''
        const hubUrl = process.env.FARCASTER_HUB_URL || 'nemes.farcaster.xyz:2283'

        if (!fid || !privateKey) {
            return {
                success: false,
                error: 'FARCASTER_FID and FARCASTER_PRIVATE_KEY are required'
            }
        }

        // Create signer
        const signer = await createSigner(privateKey)

        // Connect to Hub
        const hubClient = getSSLHubRpcClient(hubUrl)

        // Create cast message
        const castAddResult = await makeCastAdd(
            {
                text,
                embeds: [],
                embedsDeprecated: [],
                mentions: [],
                mentionsPositions: [],
                parentCastId: undefined,
                parentUrl: undefined,
                type: CastType.CAST,
            },
            {
                fid,
                network: FarcasterNetwork.MAINNET,
            },
            signer
        )

        if (castAddResult.isErr()) {
            return {
                success: false,
                error: `Failed to create cast: ${castAddResult.error.message}`
            }
        }

        // Submit to Hub
        const submitResult = await hubClient.submitMessage(castAddResult.value)

        if (submitResult.isErr()) {
            return {
                success: false,
                error: `Failed to submit cast: ${submitResult.error.message}`
            }
        }

        // Get the hash
        const hash = Buffer.from(submitResult.value.hash).toString('hex')

        return {
            success: true,
            hash
        }
    } catch (error) {
        console.error('[Farcaster Hub] Error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

/**
 * Generate a new Ed25519 key pair for Farcaster
 */
export async function generateFarcasterKeyPair(): Promise<{
    privateKey: string
    publicKey: string
}> {
    // Use crypto.randomBytes for ed25519 v3 compatibility
    const { randomBytes } = await import('crypto')
    const privateKey = randomBytes(32)
    const publicKey = await ed.getPublicKeyAsync(privateKey)

    return {
        privateKey: Buffer.from(privateKey).toString('hex'),
        publicKey: Buffer.from(publicKey).toString('hex')
    }
}

/**
 * Check if Farcaster Hub is configured
 */
export function isFarcasterHubConfigured(): boolean {
    return !!(
        process.env.FARCASTER_FID &&
        process.env.FARCASTER_PRIVATE_KEY
    )
}
