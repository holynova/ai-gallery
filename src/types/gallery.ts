export interface GalleryImage {
  id: string;
  src: string;
  thumbnail?: string;
  alt?: string;
  width?: number;
  height?: number;
  folder?: string;
  tags?: string[];
  createdAt?: Date;
  name?: string;
}

export interface Folder {
  id: string;
  name: string;
  path?: string;
  count?: number;
}

export type SortOption = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc' | 'size-asc' | 'size-desc';
export type SortLabel = 'Name (A-Z)' | 'Name (Z-A)' | 'Date (Oldest)' | 'Date (Newest)' | 'Size (Small)' | 'Size (Large)';

export interface GalleryState {
  images: GalleryImage[];
  folders: Folder[];
  selectedFolder: string | null;
  sortBy: SortOption;
  searchQuery: string;
  isLoading: boolean;
}
