import { useState, useMemo, useCallback, useEffect } from 'react';
import type { GalleryImage, Folder, SortOption } from '../types/gallery';

export interface UseGalleryOptions {
  images?: GalleryImage[];
  initialFolder?: string | null;
  initialSort?: SortOption;
}

export interface UseGalleryReturn {
  images: GalleryImage[];
  filteredImages: GalleryImage[];
  folders: Folder[];
  selectedFolder: string | null;
  sortBy: SortOption;
  searchQuery: string;
  isLoading: boolean;
  selectFolder: (folderId: string | null) => void;
  setSortBy: (sort: SortOption) => void;
  setSearchQuery: (query: string) => void;
  setImages: (images: GalleryImage[]) => void;
  setLoading: (loading: boolean) => void;
  getImagesByFolder: (folderId: string | null) => GalleryImage[];
}

export function useGallery(options: UseGalleryOptions = {}): UseGalleryReturn {
  const { images: initialImages = [], initialFolder = null, initialSort = 'date-desc' } = options;

  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(initialFolder);
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const folders = useMemo<Folder[]>(() => {
    const folderMap = new Map<string, Folder>();
    
    images.forEach(img => {
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
  }, [images]);

  const sortImages = useCallback((imgs: GalleryImage[], sort: SortOption): GalleryImage[] => {
    return [...imgs].sort((a, b) => {
      switch (sort) {
        case 'name-asc':
          return (a.name || a.alt || '').localeCompare(b.name || b.alt || '');
        case 'name-desc':
          return (b.name || b.alt || '').localeCompare(a.name || a.alt || '');
        case 'date-asc':
          return (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0);
        case 'date-desc':
          return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
        case 'size-asc':
          return (a.width || 0) * (a.height || 0) - (b.width || 0) * (b.height || 0);
        case 'size-desc':
          return (b.width || 0) * (b.height || 0) - (a.width || 0) * (a.height || 0);
        default:
          return 0;
      }
    });
  }, []);

  const filteredImages = useMemo(() => {
    let result = images;

    // Filter by folder
    if (selectedFolder) {
      result = result.filter(img => img.folder === selectedFolder);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(img => 
        (img.name?.toLowerCase().includes(query)) ||
        (img.alt?.toLowerCase().includes(query)) ||
        (img.tags?.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // Sort
    return sortImages(result, sortBy);
  }, [images, selectedFolder, sortBy, searchQuery, sortImages]);

  const selectFolder = useCallback((folderId: string | null) => {
    setSelectedFolder(folderId);
  }, []);

  const getImagesByFolder = useCallback((folderId: string | null): GalleryImage[] => {
    if (folderId === null) {
      return images;
    }
    return images.filter(img => img.folder === folderId);
  }, [images]);

  return {
    images,
    filteredImages,
    folders,
    selectedFolder,
    sortBy,
    searchQuery,
    isLoading,
    selectFolder,
    setSortBy,
    setSearchQuery,
    setImages,
    setLoading,
    getImagesByFolder,
  };
}
