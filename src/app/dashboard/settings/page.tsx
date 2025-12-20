'use client'

import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Settings,
    Bell,
    Shield,
    Palette,
    Globe,
    Key,
    Wallet,
    Moon,
    Sun,
    ChevronRight
} from 'lucide-react'
import { useTheme } from '@/components/ui/theme-provider'

interface SettingsItem {
    label: string
    value: string
    action?: string
    toggle?: boolean
    badge?: string
}

interface SettingsSection {
    title: string
    icon: React.ComponentType<{ className?: string }>
    items: SettingsItem[]
}

const settingsSections: SettingsSection[] = [
    {
        title: 'General',
        icon: Settings,
        items: [
            { label: 'Language', value: 'English', action: 'Change' },
            { label: 'Timezone', value: 'UTC+7 (Jakarta)', action: 'Change' },
            { label: 'Currency', value: 'USD', action: 'Change' },
        ],
    },
    {
        title: 'Notifications',
        icon: Bell,
        items: [
            { label: 'Trading Signals', value: 'Enabled', toggle: true },
            { label: 'Price Alerts', value: 'Enabled', toggle: true },
            { label: 'Agent Updates', value: 'Enabled', toggle: true },
        ],
    },
    {
        title: 'Security',
        icon: Shield,
        items: [
            { label: 'Two-Factor Auth', value: 'Enabled', badge: 'Active' },
            { label: 'Session Timeout', value: '30 minutes', action: 'Change' },
            { label: 'API Keys', value: '2 active', action: 'Manage' },
        ],
    },
]

export default function SettingsPage() {
    const { theme, setTheme } = useTheme()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your preferences and account settings</p>
            </div>

            {/* Theme Card */}
            <GlassCard className="p-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Palette className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">Appearance</h3>
                            <p className="text-sm text-muted-foreground">Customize the look and feel</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-1 rounded-xl bg-secondary/50">
                        <button
                            onClick={() => setTheme('light')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${theme === 'light' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
                                }`}
                        >
                            <Sun className="w-4 h-4" />
                            Light
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
                                }`}
                        >
                            <Moon className="w-4 h-4" />
                            Dark
                        </button>
                    </div>
                </div>
            </GlassCard>

            {/* Wallet Connection */}
            <GlassCard className="p-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">Connected Wallet</h3>
                            <p className="text-sm text-muted-foreground font-mono">0x1234...5678</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className="bg-success/20 text-success border-success/30">Connected</Badge>
                        <Button variant="outline" size="sm">Disconnect</Button>
                    </div>
                </div>
            </GlassCard>

            {/* Settings Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {settingsSections.map((section) => (
                    <GlassCard key={section.title} className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <section.icon className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold text-foreground">{section.title}</h3>
                        </div>
                        <div className="space-y-3">
                            {section.items.map((item, index) => (
                                <div key={index} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                                        <p className="text-xs text-muted-foreground">{item.value}</p>
                                    </div>
                                    {item.badge && (
                                        <Badge variant="outline" className="text-success bg-success/10">
                                            {item.badge}
                                        </Badge>
                                    )}
                                    {item.action && (
                                        <Button variant="ghost" size="sm" className="text-primary">
                                            {item.action}
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    )}
                                    {item.toggle && (
                                        <div className="w-10 h-6 rounded-full bg-success/30 relative cursor-pointer">
                                            <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-success" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                ))}
            </div>

            {/* Danger Zone */}
            <GlassCard className="p-5 border-destructive/30">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-destructive">Danger Zone</h3>
                        <p className="text-sm text-muted-foreground">Irreversible actions</p>
                    </div>
                    <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10">
                        Delete Account
                    </Button>
                </div>
            </GlassCard>
        </div>
    )
}
