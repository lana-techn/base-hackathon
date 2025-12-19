// Professional Color Palette System
// Optimized for both light and dark modes with proper contrast

export const colorPalette = {
  // Base Colors
  white: '#ffffff',
  black: '#000000',
  
  // Gray Scale (Neutral)
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6', 
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712'
  },

  // Primary Colors (Blue)
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Main primary
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554'
  },

  // Success Colors (Green)
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',  // Main success
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d'
  },

  // Warning Colors (Amber)
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',  // Main warning
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f'
  },

  // Error Colors (Red)
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',  // Main error
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d'
  }
} as const

export const theme = {
  colors: {
    // Light Mode Colors
    light: {
      background: colorPalette.white,
      foreground: colorPalette.gray[900],
      card: colorPalette.white,
      cardForeground: colorPalette.gray[900],
      popover: colorPalette.white,
      popoverForeground: colorPalette.gray[900],
      primary: colorPalette.blue[500],
      primaryForeground: colorPalette.white,
      secondary: colorPalette.gray[100],
      secondaryForeground: colorPalette.gray[900],
      muted: colorPalette.gray[100],
      mutedForeground: colorPalette.gray[500],
      accent: colorPalette.gray[100],
      accentForeground: colorPalette.gray[900],
      destructive: colorPalette.red[500],
      destructiveForeground: colorPalette.white,
      border: colorPalette.gray[200],
      input: colorPalette.gray[200],
      ring: colorPalette.blue[500]
    },

    // Dark Mode Colors
    dark: {
      background: colorPalette.gray[950],
      foreground: colorPalette.gray[50],
      card: colorPalette.gray[900],
      cardForeground: colorPalette.gray[50],
      popover: colorPalette.gray[900],
      popoverForeground: colorPalette.gray[50],
      primary: colorPalette.blue[500],
      primaryForeground: colorPalette.white,
      secondary: colorPalette.gray[800],
      secondaryForeground: colorPalette.gray[50],
      muted: colorPalette.gray[800],
      mutedForeground: colorPalette.gray[400],
      accent: colorPalette.gray[800],
      accentForeground: colorPalette.gray[50],
      destructive: colorPalette.red[600],
      destructiveForeground: colorPalette.white,
      border: colorPalette.gray[800],
      input: colorPalette.gray[800],
      ring: colorPalette.blue[500]
    },

    // Semantic Colors (consistent across themes)
    semantic: {
      success: colorPalette.green[500],
      warning: colorPalette.amber[500],
      error: colorPalette.red[500],
      info: colorPalette.blue[500]
    }
  },

  // Status Colors (theme-aware)
  status: {
    light: {
      success: colorPalette.green[600],
      warning: colorPalette.amber[600],
      error: colorPalette.red[600],
      info: colorPalette.blue[600]
    },
    dark: {
      success: colorPalette.green[400],
      warning: colorPalette.amber[400],
      error: colorPalette.red[400],
      info: colorPalette.blue[400]
    }
  },

  // Animation Durations
  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms'
  },

  // Spacing Scale
  spacing: {
    xs: '0.5rem',
    sm: '1rem', 
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem'
  },

  // Border Radius
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem'
  },

  // Typography Scale
  typography: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)'
  }
} as const

export type ThemeConfig = typeof theme
export type ColorPalette = typeof colorPalette

export type Theme = typeof theme