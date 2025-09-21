import fs from 'node:fs/promises';
import sharp from 'sharp';

const src = new URL('../public/favicon.svg', import.meta.url);
const outDir = new URL('../public/icons/', import.meta.url);

await fs.mkdir(outDir, { recursive: true });

const targets = [
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 }
];

const buf = await fs.readFile(src);

await Promise.all(
  targets.map(async ({ name, size }) => {
    const file = new URL(name, outDir);
    const png = await sharp(buf, { density: 384 })
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toBuffer();
    await fs.writeFile(file, png);
    console.log('Wrote', file.pathname);
  })
);

console.log('Icons generated successfully.');
