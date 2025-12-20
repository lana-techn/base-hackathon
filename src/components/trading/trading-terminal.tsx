'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GlassCard } from "@/components/ui/glass-card"
import { useAgentAlpha, getSignalColor, getSignalBgColor } from "@/hooks/useAgentAlpha"
import { TradingChart } from "./trading-chart"
import { WatchlistPanel } from "./watchlist-panel"
import { AlertPanel } from "./alert-panel"
import { RefreshCw, TrendingUp, TrendingDown, Activity, Wifi, WifiOff, Zap, Target, BarChart3, Bot } from "lucide-react"
import { useState, useEffect } from "react"

interface LogEntry {
  timestamp: Date;
  agent: 'ALPHA' | 'BETA' | 'GAMMA' | 'SYSTEM';
  message: string;
}

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
    refreshInterval: 60000,
    autoRefresh: true,
  });

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setLogs([{ timestamp: new Date(), agent: 'SYSTEM', message: 'BethNa AI Trader initialized' }]);
  }, []);

  useEffect(() => {
    if (analysis) {
      const newLog: LogEntry = {
        timestamp: new Date(),
        agent: 'ALPHA',
        message: `Signal: ${analysis.signal} | Confidence: ${analysis.confidence}% | ${analysis.reasoning}`,
      };
      setLogs(prev => [...prev.slice(-50), newLog]);
    }
  }, [analysis?.timestamp]);

  useEffect(() => {
    const statusLog: LogEntry = {
      timestamp: new Date(),
      agent: 'SYSTEM',
      message: isConnected ? 'Agent Alpha connected' : 'Agent Alpha disconnected',
    };
    setLogs(prev => [...prev.slice(-50), statusLog]);
  }, [isConnected]);

  const getAgentColor = (agent: string) => {
    switch (agent) {
      case 'ALPHA': return 'text-blue-500';
      case 'BETA': return 'text-amber-500';
      case 'GAMMA': return 'text-purple-500';
      default: return 'text-green-500';
    }
  };

  const SignalIcon = analysis?.signal === 'BUY_CALL' ? TrendingUp : analysis?.signal === 'BUY_PUT' ? TrendingDown : Activity;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trading Terminal</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time AI trading system powered by BethNa</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={isConnected ? "default" : "destructive"} className="gap-1.5 px-3 py-1.5">
            {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isConnected ? 'Connected' : 'Offline'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-destructive/20 border border-destructive/50 rounded-xl p-4 text-destructive">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Chart Panel - 8 columns */}
        <div className="lg:col-span-8">
          <GlassCard className="overflow-hidden">
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">ETH/USDT</h2>
                    <div className="flex items-center gap-2">
                      {indicators && (
                        <span className="text-2xl font-bold font-mono text-foreground">
                          ${indicators.current_price.toLocaleString()}
                        </span>
                      )}
                      {indicators && (
                        <Badge variant="outline" className="text-success bg-success/10">
                          +2.34%
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {['1H', '4H', '1D', '1W'].map((tf) => (
                    <button
                      key={tf}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${tf === '1H'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                        }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <TradingChart symbol="ETH/USDT" height={380} />
          </GlassCard>
        </div>

        {/* Right Side Panels - 4 columns */}
        <div className="lg:col-span-4 space-y-4">
          {/* Signal Card */}
          <GlassCard className={`${analysis ? getSignalBgColor(analysis.signal) : ''}`}>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">AI Signal</h3>
              </div>
              {analysis ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-bold ${getSignalColor(analysis.signal)}`}>
                      {analysis.signal.replace('_', ' ')}
                    </span>
                    <SignalIcon className={`w-6 h-6 ${getSignalColor(analysis.signal)}`} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <span className="text-xs text-muted-foreground block">Confidence</span>
                      <span className="text-lg font-bold text-foreground">{analysis.confidence}%</span>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <span className="text-xs text-muted-foreground block">Win Rate</span>
                      <span className="text-lg font-bold text-foreground">{analysis.win_rate}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {analysis.reasoning}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-24 text-muted-foreground">
                  Analyzing market...
                </div>
              )}
            </div>
          </GlassCard>

          {/* Indicators Card */}
          <GlassCard>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Target className="w-4 h-4 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground">Indicators</h3>
              </div>
              {indicators ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <span className="text-xs text-muted-foreground block">RSI (14)</span>
                    <span className={`text-lg font-bold font-mono ${indicators.rsi < 30 ? 'text-success' : indicators.rsi > 70 ? 'text-destructive' : 'text-foreground'
                      }`}>
                      {indicators.rsi}
                    </span>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <span className="text-xs text-muted-foreground block">BB Position</span>
                    <span className="text-lg font-bold font-mono text-foreground">
                      {indicators.price_position}
                    </span>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <span className="text-xs text-muted-foreground block">BB Upper</span>
                    <span className="text-sm font-mono text-foreground">
                      ${indicators.bollinger_upper.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <span className="text-xs text-muted-foreground block">BB Lower</span>
                    <span className="text-sm font-mono text-foreground">
                      ${indicators.bollinger_lower.toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-24 text-muted-foreground">
                  Loading indicators...
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Bottom Row - 4 equal panels for better spacing */}
        {/* Watchlist */}
        <div className="lg:col-span-3">
          <GlassCard className="h-[260px] overflow-hidden">
            <WatchlistPanel />
          </GlassCard>
        </div>

        {/* War Room Log */}
        <div className="lg:col-span-3">
          <GlassCard className="h-[260px] overflow-hidden flex flex-col">
            <div className="px-3 py-2 border-b border-border/50 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">War Room Log</h3>
              </div>
            </div>
            <div className="flex-1 p-2 overflow-y-auto font-mono text-[11px] min-h-0">
              {isClient && logs.slice(-6).map((log, i) => (
                <div key={i} className="py-1 border-b border-border/20 last:border-0">
                  <span className="text-muted-foreground">[{formatTimestamp(log.timestamp)}] </span>
                  <span className={getAgentColor(log.agent)}>{log.agent}: </span>
                  <span className="text-foreground/80 break-words">{log.message.slice(0, 40)}...</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Alerts */}
        <div className="lg:col-span-3">
          <GlassCard className="h-[260px] overflow-hidden">
            <AlertPanel />
          </GlassCard>
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-3">
          <GlassCard className="h-[260px] p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                <Activity className="w-4 h-4 text-success" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Quick Stats</h3>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div className="bg-secondary/50 rounded-lg p-3 flex flex-col justify-center">
                <span className="text-xs text-muted-foreground">Today's P&L</span>
                <span className="text-lg font-bold text-success">+$1,234</span>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 flex flex-col justify-center">
                <span className="text-xs text-muted-foreground">Win Rate</span>
                <span className="text-lg font-bold text-foreground">73.2%</span>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 flex flex-col justify-center">
                <span className="text-xs text-muted-foreground">Total Trades</span>
                <span className="text-lg font-bold text-foreground">24</span>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 flex flex-col justify-center">
                <span className="text-xs text-muted-foreground">Open Positions</span>
                <span className="text-lg font-bold text-primary">3</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}