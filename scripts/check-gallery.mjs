import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imagesDir = path.join(root, 'public/images');
const originals = fs.readdirSync(imagesDir).filter(name => /\.(jpe?g|png)$/i.test(name) && !name.includes('_thumb'));
const { images } = JSON.parse(fs.readFileSync(path.join(imagesDir, 'config.json'), 'utf8'));
assert.equal(images.length, originals.length, 'Every original must have exactly one gallery entry');
assert.equal(new Set(images.map(image => image.id)).size, images.length, 'Image IDs must be unique');
assert.deepEqual(images.map(image => image.name).sort(), originals.sort(), 'Thumbnails must not appear as originals');
for (const image of images) {
  for (const key of ['src', 'thumbnail']) {
    assert.ok(image[key].startsWith('images/') && !image[key].includes('..'), 'Image URLs must work at either deployment base');
    const file = path.join(root, 'public', image[key]);
    assert.ok(fs.existsSync(file), `Missing ${key}: ${image[key]}`);
    assert.ok(fs.statSync(file).size <= 25 * 1024 * 1024, 'Asset exceeds the Workers per-file limit');
  }
  const thumbnail = fs.readFileSync(path.join(root, 'public', image.thumbnail));
  assert.equal(thumbnail.readUInt16BE(0), 0xffd8, 'Thumbnail must contain JPEG data');
}
console.log(`Verified ${images.length} originals, unique IDs, thumbnails, URLs and upload sizes.`);
