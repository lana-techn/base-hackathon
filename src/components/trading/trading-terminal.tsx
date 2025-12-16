'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAgentAlpha, getSignalColor, getSignalBgColor, getRSIColor } from "@/hooks/useAgentAlpha"
import { RefreshCw, TrendingUp, TrendingDown, Activity, Wifi, WifiOff } from "lucide-react"
import { useState, useEffect } from "react"
import { ConnectWallet } from '@coinbase/onchainkit/wallet'

interface LogEntry {
  timestamp: Date;
  agent: 'ALPHA' | 'BETA' | 'GAMMA' | 'SYSTEM';
  message: string;
}

// Helper function to format timestamp consistently
const formatTimestamp = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export function TradingTerminal() {
  const {
    analysis,
    indicators,
    isLoading,
    isConnected,
    error,
    lastUpdate,
    refresh
  } = useAgentAlpha({
    symbol: 'ETH/USDT',
    interval: '1h',
    refreshInterval: 60000, // 1 minute
    autoRefresh: true,
  });

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Initialize client-side only
  useEffect(() => {
    setIsClient(true);
    setLogs([{ timestamp: new Date(), agent: 'SYSTEM', message: 'BethNa AI Trader initialized' }]);
  }, []);

  // Add logs when analysis updates
  useEffect(() => {
    if (analysis) {
      const newLog: LogEntry = {
        timestamp: new Date(),
        agent: 'ALPHA',
        message: `Signal: ${analysis.signal} | Confidence: ${analysis.confidence}% | ${analysis.reasoning}`,
      };
      setLogs(prev => [...prev.slice(-50), newLog]); // Keep last 50 logs
    }
  }, [analysis?.timestamp]);

  // Add connection status logs
  useEffect(() => {
    const statusLog: LogEntry = {
      timestamp: new Date(),
      agent: 'SYSTEM',
      message: isConnected ? 'Agent Alpha connected' : 'Agent Alpha disconnected - check if service is running',
    };
    setLogs(prev => [...prev.slice(-50), statusLog]);
  }, [isConnected]);

  const getAgentColor = (agent: string) => {
    switch (agent) {
      case 'ALPHA': return 'text-cyan-400';
      case 'BETA': return 'text-yellow-400';
      case 'GAMMA': return 'text-purple-400';
      default: return 'text-green-400';
    }
  };

  const SignalIcon = analysis?.signal === 'BUY_CALL' ? TrendingUp : analysis?.signal === 'BUY_PUT' ? TrendingDown : Activity;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              BethNa AI Trader
            </h1>
            <Badge variant={isConnected ? "default" : "destructive"} className="gap-1">
              {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {isConnected ? 'Connected' : 'Offline'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <ConnectWallet />
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Chart Panel - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <Card className="h-[500px]">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>ETH/USDT</span>
                  {indicators && (
                    <span className="text-2xl font-mono">
                      ${indicators.current_price.toLocaleString()}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[400px]">
                {indicators ? (
                  <div className="w-full space-y-6">
                    {/* Price Position */}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Bollinger Upper</span>
                      <span className="font-mono">${indicators.bollinger_upper.toLocaleString()}</span>
                    </div>

                    {/* Visual Price Bar */}
                    <div className="relative h-32 bg-gradient-to-t from-red-500/20 via-yellow-500/20 to-green-500/20 rounded-lg border">
                      <div
                        className="absolute left-0 right-0 h-2 bg-white/80 rounded"
                        style={{
                          top: `${Math.min(95, Math.max(5, ((indicators.bollinger_upper - indicators.current_price) / (indicators.bollinger_upper - indicators.bollinger_lower)) * 100))}%`
                        }}
                      />
                      <div className="absolute top-2 right-2 text-xs text-muted-foreground">
                        Position: {indicators.price_position}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Bollinger Lower</span>
                      <span className="font-mono">${indicators.bollinger_lower.toLocaleString()}</span>
                    </div>

                    {/* Indicators Row */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">RSI (14)</div>
                        <div className={`text-2xl font-mono font-bold ${getRSIColor(indicators.rsi)}`}>
                          {indicators.rsi}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {indicators.rsi < 30 ? 'Oversold' : indicators.rsi > 70 ? 'Overbought' : 'Neutral'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">BB Middle</div>
                        <div className="text-2xl font-mono font-bold">
                          ${indicators.bollinger_middle.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">Last Update</div>
                        <div className="text-sm font-mono">
                          {isClient && lastUpdate ? formatTimestamp(lastUpdate) : 'Never'}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Loading market data...</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Signal & Positions Panel */}
          <div className="space-y-4">
            {/* Trading Signal */}
            <Card className={`border-2 ${analysis ? getSignalBgColor(analysis.signal) : ''}`}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <SignalIcon className="h-5 w-5" />
                  Trading Signal
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysis ? (
                  <div className="space-y-3">
                    <div className={`text-3xl font-bold ${getSignalColor(analysis.signal)}`}>
                      {analysis.signal.replace('_', ' ')}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Confidence</span>
                        <div className="font-bold">{analysis.confidence}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Win Rate</span>
                        <div className="font-bold">{analysis.win_rate}%</div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {analysis.reasoning}
                    </p>
                  </div>
                ) : (
                  <div className="text-muted-foreground">Analyzing market...</div>
                )}
              </CardContent>
            </Card>

            {/* Active Positions */}
            <Card className="h-[258px]">
              <CardHeader>
                <CardTitle>Active Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">No active positions</p>
                  {analysis?.signal !== 'HOLD' && analysis?.confidence && analysis.confidence >= 60 && (
                    <Button className="w-full" disabled>
                      {analysis.signal === 'BUY_CALL' ? '📈 Execute Call Option' : '📉 Execute Put Option'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* War Room Log */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              War Room Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] bg-black rounded-md p-4 font-mono text-sm overflow-y-auto">
              <div className="space-y-1">
                {isClient && logs.map((log, i) => (
                  <p key={i}>
                    <span className="text-gray-500">[{formatTimestamp(log.timestamp)}]</span>{' '}
                    <span className={getAgentColor(log.agent)}>{log.agent}:</span>{' '}
                    <span className="text-gray-300">{log.message}</span>
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}