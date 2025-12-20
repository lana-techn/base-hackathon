'use client'

import {
    TrendingUp,
    Wallet,
    Activity,
    BarChart3,
    Zap,
    Brain,
    MessageSquare,
    Clock,
    Target,
    CheckCircle,
    ArrowUpRight,
    Bot,
    DollarSign,
    Users,
    PieChart
} from 'lucide-react'
import Link from 'next/link'

// Stat cards data
const statsCards = [
    { icon: DollarSign, value: '$12,450', label: 'Portfolio Value' },
    { icon: Activity, value: '24', label: 'Signals Today' },
    { icon: Users, value: '3', label: 'Active Agents' },
    { icon: PieChart, value: '+2.34%', label: 'Today\'s P&L' },
]

// Agents data
const agents = [
    { icon: Brain, name: 'Agent Alpha', status: 'BUY signal ETH', color: 'bg-primary', active: true },
    { icon: Zap, name: 'Agent Beta', status: 'Awaiting signal', color: 'bg-accent', active: false },
    { icon: MessageSquare, name: 'Agent Gamma', status: 'Posted update', color: 'bg-primary', active: true },
]

// Recent activity
const recentActivity = [
    { action: 'BUY signal generated', pair: 'ETH/USDT', time: '5 min ago', type: 'signal' },
    { action: 'Trade executed', pair: 'BTC/USDT', time: '1 hour ago', type: 'trade' },
    { action: 'Alert triggered', pair: 'SOL/USDT', time: '2 hours ago', type: 'alert' },
    { action: 'Position closed', pair: 'ETH/USDT', time: '4 hours ago', type: 'close' },
]

export function DashboardOverview() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Good morning, Trader!</h1>
                    <p className="text-muted-foreground mt-1">Here's what's happening with your portfolio</p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-card/80 backdrop-blur-xl rounded-3xl p-5 border border-border/50 shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <stat.icon className="w-5 h-5 text-primary" />
                            </div>
                            <button className="text-muted-foreground hover:text-foreground">
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Main Bento Grid */}
            <div className="grid grid-cols-12 gap-4">
                {/* Win Rate Card */}
                <div className="col-span-12 md:col-span-6 lg:col-span-4">
                    <div className="h-full bg-card/80 backdrop-blur-xl rounded-3xl p-6 border border-border/50 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-foreground">Win Rate</h3>
                            <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-end gap-4">
                            <div>
                                <p className="text-4xl font-bold text-foreground">68%</p>
                                <p className="text-sm text-muted-foreground">Last 30 days</p>
                            </div>
                            <div className="flex-1 flex items-end gap-1 h-20">
                                {[40, 65, 45, 80, 55, 70, 60].map((h, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 bg-primary/80 rounded-t-lg transition-all hover:bg-primary"
                                        style={{ height: `${h}%` }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Position Card */}
                <div className="col-span-12 md:col-span-6 lg:col-span-4">
                    <div className="h-full bg-card/80 backdrop-blur-xl rounded-3xl p-6 border border-border/50 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-foreground">Current Position</h3>
                            <span className="px-2 py-1 text-xs font-medium bg-success/20 text-success rounded-full">LONG</span>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                <span className="text-2xl">Ξ</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">ETH/USDT</p>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-success" />
                                    <span className="text-success font-medium">+$234.50</span>
                                    <span className="text-muted-foreground text-sm">(+2.1%)</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-success rounded-full" style={{ width: '65%' }} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Target: $3,800 (65% reached)</p>
                    </div>
                </div>

                {/* AI Status Card - Dark themed */}
                <div className="col-span-12 lg:col-span-4 row-span-2">
                    <div className="h-full bg-foreground dark:bg-card rounded-3xl p-6 shadow-xl text-background dark:text-foreground">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold">AI Agent Status</h3>
                            <span className="text-2xl font-bold">3<span className="text-lg opacity-60">/3</span></span>
                        </div>

                        <div className="space-y-4">
                            {agents.map((agent, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 rounded-2xl bg-background/10 dark:bg-secondary/30">
                                    <div className={`w-10 h-10 rounded-xl ${agent.color} flex items-center justify-center`}>
                                        <agent.icon className="w-5 h-5 text-primary-foreground" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm">{agent.name}</p>
                                        <p className="text-xs opacity-70 truncate">{agent.status}</p>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${agent.active ? 'bg-success' : 'bg-accent'}`} />
                                </div>
                            ))}
                        </div>

                        <Link
                            href="/dashboard/agents"
                            className="mt-6 w-full py-3 rounded-xl bg-background/20 dark:bg-secondary/50 text-center font-medium text-sm block hover:bg-background/30 dark:hover:bg-secondary/70 transition-colors"
                        >
                            View All Agents
                        </Link>
                    </div>
                </div>

                {/* Recent Activity Card */}
                <div className="col-span-12 lg:col-span-8">
                    <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-6 border border-border/50 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-foreground">Recent Activity</h3>
                            <button className="text-sm text-primary hover:underline">View all</button>
                        </div>

                        <div className="space-y-3">
                            {recentActivity.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        {item.type === 'signal' && <Target className="w-5 h-5 text-primary" />}
                                        {item.type === 'trade' && <Zap className="w-5 h-5 text-accent" />}
                                        {item.type === 'alert' && <Activity className="w-5 h-5 text-destructive" />}
                                        {item.type === 'close' && <CheckCircle className="w-5 h-5 text-success" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-foreground">{item.action}</p>
                                        <p className="text-sm text-muted-foreground">{item.pair}</p>
                                    </div>
                                    <span className="text-sm text-muted-foreground">{item.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Access */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                    href="/dashboard/trading"
                    className="flex items-center gap-4 p-5 rounded-3xl bg-linear-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                    <div className="w-12 h-12 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Trading Terminal</h3>
                        <p className="text-primary-foreground/80 text-sm">Open full trading interface</p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 ml-auto" />
                </Link>

                <Link
                    href="/dashboard/portfolio"
                    className="flex items-center gap-4 p-5 rounded-3xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                    <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center">
                        <Wallet className="w-6 h-6 text-success" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-foreground">Portfolio</h3>
                        <p className="text-muted-foreground text-sm">View your holdings</p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 ml-auto text-muted-foreground" />
                </Link>
            </div>
        </div>
    )
}
