import { X, ChevronLeft, ChevronRight, Download, ExternalLink } from 'lucide-react';
import type { GalleryImage } from '../types/gallery';

interface LightboxProps {
  isOpen: boolean;
  image: GalleryImage | null;
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export function Lightbox({
  isOpen,
  image,
  images,
  currentIndex,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: LightboxProps) {
  if (!isOpen || !image) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.src;
    link.download = image.name || `image-${image.id}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button
        className="lightbox-close lightbox-nav"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X size={24} />
      </button>

      {hasPrevious && (
        <button
          className="lightbox-nav prev"
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
        >
          <ChevronLeft size={28} />
        </button>
      )}

      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img
          src={image.src}
          alt={image.alt || image.name || 'Gallery image'}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1rem',
            color: 'white',
          }}
        >
          <div>
            {image.name && <p style={{ margin: 0, fontWeight: 500 }}>{image.name}</p>}
            {image.alt && (
              <p style={{ margin: '0.25rem 0 0', opacity: 0.7, fontSize: '0.875rem' }}>
                {image.alt}
              </p>
            )}
            <p style={{ margin: '0.25rem 0 0', opacity: 0.5, fontSize: '0.75rem' }}>
              {currentIndex + 1} / {images.length}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="lightbox-nav"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              title="Download"
            >
              <Download size={20} />
            </button>
            {image.src.startsWith('http') && (
              <button
                className="lightbox-nav"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(image.src, '_blank');
                }}
                title="Open original"
              >
                <ExternalLink size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {hasNext && (
        <button
          className="lightbox-nav next"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
        >
          <ChevronRight size={28} />
        </button>
      )}
    </div>
  );
}
