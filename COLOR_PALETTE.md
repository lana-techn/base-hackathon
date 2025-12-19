# Color Palette System

## Overview

Sistem color palette yang profesional dan konsisten untuk BethNa AI Trader, dioptimalkan untuk light dan dark mode dengan kontras yang tepat.

## Color Palette

### Base Colors

#### Light Mode
- **Background**: `#ffffff` (Pure white)
- **Foreground**: `#111827` (Almost black)
- **Card**: `#ffffff` (Pure white)
- **Border**: `#e5e7eb` (Light gray)

#### Dark Mode  
- **Background**: `#030712` (Very dark gray)
- **Foreground**: `#f9fafb` (Almost white)
- **Card**: `#111827` (Dark gray)
- **Border**: `#1f2937` (Dark gray)

### Primary Colors

#### Blue (Primary)
- **Light**: `#3b82f6` (Blue 500)
- **Dark**: `#3b82f6` (Same blue - good contrast in both modes)

### Status Colors

#### Success (Green)
- **Color**: `#22c55e` (Green 500)
- **Usage**: Connected status, positive values, success messages

#### Warning (Amber)
- **Color**: `#f59e0b` (Amber 500)  
- **Usage**: Connecting status, warnings, pending states

#### Error (Red)
- **Color**: `#ef4444` (Red 500)
- **Usage**: Disconnected status, errors, negative values

#### Info (Blue)
- **Color**: `#3b82f6` (Blue 500)
- **Usage**: Information, neutral status

## Usage Guidelines

### Theme-Aware Colors

```tsx
// ✅ Correct - Uses theme variables
<div className="bg-background text-foreground">
  <h1 className="text-primary">Title</h1>
  <p className="text-muted-foreground">Description</p>
</div>
```

### Status Colors

```tsx
// ✅ Network/Agent Status
<span className="text-success">Connected</span>
<span className="text-warning">Connecting</span>
<span className="text-error">Disconnected</span>
<span className="text-info">Info</span>
```

### Trading Interface Colors

```tsx
// ✅ Trading Values
<Badge className="bg-success text-success-foreground">+2.5%</Badge>
<Badge className="bg-error text-error-foreground">-1.2%</Badge>
```

## Component Examples

### Cards
```tsx
<Card className="bg-card text-card-foreground border-border">
  <CardHeader>
    <CardTitle className="text-foreground">Title</CardTitle>
    <CardDescription className="text-muted-foreground">Description</CardDescription>
  </CardHeader>
</Card>
```

### Buttons
```tsx
<Button className="bg-primary text-primary-foreground">Primary</Button>
<Button variant="secondary" className="bg-secondary text-secondary-foreground">Secondary</Button>
<Button variant="outline" className="border-border">Outline</Button>
```

### Status Indicators
```tsx
<div className="flex items-center space-x-2">
  <div className="w-2 h-2 bg-success rounded-full"></div>
  <span className="text-success">Online</span>
</div>
```

## Accessibility

### Contrast Ratios

All color combinations meet WCAG 2.1 AA standards:

- **Light Mode**: Minimum 4.5:1 contrast ratio
- **Dark Mode**: Minimum 4.5:1 contrast ratio
- **Status Colors**: High contrast against both backgrounds

### Color Blindness

- Status colors are distinguishable for all types of color blindness
- Additional visual indicators (icons, shapes) supplement color coding
- Semantic meaning doesn't rely solely on color

## Implementation

### CSS Variables

Colors are defined as HSL values in `globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... */
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  /* ... */
}
```

### Tailwind Configuration

Extended in `tailwind.config.js`:

```js
colors: {
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  },
  success: {
    DEFAULT: "#22c55e",
    foreground: "#ffffff",
  },
  // ...
}
```

## Testing

Visit `/theme-demo` to see all colors in action:

1. **Color Palette Showcase**: All base and status colors
2. **Component Examples**: Buttons, cards, badges with proper colors
3. **Theme Toggle**: Switch between light and dark modes
4. **Status Indicators**: Network and agent status colors

## Best Practices

### Do ✅

- Use semantic color names (`text-success`, `bg-error`)
- Test in both light and dark modes
- Ensure proper contrast ratios
- Use status colors consistently across components

### Don't ❌

- Use hardcoded hex colors in components
- Mix different color systems
- Ignore accessibility guidelines
- Use colors without semantic meaning

## Migration Guide

### From Old System

```tsx
// ❌ Old way
<span className="text-green-500 dark:text-green-400">Success</span>
<span className="text-red-500 dark:text-red-400">Error</span>

// ✅ New way  
<span className="text-success">Success</span>
<span className="text-error">Error</span>
```

### Component Updates

All components have been updated to use the new color system:

- ✅ Navigation components
- ✅ Card components  
- ✅ Button variants
- ✅ Status indicators
- ✅ Form elements
- ✅ Landing page sections