#!/usr/bin/env node
/**
 * Register Farcaster Signer Key On-Chain
 * 
 * This script registers your Ed25519 public key with your Farcaster FID
 * via the KeyGateway contract on Optimism.
 * 
 * Prerequisites:
 *   - FARCASTER_FID: Your Farcaster ID
 *   - FARCASTER_PRIVATE_KEY: Your Ed25519 private key (generated earlier)
 *   - OPTIMISM_PRIVATE_KEY: Your Ethereum wallet private key (for gas)
 *   - OPTIMISM_RPC_URL: Optimism mainnet RPC (default: public RPC)
 * 
 * Usage:
 *   npx tsx scripts/register-farcaster-key.ts
 */

import { createWalletClient, createPublicClient, http, parseAbi } from 'viem'
import { optimism } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import * as ed from '@noble/ed25519'

// Farcaster KeyGateway contract on Optimism
const KEY_GATEWAY_ADDRESS = '0x00000000fc56947c7e7183f8ca4b62398caadf0b' as const

// KeyGateway ABI (minimal, just add function)
const KEY_GATEWAY_ABI = parseAbi([
    'function add(uint32 keyType, bytes calldata key, uint8 metadataType, bytes calldata metadata) external',
    'function keyRegistry() external view returns (address)',
])

// Key types
const KEY_TYPE_SIGNER = 1 // Ed25519 signer key
const METADATA_TYPE_SIGNED = 1 // Signed key request

async function main() {
    console.log('🔐 Registering Farcaster Signer Key On-Chain\n')

    // Get environment variables
    const fid = parseInt(process.env.FARCASTER_FID || '0')
    const signerPrivateKey = process.env.FARCASTER_PRIVATE_KEY || ''
    const walletPrivateKey = process.env.OPTIMISM_PRIVATE_KEY || ''
    const rpcUrl = process.env.OPTIMISM_RPC_URL || 'https://mainnet.optimism.io'

    // Validation
    if (!fid) {
        console.error('❌ FARCASTER_FID is required')
        process.exit(1)
    }
    if (!signerPrivateKey) {
        console.error('❌ FARCASTER_PRIVATE_KEY is required')
        process.exit(1)
    }
    if (!walletPrivateKey) {
        console.error('❌ OPTIMISM_PRIVATE_KEY is required (Ethereum wallet for gas)')
        console.log('\nThis should be the private key of your custody address (the wallet you used to create your Farcaster account)')
        process.exit(1)
    }

    // Get public key from signer private key
    const cleanSignerKey = signerPrivateKey.startsWith('0x') ? signerPrivateKey.slice(2) : signerPrivateKey
    const signerPrivateKeyBytes = Buffer.from(cleanSignerKey, 'hex')
    const publicKey = await ed.getPublicKeyAsync(signerPrivateKeyBytes)
    const publicKeyHex = `0x${Buffer.from(publicKey).toString('hex')}`

    console.log('━'.repeat(60))
    console.log(`📋 FID:            ${fid}`)
    console.log(`🔑 Public Key:     ${publicKeyHex}`)
    console.log(`🌐 RPC:            ${rpcUrl}`)
    console.log('━'.repeat(60))

    // Setup wallet client - validate and clean the private key
    let cleanWalletKey = walletPrivateKey.trim()
    cleanWalletKey = cleanWalletKey.startsWith('0x') ? cleanWalletKey : `0x${cleanWalletKey}`

    // Validate key length (should be 66 chars with 0x prefix, or 64 without)
    if (cleanWalletKey.length !== 66) {
        console.error(`❌ Invalid OPTIMISM_PRIVATE_KEY length: ${cleanWalletKey.length} chars (expected 66)`)
        console.log('   Private key should be 64 hex characters (or 66 with 0x prefix)')
        console.log(`   Current key starts with: ${cleanWalletKey.slice(0, 10)}...`)
        process.exit(1)
    }

    // Validate hex format
    if (!/^0x[0-9a-fA-F]{64}$/.test(cleanWalletKey)) {
        console.error('❌ Invalid OPTIMISM_PRIVATE_KEY format')
        console.log('   Must be valid hex string')
        process.exit(1)
    }

    const account = privateKeyToAccount(cleanWalletKey as `0x${string}`)

    console.log(`\n💳 Wallet Address: ${account.address}`)

    const publicClient = createPublicClient({
        chain: optimism,
        transport: http(rpcUrl),
    })

    const walletClient = createWalletClient({
        chain: optimism,
        transport: http(rpcUrl),
        account,
    })

    // Check wallet balance
    const balance = await publicClient.getBalance({ address: account.address })
    const balanceEth = Number(balance) / 1e18
    console.log(`💰 Balance:        ${balanceEth.toFixed(6)} ETH`)

    if (balanceEth < 0.001) {
        console.error('\n❌ Insufficient balance. Need at least 0.001 ETH on Optimism for gas.')
        console.log('   Get ETH on Optimism from: https://app.optimism.io/bridge')
        process.exit(1)
    }

    // Empty metadata for simple key add
    const metadata = '0x' as `0x${string}`

    console.log('\n📤 Sending transaction to KeyGateway...')

    try {
        const hash = await walletClient.writeContract({
            address: KEY_GATEWAY_ADDRESS,
            abi: KEY_GATEWAY_ABI,
            functionName: 'add',
            args: [KEY_TYPE_SIGNER, publicKeyHex as `0x${string}`, METADATA_TYPE_SIGNED, metadata],
        })

        console.log(`\n✅ Transaction sent!`)
        console.log(`📝 Hash: ${hash}`)
        console.log(`🔗 View: https://optimistic.etherscan.io/tx/${hash}`)

        console.log('\n⏳ Waiting for confirmation...')
        const receipt = await publicClient.waitForTransactionReceipt({ hash })

        if (receipt.status === 'success') {
            console.log('\n🎉 Key registered successfully!')
            console.log('\n📝 Your key is now active. You can post to Farcaster!')
        } else {
            console.error('\n❌ Transaction failed')
            process.exit(1)
        }
    } catch (error) {
        console.error('\n❌ Error:', error)
        process.exit(1)
    }
}

main().catch(console.error)
