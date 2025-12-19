'use client'

import { TradingTerminal } from '@/components/trading/trading-terminal'

export function TradingDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Trading Terminal</h2>
        <div className="text-sm text-muted-foreground">
          Real-time AI trading system
        </div>
      </div>
      
      <TradingTerminal />
    </div>
  )
}