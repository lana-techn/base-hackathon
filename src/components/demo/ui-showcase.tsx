'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { GlassCard } from "@/components/ui/glass-card"
import { useToast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { 
  Settings, 
  Palette, 
  Zap, 
  Shield,
  Bell,
  User
} from "lucide-react"

const UIShowcase = () => {
  const [progress, setProgress] = useState(65)
  const [switchEnabled, setSwitchEnabled] = useState(false)
  const { toast } = useToast()

  const showToast = (variant: 'default' | 'destructive' | 'success' | 'warning') => {
    const messages = {
      default: { title: "Info", description: "This is a default toast message." },
      destructive: { title: "Error", description: "Something went wrong!" },
      success: { title: "Success", description: "Operation completed successfully!" },
      warning: { title: "Warning", description: "Please check your input." }
    }

    toast({
      variant,
      title: messages[variant].title,
      description: messages[variant].description,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Modern Web3 UI Components
          </h1>
          <p className="text-gray-300 text-lg">
            Glassmorphism design system with Shadcn/UI components
          </p>
        </div>

        {/* Buttons Section */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="h-6 w-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Buttons</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="default">Default</Button>
            <Button variant="glass">Glass</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="glow">Glow</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>

          <Separator className="my-6" />

          <div className="flex gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra Large</Button>
          </div>
        </GlassCard>

        {/* Form Components */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="h-6 w-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Form Components</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Input Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email"
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="glass-input">Glass Input</Label>
                <Input 
                  id="glass-input" 
                  placeholder="Glass variant input"
                  className="mt-2 bg-card/50 dark:bg-card/30 backdrop-blur-xl border-border/50 dark:border-white/10"
                />
              </div>
            </div>

            {/* Select and Switch */}
            <div className="space-y-4">
              <div>
                <Label>Trading Pair</Label>
                <Select>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a trading pair" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eth-usdt">ETH/USDT</SelectItem>
                    <SelectItem value="btc-usdt">BTC/USDT</SelectItem>
                    <SelectItem value="sol-usdt">SOL/USDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="notifications" 
                  checked={switchEnabled}
                  onCheckedChange={setSwitchEnabled}
                />
                <Label htmlFor="notifications">Enable notifications</Label>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Progress and Feedback */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Progress & Feedback</h2>
          </div>
          
          <div className="space-y-6">
            
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Trading Progress</Label>
                <span className="text-sm text-gray-300">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              <div className="flex gap-2 mt-3">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setProgress(Math.max(0, progress - 10))}
                >
                  -10%
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setProgress(Math.min(100, progress + 10))}
                >
                  +10%
                </Button>
              </div>
            </div>

            {/* Toast Buttons */}
            <div>
              <Label className="mb-3 block">Toast Notifications</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => showToast('default')}
                >
                  Info Toast
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => showToast('success')}
                >
                  Success Toast
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => showToast('warning')}
                >
                  Warning Toast
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => showToast('destructive')}
                >
                  Error Toast
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Dialogs and Popovers */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="h-6 w-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Dialogs & Popovers</h2>
          </div>
          
          <div className="flex gap-4">
            
            {/* Alert Dialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">Open Alert Dialog</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Action</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Open Popover</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium leading-none">Trading Settings</h4>
                  <p className="text-sm text-gray-300">
                    Configure your trading preferences and risk management settings.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="risk-level">Risk Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Risk</SelectItem>
                        <SelectItem value="medium">Medium Risk</SelectItem>
                        <SelectItem value="high">High Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </GlassCard>

        {/* Design System Info */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="h-6 w-6 text-pink-400" />
            <h2 className="text-2xl font-bold text-white">Design System Features</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Glassmorphism</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Backdrop blur effects</li>
                <li>• Transparent backgrounds</li>
                <li>• Subtle border highlights</li>
                <li>• Smooth hover transitions</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Accessibility</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Keyboard navigation support</li>
                <li>• Focus ring indicators</li>
                <li>• ARIA labels and roles</li>
                <li>• Screen reader compatibility</li>
              </ul>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

export { UIShowcase }