#!/usr/bin/env bun
import { readdir, readFile } from 'fs/promises'
import { join, relative } from 'path'
import * as ts from 'typescript'

interface ExportInfo {
    file: string
    line: number
    name: string
    type: 'type' | 'interface' | 'class' | 'function' | 'const' | 'enum' | 'namespace' | 'variable'
    exportType: 'named' | 'default' | 'namespace'
}

class ExportAnalyzer {
    private exports: ExportInfo[] = []
    private srcDir: string

    constructor(srcDir: string) {
        this.srcDir = srcDir
    }

    async analyzeDirectory(dir: string): Promise<void> {
        const entries = await readdir(dir, { withFileTypes: true })
        
        for (const entry of entries) {
            const fullPath = join(dir, entry.name)
            
            if (entry.isDirectory() && !entry.name.startsWith('.')) {
                await this.analyzeDirectory(fullPath)
            } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
                await this.analyzeFile(fullPath)
            }
        }
    }

    async analyzeFile(filePath: string): Promise<void> {
        const content = await readFile(filePath, 'utf-8')
        const sourceFile = ts.createSourceFile(
            filePath,
            content,
            ts.ScriptTarget.Latest,
            true
        )

        const relativePath = relative(this.srcDir, filePath)
        
        const visit = (node: ts.Node) => {
            if (ts.isExportDeclaration(node)) {
                // export { ... } from '...' or export { ... }
                if (node.exportClause && ts.isNamedExports(node.exportClause)) {
                    node.exportClause.elements.forEach(spec => {
                        const name = spec.propertyName ? spec.propertyName.text : spec.name.text
                        const exportedName = spec.name.text
                        const line = sourceFile.getLineAndCharacterOfPosition(spec.pos).line + 1
                        
                        this.exports.push({
                            file: relativePath,
                            line,
                            name: exportedName,
                            type: 'variable', // Can't determine exact type from re-export
                            exportType: 'named'
                        })
                    })
                } else if (node.exportClause && ts.isNamespaceExport(node.exportClause)) {
                    // export * as name from '...'
                    const line = sourceFile.getLineAndCharacterOfPosition(node.pos).line + 1
                    this.exports.push({
                        file: relativePath,
                        line,
                        name: node.exportClause.name.text,
                        type: 'namespace',
                        exportType: 'namespace'
                    })
                } else if (!node.exportClause) {
                    // export * from '...'
                    const line = sourceFile.getLineAndCharacterOfPosition(node.pos).line + 1
                    this.exports.push({
                        file: relativePath,
                        line,
                        name: '*',
                        type: 'namespace',
                        exportType: 'namespace'
                    })
                }
            } else if (ts.isExportAssignment(node)) {
                // export default ...
                const line = sourceFile.getLineAndCharacterOfPosition(node.pos).line + 1
                this.exports.push({
                    file: relativePath,
                    line,
                    name: 'default',
                    type: 'variable',
                    exportType: 'default'
                })
            } else if (node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
                const line = sourceFile.getLineAndCharacterOfPosition(node.pos).line + 1
                
                if (ts.isClassDeclaration(node) && node.name) {
                    this.exports.push({
                        file: relativePath,
                        line,
                        name: node.name.text,
                        type: 'class',
                        exportType: node.modifiers?.some(m => m.kind === ts.SyntaxKind.DefaultKeyword) ? 'default' : 'named'
                    })
                } else if (ts.isInterfaceDeclaration(node)) {
                    this.exports.push({
                        file: relativePath,
                        line,
                        name: node.name.text,
                        type: 'interface',
                        exportType: 'named'
                    })
                } else if (ts.isTypeAliasDeclaration(node)) {
                    this.exports.push({
                        file: relativePath,
                        line,
                        name: node.name.text,
                        type: 'type',
                        exportType: 'named'
                    })
                } else if (ts.isFunctionDeclaration(node) && node.name) {
                    this.exports.push({
                        file: relativePath,
                        line,
                        name: node.name.text,
                        type: 'function',
                        exportType: node.modifiers?.some(m => m.kind === ts.SyntaxKind.DefaultKeyword) ? 'default' : 'named'
                    })
                } else if (ts.isEnumDeclaration(node)) {
                    this.exports.push({
                        file: relativePath,
                        line,
                        name: node.name.text,
                        type: 'enum',
                        exportType: 'named'
                    })
                } else if (ts.isVariableStatement(node)) {
                    node.declarationList.declarations.forEach(decl => {
                        if (ts.isIdentifier(decl.name)) {
                            this.exports.push({
                                file: relativePath,
                                line,
                                name: decl.name.text,
                                type: 'const',
                                exportType: 'named'
                            })
                        }
                    })
                }
            }
            
            ts.forEachChild(node, visit)
        }
        
        visit(sourceFile)
    }

    getExports(): ExportInfo[] {
        return this.exports.sort((a, b) => {
            const fileCompare = a.file.localeCompare(b.file)
            if (fileCompare !== 0) return fileCompare
            return a.line - b.line
        })
    }

    printSummary(): void {
        const byType = new Map<string, number>()
        const byFile = new Map<string, number>()
        
        this.exports.forEach(exp => {
            byType.set(exp.type, (byType.get(exp.type) || 0) + 1)
            byFile.set(exp.file, (byFile.get(exp.file) || 0) + 1)
        })
        
        console.log('\n=== EXPORT SUMMARY ===')
        console.log(`Total exports: ${this.exports.length}`)
        
        console.log('\n--- By Type ---')
        Array.from(byType.entries())
            .sort((a, b) => b[1] - a[1])
            .forEach(([type, count]) => {
                console.log(`  ${type}: ${count}`)
            })
        
        console.log('\n--- By File (Top 10) ---')
        Array.from(byFile.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .forEach(([file, count]) => {
                console.log(`  ${file}: ${count} exports`)
            })
    }

    printDetailed(): void {
        console.log('\n=== DETAILED EXPORT LIST ===')
        
        let currentFile = ''
        this.exports.forEach(exp => {
            if (exp.file !== currentFile) {
                console.log(`\n${exp.file}:`)
                currentFile = exp.file
            }
            const exportTypeIndicator = exp.exportType === 'default' ? '[default]' : 
                                       exp.exportType === 'namespace' ? '[namespace]' : ''
            console.log(`  L${exp.line.toString().padStart(4)}: ${exp.type.padEnd(9)} ${exp.name} ${exportTypeIndicator}`)
        })
    }
}

async function main() {
    const srcDir = join(process.cwd(), 'src')
    const analyzer = new ExportAnalyzer(srcDir)
    
    console.log('Analyzing exports in src/ directory...')
    await analyzer.analyzeDirectory(srcDir)
    
    analyzer.printSummary()
    analyzer.printDetailed()
    
    // Also save to file for further analysis
    const exports = analyzer.getExports()
    const outputPath = join(process.cwd(), 'export-analysis.json')
    await Bun.write(outputPath, JSON.stringify(exports, null, 2))
    console.log(`\nDetailed export data saved to: ${outputPath}`)
}

main().catch(console.error)