'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function TradingTerminal() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">BethNa AI Trader</h1>
          <Button variant="outline">Connect Wallet</Button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Chart Panel - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <Card className="h-[500px]">
              <CardHeader>
                <CardTitle>ETH/USD Chart</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">TradingView Chart will be integrated here</p>
              </CardContent>
            </Card>
          </div>

          {/* Active Positions Panel */}
          <div>
            <Card className="h-[500px]">
              <CardHeader>
                <CardTitle>Active Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">No active positions</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* War Room Log */}
        <Card>
          <CardHeader>
            <CardTitle>War Room Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] bg-black rounded-md p-4 font-mono text-sm text-green-400 overflow-y-auto">
              <div className="space-y-1">
                <p>[{new Date().toLocaleTimeString()}] SYSTEM: BethNa AI Trader initialized</p>
                <p>[{new Date().toLocaleTimeString()}] ALPHA: Waiting for market data...</p>
                <p>[{new Date().toLocaleTimeString()}] BETA: Ready for trade execution</p>
                <p>[{new Date().toLocaleTimeString()}] GAMMA: Social media integration standby</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}