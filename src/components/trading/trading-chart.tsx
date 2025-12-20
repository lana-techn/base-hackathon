'use client'

import { useEffect, useRef, memo } from 'react'
import {
    createChart,
    ColorType,
    CandlestickSeries,
    LineSeries
} from 'lightweight-charts'
import type { IChartApi, ISeriesApi, CandlestickData, Time, LineData } from 'lightweight-charts'

interface TradingChartProps {
    symbol?: string
    data?: CandlestickData<Time>[]
    className?: string
    height?: number
    showVolume?: boolean
}

// Generate mock candlestick data for demo
const generateMockData = (): CandlestickData<Time>[] => {
    const data: CandlestickData<Time>[] = []
    const basePrice = 3500
    let currentPrice = basePrice
    const now = new Date()

    for (let i = 100; i >= 0; i--) {
        const date = new Date(now)
        date.setHours(date.getHours() - i)

        const volatility = 0.02
        const change = (Math.random() - 0.5) * volatility * currentPrice
        const open = currentPrice
        const close = currentPrice + change
        const high = Math.max(open, close) + Math.random() * volatility * currentPrice * 0.5
        const low = Math.min(open, close) - Math.random() * volatility * currentPrice * 0.5

        data.push({
            time: (date.getTime() / 1000) as Time,
            open: Math.round(open * 100) / 100,
            high: Math.round(high * 100) / 100,
            low: Math.round(low * 100) / 100,
            close: Math.round(close * 100) / 100,
        })

        currentPrice = close
    }

    return data
}

const TradingChart = memo(function TradingChart({
    symbol = 'ETH/USDT',
    data,
    className = '',
    height = 400,
}: TradingChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<IChartApi | null>(null)
    const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

    useEffect(() => {
        if (!chartContainerRef.current) return

        // Get theme from document
        const isDark = document.documentElement.classList.contains('dark')

        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: height,
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: isDark ? '#a3a3a3' : '#737373',
                fontFamily: 'Inter, system-ui, sans-serif',
            },
            grid: {
                vertLines: { color: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.08)' },
                horzLines: { color: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.08)' },
            },
            crosshair: {
                mode: 1,
                vertLine: {
                    color: isDark ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.4)',
                    labelBackgroundColor: '#7c3aed',
                },
                horzLine: {
                    color: isDark ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.4)',
                    labelBackgroundColor: '#7c3aed',
                },
            },
            rightPriceScale: {
                borderColor: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.15)',
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.2,
                },
            },
            timeScale: {
                borderColor: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.15)',
                timeVisible: true,
                secondsVisible: false,
            },
            handleScale: {
                axisPressedMouseMove: true,
            },
            handleScroll: {
                vertTouchDrag: false,
            },
        })

        // v5 API: use addSeries with exported SeriesDefinition
        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#22c55e',
            downColor: '#ef4444',
            borderUpColor: '#22c55e',
            borderDownColor: '#ef4444',
            wickUpColor: '#22c55e',
            wickDownColor: '#ef4444',
        })

        // Use provided data or generate mock data
        const chartData = data || generateMockData()
        candleSeries.setData(chartData)

        // Add SMA indicator
        const smaData = chartData.map((candle, index, arr) => {
            if (index < 20) return null
            const sum = arr.slice(index - 20, index).reduce((acc, c) => acc + c.close, 0)
            return {
                time: candle.time,
                value: sum / 20,
            }
        }).filter((item): item is LineData<Time> => item !== null)

        const smaSeries = chart.addSeries(LineSeries, {
            color: '#a855f7',
            lineWidth: 2,
            priceLineVisible: false,
            lastValueVisible: false,
        })
        smaSeries.setData(smaData)

        // Fit content
        chart.timeScale().fitContent()

        chartRef.current = chart
        candleSeriesRef.current = candleSeries

        // Handle resize
        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                })
            }
        }

        window.addEventListener('resize', handleResize)

        // Theme observer
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const isDarkNow = document.documentElement.classList.contains('dark')
                    chart.applyOptions({
                        layout: {
                            textColor: isDarkNow ? '#a3a3a3' : '#737373',
                        },
                        grid: {
                            vertLines: { color: isDarkNow ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.08)' },
                            horzLines: { color: isDarkNow ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.08)' },
                        },
                    })
                }
            })
        })
        observer.observe(document.documentElement, { attributes: true })

        return () => {
            window.removeEventListener('resize', handleResize)
            observer.disconnect()
            chart.remove()
        }
    }, [data, height])

    return (
        <div className={`relative ${className}`}>
            {/* Symbol Badge */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">{symbol}</span>
                <span className="text-xs text-muted-foreground px-2 py-0.5 bg-secondary rounded-full">
                    1H
                </span>
            </div>

            {/* SMA Legend */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs">
                    <div className="w-3 h-0.5 bg-[#a855f7] rounded-full" />
                    <span className="text-muted-foreground">SMA(20)</span>
                </div>
            </div>

            {/* Chart Container */}
            <div
                ref={chartContainerRef}
                className="w-full rounded-lg overflow-hidden"
                style={{ height }}
            />
        </div>
    )
})

export { TradingChart }
export type { TradingChartProps }
