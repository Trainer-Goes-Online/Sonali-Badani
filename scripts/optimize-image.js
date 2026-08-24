/**
 * Optimize a single image for the web.
 *
 *   node scripts/optimize-image.js <path-under-public> [maxWidth] [quality]
 *   node scripts/optimize-image.js Section-Images/sonali-new-oto-image.png 1400 82
 *
 * Writes a .webp next to the original and prints the saving. Marketing
 * creatives are exported at print resolution and routinely arrive at several
 * megabytes; Next can resize them on the fly, but starting from a smaller
 * source keeps the first encode fast and the origin file light.
 *
 * Quality 82 rather than the usual 75, because these creatives carry small
 * text and text is where WebP artefacts show first.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const [, , rel, maxWidthArg, qualityArg] = process.argv;

if (!rel) {
  console.error('Usage: node scripts/optimize-image.js <path-under-public> [maxWidth] [quality]');
  process.exit(1);
}

const maxWidth = Number(maxWidthArg) || 1400;
const quality = Number(qualityArg) || 82;

const src = path.join(process.cwd(), 'public', rel);
const out = src.replace(/\.(png|jpe?g)$/i, '.webp');

(async () => {
  const before = fs.statSync(src).size;

  await sharp(src)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(out);

  const meta = await sharp(out).metadata();
  const after = fs.statSync(out).size;

  console.log(
    `${rel}\n  -> ${path.relative(path.join(process.cwd(), 'public'), out).replace(/\\/g, '/')}` +
      `  ${meta.width}x${meta.height}` +
      `  ${(before / 1024).toFixed(0)}kb -> ${(after / 1024).toFixed(0)}kb` +
      `  (${Math.round((1 - after / before) * 100)}% smaller)`
  );
})();
