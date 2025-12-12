// Polyfills for Jest environment

// TextEncoder/TextDecoder polyfill
const { TextEncoder, TextDecoder } = require('util')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Crypto polyfill for Node.js
const { webcrypto } = require('crypto')
global.crypto = webcrypto