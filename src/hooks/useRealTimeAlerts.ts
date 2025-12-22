import { useState, useEffect, useCallback, useRef } from 'react'
import { useToast } from '@/components/ui/use-toast'

export interface PriceAlert {
  id: string
  symbol: string
  type: 'ABOVE' | 'BELOW' | 'CHANGE_PERCENT'
  value: number
  currentPrice?: number
  isActive: boolean
  createdAt: Date
  triggeredAt?: Date
  message?: string
}

export interface SignalAlert {
  id: string
  agent: 'ALPHA' | 'BETA' | 'GAMMA'
  type: 'BUY_CALL' | 'BUY_PUT' | 'CLOSE_POSITION' | 'HOLD'
  symbol: string
  confidence: number
  reasoning: string
  timestamp: Date
  isRead: boolean
}

export interface AlertNotification {
  id: string
  type: 'PRICE' | 'SIGNAL' | 'POSITION' | 'SYSTEM'
  title: string
  message: string
  severity: 'info' | 'warning' | 'error' | 'success'
  timestamp: Date
  isRead: boolean
  data?: any
}

export interface UseRealTimeAlertsReturn {
  priceAlerts: PriceAlert[]
  signalAlerts: SignalAlert[]
  notifications: AlertNotification[]
  unreadCount: number
  addPriceAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'isActive'>) => void
  removePriceAlert: (id: string) => void
  markAlertAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
  checkPriceAlerts: (symbol: string, currentPrice: number) => void
  addSignalAlert: (signalData: Omit<SignalAlert, 'id' | 'isRead'>) => void
}

export function useRealTimeAlerts(): UseRealTimeAlertsReturn {
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([])
  const [signalAlerts, setSignalAlerts] = useState<SignalAlert[]>([])
  const [notifications, setNotifications] = useState<AlertNotification[]>([])
  const { toast } = useToast()
  
  const priceCheckIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastPricesRef = useRef<Record<string, number>>({})

  // Add price alert
  const addPriceAlert = useCallback((alertData: Omit<PriceAlert, 'id' | 'createdAt' | 'isActive'>) => {
    const newAlert: PriceAlert = {
      ...alertData,
      id: `price-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      isActive: true
    }

    setPriceAlerts(prev => [...prev, newAlert])

    // Show confirmation toast
    toast({
      title: "Price Alert Created",
      description: `Alert set for ${alertData.symbol} ${alertData.type.toLowerCase()} ${alertData.value}`,
    })
  }, [toast])

  // Remove price alert
  const removePriceAlert = useCallback((id: string) => {
    setPriceAlerts(prev => prev.filter(alert => alert.id !== id))
  }, [])

  // Check price alerts
  const checkPriceAlerts = useCallback((symbol: string, currentPrice: number) => {
    setPriceAlerts(prev => prev.map(alert => {
      if (alert.symbol !== symbol || !alert.isActive) {
        return alert
      }

      let shouldTrigger = false
      let message = ''

      switch (alert.type) {
        case 'ABOVE':
          if (currentPrice >= alert.value) {
            shouldTrigger = true
            message = `${symbol} price (${currentPrice}) is above ${alert.value}`
          }
          break
        case 'BELOW':
          if (currentPrice <= alert.value) {
            shouldTrigger = true
            message = `${symbol} price (${currentPrice}) is below ${alert.value}`
          }
          break
        case 'CHANGE_PERCENT':
          const lastPrice = lastPricesRef.current[symbol]
          if (lastPrice) {
            const changePercent = ((currentPrice - lastPrice) / lastPrice) * 100
            if (Math.abs(changePercent) >= alert.value) {
              shouldTrigger = true
              message = `${symbol} price changed by ${changePercent.toFixed(2)}% (${alert.value}% threshold)`
            }
          }
          break
      }

      if (shouldTrigger) {
        // Create notification
        const notification: AlertNotification = {
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'PRICE',
          title: 'Price Alert Triggered',
          message,
          severity: 'warning',
          timestamp: new Date(),
          isRead: false,
          data: { alert, currentPrice }
        }

        setNotifications(prev => [notification, ...prev])

        // Show toast notification
        toast({
          title: "🚨 Price Alert",
          description: message,
          variant: "destructive"
        })

        // Browser notification (if permission granted)
        if (Notification.permission === 'granted') {
          new Notification('BethNa AI Trader - Price Alert', {
            body: message,
            icon: '/favicon.ico'
          })
        }

        return {
          ...alert,
          isActive: false,
          triggeredAt: new Date(),
          currentPrice,
          message
        }
      }

      return alert
    }))

    // Update last price
    lastPricesRef.current[symbol] = currentPrice
  }, [toast])

  // Add signal alert
  const addSignalAlert = useCallback((signalData: Omit<SignalAlert, 'id' | 'isRead'>) => {
    const newAlert: SignalAlert = {
      ...signalData,
      id: `signal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      isRead: false
    }

    setSignalAlerts(prev => [newAlert, ...prev.slice(0, 49)]) // Keep last 50

    // Create notification
    const notification: AlertNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'SIGNAL',
      title: `Agent ${signalData.agent} Signal`,
      message: `${signalData.type} signal for ${signalData.symbol} (${signalData.confidence}% confidence)`,
      severity: signalData.type === 'HOLD' ? 'info' : 'success',
      timestamp: new Date(),
      isRead: false,
      data: signalData
    }

    setNotifications(prev => [notification, ...prev])

    // Show toast for high confidence signals
    if (signalData.confidence >= 70) {
      toast({
        title: `🤖 Agent ${signalData.agent}`,
        description: `${signalData.type} signal for ${signalData.symbol}`,
        variant: signalData.type === 'HOLD' ? 'default' : 'default'
      })
    }

    // Browser notification for high confidence signals
    if (Notification.permission === 'granted' && signalData.confidence >= 80) {
      new Notification(`BethNa AI Trader - Agent ${signalData.agent}`, {
        body: `${signalData.type} signal for ${signalData.symbol} (${signalData.confidence}% confidence)`,
        icon: '/favicon.ico'
      })
    }
  }, [toast])

  // Mark alert as read
  const markAlertAsRead = useCallback((id: string) => {
    setSignalAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, isRead: true } : alert
    ))
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ))
  }, [])

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setSignalAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })))
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })))
  }, [])

  // Clear notifications
  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Expose functions for external use
  const alertFunctions = {
    checkPriceAlerts,
    addSignalAlert
  }

  // Store functions in window for external access
  useEffect(() => {
    ;(window as any).bethnaAlerts = alertFunctions
    return () => {
      delete (window as any).bethnaAlerts
    }
  }, [alertFunctions])

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead).length + 
                     signalAlerts.filter(a => !a.isRead).length

  return {
    priceAlerts,
    signalAlerts,
    notifications,
    unreadCount,
    addPriceAlert,
    removePriceAlert,
    markAlertAsRead,
    markAllAsRead,
    clearNotifications,
    checkPriceAlerts,
    addSignalAlert
  }
}

// Hook for integrating with price streams
export function usePriceAlertIntegration(prices: Record<string, any>) {
  const { checkPriceAlerts } = useRealTimeAlerts()

  useEffect(() => {
    Object.entries(prices).forEach(([symbol, priceData]) => {
      if (priceData?.price) {
        checkPriceAlerts(symbol, priceData.price)
      }
    })
  }, [prices, checkPriceAlerts])
}

// Hook for integrating with signal streams
export function useSignalAlertIntegration(analysis: any) {
  const { addSignalAlert } = useRealTimeAlerts()

  useEffect(() => {
    if (analysis?.signal && analysis?.confidence) {
      addSignalAlert({
        agent: 'ALPHA',
        type: analysis.signal,
        symbol: 'ETH/USDT', // This should come from context
        confidence: analysis.confidence,
        reasoning: analysis.reasoning || '',
        timestamp: new Date()
      })
    }
  }, [analysis, addSignalAlert])
}