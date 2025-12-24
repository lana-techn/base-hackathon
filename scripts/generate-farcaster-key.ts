#!/usr/bin/env node
/**
 * Generate Ed25519 Key Pair for Farcaster Direct Hub
 * 
 * Usage:
 *   npx tsx scripts/generate-farcaster-key.ts
 * 
 * This generates a new Ed25519 key pair for posting to Farcaster Hub.
 * WARNING: The private key must be registered with your FID on-chain to work.
 */

import { randomBytes } from 'crypto'
import * as ed from '@noble/ed25519'

async function main() {
    console.log('🔐 Generating Farcaster Ed25519 Key Pair...\n')

    // Generate key pair - use crypto.randomBytes for private key
    const privateKey = randomBytes(32)
    const publicKey = await ed.getPublicKeyAsync(privateKey)

    const privateKeyHex = Buffer.from(privateKey).toString('hex')
    const publicKeyHex = Buffer.from(publicKey).toString('hex')

    console.log('━'.repeat(60))
    console.log('✅ Key Pair Generated!\n')
    console.log(`🔑 Private Key (KEEP SECRET!):\n   0x${privateKeyHex}\n`)
    console.log(`📋 Public Key:\n   0x${publicKeyHex}`)
    console.log('━'.repeat(60))

    console.log('\n⚠️  IMPORTANT: To use this key for posting:\n')
    console.log('1. You need your Farcaster FID (find at warpcast.com/~/settings)')
    console.log('2. Register this public key with your FID on-chain')
    console.log('   - Use the Farcaster KeyRegistry contract')
    console.log('   - Or use a tool like farcaster.group/keys')
    console.log('')
    console.log('3. Add to your .env.local:\n')
    console.log('━'.repeat(60))
    console.log(`FARCASTER_FID=your_fid_number`)
    console.log(`FARCASTER_PRIVATE_KEY=0x${privateKeyHex}`)
    console.log('━'.repeat(60))
    console.log('')
    console.log('📚 More info: https://docs.farcaster.xyz/developers/guides/signing-messages')
}

main().catch(console.error)
