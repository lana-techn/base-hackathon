'use client'

import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  LineChart,
  Bell,
  Settings,
  Wallet,
  Bot,
  User,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  icon: React.ReactNode
  label: string
  href: string
  badge?: number
}

const navItems: NavItem[] = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', href: '/dashboard' },
  { icon: <LineChart className="w-5 h-5" />, label: 'Trading', href: '/dashboard/trading' },
  { icon: <Bot className="w-5 h-5" />, label: 'AI Agents', href: '/dashboard/agents' },
  { icon: <Wallet className="w-5 h-5" />, label: 'Portfolio', href: '/dashboard/portfolio' },
  { icon: <Bell className="w-5 h-5" />, label: 'Alerts', href: '/dashboard/alerts', badge: 3 },
  { icon: <Settings className="w-5 h-5" />, label: 'Settings', href: '/dashboard/settings' },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <aside className="fixed left-4 top-4 bottom-4 w-[72px] z-40">
      {/* Glass floating box - using CSS variables */}
      <div className="h-full bg-card/90 backdrop-blur-2xl rounded-3xl border border-border/50 shadow-2xl shadow-primary/10 flex flex-col overflow-hidden">
        {/* Logo at top */}
        <div className="py-5 flex items-center justify-center">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>

        {/* Expand toggle */}
        <button className="mx-auto mb-2 w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-secondary/80 transition-colors">
          <ChevronRight className="w-3 h-3" />
        </button>

        {/* Centered Navigation */}
        <nav className="flex-1 flex flex-col items-center justify-center gap-2 px-3">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'relative w-11 h-11 rounded-2xl flex items-center justify-center',
                'transition-all duration-300 group',
                isActive(item.href)
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              {item.icon}

              {/* Badge */}
              {item.badge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-[9px] font-bold bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}

              {/* Tooltip */}
              <div className="absolute left-full ml-4 px-3 py-2 bg-popover text-popover-foreground text-xs font-medium rounded-xl shadow-xl border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                {item.label}
              </div>
            </Link>
          ))}
        </nav>

        {/* User at bottom */}
        <div className="py-5 flex items-center justify-center">
          <div className="relative group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-primary/30">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            {/* Tooltip */}
            <div className="absolute left-full ml-4 px-3 py-2 bg-popover text-popover-foreground text-xs font-medium rounded-xl shadow-xl border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
              Profile
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}