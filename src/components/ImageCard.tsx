import { useState, useRef, useEffect } from 'react';
import type { GalleryImage } from '../types/gallery';

interface ImageCardProps {
  image: GalleryImage;
  onClick: () => void;
  onDelete?: (id: string) => void;
}

export function ImageCard({ image, onClick, onDelete }: ImageCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      setIsDeleting(true);
      setTimeout(() => {
        onDelete(image.id);
      }, 200);
    }
  };

  return (
    <div
      ref={ref}
      className={`image-card ${isDeleting ? 'opacity-50 scale-95' : ''}`}
      onClick={onClick}
    >
      {isInView ? (
        <>
          {!isLoaded && <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />}
          <img
            src={image.src}
            alt={image.alt || image.name || 'Gallery image'}
            onLoad={() => setIsLoaded(true)}
            style={{ opacity: isLoaded ? 1 : 0 }}
          />
        </>
      ) : (
        <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />
      )}

      <div className="overlay">
        <div className="flex justify-between items-end" style={{ width: '100%' }}>
          <div style={{ color: 'white' }}>
            {image.name && (
              <p style={{ fontWeight: 500, margin: 0, fontSize: '0.875rem' }}>{image.name}</p>
            )}
            {image.createdAt && (
              <p style={{ fontSize: '0.75rem', opacity: 0.8, margin: '0.25rem 0 0' }}>
                {new Date(image.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
          {onDelete && (
            <button
              onClick={handleDelete}
              className="btn btn-secondary"
              style={{
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                background: 'rgba(239, 68, 68, 0.9)',
                color: 'white',
                border: 'none',
              }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
