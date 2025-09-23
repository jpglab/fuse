#!/usr/bin/env tsx

import { readdir, readFile } from 'fs/promises';
import { join, relative } from 'path';
import * as ts from 'typescript';

interface ExportInfo {
  name: string;
  kind: string;
  file: string;
  line: number;
  isDefault: boolean;
  typeParams?: string[];
  extends?: string[];
  implements?: string[];
  parameters?: string[];
  returnType?: string;
}

const SRC_DIR = join(process.cwd(), 'src');

async function getAllTypeScriptFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getAllTypeScriptFiles(fullPath)));
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      files.push(fullPath);
    }
  }

  return files;
}

function getNodeKind(node: ts.Node): string {
  switch (node.kind) {
    case ts.SyntaxKind.ClassDeclaration: return 'class';
    case ts.SyntaxKind.InterfaceDeclaration: return 'interface';
    case ts.SyntaxKind.TypeAliasDeclaration: return 'type';
    case ts.SyntaxKind.FunctionDeclaration: return 'function';
    case ts.SyntaxKind.VariableStatement: return 'variable';
    case ts.SyntaxKind.EnumDeclaration: return 'enum';
    case ts.SyntaxKind.ModuleDeclaration: return 'namespace';
    default: return 'unknown';
  }
}

function extractExports(sourceFile: ts.SourceFile, filePath: string): ExportInfo[] {
  const exports: ExportInfo[] = [];
  const relativeFile = relative(SRC_DIR, filePath);

  function visit(node: ts.Node) {
    const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
    const isExported = modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;
    const isDefault = modifiers?.some(m => m.kind === ts.SyntaxKind.DefaultKeyword) ?? false;

    if (isExported || isDefault) {
      const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
      let name = 'unknown';
      let kind = getNodeKind(node);
      let typeParams: string[] | undefined;
      let extendsClause: string[] | undefined;
      let implementsClause: string[] | undefined;
      let parameters: string[] | undefined;
      let returnType: string | undefined;

      if (ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node)) {
        name = node.name?.getText() || 'anonymous';
        
        if (node.typeParameters) {
          typeParams = node.typeParameters.map(p => p.getText());
        }

        if (ts.isClassDeclaration(node)) {
          if (node.heritageClauses) {
            for (const clause of node.heritageClauses) {
              if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
                extendsClause = clause.types.map(t => t.getText());
              } else if (clause.token === ts.SyntaxKind.ImplementsKeyword) {
                implementsClause = clause.types.map(t => t.getText());
              }
            }
          }
        } else if (ts.isInterfaceDeclaration(node)) {
          if (node.heritageClauses) {
            extendsClause = node.heritageClauses[0]?.types.map(t => t.getText());
          }
        }
      } else if (ts.isTypeAliasDeclaration(node)) {
        name = node.name.getText();
        if (node.typeParameters) {
          typeParams = node.typeParameters.map(p => p.getText());
        }
      } else if (ts.isFunctionDeclaration(node)) {
        name = node.name?.getText() || 'anonymous';
        if (node.typeParameters) {
          typeParams = node.typeParameters.map(p => p.getText());
        }
        if (node.parameters) {
          parameters = node.parameters.map(p => {
            const paramName = p.name?.getText() || 'unknown';
            const paramType = p.type ? `: ${p.type.getText()}` : '';
            return `${paramName}${paramType}`;
          });
        }
        if (node.type) {
          returnType = node.type.getText();
        }
      } else if (ts.isVariableStatement(node)) {
        const declaration = node.declarationList.declarations[0];
        if (declaration && ts.isIdentifier(declaration.name)) {
          name = declaration.name.getText();
          kind = declaration.initializer && ts.isArrowFunction(declaration.initializer) 
            ? 'arrow function' 
            : 'const/let/var';
        }
      } else if (ts.isEnumDeclaration(node)) {
        name = node.name?.getText() || 'anonymous';
      } else if (ts.isModuleDeclaration(node)) {
        name = node.name.getText();
      }

      if (ts.isExportDeclaration(node)) {
        if (node.exportClause && ts.isNamedExports(node.exportClause)) {
          for (const element of node.exportClause.elements) {
            exports.push({
              name: element.name.getText(),
              kind: 're-export',
              file: relativeFile,
              line,
              isDefault: false
            });
          }
        } else if (!node.exportClause) {
          exports.push({
            name: '*',
            kind: 're-export all',
            file: relativeFile,
            line,
            isDefault: false
          });
        }
      } else if (ts.isExportAssignment(node)) {
        exports.push({
          name: 'default',
          kind: 'default export',
          file: relativeFile,
          line,
          isDefault: true
        });
      } else {
        exports.push({
          name,
          kind,
          file: relativeFile,
          line,
          isDefault,
          typeParams,
          extends: extendsClause,
          implements: implementsClause,
          parameters,
          returnType
        });
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return exports;
}

async function main() {
  try {
    console.log('Scanning TypeScript files in src directory...\n');
    const files = await getAllTypeScriptFiles(SRC_DIR);
    console.log(`Found ${files.length} TypeScript files\n`);

    const allExports: ExportInfo[] = [];

    for (const file of files) {
      const content = await readFile(file, 'utf-8');
      const sourceFile = ts.createSourceFile(
        file,
        content,
        ts.ScriptTarget.Latest,
        true
      );

      const fileExports = extractExports(sourceFile, file);
      allExports.push(...fileExports);
    }

    console.log(`Total exports found: ${allExports.length}\n`);
    console.log('=' .repeat(120));

    const groupedByFile = allExports.reduce((acc, exp) => {
      if (!acc[exp.file]) acc[exp.file] = [];
      acc[exp.file].push(exp);
      return acc;
    }, {} as Record<string, ExportInfo[]>);

    for (const [file, exports] of Object.entries(groupedByFile)) {
      console.log(`\n📁 ${file}`);
      console.log('-'.repeat(100));
      
      for (const exp of exports) {
        let output = `  L${exp.line.toString().padStart(4)}: ${exp.isDefault ? '[DEFAULT] ' : ''}${exp.kind.toUpperCase().padEnd(15)} ${exp.name}`;
        
        if (exp.typeParams) {
          output += `<${exp.typeParams.join(', ')}>`;
        }
        
        if (exp.extends) {
          output += ` extends ${exp.extends.join(', ')}`;
        }
        
        if (exp.implements) {
          output += ` implements ${exp.implements.join(', ')}`;
        }
        
        if (exp.parameters) {
          output += `(${exp.parameters.join(', ')})`;
        }
        
        if (exp.returnType) {
          output += `: ${exp.returnType}`;
        }
        
        console.log(output);
      }
    }

    console.log('\n' + '='.repeat(120));
    console.log('\nSummary by type:');
    console.log('-'.repeat(40));
    
    const byKind = allExports.reduce((acc, exp) => {
      if (!acc[exp.kind]) acc[exp.kind] = 0;
      acc[exp.kind]++;
      return acc;
    }, {} as Record<string, number>);

    for (const [kind, count] of Object.entries(byKind).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${kind.padEnd(20)}: ${count}`);
    }

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();