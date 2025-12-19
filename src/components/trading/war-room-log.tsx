'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { useEffect, useRef } from "react"

interface LogEntry {
    timestamp: Date
    agent: 'ALPHA' | 'BETA' | 'GAMMA' | 'SYSTEM'
    message: string
    type?: 'INFO' | 'SIGNAL' | 'EXECUTION' | 'SOCIAL' | 'ERROR'
}

interface WarRoomLogProps {
    logs: LogEntry[]
    maxHeight?: string
}

export function WarRoomLog({ logs, maxHeight = "200px" }: WarRoomLogProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom when new logs arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [logs])

    const getAgentColor = (agent: string) => {
        switch (agent) {
            case 'ALPHA': return 'text-info'
            case 'BETA': return 'text-warning'
            case 'GAMMA': return 'text-primary'
            case 'SYSTEM': return 'text-success'
            default: return 'text-muted-foreground'
        }
    }

    const getTypeIndicator = (type?: string) => {
        switch (type) {
            case 'SIGNAL': return '📊 '
            case 'EXECUTION': return '⚡ '
            case 'SOCIAL': return '📢 '
            case 'ERROR': return '❌ '
            default: return ''
        }
    }

    const formatTimestamp = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    }

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Activity className="h-4 w-4 text-green-400 animate-pulse" />
                    War Room Log
                    <span className="text-xs text-muted-foreground font-normal">
                        ({logs.length} entries)
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div
                    ref={scrollRef}
                    className="bg-secondary rounded-md p-3 font-mono text-xs overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
                    style={{ height: maxHeight }}
                >
                    {logs.length === 0 ? (
                        <p className="text-muted-foreground animate-pulse">Initializing agents...</p>
                    ) : (
                        <div className="space-y-0.5">
                            {logs.map((log, i) => (
                                <div key={i} className="flex gap-2 leading-relaxed hover:bg-accent px-1 -mx-1 rounded">
                                    <span className="text-muted-foreground shrink-0">
                                        [{formatTimestamp(log.timestamp)}]
                                    </span>
                                    <span className={`shrink-0 ${getAgentColor(log.agent)}`}>
                                        {log.agent}:
                                    </span>
                                    <span className="text-foreground break-all">
                                        {getTypeIndicator(log.type)}{log.message}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
