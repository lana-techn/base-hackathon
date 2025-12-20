import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

// Get environment variables
const baseRpcUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'
const baseTestnetRpcUrl = process.env.NEXT_PUBLIC_BASE_TESTNET_RPC_URL || 'https://sepolia.base.org'

export const config = getDefaultConfig({
  appName: 'BethNa AI Trader',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'bethna-ai-trader',
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(baseRpcUrl),
    [baseSepolia.id]: http(baseTestnetRpcUrl),
  },
  ssr: true,
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}