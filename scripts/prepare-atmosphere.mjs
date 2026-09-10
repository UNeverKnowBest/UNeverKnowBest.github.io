// Web delivery optimization only; artistic edits are made with the imagegen tool.
// Usage: node scripts/prepare-atmosphere.mjs hero.png about.png connect.png
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
const inputs = process.argv.slice(2);
if (inputs.length !== 3) throw new Error('Provide the hero, about, and connect source image paths.');
await mkdir('public/images', { recursive: true });
for (const [i, name] of ['hero', 'about', 'connect'].entries()) {
  for (const [suffix, width, quality] of [['', 1920, 79], ['-small', 960, 76]]) {
    const path = `public/images/${name}-rain${suffix}.webp`;
    const result = await sharp(inputs[i]).resize({ width, withoutEnlargement: true }).webp({ quality, effort: 5 }).toFile(path);
    console.log(`${path}: ${Math.round(result.size / 1024)} KB, ${result.width} × ${result.height}`);
  }
}
