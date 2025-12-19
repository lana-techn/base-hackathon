'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FloatingNav } from "@/components/ui/floating-nav"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { ConnectWallet } from '@coinbase/onchainkit/wallet'
import { 
  Home, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  Wifi, 
  WifiOff,
  Bot
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface Web3NavProps {
  isConnected?: boolean
  networkStatus?: 'connected' | 'disconnected' | 'connecting'
  agentStatus?: 'online' | 'offline' | 'error'
}

const navItems = [
  {
    name: "Home",
    href: "/",
    icon: <Home className="h-4 w-4" />
  },
  {
    name: "Dashboard", 
    href: "/dashboard",
    icon: <BarChart3 className="h-4 w-4" />
  },
  {
    name: "Settings",
    href: "/settings", 
    icon: <Settings className="h-4 w-4" />
  }
]

const Web3Nav = ({ 
  isConnected = false, 
  networkStatus = 'disconnected',
  agentStatus = 'offline' 
}: Web3NavProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getNetworkStatusColor = () => {
    switch (networkStatus) {
      case 'connected': return 'text-success'
      case 'connecting': return 'text-warning'
      default: return 'text-error'
    }
  }

  const getAgentStatusColor = () => {
    switch (agentStatus) {
      case 'online': return 'text-success'
      case 'error': return 'text-error'
      default: return 'text-muted-foreground'
    }
  }

  return (
    <>
      {/* Desktop Floating Navigation */}
      <div className="hidden md:block">
        <FloatingNav navItems={navItems} />
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? 'backdrop-blur-lg' : ''
          }`}
        >
          <GlassCard 
            variant={scrolled ? "strong" : "subtle"} 
            blur="lg" 
            className="m-4 px-4 py-3"
          >
            <div className="flex items-center justify-between">
              
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground text-lg">BethNa</span>
              </Link>

              {/* Status Indicators */}
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="gap-1 text-xs">
                  <Wifi className={`h-3 w-3 ${getNetworkStatusColor()}`} />
                  Base
                </Badge>
                
                <Badge variant="outline" className="gap-1 text-xs">
                  <Bot className={`h-3 w-3 ${getAgentStatusColor()}`} />
                  AI
                </Badge>
              </div>

              {/* Theme Toggle & Mobile Menu Button */}
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", damping: 20 }}
                className="absolute right-0 top-0 h-full w-80 max-w-[80vw]"
                onClick={(e) => e.stopPropagation()}
              >
                <GlassCard variant="strong" blur="xl" className="h-full rounded-none rounded-l-2xl p-6">
                  <div className="flex flex-col h-full">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-xl font-bold text-foreground">Navigation</h2>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 space-y-2">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            pathname === item.href
                              ? 'bg-primary/20 text-primary border border-primary/30'
                              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                          }`}
                        >
                          {item.icon}
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      ))}
                    </nav>

                    {/* Status Section */}
                    <div className="space-y-4 pt-6 border-t border-border">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Network</span>
                          <div className="flex items-center space-x-1">
                            <Wifi className={`h-4 w-4 ${getNetworkStatusColor()}`} />
                            <span className="text-sm text-foreground">Base L2</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">AI Agents</span>
                          <div className="flex items-center space-x-1">
                            <Bot className={`h-4 w-4 ${getAgentStatusColor()}`} />
                            <span className="text-sm text-foreground capitalize">{agentStatus}</span>
                          </div>
                        </div>
                      </div>

                      {/* Theme Toggle */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Theme</span>
                        <ThemeToggle />
                      </div>

                      {/* Wallet Connection */}
                      <div className="pt-4">
                        <ConnectWallet />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Status Bar */}
      <div className="hidden md:block fixed top-4 right-4 z-40">
        <GlassCard variant="subtle" blur="md" className="px-4 py-2">
          <div className="flex items-center space-x-4">
            
            {/* Network Status */}
            <div className="flex items-center space-x-1">
              <Wifi className={`h-4 w-4 ${getNetworkStatusColor()}`} />
              <span className="text-sm text-foreground">Base</span>
            </div>

            {/* Agent Status */}
            <div className="flex items-center space-x-1">
              <Bot className={`h-4 w-4 ${getAgentStatusColor()}`} />
              <span className="text-sm text-foreground">AI</span>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Wallet */}
            <ConnectWallet />
          </div>
        </GlassCard>
      </div>
    </>
  )
}

export { Web3Nav }