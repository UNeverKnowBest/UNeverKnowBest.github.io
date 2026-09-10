import fs from 'node:fs';
import path from 'node:path';

const raw = process.argv.slice(2).join(' ').trim();
if (!raw) {
  console.error('Usage: npm run new:plugin -- "section-id"');
  process.exit(1);
}

const id = raw
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const title = id.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
const dir = 'src/components/home/plugins';
const file = path.join(dir, `${id}.astro`);

if (fs.existsSync(file)) {
  console.error(`Already exists: ${file}`);
  process.exit(1);
}

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(file, `---\nimport SectionHeading from '../../shared/SectionHeading.astro';\n---\n<section class="home-section shell section-grid">\n  <div class="section-label"><span class="section-kicker">+</span></div>\n  <div class="section-content">\n    <SectionHeading title="${title}" />\n    <p>Replace this with your section content.</p>\n  </div>\n</section>\n`, 'utf8');

console.log(`Created ${file}`);
console.log(`Enable it in src/config/home.ts with: { id: '${id}', enabled: true },`);
