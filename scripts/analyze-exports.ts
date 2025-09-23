#!/usr/bin/env bun
import { readdir, readFile } from 'fs/promises'
import { join, relative } from 'path'
import * as ts from 'typescript'
import * as fs from 'fs'

interface ExportInfo {
    file: string
    line: number
    name: string
    type: 'type' | 'interface' | 'class' | 'function' | 'const' | 'enum' | 'namespace' | 'variable' | 'arrow-function'
    exportType: 'named' | 'default' | 'namespace'
    typeParams?: string[]
    extends?: string[]
    implements?: string[]
    parameters?: string[]
    returnType?: string
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
            } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) && !entry.name.endsWith('.test.ts')) {
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
            // Handle export declarations
            if (ts.isExportDeclaration(node)) {
                if (node.exportClause && ts.isNamedExports(node.exportClause)) {
                    node.exportClause.elements.forEach(spec => {
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
            } else {
                // Handle exported declarations
                const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined
                const hasExport = modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)
                const hasDefault = modifiers?.some(m => m.kind === ts.SyntaxKind.DefaultKeyword)

                if (hasExport) {
                    const line = sourceFile.getLineAndCharacterOfPosition(node.pos).line + 1
                    let exportInfo: ExportInfo | null = null
                    
                    if (ts.isClassDeclaration(node) && node.name) {
                        const typeParams = node.typeParameters?.map(p => p.getText())
                        const extendsClause = this.getExtendsClause(node)
                        const implementsClause = this.getImplementsClause(node)
                        
                        exportInfo = {
                            file: relativePath,
                            line,
                            name: hasDefault ? `default (${node.name.text})` : node.name.text,
                            type: 'class',
                            exportType: hasDefault ? 'default' : 'named',
                            typeParams,
                            extends: extendsClause,
                            implements: implementsClause
                        }
                    } else if (ts.isInterfaceDeclaration(node)) {
                        const typeParams = node.typeParameters?.map(p => p.getText())
                        const extendsClause = node.heritageClauses?.[0]?.types.map(t => t.getText())
                        
                        exportInfo = {
                            file: relativePath,
                            line,
                            name: node.name.text,
                            type: 'interface',
                            exportType: 'named',
                            typeParams,
                            extends: extendsClause
                        }
                    } else if (ts.isTypeAliasDeclaration(node)) {
                        const typeParams = node.typeParameters?.map(p => p.getText())
                        
                        exportInfo = {
                            file: relativePath,
                            line,
                            name: node.name.text,
                            type: 'type',
                            exportType: 'named',
                            typeParams
                        }
                    } else if (ts.isFunctionDeclaration(node) && node.name) {
                        const typeParams = node.typeParameters?.map(p => p.getText())
                        const parameters = node.parameters.map(p => {
                            const paramName = p.name?.getText() || 'unknown'
                            const paramType = p.type ? `: ${p.type.getText()}` : ''
                            return `${paramName}${paramType}`
                        })
                        const returnType = node.type?.getText()
                        
                        exportInfo = {
                            file: relativePath,
                            line,
                            name: hasDefault ? `default (${node.name.text})` : node.name.text,
                            type: 'function',
                            exportType: hasDefault ? 'default' : 'named',
                            typeParams,
                            parameters,
                            returnType
                        }
                    } else if (ts.isEnumDeclaration(node)) {
                        exportInfo = {
                            file: relativePath,
                            line,
                            name: node.name.text,
                            type: 'enum',
                            exportType: 'named'
                        }
                    } else if (ts.isVariableStatement(node)) {
                        node.declarationList.declarations.forEach(decl => {
                            if (ts.isIdentifier(decl.name)) {
                                const isArrowFunction = decl.initializer && ts.isArrowFunction(decl.initializer)
                                this.exports.push({
                                    file: relativePath,
                                    line,
                                    name: decl.name.text,
                                    type: isArrowFunction ? 'arrow-function' : 'const',
                                    exportType: hasDefault ? 'default' : 'named'
                                })
                            }
                        })
                        return // Already pushed to exports
                    }

                    if (exportInfo) {
                        this.exports.push(exportInfo)
                    }
                }
            }
            
            ts.forEachChild(node, visit)
        }
        
        visit(sourceFile)
    }

    private getExtendsClause(node: ts.ClassDeclaration): string[] | undefined {
        if (!node.heritageClauses) return undefined
        
        for (const clause of node.heritageClauses) {
            if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
                return clause.types.map(t => t.getText())
            }
        }
        return undefined
    }

    private getImplementsClause(node: ts.ClassDeclaration): string[] | undefined {
        if (!node.heritageClauses) return undefined
        
        for (const clause of node.heritageClauses) {
            if (clause.token === ts.SyntaxKind.ImplementsKeyword) {
                return clause.types.map(t => t.getText())
            }
        }
        return undefined
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
                console.log(`\n📁 ${exp.file}:`)
                console.log('-'.repeat(100))
                currentFile = exp.file
            }
            
            let output = `  L${exp.line.toString().padStart(4)}: ${exp.type.padEnd(15)} ${exp.name}`
            
            // Add export type indicator
            if (exp.exportType === 'default') output += ' [DEFAULT]'
            else if (exp.exportType === 'namespace') output += ' [NAMESPACE]'
            
            // Add type parameters
            if (exp.typeParams) {
                output += `<${exp.typeParams.join(', ')}>`
            }
            
            // Add extends clause
            if (exp.extends && exp.extends.length > 0) {
                output += ` extends ${exp.extends.join(', ')}`
            }
            
            // Add implements clause
            if (exp.implements && exp.implements.length > 0) {
                output += ` implements ${exp.implements.join(', ')}`
            }
            
            // Add function signature
            if (exp.parameters) {
                output += `(${exp.parameters.join(', ')})`
            }
            
            // Add return type
            if (exp.returnType) {
                output += `: ${exp.returnType}`
            }
            
            console.log(output)
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
    
    // Save to JSON file for further analysis
    const exports = analyzer.getExports()
    const outputPath = join(process.cwd(), 'export-analysis.json')
    await fs.promises.writeFile(outputPath, JSON.stringify(exports, null, 2))
    console.log(`\nDetailed export data saved to: ${outputPath}`)
}

main().catch(console.error)