'use client'

import { useState } from 'react'

const faqs = [
    {
        question: 'What is BethNa AI Trader?',
        answer: 'BethNa AI Trader is an autonomous AI trading system that uses three specialized agents to analyze markets, execute trades, and report performance. It operates on Base L2 for fast, low-cost transactions.'
    },
    {
        question: 'How does the AI make trading decisions?',
        answer: 'Agent Alpha uses technical indicators like RSI, MACD, and Bollinger Bands combined with machine learning to identify trading opportunities. It generates signals that Agent Beta then executes on-chain.'
    },
    {
        question: 'Is my crypto safe with BethNa?',
        answer: 'Yes. BethNa uses non-custodial smart contracts audited by leading security firms. Your funds remain in your wallet until a trade is executed, and you maintain full control at all times.'
    },
    {
        question: 'What fees does BethNa charge?',
        answer: 'BethNa charges a small performance fee only on profitable trades. There are no subscription fees, deposit fees, or withdrawal fees. You only pay when you profit.'
    },
    {
        question: 'How do I get started?',
        answer: 'Simply connect your wallet, deposit USDC or ETH, configure your risk parameters, and activate the AI agents. The entire setup takes less than 5 minutes.'
    },
    {
        question: 'Can I see the AI\'s trade history?',
        answer: 'Absolutely. Agent Gamma posts all trades to Farcaster in real-time, and you can view complete trade history on your dashboard with detailed analytics and performance metrics.'
    }
]

function FAQItem({
    question,
    answer,
    isOpen,
    onToggle
}: {
    question: string
    answer: string
    isOpen: boolean
    onToggle: () => void
}) {
    return (
        <div className="border-b border-border/50 dark:border-white/10 last:border-b-0">
            <button
                onClick={onToggle}
                className="w-full py-5 flex items-center justify-between text-left hover:text-orbit-500 transition-colors"
            >
                <span className="font-medium text-foreground pr-4">{question}</span>
                <span className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                    <svg className="w-5 h-5 text-orbit-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'
                    }`}
            >
                <p className="text-muted-foreground leading-relaxed pr-8">{answer}</p>
            </div>
        </div>
    )
}

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    // Split FAQs into two columns
    const midpoint = Math.ceil(faqs.length / 2)
    const leftColumn = faqs.slice(0, midpoint)
    const rightColumn = faqs.slice(midpoint)

    return (
        <section className="py-24 px-6 bg-muted/30 dark:bg-muted/10 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orbit-500/5 dark:bg-orbit-500/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Section header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Everything you need to know about BethNa AI Trader
                    </p>
                </div>

                {/* FAQ Grid - 2 columns on desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-0">
                    {/* Left column */}
                    <div className="bg-card/50 dark:bg-card/30 rounded-xl border border-border/50 dark:border-white/10 p-6">
                        {leftColumn.map((faq, index) => (
                            <FAQItem
                                key={index}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openIndex === index}
                                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                            />
                        ))}
                    </div>

                    {/* Right column */}
                    <div className="bg-card/50 dark:bg-card/30 rounded-xl border border-border/50 dark:border-white/10 p-6">
                        {rightColumn.map((faq, index) => {
                            const actualIndex = index + midpoint
                            return (
                                <FAQItem
                                    key={actualIndex}
                                    question={faq.question}
                                    answer={faq.answer}
                                    isOpen={openIndex === actualIndex}
                                    onToggle={() => setOpenIndex(openIndex === actualIndex ? null : actualIndex)}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
