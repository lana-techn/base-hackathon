import { Address } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { ContractConfig } from '@/types'

// Contract addresses for different networks
export const contractAddresses: Record<number, ContractConfig> = {
  [base.id]: {
    sentientTrader: (process.env.NEXT_PUBLIC_SENTIENT_TRADER_CONTRACT || '0x') as Address,
    thetanutsRouter: (process.env.NEXT_PUBLIC_THETANUTS_ROUTER_CONTRACT || '0x') as Address,
    chainId: base.id,
  },
  [baseSepolia.id]: {
    sentientTrader: (process.env.NEXT_PUBLIC_SENTIENT_TRADER_CONTRACT_TESTNET || '0x') as Address,
    thetanutsRouter: (process.env.NEXT_PUBLIC_THETANUTS_ROUTER_CONTRACT_TESTNET || '0x') as Address,
    chainId: baseSepolia.id,
  },
}

// Get contract config for current chain
export function getContractConfig(chainId: number): ContractConfig {
  const config = contractAddresses[chainId]
  if (!config) {
    throw new Error(`Unsupported chain ID: ${chainId}`)
  }
  return config
}

// SentientTrader Contract ABI (will be updated when contract is deployed)
export const sentientTraderABI = [
  {
    type: 'function',
    name: 'openLongCall',
    inputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'optionToken', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'openLongPut',
    inputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'optionToken', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'closePosition',
    inputs: [
      { name: 'optionToken', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'event',
    name: 'TradeExecuted',
    inputs: [
      { name: 'trader', type: 'address', indexed: true },
      { name: 'optionToken', type: 'address', indexed: true },
      { name: 'amountIn', type: 'uint256', indexed: false },
      { name: 'amountOut', type: 'uint256', indexed: false },
      { name: 'action', type: 'string', indexed: false }
    ]
  }
] as const

// Thetanuts Router ABI (simplified)
export const thetanutsRouterABI = [
  {
    type: 'function',
    name: 'swapExactInput',
    inputs: [
      { name: 'tokenIn', type: 'address' },
      { name: 'tokenOut', type: 'address' },
      { name: 'amountIn', type: 'uint256' },
      { name: 'minAmountOut', type: 'uint256' },
      { name: 'recipient', type: 'address' }
    ],
    outputs: [{ name: 'amountOut', type: 'uint256' }],
    stateMutability: 'nonpayable'
  }
] as const