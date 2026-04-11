import { create } from 'zustand';
import type { GalleryImage, SortOption } from '../types/gallery';

interface GalleryStore {
  images: GalleryImage[];
  sortBy: SortOption;
  viewMode: 'grid' | 'list';
  setImages: (images: GalleryImage[]) => void;
  setSortBy: (sort: SortOption) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
}

export const useGalleryStore = create<GalleryStore>()((set) => ({
  images: [],
  sortBy: 'date-desc',
  viewMode: 'grid',
  setImages: (images) => set({ images }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setViewMode: (mode) => set({ viewMode: mode }),
}));
