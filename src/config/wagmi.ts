import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { coinbaseWallet } from 'wagmi/connectors'

// Get environment variables
const baseRpcUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'
const baseTestnetRpcUrl = process.env.NEXT_PUBLIC_BASE_TESTNET_RPC_URL || 'https://sepolia.base.org'

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'BethNa AI Trader',
      appLogoUrl: 'https://bethna.ai/logo.png',
    }),
  ],
  transports: {
    [base.id]: http(baseRpcUrl),
    [baseSepolia.id]: http(baseTestnetRpcUrl),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}