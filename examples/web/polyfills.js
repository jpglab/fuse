// Browser polyfills for Node.js built-ins
import { Buffer } from 'buffer'
import process from 'process'

// Make Buffer and process available globally
window.Buffer = Buffer
window.process = process
window.global = window

// Export for use in modules
export { Buffer, process }
