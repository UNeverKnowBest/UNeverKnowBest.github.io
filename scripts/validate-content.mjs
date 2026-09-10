import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];
const warnings = [];

function rel(...parts) {
  return path.join(root, ...parts);
}

function filesIn(dir, ext = '.md') {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((name) => name.endsWith(ext))
    .map((name) => path.join(dir, name));
}

function frontmatter(file) {
  const text = fs.readFileSync(file, 'utf8');
  const match = text.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) {
    errors.push(`${path.relative(root, file)}: missing frontmatter`);
    return '';
  }
  return match[1];
}

function requireKeys(file, keys) {
  const fm = frontmatter(file);
  for (const key of keys) {
    if (!new RegExp(`^${key}:`, 'm').test(fm)) {
      errors.push(`${path.relative(root, file)}: missing '${key}'`);
    }
  }
  return fm;
}

const schemas = [
  ['src/content/publications', ['title', 'year', 'authors', 'venue', 'summary', 'featured', 'order', 'links']],
  ['src/content/gallery', ['title', 'location', 'year', 'date', 'image', 'alt', 'category', 'featured', 'order', 'aspect']],
  ['src/content/notes', ['title', 'description', 'date', 'tags', 'featured', 'draft']],
  ['src/content/logs', ['date', 'draft']],
  ['src/content/work', ['title', 'year', 'summary', 'featured', 'order']],
];

for (const [dir, keys] of schemas) {
  for (const file of filesIn(rel(dir))) requireKeys(file, keys);
}

for (const file of filesIn(rel('src/content/gallery'))) {
  const fm = frontmatter(file);
  const image = fm.match(/^image:\s*["']?([^"'\n]+)["']?/m)?.[1]?.trim();
  if (!image) continue;
  const diskPath = rel('public', image.replace(/^\//, ''));
  if (!fs.existsSync(diskPath)) {
    errors.push(`${path.relative(root, file)}: image does not exist: ${image}`);
  }
  const alt = fm.match(/^alt:\s*["']?([^"'\n]+)["']?/m)?.[1]?.trim();
  if (!alt || alt.length < 12) {
    errors.push(`${path.relative(root, file)}: alt text is missing or too short`);
  }
}

const homeConfig = fs.readFileSync(rel('src/config/home.ts'), 'utf8');
const enabledIds = [...homeConfig.matchAll(/^\s*\{\s*id:\s*['"]([^'"]+)['"],\s*enabled:\s*true\s*\},?\s*$/gm)].map((m) => m[1]);
for (const id of enabledIds) {
  const plugin = rel('src/components/home/plugins', `${id}.astro`);
  if (!fs.existsSync(plugin)) errors.push(`Enabled homepage plugin is missing: ${id}`);
}

const requiredRoutes = [
  'src/pages/index.astro',
  'src/pages/cv.astro',
  'src/pages/404.astro',
];
for (const route of requiredRoutes) {
  if (!fs.existsSync(rel(route))) errors.push(`Missing route: ${route}`);
}

for (const route of ['gallery/index.astro', 'notes/index.astro', 'notes/[id].astro', 'logs/index.astro', 'publications/index.astro']) {
  if (fs.existsSync(rel('src/pages', route))) errors.push(`Retired route still exposed: ${route}`);
}

const siteConfig = fs.readFileSync(rel('src/config/site.ts'), 'utf8');
if (siteConfig.includes('YOUR_USERNAME')) warnings.push('Replace YOUR_USERNAME before publishing.');
if (siteConfig.includes('YOUR_EMAIL')) warnings.push('Replace YOUR_EMAIL before publishing.');

const sceneConfig = fs.readFileSync(rel('src/config/atmosphere.ts'), 'utf8');
for (const match of sceneConfig.matchAll(/['"](\/images\/[^'"]+\.webp)['"]/g)) {
  const asset = rel('public', match[1].slice(1));
  if (!fs.existsSync(asset)) errors.push(`Missing atmospheric asset: ${match[1]}`);
  else if (fs.statSync(asset).size > 350 * 1024) errors.push(`Atmospheric asset exceeds 350 KB: ${match[1]}`);
}

const publicRoot = rel('public');
const unexpectedDecor = ['books', 'book-stack', 'teapot', 'branch', 'shoji', 'vase'];
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
for (const file of walk(publicRoot)) {
  const name = path.basename(file).toLowerCase();
  if (unexpectedDecor.some((word) => name.includes(word))) {
    errors.push(`Decorative object asset should not be present: ${path.relative(root, file)}`);
  }
}

if (errors.length) {
  console.error('\nValidation failed:\n');
  for (const error of errors) console.error(`  ✗ ${error}`);
  process.exit(1);
}

console.log(`✓ Content schemas checked across ${schemas.reduce((n, [d]) => n + filesIn(rel(d)).length, 0)} entries`);
console.log(`✓ ${enabledIds.length} enabled homepage plugins have matching components`);
console.log(`✓ ${requiredRoutes.length} required routes are present`);
console.log('✓ Gallery image references and alt text are valid');
console.log('✓ No forbidden decorative-object assets detected');
for (const warning of warnings) console.log(`! ${warning}`);
