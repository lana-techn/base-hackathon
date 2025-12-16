/**
 * Blockchain Utilities for Agent Beta
 * Provides viem client creation, gas estimation, and transaction utilities
 */

import {
    createPublicClient,
    createWalletClient,
    http,
    type Address,
    type Hash,
    type TransactionReceipt,
    parseGwei,
    formatEther
} from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { privateKeyToAccount, type PrivateKeyAccount } from 'viem/accounts'

// ============ Types ============

export interface TransactionResult {
    hash: Hash
    receipt: TransactionReceipt
    success: boolean
    gasUsed: bigint
    effectiveGasPrice: bigint
}

export interface GasEstimate {
    gasLimit: bigint
    maxFeePerGas: bigint
    maxPriorityFeePerGas: bigint
    estimatedCost: bigint
}

export interface RetryConfig {
    maxRetries: number
    initialDelayMs: number
    maxDelayMs: number
    backoffMultiplier: number
}

// Use inferred types for viem clients
export type BasePublicClient = ReturnType<typeof createBasePublicClient>
export type BaseWalletClient = ReturnType<typeof createBaseWalletClient>

// ============ Constants ============

const DEFAULT_RETRY_CONFIG: RetryConfig = {
    maxRetries: 3,
    initialDelayMs: 1000,
    maxDelayMs: 10000,
    backoffMultiplier: 2
}

// ============ Client Creation ============

/**
 * Create a public client for reading blockchain data
 */
export function createBasePublicClient(isTestnet: boolean = false) {
    const chain = isTestnet ? baseSepolia : base
    const rpcUrl = isTestnet
        ? process.env.NEXT_PUBLIC_BASE_TESTNET_RPC_URL || 'https://sepolia.base.org'
        : process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'

    return createPublicClient({
        chain,
        transport: http(rpcUrl),
    })
}

/**
 * Create a wallet client for signing transactions
 * Note: In production, use proper key management (not raw private keys)
 */
export function createBaseWalletClient(
    privateKey: `0x${string}`,
    isTestnet: boolean = false
) {
    const chain = isTestnet ? baseSepolia : base
    const rpcUrl = isTestnet
        ? process.env.NEXT_PUBLIC_BASE_TESTNET_RPC_URL || 'https://sepolia.base.org'
        : process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'

    const account = privateKeyToAccount(privateKey)

    return createWalletClient({
        account,
        chain,
        transport: http(rpcUrl),
    })
}

// ============ Gas Estimation ============

/**
 * Estimate gas for a transaction with buffer
 */
export async function estimateGas(
    publicClient: BasePublicClient,
    to: Address,
    data: `0x${string}`,
    value: bigint = 0n,
    bufferPercentage: number = 20
): Promise<GasEstimate> {
    // Get current gas prices
    const feeData = await publicClient.estimateFeesPerGas()

    // Estimate gas limit
    const gasLimit = await publicClient.estimateGas({
        to,
        data,
        value,
    })

    // Add buffer to gas limit
    const gasLimitWithBuffer = gasLimit + (gasLimit * BigInt(bufferPercentage) / 100n)

    const maxFeePerGas = feeData.maxFeePerGas || parseGwei('0.001')
    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas || parseGwei('0.0001')

    const estimatedCost = gasLimitWithBuffer * maxFeePerGas

    return {
        gasLimit: gasLimitWithBuffer,
        maxFeePerGas,
        maxPriorityFeePerGas,
        estimatedCost
    }
}

// ============ Transaction Execution ============

/**
 * Execute a transaction with retry logic
 */
export async function executeTransaction(
    publicClient: BasePublicClient,
    walletClient: BaseWalletClient,
    to: Address,
    data: `0x${string}`,
    value: bigint = 0n,
    retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<TransactionResult> {
    let lastError: Error | null = null
    let delay = retryConfig.initialDelayMs

    for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
        try {
            // Estimate gas
            const gasEstimate = await estimateGas(publicClient, to, data, value)

            // Get account from wallet client
            const account = walletClient.account
            if (!account) {
                throw new Error('No account available in wallet client')
            }

            // Send transaction
            const hash = await walletClient.sendTransaction({
                account,
                chain: walletClient.chain,
                to,
                data,
                value,
                gas: gasEstimate.gasLimit,
                maxFeePerGas: gasEstimate.maxFeePerGas,
                maxPriorityFeePerGas: gasEstimate.maxPriorityFeePerGas,
            })

            // Wait for confirmation
            const receipt = await publicClient.waitForTransactionReceipt({
                hash,
                confirmations: 1
            })

            return {
                hash,
                receipt,
                success: receipt.status === 'success',
                gasUsed: receipt.gasUsed,
                effectiveGasPrice: receipt.effectiveGasPrice
            }

        } catch (error) {
            lastError = error as Error

            // Don't retry on certain errors
            if (isNonRetryableError(error)) {
                throw error
            }

            // Wait before retry with exponential backoff
            if (attempt < retryConfig.maxRetries) {
                await sleep(delay)
                delay = Math.min(delay * retryConfig.backoffMultiplier, retryConfig.maxDelayMs)
            }
        }
    }

    throw lastError || new Error('Transaction failed after max retries')
}

/**
 * Monitor pending transaction
 */
export async function monitorTransaction(
    publicClient: BasePublicClient,
    hash: Hash,
    timeoutMs: number = 60000
): Promise<TransactionReceipt> {
    const startTime = Date.now()

    while (Date.now() - startTime < timeoutMs) {
        try {
            const receipt = await publicClient.getTransactionReceipt({ hash })
            if (receipt) {
                return receipt
            }
        } catch {
            // Transaction not yet mined
        }

        await sleep(2000)
    }

    throw new Error(`Transaction ${hash} not confirmed within ${timeoutMs}ms`)
}

// ============ Helper Functions ============

function isNonRetryableError(error: unknown): boolean {
    const errorMessage = (error as Error)?.message?.toLowerCase() || ''

    // Non-retryable error patterns
    const nonRetryablePatterns = [
        'insufficient funds',
        'nonce too low',
        'replacement transaction underpriced',
        'execution reverted',
        'user rejected',
        'invalid signature'
    ]

    return nonRetryablePatterns.some(pattern => errorMessage.includes(pattern))
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Format gas cost for display
 */
export function formatGasCost(wei: bigint): string {
    return `${formatEther(wei)} ETH`
}

/**
 * Get current chain ID
 */
export async function getChainId(publicClient: BasePublicClient): Promise<number> {
    return publicClient.getChainId()
}

/**
 * Check if address has sufficient balance
 */
export async function checkBalance(
    publicClient: BasePublicClient,
    address: Address,
    requiredAmount: bigint
): Promise<boolean> {
    const balance = await publicClient.getBalance({ address })
    return balance >= requiredAmount
}
