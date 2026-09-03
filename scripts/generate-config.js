import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, '../public/images');

const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.jpg') && !f.includes('_thumb'));

const images = files
  .sort()
  .map(filename => {
    const id = `img-${filename.split('_').pop().replace('.jpg', '')}`;
    const thumbFilename = filename.replace(/(\.[^.]+)$/, '_thumb$1');
    return { 
      id, 
      name: filename, 
      src: `images/${filename}`,
      thumbnail: `images/${thumbFilename}`,
      folder: 'default' 
    };
  });

const config = { images };
fs.writeFileSync(path.join(imagesDir, 'config.json'), JSON.stringify(config, null, 2));

console.log(`Generated config.json with ${images.length} images`);
