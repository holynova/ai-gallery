import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.join(__dirname, '../public/images');
const THUMB_WIDTH = 400;
const THUMB_QUALITY = 80;

async function generateThumbnails() {
  const files = fs.readdirSync(IMAGES_DIR).filter(f => 
    f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png')
  );

  console.log(`Found ${files.length} images to process`);

  for (const file of files) {
    const inputPath = path.join(IMAGES_DIR, file);
    const outputPath = path.join(IMAGES_DIR, file.replace(/(\.[^.]+)$/, '_thumb$1'));

    try {
      await sharp(inputPath)
        .resize(THUMB_WIDTH, null, { withoutEnlargement: true })
        .jpeg({ quality: THUMB_QUALITY })
        .toFile(outputPath);
      
      const originalSize = fs.statSync(inputPath).size;
      const thumbSize = fs.statSync(outputPath).size;
      console.log(`✓ ${file} (${(originalSize/1024).toFixed(0)}KB → ${(thumbSize/1024).toFixed(0)}KB)`);
    } catch (err) {
      console.error(`✗ Failed to process ${file}:`, err.message);
    }
  }

  console.log('Thumbnail generation complete!');
}

generateThumbnails();
