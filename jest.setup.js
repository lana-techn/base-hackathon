import '@testing-library/jest-dom'

// Mock viem for testing
jest.mock('viem', () => ({
  ...jest.requireActual('viem'),
  isAddress: jest.fn((address) => {
    return typeof address === 'string' && address.startsWith('0x') && address.length === 42
  })
}))

// Mock BigInt for older Node versions
global.BigInt = global.BigInt || ((n) => n)