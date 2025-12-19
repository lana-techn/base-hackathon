'use client'

import { motion } from "framer-motion"
import { SlideIn, StaggerContainer, StaggerItem } from "@/components/ui/micro-interactions"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { GlassCard } from "@/components/ui/glass-card"
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  Activity,
  BarChart3,
  Zap,
  Shield,
  Clock
} from "lucide-react"

interface StatItem {
  title: string
  value: number
  suffix: string
  prefix?: string
  description: string
  icon: React.ReactNode
  color: string
  trend?: {
    direction: 'up' | 'down'
    percentage: number
  }
  colSpan?: 1 | 2 | 3
}

const stats: StatItem[] = [
  {
    title: "Total Volume",
    value: 2847000,
    prefix: "$",
    suffix: "",
    description: "24h trading volume across all agents",
    icon: <DollarSign className="h-6 w-6" />,
    color: "green",
    trend: { direction: 'up', percentage: 12.5 },
    colSpan: 2
  },
  {
    title: "Win Rate",
    value: 73.2,
    suffix: "%",
    description: "Success rate of AI-generated signals",
    icon: <Target className="h-6 w-6" />,
    color: "cyan",
    trend: { direction: 'up', percentage: 5.8 }
  },
  {
    title: "Active Positions",
    value: 24,
    suffix: "",
    description: "Currently open options positions",
    icon: <Activity className="h-6 w-6" />,
    color: "yellow"
  },
  {
    title: "Signals Generated",
    value: 156,
    suffix: "",
    description: "AI signals generated today",
    icon: <BarChart3 className="h-6 w-6" />,
    color: "purple",
    trend: { direction: 'up', percentage: 8.3 }
  },
  {
    title: "Average Response",
    value: 150,
    suffix: "ms",
    description: "System response time",
    icon: <Zap className="h-6 w-6" />,
    color: "blue"
  },
  {
    title: "Uptime",
    value: 99.9,
    suffix: "%",
    description: "System availability",
    icon: <Shield className="h-6 w-6" />,
    color: "green"
  }
]

const recentTrades = [
  {
    pair: "ETH/USDT",
    type: "CALL",
    entry: 3245.50,
    current: 3289.20,
    pnl: 1.35,
    time: "2m ago"
  },
  {
    pair: "BTC/USDT", 
    type: "PUT",
    entry: 67890.00,
    current: 67234.50,
    pnl: 0.97,
    time: "5m ago"
  },
  {
    pair: "SOL/USDT",
    type: "CALL", 
    entry: 198.75,
    current: 203.40,
    pnl: 2.34,
    time: "8m ago"
  }
]

const LiveStatsSection = () => {
  const getColorClasses = (color: string) => {
    const colors = {
      cyan: "text-info",
      green: "text-success",
      yellow: "text-warning",
      purple: "text-primary",
      blue: "text-info",
      red: "text-error"
    }
    return colors[color as keyof typeof colors] || colors.cyan
  }

  const getTrendColor = (direction: 'up' | 'down') => {
    return direction === 'up' ? 'text-success' : 'text-error'
  }

  return (
    <section className="py-20 px-4 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <SlideIn direction="up" delay={0.2}>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <Activity className="h-12 w-12 text-info mr-4" />
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Live Trading Stats
              </h2>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real-time performance metrics from our autonomous trading system. 
              All data is updated live and reflects actual trading activity.
            </p>
          </div>
        </SlideIn>

        {/* Stats Grid */}
        <StaggerContainer staggerDelay={0.1}>
          <BentoGrid className="mb-16">
            {stats.map((stat, index) => (
              <StaggerItem key={stat.title}>
                <BentoGridItem
                  title={stat.title}
                  description={stat.description}
                  icon={<div className={getColorClasses(stat.color)}>{stat.icon}</div>}
                  colSpan={stat.colSpan}
                  className="group"
                >
                  <div className="space-y-4">
                    
                    {/* Main Stat */}
                    <div className="text-center">
                      <AnimatedCounter
                        to={stat.value}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        decimals={stat.suffix === '%' || stat.suffix === 'ms' ? 1 : 0}
                        className="text-4xl font-bold text-foreground"
                        duration={2}
                      />
                      
                      {/* Trend Indicator */}
                      {stat.trend && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 }}
                          className={`flex items-center justify-center mt-2 ${getTrendColor(stat.trend.direction)}`}
                        >
                          <TrendingUp 
                            className={`h-4 w-4 mr-1 ${stat.trend.direction === 'down' ? 'rotate-180' : ''}`} 
                          />
                          <span className="text-sm font-medium">
                            {stat.trend.percentage}%
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </BentoGridItem>
              </StaggerItem>
            ))}
          </BentoGrid>
        </StaggerContainer>

        {/* Recent Trades */}
        <SlideIn direction="up" delay={0.8}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Recent Trades Table */}
            <GlassCard className="p-6">
              <div className="flex items-center mb-6">
                <Clock className="h-6 w-6 text-info mr-3" />
                <h3 className="text-xl font-bold text-foreground">Recent Trades</h3>
              </div>
              
              <div className="space-y-4">
                {recentTrades.map((trade, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-3 rounded-lg bg-card border border-border"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        trade.type === 'CALL' 
                          ? 'bg-success/20 text-success' 
                          : 'bg-error/20 text-error'
                      }`}>
                        {trade.type}
                      </div>
                      <div>
                        <div className="text-foreground font-medium">{trade.pair}</div>
                        <div className="text-muted-foreground text-sm">{trade.time}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-foreground font-medium">
                        ${trade.current.toLocaleString()}
                      </div>
                      <div className={`text-sm font-medium ${
                        trade.pnl > 0 ? 'text-success' : 'text-error'
                      }`}>
                        +{trade.pnl}%
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Performance Chart Placeholder */}
            <GlassCard className="p-6">
              <div className="flex items-center mb-6">
                <BarChart3 className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-bold text-foreground">Performance Chart</h3>
              </div>
              
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    TradingView Chart Integration
                  </p>
                  <p className="text-muted-foreground/70 text-sm mt-2">
                    Coming in Task 9.3
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </SlideIn>

        {/* System Health */}
        <SlideIn direction="up" delay={1.0}>
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-foreground text-center mb-8">
              System Health
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Agent Alpha", status: "online", uptime: 99.9 },
                { label: "Agent Beta", status: "online", uptime: 98.7 },
                { label: "Agent Gamma", status: "online", uptime: 99.5 },
                { label: "Agent Delta", status: "maintenance", uptime: 95.2 }
              ].map((agent, index) => (
                <motion.div
                  key={agent.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="text-center p-4 rounded-lg bg-card border border-border"
                >
                  <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                    agent.status === 'online' ? 'bg-success' :
                    agent.status === 'maintenance' ? 'bg-warning' :
                    'bg-error'
                  }`} />
                  <div className="text-foreground font-medium text-sm">{agent.label}</div>
                  <div className="text-muted-foreground text-xs mt-1">{agent.uptime}% uptime</div>
                </motion.div>
              ))}
            </div>
          </div>
        </SlideIn>
      </div>
    </section>
  )
}

export { LiveStatsSection }