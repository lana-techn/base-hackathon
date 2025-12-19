'use client'

import { motion } from "framer-motion"
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { SlideIn, StaggerContainer, StaggerItem } from "@/components/ui/micro-interactions"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { 
  BarChart3, 
  Target, 
  Coins, 
  Share2, 
  Brain, 
  TrendingUp,
  Shield,
  Zap
} from "lucide-react"

interface Agent {
  name: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  stats: {
    label: string
    value: number
    suffix: string
  }
  features: string[]
  colSpan?: 1 | 2 | 3
  rowSpan?: 1 | 2 | 3
}

const agents: Agent[] = [
  {
    name: "Agent Alpha",
    title: "Market Analysis",
    description: "Advanced quantitative analysis with real-time market data processing and technical indicator calculations.",
    icon: <BarChart3 className="h-8 w-8" />,
    color: "cyan",
    stats: { label: "Signals/Day", value: 24, suffix: "" },
    features: ["Bollinger Bands", "RSI Analysis", "720h Backtesting", "Real-time Data"],
    colSpan: 2,
    rowSpan: 1
  },
  {
    name: "Agent Beta", 
    title: "Options Trading",
    description: "Specialized options trading engine with Thetanuts V4 integration for advanced derivatives strategies.",
    icon: <Target className="h-8 w-8" />,
    color: "yellow",
    stats: { label: "Win Rate", value: 73, suffix: "%" },
    features: ["Thetanuts V4", "Greeks Calculation", "Risk Management", "Auto Hedging"],
    colSpan: 1,
    rowSpan: 2
  },
  {
    name: "Agent Gamma",
    title: "Blockchain Operations", 
    description: "Base L2 network integration for seamless on-chain transaction execution and position management.",
    icon: <Coins className="h-8 w-8" />,
    color: "purple",
    stats: { label: "Gas Saved", value: 45, suffix: "%" },
    features: ["Base L2 Integration", "Smart Contracts", "Position Tracking", "Gas Optimization"],
    colSpan: 1,
    rowSpan: 1
  },
  {
    name: "Agent Delta",
    title: "Social Engagement",
    description: "Automated social media reporting with AI-generated content for transparency and community engagement.",
    icon: <Share2 className="h-8 w-8" />,
    color: "green",
    stats: { label: "Posts/Day", value: 12, suffix: "" },
    features: ["Twitter/X Integration", "Farcaster Posts", "AI Content", "Trade Reports"],
    colSpan: 1,
    rowSpan: 1
  }
]

const AIAgentsSection = () => {
  const getColorClasses = (color: string) => {
    const colors = {
      cyan: "text-info group-hover:text-info/80",
      yellow: "text-warning group-hover:text-warning/80", 
      purple: "text-primary group-hover:text-primary/80",
      green: "text-success group-hover:text-success/80"
    }
    return colors[color as keyof typeof colors] || colors.cyan
  }

  return (
    <section className="py-20 px-4 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <SlideIn direction="up" delay={0.2}>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <Brain className="h-12 w-12 text-info mr-4" />
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                AI Agent Swarm
              </h2>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Four specialized AI agents working in perfect harmony to analyze markets, 
              execute trades, manage risk, and maintain transparency across all operations.
            </p>
          </div>
        </SlideIn>

        {/* Agents Grid */}
        <StaggerContainer staggerDelay={0.2}>
          <BentoGrid className="mb-16">
            {agents.map((agent, index) => (
              <StaggerItem key={agent.name}>
                <BentoGridItem
                  title={agent.name}
                  description={agent.description}
                  icon={<div className={getColorClasses(agent.color)}>{agent.icon}</div>}
                  colSpan={agent.colSpan}
                  rowSpan={agent.rowSpan}
                  className="group"
                >
                  <div className="space-y-6">
                    
                    {/* Agent Title */}
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {agent.title}
                      </h3>
                    </div>

                    {/* Stats */}
                    <div className="text-center">
                      <AnimatedCounter
                        to={agent.stats.value}
                        suffix={agent.stats.suffix}
                        className="text-3xl font-bold text-foreground"
                        duration={2}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        {agent.stats.label}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      {agent.features.map((feature, featureIndex) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * featureIndex }}
                          className="flex items-center text-sm text-muted-foreground"
                        >
                          <div className={`w-2 h-2 rounded-full mr-3 ${
                            agent.color === 'cyan' ? 'bg-info' :
                            agent.color === 'yellow' ? 'bg-warning' :
                            agent.color === 'purple' ? 'bg-primary' :
                            'bg-success'
                          }`} />
                          {feature}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </BentoGridItem>
              </StaggerItem>
            ))}
          </BentoGrid>
        </StaggerContainer>

        {/* Network Flow Visualization */}
        <SlideIn direction="up" delay={0.8}>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground mb-8">
              Swarm Network Flow
            </h3>
            
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
              
              {/* Flow Steps */}
              {[
                { icon: <BarChart3 className="h-6 w-6" />, label: "Market Data", color: "cyan" },
                { icon: <Target className="h-6 w-6" />, label: "Options Analysis", color: "yellow" },
                { icon: <Coins className="h-6 w-6" />, label: "Blockchain Execution", color: "purple" },
                { icon: <Share2 className="h-6 w-6" />, label: "Social Reporting", color: "green" }
              ].map((step, index) => (
                <div key={step.label} className="flex items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 * index, type: "spring" }}
                    className={`p-4 rounded-full border-2 ${
                      step.color === 'cyan' ? 'border-info bg-info/10' :
                      step.color === 'yellow' ? 'border-warning bg-warning/10' :
                      step.color === 'purple' ? 'border-primary bg-primary/10' :
                      'border-success bg-success/10'
                    }`}
                  >
                    <div className={
                      step.color === 'cyan' ? 'text-info' :
                      step.color === 'yellow' ? 'text-warning' :
                      step.color === 'purple' ? 'text-primary' :
                      'text-success'
                    }>
                      {step.icon}
                    </div>
                  </motion.div>
                  
                  <div className="ml-4 text-left">
                    <p className="text-foreground font-semibold">{step.label}</p>
                  </div>
                  
                  {index < 3 && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.5 + 0.2 * index }}
                      className="hidden md:block mx-4 h-0.5 w-16 bg-border"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </SlideIn>

        {/* Performance Metrics */}
        <SlideIn direction="up" delay={1.0}>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <TrendingUp className="h-6 w-6" />, value: 99.9, suffix: "%", label: "Uptime" },
              { icon: <Zap className="h-6 w-6" />, value: 150, suffix: "ms", label: "Response Time" },
              { icon: <Shield className="h-6 w-6" />, value: 256, suffix: "-bit", label: "Encryption" },
              { icon: <Brain className="h-6 w-6" />, value: 4, suffix: "", label: "AI Models" }
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
                className="text-center p-6 rounded-xl bg-card border border-border"
              >
                <div className="text-info flex justify-center mb-3">
                  {metric.icon}
                </div>
                <AnimatedCounter
                  to={metric.value}
                  suffix={metric.suffix}
                  className="text-2xl font-bold text-foreground"
                  duration={2}
                />
                <p className="text-sm text-muted-foreground mt-2">{metric.label}</p>
              </motion.div>
            ))}
          </div>
        </SlideIn>
      </div>
    </section>
  )
}

export { AIAgentsSection }