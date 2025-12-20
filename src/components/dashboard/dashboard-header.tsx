'use client'

import { Search, Bell, Wifi } from 'lucide-react'
import { ConnectWallet } from '@coinbase/onchainkit/wallet'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export function DashboardHeader() {
  return (
    <header className="h-20 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tokens, pairs..."
            className="w-full h-11 pl-11 pr-4 rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Connection Status */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <Wifi className="w-4 h-4 text-success" />
          <span className="text-xs font-medium text-muted-foreground">Base</span>
        </div>

        {/* Notifications */}
        <button className="relative p-3 rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 text-muted-foreground hover:text-foreground shadow-sm transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
        </button>

        {/* Theme Toggle */}
        <div className="p-1.5 rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-sm">
          <ThemeToggle />
        </div>

        {/* Wallet */}
        <div className="[&_button]:rounded-2xl [&_button]:h-11 [&_button]:px-5 [&_button]:text-sm [&_button]:font-medium [&_button]:shadow-sm">
          <ConnectWallet />
        </div>
      </div>
    </header>
  )
}