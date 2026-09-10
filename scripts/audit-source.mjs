import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let ts;
try {
  ts = require('typescript');
} catch {
  // Sandbox fallback used only when dependencies cannot be installed.
  ts = require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript');
}
const root = process.cwd();
const errors = [];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

for (const file of walk(path.join(root, 'src')).filter((f) => f.endsWith('.astro'))) {
  const text = fs.readFileSync(file, 'utf8');
  const match = text.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) {
    errors.push(`${path.relative(root, file)}: missing Astro frontmatter fence`);
    continue;
  }
  const result = ts.transpileModule(match[1], {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      verbatimModuleSyntax: true,
    },
    reportDiagnostics: true,
    fileName: file,
  });
  for (const diag of result.diagnostics ?? []) {
    const message = ts.flattenDiagnosticMessageText(diag.messageText, '\n');
    errors.push(`${path.relative(root, file)}: ${message}`);
  }

  const opening = (text.match(/<section\b/g) ?? []).length;
  const closing = (text.match(/<\/section>/g) ?? []).length;
  if (opening !== closing) errors.push(`${path.relative(root, file)}: section tag imbalance ${opening}/${closing}`);
  const articleOpen = (text.match(/<article\b/g) ?? []).length;
  const articleClose = (text.match(/<\/article>/g) ?? []).length;
  if (articleOpen !== articleClose) errors.push(`${path.relative(root, file)}: article tag imbalance ${articleOpen}/${articleClose}`);
}

for (const file of walk(path.join(root, 'src')).filter((f) => f.endsWith('.ts') && !f.endsWith('.d.ts'))) {
  const text = fs.readFileSync(file, 'utf8');
  const result = ts.transpileModule(text, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    reportDiagnostics: true,
    fileName: file,
  });
  for (const diag of result.diagnostics ?? []) {
    const message = ts.flattenDiagnosticMessageText(diag.messageText, '\n');
    errors.push(`${path.relative(root, file)}: ${message}`);
  }
}

if (errors.length) {
  console.error('Source audit failed:');
  errors.forEach((e) => console.error(`  ✗ ${e}`));
  process.exit(1);
}

console.log('✓ Astro frontmatter syntax transpiles');
console.log('✓ TypeScript source syntax transpiles');
console.log('✓ Core semantic tag pairs are balanced');
