/**
 * Production-safe logger that removes console logs in production
 */

const isDevelopment = process.env.NODE_ENV === 'development'
const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === 'true'

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment || isMockMode) {
      console.log(...args)
    }
  },
  
  info: (...args: any[]) => {
    if (isDevelopment || isMockMode) {
      console.info(...args)
    }
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment || isMockMode) {
      console.warn(...args)
    }
  },
  
  error: (...args: any[]) => {
    // Always log errors, even in production
    console.error(...args)
  },
  
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args)
    }
  }
}

// For backward compatibility
export default logger