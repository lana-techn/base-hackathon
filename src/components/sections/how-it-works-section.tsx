'use client'

import { motion } from "framer-motion"
import { SlideIn, StaggerContainer, StaggerItem } from "@/components/ui/micro-interactions"
import { GlassCard } from "@/components/ui/glass-card"
import { 
  Database, 
  Brain, 
  Target, 
  Coins, 
  Share2, 
  ArrowRight,
  CheckCircle,
  Clock,
  Shield
} from "lucide-react"

interface Step {
  number: string
  title: string
  description: string
  icon: React.ReactNode
  details: string[]
  color: string
}

const steps: Step[] = [
  {
    number: "01",
    title: "Data Collection",
    description: "Agent Alpha continuously monitors market data from CoinGecko and other major data providers.",
    icon: <Database className="h-8 w-8" />,
    details: [
      "Real-time price feeds from CoinGecko API",
      "720-hour historical data analysis", 
      "Technical indicator calculations",
      "Market sentiment analysis"
    ],
    color: "cyan"
  },
  {
    number: "02", 
    title: "AI Analysis",
    description: "Advanced algorithms analyze market patterns, calculate technical indicators, and generate high-confidence trading signals.",
    icon: <Brain className="h-8 w-8" />,
    details: [
      "Bollinger Bands (20-period, 2 std dev)",
      "RSI analysis (14-period)",
      "Backtesting with 30-day history",
      "Confidence scoring system"
    ],
    color: "purple"
  },
  {
    number: "03",
    title: "Options Execution", 
    description: "Agent Beta executes options trades through Thetanuts V4 protocol with sophisticated risk management and Greeks hedging.",
    icon: <Target className="h-8 w-8" />,
    details: [
      "Thetanuts V4 integration",
      "Automated Greeks hedging",
      "Position sizing algorithms",
      "Risk management protocols"
    ],
    color: "yellow"
  },
  {
    number: "04",
    title: "Blockchain Settlement",
    description: "Agent Gamma handles on-chain transactions on Base L2 network with optimized gas usage and smart contract interactions.",
    icon: <Coins className="h-8 w-8" />,
    details: [
      "Base L2 network integration",
      "Smart contract automation",
      "Gas optimization strategies",
      "Position tracking & PnL"
    ],
    color: "green"
  },
  {
    number: "05",
    title: "Social Transparency",
    description: "Agent Delta automatically posts trade results and analysis to social media platforms for complete transparency.",
    icon: <Share2 className="h-8 w-8" />,
    details: [
      "Twitter/X automated posts",
      "Farcaster integration",
      "AI-generated content",
      "Real-time trade reports"
    ],
    color: "blue"
  }
]

const HowItWorksSection = () => {
  const getColorClasses = (color: string) => {
    const colors = {
      cyan: "text-info border-info/30 bg-info/10",
      purple: "text-primary border-primary/30 bg-primary/10",
      yellow: "text-warning border-warning/30 bg-warning/10",
      green: "text-success border-success/30 bg-success/10",
      blue: "text-info border-info/30 bg-info/10"
    }
    return colors[color as keyof typeof colors] || colors.cyan
  }

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <SlideIn direction="up" delay={0.2}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our autonomous swarm agent system operates through a sophisticated 
              5-step process that ensures optimal trading performance and complete transparency.
            </p>
          </div>
        </SlideIn>

        {/* Steps */}
        <StaggerContainer staggerDelay={0.2}>
          <div className="space-y-12">
            {steps.map((step, index) => (
              <StaggerItem key={step.number}>
                <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                  
                  {/* Step Content */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center ${getColorClasses(step.color)}`}>
                        <span className="text-2xl font-bold">{step.number}</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
                      </div>
                    </div>
                    
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                    
                    <div className="space-y-3">
                      {step.details.map((detail, detailIndex) => (
                        <motion.div
                          key={detail}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * detailIndex }}
                          className="flex items-center gap-3"
                        >
                          <CheckCircle className={`h-5 w-5 ${step.color === 'cyan' ? 'text-info' :
                            step.color === 'purple' ? 'text-primary' :
                            step.color === 'yellow' ? 'text-warning' :
                            step.color === 'green' ? 'text-success' :
                            'text-info'}`} />
                          <span className="text-muted-foreground">{detail}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Step Visualization */}
                  <div className="flex-1 flex justify-center">
                    <GlassCard className="p-8 w-full max-w-md">
                      <div className="text-center space-y-6">
                        <div className={`w-20 h-20 mx-auto rounded-full border-2 flex items-center justify-center ${getColorClasses(step.color)}`}>
                          <div className={step.color === 'cyan' ? 'text-info' :
                            step.color === 'purple' ? 'text-primary' :
                            step.color === 'yellow' ? 'text-warning' :
                            step.color === 'green' ? 'text-success' :
                            'text-info'}>
                            {step.icon}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-xl font-semibold text-foreground mb-2">
                            {step.title}
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            Step {step.number} of 05
                          </p>
                        </div>

                        {/* Progress Indicator */}
                        <div className="w-full bg-secondary rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${((index + 1) / steps.length) * 100}%` }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className={`h-2 rounded-full ${
                              step.color === 'cyan' ? 'bg-info' :
                              step.color === 'purple' ? 'bg-primary' :
                              step.color === 'yellow' ? 'bg-warning' :
                              step.color === 'green' ? 'bg-success' :
                              'bg-info'
                            }`}
                          />
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                </div>

                {/* Arrow Connector */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-8">
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-muted-foreground"
                    >
                      <ArrowRight className="h-8 w-8 rotate-90" />
                    </motion.div>
                  </div>
                )}
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        {/* Key Features */}
        <SlideIn direction="up" delay={1.0}>
          <div className="mt-20">
            <h3 className="text-3xl font-bold text-foreground text-center mb-12">
              Key System Features
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Clock className="h-8 w-8" />,
                  title: "24/7 Operation",
                  description: "Continuous market monitoring and automated trading execution without human intervention."
                },
                {
                  icon: <Shield className="h-8 w-8" />,
                  title: "Risk Management",
                  description: "Advanced risk controls with position sizing, stop-losses, and automated hedging strategies."
                },
                {
                  icon: <Brain className="h-8 w-8" />,
                  title: "AI-Powered",
                  description: "Machine learning algorithms that adapt and improve trading strategies over time."
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index }}
                >
                  <GlassCard className="p-6 text-center h-full">
                    <div className="text-info flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h4 className="text-xl font-semibold text-foreground mb-3">
                      {feature.title}
                    </h4>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </SlideIn>
      </div>
    </section>
  )
}

export { HowItWorksSection }