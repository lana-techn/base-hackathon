require('@testing-library/jest-dom')

// Mock BigInt for older Node versions
global.BigInt = global.BigInt || ((n) => n)