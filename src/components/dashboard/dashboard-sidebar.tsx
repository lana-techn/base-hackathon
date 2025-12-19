'use client'

export function DashboardSidebar() {
  return (
    <aside className="w-64 bg-card/50 backdrop-blur-sm border-r border-border p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-primary">BethNa AI</h2>
      </div>
      
      <nav className="space-y-2">
        <a href="#" className="block px-4 py-2 rounded-lg bg-primary/20 text-primary">
          Trading Terminal
        </a>
        <a href="#" className="block px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent">
          Positions
        </a>
        <a href="#" className="block px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent">
          War Room
        </a>
        <a href="#" className="block px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent">
          Analytics
        </a>
        <a href="#" className="block px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent">
          Settings
        </a>
      </nav>
    </aside>
  )
}