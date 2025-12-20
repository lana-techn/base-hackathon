'use client'

import {
    Brain,
    Zap,
    MessageSquare,
    Play,
    Pause,
    Settings,
    TrendingUp,
    CheckCircle,
    Activity,
    ArrowUpRight
} from 'lucide-react'
import Link from 'next/link'

// Agents data
const agents = [
    {
        id: 'alpha',
        name: 'Agent Alpha',
        subtitle: 'Quantitative Analysis',
        description: 'Analyzes market data using RSI, Bollinger Bands, and other technical indicators.',
        icon: Brain,
        status: 'active',
        color: 'bg-primary',
        stats: { signals: 24, accuracy: '72%', trades: 8 },
    },
    {
        id: 'beta',
        name: 'Agent Beta',
        subtitle: 'Smart Contract Execution',
        description: 'Executes trades on-chain via smart contracts when signals meet thresholds.',
        icon: Zap,
        status: 'standby',
        color: 'bg-accent',
        stats: { signals: 8, accuracy: '100%', trades: 3 },
    },
    {
        id: 'gamma',
        name: 'Agent Gamma',
        subtitle: 'Social Engagement',
        description: 'Monitors social sentiment and posts trading updates to the community.',
        icon: MessageSquare,
        status: 'active',
        color: 'bg-primary',
        stats: { signals: 12, accuracy: '85%', trades: 0 },
    },
]

// Summary stats
const summaryStats = [
    { label: 'Total Signals', value: '44', icon: Activity },
    { label: 'Accuracy', value: '72%', icon: TrendingUp },
    { label: 'Trades Executed', value: '11', icon: CheckCircle },
]

export default function AgentsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">AI Agents</h1>
                <p className="text-muted-foreground mt-1">Manage and monitor your autonomous trading agents</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {summaryStats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-card/80 backdrop-blur-xl rounded-3xl p-5 border border-border/50 shadow-lg"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <stat.icon className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Agents Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {agents.map((agent) => (
                    <div
                        key={agent.id}
                        className="bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-border/50 shadow-lg hover:shadow-xl transition-shadow"
                    >
                        {/* Header */}
                        <div className="p-6 bg-primary/5">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-14 h-14 rounded-2xl ${agent.color} flex items-center justify-center shadow-lg shadow-primary/30`}>
                                    <agent.icon className="w-7 h-7 text-primary-foreground" />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${agent.status === 'active'
                                        ? 'bg-success/20 text-success'
                                        : 'bg-accent/20 text-accent'
                                    }`}>
                                    {agent.status === 'active' ? 'Active' : 'Standby'}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-foreground">{agent.name}</h3>
                            <p className="text-sm text-muted-foreground">{agent.subtitle}</p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 border-y border-border/30">
                            <div className="p-4 text-center border-r border-border/30">
                                <p className="text-xl font-bold text-foreground">{agent.stats.signals}</p>
                                <p className="text-xs text-muted-foreground">Signals</p>
                            </div>
                            <div className="p-4 text-center border-r border-border/30">
                                <p className="text-xl font-bold text-foreground">{agent.stats.accuracy}</p>
                                <p className="text-xs text-muted-foreground">Accuracy</p>
                            </div>
                            <div className="p-4 text-center">
                                <p className="text-xl font-bold text-foreground">{agent.stats.trades}</p>
                                <p className="text-xs text-muted-foreground">Trades</p>
                            </div>
                        </div>

                        {/* Description & Actions */}
                        <div className="p-6">
                            <p className="text-sm text-muted-foreground mb-4">{agent.description}</p>

                            <div className="flex gap-2">
                                <button className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-colors ${agent.status === 'active'
                                        ? 'bg-accent/20 text-accent hover:bg-accent/30'
                                        : 'bg-success/20 text-success hover:bg-success/30'
                                    }`}>
                                    {agent.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                    {agent.status === 'active' ? 'Pause' : 'Activate'}
                                </button>
                                <button className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground transition-colors">
                                    <Settings className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Coordination Banner */}
            <div className="bg-foreground dark:bg-card rounded-3xl p-6 text-background dark:text-foreground shadow-xl border dark:border-border/50">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {agents.map((agent) => (
                                <div
                                    key={agent.id}
                                    className={`w-10 h-10 rounded-full ${agent.color} flex items-center justify-center border-2 border-background dark:border-card`}
                                >
                                    <agent.icon className="w-5 h-5 text-primary-foreground" />
                                </div>
                            ))}
                        </div>
                        <div>
                            <h3 className="font-semibold">Agent Coordination</h3>
                            <p className="text-sm opacity-70">Alpha analyzes → Beta executes → Gamma communicates</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-success/20 text-success text-sm font-medium">
                            Synchronized
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
