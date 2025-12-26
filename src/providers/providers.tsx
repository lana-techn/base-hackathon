'use client'

import dynamic from 'next/dynamic'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { AnimationProvider } from '@/components/providers/animation-provider'

// Dynamically import Web3Provider with SSR disabled to avoid indexedDB errors
const Web3Provider = dynamic(
  () => import('./web3-provider').then(mod => mod.Web3Provider),
  { ssr: false }
)

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AnimationProvider>
        <Web3Provider>
          {children}
        </Web3Provider>
      </AnimationProvider>
    </ThemeProvider>
  )
}