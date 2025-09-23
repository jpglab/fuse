import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

interface ExportInfo {
  name: string;
  kind: string;
  file: string;
  line: number;
  isDefault: boolean;
}

const exports: ExportInfo[] = [];

function getExportKind(node: ts.Node): string {
  if (ts.isInterfaceDeclaration(node)) return 'interface';
  if (ts.isTypeAliasDeclaration(node)) return 'type';
  if (ts.isClassDeclaration(node)) return 'class';
  if (ts.isFunctionDeclaration(node)) return 'function';
  if (ts.isVariableStatement(node)) return 'variable';
  if (ts.isEnumDeclaration(node)) return 'enum';
  if (ts.isModuleDeclaration(node)) return 'namespace';
  if (ts.isExportAssignment(node)) return 'export-assignment';
  if (ts.isExportDeclaration(node)) return 'export-declaration';
  return 'unknown';
}

function extractExports(sourceFile: ts.SourceFile, filePath: string) {
  const visit = (node: ts.Node) => {
    // Handle export declarations
    if (ts.isExportDeclaration(node)) {
      if (node.exportClause && ts.isNamedExports(node.exportClause)) {
        node.exportClause.elements.forEach(element => {
          const line = sourceFile.getLineAndCharacterOfPosition(element.getStart()).line + 1;
          exports.push({
            name: element.name.text,
            kind: 're-export',
            file: filePath,
            line,
            isDefault: false
          });
        });
      } else if (!node.exportClause && node.moduleSpecifier) {
        // export * from '...'
        const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
        exports.push({
          name: '* (all)',
          kind: 're-export-all',
          file: filePath,
          line,
          isDefault: false
        });
      }
    }

    // Handle export assignment (export = ...)
    if (ts.isExportAssignment(node)) {
      const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
      exports.push({
        name: 'default',
        kind: 'export-assignment',
        file: filePath,
        line,
        isDefault: true
      });
    }

    // Handle declarations with export modifier
    const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
    const hasExport = modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword);
    const hasDefault = modifiers?.some(m => m.kind === ts.SyntaxKind.DefaultKeyword);

    if (hasExport) {
      const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
      
      if (ts.isVariableStatement(node)) {
        node.declarationList.declarations.forEach(decl => {
          if (ts.isIdentifier(decl.name)) {
            exports.push({
              name: decl.name.text,
              kind: 'variable',
              file: filePath,
              line,
              isDefault: hasDefault
            });
          }
        });
      } else if (ts.isInterfaceDeclaration(node) || 
                 ts.isTypeAliasDeclaration(node) ||
                 ts.isClassDeclaration(node) ||
                 ts.isFunctionDeclaration(node) ||
                 ts.isEnumDeclaration(node)) {
        const name = node.name?.text || (hasDefault ? 'default' : 'anonymous');
        exports.push({
          name,
          kind: getExportKind(node),
          file: filePath,
          line,
          isDefault: hasDefault
        });
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
}

function processFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true
  );
  
  const relativePath = path.relative(process.cwd(), filePath);
  extractExports(sourceFile, relativePath);
}

function walkDirectory(dir: string) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      walkDirectory(fullPath);
    } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx')) && !file.endsWith('.d.ts')) {
      processFile(fullPath);
    }
  }
}

// Main execution
console.log('Analyzing exports in src directory...\n');
walkDirectory(path.join(process.cwd(), 'src'));

// Sort exports by file and line
exports.sort((a, b) => {
  if (a.file !== b.file) {
    return a.file.localeCompare(b.file);
  }
  return a.line - b.line;
});

// Group exports by file
const exportsByFile = new Map<string, ExportInfo[]>();
for (const exp of exports) {
  if (!exportsByFile.has(exp.file)) {
    exportsByFile.set(exp.file, []);
  }
  exportsByFile.get(exp.file)!.push(exp);
}

// Print results
console.log(`Found ${exports.length} total exports across ${exportsByFile.size} files\n`);
console.log('=' .repeat(80));

for (const [file, fileExports] of exportsByFile) {
  console.log(`\n📁 ${file}`);
  console.log('-'.repeat(80));
  
  for (const exp of fileExports) {
    const defaultTag = exp.isDefault ? ' [DEFAULT]' : '';
    console.log(`  L${exp.line.toString().padStart(4)}: ${exp.kind.padEnd(20)} ${exp.name}${defaultTag}`);
  }
}

// Summary statistics
const kindCounts = new Map<string, number>();
for (const exp of exports) {
  kindCounts.set(exp.kind, (kindCounts.get(exp.kind) || 0) + 1);
}

console.log('\n' + '='.repeat(80));
console.log('\n📊 Summary by type:');
console.log('-'.repeat(80));
for (const [kind, count] of Array.from(kindCounts.entries()).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${kind.padEnd(20)} ${count}`);
}