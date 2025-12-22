'use client'

import { useState } from 'react'
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, BellRing, Plus, X, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import { useRealTimeAlerts } from "@/hooks/useRealTimeAlerts"
import { formatTimeOnly } from "@/utils/format"

interface RealTimeAlertsProps {
  className?: string
}

export function RealTimeAlerts({ className }: RealTimeAlertsProps) {
  const {
    priceAlerts,
    notifications,
    unreadCount,
    addPriceAlert,
    removePriceAlert,
    markAlertAsRead,
    markAllAsRead,
    clearNotifications
  } = useRealTimeAlerts()

  const [showAddAlert, setShowAddAlert] = useState(false)
  const [newAlert, setNewAlert] = useState({
    symbol: 'ETHUSDT',
    type: 'ABOVE' as 'ABOVE' | 'BELOW' | 'CHANGE_PERCENT',
    value: 0
  })

  const handleAddAlert = () => {
    if (newAlert.value > 0) {
      addPriceAlert(newAlert)
      setNewAlert({ symbol: 'ETHUSDT', type: 'ABOVE', value: 0 })
      setShowAddAlert(false)
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'ABOVE':
        return <TrendingUp className="w-4 h-4 text-success" />
      case 'BELOW':
        return <TrendingDown className="w-4 h-4 text-destructive" />
      case 'CHANGE_PERCENT':
        return <AlertTriangle className="w-4 h-4 text-warning" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getNotificationSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'border-destructive/50 bg-destructive/10'
      case 'warning':
        return 'border-warning/50 bg-warning/10'
      case 'success':
        return 'border-success/50 bg-success/10'
      default:
        return 'border-muted/50 bg-muted/10'
    }
  }

  return (
    <GlassCard className={className}>
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center">
              {unreadCount > 0 ? (
                <BellRing className="w-4 h-4 text-warning" />
              ) : (
                <Bell className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <h3 className="font-semibold text-foreground">Alerts</h3>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddAlert(!showAddAlert)}
              className="h-8 w-8 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                Mark All Read
              </Button>
            )}
          </div>
        </div>

        {/* Add Alert Form */}
        {showAddAlert && (
          <div className="mt-4 p-3 bg-secondary/50 rounded-lg space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={newAlert.symbol}
                onValueChange={(value) => setNewAlert(prev => ({ ...prev, symbol: value }))}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETHUSDT">ETH/USDT</SelectItem>
                  <SelectItem value="BTCUSDT">BTC/USDT</SelectItem>
                  <SelectItem value="SOLUSDT">SOL/USDT</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={newAlert.type}
                onValueChange={(value: 'ABOVE' | 'BELOW' | 'CHANGE_PERCENT') => setNewAlert(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ABOVE">Above</SelectItem>
                  <SelectItem value="BELOW">Below</SelectItem>
                  <SelectItem value="CHANGE_PERCENT">Change %</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Value"
                value={newAlert.value || ''}
                onChange={(e) => setNewAlert(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                className="h-8"
              />
              <Button size="sm" onClick={handleAddAlert} className="h-8">
                Add
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddAlert(false)}
                className="h-8"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto max-h-[300px]">
        {/* Active Price Alerts */}
        {priceAlerts.filter(alert => alert.isActive).length > 0 && (
          <div className="p-3 border-b border-border/20">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Active Price Alerts</h4>
            <div className="space-y-2">
              {priceAlerts.filter(alert => alert.isActive).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {getAlertIcon(alert.type)}
                    <span className="text-sm font-mono">
                      {alert.symbol} {alert.type.toLowerCase()} {alert.value}
                      {alert.type === 'CHANGE_PERCENT' && '%'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePriceAlert(alert.id)}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Notifications */}
        <div className="p-3">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Recent Notifications</h4>
          <div className="space-y-2">
            {notifications.slice(0, 10).map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  notification.isRead 
                    ? 'bg-secondary/20 border-border/30' 
                    : getNotificationSeverityColor(notification.severity)
                }`}
                onClick={() => markAlertAsRead(notification.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-foreground">
                        {notification.title}
                      </span>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <span className="text-xs text-muted-foreground/70">
                      {formatTimeOnly(notification.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No alerts yet</p>
                <p className="text-xs">Set up price alerts to get notified</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {notifications.length > 10 && (
        <div className="p-3 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearNotifications}
            className="w-full text-xs"
          >
            Clear All Notifications
          </Button>
        </div>
      )}
    </GlassCard>
  )
}