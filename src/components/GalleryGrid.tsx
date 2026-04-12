import { ImageIcon } from 'lucide-react';
import type { GalleryImage } from '../types/gallery';
import { ImageCard } from './ImageCard';

interface GalleryGridProps {
  images: GalleryImage[];
  onImageClick: (image: GalleryImage, index: number) => void;
  onImageDelete?: (id: string) => void;
}

export function GalleryGrid({ images, onImageClick, onImageDelete }: GalleryGridProps) {
  if (images.length === 0) {
    return (
      <div className="empty-state">
        <ImageIcon />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0.5rem 0' }}>No images yet</h3>
        <p>Upload some images to get started</p>
      </div>
    );
  }

  return (
    <div className="gallery-grid">
      {images.map((image, index) => (
        <ImageCard
          key={image.src}
          image={image}
          onClick={() => onImageClick(image, index)}
          onDelete={onImageDelete}
        />
      ))}
    </div>
  );
}
