'use client'

import { useTheme } from './theme-provider'
import { Card, CardContent, CardHeader, CardTitle } from './card'

export function ThemeDebug() {
  const { theme } = useTheme()

  return (
    <Card className="fixed bottom-4 left-4 z-50 w-64">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Theme Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div>Current theme: <span className="font-mono">{theme}</span></div>
        <div>HTML class: <span className="font-mono">{document.documentElement.className}</span></div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="h-4 bg-background border border-border rounded"></div>
          <div className="h-4 bg-foreground rounded"></div>
          <div className="h-4 bg-primary rounded"></div>
          <div className="h-4 bg-secondary rounded"></div>
        </div>
      </CardContent>
    </Card>
  )
}