import { useState, useCallback, useEffect, useMemo } from 'react';
import type { GalleryImage } from '../types/gallery';

export interface UseLightboxReturn {
  isOpen: boolean;
  currentImage: GalleryImage | null;
  currentIndex: number;
  images: GalleryImage[];
  open: (image: GalleryImage | string, images?: GalleryImage[]) => void;
  close: () => void;
  goToNext: () => void;
  goToPrevious: () => void;
  goToIndex: (index: number) => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export function useLightbox(): UseLightboxReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<GalleryImage[]>([]);

  const currentImage = useMemo<GalleryImage | null>(() => {
    if (!isOpen || images.length === 0) return null;
    return images[currentIndex] || null;
  }, [isOpen, images, currentIndex]);

  const hasNext = currentIndex < images.length - 1;
  const hasPrevious = currentIndex > 0;

  const open = useCallback((image: GalleryImage | string, imageList: GalleryImage[] = []) => {
    let targetImages: GalleryImage[] = imageList;
    let targetIndex = 0;

    if (typeof image === 'string') {
      // Opening by ID or src
      if (imageList.length > 0) {
        targetImages = imageList;
        targetIndex = imageList.findIndex(img => img.id === image || img.src === image);
        if (targetIndex === -1) targetIndex = 0;
      }
    } else {
      // Opening by GalleryImage object
      if (imageList.length > 0) {
        targetImages = imageList;
        targetIndex = imageList.findIndex(img => img.id === image.id);
        if (targetIndex === -1) {
          targetImages = [image, ...imageList];
          targetIndex = 0;
        }
      } else {
        targetImages = [image];
        targetIndex = 0;
      }
    }

    setImages(targetImages);
    setCurrentIndex(targetIndex);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const goToNext = useCallback(() => {
    if (hasNext) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [hasNext]);

  const goToPrevious = useCallback(() => {
    if (hasPrevious) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [hasPrevious]);

  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index);
    }
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          close();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close, goToNext, goToPrevious]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  return {
    isOpen,
    currentImage,
    currentIndex,
    images,
    open,
    close,
    goToNext,
    goToPrevious,
    goToIndex,
    hasNext,
    hasPrevious,
  };
}
