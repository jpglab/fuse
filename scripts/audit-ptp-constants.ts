#!/usr/bin/env bun
import fs from 'fs/promises'
import path from 'path'
import { glob } from 'glob'

// Types for our audit data structures
interface ExtractedConstant {
  sourceFile: string
  hexCode: string
  constantName: string
  category: 'property' | 'operation' | 'event' | 'response' | 'control' | 'format' | 'storage' | 'error' | 'datatype'
  vendor: 'iso' | 'sony'
  lineNumber?: number
  context?: string
}

interface MissingConstant {
  hexCode: string
  constantName: string
  category: string
  sourceFile: string
  searchAttempts: string[]
}

interface CategorySummary {
  vendor: 'iso' | 'sony'
  category: string
  total: number
  found: number
  missing: number
  percentage: number
  missingConstants: MissingConstant[]
}

interface DocumentationBlock {
  hexCode: string
  constantName: string
  content: string
  startLine: number
  endLine: number
}

// Configuration
const CONFIG = {
  constantsPath: 'src/constants',
  isoDocsPath: 'docs/iso/ptp_iso_15740_reference/ptp_iso_15740_reference.md',
  sonyDocsPath: 'docs/manufacturers/sony/ptp_sony_reference/ptp_sony_reference.md',
  outputPath: 'docs/audit',
  excludeFiles: [
    'vendor-ids.ts' // USB vendor IDs, not PTP constants
  ]
}

// Helper function for fuzzy string matching
function fuzzyMatch(str1: string, str2: string): number {
  // Normalize strings
  const normalize = (s: string) => {
    return s
      .toLowerCase()
      .replace(/[_\-\s]+/g, '') // Remove separators
      .replace(/^(get|set|the|a|an)/g, '') // Remove common prefixes
      .replace(/[^a-z0-9]/g, '') // Keep only alphanumeric
  }
  
  const norm1 = normalize(str1)
  const norm2 = normalize(str2)
  
  // Check for exact match
  if (norm1 === norm2) return 1.0
  
  // Check if one contains the other
  if (norm1.includes(norm2) || norm2.includes(norm1)) {
    const minLen = Math.min(norm1.length, norm2.length)
    const maxLen = Math.max(norm1.length, norm2.length)
    return minLen / maxLen
  }
  
  // Calculate Levenshtein distance
  const distance = levenshteinDistance(norm1, norm2)
  const maxLen = Math.max(norm1.length, norm2.length)
  return Math.max(0, 1 - distance / maxLen)
}

function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length
  const len2 = str2.length
  const matrix: number[][] = []
  
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,    // deletion
        matrix[i][j - 1] + 1,    // insertion
        matrix[i - 1][j - 1] + cost // substitution
      )
    }
  }
  
  return matrix[len1][len2]
}

// Extract hex codes from TypeScript source files
async function extractConstants(): Promise<ExtractedConstant[]> {
  const constants: ExtractedConstant[] = []
  const files = await glob(`${CONFIG.constantsPath}/**/*.ts`)
  
  for (const file of files) {
    // Skip excluded files
    if (CONFIG.excludeFiles.some(excluded => file.includes(excluded))) {
      console.log(`   Skipping ${file.replace(process.cwd() + '/', '')} (excluded)`)
      continue
    }
    
    const content = await fs.readFile(file, 'utf-8')
    const lines = content.split('\n')
    
    // Determine vendor and category from file path
    const vendor = file.includes('/vendors/sony/') ? 'sony' : 'iso'
    const category = determineCategory(file)
    
    // Extract constants with context
    lines.forEach((line, lineIndex) => {
      // Look for object property definitions with hex codes
      const propertyMatch = line.match(/^\s*(\w+):\s*{/)
      if (propertyMatch) {
        // Look ahead for the code property
        for (let i = 1; i <= 10 && lineIndex + i < lines.length; i++) {
          const codeLine = lines[lineIndex + i]
          const codeMatch = codeLine.match(/code:\s*(0x[0-9A-Fa-f]{2,4})/)
          if (codeMatch) {
            constants.push({
              sourceFile: file.replace(process.cwd() + '/', ''),
              hexCode: codeMatch[1],
              constantName: propertyMatch[1],
              category,
              vendor,
              lineNumber: lineIndex + 1,
              context: lines.slice(Math.max(0, lineIndex - 2), Math.min(lines.length, lineIndex + 10)).join('\n')
            })
            break
          }
          if (codeLine.includes('}')) break
        }
      }
      
      // Direct hex assignments
      const directMatch = line.match(/(?:const|let|var)?\s*(\w+)(?:\s*[:=]\s*|\s+)(?:HexCode\s*=\s*)?(0x[0-9A-Fa-f]{2,4})/)
      if (directMatch) {
        constants.push({
          sourceFile: file.replace(process.cwd() + '/', ''),
          hexCode: directMatch[2],
          constantName: directMatch[1],
          category,
          vendor,
          lineNumber: lineIndex + 1,
          context: lines.slice(Math.max(0, lineIndex - 2), Math.min(lines.length, lineIndex + 5)).join('\n')
        })
      }
      
      // Enum values
      const enumMatch = line.match(/'(\w+)':\s*(0x[0-9A-Fa-f]{2,4})/)
      if (enumMatch) {
        constants.push({
          sourceFile: file.replace(process.cwd() + '/', ''),
          hexCode: enumMatch[2],
          constantName: enumMatch[1],
          category,
          vendor,
          lineNumber: lineIndex + 1,
          context: line
        })
      }
    })
  }
  
  // Deduplicate by hexCode + vendor combination
  const seen = new Set<string>()
  return constants.filter(c => {
    const key = `${c.vendor}:${c.hexCode}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function determineCategory(filePath: string): ExtractedConstant['category'] {
  // Check for types.ts which contains data types
  if (filePath.includes('/types.ts')) return 'datatype'
  if (filePath.includes('/properties')) return 'property'
  if (filePath.includes('/operations')) return 'operation'
  if (filePath.includes('/events')) return 'event'
  if (filePath.includes('/responses')) return 'response'
  if (filePath.includes('/controls')) return 'control'
  if (filePath.includes('/formats')) return 'format'
  if (filePath.includes('/storage')) return 'storage'
  if (filePath.includes('/errors')) return 'error'
  return 'property' // default
}

// Extract ISO documentation block for a specific constant
async function extractISODocBlock(constant: ExtractedConstant): Promise<DocumentationBlock | null> {
  const docContent = await fs.readFile(CONFIG.isoDocsPath, 'utf-8')
  const lines = docContent.split('\n')
  
  // Special handling for data types
  if (constant.category === 'datatype') {
    // Find the data types table section
    let inDataTypeTable = false
    let tableStart = -1
    let tableEnd = -1
    
    for (let i = 0; i < lines.length; i++) {
      // Look for the start of the data types section
      if (lines[i].includes('5.3 Simple types') || lines[i].includes('Table 3')) {
        inDataTypeTable = true
        tableStart = i
      }
      
      // If we're in the table, look for our hex code
      if (inDataTypeTable) {
        // Check for end of table (next major section or table)
        if (i > tableStart + 5 && (
          lines[i].match(/^#{1,2}\s+\d+\.\d+/) || // Next section number
          lines[i].includes('Table 4') || // Next table
          lines[i].includes('5.4') // Next subsection
        )) {
          tableEnd = i
          break
        }
      }
    }
    
    if (tableStart === -1) return null
    if (tableEnd === -1) tableEnd = Math.min(tableStart + 100, lines.length)
    
    // Search for the hex code in the data types table section
    const hexVariations = [
      constant.hexCode.toLowerCase(),
      constant.hexCode.toUpperCase(),
      '0x' + constant.hexCode.substring(2).padStart(4, '0').toLowerCase(),
      '0x' + constant.hexCode.substring(2).padStart(4, '0').toUpperCase()
    ]
    
    for (const hex of hexVariations) {
      for (let i = tableStart; i < tableEnd; i++) {
        if (lines[i].includes(hex)) {
          // Extract the row and surrounding context
          const blockStart = Math.max(tableStart, i - 2)
          const blockEnd = Math.min(tableEnd, i + 3)
          return {
            hexCode: constant.hexCode,
            constantName: constant.constantName,
            content: lines.slice(blockStart, blockEnd).join('\n'),
            startLine: blockStart,
            endLine: blockEnd
          }
        }
      }
    }
    
    return null
  }
  
  // For other categories, search for hex code occurrences
  const hexVariations = [
    constant.hexCode,
    constant.hexCode.toLowerCase(),
    constant.hexCode.toUpperCase(),
  ]
  
  const potentialBlocks: DocumentationBlock[] = []
  
  for (const hex of hexVariations) {
    for (let i = 0; i < lines.length; i++) {
      // Check if this line contains our exact hex code (not as substring)
      const hexRegex = new RegExp(`\\b${hex.replace('0x', '0x')}\\b`, 'i')
      if (!hexRegex.test(lines[i])) continue
      
      // Check the context around the hex code to ensure it's the right type
      const contextStart = Math.max(0, i - 3)
      const contextEnd = Math.min(lines.length, i + 3)
      const context = lines.slice(contextStart, contextEnd).join('\n')
      
      // Verify this is the right type of constant
      let isCorrectType = false
      if (constant.category === 'property' && context.includes('DevicePropCode')) isCorrectType = true
      else if (constant.category === 'operation' && context.includes('OperationCode')) isCorrectType = true
      else if (constant.category === 'event' && context.includes('EventCode')) isCorrectType = true
      else if (constant.category === 'response' && context.includes('ResponseCode')) isCorrectType = true
      else if (constant.category === 'format' && context.includes('ObjectFormatCode')) isCorrectType = true
      
      if (!isCorrectType) continue
      
      // Find the section boundaries
      let startLine = i
      let endLine = i
      
      // Search backward for section header - be more precise
      for (let j = i - 1; j >= Math.max(0, i - 20); j--) {
        // Look for section headers with numbers
        if (lines[j].match(/^#{1,4}\s+\*?\*?[\d.]+\s+/) || 
            lines[j].match(/^\*\*[\d.]+\s+/) ||
            (lines[j].match(/^#{1,4}\s+/) && j === i - 1)) { // If header is immediately before
          startLine = j
          break
        }
      }
      
      // Search forward for next section - stop at next heading with a hex code
      for (let j = i + 1; j < Math.min(lines.length, i + 100); j++) {
        // Check if next section starts (has a heading and different hex code)
        if (lines[j].match(/^#{1,4}\s+\*?\*?[\d.]+\s+/) || 
            lines[j].match(/^\*\*[\d.]+\s+/)) {
          // Check if the next few lines contain a different hex code
          let hasOtherHex = false
          for (let k = j; k < Math.min(j + 5, lines.length); k++) {
            if (lines[k].match(/0x[0-9A-Fa-f]{4}/) && !lines[k].includes(hex)) {
              hasOtherHex = true
              break
            }
          }
          if (hasOtherHex) {
            endLine = j
            break
          }
        }
      }
      
      // Extract heading if present
      const headingMatch = lines[startLine].match(/^#{1,4}\s+\*?\*?(?:[\d.]+\s+)?(.+?)\*?\*?$/) ||
                          lines[startLine].match(/^\*\*[\d.]+\s+(.+)\*\*/)
      const heading = headingMatch ? headingMatch[1].trim() : ''
      
      // Calculate fuzzy match score
      const fuzzyScore = fuzzyMatch(constant.constantName, heading)
      
      // Extract and validate the block
      const blockContent = lines.slice(startLine, endLine).join('\n')
      
      // Additional validation - ensure we have the right hex code prominently
      const hexCount = (blockContent.match(new RegExp(hex, 'gi')) || []).length
      if (hexCount === 0) continue
      
      let validationScore = 0.5 // Base score since we already verified type
      if (blockContent.includes('Description')) validationScore += 0.2
      if (blockContent.includes('Parameter')) validationScore += 0.1
      if (blockContent.includes('Response')) validationScore += 0.1
      if (blockContent.includes('Data type')) validationScore += 0.1
      
      const totalScore = fuzzyScore * 0.5 + validationScore * 0.5
      
      if (totalScore > 0.4) { // Slightly higher threshold
        potentialBlocks.push({
          hexCode: constant.hexCode,
          constantName: constant.constantName,
          content: blockContent,
          startLine,
          endLine
        })
      }
    }
  }
  
  // Return the best match
  if (potentialBlocks.length > 0) {
    // Sort by validation score and content relevance
    potentialBlocks.sort((a, b) => {
      // Prefer blocks that start with the exact heading
      const aHasExactHeading = a.content.split('\n')[0].toLowerCase().includes(constant.constantName.toLowerCase().replace(/_/g, ''))
      const bHasExactHeading = b.content.split('\n')[0].toLowerCase().includes(constant.constantName.toLowerCase().replace(/_/g, ''))
      if (aHasExactHeading && !bHasExactHeading) return -1
      if (!aHasExactHeading && bHasExactHeading) return 1
      
      // Otherwise prefer shorter, more focused blocks
      return a.content.length - b.content.length
    })
    return potentialBlocks[0]
  }
  
  return null
}

// Extract Sony documentation block for a specific constant
async function extractSonyDocBlock(constant: ExtractedConstant): Promise<DocumentationBlock | null> {
  const docContent = await fs.readFile(CONFIG.sonyDocsPath, 'utf-8')
  const lines = docContent.split('\n')
  
  const hexVariations = [
    constant.hexCode,
    constant.hexCode.toLowerCase(),
    constant.hexCode.toUpperCase(),
  ]
  
  const potentialBlocks: DocumentationBlock[] = []
  
  for (const hex of hexVariations) {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(hex)) {
        // Find the section boundaries
        let startLine = i
        let endLine = i
        
        // Search backward for section header (# heading)
        for (let j = i - 1; j >= Math.max(0, i - 30); j--) {
          if (lines[j].match(/^#\s+/)) {
            startLine = j
            break
          }
        }
        
        // Search forward for next section
        for (let j = i + 1; j < Math.min(lines.length, i + 100); j++) {
          if (lines[j].match(/^#\s+/) && j > startLine) {
            endLine = j
            break
          }
        }
        
        // Extract heading
        const headingMatch = lines[startLine].match(/^#\s+(.+)/)
        const heading = headingMatch ? headingMatch[1].trim() : ''
        
        // Calculate fuzzy match score
        const fuzzyScore = fuzzyMatch(constant.constantName, heading)
        
        // Validate the block
        const blockContent = lines.slice(startLine, endLine).join('\n')
        let validationScore = 0
        
        if (blockContent.includes('PropertyCode')) validationScore += 0.3
        if (blockContent.includes('Operation Code')) validationScore += 0.3
        if (blockContent.includes('Event Code')) validationScore += 0.3
        if (blockContent.includes('ControlCode')) validationScore += 0.3
        if (blockContent.includes('Summary')) validationScore += 0.2
        if (blockContent.includes('Description')) validationScore += 0.2
        
        const totalScore = fuzzyScore * 0.6 + validationScore * 0.4
        
        if (totalScore > 0.3) { // Minimum threshold
          potentialBlocks.push({
            hexCode: constant.hexCode,
            constantName: constant.constantName,
            content: blockContent,
            startLine,
            endLine
          })
        }
      }
    }
  }
  
  // Return the best match
  if (potentialBlocks.length > 0) {
    // Sort by fuzzy match score and content length
    potentialBlocks.sort((a, b) => b.content.length - a.content.length)
    return potentialBlocks[0]
  }
  
  return null
}

// Save documentation block to markdown file
async function saveDocumentationBlock(constant: ExtractedConstant, block: DocumentationBlock): Promise<void> {
  const vendor = constant.vendor
  const outputDir = path.join(CONFIG.outputPath, vendor)
  await fs.mkdir(outputDir, { recursive: true })
  
  // Clean the constant name for filename
  const cleanName = constant.constantName
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .toUpperCase()
  
  const filename = `${constant.hexCode}_${cleanName}.md`
  const filepath = path.join(outputDir, filename)
  
  // Add metadata header
  const content = `# ${constant.constantName} (${constant.hexCode})

**Category**: ${constant.category}
**Vendor**: ${vendor}
**Source File**: ${constant.sourceFile}

---

${block.content}
`
  
  await fs.writeFile(filepath, content)
}

// Check if a constant exists in documentation and extract if found
async function checkAndExtractDocumentation(constant: ExtractedConstant): Promise<{ found: boolean; searchAttempts: string[]; extracted: boolean }> {
  // Special handling for ISO data types
  if (constant.category === 'datatype' && constant.vendor === 'iso') {
    const block = await extractISODocBlock(constant)
    if (block) {
      await saveDocumentationBlock(constant, block)
      return { 
        found: true, 
        searchAttempts: ['Checked in Table 3 — Datatype codes'],
        extracted: true
      }
    }
    return { 
      found: false, 
      searchAttempts: ['Checked in Table 3 — Datatype codes'],
      extracted: false
    }
  }
  
  // Extract documentation block based on vendor
  const block = constant.vendor === 'iso' 
    ? await extractISODocBlock(constant)
    : await extractSonyDocBlock(constant)
  
  if (block) {
    await saveDocumentationBlock(constant, block)
    return {
      found: true,
      searchAttempts: [`Found and extracted documentation block`],
      extracted: true
    }
  }
  
  // If not found, check if hex code exists anywhere in the doc
  const docPath = constant.vendor === 'iso' ? CONFIG.isoDocsPath : CONFIG.sonyDocsPath
  const docContent = await fs.readFile(docPath, 'utf-8')
  const docContentLower = docContent.toLowerCase()
  
  const searchAttempts = [
    constant.hexCode,
    constant.hexCode.toLowerCase(),
    constant.hexCode.toUpperCase(),
  ]
  
  for (const searchTerm of searchAttempts) {
    if (docContentLower.includes(searchTerm.toLowerCase())) {
      return { 
        found: true, 
        searchAttempts: [...searchAttempts, 'Found hex but could not extract clean block'],
        extracted: false
      }
    }
  }
  
  return { 
    found: false, 
    searchAttempts,
    extracted: false
  }
}

// Analyze missing constants by category
async function analyzeMissingConstants(): Promise<Map<string, CategorySummary>> {
  console.log('🔍 PTP Constants Documentation Audit - With Individual Extraction')
  console.log('================================================================\n')
  
  // Clean output directory
  const isoDir = path.join(CONFIG.outputPath, 'iso')
  const sonyDir = path.join(CONFIG.outputPath, 'sony')
  await fs.rm(isoDir, { recursive: true, force: true })
  await fs.rm(sonyDir, { recursive: true, force: true })
  await fs.mkdir(isoDir, { recursive: true })
  await fs.mkdir(sonyDir, { recursive: true })
  
  // Extract all constants
  console.log('📋 Extracting constants from source files...')
  const constants = await extractConstants()
  console.log(`   Found ${constants.length} unique PTP constants\n`)
  
  // Group by vendor-category
  const grouped = new Map<string, ExtractedConstant[]>()
  constants.forEach(c => {
    const key = `${c.vendor}-${c.category}`
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(c)
  })
  
  // Analyze each group
  console.log('🔎 Checking documentation and extracting blocks...')
  const summaries = new Map<string, CategorySummary>()
  
  // Sort keys for consistent output
  const sortedKeys = Array.from(grouped.keys()).sort((a, b) => {
    const [vendorA] = a.split('-')
    const [vendorB] = b.split('-')
    if (vendorA !== vendorB) {
      return vendorA === 'iso' ? -1 : 1
    }
    return a.localeCompare(b)
  })
  
  let processedCount = 0
  const totalConstants = constants.length
  let totalExtracted = 0
  
  for (const key of sortedKeys) {
    const groupConstants = grouped.get(key)!
    const [vendor, category] = key.split('-') as [ExtractedConstant['vendor'], string]
    
    console.log(`\n   ${vendor.toUpperCase()} ${category}:`)
    
    const missingConstants: MissingConstant[] = []
    let found = 0
    let extracted = 0
    
    // Sort constants by hex code for consistent output
    const sortedConstants = groupConstants.sort((a, b) => 
      parseInt(a.hexCode.substring(2), 16) - parseInt(b.hexCode.substring(2), 16)
    )
    
    for (const constant of sortedConstants) {
      processedCount++
      process.stdout.write(`   [${processedCount}/${totalConstants}] ${constant.hexCode} (${constant.constantName})... `)
      
      const result = await checkAndExtractDocumentation(constant)
      if (result.found) {
        found++
        if (result.extracted) {
          extracted++
          totalExtracted++
          process.stdout.write('✅ (extracted)\n')
        } else {
          process.stdout.write('✅ (found but not extracted)\n')
        }
      } else {
        missingConstants.push({
          hexCode: constant.hexCode,
          constantName: constant.constantName,
          category: constant.category,
          sourceFile: constant.sourceFile,
          searchAttempts: result.searchAttempts
        })
        process.stdout.write('❌\n')
      }
    }
    
    const total = groupConstants.length
    const missing = total - found
    const percentage = total > 0 ? (found / total) * 100 : 0
    
    summaries.set(key, {
      vendor: vendor as 'iso' | 'sony',
      category,
      total,
      found,
      missing,
      percentage,
      missingConstants
    })
    
    console.log(`   Summary: ${found}/${total} found (${percentage.toFixed(1)}%), ${extracted} blocks extracted`)
  }
  
  console.log(`\n📦 Total documentation blocks extracted: ${totalExtracted}`)
  
  return summaries
}

// Generate comprehensive report
async function generateReport(summaries: Map<string, CategorySummary>): Promise<void> {
  let report = `# PTP Constants Documentation Coverage Report
Generated: ${new Date().toISOString()}

This report provides a comprehensive analysis of PTP constants documentation coverage.
Individual documentation blocks have been extracted to \`docs/audit/iso/\` and \`docs/audit/sony/\`.

## Summary

`

  // Separate by vendor
  const isoSummaries = Array.from(summaries.values()).filter(s => s.vendor === 'iso')
  const sonySummaries = Array.from(summaries.values()).filter(s => s.vendor === 'sony')
  
  // ISO Summary
  let isoTotal = 0, isoFound = 0, isoMissing = 0
  report += `### ISO Constants (PTP Standard)\n\n`
  report += `| Category | Total | Found | Missing | Coverage |\n`
  report += `|----------|-------|-------|---------|----------|\n`
  
  // Sort categories for consistent display
  const categoryOrder = ['datatype', 'property', 'operation', 'event', 'response', 'format', 'storage', 'error']
  const sortedIsoSummaries = isoSummaries.sort((a, b) => {
    const indexA = categoryOrder.indexOf(a.category)
    const indexB = categoryOrder.indexOf(b.category)
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })
  
  for (const summary of sortedIsoSummaries) {
    isoTotal += summary.total
    isoFound += summary.found
    isoMissing += summary.missing
    const icon = summary.percentage === 100 ? '✅' : summary.percentage >= 80 ? '🟡' : '❌'
    report += `| ${summary.category} | ${summary.total} | ${summary.found} | ${summary.missing} | ${summary.percentage.toFixed(1)}% ${icon} |\n`
  }
  
  const isoPercentage = isoTotal > 0 ? (isoFound / isoTotal) * 100 : 0
  report += `| **TOTAL** | **${isoTotal}** | **${isoFound}** | **${isoMissing}** | **${isoPercentage.toFixed(1)}%** |\n\n`
  
  // Sony Summary
  let sonyTotal = 0, sonyFound = 0, sonyMissing = 0
  report += `### Sony Constants (Vendor Extensions)\n\n`
  report += `| Category | Total | Found | Missing | Coverage |\n`
  report += `|----------|-------|-------|---------|----------|\n`
  
  const sortedSonySummaries = sonySummaries.sort((a, b) => {
    const indexA = categoryOrder.indexOf(a.category)
    const indexB = categoryOrder.indexOf(b.category)
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })
  
  for (const summary of sortedSonySummaries) {
    sonyTotal += summary.total
    sonyFound += summary.found
    sonyMissing += summary.missing
    const icon = summary.percentage === 100 ? '✅' : summary.percentage >= 80 ? '🟡' : '❌'
    report += `| ${summary.category} | ${summary.total} | ${summary.found} | ${summary.missing} | ${summary.percentage.toFixed(1)}% ${icon} |\n`
  }
  
  const sonyPercentage = sonyTotal > 0 ? (sonyFound / sonyTotal) * 100 : 0
  report += `| **TOTAL** | **${sonyTotal}** | **${sonyFound}** | **${sonyMissing}** | **${sonyPercentage.toFixed(1)}%** |\n\n`
  
  // Overall Summary
  const overallTotal = isoTotal + sonyTotal
  const overallFound = isoFound + sonyFound
  const overallMissing = isoMissing + sonyMissing
  const overallPercentage = overallTotal > 0 ? (overallFound / overallTotal) * 100 : 0
  
  report += `### Overall Statistics\n\n`
  report += `- **Total PTP Constants**: ${overallTotal}\n`
  report += `- **Documented**: ${overallFound}\n`
  report += `- **Missing**: ${overallMissing}\n`
  report += `- **Coverage**: ${overallPercentage.toFixed(1)}%\n`
  report += `- **Target**: 80%\n`
  report += `- **Status**: ${overallPercentage >= 80 ? '✅ PASSING' : '❌ NEEDS IMPROVEMENT'}\n\n`
  
  // Detailed missing constants
  if (overallMissing > 0) {
    report += `## Missing Constants Details\n\n`
    report += `The following PTP constants are defined in the codebase but could not be found in the documentation.\n\n`
    
    // ISO Missing
    if (isoMissing > 0) {
      report += `### ISO Standard Missing Constants\n\n`
      for (const summary of sortedIsoSummaries) {
        if (summary.missingConstants.length > 0) {
          report += `#### ${summary.category.toUpperCase()}\n\n`
          if (summary.category === 'datatype') {
            report += `*Note: Data types should be in Table 3 — Datatype codes (Section 5.3 Simple types)*\n\n`
          }
          report += `| Hex Code | Constant Name | Source File |\n`
          report += `|----------|---------------|-------------|\n`
          for (const missing of summary.missingConstants) {
            report += `| \`${missing.hexCode}\` | ${missing.constantName} | \`${missing.sourceFile}\` |\n`
          }
          report += `\n`
        }
      }
    }
    
    // Sony Missing
    if (sonyMissing > 0) {
      report += `### Sony Vendor Extension Missing Constants\n\n`
      for (const summary of sortedSonySummaries) {
        if (summary.missingConstants.length > 0) {
          report += `#### ${summary.category.toUpperCase()}\n\n`
          report += `| Hex Code | Constant Name | Source File |\n`
          report += `|----------|---------------|-------------|\n`
          for (const missing of summary.missingConstants) {
            report += `| \`${missing.hexCode}\` | ${missing.constantName} | \`${missing.sourceFile}\` |\n`
          }
          report += `\n`
        }
      }
    }
  }
  
  // Write report
  await fs.mkdir(CONFIG.outputPath, { recursive: true })
  const reportPath = path.join(CONFIG.outputPath, 'ptp-constants-coverage.md')
  await fs.writeFile(reportPath, report)
  console.log(`\n📄 Report saved to: ${reportPath}`)
  
  // Also save as JSON for programmatic access
  const jsonData = {
    generated: new Date().toISOString(),
    excludedFiles: CONFIG.excludeFiles,
    summary: {
      total: overallTotal,
      documented: overallFound,
      missing: overallMissing,
      coverage: overallPercentage,
      passing: overallPercentage >= 80
    },
    iso: {
      total: isoTotal,
      documented: isoFound,
      missing: isoMissing,
      coverage: isoPercentage,
      categories: sortedIsoSummaries.map(s => ({
        category: s.category,
        total: s.total,
        documented: s.found,
        missing: s.missing,
        coverage: s.percentage,
        missingConstants: s.missingConstants
      }))
    },
    sony: {
      total: sonyTotal,
      documented: sonyFound,
      missing: sonyMissing,
      coverage: sonyPercentage,
      categories: sortedSonySummaries.map(s => ({
        category: s.category,
        total: s.total,
        documented: s.found,
        missing: s.missing,
        coverage: s.percentage,
        missingConstants: s.missingConstants
      }))
    }
  }
  
  const jsonPath = path.join(CONFIG.outputPath, 'ptp-constants-coverage.json')
  await fs.writeFile(jsonPath, JSON.stringify(jsonData, null, 2))
  console.log(`📊 JSON data saved to: ${jsonPath}`)
}

// Main function
async function main() {
  try {
    const summaries = await analyzeMissingConstants()
    console.log()
    await generateReport(summaries)
    
    // Print final summary
    console.log('\n' + '='.repeat(60))
    
    let totalConstants = 0
    let totalFound = 0
    summaries.forEach(s => {
      totalConstants += s.total
      totalFound += s.found
    })
    
    const coverage = totalConstants > 0 ? (totalFound / totalConstants) * 100 : 0
    console.log(`\n📈 Final Coverage: ${coverage.toFixed(1)}%`)
    console.log(`📊 Status: ${coverage >= 80 ? '✅ PASSING' : '❌ NEEDS IMPROVEMENT'}`)
    
    if (coverage >= 80) {
      console.log('\n🎉 Congratulations! Documentation coverage meets requirements.')
      console.log('📁 Documentation blocks have been extracted to docs/audit/')
    } else {
      console.log('\n⚠️  Coverage is below 80% threshold.')
      console.log('Review the detailed report for missing constants.')
    }
    
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()