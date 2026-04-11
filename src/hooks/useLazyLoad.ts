import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export interface UseLazyLoadReturn {
  isLoaded: boolean;
  isInView: boolean;
  ref: React.RefObject<HTMLDivElement | null>;
  setImageSrc: (src: string) => void;
  imageSrc: string | null;
}

export function useLazyLoad<T extends HTMLElement = HTMLDivElement>(
  options: UseLazyLoadOptions = {}
): UseLazyLoadReturn & { ref: React.RefObject<T | null> } {
  const { threshold = 0.1, rootMargin = '50px', triggerOnce = true } = options;
  
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);
  const [isLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (triggerOnce) {
              observer.unobserve(element);
            }
          } else if (!triggerOnce) {
            setIsInView(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return {
    isLoaded,
    isInView,
    ref,
    setImageSrc,
    imageSrc,
  } as UseLazyLoadReturn & { ref: React.RefObject<T | null> };
}

export interface LazyImageProps {
  src: string;
  placeholderSrc?: string;
  alt?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
  threshold?: number;
  rootMargin?: string;
}

export function useLazyImage(options: { threshold?: number; rootMargin?: string } = {}) {
  const { threshold = 0.1, rootMargin = '50px' } = options;
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.unobserve(element);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setIsError(true);
  }, []);

  return {
    containerRef,
    isLoaded,
    isError,
    shouldLoad,
    currentSrc,
    setCurrentSrc,
    handleLoad,
    handleError,
  };
}
