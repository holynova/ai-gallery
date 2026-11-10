import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, '../public/images');

const files = fs.readdirSync(imagesDir).filter(f => /\.(jpe?g|png)$/i.test(f) && !f.includes('_thumb'));
const previous = fs.existsSync(path.join(imagesDir, 'config.json'))
  ? JSON.parse(fs.readFileSync(path.join(imagesDir, 'config.json'), 'utf8')).images
  : [];
const originals = previous.filter(image => files.includes(image.name));
const idCounts = new Map();
for (const image of originals) idCounts.set(image.id, (idCounts.get(image.id) || 0) + 1);
const previousByName = new Map(originals.map(image => [image.name, image]));

const images = files
  .sort()
  .map(filename => {
    const old = previousByName.get(filename);
    const id = old && idCounts.get(old.id) === 1
      ? old.id
      : `img-${path.parse(filename).name}`;
    const thumbFilename = `${path.parse(filename).name}_thumb.jpg`;
    return { 
      id, 
      name: filename, 
      src: `images/${filename}`,
      thumbnail: `images/${thumbFilename}`,
      folder: old?.folder || 'default'
    };
  });

const config = { images };
fs.writeFileSync(path.join(imagesDir, 'config.json'), JSON.stringify(config, null, 2));

console.log(`Generated config.json with ${images.length} images`);
