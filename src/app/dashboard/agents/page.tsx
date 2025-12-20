'use client'

import { useState, useEffect } from 'react'
import {
    Brain,
    Zap,
    MessageSquare,
    Play,
    Pause,
    Settings,
    TrendingUp,
    TrendingDown,
    CheckCircle,
    Activity,
    ArrowUpRight,
    Wifi,
    WifiOff,
    RefreshCw,
    BarChart3,
} from 'lucide-react'
import Link from 'next/link'
import { useThetanuts } from '@/hooks/useThetanuts'
import { useAgentAlpha } from '@/hooks/useAgentAlpha'

// Agent type definition
interface AgentConfig {
    id: string
    name: string
    subtitle: string
    description: string
    icon: React.ElementType
    color: string
    features: string[]
}

// Static agent configs
const agentConfigs: AgentConfig[] = [
    {
        id: 'alpha',
        name: 'Agent Alpha',
        subtitle: 'Quantitative Analysis',
        description: 'Analyzes market data using RSI, Bollinger Bands, and other technical indicators. Now integrated with Thetanuts V4 for options recommendations.',
        icon: Brain,
        color: 'bg-blue-500',
        features: ['Technical Analysis', 'Options Greeks', 'AI Recommendations'],
    },
    {
        id: 'beta',
        name: 'Agent Beta',
        subtitle: 'Smart Contract Execution',
        description: 'Evaluates trading signals and executes on-chain trades via SentientTrader.sol smart contract.',
        icon: Zap,
        color: 'bg-amber-500',
        features: ['Position Sizing', 'Risk Management', 'On-chain Execution'],
    },
    {
        id: 'gamma',
        name: 'Agent Gamma',
        subtitle: 'Social Engagement',
        description: 'Generates AI-powered social posts about trades and market commentary for Twitter and Farcaster.',
        icon: MessageSquare,
        color: 'bg-purple-500',
        features: ['Auto-posting', 'Market Commentary', 'Trade Announcements'],
    },
]

export default function AgentsPage() {
    const [agentStates, setAgentStates] = useState({
        alpha: true,
        beta: false,
        gamma: true,
    })

    // Live data from hooks
    const { optionsChain, isLoading: optionsLoading, error: optionsError } = useThetanuts({ asset: 'ETH' })
    const { analysis, indicators, isConnected, isLoading: alphaLoading } = useAgentAlpha({
        symbol: 'ETH/USDT',
        interval: '1h',
        autoRefresh: true,
    })

    const toggleAgent = (agentId: string) => {
        setAgentStates(prev => ({
            ...prev,
            [agentId]: !prev[agentId as keyof typeof prev]
        }))
    }

    // Dynamic stats based on live data
    const liveStats = [
        {
            label: 'ETH Price',
            value: optionsChain ? `$${optionsChain.currentPrice.toLocaleString()}` : '...',
            icon: BarChart3,
            change: indicators ? ((indicators.current_price - indicators.bollinger_middle) / indicators.bollinger_middle * 100).toFixed(2) : null
        },
        {
            label: 'AI Signal',
            value: analysis?.signal || 'HOLD',
            icon: analysis?.signal === 'BUY_CALL' ? TrendingUp : analysis?.signal === 'BUY_PUT' ? TrendingDown : Activity,
            confidence: analysis?.confidence
        },
        {
            label: 'Options Available',
            value: optionsChain ? `${optionsChain.calls.length + optionsChain.puts.length}` : '...',
            icon: CheckCircle,
        },
    ]

    const getAgentStats = (agentId: string) => {
        switch (agentId) {
            case 'alpha':
                return {
                    signals: analysis ? 1 : 0,
                    status: isConnected ? 'Connected' : 'Offline',
                    data: analysis?.confidence ? `${analysis.confidence}% confidence` : 'Waiting...'
                }
            case 'beta':
                return {
                    signals: 0,
                    status: agentStates.beta ? 'Ready' : 'Standby',
                    data: 'Awaiting signals'
                }
            case 'gamma':
                return {
                    signals: 0,
                    status: agentStates.gamma ? 'Active' : 'Paused',
                    data: 'Social monitoring'
                }
            default:
                return { signals: 0, status: 'Unknown', data: '' }
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">AI Agents</h1>
                    <p className="text-muted-foreground mt-1">Manage and monitor your autonomous trading agents</p>
                </div>
                <div className="flex items-center gap-2">
                    {isConnected ? (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/20 text-success text-sm">
                            <Wifi className="w-3 h-3" />
                            Connected
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/20 text-destructive text-sm">
                            <WifiOff className="w-3 h-3" />
                            Offline
                        </span>
                    )}
                </div>
            </div>

            {/* Live Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {liveStats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-card/80 backdrop-blur-xl rounded-3xl p-5 border border-border/50 shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <stat.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                </div>
                            </div>
                            {stat.change && (
                                <span className={`text-sm font-medium ${parseFloat(stat.change) >= 0 ? 'text-success' : 'text-destructive'}`}>
                                    {parseFloat(stat.change) >= 0 ? '+' : ''}{stat.change}%
                                </span>
                            )}
                            {stat.confidence && (
                                <span className="text-sm font-medium text-primary">
                                    {stat.confidence}%
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Thetanuts Connection Status */}
            {optionsChain && (
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-4 border border-primary/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                <Activity className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">Thetanuts V4 Connected</p>
                                <p className="text-sm text-muted-foreground">
                                    {optionsChain.calls.length} Calls · {optionsChain.puts.length} Puts · {optionsChain.expiries.length} Expiries
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/dashboard/trading"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
                        >
                            Trade Options <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            )}

            {/* Agents Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {agentConfigs.map((agent) => {
                    const stats = getAgentStats(agent.id)
                    const isActive = agentStates[agent.id as keyof typeof agentStates]

                    return (
                        <div
                            key={agent.id}
                            className="bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-border/50 shadow-lg hover:shadow-xl transition-all"
                        >
                            {/* Header */}
                            <div className="p-6 bg-primary/5">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-14 h-14 rounded-2xl ${agent.color} flex items-center justify-center shadow-lg`}>
                                        <agent.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${isActive
                                        ? 'bg-success/20 text-success'
                                        : 'bg-muted text-muted-foreground'
                                        }`}>
                                        {stats.status}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-foreground">{agent.name}</h3>
                                <p className="text-sm text-muted-foreground">{agent.subtitle}</p>
                            </div>

                            {/* Features Tags */}
                            <div className="px-6 py-3 border-b border-border/30 flex flex-wrap gap-1">
                                {agent.features.map((feature, i) => (
                                    <span key={i} className="px-2 py-0.5 text-[10px] rounded-full bg-secondary text-muted-foreground">
                                        {feature}
                                    </span>
                                ))}
                            </div>

                            {/* Live Data */}
                            <div className="px-6 py-3 border-b border-border/30 bg-secondary/30">
                                <p className="text-xs text-muted-foreground">Current Status</p>
                                <p className="text-sm font-medium text-foreground">{stats.data}</p>
                            </div>

                            {/* Description & Actions */}
                            <div className="p-6">
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{agent.description}</p>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => toggleAgent(agent.id)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-colors ${isActive
                                            ? 'bg-accent/20 text-accent hover:bg-accent/30'
                                            : 'bg-success/20 text-success hover:bg-success/30'
                                            }`}
                                    >
                                        {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                        {isActive ? 'Pause' : 'Activate'}
                                    </button>
                                    <button className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground transition-colors">
                                        <Settings className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Coordination Banner */}
            <div className="bg-foreground dark:bg-card rounded-3xl p-6 text-background dark:text-foreground shadow-xl border dark:border-border/50">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {agentConfigs.map((agent) => (
                                <div
                                    key={agent.id}
                                    className={`w-10 h-10 rounded-full ${agent.color} flex items-center justify-center border-2 border-background dark:border-card`}
                                >
                                    <agent.icon className="w-5 h-5 text-white" />
                                </div>
                            ))}
                        </div>
                        <div>
                            <h3 className="font-semibold">Agent Swarm + Thetanuts V4</h3>
                            <p className="text-sm opacity-70">Alpha analyzes → Beta executes → Gamma communicates</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-success/20 text-success text-sm font-medium">
                            {Object.values(agentStates).filter(Boolean).length}/3 Active
                        </span>
                        <Link
                            href="/dashboard/trading"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
                        >
                            Open Terminal <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
