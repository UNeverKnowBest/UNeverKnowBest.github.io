import fs from 'node:fs';
import path from 'node:path';

const [kind, ...nameParts] = process.argv.slice(2);
const title = nameParts.join(' ').trim();

const slugify = (value) => value
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || `entry-${Date.now()}`;

const today = new Date().toISOString().slice(0, 10);
const year = new Date().getFullYear();
const slug = slugify(title || `${kind}-${today}`);

const specs = {
  publication: {
    dir: 'src/content/publications',
    body: `---\ntitle: "${title || 'Publication title'}"\nyear: ${year}\nauthors:\n  - "Hugo Yu"\nvenue: "Venue / status"\nsummary: "One concise sentence about the contribution."\nfeatured: false\norder: 0\nlinks:\n  paper: ""\n  code: ""\n  poster: ""\n---\n\nOptional notes.\n`,
  },
  gallery: {
    dir: 'src/content/gallery',
    body: `---\ntitle: "${title || 'Photograph title'}"\nlocation: "Place"\nyear: ${year}\ndate: ${today}\nimage: "/gallery/${slug}.jpg"\nalt: "Describe the photograph for someone who cannot see it."\ncategory: "quiet"\nfeatured: false\norder: 0\naspect: "landscape"\n---\n\nOptional note about the photograph.\n`,
    extra: `\nThen copy your image to: public/gallery/${slug}.jpg`,
  },
  note: {
    dir: 'src/content/notes',
    body: `---\ntitle: "${title || 'Note title'}"\ndescription: "One-sentence description."\ndate: ${today}\ntags: []\nfeatured: false\ndraft: true\n---\n\nStart writing here.\n`,
  },
  log: {
    dir: 'src/content/logs',
    body: `---\ndate: ${today}\ntitle: "${title}"\ndraft: true\n---\n\nA short record.\n`,
  },
};

if (!specs[kind]) {
  console.error('Usage: node scripts/new-content.mjs <publication|gallery|note|log> "Title"');
  process.exit(1);
}

const spec = specs[kind];
fs.mkdirSync(spec.dir, { recursive: true });
const file = path.join(spec.dir, `${slug}.md`);
if (fs.existsSync(file)) {
  console.error(`Already exists: ${file}`);
  process.exit(1);
}
fs.writeFileSync(file, spec.body, 'utf8');
console.log(`Created ${file}${spec.extra ?? ''}`);
