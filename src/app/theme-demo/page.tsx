'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ThemeDemoPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Theme Demo</h1>
            <p className="text-muted-foreground mt-2">
              Showcase of the new light/dark theme system
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>
              Professional color system that adapts to light and dark themes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Base Colors */}
            <div>
              <h4 className="text-sm font-medium mb-3 text-foreground">Base Colors</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="h-16 bg-primary rounded-lg"></div>
                  <p className="text-sm text-muted-foreground">Primary</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 bg-secondary rounded-lg"></div>
                  <p className="text-sm text-muted-foreground">Secondary</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 bg-accent rounded-lg"></div>
                  <p className="text-sm text-muted-foreground">Accent</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 bg-muted rounded-lg"></div>
                  <p className="text-sm text-muted-foreground">Muted</p>
                </div>
              </div>
            </div>

            {/* Status Colors */}
            <div>
              <h4 className="text-sm font-medium mb-3 text-foreground">Status Colors</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="h-16 bg-success rounded-lg"></div>
                  <p className="text-sm text-muted-foreground">Success</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 bg-warning rounded-lg"></div>
                  <p className="text-sm text-muted-foreground">Warning</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 bg-error rounded-lg"></div>
                  <p className="text-sm text-muted-foreground">Error</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 bg-info rounded-lg"></div>
                  <p className="text-sm text-muted-foreground">Info</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Components */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>
                Various button styles using theme colors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
              <CardDescription>
                Status indicators and labels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Form Elements */}
          <Card>
            <CardHeader>
              <CardTitle>Form Elements</CardTitle>
              <CardDescription>
                Input fields and labels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password" />
              </div>
            </CardContent>
          </Card>

          {/* Typography */}
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>
                Text styles and hierarchy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">Heading 1</h1>
                <h2 className="text-xl font-semibold text-foreground">Heading 2</h2>
                <h3 className="text-lg font-medium text-foreground">Heading 3</h3>
                <p className="text-foreground">Regular text content</p>
                <p className="text-muted-foreground">Muted text content</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trading-specific Components */}
        <Card>
          <CardHeader>
            <CardTitle>Trading Interface Preview</CardTitle>
            <CardDescription>
              How the theme looks in trading context
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">BTC/USD</span>
                  <Badge className="bg-success text-success-foreground">+2.5%</Badge>
                </div>
                <div className="text-2xl font-bold text-foreground">$67,234.56</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">ETH/USD</span>
                  <Badge className="bg-error text-error-foreground">-1.2%</Badge>
                </div>
                <div className="text-2xl font-bold text-foreground">$3,456.78</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Portfolio</span>
                  <Badge>Active</Badge>
                </div>
                <div className="text-2xl font-bold text-foreground">$12,345.67</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Status */}
        <Card>
          <CardHeader>
            <CardTitle>Theme Status</CardTitle>
            <CardDescription>
              Current theme configuration and fixes applied
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Light Mode Background</span>
                <Badge variant="secondary">✓ Pure White (#ffffff)</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Dark Mode Background</span>
                <Badge variant="secondary">✓ True Dark (#0a0a0a)</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Contrast Ratio</span>
                <Badge variant="secondary">✓ WCAG AA Compliant</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Status Colors</span>
                <Badge variant="secondary">✓ Semantic & Consistent</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Theme Switching</span>
                <Badge variant="secondary">✓ Instant & Smooth</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Values */}
        <Card>
          <CardHeader>
            <CardTitle>Color Values</CardTitle>
            <CardDescription>
              Actual HSL values used in the theme system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
              <div>
                <h4 className="font-semibold mb-2 font-sans">Light Mode</h4>
                <div className="space-y-1">
                  <div>Background: hsl(0 0% 100%)</div>
                  <div>Foreground: hsl(0 0% 9%)</div>
                  <div>Primary: hsl(221 83% 53%)</div>
                  <div>Border: hsl(0 0% 90%)</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2 font-sans">Dark Mode</h4>
                <div className="space-y-1">
                  <div>Background: hsl(0 0% 4%)</div>
                  <div>Foreground: hsl(0 0% 98%)</div>
                  <div>Primary: hsl(221 83% 53%)</div>
                  <div>Border: hsl(0 0% 15%)</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}