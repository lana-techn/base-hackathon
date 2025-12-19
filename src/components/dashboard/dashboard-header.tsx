'use client'

import { ConnectWallet } from '@coinbase/onchainkit/wallet'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export function DashboardHeader() {
  return (
    <header className="h-16 bg-card/80 backdrop-blur-sm border-b border-border flex items-center justify-between px-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Trading Dashboard</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">
          Base Network
        </div>
        <ThemeToggle />
        <ConnectWallet />
      </div>
    </header>
  )
}