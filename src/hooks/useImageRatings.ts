import { useState, useEffect, useCallback } from 'react';

export type RatingType = 'like' | 'dislike' | null;

export interface ImageRatings {
  [imageId: string]: RatingType;
}

const STORAGE_KEY = 'ai-gallery-ratings';

export function useImageRatings() {
  const [ratings, setRatings] = useState<ImageRatings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Persist to localStorage whenever ratings change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
    } catch (e) {
      console.warn('Failed to save ratings to localStorage:', e);
    }
  }, [ratings]);

  const getRating = useCallback((imageId: string): RatingType => {
    return ratings[imageId] || null;
  }, [ratings]);

  const setRating = useCallback((imageId: string, rating: RatingType) => {
    setRatings(prev => {
      // If clicking the same rating, remove it (toggle off)
      if (prev[imageId] === rating) {
        const next = { ...prev };
        delete next[imageId];
        return next;
      }
      return { ...prev, [imageId]: rating };
    });
  }, []);

  const toggleLike = useCallback((imageId: string) => {
    setRating(imageId, ratings[imageId] === 'like' ? null : 'like');
  }, [ratings, setRating]);

  const toggleDislike = useCallback((imageId: string) => {
    setRating(imageId, ratings[imageId] === 'dislike' ? null : 'dislike');
  }, [ratings, setRating]);

  const getLikedImages = useCallback((): string[] => {
    return Object.entries(ratings)
      .filter(([, value]) => value === 'like')
      .map(([key]) => key);
  }, [ratings]);

  const getDislikedImages = useCallback((): string[] => {
    return Object.entries(ratings)
      .filter(([, value]) => value === 'dislike')
      .map(([key]) => key);
  }, [ratings]);

  const getLikeCount = useCallback((): number => {
    return Object.values(ratings).filter(v => v === 'like').length;
  }, [ratings]);

  const getDislikeCount = useCallback((): number => {
    return Object.values(ratings).filter(v => v === 'dislike').length;
  }, [ratings]);

  return {
    ratings,
    getRating,
    setRating,
    toggleLike,
    toggleDislike,
    getLikedImages,
    getDislikedImages,
    getLikeCount,
    getDislikeCount,
  };
}
