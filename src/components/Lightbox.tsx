import { X, ChevronLeft, ChevronRight, Download, ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { GalleryImage } from '../types/gallery';
import type { RatingType } from '../hooks/useImageRatings';

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
  rating?: RatingType;
  onLike?: () => void;
  onDislike?: () => void;
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
  rating,
  onLike,
  onDislike,
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

  const handleLike = () => {
    // Fire confetti effect
    const rect = document.querySelector('.lightbox-content')?.getBoundingClientRect();
    if (rect) {
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { x, y },
        colors: ['#22c55e', '#fbbf24', '#f472b6', '#60a5fa'],
      });
    }
    onLike?.();
  };

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button
        className="lightbox-close"
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
        <div className="lightbox-bottom-bar">
          <div className="lightbox-info">
            {image.name && <p className="lightbox-title">{image.name}</p>}
            {image.alt && <p className="lightbox-alt">{image.alt}</p>}
            <p className="lightbox-counter">{currentIndex + 1} / {images.length}</p>
          </div>
          <div className="lightbox-buttons">
            <button
              className={`lightbox-btn ${rating === 'like' ? 'active like' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              title="Like"
            >
              <ThumbsUp size={20} />
              <span>Like</span>
            </button>
            <button
              className={`lightbox-btn ${rating === 'dislike' ? 'active dislike' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onDislike?.();
              }}
              title="Dislike"
            >
              <ThumbsDown size={20} />
              <span>Dislike</span>
            </button>
            <button
              className="lightbox-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              title="Download"
            >
              <Download size={20} />
              <span>Download</span>
            </button>
            {image.src.startsWith('http') && (
              <button
                className="lightbox-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(image.src, '_blank');
                }}
                title="Open original"
              >
                <ExternalLink size={20} />
                <span>Open</span>
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
