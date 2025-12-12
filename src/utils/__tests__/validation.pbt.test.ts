/**
 * Property-Based Tests for Data Validation Robustness
 * **Feature: bethna-ai-trader, Property 16: Data Validation Robustness**
 * **Validates: Requirements 8.2, 8.5**
 */

import * as fc from 'fast-check'
import {
  validateBinanceKlineResponse,
  validateThetanutsOptionData,
  validateMarketData,
  validateCandlestickData,
  sanitizeUserInput,
  sanitizeAgentMessage,
  validateAndSanitizeJson,
  validateExternalApiResponse,
  validateDataArray,
  validateTransactionHash,
  validatePriceData,
  validateTradingSignal,
  validatePosition,
  validateTradeEvent,
  validateAgentMessage
} from '@/utils/validation'

// Generators for malformed data
const malformedStringArbitrary = fc.oneof(
  fc.constant(null),
  fc.constant(undefined),
  fc.integer(),
  fc.boolean(),
  fc.array(fc.string()),
  fc.object()
)

const malformedNumberArbitrary = fc.oneof(
  fc.constant(null),
  fc.constant(undefined),
  fc.string(),
  fc.boolean(),
  fc.array(fc.integer()),
  fc.object(),
  fc.constant(NaN),
  fc.constant(Infinity),
  fc.constant(-Infinity)
)

const malformedArrayArbitrary = fc.oneof(
  fc.constant(null),
  fc.constant(undefined),
  fc.string(),
  fc.integer(),
  fc.boolean(),
  fc.object()
)

// Generators for valid data
const validAddressArbitrary = fc.string({ minLength: 42, maxLength: 42 }).map(s => `0x${s.slice(2).padStart(40, '0')}`)

const validBinanceKlineArbitrary = fc.record({
  symbol: fc.string({ minLength: 3, maxLength: 10 }),
  data: fc.array(fc.tuple(
    fc.integer({ min: 1600000000000, max: Date.now() }), // Open time
    fc.float({ min: 0.01, max: 100000 }).map(n => n.toString()), // Open price
    fc.float({ min: 0.01, max: 100000 }).map(n => n.toString()), // High price
    fc.float({ min: 0.01, max: 100000 }).map(n => n.toString()), // Low price
    fc.float({ min: 0.01, max: 100000 }).map(n => n.toString()), // Close price
    fc.float({ min: 0, max: 1000000 }).map(n => n.toString()), // Volume
    fc.integer({ min: 1600000000000, max: Date.now() }), // Close time
    fc.float({ min: 0, max: 1000000 }).map(n => n.toString()), // Quote asset volume
    fc.integer({ min: 1, max: 10000 }), // Number of trades
    fc.float({ min: 0, max: 1000000 }).map(n => n.toString()), // Taker buy base asset volume
    fc.float({ min: 0, max: 1000000 }).map(n => n.toString()), // Taker buy quote asset volume
    fc.string() // Ignore field
  ), { minLength: 1, maxLength: 100 })
})

const validThetanutsOptionArbitrary = fc.record({
  optionToken: validAddressArbitrary,
  strike: fc.float({ min: 100, max: 10000 }),
  expiry: fc.integer({ min: Date.now(), max: Date.now() + 365 * 24 * 60 * 60 * 1000 }),
  optionType: fc.constantFrom('CALL', 'PUT'),
  price: fc.float({ min: 0.01, max: 1000 }),
  impliedVolatility: fc.float({ min: 0.01, max: 5 }),
  delta: fc.float({ min: -1, max: 1 }),
  gamma: fc.float({ min: 0, max: 1 }),
  theta: fc.float({ min: -1, max: 0 }),
  vega: fc.float({ min: 0, max: 1 })
})

const validMarketDataArbitrary = fc.record({
  symbol: fc.string({ minLength: 3, maxLength: 10 }),
  price: fc.float({ min: 0.01, max: 100000 }),
  timestamp: fc.integer({ min: Date.now() - 24 * 60 * 60 * 1000, max: Date.now() }),
  volume: fc.float({ min: 0, max: 1000000 }),
  high24h: fc.float({ min: 0.01, max: 100000 }),
  low24h: fc.float({ min: 0.01, max: 100000 }),
  change24h: fc.float({ min: -10000, max: 10000 }),
  changePercent24h: fc.float({ min: -100, max: 1000 })
})

const maliciousStringArbitrary = fc.oneof(
  fc.constant('<script>alert("xss")</script>'),
  fc.constant('javascript:alert("xss")'),
  fc.constant('onclick="alert(1)"'),
  fc.constant('\x00\x01\x02\x03\x04\x05'),
  fc.constant('<?php echo "test"; ?>'),
  fc.constant('${process.env.SECRET}'),
  fc.constant('../../etc/passwd'),
  fc.constant('DROP TABLE users;'),
  fc.string({ minLength: 10000, maxLength: 50000 }) // Very long strings
)

describe('Data Validation Robustness', () => {
  test('External API validators reject malformed data', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          malformedStringArbitrary,
          malformedNumberArbitrary,
          malformedArrayArbitrary,
          fc.object()
        ),
        (malformedData) => {
          // All validators should reject malformed data
          expect(validateBinanceKlineResponse(malformedData)).toBe(false)
          expect(validateThetanutsOptionData(malformedData)).toBe(false)
          expect(validateMarketData(malformedData)).toBe(false)
          expect(validateCandlestickData(malformedData)).toBe(false)
        }
      ),
      { numRuns: 100 }
    )
  })

  test('Valid external API data passes validation', () => {
    fc.assert(
      fc.property(validBinanceKlineArbitrary, (validData) => {
        expect(validateBinanceKlineResponse(validData)).toBe(true)
      }),
      { numRuns: 100 }
    )

    fc.assert(
      fc.property(validThetanutsOptionArbitrary, (validData) => {
        expect(validateThetanutsOptionData(validData)).toBe(true)
      }),
      { numRuns: 100 }
    )

    fc.assert(
      fc.property(validMarketDataArbitrary, (validData) => {
        expect(validateMarketData(validData)).toBe(true)
      }),
      { numRuns: 100 }
    )
  })

  test('Input sanitization handles malicious content', () => {
    fc.assert(
      fc.property(maliciousStringArbitrary, (maliciousInput) => {
        const sanitized = sanitizeUserInput(maliciousInput)
        
        // Sanitized output should not contain dangerous patterns
        expect(sanitized).not.toMatch(/<script/i)
        expect(sanitized).not.toMatch(/javascript:/i)
        expect(sanitized).not.toMatch(/on\w+=/i)
        expect(sanitized).not.toMatch(/[\x00-\x1f\x7f-\x9f]/)
        
        // Should be limited in length
        expect(sanitized.length).toBeLessThanOrEqual(1000)
      }),
      { numRuns: 100 }
    )
  })

  test('Agent message sanitization preserves valid content', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 1000 }).filter(s => 
          !s.includes('<') && 
          !s.includes('>') && 
          !/[\x00-\x1f\x7f-\x9f]/.test(s)
        ),
        (validMessage) => {
          const sanitized = sanitizeAgentMessage(validMessage)
          expect(sanitized).toBe(validMessage.trim())
        }
      ),
      { numRuns: 100 }
    )
  })

  test('JSON validation rejects invalid JSON strings', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('invalid json'),
          fc.constant('{"incomplete": '),
          fc.constant('[1,2,3'),
          fc.constant('null'),
          fc.constant('undefined'),
          maliciousStringArbitrary
        ),
        (invalidJson) => {
          const result = validateAndSanitizeJson(invalidJson, validateTradingSignal)
          expect(result).toBeNull()
        }
      ),
      { numRuns: 100 }
    )
  })

  test('External API response validation handles error responses', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.record({ code: fc.constant(429), message: fc.string() }),
          fc.record({ error: fc.string(), code: fc.integer({ min: -1000, max: -1 }) }),
          fc.record({ msg: fc.string(), code: fc.integer({ min: -1000, max: -1 }) }),
          malformedStringArbitrary
        ),
        (errorResponse) => {
          const result = validateExternalApiResponse(errorResponse, validateMarketData, 'TestAPI')
          expect(result.data).toBeNull()
          expect(result.error).toBeDefined()
        }
      ),
      { numRuns: 100 }
    )
  })

  test('Data array validation handles mixed valid/invalid data', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.oneof(
            validMarketDataArbitrary,
            malformedStringArbitrary,
            fc.object()
          ),
          { minLength: 1, maxLength: 50 }
        ),
        (mixedArray) => {
          const validItems = validateDataArray(mixedArray, validateMarketData, 100)
          
          // Should only return valid items
          expect(Array.isArray(validItems)).toBe(true)
          validItems.forEach(item => {
            expect(validateMarketData(item)).toBe(true)
          })
          
          // Should not exceed original array length
          expect(validItems.length).toBeLessThanOrEqual(mixedArray.length)
        }
      ),
      { numRuns: 100 }
    )
  })

  test('Transaction hash validation rejects invalid formats', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.string({ minLength: 1, maxLength: 65 }), // Wrong length
          fc.string({ minLength: 67, maxLength: 100 }), // Wrong length
          fc.string({ minLength: 66, maxLength: 66 }).filter(s => !s.startsWith('0x')), // No 0x prefix
          fc.string({ minLength: 64, maxLength: 64 }).map(s => `0x${s.replace(/[a-fA-F0-9]/g, 'G')}`), // Invalid hex
          malformedStringArbitrary
        ),
        (invalidHash) => {
          if (typeof invalidHash === 'string') {
            expect(validateTransactionHash(invalidHash)).toBe(false)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  test('Price validation rejects unreasonable values', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(0),
          fc.constant(-1),
          fc.constant(NaN),
          fc.constant(Infinity),
          fc.constant(-Infinity),
          fc.float({ min: 1000001, max: 10000000 }), // Suspiciously high
          malformedNumberArbitrary
        ),
        (invalidPrice) => {
          if (typeof invalidPrice === 'number') {
            expect(validatePriceData(invalidPrice, 'TEST')).toBe(false)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  test('Core data validators maintain type safety', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          malformedStringArbitrary,
          malformedNumberArbitrary,
          malformedArrayArbitrary,
          fc.object()
        ),
        (malformedData) => {
          // Core validators should safely handle any input type
          expect(() => validateTradingSignal(malformedData)).not.toThrow()
          expect(() => validatePosition(malformedData)).not.toThrow()
          expect(() => validateTradeEvent(malformedData)).not.toThrow()
          expect(() => validateAgentMessage(malformedData)).not.toThrow()
          
          // And should return false for malformed data
          expect(validateTradingSignal(malformedData)).toBe(false)
          expect(validatePosition(malformedData)).toBe(false)
          expect(validateTradeEvent(malformedData)).toBe(false)
          expect(validateAgentMessage(malformedData)).toBe(false)
        }
      ),
      { numRuns: 100 }
    )
  })

  test('Validation functions handle edge cases gracefully', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(null),
          fc.constant(undefined),
          fc.constant(''),
          fc.constant({}),
          fc.constant([]),
          fc.constant(0),
          fc.constant(false)
        ),
        (edgeCase) => {
          // All validation functions should handle edge cases without throwing
          expect(() => {
            validateBinanceKlineResponse(edgeCase)
            validateThetanutsOptionData(edgeCase)
            validateMarketData(edgeCase)
            validateCandlestickData(edgeCase)
            validateTradingSignal(edgeCase)
            validatePosition(edgeCase)
            validateTradeEvent(edgeCase)
            validateAgentMessage(edgeCase)
          }).not.toThrow()
        }
      ),
      { numRuns: 100 }
    )
  })
})