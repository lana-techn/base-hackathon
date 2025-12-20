'use client'

import { DashboardHeader } from './dashboard-header'
import { DashboardSidebar } from './dashboard-sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

      {/* Sidebar - floating on left with padding */}
      <DashboardSidebar />

      {/* Main Content - offset by sidebar width + gap */}
      <div className="ml-[96px] flex flex-col min-h-screen relative">
        {/* Header */}
        <DashboardHeader />

        {/* Page Content */}
        <main className="flex-1 px-6 pb-6">
          {children}
        </main>
      </div>
    </div>
  )
}