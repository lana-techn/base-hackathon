'use client'

import { cn } from '@/lib/utils'
import { Bell, CheckCircle, AlertCircle, Clock, ChevronRight } from 'lucide-react'

interface Alert {
    id: string
    type: 'price' | 'signal' | 'system'
    symbol?: string
    message: string
    status: 'active' | 'triggered' | 'stopped'
    timestamp: Date
}

interface AlertPanelProps {
    className?: string
    alerts?: Alert[]
}

const mockAlerts: Alert[] = [
    {
        id: '1',
        type: 'price',
        symbol: 'ETH',
        message: 'ETH above $3,600',
        status: 'active',
        timestamp: new Date(),
    },
    {
        id: '2',
        type: 'signal',
        symbol: 'BTC',
        message: 'BUY signal triggered on BTC',
        status: 'triggered',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
        id: '3',
        type: 'price',
        symbol: 'SOL',
        message: 'SOL crossing $180 support',
        status: 'stopped',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
]

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active':
            return 'text-success bg-success/20'
        case 'triggered':
            return 'text-warning bg-warning/20'
        case 'stopped':
            return 'text-muted-foreground bg-secondary'
        default:
            return 'text-muted-foreground bg-secondary'
    }
}

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'active':
            return <Bell className="w-3 h-3" />
        case 'triggered':
            return <CheckCircle className="w-3 h-3" />
        case 'stopped':
            return <AlertCircle className="w-3 h-3" />
        default:
            return <Clock className="w-3 h-3" />
    }
}

const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return date.toLocaleDateString()
}

export function AlertPanel({ className, alerts = mockAlerts }: AlertPanelProps) {
    return (
        <div className={cn('flex flex-col h-full', className)}>
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">Alerts</h3>
                    <span className="px-1.5 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full">
                        {alerts.filter(a => a.status === 'active').length}
                    </span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-3 px-3 py-1.5 border-b border-border/30 text-xs flex-shrink-0">
                <button className="text-foreground font-medium border-b-2 border-primary pb-0.5">
                    All
                </button>
                <button className="text-muted-foreground hover:text-foreground transition-colors pb-0.5">
                    Active
                </button>
                <button className="text-muted-foreground hover:text-foreground transition-colors pb-0.5">
                    History
                </button>
            </div>

            {/* Alerts List - scrollable */}
            <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin">
                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        className="flex items-start gap-2 px-3 py-2 border-b border-border/20 hover:bg-secondary/30 transition-colors cursor-pointer"
                    >
                        <div className={cn(
                            'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0',
                            getStatusColor(alert.status)
                        )}>
                            {getStatusIcon(alert.status)}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                                {alert.symbol && (
                                    <span className="text-xs font-bold text-foreground">{alert.symbol}</span>
                                )}
                                <span className={cn(
                                    'text-[10px] font-medium px-1 py-0.5 rounded capitalize',
                                    getStatusColor(alert.status)
                                )}>
                                    {alert.status}
                                </span>
                            </div>
                            <p className="text-xs text-foreground mt-0.5 truncate">
                                {alert.message}
                            </p>
                            <span className="text-[10px] text-muted-foreground">
                                {formatTime(alert.timestamp)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="px-3 py-2 border-t border-border/50 flex-shrink-0">
                <button className="w-full flex items-center justify-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
                    Create New Alert
                    <ChevronRight className="w-3 h-3" />
                </button>
            </div>
        </div>
    )
}
