/**
 * Pre-encode the testimonial screenshots.
 *
 * The originals are iPhone screenshots: large JPEGs at up to 1137x1197, far
 * more pixels than the card (a ~370x300 slot) or the modal (a 480px panel)
 * will ever show. Re-encoding them once, here, means Next's optimizer starts
 * from a small WebP instead of transcoding a heavy JPEG on every cold request.
 *
 * Quality 82 rather than the usual 75: these are screenshots of text, and text
 * is where WebP artefacts show first.
 *
 * Also emits a tiny blurred base64 for each, used as the `blurDataURL`
 * placeholder so a card never renders as an empty navy rectangle.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC_DIR = path.join(process.cwd(), 'public', 'Client Testimonials');
const OUT_DIR = path.join(process.cwd(), 'public', 'testimonials');

/** Longest edge, in px. Covers a 480px modal panel at 2x. */
const MAX_EDGE = 1000;

const FILES = [
  ['IMG_3513.JPG', 'testimonial-1.webp'],
  ['IMG_3514.JPG', 'testimonial-2.webp'],
  ['IMG_3512.JPG', 'testimonial-3.webp'],
  ['IMG_3511.JPG', 'testimonial-4.webp'],
];

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const manifest = [];

  for (const [src, out] of FILES) {
    const srcPath = path.join(SRC_DIR, src);
    const outPath = path.join(OUT_DIR, out);
    const before = fs.statSync(srcPath).size;

    await sharp(srcPath)
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 })
      .toFile(outPath);

    const meta = await sharp(outPath).metadata();
    const after = fs.statSync(outPath).size;

    // 12px wide blur seed, enough for a soft colour wash, ~200 bytes of base64.
    const blur = await sharp(srcPath).resize(12).webp({ quality: 40 }).toBuffer();

    manifest.push({
      out,
      width: meta.width,
      height: meta.height,
      blurDataURL: `data:image/webp;base64,${blur.toString('base64')}`,
    });

    console.log(
      `${src} -> ${out}  ${meta.width}x${meta.height}  ` +
        `${(before / 1024).toFixed(0)}kb -> ${(after / 1024).toFixed(0)}kb  ` +
        `(${Math.round((1 - after / before) * 100)}% smaller)`
    );
  }

  fs.writeFileSync(
    path.join(OUT_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('\nmanifest written to public/testimonials/manifest.json');
})();
