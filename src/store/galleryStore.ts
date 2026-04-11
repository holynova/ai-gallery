import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GalleryImage, Folder, SortOption } from '../types/gallery';

interface GalleryStore {
  // State
  images: GalleryImage[];
  folders: Folder[];
  selectedFolder: string | null;
  sortBy: SortOption;
  searchQuery: string;
  isLoading: boolean;
  viewMode: 'grid' | 'list';
  
  // Actions
  addImage: (image: GalleryImage) => void;
  addImages: (images: GalleryImage[]) => void;
  removeImage: (id: string) => void;
  updateImage: (id: string, updates: Partial<GalleryImage>) => void;
  selectFolder: (folderId: string | null) => void;
  setSortBy: (sort: SortOption) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  clearImages: () => void;
}

export const useGalleryStore = create<GalleryStore>()(
  persist(
    (set) => ({
      // Initial state
      images: [],
      folders: [],
      selectedFolder: null,
      sortBy: 'date-desc',
      searchQuery: '',
      isLoading: false,
      viewMode: 'grid',

      // Actions
      addImage: (image) =>
        set((state) => {
          const newImages = [...state.images, image];
          return {
            images: newImages,
            folders: calculateFolders(newImages),
          };
        }),

      addImages: (images) =>
        set((state) => {
          const newImages = [...state.images, ...images];
          return {
            images: newImages,
            folders: calculateFolders(newImages),
          };
        }),

      removeImage: (id) =>
        set((state) => {
          const newImages = state.images.filter((img) => img.id !== id);
          return {
            images: newImages,
            folders: calculateFolders(newImages),
          };
        }),

      updateImage: (id, updates) =>
        set((state) => {
          const newImages = state.images.map((img) =>
            img.id === id ? { ...img, ...updates } : img
          );
          return {
            images: newImages,
            folders: calculateFolders(newImages),
          };
        }),

      selectFolder: (folderId) => set({ selectedFolder: folderId }),

      setSortBy: (sort) => set({ sortBy: sort }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      setLoading: (loading) => set({ isLoading: loading }),

      setViewMode: (mode) => set({ viewMode: mode }),

      clearImages: () => set({ images: [], folders: [] }),
    }),
    {
      name: 'ai-gallery-storage',
      partialize: (state) => ({
        images: state.images,
        folders: state.folders,
        sortBy: state.sortBy,
        viewMode: state.viewMode,
      }),
    }
  )
);

// Helper function to calculate folders from images
function calculateFolders(images: GalleryImage[]): Folder[] {
  const folderMap = new Map<string, Folder>();

  images.forEach((img) => {
    const folderId = img.folder || 'uncategorized';
    const existing = folderMap.get(folderId);
    if (existing) {
      existing.count = (existing.count || 0) + 1;
    } else {
      folderMap.set(folderId, {
        id: folderId,
        name: folderId === 'uncategorized' ? 'Uncategorized' : folderId,
        count: 1,
      });
    }
  });

  return Array.from(folderMap.values());
}
